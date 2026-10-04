# Disk and cartridge cross-validation

Compared on 4 October 2026 with the contributor's earlier [cartridge disassembly](https://github.com/jankfoundry/loderunner). That analysis supplied leads; the checks below execute the supplied game's own instructions. Its annotations were not copied into the disk listing. Disk addresses and cartridge addresses name different engines.

## Source identity and provenance

The supplied CRT is labelled **Official Cartridge Image**. Its SHA-256 is `629471f8c1587ffd37c1b52b742e2755cc6e3773e9acd9e2d0c7aab4929cf8a0`. Its single 16,384-byte payload at $8000–$BFFF has SHA-256 `a2ad27c5fc6b2ab29bc0ff4621a6d82ae90fba673b35a7b122a203cfbf3b1724`, matching the earlier project's extracted cartridge. Reassembling that project's `disassembly/loderunner.asm` with the existing 64tass 1.59.3120 reproduced all 16,384 payload bytes. This checks the cartridge assembly's byte representation, not every semantic annotation, and does not establish reassembly of the disk engine.

The local source checkout's HEAD was `0f15fdedd7d545582f627dcf26a29f13175a3c8f`. File hashes identify the exact inputs read, including working-tree content:

| Earlier analysis file | SHA-256 |
|---|---|
| `disassembly/loderunner.asm` | `0368a113f51329ee3d9cb20e5b13860a9050748a9f44518e1360fab4238d2ac0` |
| `analysis/original-assembly-notes.json` | `8570a70e1b7b770e811af843b915db70d2dfb1ad0d284c5c92f9895bc559dab5` |
| `analysis/canonical-disk-variants.json` | `69e81a70eaabdd4c97158961dd57fa3066be2d97a09cef6d4dc426d1156eb1f7` |

Contributor: jankfoundry. The contributor recalls that the earlier work used **mostly GPT-6 Astra**; the complete historical model roster is unconfirmed. `game.json` preserves that qualification alongside the reported normalized model ID. The additions here were independently verified and written using the model recorded for this Games Explained run. The separate project was read only; no generators, service rebuilds, or edits ran there.

## Findings checked

| Claim | Disk evidence | Cartridge evidence | Result |
|---|---|---|---|
| Room-cell order | $71F5/$71FA read; $6FA6 decode | $97DE/$980B decode | Disk raw offset 1, not 0; cartridge expansions match 17 disk boards |
| Route cost | $81CE | $A5FD | Same result for all 200,704 legal row/column combinations in each engine |
| Score arithmetic and visible digits | $87E6, score $130A–$130D | $8FED, score $77–$7A | Same 1,624 cases per engine, including overflow and the undisplayed eighth digit |
| Trapdoor direction tests | $73C7/$74DE/$7550/$75C8/$7671 | $99E9/$9AD4/$9B38/$9BA2/$9C28 | 50 centered tile/direction cases per engine agree |
| Digging cadence | $76E6/$77A5 and continuations | Earlier source invariant supplied the lead | Disk CPU and forced VICE calls: 13 updates per successful dig in either direction |
| Hole-table bound | $611C/$6FC5/$7B12/$84F1 | Earlier source invariant supplied the lead | At most 14 active timed holes under normal legal loop/reset flow; attaining 14 on a board is unproved |
| Default pace | Threshold 5, counter reset 3 | Threshold 6, counter reset 3 | Over 120 PAL frames: disk 144 IRQs/72 passes; cartridge 144 IRQs/48 passes |
| Atlas size | 104 source glyphs | $A8BB expands 76 compact sources | Cartridge's 1,672 generated pattern bytes match its recorded native play snapshot |
| Completion motif cycle | $641D, ten selections | $9760, seven selections | Cartridge countdown/transposition checked for 70 completions; pitch offset cycles 2–11 in both |

The timing measurements concern the tested PAL setup and undelayed main loops. They do not promise a fixed wall-clock lifetime during scoring, disk access, or pauses. The disk mechanics checks pass 203,953 route, score, timer, closing-picture, and ordered SID-tick cases.

