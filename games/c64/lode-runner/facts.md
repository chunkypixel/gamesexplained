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
| Demo commands | $B100–$B3FF | 768 bytes of packed duration/action pairs |
| Demo boards | $B500/$B600/$B700 | Three embedded boards, distinct from the 150 disk sectors |
| Sound queues | $C000/$C100/$C200/$C300 | Duration, melody, harmony, fourth event byte |

Map rows have a four-byte gap after row 8. Rows 0–8 start at base + 28×row; row 9 starts at the next page. Use $8D66 with high-byte directories $8D76/$8D86, rather than assuming 448 contiguous bytes. Gold pickup clears the backing cell while retaining the dynamic actor marker. An open hole clears the dynamic brick while preserving backing brick. Sources: $728F, $7A4A, $83F1, $7B12.

## Board data and progression

- The reader at $71F5 discards the first CHRIN value. Raw sector offsets 1–224 load into $1000–$10DF and encode 448 cells, low nibble first, arranged 28×16. Values above 9 become blank. IDs are blank, brick, concrete, ladder, bar, trapdoor, hidden exit, gold, guard, runner. $71F5, $6FA6, $709C, $728F.
- All 150 room sectors are byte-identical across the supplied Black, Gray, and Yellow images. Board index `i` maps to track `3+(i>>4)`, sector `i&15`. The next sector, track 12/sector 6, is empty. $709C.
- The reverse scan retains at most five guards and 45 hidden exits. Stored maxima in these boards are six guards and 48 exits. Extra guard/exit markers are erased during construction. $728F.
- A board lacking a runner returns normal disk play to physical index zero and increases difficulty, capped at ten. The displayed level is an independent eight-bit counter. $70AF, $728F. The retained uncapped increment entry $7955 has no identified direct caller or control-directory target; ordinary access remains unproved.
- The guard schedule indexes eleven offsets using difficulty plus guard count without a bounds check. Ordinary combinations can index five adjacent trap-threshold bytes. The masks therefore do not support a simple claim that each cycle makes all guards uniformly faster. $6094, $626A, $6275, $7B5C.

## Movement, digging, and guards

The runner moves through five phases per cell. Gravity is checked before requested movement; ladders, centered bars, and support cells determine whether falling continues. Joystick input gives drilling priority, then vertical movement before horizontal fallback. Sources: $73BD–$78EE, $79B0.

Drilling requires a brick diagonally below and a suitable adjacent cell. A completed hole receives 180 main-loop passes; pictures 55 and 56 appear at 20 and 10. At zero the dynamic brick returns, killing a runner there or burying a guard. There are 30 allocatable holes; the update loop also visits sentinel slot 30. $76E6, $77A5, $7B12, $84F1. **Live:** forced finish opens a hole with timer 180; a timer-one update restores its brick. **CPU-tested:** all 181 timer values agree with the widget.

A trapped guard counts down in guard updates before escape. A buried guard is relocated and given a respawn delay; the destination must become dynamically blank before the sprite returns. Guards can pick up backing gold, carry a negative counter, and drop gold when appropriate. Sources: $7BD2, $83F1, $84F1, $862F.

Guard route selection first tries a same-row chase with backing support. Otherwise $8338 bounds the walking range and $816F/$81FA/$8297 examine ladder/drop candidates. Current column precedes left and right; each side scans outer limit inward. Strictly lower cost replaces the previous choice, preserving that order on ties. $81CE costs are:

| Candidate row relative to runner | Cost |
|---|---|
| Same | Absolute candidate-column minus guard-column distance |
| Above | 100 + runner row − candidate row |
| Below | 200 + candidate row − runner row |

**CPU-tested:** all 200,704 legal input combinations agree with the page's route-cost helper. The widget does not simulate the full search.

