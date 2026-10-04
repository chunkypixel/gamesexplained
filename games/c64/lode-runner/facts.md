# Lode Runner — verified technical facts

## Scope and evidence

This analysis covers the Black Label original disk's complete IT engine and DB title data: **25,343 authored bytes**, $6000–$B7FF and $1400–$1EFE. The canonical hand-over image and supplied-file hash are recorded in `orientation.md`. Original loader internals, external disk protection, and the separate cartridge engine are outside this listing. Generated RAM is excluded; retained code, source records, demos, and unused table entries are included.

Unless marked **live** or **CPU-tested**, facts below were traced through the original bytes, including callers and indexed data. A forced state tests the routine's behavior; it does not establish that ordinary play reaches that state.

## Memory layout

| Data | Address | Meaning |
|---|---|---|
| Runner | $03–$06 | Column, row, horizontal phase, vertical phase; centered phases are 2/2 |
| Dynamic map | $0800/$0900 | Terrain collision plus runner/guard markers |
| Backing map | $0A00/$0B00 | Terrain and gold beneath actors |
| Actor shapes | $0C00–$0D7F | Six 64-byte sprite buffers |
| Bitmap row directory | $0E00/$0F00 | Generated low/high offsets for 200 scanlines |
| Packed room | $1000 | 256-byte sector buffer |
| Score sector | $1100 | Track 12, sector 7 during ordinary disk play |
| Exits | $1201/$1231 | Columns/rows; at most 45 retained markers |
| Holes | $12A0/$12C0/$12E0 | Column, row, timer arrays; 30 allocated slots |
| Display/work bitmap | $2000/$4000 | Visible picture and preserved background |
| Shift lookup | $A000–$A7FF | Four paired 256-byte phase lookup pages |
| Glyphs | $A800–$B0EF | 104 shapes, 22 transposed pattern bytes each |
| Demo commands | $B100–$B3FF | 768 loaded bytes of command/duration pairs, including retained tail |
| Demo boards | $B500/$B600/$B700 | Three resident demonstration sectors; the third shares disk room 11’s cells |
| Sound queues | $C000/$C100/$C200/$C300 | Duration, melody, harmony, fourth event byte |

Map rows have a four-byte gap after row 8. Rows 0–8 start at base + 28×row; row 9 starts at the next page. Use $8D66 with high-byte directories $8D76/$8D86, rather than assuming 448 contiguous bytes. Gold pickup clears the backing cell while retaining the dynamic actor marker. An open hole clears the dynamic brick while preserving backing brick. Sources: $728F, $7A4A, $83F1, $7B12.

## Board data and progression

- The reader at $71F5 discards the first CHRIN value. Raw sector offsets 1–224 load into $1000–$10DF and encode 448 cells, low nibble first, arranged 28×16. Values above 9 become blank. IDs are blank, brick, concrete, ladder, bar, trapdoor, hidden exit, gold, guard, runner. $71F5, $6FA6, $709C, $728F.
- All 150 room sectors are byte-identical across the supplied Black, Gray, and Yellow images. Board index `i` maps to track `3+(i>>4)`, sector `i&15`. The next sector, track 12/sector 6, is empty. $709C.
- The reverse scan retains at most five guards and 45 hidden exits. Stored maxima in these boards are six guards and 48 exits. Extra guard/exit markers are erased during construction. $728F.
- A board lacking a runner returns normal disk play to physical index zero and increases difficulty, capped at ten. The displayed level is an independent eight-bit counter. $70AF, $728F. The retained uncapped increment entry $7955 has no identified direct caller or control-directory target; ordinary access remains unproved.
- The guard schedule indexes eleven offsets using difficulty plus guard count without a bounds check. Ordinary combinations can index five adjacent trap-threshold bytes. The masks therefore do not support a simple claim that each cycle makes all guards uniformly faster. $6094, $626A, $6275, $7B5C.

## Movement, digging, and guards

