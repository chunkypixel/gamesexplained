# Jumpman gap follow-up — 3 October 2026

This **self-audit** follows the 20-fact/10-routine sample. It closes several specific gaps without claiming independent certification or a complete playthrough. The original input hashes are in `checks/inputs.json`; [machine-readable results](reference/gap-verification.json) identify the baseline, edited artifacts, native comparisons and replay states.

## Findings and corrections

- **Hot Foot's stamp erases scenery.** The old annotation and factual note mistook nonzero shape-record fields for collectible pixels. Parsing the eight records at `$32BB-$32E7` finds 20 pixel values, all zero. The original renderer erases exactly 20 pixels on a filled-bitmap control, confirmed in native VICE. A normal RIGHT+FIRE jump from the selected level's initialized state erases 16 occupied pixels: ten solid and six climbable. Four shape pixels were already empty. The corresponding no-input control reaches ten game services with no accepted stamp and no bitmap change.
- **Two more names preceded their actual entries.** Hot Foot's effect name was on `$3213` (`RTS`); its stored header pointer is `$3214`. Runaway's collection name and fact link were on `$3385` (`JMP $32E5`); the actual callback begins at `$3388`. Controlled original-code and native calls distinguish both pairs. Native disassembler edits, saved-project exports and regenerated listings correct the labels, comments and page notes. All existing listing bytes, boundaries, types and instructions remain unchanged. Native reload coalesces adjacent same-type blocks; per-byte classifications remain identical.
- **Runaway can collect during death.** Its collection callback rejects life state2 but accepts dying state1. Controlled CPU/native cases verify both accepted states, the rejected state and the hazard-pulse gate. A neutral native replay reaches a real player/flying-bomb collision while dying: score0→100 and bombs12→11. This is an observed quirk, with no claim about designer intent.
- **Runaway's deferred drawing has concrete overflow boundaries.** It pushes six-byte records and consumes the newest first. Original-code tests fill and drain depths1…44: 43 records remain intact, while record44 begins at wrapped offset2 and overlaps old fields. In the supplied sequence, pop43 reads drawing pointer `$079A` instead of `$319A`. Tests stop before drawing through the corrupted pointer. After128 uninterrupted pushes the offset wraps to zero and the service treats the stack as empty. Selected boundary states agree in native VICE. A 600-frame neutral replay has17 enqueue calls,600 pop-service entries and at most one pending record at sampled frame boundaries. This neither bounds values between samples nor establishes a naturally reachable overload.

The page, factual ledger and source comments state the corrected behavior. This report preserves what the audit found; fixing those errors does not make the earlier sample an independent passing review.

## Checks

[checks/entrypoints.js](checks/entrypoints.js) reads all 32 original overlay headers and all397 initial bomb records. After correction, all **179 nonzero header pointers and397 bomb callbacks** land on named code-record boundaries. PLF13's known missing sentinel is handled explicitly. The check does not prove the meaning of every name, nor cover every later callback rewrite.

[checks/private-gaps.js](checks/private-gaps.js) verifies its original PRG inputs and makes **2,116 original-routine calls**. These include every drawing-stack depth1…44, a128-push wrap, both old/new entry pairs, collection-state gates and the stamp payload. **Thirteen selected cases** also match native VICE3.13.2 PAL. Native setup restores the original code, supplies declared RAM/register inputs, masks interrupts, clears decimal mode and verifies a stopping checkpoint before reading results. Controlled overloads are separate from the ordinary-input observations.

Both input routes use the previously captured initialized selected-level snapshots, not a campaign route. Hot Foot starts with50 neutral PAL frames, then RIGHT+FIRE until accepted stamp `$3225`, releases input and stops at `$32B3`. Runaway starts with220 neutral frames, keeps neutral input and stops at accepted collection `$33A5`, then `$33DB`. There are no subsequent game-state/register edits. Snapshot hashes and states are in the report. The [Hot Foot](reference/hotfoot-after-stamp.png) and [Runaway](reference/runaway-dying-collection-after.png) screenshots are captured four frames after those post-event checkpoints; exact event comparisons come from the stopped memory reads.

## Reproduce

Use the disk extraction instructions in [audit.md](audit.md) with your own identified original image. From the repository root:

```sh
node games/c64/jumpman/checks/entrypoints.js --disk-dir games/c64/jumpman/work/audit-inputs --report games/c64/jumpman/work/entrypoints.json
node games/c64/jumpman/checks/private-gaps.js --disk-dir games/c64/jumpman/work/audit-inputs --report games/c64/jumpman/work/private-gaps.json
```

The checks need no author snapshot and download nothing. Optional `--native-cases <private JSON>` on the second command writes replay inputs and expected regions; that generated file may contain original source excerpts and must stay private. The command itself does not start VICE. Native replay helpers and raw snapshots remain under ignored `work/gaps-2026-10-03/`.

Still open: subsequent movement through Hot Foot's holes, simultaneous Runaway multi-bomb collisions, an ordinary route to stack overload, full level completion, and the other scoped questions in `TODO.md`. Independent review remains the separate submission check.

Regression checks also match all90,583 included source bytes and9,498 decoded instructions,32 initial bitmap renders and1,191 bomb comparisons, and all65,536 Randomizer inputs. Focused Chromium checks pass at desktop/mobile widths for both pages, the corrected source entries, the technical facts and evidence link. Binary, documentation and listing checks pass; all19 minisites build.
