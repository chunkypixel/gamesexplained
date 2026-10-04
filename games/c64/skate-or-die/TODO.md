# Skate or Die! - TODO

The branch is an in-progress analysis, not a publishable Silver. The model
identifier is `unknown`, so even a complete agent run requires the
maintainer check in `kit/CHECKING.md` before the tier can be Silver.

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
The latest High Jump snapshot figure is 56.3% of 4,798 tracked bytes after
excluding zero-page runtime state and tracing the SID command tables. It is
not whole-game coverage; tracing new pointer targets can increase the
denominator again.

## Publication

Finish `facts.md`, verify every feature or mark it explicitly open, build a
non-placeholder `index.html`, complete `game.json`, run the retrospective,
all three checks and the site build. The contributor wants to review before
any pull request is opened.