The runner moves through five phases per cell. Gravity is checked before requested movement; ladders, centered bars, and support cells determine whether falling continues. Joystick input gives drilling priority, then vertical movement before horizontal fallback. Sources: $73C7–$78EE, $79B0.

Drilling requires a brick diagonally below and a suitable adjacent cell. A completed hole receives 180 main-loop passes; pictures 55 and 56 appear at 20 and 10. At zero the dynamic brick returns, killing a runner there or burying a guard. There are 30 allocatable holes; the update loop also visits sentinel slot 30. $76E6, $77A5, $7B12, $84F1. **Live:** forced finish opens a hole with timer 180; a timer-one update restores its brick. **CPU-tested:** all 181 timer values agree with the widget. A full 180-update closure sequence also agrees with the widget’s picture selection: original work-bitmap calls draw 55 at 20 remaining, 56 at 10, and 1 at zero.

A trapped guard counts down in guard updates before escape. A buried guard is relocated and given a respawn delay; the destination must become dynamically blank before the sprite returns. Guards can pick up backing gold, carry a negative counter, and drop gold when appropriate. Sources: $7BD2, $83F1, $84F1, $862F.

Guard route selection first tries a same-row chase with backing support. Otherwise $8338 bounds the walking range and $816F/$81FA/$8297 examine ladder/drop candidates. Current column precedes left and right; each side scans outer limit inward. Strictly lower cost replaces the previous choice, preserving that order on ties. $81CE costs are:

| Candidate row relative to runner | Cost |
|---|---|
| Same | Absolute candidate-column minus guard-column distance |
| Above | 100 + runner row − candidate row |
| Below | 200 + candidate row − runner row |

**CPU-tested:** all 200,704 legal input combinations agree with the page's route-cost helper. The widget does not simulate the full search.

The downward exit scan has an asymmetric pointer reuse: after the left bar test falls through to below-row support, the right bar read at $82FC still uses that below-row pointer. Original-code fixtures show that a current-row right bar can be ignored while a below-right bar supplies an exit at the current candidate row. This qualifies an idealized symmetric description of the search; ordinary reachability of the arranged states remains unproved. $8297–$8335.

A successful drill takes **13 runner updates** including its start: twelve phase increments, then completion at phase 12 (left) or 24 (right). Both continuations recheck the adjacent cell; any nonzero cell cancels even a final-phase dig without opening the brick or allocating a timer. **CPU-tested:** both full animations plus 18 final-phase obstruction cases. **Forced live:** each direction completes only on the thirteenth call and its immediately following hole service ages 180 to 179.

Under normal legal control flow, successive allocations are separated by at least 13 continuing passes. Every continuing pass has one runner update and one hole service; death/completion leave this lifecycle and the next normal room setup clears all 31 timer cells. Lifetime 180 therefore bounds the active timed holes at **ceil(180/13) = 14**, below the 30 allocatable slots. Positive timers remain distinct, so at most one expiry occurs per service under the same assumptions. Legal actor/array bounds, valid map/bitmap pointers, and unmodified loop/reset flow are required. This is a source invariant, not a claim that a playable route attains 14. **CPU-tested:** 720 services / 56 arranged allocations, every widget timer matches; peak 14; all 16,110 distinct positive timer pairs age correctly. An artificial equal pair expires twice, confirming the update routine itself permits that forced state. The caller/writer review checks every decoded allocator and timer writer under these legal-flow assumptions.

Tile 5 draws as ordinary brick 1 while remaining 5 in the maps ($733E). It blocks left/right/up entry, but supplies no support from above and passes the downward tile comparison. Brick 1 and concrete 2 block entry in all four directions and support the runner; ladder access and actor phases remain separate preconditions. **CPU-tested:** all ten tile IDs in five approaches, 50 cases each in disk and cartridge. **Forced live:** below-cell brick/concrete/ladder select the supported path $7494; trapdoor selects falling $7431.

## Score, exits, and lives

