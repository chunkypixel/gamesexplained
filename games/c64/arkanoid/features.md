# Arkanoid — features

Read this before annotating code. What the game is documented to do, with
verification status against the binary. Statuses: **open** (documented,
not found yet), **traced** (in the code, could not be exercised; say what
was tried), **confirmed** (in the code, consistent with the emulator),
**live** (observed directly), **differs** (the code does something else).
"Absent" is not a status.

Sources:

- The contributor said yes to looking the game up, but this run's
  network refused every page fetch on 5 October 2026: C64-Wiki
  (`https://www.c64-wiki.com/wiki/Arkanoid`), the Wayback Machine,
  the Internet Archive, Wikipedia (`https://en.wikipedia.org/wiki/Arkanoid`)
  and `c64online.com`. What could be read were the result summaries of a
  web search engine, 5 October 2026, which quote or paraphrase C64-Wiki,
  Lemon64 (`https://www.lemon64.com/game/arkanoid`), Wikipedia, GameFAQs
  and the VGMPF wiki. Rows marked "(search)" come from those summaries:
  second-hand, and many describe the arcade original, not this
  conversion. Each is a claim to check against the code like any other.
- The game's own screens, read in the emulator, 5 October 2026.

## Features

| Feature | Status | Where |
|---|---|---|
| Title picture: IMAGINE / TAITO, the ship Arkanoid and the Vaus, signed "Jones" | live | `reference/title.png` |
| Input menu: Neos mouse, joystick, keyboard or paddles; 1 or 2 devices; 1 or 2 players; chosen by first letter (N J K P D 1 2); fire starts; "disconnect mouse to select option" | live | `reference/menu.png` |
| Joystick: fire on port 1 starts the game from the menu | live | `orientation.md` |
| Story text before round 1 ("The era and time of this story is unknown…") | live | `reference/story.png` |
| Attract mode: the game plays itself (round 5 seen) with both players' panels | live | |
| Two players, alternating, each with score, lives and round in a panel | open | |
| The Vaus (the bat) moves left and right; the ball bounces off it, the walls and the bricks | open | |
| The bounce angle depends on where the ball meets the Vaus (search, arcade) | open | |
| Ball speed rises as the round goes on (search, arcade) | open | |
| 33 rounds; round 33 is DOH, the boss, hit about 25 times (search) | open | |
| 32 rounds of bricks (search) | open | |
| Bricks of several colours; silver bricks take several hits; gold bricks cannot be destroyed (search, arcade) | open | |
| Capsules fall from broken bricks; catching one gives its power (search) | open | |
| S: slow the ball (search) | open | |
| E: enlarge the Vaus (search) | open | |
| D: disruption, the ball splits into three (search) | open | |
| L: laser, the Vaus fires (search) | open | |
| C: catch, the ball sticks to the Vaus until fire (search) | open | |
| B: break, an exit opens on the right and passing through it ends the round, with a bonus (10,000 in the arcade) (search) | open | |
| P: an extra Vaus (search) | open | |
| Enemies drift down from gates in the top wall and are destroyed by the ball or the Vaus (search, arcade) | open | |
| Score, high score, lives and round shown beside the playfield | live | `reference/` play screenshots |
| Four lives at the start (this game's panel) | live | the panel reads LIVES 4 at round 1 |
| Music by Martin Galway; the C64 theme played samples on a fourth voice, the first published sampled sounds on the C64 (search) | open | |
| Code by David A. Collier, graphics by Mark Kevin Jones (search) | open | the title picture is signed "Jones" |
| Cheat: `POKE 39801,189` then `SYS 4096` for unlimited lives (search, source page not read) | open | `$9B79`; `SYS 4096` is `$1000`, which presumes a restart entry there |
| Paddles, Neos mouse and keyboard control (search; also the menu) | open | |
| High-score table with name entry (Galway's "High Score Music") (search) | open | |

## Beyond the documentation

Found in the code, not in the manual.

## Open questions

- Which release is this? The upload's name says 1988; the menu says
  "© TAITO 1986 © IMAGINE 1984", and Zzap!64 reviewed the C64 version in
  April 1987 (search).
