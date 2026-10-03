'use strict';
// Execute original enqueue, pop, collection and stamp routines. No game bytes
// are bundled. Native recipes are optional private output, not an upload format.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const crypto = require('crypto');
const {CPU} = require('../../../../kit/c64/cpu6502');
const args = process.argv.slice(2);
const option = key => { const i = args.indexOf(key); return i < 0 ? null : path.resolve(args[i + 1]); };
const disk = option('--disk-dir'), output = option('--report'), native = option('--native-cases');
if (!disk) throw Error('Use --disk-dir <original PRGs> [--report <JSON>] [--native-cases <private JSON>]');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'inputs.json')));
const files = new Map();
for (const name of ['INTRO.SYS', 'JUMPMAN', 'PLF10', 'PLF11']) {
  const data = fs.readFileSync(path.join(disk, name.toLowerCase() + '.prg'));
  assert.equal(crypto.createHash('sha256').update(data).digest('hex'), manifest.files.find(f => f.name === name).sha256);
  files.set(name, data.subarray(2));
}
const base = new Uint8Array(65536);
base.set(files.get('INTRO.SYS'), 0x2000); base.set(files.get('JUMPMAN'), 0x0800);
let calls = 0;
const recipes = [], report = {method: 'Controlled original instructions, IRQ masked, decimal clear, register-shadow I/O. Queue overload is forced, not established in ordinary gameplay.', queue: [], entries: []};
function make(id = '11') {
  const m = base.slice(); m.set(files.get('PLF' + id), 0x3000);
  const c = new CPU(m, {strict: true, port: 0x36, io: {read: a => m[a], write: (a, v) => { m[a] = v; }}});
  c.image = id; return c;
}
function call(c, entry, regs = {}, options = {}) { calls++; c.call(entry, {i: 1, d: 0, ...regs}, options); }
function observe(c, name, entry, stop, watch, action) {
  const before = c.m.slice(); action();
  if (!native) return;
  const original = make(c.image).m;
  recipes.push({name, image: c.image, entry, stop, regs: {},
    patches: Array.from(before.entries()).filter(([a, v]) => v !== original[a]),
    watch: watch.map(([address, n]) => ({address, bytes: Array.from(c.m.slice(address, address + n))}))});
}
function push(c, i) {
  const y = i % 18; c.m[0xfb] = 0x9a; c.m[0xfc] = 0x31;
  const expected = [1, 0x31, 0x9a, c.m[0x31a1 + y], c.m[0x31b3 + y], y];
  call(c, 0x3462, {a: 1, y}); return expected;
}
function fieldsAtPop(c) {
  return [c.a, c.m[0x4001], c.m[0x4000], c.m[0x1fc], c.m[0x1fd], c.y];
}
for (let n = 1; n <= 44; n++) {
  const c = make(), expected = [];
  for (let i = 0; i < n; i++) expected.push(push(c, i));
  const offset = c.m[0x348a]; let mismatch = null;
  for (let j = 0; j < n; j++) {
    let got;
    const action = () => call(c, 0x348b, {}, {hooks: {0x34b2: cpu => { got = fieldsAtPop(cpu); return n === 44; }}});
    // Complete ordinary draw pops for depths 1..43. At 44, stop before a
    // potentially corrupted pointer is consumed by the renderer.
    if ((n === 43 && [0, 42].includes(j)) || (n === 44 && [0, 42, 43].includes(j))) {
      observe(c, 'queue depth ' + n + ' pop ' + (j + 1), 0x348b, n === 44 ? 0x34b2 : null,
        [[0x348a, 1], [0x4000, 2], [0x31c5, 18], [0xa000, 8192]], action);
    } else action();
    const want = expected[n - j - 1];
    if (JSON.stringify(got) !== JSON.stringify(want) && !mismatch) mismatch = {pop: j + 1, wanted: want, observed: got};
  }
  if (n <= 43) assert.equal(mismatch, null); else assert(mismatch);
  assert.equal(c.m[0x348a], 0);
  report.queue.push({queued: n, offsetAfterPush: offset, firstMismatch: mismatch});
}
{
  const c = make(), written = new Set();
  for (let i = 0; i < 128; i++) {
    const offset = c.m[0x348a]; for (let k = 0; k < 6; k++) written.add(0x34da + offset + k);
    push(c, i);
  }
  assert.equal(c.m[0x348a], 0);
  observe(c, '128 queued records appear empty', 0x348b, null, [[0x348a, 1], [0x34da, 260]], () => call(c, 0x348b));
  assert.equal(Math.min(...written), 0x34da); assert.equal(Math.max(...written), 0x35dd);
  report.wrap = {enqueues: 128,offset: 0, uniqueWrittenBytes: written.size, firstAddress: '$34DA', lastAddress: '$35DD'};
}
for (const [entry, life, pulse] of [[0x3385, 0, 1], [0x3388, 0, 1], [0x3388, 1, 1], [0x3388, 2, 1], [0x3388, 1, 0]]) {
  const c = make();
  for (const [a, v] of Object.entries({0x402c: 1, 0x4029: 4, 0x4052: 0, 0x408f: 0x81, 0x4062: 1, 0x406a: 150, 0x407a: 100, 0x31f9: 1, 0x40e0: 16, 0x40e1: 39})) c.m[a] = v;
  c.m[0x4028] = life; c.m[0x402c] = pulse;
  observe(c, 'Runaway entry ' + entry.toString(16) + ' life ' + life + ' pulse ' + pulse, entry, null, [[0x40da, 3], [0x3013, 1], [0x4062, 1]], () => call(c, entry));
  const score = c.m[0x40da] | c.m[0x40db] << 8 | c.m[0x40dc] << 16;
  assert.equal(score, entry === 0x3388 && life !== 2 && pulse ? 100 : 0);
  report.entries.push({image: '11', entry, life, pulse, score, targets: c.m[0x3013], active: c.m[0x4062]});
}
const shape = make('10').m, rows = [];
let a = 0x32bb;
while (shape[a] !== 255) {
  const [length, x, y] = shape.slice(a, a + 3), pixels = Array.from(shape.slice(a + 3, a + 3 + length));
  assert(pixels.every(p => p === 0)); rows.push({length, x, y, pixels}); a += 3 + length;
}
assert.equal(a, 0x32e7);
assert.equal(rows.reduce((n, row) => n + row.length, 0), 20);
report.hotFootShape = {entry: '$32BB', terminator: '$32E7', rows, erasedPixels: 20};
for (const entry of [0x3213, 0x3214]) {
  const c = make('10');
  c.m.fill(255, 0xa000, 0xc000);
  for (const [a, v] of Object.entries({0x402c: 1, 0x40be: 1, 0x4063: 176, 0x4073: 100})) c.m[a] = v;
  observe(c, 'Hot Foot entry ' + entry.toString(16), entry, null, [[0x4062, 1], [0x407a, 1], [0x4000, 2], [0xa000, 8192]], () => call(c, entry));
  let erased = 0;
  for (const byte of c.m.slice(0xa000, 0xc000)) for (let shift = 0; shift < 8; shift += 2) {
    const pixel = (byte >> shift) & 3;
    assert(pixel === 0 || pixel === 3); if (pixel === 0) erased++;
  }
  assert.equal(erased, entry === 0x3214 ? 20 : 0);
  report.entries.push({image: '10', entry, erasedPixels: erased, active: c.m[0x4062]});
}
report.originalRoutineCalls = calls;
if (output) fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
if (native) fs.writeFileSync(native, JSON.stringify({method: report.method, cases: recipes}, null, 2) + '\n');
console.log(JSON.stringify({queueDepths: report.queue.length, originalRoutineCalls: calls, nativeRecipes: recipes.length}));