| Event | Points | Evidence |
|---|---:|---|
| Centered gold pickup | 250 | $7A4A/$7AA5; live isolated call and ordinary room-one pickup |
| Guard trapped | 75 | $7BD2 |
| Guard buried | 75 | $84F1 |
| Room completed | 1,500 | $6162: fifteen additions of 100; live isolated completion |

$87E6 adds packed BCD to four bytes $130A–$130D. The stored score has eight decimal digits; status printing shows the lowest seven. High scores retain eight. **Live:** +250 and eight-digit overflow. **CPU-tested:** 1,624 boundary and seeded additions agree in stored arithmetic and seven printed digits.

Gold is collected only at phase 2/2. Gold counter $130E reaching zero triggers the motif and exit activation. $8D96 reveals an exit only when its backing cell is blank, preserving an existing dynamic actor marker. Blocked backing cells remain pending. **Live:** a dynamic runner marker 9 survives while blank backing becomes ladder 3; gold flag becomes $FF. $611C accepts row zero and vertical phase two when gold counter is zero or $FF; completion can precede the last pending exit. Room completion awards a life, saturated at 255. A new game starts with five. **Live:** isolated completion changes score 0→1500, lives 4→5, displayed level 1→2, and physical index 0→1. $605E, $611C, $6162.

Ctrl-F adds a life with saturation and clears score eligibility. Ctrl-U skips a board, clears eligibility, and uses an unsaturated eight-bit life increment. **Live:** Ctrl-F dispatch at 254 produces 255 and remains at 255 on the next dispatch. $78EF–$79AF, $7A10.

## Timing and graphics

The IRQ at $648A chains to KERNAL $EA31 and advances counter $132D. On the captured PAL setup, CIA1 timer A's latch is $4025 (16,421), so its period is 16,422 CPU cycles, approximately 60 interrupts per second. This was read from live CIA state and checked against PAL setup in local KERNAL revision 901227-03. The page embeds the resulting timing values, not the ROM.

Default pacing threshold $131B is five. After a pass, the wait resets the counter to three: ordinarily two IRQs separate passes, about 30 passes per second. Thresholds 4–8 need one through five IRQs; threshold 3 is CPU-limited. **Live control measurement:** over 120 PAL video frames, IRQ/main-loop/hole-update checkpoints counted 144/72/72. Delay and disk paths can reduce that cadence. $611C, $648A.

The scenery is a multicolour bitmap. Actors are hires sprites in slots 0,2,3,4,6,7. Shape expansion $8AF8 combines two patterns per row through phase lookup pages; $8BF3 copies 33 bytes to actor buffers. The visible bitmap selector is $8995; work selector is $899B. Digits occupy glyphs 59–68 and letters 69–94. Status row 16 maps to scanline 181; gameplay rows map to 11×row. $8C3F.

Disk guard selectors 8 and 40–54 select shared masks 11, 9, 16, 17, 12, 13, 21, 22, 23, 24, 25, 26, 14, 18, 20, and 19 through $8BBA. Cartridge selector 8 selects mask 11 through its own $9442 directory. Gallery actor previews follow these gameplay masks in single-colour mode; scenery and text use multicolour decoding. The displayed index identifies the source, and substituted guard previews also identify the mask. Categories follow disk tables $7865–$789A and $7BC2–$7BD1.

The embedded live-frame capture retains only the 9,257 RAM bytes the shared renderer reads. Atlas bytes agree between hand-over and play. Title decoding consumes 1,330 count/value pairs through $1E63, expanding into $2000–$3F56. The remaining 155 DB bytes have no identified consumer in this decoder; other use remains open. $62E5.

## Sound and controls

$6319 consumes duration/melody/harmony/fourth-byte queue events. The fourth byte is read, then replaced with $F0 before masking by sound enable. Negative harmony detunes voice three to voice two's frequency minus $0080. The positive pitch table has 37 entries, but ordinary high transpositions can reach indexes 37–42; the widget includes the adjacent bytes actually read.

