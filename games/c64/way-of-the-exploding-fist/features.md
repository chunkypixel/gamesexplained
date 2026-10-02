# Way of the Exploding Fist — features

Read this before annotating code. What the game is documented to do, with
verification status against the binary. Statuses: **open** (documented,
not found yet), **traced** (in the code, could not be exercised; say what
was tried), **confirmed** (in the code, consistent with the emulator),
**live** (observed directly), **differs** (the code does something else).
"Absent" is not a status.

Sources:

- The contributor allowed looking the game up online. On 2 October 2026
  this session's network refused every page fetch (C64-Wiki, the Internet
  Archive's Wayback Machine and search, Wikipedia: HTTP 403 from the
  proxy). What is below from the web comes from web search result
  summaries, read the same day, of these pages: C64-Wiki,
  `https://www.c64-wiki.com/wiki/The_Way_of_the_Exploding_Fist`;
  Wikipedia, `https://en.wikipedia.org/wiki/The_Way_of_the_Exploding_Fist`;
  Lemon64's manual page, `https://www.lemon64.com/doc/way-of-the-exploding-fist/665`;
  the World of Spectrum inlay (a Spectrum document);
  `https://frgcb.blogspot.com/2021/01/the-way-of-exploding-fist-melbourne.html`.
  They are second-hand: leads, weaker than a page.
- Credits, from those summaries: designed by Gregg Barnett, written by
  Beam Software, programming by Gregg Barnett and David Johnston,
  graphics by Greg Holland, music by Neil Brennan; published by Melbourne
  House, June 1985. The game carries no credits of its own.
- The game's own screens in the emulator, 2 October 2026
  (`reference/`).

## Features

| Feature | Status | Where |
|---|---|---|
| Attract mode: the computer fights itself under `DEMO`, cycling through the backdrops | live | `reference/demo.png`, `demo-lake.png`, `demo-dojo.png`, `demo-buddha.png` |
| F1 starts a game; F5 abandons it and returns to the attract mode | live | |
| F3 switches between `1 PLAYER` and `2 PLAYER` | live | `reference/options-2player.png` |
| F7 switches between `JOYSTICK` and `KEYBOARD` control | live | `reference/options-keyboard.png` |
| Fire on joystick port 2 starts a one-player game from the attract mode | live | |
| 18 movements from the joystick, eight directions with and without fire: a jump, punches high, middle and low, a crouch, two somersaults, a turn-round ("about-face"), walking and blocking, and eight kicks (flying, high, mid or roundhouse, low, back and others). The summaries disagree on which direction gives which move: read it from the input routine | open | |
| Keyboard controls, the alternative to the joystick: which keys | open | |
| Two players fight each other, one stick each | open | the option is live; which port is which, open |
| Scoring with yin-yang symbols: a loosely timed blow earns half a symbol, a clean one a whole; two whole symbols win the bout | open | the symbols are live above each fighter (`reference/play-novice-knockdown.png`) |
| A bout lasts 30 seconds on a counter at the top; when time runs out the referee decides | open | the counter is live, starting at 30 |
| Points scored per blow, shown for each player, and a high score | open | the score digits are live |
| Ranks from novice to tenth dan, each opponent harder than the last | open | `NOVICE` is live |
| The backdrop changes with progress: Fuji with a pagoda and a torii, a lake under a volcano, a dojo, a Buddha statue | live | the four seen in the attract mode; whether play visits them in that order, open |
| A bonus round in which a bull charges and must be felled with one blow. The summaries say some early C64 versions lack it | open | |
| A computer opponent that fights back: left idle, the player is floored within seconds | live | `reference/play-novice-knockdown.png` |
| A shadow under a fighter in the air | live | `reference/jump-shadow.png` |
| A shout ("kiai") during loading, from the loader; the disk carries `m.spchtbl` and `m.tsound` | open | |
| Music by Neil Brennan | open | |
| Sound effects on and off with DEL (the menu program's text) | open | |

## Beyond the documentation

Found in the code, not in the manual.

## Open questions

- Does the game read the disk again after the hand-over (for a backdrop,
  or the bull)? The four backdrops all appeared in the attract mode
  without a visible pause for loading.
