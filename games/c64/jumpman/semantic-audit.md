# Jumpman semantic sample — 3 October 2026

This additional **self-audit** selected 20 factual claims and 10 named routines from baseline `762263d098054cf5ace249afe57ab31f409f2141`. The selection is preserved in [checks/semantic-sample.json](checks/semantic-sample.json). It follows the sampling and source-tracing method in `kit/CHECKING.md`, including orientation checks. It does **not** satisfy that document's requirement for a separate reviewer, and adds no `verification` attestation.

The 20 factual claims were confirmed within the scopes below. **One of the ten routine names was misplaced:** `plf09_falling_object_tick` named the shared return at `$31FB`, rather than the callback entry at `$31FC`. Calling the labelled address would return immediately. The factual text and overlay callback pointer already used `$31FC` correctly. The native disassembler now names `$31FB` as the return and `$31FC` as the tick, with the description at the actual entry.

Under the kit's zero-error rule, the original sample therefore contains a failure. Correcting that failure is not a fresh independent passing sample. A separate reviewer must choose their own sample before treating this as formal verification.

## Method

The new [semantic check](checks/semantic.js) loads the original extracted PRGs, verifies their SHA-256 hashes, and executes their unchanged instructions. It does not test a rewritten gameplay model. There are 125 controlled execution cases and 352 assertions. Eighty-five selected cases were also executed in native VICE 3.13.2 PAL, comparing their output memory with the CPU checks. The native run restores source bytes and declared initial RAM for each case, masks interrupts and clears decimal mode. It verifies a paused machine before setup and a stopping checkpoint after execution. Colour RAM comparisons use its four meaningful bits.

These tests establish routine behavior under declared conditions. They do not establish legal routes to those conditions, hardware-generated collisions, complete attract timing or complete level playthroughs. The two CPU implementations agreeing does not make this an independent human/model review.

The [machine-readable results](reference/semantic-audit-verification.json) identify each claim, native comparison region, source revision, orientation observation and correction. Raw states and native execution helpers remain in ignored `work/semantic-audit-2026-10-03/`.

## Twenty factual claims

| ID | Claim | Original-instruction evidence and fresh check |
|---|---|---|
| F01 | New players have zero totals, a 10,000 threshold, speed 4 and six reserves | `$7BBE-$7BDB` clears the eleven-byte record, then writes `04`, `06` and `10 27 00`. CPU/native memory matches. The initial wait and roster caller are traced separately. |
| F02 | Modes 1–4 award 100/250/500/750 per remaining life | `$2932-$293E` indexes separate low/high tables. All four native results match. |
| F03 | Completion buildings are five cells wide, with heights 8/10/12 | `$2B5A` stops each row at Y=5; `$2B83` supplies the three heights. Exactly 150 screen cells are written. Native screen bytes match. |
| F04 | Completion flashes 4/5/6/15 window pairs | `$2C00` accepts every sixteenth callback; `$2C0D` selects ranges from `$2B42/$2B46`. Native writes match all four modes, at two cells per pair. |
| F05 | Short-sprite expansion reads 240 bytes into eight padded slots | `$5E6F-$5EC5` clears 512 bytes and copies eight groups of 30, advancing destination by 64. A source containing `FF` is copied as data. All 512 native output bytes match. |
| F06 | High-score ties remain below existing equals | `$24C3/$24C5` skips lower digits and continues on equality; six equal digits advance to the next row. Candidate 0 fails a list headed by 100 followed by zeroes; 99 and 100 qualify second; 101 qualifies first. |
| F07 | Tunes 9/11/12/13 do not silence occupied voices | Their descriptors match. `$6000` submits zero-priority requests; `$45DA-$45E1` cannot replace a positive priority with zero. All occupied voice records remain unchanged in VICE. An idle voice can receive an inactive descriptor. |
| F08 | Title and demo input scripts use opposite player-pulse phases | `$9443` enters on nonzero; `$99DE` enters on zero. Both countdown branches tested natively with pulse 0 and 1. |
| F09 | Demo commands load frames, position, call a sound wrapper or stop; other records move | `$9ABE-$9ACC` dispatches `80`–`83`; `$9B8D` reads 16-bit X delta, Y delta and duration. Native cases cover both X-byte crossings, position/enable, frame loading, an actual supplied sound wrapper and retained stop pointers. |
| F10 | Demo frame clearing writes offsets 1…128 | `$9B1D` starts Y at 128; store, decrement and branch omit offset 0. Native comparison confirms the byte beyond the 128-byte slot is cleared. No visible corruption is inferred. |
| F11 | Bombs Away hazards fall three pixels and expand on impact | Three `INC` instructions at `$3336` precede the Y≥216 test. Native Y=212/213/214 cases straddle impact; CPU cases also check hazard-pulse and life-state gates. Impact expands X and shifts X left 12. |
| F12 | Vampire activates one hunter every third bomb, up to three | All 14 records call `$3317`; the divider compares with 3 and the activation counter stops at 3. Fourteen sequential native calls match the activation sequence. |
| F13 | Vampire turns toward the player on row or half-X alignment | `$33E0` tests the updated Y; `$340F` tests half-X cached before movement. Native cases cover both directions, equal half-X for odd/even hardware X, no alignment, and alignment lost by that move. These are different moments within an update. |
| F14 | Four Grand Puzzle I records award 500 total | Four real record callbacks reach `$3282`, which adds 400. Starting at resident `$5611` executes that callback before the ordinary 100-point addition. All four native cases total 500. |
| F15 | Builder installs no private moving-hazard callback | Header hooks are `0,0,0,$308F`; init, cleanup and all 16 bomb callbacks point to `$301F` RTS; the global callback is zero. The foreground calls resident spawn/collection. Native collision controls confirm the remaining hook. Resident perimeter bullets still exist. |
| F16 | Look Out Below queues drawing from its IRQ and draws in the foreground | `$31FC` moves the active object; first background contact patches and queues `$3288` without changing the bitmap. Native `$3053-$305D` then draws and clears the pointer. The contact countdown and gates are traced; a complete contact sequence is not claimed. |
| F17 | Hot Foot advances the effect on three of four service phases | `$33CB` masks the frame counter with 3, skipping zero; an active effect is also required. All eight tested phases agree natively. |
| F18 | Runaway initializes twelve distinct bomb locations out of eighteen | `$316D` rejects random indices ≥18; `$3175` rejects occupied positions; `$3193` counts twelve successful placements. Five returning seeds produce twelve occupied cells in CPU and VICE. This is not a termination proof for every seed. |
| F19 | Four Grand Puzzle II records award 500 total | Two direct callbacks and two forwarding callbacks reach `$3667`. All four real record paths through resident `$5611` add 400 before 100, confirmed natively. |
| F20 | The Roost pursues horizontally on equal Y, otherwise rises or moves diagonally, then resets near the top | `$3301` gives row equality priority over background contact. Contact selects index 0; otherwise half-X selects 3/4. `$334C` resets when the prospective unsigned Y is below 4. Six native cases verify movement, priority and all three reset positions. |