$643A selects a motif using countdown $1332 and transposes positive melody and strictly positive nonnegative harmony using $1333. Countdown 9 produces ten room completions before offset advances; offset starts at 2 and wraps after 11 back to 2. Of fifteen directory words, ordinary countdown uses the first ten; five point to an empty stream. $6410, $641D, $9500–$956A. **CPU-tested:** original enqueue and driver instructions agree with the player across every ordinary motif/pitch combination, including aliased indexes 37–42. The High transpose example plays motif 2 at offset 11, reaching index 39 and frequency word $0009. The browser groups CIA ticks into PAL frames and omits voice-one effects and timing within a frame. Shared-SID renders of the ordinary and high-transposition examples produce finite, nonzero output. Gold's four raster waits all occur in its pickup sound, rather than drill pacing. $63E2/$7A94.

The live key directory $7A10 implements I/K/J/L movement; U/O drill left/right; Ctrl-J/K input selection; Ctrl-D drill polarity; Ctrl-Z reveal toggle; Ctrl-A abandon; Ctrl-R attract; Ctrl-F extra life; Ctrl-U skip; +/− pace; Run/Stop pause. Attract checks Ctrl-E for the editor and Return for scores. The IRQ adds bit seven for **any active modifier**, not exclusively Ctrl. $61D8, $648A, $6F66, $79B0.

## Disk/editor and retained material

Editor command and cell-command directories dispatch via addresses minus one pushed for RTS. The menu supports play, clear, edit, move, initialize, and clear scores; numeric input accepts exactly boards 1–150. Cell commands include I/J/K/M movement, Ctrl-S save, Ctrl-F next, Ctrl-Z previous, and Ctrl-Q quit. $65D6–$6CA1. A valid marker with nonzero $11FB identifies the master disk and prevents room modification; recognized user disks have $11FB=0. Score clearing permits master disks. Score records rank displayed level before points, and reread the score sector before writing. $6A88, $6CAD.

The score helper's mode matters: cold startup mode zero copies embedded demo data into $1000 and examines the existing $1100 marker; it does not perform a score-sector read. Ordinary modes two and higher use $1100 and track 12/sector 7. $600D, $70DB.

The original disk probe uses tracks 2,1,34,35, fixed sector 2. Status bytes feed the checksum; failure increments the glyph-source page operand at $8B01. Gray supplies earlier results and changes entry to $8E32. $8E11, $86E1, $879F.

$993E–$9FFF is an exact copy of $693E–$6FFF. $93BB–$94FF contains assembler-style name/address records, including a truncated opening name. $B400–$B4FF holds high-bit source equates. No direct reader/caller was identified in the decoded engine; complete indirect non-use is not proved. These bytes remain annotated and counted.

## Review samples and verification

Independent full-body reviews cover all **371 authored annotations** and all **25,343 declared bytes**, including callers and indexed ranges. The canonical listing bytes match the hand-over snapshot. Completed checks on 4 October 2026 are summarized below; original images, harnesses, ledgers, sampled addresses, and full reports stay in private `work/` storage.

| Comment sample seed | Result; descriptive Wilson 95% interval |
|---|---|
| 6401983 | 17/60 wrong details (28.33%); 18.51–40.77% |
| 64202642 | 2/60 wrong details (3.33%), plus one ambiguity; 0.92–11.36% |
| 6401042602 | 0/60 wrong details, plus one ambiguity; 0–6.02% |

Samples describe their audited annotation versions. Targeted rechecks are dependent evidence and do not replace the original counts. Sampling was stratified, and these descriptive intervals do not adjust for unequal populations. The final sample draws 20 comments each from populations 125/101/145; 59 pass and one mask-table description is ambiguous. Counting ambiguity as adverse gives 1/60 (1.67%), interval 0.29–8.86%. The source distinguishes the unused zero sentinel at $86D5 from its five active inverse masks; that clarification is a dependent check.

A focused independent sample of 20 numerical/widget facts passed, as did orientation banking and scope checks. Its selected claim pools are not an exhaustive factual census. Neither sample certifies zero remaining errors or constitutes kit/CHECKING maintainer verification.

