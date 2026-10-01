# Impossible Mission — verified technical facts

Current truth for this game. The workflow lives in `kit/skills/`; how this
understanding developed lives in `agent-history.md`. Every fact names
the routine or table it comes from. Unless marked *live*, a fact comes
from reading the code in the snapshot named in `orientation.md`.

## Build

## Memory layout

| Thing | Where |
|---|---|

## Timing

## Controls

## Graphics

### Text alphabets

The game keeps no text in PETSCII or screen codes. It has two character
sets in video bank 1, each with its own letter order, and stores every
string in the order of the set that will draw it.

| Set | Letters | Digits | Other |
|---|---|---|---|
| `$4800`-`$4FFF` | A-Z = `$71`-`$8A` | 0-9 = `$8B`-`$94` | space `$53`, `.` `$FE`, `*` `$95`, `=` `$96`, `>` `$97` |
| `$5800`-`$5FFF` | A-Z = `$66`-`$7F` | 0-9 = `$80`-`$89` | space `$53`, `:` `$F6` |

Read from the glyphs in `play-room1.vsf` (`work/gdump.py`). The two sets
hold the same letter shapes eleven glyphs apart: `$4800`'s A is at
`$4B88`, `$5800`'s at `$5B30`.

Strings in the `$4800` order: the security terminal's menu (`$A01E`-`$A0DD`:
SECURITY TERMINAL, SELECT FUNCTION, RESET LIFTING PLATFORMS IN THIS ROOM.,
TEMPORARILY DISABLE ROBOTS IN THIS ROOM., LOG OFF.), PASSWORD REQUIRED and
PASSWORD ACCEPTED (`$A229`-`$A24E`), the end-of-game tally and high score
(`$B8A7`-`$B979`), and the name entry (`$BD99`-`$BDE0`: ENTER YOUR I.D.
CODE ON THE KEYBOARD, HIT RESTORE OR RUN/STOP FOR NEW GAME).

Strings in the `$5800` order: the nine-letter password words
(`$208E`-`$20D5`), the pocket computer's `SNOOZES:0 LIFT INITS:0`
(`$3431`) and its messages (`$7C46`-`$82B7`).

## Mechanics

## Data tables

## Sound

## Live tests
