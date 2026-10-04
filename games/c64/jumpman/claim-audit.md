# Jumpman: published-claim audit, 4 October 2026

This self-audit starts from `97a228d22444a7b3956706de5ce70619d2037846`. It reviews the final article, all 35 feature rows, all 32 atlas notes, the factual ledger, orientation and controls against their source references and evidence limits. It supplements the earlier 20-fact/10-routine sample. It is not an independent verification attestation, and does not claim that every disassembly comment has been independently re-derived.

## Corrections

- **Gunfighter's reset is not always its starting position.** Original initialization places enemy6 at (8,152) and enemy7 at (8,216). The hit routine sends either enemy to (8,152). The article and atlas now say “a fixed respawn point”; the factual ledger names both initial positions. Original instructions and three matching native VICE cases confirm initialization and both hit branches.
- **Grand Puzzle III's stage-one respawn needs remaining lives.** The post-death decision respawns with reserves0 or5 but takes exhaustion at255. Stage two takes the completion branch before that reserve test. Six supplied post-death cases agree in the CPU harness and VICE. The reader-facing comparison now says “while lives remain.” These cases check the branch, not natural routes to every supplied state.
- **The bonus timer counts enabled game updates.** The feature list called them IRQs. A fresh512-frame native replay again records512 game services but966 IRQ entries, and the first256 frames subtract100. Six controlled timer cases confirm the enabled/disabled gate and wrap boundary. The feature list and article use game-service updates/frame updates.
- **Private addresses need the private source image.** Several Markdown addresses defaulted to resident memory. Explicit links now select the relevant level, including the Hot Foot return/shape terminator, Runaway collector jump and drawing stack, visibility callbacks, robot bomb records, puzzle wall task, Jungle selector and shared header examples. Mechanical checks resolve all180 explicit source links against the chosen image. Article and atlas data, including their notes, are identical.

The original source comments already describe the fixed reset, exhaustion branch and timer gates accurately. No source bytes, labels, comments, classifications or listing boundaries needed changing in this pass.

## Claim and evidence inventory

“Repeated” below means an existing test was rerun. Repetition detects regressions; it is not a new independent derivation. Retained native observations were not all replayed from their beginning.

| Published area | Evidence checked in this pass | Limit retained in the explanation |
|---|---|---|
| Disk, loader, source coverage and atlas headers | Fresh `c1541` extraction of all35 hash-identified files; all90,583 included bytes,9,498 instructions,32 level headers,397 records and16,148 drawing-excerpt bytes; all179 header entries and397 initial bomb callbacks | Coverage and byte identity do not certify every interpretation; two boot-loader changes are reproduced explicitly |
| Bomb scenery viewer and renderer | Actual published renderer against original instructions:32 opening bitmaps and1,191 bomb comparisons,8,192 bytes each; repeated194-stream suite | Private callbacks, later transformations and legal pickup order remain outside the viewer |
| Robots III | Repeated21,456 routine calls,4,800 junction decisions, all edges in four opening states and shared RNG checks | The diagram omits player physics, collisions and other RNG consumers; natural opened-path traversal remains open |
| Dragon Slayer | Repeated original hit/drawing comparisons for all13 scenery states; retained49-hit prefix and54-hit completion evidence; five latest route-image hashes checked | Selected-level setup; no claim of entry through earlier campaign levels |
| Gunfighter | New initialization/hit cases for both enemies; retained native contact checked again against all28 original sprite-pixel pairs; no-fire control retained | A hit advances the boundary selector, but the captured player remains in the same region; changed enemy routing remains open |
| Invasion | Repeated native-snapshot pixel-pair proof and original shooting tests | The captured wrong-target event is established, not every possible collision outcome or level completion |
| Freeze, jumps, moving actors and followers | Repeated original movement,22-pair jump,14-file gameplay and follower/history suites; retained native observations compared with page controls | Controlled collision shadows do not prove natural reachability; surviving a full Freeze lock and a seven-follower route remain open |
| Display and clocks | Fresh512-frame native counter observation, six timer-boundary cases; browser reconstruction still matches104,448 captured pixels | One recorded frame; PAL configuration; raw interrupt entries are not timer updates |
| Lives, score, progression and persistence | New99-case life-display comparison and seven native samples; repeated progression and score-sentinel suites; retained natural100-point/ABC save/reboot evidence | One extra life per check; final88-life overflow is controlled, not a proven exploit; full four-player campaigns are unplayed |
| Randomizer and missing25 | Fresh exhaustive65,536 PRNG/chooser inputs, including four trapped inputs; repeated title-lookup proof and browser cases | No ordinary selection-boundary route to01/25 or trapped inputs is claimed |
| Music and effects | Repeated23,764 frame/state and23,413 ordered-write comparisons; browser playback/mute/stop | Declared SID read approximation; no physical-waveform equivalence |
| Grand Puzzle III and runtime callbacks | New six post-death decisions; fresh runtime-entry/installation checks; retained ordinary-input route and repeated trigger pixel comparison | Earlier campaign entry remains open; isolated branch cases are controlled |
| Hot Foot, Runaway and suspicious source data | Fresh2,116-call gap suite,541,068-call deeper suite and418,202-call speed1 suite; retained native cases and artifact hashes | Runaway's speed1 sample is bounded; diagnostic terrain/opcode comparisons do not establish natural failures or intended fixes |
| Mystery Maze and Hailstones | Repeated393,216 maze coordinates, all256 Jungle buckets,262,144 normal-coordinate Hailstones sampler setups and16 erasure subsets | Legal maze routes and noncanonical/interleaved Hailstones failure states remain open |
| All32 private level notes,35 feature rows and21 factual sections | Read together with their cited routines, applicable tests and stated uncertainty; duplicated atlas content and explicit links checked mechanically | Source-traced and controlled results remain distinct from ordinary-input observations; no intentional Easter egg is inferred |
| Orientation, controls, title/attract and remaining questions | Source/image records and semantic sample repeated; retained title-call and control observations reviewed | Complete attract replay, hardware audio fidelity and optional gameplay investigations remain open |

## Reproduction and results

[Machine-readable results](reference/claim-audit-verification.json) record the fresh checks,22 native comparisons, timing replay, retained artifact checks, reviewed-file hashes and browser/repository results. The additional portable test uses original PRGs identified by the existing input manifest:

```sh
node games/c64/jumpman/checks/claim-boundaries.js --disk-dir games/c64/jumpman/work/audit-inputs --report games/c64/jumpman/work/claim-boundaries.json
```

Create the extraction directory using the instructions in [audit.md](audit.md). The script downloads nothing. Optional `--native-cases` emits private controlled-state recipes for comparison with VICE; the output belongs under ignored `work/`. Its114 cases comprise three Gunfighter calls, six puzzle decisions,99 life displays and six timer boundaries. Twenty-two representative cases were run natively with original code restored for each case, IRQs masked and declared RAM/register inputs.

The existing20-fact/10-routine semantic sample passes125 controlled cases and352 assertions. Seventeen broader original-code suites pass again. All33 canonical source listings and symbol maps remain unchanged. The final browser pass covers all32 atlas selections,33 source images, drawing/robot/shooting/Freeze controls, audio, the four stalled chooser inputs and desktop/mobile layouts. Two stale assertions in the private shooting harness were updated: its disclosure selector had become ambiguous after Gunfighter was added, and its atlas expectation still described the superseded49-hit stopping point.

The result supports submission at the existing `silver-claimed` tier. It does not turn the self-audit into independent certification, prove every possible playthrough, or close the optional investigations in [TODO.md](TODO.md). A separate reviewer can still find errors that these checks share or omit.