A successful drill takes **13 runner updates** including its start: twelve phase increments, then completion at phase 12 (left) or 24 (right). Both continuations recheck the adjacent cell; any nonzero cell cancels even a final-phase dig without opening the brick or allocating a timer. **CPU-tested:** both full animations plus 18 final-phase obstruction cases. **Forced live:** each direction completes only on the thirteenth call and its immediately following hole service ages 180 to 179.

Under normal legal control flow, successive allocations are separated by at least 13 continuing passes. Every continuing pass has one runner update and one hole service; death/completion leave this lifecycle and the next normal room setup clears all 31 timer cells. Lifetime 180 therefore bounds the active timed holes at **ceil(180/13) = 14**, below the 30 allocatable slots. Positive timers remain distinct, so at most one expiry occurs per service under the same assumptions. Legal actor/array bounds, valid map/bitmap pointers, and unmodified loop/reset flow are required. This is a source invariant, not a claim that a playable route attains 14. **CPU-tested:** 720 services / 56 arranged allocations, every widget timer matches; peak 14; all 16,110 distinct positive timer pairs age correctly. An artificial equal pair expires twice, confirming the update routine itself permits that forced state. Independent caller/writer audit is recorded in `comment-audit.md`.

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

**Frame verification:** a captured live PAL frame, rendered with the shared C64 renderer, matches all **104,448** reference pixels with zero differences. The embedded capture retains only the 9,257 RAM bytes the renderer reads. Atlas bytes compare identically between hand-over and play. Title decoding consumes 1,330 count/value pairs through $1E63, expanding into $2000–$3F56. The remaining 155 DB bytes have no identified consumer in this decoder; other use remains open. $62E5.

## Sound and controls

$6319 consumes duration/melody/harmony/fourth-byte queue events. The fourth byte is read, then replaced with $F0 before masking by sound enable. Negative harmony detunes voice three to voice two's frequency minus $0080. The positive pitch table has 37 entries, but ordinary high transpositions can reach indexes 37–42; the widget includes the adjacent bytes actually read.

$643A selects a motif using countdown $1332 and transposes positive melody and strictly positive nonnegative harmony using $1333. Countdown 9 produces ten room completions before offset advances; offset starts at 2 and wraps after 11 back to 2. Of fifteen directory words, ordinary countdown uses the first ten; five point to an empty stream. $6410, $641D, $9500–$956A. **CPU-tested:** 1,264 queue ticks agree register-for-register, in order, including high-pitch aliases. The browser groups CIA ticks into PAL frames and omits voice-one effects and timing within a frame. A three-second 48kHz shared-SID render gives nonzero finite output for motif zero and the high-transposition selection (peaks 0.3951/0.3929; RMS 0.1570/0.1002). Gold's four raster waits all occur in its pickup sound, rather than drill pacing. $63E2/$7A94.

The live key directory $7A10 implements I/K/J/L movement; U/O drill left/right; Ctrl-J/K input selection; Ctrl-D drill polarity; Ctrl-Z reveal toggle; Ctrl-A abandon; Ctrl-R attract; Ctrl-F extra life; Ctrl-U skip; +/− pace; Run/Stop pause. Attract checks Ctrl-E for the editor and Return for scores. The IRQ adds bit seven for **any active modifier**, not exclusively Ctrl. $61D8, $648A, $6F66, $79B0.

## Disk/editor and retained material

Editor command and cell-command directories dispatch via addresses minus one pushed for RTS. The menu supports play, clear, edit, move, initialize, and clear scores; numeric input accepts exactly boards 1–150. Cell commands include I/J/K/M movement, Ctrl-S save, Ctrl-F next, Ctrl-Z previous, and Ctrl-Q quit. $65D6–$6CA1. A valid marker with nonzero $11FB identifies the master disk and prevents room modification; recognized user disks have $11FB=0. Score clearing permits master disks. Score records rank displayed level before points, and reread the score sector before writing. $6A88, $6CAD.

The score helper's mode matters: cold startup mode zero copies embedded demo data into $1000 and examines the existing $1100 marker; it does not perform a score-sector read. Ordinary modes two and higher use $1100 and track 12/sector 7. $600D, $70DB.

