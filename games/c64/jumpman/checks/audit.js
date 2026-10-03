'use strict';
// Read-only checks against the contributor's own extracted PRGs. No game bytes
// or snapshots are bundled here. Run from any directory; see ../audit.md.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const crypto = require('crypto');
const vm = require('vm');
const {CPU, readSnapshot, OPCODES} = require('../../../../kit/c64/cpu6502');
const game = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
function option(name) {
  const i = args.indexOf(name);
  if (i < 0) return null;
  assert(args[i + 1] && !args[i + 1].startsWith('--'), name + ' needs a path');
  return path.resolve(args[i + 1]);
}
const disk = option('--disk-dir'), snapshots = option('--snapshots');
const output = option('--report');
if (!disk || args.includes('--help')) {
  console.log('node checks/audit.js --disk-dir <extracted PRGs> [--snapshots <local work folder>] [--report <result.json>]');
  process.exit(args.includes('--help') ? 0 : 1);
}
const json = file => JSON.parse(fs.readFileSync(path.join(game, file), 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const word = (m, a) => m[a] | m[a + 1] << 8;
const hex = n => '$' + n.toString(16).toUpperCase().padStart(4, '0');
const report = {
  method: 'Self-audit against hash-identified original files, published listings and actual page functions. CPU checks use controlled RAM, without raster, ROM or hardware collision emulation. This is not an independent maintainer verification.',
  inputs: [], checks: [], snapshots: snapshots ? [] : 'Not requested; no native snapshot provenance check in this invocation.'
};
function check(name, details) { report.checks.push({name, ...details}); }
const manifest = json('checks/inputs.json');
const files = new Map();
for (const item of manifest.files) {
  const file = item.name.toLowerCase() + '.prg';
  const data = fs.readFileSync(path.join(disk, file));
  assert.equal(data.length, item.bytes, file + ' length');
  assert.equal(hash(data), item.sha256, file + ' hash: another release or changed input');
  assert.equal(word(data, 0), item.load_address, file + ' load address');
  files.set(item.name, data.subarray(2));
  report.inputs.push({file, sha256: hash(data)});
}
const base = new Uint8Array(65536);
base.set(files.get('JUMPMAN'), 0x0800);
base.set(files.get('INTRO.SYS'), 0x2000);
check('Original extracted files', {files: files.size, diskSha256: manifest.disk_sha256});
// The hand-over snapshot preserves INTRO.SYS before execution, but the boot
// loader has already run. Derive its two modified operands by executing its
// original screen-clear loop, rather than accepting arbitrary byte differences.
const boot = new CPU(base.slice(), {strict: true, port: {dir: 0x2f, data: 0x37}, io: {read: a => {throw Error('Unexpected boot I/O read ' + hex(a));}, write: () => {}}});
boot.pc = 0x0811; boot.run({until: 0x0841});
const bootChanges = [];
for (let a = 0x0800; a < 0x0c00; a++) if (base[a] !== boot.m[a]) bootChanges.push({address: hex(a), disk: base[a], handover: boot.m[a]});
assert.deepEqual(bootChanges, [{address: '$082F', disk: 255, handover: 8}, {address: '$0834', disk: 255, handover: 220}]);
base.set(boot.m.slice(0x0800, 0x0c00), 0x0800);
check('Boot-loader self-modification at hand-over', {changes: bootChanges});

// Listing consistency alone cannot establish what the comments mean. This
// separately checks each byte and decoded instruction against the original PRG.
const meta = json('game.json');
const lengths = {imp: 1, acc: 1, imm: 2, zp: 2, zpx: 2, zpy: 2, izx: 2, izy: 2, rel: 2,
  abs: 3, abx: 3, aby: 3, ind: 3};
let totalBytes = 0, totalInstructions = 0;
for (const source of [{id: 'resident', path: ''}, ...meta.source_images]) {
  const prefix = source.path ? source.path + '/' : '';
  const symbolsBytes = fs.readFileSync(path.join(game, prefix + 'symbols.json'));
  const symbols = JSON.parse(symbolsBytes), listing = json(prefix + 'listing.json');
  assert.equal(listing.symbols_sha256, hash(symbolsBytes));
  const m = base.slice(), mask = new Uint8Array(65536), seen = new Uint8Array(65536);
  if (source.id !== 'resident') m.set(files.get('PLF' + source.id.toUpperCase()), 0x3000);
  for (const [a, b] of symbols.regions.extra) mask.fill(1, a, b + 1);
  for (const [a, b] of symbols.regions.exclude) mask.fill(0, a, b + 1);
  let bytes = 0, instructions = 0;
  for (const r of listing.records) {
    if (!r.b) continue;
    assert.deepEqual(r.b, Array.from(m.slice(r.a, r.a + r.b.length)), source.id + ' bytes at ' + hex(r.a));
    for (let a = r.a; a < r.a + r.b.length; a++) {
      assert.equal(seen[a]++, 0, source.id + ' duplicate byte at ' + hex(a));
      assert.equal(mask[a], 1, source.id + ' byte outside included ranges at ' + hex(a));
    }
    bytes += r.b.length;
    if (r.t === 'code') {
      const [mnemonic, mode] = OPCODES[r.b[0]];
      assert.equal(r.m, mnemonic, source.id + ' opcode at ' + hex(r.a));
      assert.equal(r.b.length, lengths[mode], source.id + ' instruction length at ' + hex(r.a));
      if (r.oa !== undefined) {
        const target = mode === 'rel' ? (r.a + 2 + (r.b[1] < 128 ? r.b[1] : r.b[1] - 256)) & 65535
          : r.b[1] | (r.b[2] || 0) << 8;
        assert.equal(r.oa, target, source.id + ' operand target at ' + hex(r.a));
      }
      instructions++;
    }
  }
  assert.deepEqual(seen, mask, source.id + ' omitted included bytes');
  totalBytes += bytes; totalInstructions += instructions;
  if (snapshots) {
    const filename = source.id === 'resident' ? 'entry.vsf' : 'level-' + source.id + '.vsf';
    const file = path.join(snapshots, filename), state = readSnapshot(file);
    const first = source.id === 'resident' ? 0x2000 : 0x3000;
    const last = source.id === 'resident' ? 0xa000 : 0x3800;
    assert.equal(state.regs.pc, source.id === 'resident' ? 0x2f03 : 0x7514, filename + ' stopping PC');
    assert.deepEqual(state.ram.slice(first, last), m.slice(first, last), filename + ' original bytes');
    if (source.id === 'resident') assert.deepEqual(state.ram.slice(0x800, 0xc00), m.slice(0x800, 0xc00));
    report.snapshots.push({file: filename, sha256: hash(fs.readFileSync(file)), pc: hex(state.regs.pc)});
  }
}
assert.equal(totalBytes, 90583);
check('All source bytes, coverage ranges and instruction decodes', {images: 33, bytes: totalBytes, instructions: totalInstructions});

// Derive the atlas from the files, not from a second copy of levels.json.
const {levels} = json('reference/levels.json');
let bombCount = 0, excerptBytes = 0;
assert.equal(levels.length, 32);
assert.deepEqual(meta.source_images.map(s => s.id), levels.map(l => l.id.toLowerCase()), 'Source selector omits or duplicates a level');
for (let i = 0; i < 32; i++) {
  const l = levels[i], id = String.fromCharCode(...base.slice(0x763a + i * 2, 0x763c + i * 2));
  assert.equal(l.id, id);
  const m = base.slice(); m.set(files.get('PLF' + id), 0x3000);
  const titleRow = base[0x767a + i];
  const title = String.fromCharCode(...base.slice(0x5880 + 20 * (titleRow - 1), 0x5880 + 20 * titleRow)).trim();
  assert.equal(meta.source_images[i].title, id + ' · ' + title, id + ' source title');
  for (const [key, value] of Object.entries({index: titleRow, title,
    stream: word(m, 0x3002), target: m[0x3013], points: word(m, 0x3015), bonus: word(m, 0x3017),
    bullets: m[0x3014], background: m[0x3004], border: m[0x3005],
    next: String.fromCharCode(m[0x3034], m[0x3035]), init: word(m, 0x3019),
    callbacks: [8, 10, 12, 14].map(n => word(m, 0x3000 + n)), globalBombCallback: word(m, 0x303a)})) {
    assert.deepEqual(l[key], value, id + ' atlas ' + key);
  }
  let p = word(m, 0x3006);
  for (const b of l.bombs) {
    assert.deepEqual(b, {a: p, key: m[p], x: m[p + 1], y: m[p + 2], callback: word(m, p + 3), draw: word(m, p + 5)}, id + ' bomb');
    p += 7; bombCount++;
  }
  assert.equal(l.hasSentinel, m[p] === 255, id + ' bomb sentinel');
  assert(l.hasSentinel || (id === '13' && l.bombs.length === 4), id + ' unexplained unterminated table');
  for (const r of l.data) {
    assert.deepEqual(r.b, Array.from(m.slice(r.a, r.a + r.b.length)), id + ' excerpt at ' + hex(r.a));
    excerptBytes += r.b.length;
  }
}
assert.equal(bombCount, 397);
check('Atlas headers, titles, bomb records and drawing excerpts', {levels: 32, bombs: bombCount, excerptBytes});

// Read the exact functions embedded in BOTH pages. This avoids validating a
// private development copy while a different version reaches readers.
const article = fs.readFileSync(path.join(game, 'index.html'), 'utf8');
const atlas = fs.readFileSync(path.join(game, 'levels.html'), 'utf8');
function between(text, first, last) {
  const a = text.indexOf(first), b = text.indexOf(last, a + first.length);
  assert(a >= 0 && b > a, 'Page function boundaries changed: ' + first);
  return text.slice(a, b);
}
function pageLevels(text) {
  const match = text.match(/const jmLevels=(.*);$/m);
  assert(match, 'embedded atlas data missing');
  return JSON.parse(match[1]);
}
for (const text of [article, atlas]) {
  const embedded = pageLevels(text);
  for (let i = 0; i < levels.length; i++) {
    for (const key of Object.keys(levels[i])) assert.deepEqual(embedded[i][key], levels[i][key], 'published ' + levels[i].id + ' ' + key);
  }
}
const models = [article, atlas].map(text => {
  const geometry = between(text, 'function geometry(', 'function sceneryDifference(');
  const context = vm.createContext({Uint8Array});
  vm.runInContext(geometry + ';this.models={geometry,bombScenery};', context);
  return {code: geometry, ...context.models};
});
assert.equal(models[0].code, models[1].code, 'article/atlas geometry differs');
let bitmaps = 0;
for (const l of levels) {
  const original = base.slice(); original.set(files.get('PLF' + l.id), 0x3000);
  const cpu = new CPU(original, {strict: true});
  original.fill(0, 0xa000, 0xc000);
  original[0x4000] = l.stream & 255; original[0x4001] = l.stream >> 8;
  cpu.call(0x4d0f, {d: 0});
  const page = new Uint8Array(65536);
  for (const r of l.data) page.set(r.b, r.a);
  models[0].geometry(page, l.stream);
  assert.deepEqual(page.slice(0xa000, 0xc000), original.slice(0xa000, 0xc000), l.id + ' initial bitmap');
  bitmaps++;
  function draw(m, p, bomb) {
    const c = new CPU(m, {strict: true});
    // Enter after private callbacks/scoring, exactly the scope of the widget.
    m[0x56bf] = bomb.x; m[0x56c0] = bomb.y;
    m[0x5688] = bomb.draw & 255; m[0x568d] = bomb.draw >> 8;
    c.call(0x567a, {d: 0}, {hooks: {[0x5699]: () => true}});
    models[0].bombScenery(p, bomb);
    assert.deepEqual(p.slice(0xa000, 0xc000), m.slice(0xa000, 0xc000), l.id + ' bomb ' + hex(bomb.a));
    bitmaps++;
  }
  for (const bomb of l.bombs) draw(original.slice(), page.slice(), bomb);
  for (const order of [l.bombs, [...l.bombs].reverse()]) {
    const m = original.slice(), p = page.slice();
    for (const bomb of order) draw(m, p, bomb);
  }
}
check('Actual page renderer versus original instructions', {initialBitmaps: 32, bombBitmaps: bitmaps - 32, bytesPerBitmap: 8192, scope: 'Erase/draw only; private callbacks and legal collection order are excluded.'});

const randomCode = between(article, 'function randomByte(', '\n');
const chooserCode = article.match(/^const randomUnits=.*$/m)[0] + '\n' + article.match(/^function randomLevel\(.*$/m)[0];
const random = vm.createContext({});
vm.runInContext(randomCode + '\n' + chooserCode + '\nthis.models={randomByte,randomLevel};', random);
const rng = new CPU(base.slice(), {strict: true});
for (let seed = 0; seed < 65536; seed++) {
  rng.m[0x585b] = seed & 255; rng.m[0x585c] = seed >> 8;
  rng.call(0x5832, {d: 0});
  assert.equal(random.models.randomByte(seed), word(rng.m, 0x585b), 'PRNG seed ' + seed);
}
const suffixes = new Set(), stalls = [];
let maxAttempts = 0;
for (let seed = 0; seed < 65536; seed++) {
  rng.m[0x585b] = seed & 255; rng.m[0x585c] = seed >> 8; rng.pc = 0x5b8f;
  const visits = new Set();
  // Observe repeated foreground state; do not patch code or skip instructions.
  rng.run({until: 0x5bae, maxSteps: 10000, hooks: {[0x5b8f]: c => {
    const key = [word(c.m, 0x585b), c.a, c.x, c.y, c.sp, c.n, c.v, c.z, c.c, c.m[0x40d3], c.m[0x40d4], c.m[0x585a]].join(',');
    if (visits.has(key)) return true;
    visits.add(key);
  }}});
  const result = random.models.randomLevel(seed);
  assert.equal(result.state, word(rng.m, 0x585b));
  if (rng.pc === 0x5bae) {
    assert(!result.stalled, 'unexpected model stall');
    assert.equal(result.suffix, String.fromCharCode(rng.m[0x40d3], rng.m[0x40d4]), 'chooser seed ' + seed);
    suffixes.add(result.suffix); maxAttempts = Math.max(maxAttempts, result.attempts);
  } else {
    assert(result.stalled, 'original repeats but page chooses for seed ' + seed);
    assert.equal(result.state, 0); assert.equal(result.suffix, null);
    assert.equal(String.fromCharCode(rng.m[0x40d3], rng.m[0x40d4]), '00');
    stalls.push(seed);
  }
}
assert.deepEqual([...suffixes].sort(), Array.from({length: 29}, (_, i) => String(i + 1).padStart(2, '0')));
assert.deepEqual(stalls, [0, 0x4000, 0x8000, 0xc000]);
const orbit = new Map(); let state = word(base, 0x585b);
while (!orbit.has(state)) { orbit.set(state, orbit.size); rng.m[0x585b] = state & 255; rng.m[0x585c] = state >> 8; rng.call(0x5832, {d: 0}); state = word(rng.m, 0x585b); }
assert(stalls.every(seed => !orbit.has(seed)));
check('Actual page Randomizer versus original instructions', {randomStates: 65536, chooserStates: 65536, returning: 65532, stalledInputs: stalls.map(hex), maximumAttemptsForReturningInputs: maxAttempts, suffixes: [...suffixes].sort(), loadedSeedSequence: {distinctStates: orbit.size, transient: orbit.get(state), period: orbit.size - orbit.get(state)}, naturalSelectionBoundary: 'Not established; the uninterrupted loaded-seed sequence excludes the four stalled inputs.'});

// Concrete, separately derived checks for commonly cited tables and routines.
assert.deepEqual(Array.from({length: 14}, (_, i) => word(base, 0x4004 + i * 2)),
  [0x57c0, 0x5c00, ...Array(6).fill(0x40c3), 0x4900, 0x6800, 0x4600, 0x47c0, 0x44c0, 0xea31]);
check('IRQ task order', {words: 14, sentinel: '$EA31'});
for (let n = 0; n < 256; n++) {
  let expected = 0; for (let shift = 0; shift < 8; shift += 2) expected |= 1 << (n >> shift & 3);
  assert.equal(base[0x7d00 + n], n === 255 ? 0 : expected, 'material table ' + n);
}
check('Bitmap material lookup, including FF exception', {inputs: 256});
for (const [start, horizontal] of [[0x4bff, 0], [0x4c2b, 2], [0x4c57, 254]]) {
  let x = 0, y = 0, minY = 0;
  for (let i = 0; i < 22; i++) {
    const dx = base[start + i * 2], dy = base[start + i * 2 + 1];
    y += dy < 128 ? dy : dy - 256; minY = Math.min(y, minY);
    x += dx === 2 ? 4 : dx === 254 ? -4 : 0;
  }
  assert.equal(minY, -12); assert.equal(y, 14);
  assert.equal(x, horizontal === 2 ? 52 : horizontal === 254 ? -52 : 0);
}
check('Three stored jump trajectories', {bytes: 132, rise: 12, finalVerticalOffset: 14, lateralDistance: 52});
assert.deepEqual([9, 11, 12, 13].map(id => Array.from(base.slice(0x603c + id * 16, 0x603c + (id + 1) * 16))), Array(4).fill(Array.from(base.slice(0x60cc, 0x60dc))));
for (const id of [9, 11, 12, 13]) for (const off of [0, 5, 10]) assert.equal(base[0x603c + id * 16 + off + 2], 0);
check('Four zero-priority tune definitions', {ids: [9, 11, 12, 13]});

// Validate the evidence files actually served by the page. Comparing a bitmap
// hash is not an assertion that a screenshot depicts successful legal play.
const shooting = json('reference/shooting-live-verification.json');
let pictures = 0;
for (const [file, sha256] of Object.entries(shooting.screenshots_sha256)) {
  assert.equal(hash(fs.readFileSync(path.join(game, file))), sha256, file + ' screenshot hash'); pictures++;
}
const dragon = shooting.dragon_slayer;
assert.equal(dragon.events.length, 49);
assert.equal(dragon.inputs.reduce((n, input) => n + input.frames, 0), dragon.frames);
for (let i = 0; i < dragon.events.length; i++) {
  const event = dragon.events[i];
  assert.equal(event.score, (i + 1) * 50);
  assert.equal(event.life, 0); assert.equal(event.reserves, 6);
  assert.equal(event.stairs[0], Math.min(12, Math.floor((i + 1) / 4)));
}
assert.equal(dragon.final.score, 2450);
check('Published shooting evidence', {screenshotHashes: pictures, dragonHitRecords: 49, inputFrames: dragon.frames});
if (snapshots) {
  const checked = new Set();
  function snapshotHash(file, expected) {
    assert.equal(hash(fs.readFileSync(path.join(snapshots, file))), expected, file + ' evidence hash');
    checked.add(file);
  }
  const gameplay = json('reference/gameplay-verification.json').cpu;
  for (const suite of ['movement_contact', 'shooting_visibility']) {
    for (const [id, record] of Object.entries(gameplay[suite].snapshots)) snapshotHash('ready-' + id + '.vsf', record.sha256);
  }
  for (const [id, sha256] of Object.entries(gameplay.route_snapshot_hashes)) snapshotHash('ready-' + id + '.vsf', sha256);
  for (const [id, sha256] of Object.entries(json('reference/scenery-verification.json').snapshotSha256)) snapshotHash('level-' + id.toLowerCase() + '.vsf', sha256);
  snapshotHash('ready-27.vsf', json('reference/robot-route-verification.json').snapshotSha256);
  for (const [part, id] of [['dragon_slayer', '14'], ['invasion', '06']]) {
    snapshotHash(shooting[part].ready_snapshot, shooting[part].ready_snapshot_sha256);
    snapshotHash(shooting[part].start_snapshot, shooting[part].start_snapshot_sha256);
  }
  check('Published evidence identifies the local source snapshots', {distinctSnapshots: checked.size});
}

if (output) fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({passed: true, checks: report.checks, snapshotImagesChecked: Array.isArray(report.snapshots) ? report.snapshots.length : 0}, null, 2));
