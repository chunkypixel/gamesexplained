'use strict';
// Controlled stress of the original producer/consumer order. Supplied collision
// shadows are test inputs, not claims that a joystick route reaches them.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const crypto = require('crypto');
const {CPU} = require('../../../../kit/c64/cpu6502');
const args = process.argv.slice(2);
const option = name => { const i = args.indexOf(name); return i < 0 ? null : path.resolve(args[i + 1]); };
const disk = option('--disk-dir'), output = option('--report'), native = option('--native-cases');
if (!disk) throw Error('Use --disk-dir <original extracted PRGs> [--report JSON] [--native-cases private JSON]');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'inputs.json')));
function file(name) {
  const bytes = fs.readFileSync(path.join(disk, name.toLowerCase() + '.prg'));
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), manifest.files.find(f => f.name === name).sha256);
  return bytes.subarray(2);
}
const base = new Uint8Array(65536);
base.set(file('INTRO.SYS'), 0x2000); base.set(file('JUMPMAN'), 0x800); base.set(file('PLF11'), 0x3000);
function make() { const m = base.slice(); return new CPU(m, {strict: true, port: 0x36, io: {read: a => m[a], write: (a, v) => m[a] = v}}); }
let calls = 0;
function call(c, entry) { calls++; return c.call(entry, {i: 1, d: 0}); }
function recipe(name, before, entry, after, watch) {
  return {name, image: '11', entry, stop: null, regs: {}, patches: Array.from(before.entries()).filter(([a, v]) => v !== base[a]), watch: watch.map(([address, n]) => ({address, bytes: Array.from(after.slice(address, address + n))}))};
}
let maximumPending = 0, bestRecipe, bestScenario;
const scenarios = [];
for (let seed = 1; seed <= 128; seed++) {
  for (const policy of ['none', 'first', 'last', 'every-third']) {
    const c = make(), m = c.m;
    m[0x585b] = seed & 255; m[0x585c] = seed >> 8;
    m[0x4000] = m[0x3002]; m[0x4001] = m[0x3003];
    call(c, 0x4d0f); call(c, 0x3161);
    assert.equal(Array.from(m.slice(0x31c5, 0x31d7)).filter(Boolean).length, 12);
    m[0x402c] = 1;
    let ticks = 0, collections = 0, peak = 0;
    for (; ticks < 1000; ticks++) {
      m.fill(0, 0x4088, 0x4090);
      const active = [4, 5, 6, 7].filter(i => m[0x31f2 + i]);
      let chosen;
      if (policy === 'first') chosen = active[0];
      if (policy === 'last') chosen = active.at(-1);
      if (policy === 'every-third' && ticks % 3 === 0) chosen = active[(ticks * 13 + seed) % active.length];
      if (chosen !== undefined) { m[0x4088] = m[0x4088 + chosen] = 1; collections++; }
      call(c, 0x3388); // Collect one, or land eligible actors.
      const before = m.slice();
      call(c, 0x3216); // Spawn and move.
      const pending = m[0x348a] / 6;
      assert(Number.isInteger(pending)); peak = Math.max(peak, pending);
      if (pending > maximumPending) {
        maximumPending = pending; bestScenario = {seed, policy, tick: ticks, collections, pending};
        bestRecipe = recipe('runaway speed1 sampled peak', before, 0x3216, m, [[0x348a, 1], [0x34da, pending * 6], [0x31f2, 32], [0x4063, 24]]);
      }
      call(c, 0x348b); // One consumer call per pulse, including empty queue.
      if (m[0x3013] === 0) { ticks++; break; }
    }
    scenarios.push({seed, policy, ticks, collections, peak, targets: m[0x3013]});
  }
}
assert.equal(scenarios.length, 512); assert.equal(maximumPending, 4);
// The routine does not enforce the twelve-target limit itself. This supplied
// zero-target state is not a claim about interrupt reachability in real play.
const c = make(), m = c.m;
m[0x402c] = 1; m[0x3013] = 0; m[0x4088] = m[0x408f] = 0x81; m[0x31f9] = 1;
const before = m.slice(); call(c, 0x3388); assert.equal(m[0x3013], 255);
const zeroRecipe = recipe('runaway controlled zero-target collection', before, 0x3388, m, [[0x3013, 1], [0x40da, 3], [0x31f9, 1], [0x4062, 1]]);
const report = {
  method: 'Original drawing/init, then collector/landing, spawn/movement and one drawing pop each pulse. Every pulse is eligible, matching speed1 callback cadence. Controlled collision policies omit player movement, perimeter hazards, foreground static pickups and real interrupt interleavings. Stop when the sampled target count reaches zero. This is bounded testing, not an exhaustive gameplay bound.',
  routineCalls: calls, scenarios: scenarios.length, maximumPending, bestScenario,
  zeroTargetControl: {before: 0, after: 255, scope: 'Forced input to original collector. Does not demonstrate a natural underflow; prevents assuming the collector enforces a twelve-pickup cap.'},
  results: scenarios
};
if (output) fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
if (native) fs.writeFileSync(native, JSON.stringify({method: 'Private native replay inputs; includes original source excerpts. Do not publish.', cases: [bestRecipe, zeroRecipe]}, null, 2) + '\n');
console.log(JSON.stringify({routineCalls: calls, scenarios: scenarios.length, maximumPending}));
