# Uridium — kit feedback

Written in the retrospective (`kit/skills/core/80-retro`). Which skill text
changed what the run did, what the skills and kit got wrong or left out,
what was changed, what needs a maintainer's decision, what cost the most
time, operating system and tool versions.

## Skill text that changed what I did

- `kit/skills/c64/tool-vice-mcp`: "When a loader hangs, look at the drive": I read the drive's program counter and RAM, found both processors waiting on each other, and from there the protection's drive code.

## What was changed in the kit

None.

## Candidates

None.

## Maintainer asks

None.

## What cost the most time

A note in `tool-vice-mcp` that a G64 can load to its loading screen and deadlock because the image does not keep the sync lengths a protection times, with the tell (both processors parked on the serial bus, the loader overwritten by its own file).
