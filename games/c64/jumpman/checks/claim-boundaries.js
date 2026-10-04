'use strict';
// Controlled original-code checks for prose preconditions and numeric units.
// RAM/I/O shadows do not generate raster timing or actual sprite collisions.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), crypto = require('crypto');
const {CPU} = require('../../../../kit/c64/cpu6502');
const args = process.argv.slice(2);
const option = name => { const i = args.indexOf(name); return i < 0 ? null : path.resolve(args[i + 1]); };
const disk = option('--disk-dir'), output = option('--report'), native = option('--native-cases');
if (!disk) throw Error('Use --disk-dir <extracted PRGs> [--report <JSON>] [--native-cases <private JSON>]');
const inputs = JSON.parse(fs.readFileSync(path.join(__dirname, 'inputs.json'))), files = new Map();
for (const f of inputs.files) {
  const bytes = fs.readFileSync(path.join(disk, f.name.toLowerCase() + '.prg'));
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), f.sha256, f.name);
  files.set(f.name, bytes.subarray(2));
}
const base = new Uint8Array(65536);
base.set(files.get('INTRO.SYS'), 0x2000); base.set(files.get('JUMPMAN'), 0x0800);
const report = {method: 'Self-audit of unchanged original routines with declared RAM inputs and I/O shadows. No natural-play or exhaustive semantic certification.', gunfighter: [], puzzle: [], hud: [], bonus: [], calls: 0}, recipes = [];
function make(id = 'resident') {
  const m = base.slice(); if (id !== 'resident') m.set(files.get('PLF' + id), 0x3000);
  const cpu = new CPU(m, {strict: true, port: 0x36, io: {read: a => m[a], write: (a, v) => { m[a] = v; }}});
  cpu.image = id; cpu.original = m.slice(); return cpu;
}
const read = (c, a, n = 1) => Array.from(c.m.slice(a, a + n));
const position = (c, slot) => [c.m[0x4063 + slot] + 256 * c.m[0x406b + slot], c.m[0x4073 + slot]];
function execute(c, name, entry, stop, watch, save = true) {
  const before = c.m.slice(); report.calls++;
  if (stop === null) c.call(entry, {d: 0, i: 1});
  else { c.setRegs({pc: entry, d: 0, i: 1}); c.run({until: stop}); }
  if (native && save) recipes.push({name, image: c.image, entry, stop, regs: {},
    patches: Array.from(before.entries()).filter(([a, v]) => v !== c.original[a]),
    watch: watch.map(([a, n]) => ({address: a, bytes: read(c, a, n)}))});
}
// The second enemy starts at Y216, but BOTH enemies respawn at Y152.
{
  const c = make('26'); execute(c, 'Gunfighter original initialization', 0x314d, null, [[0x4068, 19]]);
  assert.deepEqual(position(c, 6), [8, 152]); assert.deepEqual(position(c, 7), [8, 216]);
  report.gunfighter.push({kind: 'initialization', enemy6: position(c, 6), enemy7: position(c, 7)});
}
for (const slot of [6, 7]) {
  const c = make('26');
  c.m.fill(0, 0x4088, 0x4090); c.m[0x4089] = c.m[0x4088 + slot] = 2 | (1 << slot);
  c.m[0x4063 + slot] = 240; c.m[0x406b + slot] = 0; c.m[0x4073 + slot] = 56;
  c.m.fill(0, 0x40da, 0x40e0); c.m.fill(255, 0x40e0, 0x40e3);
  execute(c, 'Gunfighter hit enemy ' + slot, 0x3505, 0x356c, [[0x4063 + slot, 1], [0x406b + slot, 1], [0x4073 + slot, 1], [0x3111 + slot, 1], [0x313d + slot, 1], [0x3145 + slot, 1], [0x40da, 3], [0x3368, 1]]);
  assert.deepEqual(position(c, slot), [8, 152]); assert.deepEqual(read(c, 0x40da, 3), [100, 0, 0]);
  assert.equal(c.m[0x3111 + slot], 0); assert.equal(c.m[0x313d + slot] + 256 * c.m[0x3145 + slot], 0x3267);
  assert.equal(c.m[0x3368], 1);
  report.gunfighter.push({kind: 'controlled collision', slot, respawn: position(c, slot), score: 100, route: '$3267', kills: 1});
}
// Evaluate the actual post-death decision; the death routine already decremented
// the reserve counter. $FF means no lives remain, while zero still permits one.
for (const limit of [3, 5]) for (const reserves of [0, 5, 255]) {
  const c = make('30'); c.m[0x3014] = limit; c.m[0x40e4] = reserves;
  const destination = limit === 5 ? 0x308c : reserves === 255 ? 0x3086 : 0x3050;
  execute(c, `Puzzle limit ${limit}, post-death reserves ${reserves}`, 0x3078, destination, [[0x3013, 2], [0x40e4, 1]]);
  assert.equal(c.pc, destination);
  report.puzzle.push({stage: limit === 5 ? 2 : 1, postDeathReserves: reserves, destination: '$' + destination.toString(16).toUpperCase(), outcome: limit === 5 ? 'completion branch' : reserves === 255 ? 'exhaustion branch' : 'respawn branch'});
}
// Check every normally representable two-digit life count, including the maze
// selection boundaries. Stop before score handling can award an extra life.
for (let reserves = 0; reserves < 99; reserves++) {
  const c = make(); c.m[0x40e4] = reserves;
  execute(c, 'HUD reserves ' + reserves, 0x540c, 0x5457, [[0x07a4, 2]], [0, 2, 4, 5, 6, 9, 98].includes(reserves));
  const displayed = (c.m[0x07a4] - 0xb0) * 10 + c.m[0x07a5] - 0xb0;
  assert.equal(displayed, reserves + 1); report.hud.push({reserves, displayed});
}
// One enabled GAME SERVICE advances the timer. Hardware frequency is a
// separate native measurement, not something this CPU harness can establish.
for (const enabled of [0, 1]) for (const initial of [0, 254, 255]) {
  const c = make('01'); c.m[0x4027] = enabled; c.m[0x4026] = initial;
  c.m[0x3017] = 1500 & 255; c.m[0x3018] = 1500 >> 8;
  execute(c, `Bonus enabled ${enabled}, counter ${initial}`, 0x417e, 0x41a9, [[0x4026, 2], [0x3017, 2]]);
  const expectedCounter = enabled ? (initial + 1) & 255 : initial;
  const bonus = c.m[0x3017] + 256 * c.m[0x3018];
  assert.equal(c.m[0x4026], expectedCounter); assert.equal(bonus, enabled && initial === 255 ? 1400 : 1500);
  report.bonus.push({enabled, initial, counter: expectedCounter, bonus});
}
if (output) fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
if (native) fs.writeFileSync(native, JSON.stringify({method: report.method, cases: recipes}, null, 2) + '\n');
console.log(JSON.stringify({calls: report.calls, gunfighter: report.gunfighter.length, puzzle: report.puzzle.length, hud: report.hud.length, bonus: report.bonus.length, nativeRecipes: recipes.length}));
