# Skate or Die! - TODO

The branch is an in-progress analysis, not a publishable Silver. The
contributor identified the model as `gpt-6-sol`, which is on the kit's
proven-model list. Coverage and verification still need to be completed.

## Evidence and image coverage

- Capture Freestyle gameplay and a natural route to its town entrance. The
  current town snapshot's right-hand exits repeatedly selected High Jump;
  poking `$2F/$30` changed the skater position but not the selected event.
- Capture Joust gameplay after the opponent selector, and exercise Race,
  Jam and High Jump beyond their starting screens. Test practice, sign-in,
  competition, scores, controls and disk writes from `features.md`.
- Capture the loader hand-over and map resident code versus each event
  overlay. `listing.json` uses only `work/highjump-play.vsf` and must not be
  treated as the other events' source.
- Resolve loaded-but-untracked authored data before trusting a 100% ledger.
  The High Jump symbol graph initially tracked only 3,612 bytes; the disk
  pair and event overlays contain much more.

## Current High Jump burn-down

Run `python3 kit/scripts/coverage.py games/c64/skate-or-die --live` after
exporting the current disassembler session. Work the largest undescribed
routines and tables first, then audit all pointer tables and excluded RAM.
The latest High Jump snapshot figure is 34.3% of 11,661 tracked bytes after
excluding zero-page runtime state and tracing the SID and nine phase-handler
tables. It is not whole-game coverage; tracing new pointer targets can
increase the denominator again. The largest current runs include high-RAM
loader code/data, the event movement routine at `$1834`, graphics tables,
and code reached only through the state dispatch.

The kit has a single 16-bit symbol map and one snapshot-backed listing per
game. Skate or Die! has distinct event overlays that reuse addresses. A
maintainer must choose or approve a representation for those overlays
before one Source tab and a 100% game-wide coverage figure can be honest.
Keep this as a maintainer ask in the PR description if no issue may be filed.

## Publication

Finish `facts.md`, verify every feature or mark it explicitly open, build a
non-placeholder `index.html`, complete `game.json`, run the retrospective,
all three checks and the site build. The contributor wants to review before
any pull request is opened.
