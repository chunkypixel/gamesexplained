# Skate or Die! — kit feedback

Written in the retrospective (`kit/skills/core/80-retro`). The run took the
High Jump load to Silver on 4 October 2026, under the interim policy of one
declared load per game (RFC #124), on kit 0.0.74.

## Skill text that changed what I did

- `50-coverage`: "The emulator's executed-address map: every address the CPU executed": seven simulated practice runs gave the floor, and it found the sound scripts' machine-code helpers, which are reached only through the bytecode and one of which was typed as data.
- `60-verify`: "Draw a random sample of about 60": the audit sampled 60 comments over every agent's range and found four with a wrong detail, which the auditing agent rewrote; the rate (6.7 %) is in `facts.md`.
- `50-coverage`: "Correct the brief the moment a fact in it turns out wrong": four leads in the brief (the NMI vector as a sample player, the end-of-run wait, the CPU port value, a routine's name) were corrected while agents ran, and the reports confirmed each correction.
- `50-coverage`: "Find every call site of every such routine, type the argument bytes as data": the status-line printer at `$1242` eats the string after its call; typing it removed a bogus block in the bitmap.

## What I changed in the kit

- `kit/skills/core/50-coverage/SKILL.md`, "Inline parameters": a typed argument is decoded again by any later trace that reaches the call; check every call site after each agent's export. Lesson: `kit/lessons/2026-10-04-skate-or-die.md`.
- `kit/skills/core/60-verify/SKILL.md`, "Measuring without fooling yourself": a value the code never writes came from the loaded file; find it there before describing it. Lesson: `kit/lessons/2026-10-04-skate-or-die.md`.
- `kit/c64/check_emulator.py`: `-h` and `--help` print the usage and stop. They used to run the whole check, which hard-resets the machine; this run, a request for usage reset the paused machine.
- `kit/scripts/check_docs.py`: a game's title is matched without `\b` at its ends, so a title ending in punctuation (`Skate or Die!`) is found in its lesson heading. The lesson file failed the check before.

## What cost the most time

Kit 0.0.74 has no clock, so there is no timings table. By the session's own
reckoning the longest parts were the seven annotation agents (the sound
scripts and the ramp physics), the live tests of pumping and height, and
building the in-page music player and its test against the game.

The one change to the kit that would have saved the most minutes: the
`50-coverage` warning that typed inline arguments are decoded again by later
traces, which cost two rounds of finding and clearing the same bogus block.

## Operating system and tools

- Linux x86_64, a hosted cloud container.
- VICE 3.13.1 (the project's Linux release): 56 of 57 checks passed;
  `pause-at-instruction` failed, as `tool-vice-mcp/workarounds.md` records
  for Linux.
- regenerator2000 0.9.20.
- A headless Chromium click on the music page's player did not advance its
  clock. The player's driver is checked in Node instead (`tests/music.js`):
  over 15,000 frames its SID writes match the game's own, in order.

## Candidates

- A seed or counter the code never writes, on a multi-load game, can differ
  between the snapshot and the file on disk. Written into `60-verify` this
  run; another multi-load game that meets it should add its case there.

## Maintainer asks

None from this run.