| Check | Verified scope/result |
|---|---|
| Disk widget arithmetic and sound | 214,299 original-code cases: 200,704 route costs, 1,624 score/display cases, 181 timer values, 180 closing-picture updates, and 11,610 ordered SID ticks across all 100 motif/offset combinations; aliases 37–42 exercised |
| Picture gallery | 180 original source expansions, 53 actor selectors, and 47,520 preview pixels match the appropriate bitmap/sprite decoding |
| Trapdoor comparison | All 15 displayed tile/approach results agree with the original-code tile tests (50 disk and 50 cartridge cases). Five illustrative animations, replay, rapid selection, keyboard activation, reduced motion, and 320px/390px layouts pass browser checks |
| Disk/cartridge comparison | 450 disk room read/decode fixtures and 17 unique cartridge matches; cartridge route/score helpers, graphics initialization, motif cycle, tile directions, both digs/cancellations, and hole schedules agree |
| Native VICE checks | Forced-state score, gold, exit preservation, digging/refill, life controls, and room awards; separate disk/cartridge pacing captures |
| Shared frame renderer | Published reference and fresh capture each match all 104,448 pixels with zero differences |
| Cartridge source identity | Reassembly of the earlier source matches all 16,384 supplied payload bytes; semantic coverage remains separately scoped |
| Browser/build/tool checks | Desktop and 390px controls, all six tabs and 34 room links pass without page errors; site builds 25 games/133 pages; required repository checks and 57 emulator qualification checks pass |

Offline tests use original instructions with explicit I/O/ROM hooks. Forced routine states establish behavior without proving ordinary-input reachability. Drive persistence, complete cartridge behavior, and the open cases below remain unverified.

## Selected disk and cartridge comparison

