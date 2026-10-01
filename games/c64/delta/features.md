# Delta — features

Read this before annotating code. What the game is documented to do, with
verification status against the binary. Statuses: **open** (documented,
not found yet), **traced** (in the code, could not be exercised; say what
was tried), **confirmed** (in the code, consistent with the emulator),
**live** (observed directly), **differs** (the code does something else).
"Absent" is not a status.

Sources:

- The contributor allowed looking the game up online, but on
  1 October 2026 this session's network policy refused every page fetch
  (c64-wiki.com, en.wikipedia.org, lemon64.com via web.archive.org,
  archive.org, zzap64.co.uk: HTTP 403 at the proxy). What follows from
  the web is what a web search engine's result summaries quoted from
  these pages on that date, so it is second-hand and kept to plain claims:
  - C64-Wiki, "Delta", https://www.c64-wiki.com/wiki/Delta
  - Wikipedia, "Delta (video game)", https://en.wikipedia.org/wiki/Delta_(video_game)
  - Lemon64, "Delta", https://www.lemon64.com/game/delta, and its review
    https://www.lemon64.com/review/delta/37
  - Zzap!64 review, https://www.zzap64.co.uk/c64/gow8.html
  - CSDb, "Delta Mix-E-Load", https://csdb.dk/sid/?id=14300
- The game's own screens, captured in the emulator on 1 October 2026
  (`reference/`). No manual was read.

## Features

| Feature | Status | Where |
|---|---|---|
| Horizontally scrolling shoot 'em up: the player's ship flies right through space, starfield behind | live | `reference/wave1-start.png`; ship at the left, stars and enemies move past |
| Enemies come in waves (formations) | live | `reference/wave1-formation.png` |
| Shooting a whole formation usually earns a credit ("most of the time", per C64-Wiki) | open | |
| Between waves, a group of icons appears ("a corner shop in space"); blue icons are bought by flying over them, spending credits | open | |
| Grey icons kill the ship on contact | open | grey blocks flying past are seen, and the ship dies among them (`reference/grey-blocks.png`); not yet shown to be the shop's icons |
| Only one extra can be chosen per shop | open | |
| Power-ups: higher speed, faster rate of fire, among others | open | |
| When a power-up is picked up, the icon of the skill being improved animates for a while in the row at the bottom of the screen | open | the row of eight icons is on every play screen |
| Named sections of the region after the alien waves, with hazards at the top and bottom of the screen that match the section's name | open | |
| 32 levels (Wikipedia, via search) | open | |
| One or two players; the panel shows `1 UP` and `2 UP` with score and lives each | live | `reference/wave1-start.png`; fire starts a one-player game; how two players start is not found yet |
| Lives: three at the start; "Fasten your seatbelt Player 1" before each life | live | `reference/fasten-seatbelt.png` |
| Game over, then high-score entry by initials when the score qualifies | live | `reference/game-over.png`, `reference/high-score-entry.png` |
| Title, top-scores table (four entries: Stavros, Andrew, Gary, Thalamus) and a demo ("Shoot aliens and collect weaponry") in turn | live | `reference/title-screen.png`, `title-top-scores.png`, `attract-demo.png` |
| Music by Rob Hubbard | open | |
| Mix-E-Load: the loader lets the player remix Hubbard's loading music in real time (Gary Liddon and Rob Hubbard, from an idea of Nick Pelling) | open | belongs to the original disk/tape loader; this crack has its own loader instead, so it is probably not in this image (see Open questions) |
| Published in the US as "Delta Patrol" by Electronic Arts | open | not a feature of this image; noted for the About tab |
| Pause | open | the code at `$9A4E` reads RUN/STOP and `$9AC1` the T key (row 2, column 6); to be traced |

## Beyond the documentation

Found in the code, not in the manual.

- The joystick is read on **both** control ports, ORed together, into
  five flags at `$10FA`-`$10FE` (fire, up, down, left, right): routine
  at `$3375`.
- A keyboard scan at `$0C40` fills the same flags from keys (row 0
  RETURN, row 1 W and A, row 2 D and X) when `$0FFC` is set; to be
  traced.

## Open questions

- Is any of the Mix-E-Load loader in this image? The crack replaces the
  loader; a search for its music player is for the sweep.
- How does a two-player game start?
- The shop: what triggers it, where its icons and prices live.
