# Jumpman deeper mechanics checks — 4 October 2026

This self-audit extends the original-instruction checks to movement edge cases, callbacks installed during play, Runaway's drawing backlog and selected input routes. It is not independent certification or a complete playthrough. [Machine-readable evidence](reference/deeper-verification.json) contains inputs, results, source-export checks and artifact hashes.

## Movement: narrower conclusions

At `$49BB`, climbing compares vertical intent with zero-page `$01`. A diagnostic change from `CMP $01` to `CMP #$01` tests the consequence without assuming the intended instruction. All256 Y values, up/down, X96/100/104 and material8/12 give3,072 paired setups. Only six differ: downward intent at Y222. The original takes the support fallback; the diagnostic first aligns X, then rejects Y224. Twelve original/diagnostic cases match native VICE. No ordinary-input route to a failure is established.

The fully climbable bitmap byte `$FF` maps to flag0 at `$7DFF`. On Mystery Maze C's rendered opening,262,144 paired original-sampler setups cover512 X,256 Y and two pose-mask classes. The foot probe is explicitly assigned current X/Y+11, rather than inherited from movement. Changing only `$7DFF` to8 changes588 individual body/foot results and90 combined results. Four selected original/diagnostic cases match native VICE.

That controlled difference does **not** prove a blocked ladder. Two native routes start with50 or54 neutral frames, then LEFT52 and UP40. Both climb from X212/Y216 to X212/Y196 alive, with either lookup value. Retained probe coordinates and animation masks matter. The ordinary-control result and the diagnostic branch are recorded separately. [Original-table climb](reference/deeper-maze-climb.png).

## Callbacks installed during play

The original pending-callback copier at `$428D` installs the requests before task dispatch. Grand Puzzle II's four bomb requests and five wall tasks are exercised from fresh loaded counters, including pulse gating and their final no-op request. Four tasks take nine eligible calls; middle-right growth `$35F9` takes ten. Each task's first eligible update matches native VICE. These timings do not imply that a legal pickup sequence always starts with those counters.

Grand Puzzle III's transformation is checked on each side of its asynchronous wait. The tests verify callback installation, frame49/50/51/52 repetition, copied ladder/rope fields, replacement drawing and bomb pointers, bullet limit5 and preserved target count. The CPU harness does not emulate the wait; the earlier controlled native transformation covers that sequence. Nine task targets and all eight replacement bomb callbacks land on named code-record boundaries. This extends the previous initial-header/table audit; it is not a claim that every possible indirect write has been exhaustively classified.

## Runaway backlog: a bound with a speed limit

The collector accepts at most one flying bomb per pulse and skips landing on that branch. With no collection, up to four actors can land; inactive actors can then spawn. Original movement runs from all18 locations in each of four directions until state repetition:72 paths, with no arrival at any location before13 movement updates. The original divider is also executed for every selectable speed. Its steady period is the speed itself, including one service per pulse at speed1.

A conservative state-space model starts with four idle actors and an empty queue. It allows any inactive actor to spawn, any sufficiently old flight to land, and unlimited one-at-a-time collections, ignoring geometry, occupancy and random-choice restrictions. With at least two drawing-service calls between hazard pulses,3,128 states and36,138 transitions give a maximum of **eight pending records**. Thus the model stays below the44-record overlap boundary for normal speeds2–8 under the original dispatcher. A separately controlled four-landing/four-spawn case reaches eight and matches native VICE; it is not an ordinary-input route to that arrangement.

Speed1 is explicitly excluded. Allowing only one service per pulse makes this permissive model insufficient to rule out overflow. That does not prove the real game can overflow: a naturally reachable overload, and simultaneous multi-bomb contacts, remain open.

## Native input routes

- **Follow the Leader:**50 neutral frames, LEFT168, DOWN64, LEFT12 reaches the first bomb alive, score100 and one follower displaying the old X320/Y212 pose. Continuing LEFT produces a second collection and death. Both followers are disabled before `$3263`; `$3263→$3269` clears count/write cursor while preserving read cursors33/6 and all1,024 history bytes. [Creation](reference/deeper-follower-created.png) and [cleanup](reference/deeper-follower-cleanup.png). Seven followers and full completion remain open.
- **Hot Foot:**50 neutral frames, UP+FIRE until the accepted first stamp, then neutral input. After100 further frames Jumpman stands alive at X176/Y64. Restoring only the pre-stamp bitmap at the post-stamp checkpoint makes the same continuation land at Y62. This demonstrates a two-pixel landing-height effect for this jump. [Original scenery after erasure](reference/deeper-hotfoot-landing.png) and [restored-scenery diagnostic control](reference/deeper-hotfoot-restored-control.png). It does not demonstrate a fatal hole or longer route.
- **Gunfighter:**five routes were tried for up to600 frames each, stopping on death or a score change: down/fire, left/fire, two direction sequences and nearest-enemy aiming. Across2,160 input frames the known dispatcher checkpoint records2,160 hits and the accepted-hit checkpoint records zero; score stays zero. This is bounded unsuccessful testing, not evidence that hits are impossible.

All routes begin at native loader-initialized selected-level snapshots. Selecting the starting level is controlled setup; original branches then use joystick input only. The Hot Foot bitmap restoration and maze lookup replacement are explicitly diagnostic alternatives. Snapshots, extracted programs, native recipes and scratch scripts remain in ignored `work/`; only observations, derived results and screenshots are published.

## Reproduce and limits

Extract your own hash-identified original files as described in [audit.md](audit.md), then run from the repository root:

```sh
node games/c64/jumpman/checks/deeper.js --disk-dir games/c64/jumpman/work/audit-inputs --report games/c64/jumpman/work/deeper-results.json
node games/c64/jumpman/checks/entrypoints.js --disk-dir games/c64/jumpman/work/audit-inputs
node games/c64/jumpman/checks/audit.js --disk-dir games/c64/jumpman/work/audit-inputs
```

The deeper check makes541,068 routine executions, including the explicitly marked diagnostic comparisons. It downloads nothing and needs no author snapshot. Optional `--native-cases <private JSON>` produces24 selected emulator replay recipes; that file can contain original source excerpts and must remain private. The command does not launch VICE. All24 selected comparisons pass in native VICE3.13.2 PAL.

Comments were edited and saved through the native disassembler, then exported and listings regenerated from their original-load snapshots. The resident export uses the same live format as its baseline; overlay exports use saved projects. Every listing byte, record boundary, type and mnemonic remains unchanged, as does every byte's block classification. Reloading may merge adjacent blocks of the same type.

The factual ledger, feature inventory, article and atlas distinguish these results from the remaining legal-route questions. Independent review remains useful; this self-audit does not stand in for it.

Final regression checks match all90,583 source bytes and9,498 instructions,32 opening renders,1,191 bomb drawings and all65,536 Randomizer inputs. The179 initial header pointers and397 initial bomb callbacks still land on named code entries. Desktop/mobile Chromium checks pass for both pages, five source comments and five evidence images. Binary, documentation and listing checks pass; all19 minisites build.