The contributor’s earlier [cartridge disassembly](https://github.com/jankfoundry/loderunner) supplied leads for the comparisons checked on 4 October 2026. Its annotations were not copied into the disk listing. Disk and cartridge addresses name separate engines.

### Source identity and provenance

The supplied CRT is labelled **Official Cartridge Image**. Its single 16,384-byte payload at $8000–$BFFF matches the earlier project's extracted cartridge. Reassembling that project's `disassembly/loderunner.asm` with 64tass 1.59.3120 reproduced all 16,384 payload bytes. This checks the cartridge assembly's byte representation; full semantic checking and disk-engine reassembly are separately scoped.

The source revision and hashes identify the exact inputs read, including working-tree content:

```text
Official Cartridge Image CRT SHA-256
  629471f8c1587ffd37c1b52b742e2755cc6e3773e9acd9e2d0c7aab4929cf8a0
Cartridge payload SHA-256
  a2ad27c5fc6b2ab29bc0ff4621a6d82ae90fba673b35a7b122a203cfbf3b1724
Earlier project HEAD
  0f15fdedd7d545582f627dcf26a29f13175a3c8f
disassembly/loderunner.asm SHA-256
  0368a113f51329ee3d9cb20e5b13860a9050748a9f44518e1360fab4238d2ac0
analysis/original-assembly-notes.json SHA-256
  8570a70e1b7b770e811af843b915db70d2dfb1ad0d284c5c92f9895bc559dab5
analysis/canonical-disk-variants.json SHA-256
  69e81a70eaabdd4c97158961dd57fa3066be2d97a09cef6d4dc426d1156eb1f7
```

Contributor: jankfoundry. The contributor recalls that the earlier work used **mostly GPT-6 Astra**; the complete historical model roster is unconfirmed. `game.json` preserves that qualification alongside the reported normalized model ID. The additions here were independently verified and written using the model recorded for this Games Explained run. The separate project was read only; no generators, service rebuilds, or edits ran there.

### Findings checked

| Claim and result | Disk evidence | Cartridge evidence |
|---|---|---|
| Room-cell order: Disk raw offset 1, not 0; cartridge expansions match 17 disk boards | $71F5, $71FA read; $6FA6 decode | $97DE, $980B decode |
| Route cost: Same result for all 200,704 legal row/column combinations in each engine | $81CE | $A5FD |
| Score arithmetic and visible digits: Same 1,624 cases per engine, including overflow and the undisplayed eighth digit | $87E6, score $130A – $130D | $8FED, score $77 – $7A |
| Trapdoor direction tests: 50 centered tile/direction cases per engine agree | $73C7, $74DE, $7550, $75C8, $7671 | $99E9, $9AD4, $9B38, $9BA2, $9C28 |
| Digging cadence: Disk CPU and forced VICE calls: 13 updates per successful dig in either direction | $76E6, $77A5 and continuations | Earlier source invariant supplied the lead |
| Hole-table bound: At most 14 active timed holes under normal legal loop/reset flow; attaining 14 on a board is unproved | $611C, $6FC5, $7B12, $84F1 | Earlier source invariant supplied the lead |
| Default pace: Over 120 PAL frames: disk 144 IRQs/72 passes; cartridge 144 IRQs/48 passes | Threshold 5, counter reset 3 | Threshold 6, counter reset 3 |
| Atlas size: Cartridge's 1,672 generated pattern bytes match its recorded native play snapshot | 104 source glyphs | $A8BB expands 76 compact sources |
| Completion motif cycle: Cartridge countdown/transposition checked for 70 completions; pitch offset cycles 2–11 in both | $641D, ten selections | $9760, seven selections |

The timing measurements concern the tested PAL setup and undelayed main loops. They do not promise a fixed wall-clock lifetime during scoring, disk access, or pauses. The disk mechanics checks pass 214,299 route, score, timer, closing-picture, and ordered SID-tick cases.

Cartridge graphics expand into $1800–$1E87; these shape indexes form a different namespace from the disk atlas. The cartridge wait threshold at $130C is six and its counter $6C resets to three. Its native 120-PAL-frame measurement includes 48 hole services, about 20 undelayed passes/second versus the disk’s measured 30.

### Supplied disk variants

All three supplied IT files load 22,528 engine bytes at $6000. Comparing payload bytes with Black Label gives:

| Supplied image | Different IT engine bytes |
|---|---:|
| Black Label | Reference payload |
| Gray Label | 10 |
| Yellow Label | 275 |

These counts exclude the two-byte load address. Gray changes startup selection and disk-probe values; Yellow also changes startup and carries additional loader/protection files. Native boot observations and the loader boundary are recorded in `orientation.md`. All 150 room sectors are identical across the three copies. Their score-sector contents at track 12/sector 7 are not all identical; this is a data comparison, not a fresh-boot persistence test.

### Cartridge room order

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

The native disk room-one buffer independently matches raw offsets 1–224; runner start is (14,14). The streams total 2,612 bytes. Each expansion has exactly one matching board among all 150 disk payloads, and all three supplied disks contain identical room sectors. The room browser displays this cartridge sequence using disk graphics. The picture gallery decodes each edition’s generated sources and shows the gameplay sprite masks for actor selectors.

## Explicit open questions

- Complete cartridge controls, editor workflow, persistence, and semantic coverage beyond the selected checks above.
- A playable route attaining the conditional 14-hole upper bound; arranged CPU allocations establish timer arithmetic, not that route. The forced full-table behavior remains a routine contract outside the normal legal-flow invariant.
- Ordinary reachability/effect of the guard search’s right-bar pointer reuse and bottom-row adjacent directory reads, and the retained uncapped difficulty entry.
- Full end-to-end editor save/reload and high-score persistence across a fresh boot; static disk paths are traced separately from these integration tests.
- Complete loader/protection reconstruction and byte-identical reassembly; these are future scope, not claims of this Silver engine listing.
- Complete editor write/read buffer alignment: original pack/write and reader loops are traced, but drive-buffer protocol and a full round trip remain integration checks.
- Ordinary consumption of retained demo-input tail bytes; forced zero-duration tests establish 256 control polls without proving that the demo reaches those records.