## Supplied disk variants

All three supplied IT files load 22,528 engine bytes at $6000. Comparing payload bytes with Black Label gives:

| Supplied image | Different IT engine bytes |
|---|---:|
| Black Label | Reference payload |
| Gray Label | 10 |
| Yellow Label | 275 |

These counts exclude the two-byte load address. Gray changes startup selection and disk-probe values; Yellow also changes startup and carries additional loader/protection files. Native boot observations and the loader boundary are recorded in `orientation.md`. All 150 room sectors are identical across the three copies. Their score-sector contents at track 12/sector 7 are not all identical; this is a data comparison, not a fresh-boot persistence test.

## Cartridge room order

The 17 low bytes at $AC00 and relative high bytes at $AC12 select compressed streams $AC24–$B657. Each descriptor's low nibble is a tile; its high nibble plus one is a run of 1–16 cells. Each stream expands to 448 cells, packed into 224 bytes. All streams end exactly on a run boundary. The original decoder leaves the destination's 32-byte tail untouched; the full initializer clears the workspace first.

| Cartridge room | Disk room | Compressed bytes |
|---:|---:|---:|
| 1 | 1 | 105 |
| 2 | 5 | 136 |
| 3 | 111 | 98 |
| 4 | 46 | 126 |
| 5 | 50 | 139 |
| 6 | 11 | 104 |
| 7 | 4 | 164 |
| 8 | 12 | 128 |
| 9 | 100 | 162 |
| 10 | 33 | 197 |
| 11 | 48 | 157 |
| 12 | 84 | 151 |
| 13 | 14 | 296 |
| 14 | 64 | 143 |
| 15 | 6 | 178 |
| 16 | 134 | 119 |
| 17 | 150 | 209 |

The streams total 2,612 bytes. Each expansion has exactly one matching board among all 150 disk payloads, and all three supplied disks contain identical room sectors. The room browser displays this cartridge sequence using disk graphics; the atlas control separately displays the actual generated cartridge sources.

## Repeating the checks

With the private play snapshot described in `orientation.md`, the supplied CRT, and extracted raw sectors in `work/sectors-{black,gray,yellow}-label/tNN-sNN.bin`:

```sh
node games/c64/lode-runner/verify-comparison.cjs \
  games/c64/lode-runner/work/play-round1.vsf \
  'games/c64/lode-runner/work/Lode Runner.crt' \
  games/c64/lode-runner/work
node games/c64/lode-runner/verify-mechanics.cjs \
  games/c64/lode-runner/work/play-round1.vsf
```

The comparison executes the disk read loop with CHRIN supplying extracted sector bytes, then the original room decoder before actor extraction: 450 cases. The recorded native room-one buffer independently matches raw offsets 1–224. The I/O fixture supplies zero after the sector and does not claim to reproduce the unused transfer tail or disk timing.

Other checks execute all 17 cartridge expansions, both route/score helpers, the cartridge graphics initializer and motif progression, all ten persistent tiles in five runner approaches per engine, and 18 obstructed final dig updates. Drawing routines execute; disk I/O register writes use a register shadow. The cartridge fixture uses mirrored writable code in flat memory. Neither fixture simulates raster or IRQ timing.

The hole schedule executes 720 original services with 56 arranged allocations at 13-pass intervals. Every timer and the peak count match the widget at every service. The peak is 14, with 42 expiries. Additional 720-service schedules at intervals 26 and 60 match every widget timer and peak, with peaks 7 and 3, respectively. All 16,110 unordered distinct positive timer pairs from 1–180 preserve their differences after an original service. A deliberately equal-timer negative control expires both holes, demonstrating why the claim depends on normal allocation history rather than the update routine alone. These arranged CPU states are not ordinary-input routes.

Fresh VICE checks independently observed both 13-call digs, trapdoor-versus-brick support decisions, and cartridge pacing. Complete cartridge controls/editor/persistence, physical input routes attaining the hole bound, and full cartridge semantic coverage remain outside these selected comparisons.
