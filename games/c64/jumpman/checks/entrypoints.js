'use strict';
// Check the stored entry points, not just the coverage denominator.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const crypto = require('crypto');
const game = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const option = key => { const i = args.indexOf(key); return i < 0 ? null : path.resolve(args[i + 1]); };
const disk = option('--disk-dir'), output = option('--report');
if (!disk) throw Error('Use --disk-dir <extracted original PRGs> [--report <JSON>]');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'inputs.json')));
const meta = JSON.parse(fs.readFileSync(path.join(game, 'game.json')));
const report = {method: 'Original initial-overlay pointers must land on named code-record boundaries. This does not prove every name or dynamic callback interpretation.', images: [], headerPointers: 0, bombCallbacks: 0};
for (const source of meta.source_images) {
  const filename = 'plf' + source.id + '.prg';
  const bytes = fs.readFileSync(path.join(disk, filename));
  const wanted = manifest.files.find(f => f.name.toLowerCase() + '.prg' === filename);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), wanted.sha256, filename);
  const m = bytes.subarray(2);
  const word = a => m[a - 0x3000] | m[a - 0x3000 + 1] << 8;
  const root = path.join(game, source.path);
  const symbols = new Map(JSON.parse(fs.readFileSync(path.join(root, 'symbols.json'))).symbols.map(s => [s.address, s]));
  const records = new Map(JSON.parse(fs.readFileSync(path.join(root, 'listing.json'))).records.map(r => [r.a, r]));
  const entries = [];
  function check(address, pointer, kind) {
    assert(address >= 0x3000 && address < 0x3800, source.id + ' external entry');
    assert.equal(records.get(address)?.t, 'code', source.id + ' entry inside data/instruction at ' + address.toString(16));
    assert(symbols.has(address), source.id + ' unnamed actual entry at ' + address.toString(16));
    entries.push({pointer, address, kind, name: symbols.get(address).name});
  }
  for (const offset of [8, 10, 12, 14, 0x19, 0x1b, 0x1d, 0x3a]) {
    const address = word(0x3000 + offset);
    if (!address) continue;
    check(address, 0x3000 + offset, 'header'); report.headerPointers++;
  }
  let p = word(0x3006), bombs = 0;
  // PLF13's four-record table is unterminated. $3109 is callback code,
  // already documented and checked separately; do not invent a sentinel.
  while (p < 0x3800 && m[p - 0x3000] !== 255 && !(source.id === '13' && p === 0x3109)) {
    check(word(p + 3), p + 3, 'bomb callback'); bombs++; p += 7;
  }
  assert(p < 0x3800, source.id + ' table ran outside overlay');
  report.bombCallbacks += bombs;
  report.images.push({id: source.id, entries, bombs});
}
assert.equal(report.images.length, 32);
assert.equal(report.bombCallbacks, 397);
if (output) fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({images: 32, headerPointers: report.headerPointers, bombCallbacks: report.bombCallbacks}));