The original disk probe uses tracks 2,1,34,35, fixed sector 2. Status bytes feed the checksum; failure increments the glyph-source page operand at $8B01. Gray supplies earlier results and changes entry to $8E32. $8E11, $86E1, $879F.

$993E–$9FFF is an exact copy of $693E–$6FFF. $93BB–$94FF contains assembler-style name/address records, including a truncated opening name. $B400–$B4FF holds high-bit source equates. No direct reader/caller was identified in the decoded engine; complete indirect non-use is not proved. These bytes remain annotated and counted.

## Independent comment audit

The first fixed-seed stratified sample (seed 6401983) found **17/60** comments with a wrong detail: **28.33%**, descriptive Wilson 95% interval **18.51–40.77%**. This triggered independent full-body reviews of all lower-code/title, upper-code, and remaining data annotations. Precise corrections were merged and substantive findings spot-checked against the original bytes.

A new independent sample (seed 64202642, 60 explicitly retained addresses) found **2/60** wrong details: **3.33%**, Wilson interval **0.92–11.36%**; separately one ambiguous wording, 57 passes. The wrong details were demo-mode qualification at $70DB and reveal-mask ordering at $93B7. The final listing qualifies demo-mode I/O and states the contiguous mask runs; $8BF3 names the selector explicitly. Rechecking these three entries is a dependent test, not a fresh zero-error estimate. The intervals are descriptive and do not adjust unequal stratum sampling. Source entry order changed during the final audit; the report preserves the original selected addresses instead of resampling. The explicit sampled-address evidence is retained in `comment-audit.md`; private working images are required for byte-level repetition.

## Selected cartridge comparison

The supplied cartridge payload matches the earlier disassembly byte-for-byte after reassembly with 64tass 1.59.3120. This validates its byte representation; full disk reassembly is still outside this pass. `comparison.md` records source-file hashes, originating-model uncertainty, and the limits of the comparison.

The original cartridge decoder $97DE expands 17 resident boards from $AC24–$B657 into 448-cell layouts. Low descriptor nibble is tile; high nibble plus one is run length. The matching one-based disk sequence is **1, 5, 111, 46, 50, 11, 4, 12, 100, 33, 48, 84, 14, 64, 6, 134, 150**. All 17 expansions match exactly and uniquely against all 150 disk boards; all three disk room stores agree. **CPU-tested:** all 17 original cartridge decodes and 450 original disk read/decode fixtures. The native disk room-one buffer independently matches raw offsets 1–224; runner start is (14,14).

Cartridge route helper $A5FD and score helper $8FED agree with the article functions for 200,704 and 1,624 cases, respectively. Cartridge graphics initialization $A8BB reconstructs 76 compact sources at $1800–$1E87; all 1,672 pattern bytes match its native play snapshot. The glyph indices are a different namespace from the disk's 104 sources. Cartridge motif countdown $9760 cycles seven selections and transposes 2–11, checked across 70 completions. Disk uses ten selections. Cartridge threshold $130C is six and its wait resets $6C to three. **Live:** 120 PAL frames produce 144 IRQs, 48 loop passes, and 48 hole services, about 20 undelayed passes/second versus disk's measured 30.

## Explicit open questions

- Complete cartridge controls, editor workflow, persistence, and semantic coverage beyond the selected checks in `comparison.md`.
- A playable route attaining the conditional 14-hole upper bound; arranged CPU allocations establish timer arithmetic, not that route. The forced full-table behavior remains a routine contract outside the normal legal-flow invariant.
- Ordinary reachability/effect of the bottom-row guard search's adjacent directory reads, and the retained uncapped difficulty entry.
- Full end-to-end editor save/reload and high-score persistence across a fresh boot; static disk paths are traced separately from these integration tests.
- Complete loader/protection reconstruction and byte-identical reassembly; these are future scope, not claims of this Silver engine listing.
