# Jumpman ordinary-control routes — 4 October 2026

This pass verifies a Gunfighter hit, finishes Dragon Slayer and reaches Grand Puzzle III's transformation and death exit. It also tests Runaway's fastest callback cadence against the original code. [Machine-readable evidence](reference/routes-verification.json) records inputs, native stops, controls and artifact hashes. This is self-verification, not independent review.

The three input routes start from native loader-initialized selected levels. Selecting the level is controlled setup; subsequent actions use only joystick input. No position, score, collision, target count, life or code edits are used. They do not establish a route through earlier campaign levels. Snapshots and extracted programs remain private in ignored `work/`.

## Gunfighter: a verified hit

From `ready-26` at the initialized loader stop: neutral754, LEFT+FIRE4, RIGHT4 and neutral32 PAL frames produce a100-point hit. Replaying to PLF26 `$351E` stops before resetting the accepted target, sprite7. The player shot and enemy share hardware position(240,56). Their collision shadows are `$82`; Jumpman's is zero. The actual VIC positions, bank, pointers and sprite modes are recorded. Original sprite shapes have eight opaque pixels of overlap, with no other enabled pair intersecting.

At `$356C`, the score is100, the kill counter has advanced0→1, the shot is cleared and enemy7 has reset to(8,152). Jumpman is alive with six reserves. The same794-frame movement with fire removed scores zero and never enters the hit-award path; a known dispatcher checkpoint records794 calls.

The counter chooses the next pursuit-threshold pair: half-X52/Y78 becomes92/100. Both pairs still put the captured player(288,56) in region `$11`. This contact therefore establishes a hit and selector change, not a different subsequent route choice. Gunfighter completion and mixed-contact effects remain open. [Capture](reference/gunfighter-first-hit.png).

## Dragon Slayer: the final bomb

The earlier [49-hit replay](reference/shooting-live-verification.json) ends alive at(240,56), score2450, with all twelve stair sections built. Its saved final state begins this continuation. The recorded sequence waits for shots, descends at alternating sides, and uses vertical jumps to pass approaching creatures. Horizontal fire remains reserved for the arrow.

The successful continuation is replayed as34 fixed input segments totaling2252 frames, then LEFT until the original completion entry `$5B00`. It adds five creature hits and the100-point bomb: **54 hits,2800 points, zero targets, life state0 and six reserves**. No life is lost. The prior41700-frame prefix is documented separately; its final position, creature positions, score and counters match the continuation's starting state.

[The screenshot](reference/dragon-slayer-complete.png) follows the completion routine's score refresh and two display frames. At entry, the RAM score is already2800 while the preceding rendered screen still shows2700. Completion itself sets life mode2 to freeze movement; that later display state is distinct from the alive entry recorded above.

## Grand Puzzle III: transformation without a state edit

The27-segment replay starts at initialized `ready-30`, includes the220 neutral spawn frames, and totals2320 fixed frames before waiting for trigger contact. Nine bombs are collected and one life is lost. The seventh pickup occurs during that death animation; normal respawning preserves the collected bombs. After the bottom-right and adjacent bottom pickups, Jumpman waits at(260,216), alive with score900, three targets and five reserves.

At PLF30 `$30BD`, only Jumpman and trigger7 have collision shadows, both `$81`. The software trigger position is(252,216); the VIC still displays its preceding X248 position. Comparing original sprite shapes at the hardware positions gives exactly one intersecting pair, Jumpman/trigger, with two opaque pixels. Thus the contact is supported by both collision state and actual sprite geometry. The original request increment leads to `$3393` without injected conditions.

Returning at `$305B` preserves three targets, score900 and life state0, while the bullet limit changes3→5 and the new scenery appears. Holding LEFT then calls the special500-point bomb callback once and causes death. At the post-death test `$3078`, reserves have fallen5→4, score is1400 and two targets remain. The unchanged branch reaches completion `$5B00`. This establishes the death exit through ordinary play in the selected level; it is not a claim of intentional secret design.

[Trigger](reference/grand-puzzle-trigger.png), [transformed scenery](reference/grand-puzzle-transformed.png) and [completion with targets remaining](reference/grand-puzzle-completed.png).

## Runaway: bounded speed-one stress

The new check executes original scenery and randomized initialization for128 seeds. Four supplied collision policies per seed give512 scenarios, each limited to1000 pulses or zero sampled targets. It schedules original collector/landing, spawn/movement and one drawing pop in their actual order, matching the fastest cadence. The418202 routine calls reach at most **four pending drawing records**. Native VICE matches the state and queue records at the sampled peak.

This includes the original geometry, initial placement and deferred occupancy changes. It omits player movement, perimeter hazards, foreground static pickups and real interrupt interleavings. Consequently it does not prove a global speed-one bound or establish a naturally reachable overload. The earlier conservative bound for speeds2–8 remains separate.

A second native case matches a forced zero-target input to the flying collector: it decrements0→255. This is not an ordinary-play underflow demonstration. It prevents treating the routine itself as enforcing a twelve-collection cap. Any proof using that cap must also establish when foreground completion stops further collection.

From the repository root, with your own hash-identified extracted files:

```sh
node games/c64/jumpman/checks/runaway-speed1.js --disk-dir games/c64/jumpman/work/audit-inputs --report games/c64/jumpman/work/runaway-speed1.json
```

The command downloads nothing. Optional `--native-cases <private JSON>` writes two native replay recipes, which can include original source excerpts and must stay private. It does not launch an emulator.

## Source and delivery checks

Nine comments across four overlays were edited and saved through the native disassembler, exported, and the listings regenerated from original-load snapshots. All source bytes, record boundaries, types, mnemonics, labels and per-byte classifications are unchanged. Reloading can merge adjacent blocks of the same type. The original-file regression covers90583 tracked bytes,9498 instructions,32 opening scenes,1191 bomb drawings and all65536 chooser inputs;179 header pointers and397 initial bomb callbacks still resolve to named code entries.

The factual ledger, feature inventory, article and atlas distinguish the successful routes from the remaining campaign and Gunfighter questions. Desktop/mobile Chromium checks pass on both pages, including matching atlas notes, stair controls, five source comments and all five evidence images. Binary, documentation and listing checks pass; all19 minisites build. Both native tools are stopped.