## Ten named routines

| ID | Source and baseline name | Result |
|---|---|---|
| R01 | Resident `$0811` `boot_loading_picture` | Correct: clears screen/colour memory, then consumes the loading-picture data before entering disk loading. Native stop at `$0898` verifies the drawing path. |
| R02 | Resident `$24A8` `find_high_score_position` | Correct: searches up to twenty records, transfers to insertion for a greater score and returns `FEFE` on failure. F06 checks its comparisons. |
| R03 | Resident `$2B83` `draw_three_completion_buildings` | Correct: indices 0–2 call the row renderer; index 3 exits. F03 checks the complete three-building output. |
| R04 | Resident `$5E6F` `load_short_sprite_rows` | Correct: F05 verifies clearing, fixed count, copying and padding. |
| R05 | Resident `$7BAF` `new_game_initialize` | Correct: waits for IRQ counter 2, initializes roster state and the current player record, selects the mode's first suffix, then enters turn preparation. F01 verifies the record stores. |
| R06 | Resident `$90A7` `reveal_epyx_logo` | Correct: the caller supplies `$9106` and screen `$04F7`; each pass maps 26 tile indices through `$91F0` and advances one screen row. Nine rows reach the low-byte stop `$5F`. A complete native row matches; timed full presentation is outside this check. |
| R07 | Resident `$9A98` `step_demo_actor_scripts` | Correct: loops over two actors on the zero pulse phase and interprets their commands. F09/F10 check the decoder and frame-clearing behavior. |
| R08 | PLF05 `$3317` `wake_vampire_each_three_bombs` | Correct from the supplied zeroed counters: all bomb records reach it; F12 verifies cadence and cap. |
| R09 | PLF09 `$31FB` `plf09_falling_object_tick` | **Incorrect address.** This byte is `RTS`. Entry is `$31FC`, as stored in the callback header. Fixed in the native project and regenerated exports; the return has its own name. |
| R10 | PLF17 `$32EB` `plf17_pursue_player` | Correct: hazard/life gates precede a loop over slots 5–7. F20 checks branch priority and motion/reset behavior. |

Reloading the native project merged adjacent blocks of the same type, from 54 to 24. Byte-by-byte classifications are identical. All 401 listing record boundaries/types and all 169 instructions remain unchanged; the only semantic changes are the corrected name/comment placement and the added entry label. Coverage remains 2,048/2,048 for this overlay.

## Orientation

Fresh native reads confirm the `$2F03` handover contains all 32,768 original `INTRO.SYS` bytes, and the PLF09 `$7514` capture contains all 2,048 original bytes copied into `$3000`. PRG headers independently identify load addresses `$0800`, `$2000` and `$3800`.

Ordinary resumed execution from `stable-01` stopped at foreground `$3053`, IRQ service `$417E`, then foreground `$3053` again. CPU port values were `$37 → $36 → $37`, with direction register `$2F` throughout and IRQ vector `$4100`. The frame counter advanced 145→146. This confirms the traced `$4175-$417C` bank change and `$42F8-$42FB` restoration; bitmap RAM is exposed during the service.

## Reproduce

Use the extraction instructions in [audit.md](audit.md) with your own identified disk. Then, from the repository root:

```sh
node games/c64/jumpman/checks/semantic.js --disk-dir games/c64/jumpman/work/audit-inputs --report games/c64/jumpman/work/semantic-result.json
```

The CPU check needs no author snapshot and downloads nothing. Optional `--native-cases games/c64/jumpman/work/native-cases.json` writes controlled setup/expected-result recipes for a native replay. Keep that generated file private: it can contain copied source excerpts. Native results in this report are observations from this run, not a promise that the CPU command also starts VICE.
