# Qix — features

Read this before annotating code. What the game is documented to do, with
verification status against the binary. Statuses: **open** (documented,
not found yet), **traced** (in the code, could not be exercised; say what
was tried), **confirmed** (in the code, consistent with the emulator),
**live** (observed directly in the emulator), **differs** (the code does
something else). "Absent" is not a status.

Sources:

- Taito America, *Qix: Loading & Game Play Instructions*, the Apple IIGS
  manual of the 1989 series (04-0009-13), OCR text at
  https://archive.org/details/Qix-Manual, read 10 October 2026. No C64
  manual was found; this one is for another machine of the same series,
  so its keys and screen layout are not the C64's, and every row taken
  from it says so.
- Internet Archive item `d64_Qix_1989_Taito` (its MobyGames
  description only; no file was downloaded),
  https://archive.org/details/d64_Qix_1989_Taito, read 10 October 2026:
  developed by Taito America, published by Taito, 1989; slow and fast
  draw, Sparx, the Fuse.
- Internet Archive item `tim-follin-qix-c64`, a recording of the C64
  music credited to Tim Follin and dated July 1989,
  https://archive.org/details/tim-follin-qix-c64, read 10 October 2026.
  Only its catalogue record was read.
- C64-Wiki has no page for Qix (404, 10 October 2026). Lemon64 refused
  the fetch (403), and the Wayback Machine's copy of it could not be
  reached (connection reset) on the same day; MobyGames refused (403).
- The game's own screens: the loading screen (Alien Technology Group),
  the title picture, the menu, the play screen.

## Features

| Feature | Status | Where |
|---|---|---|
| The player's marker (the Stix) moves along the edges; holding fire and pushing away from the edge starts a slow draw (IIGS manual) | live | from `play-round1.vsf`: fire and up for 120 frames drew a line about 30 pixels long, the marker a white diamond |
| Releasing fire while drawing starts a fast draw (IIGS manual) | live | fire for 10 frames then up alone for 110 drew about 58 pixels, the marker red |
| A closed shape is filled and claimed; a slow draw scores twice a fast draw (IIGS manual) | open | |
| Required claim: 65 % on level 1, rising with the level (IIGS manual) | live | the panel shows `CLM 65%` and `LVL 1` at the start |
| 1,000 bonus points per percent claimed over the requirement (IIGS manual) | open | |
| Three lives per player (IIGS manual) | open | |
| A life is lost when the Qix touches an unfinished line, or a Fuse, Sparx or Spritz touches the marker (IIGS manual) | open | |
| Sparx travel the edges; two new Sparx each time the timer runs out ("the line disappears"); on higher levels Sparx follow the marker up its line once the alarm rings (IIGS manual) | open | |
| The Sparx timer shrinks during play; the IIGS manual puts it above the play area | live (C64 differs in layout) | on the C64 it is the vertical bar to the right of the play area, between the field and the panel; it shrinks from the top |
| The Fuse travels along the line being drawn when the marker stops (archive description) | open | |
| Spritz: a sub-virus; trapping one in a fill is worth 500 points and turns later fast fills into slow points until the player dies (IIGS manual) | open | |
| Splitting two Qix multiplies the points of later fills (IIGS manual) | open | |
| An extra life every 50,000 points (IIGS manual) | open | |
| High-score table, "the QIX Hall of Fame", initials typed in (IIGS manual) | open | |
| One player, two players, or a one-player practice game, chosen with the stick and fire (IIGS manual; the C64 menu reads `1 PLAYER`, `2 PLAYER`, `PRACTICE`, `USE JOYSTICK TO SELECT OPTION`) | live | the menu after the title |
| Pause (ESC on the IIGS); restart and reboot keys (IIGS manual) | open | the C64's keys are not documented |
| Status panel: lives, required claim, completed claim, level (IIGS manual) | live | right of the field: `QIX` logo, `CLM`, `65%`, `0%`, `LVL 1`; the lives are not identified yet |
| Score at the top of the screen (IIGS manual) | live | `PLAYER 1 0` |
| Title music by Tim Follin (archive recording's catalogue record) | open | the title's interrupt calls `$E006` each frame |

## Beyond the documentation

## Open questions

- What the files `SCENE` and `TAITO` hold, and when they are loaded: not
  on the way from power-on to the first round.
- What the files `TITLE1` and `TITLE2` hold: both load at `$7F00` and
  are overwritten by `ALIEN`.
