# Spy vs Spy — features

Read this before annotating code. What the game is documented to do, with
verification status against the binary. Statuses: **open** (documented,
not found yet), **traced** (in the code, could not be exercised; say what
was tried), **confirmed** (in the code, consistent with the emulator),
**live** (observed directly), **differs** (the code does something else).
"Absent" is not a status.

Sources:

- The manual of the Avantage/Accolade edition (Commodore 64, Apple II and
  Atari, copyright 1985 First Star Software), as scanned on the Internet
  Archive, `https://archive.org/details/Spy_vs_Spy_1984_First_Star_Software`,
  read in its OCR text (`..._djvu.txt`) on 9 October 2026. Where it
  speaks for all three machines, the Commodore's own lines (joystick
  only; F5, RUN/STOP, S, space) are the ones used. Marked "(manual)".
- C64-Wiki, `https://www.c64-wiki.com/wiki/Spy_vs_Spy`, read 9 October
  2026: credits (Michael Riedel, music Nick Scarim), the trap and remedy
  table, fight controls. Marked "(wiki)".
- Wikipedia, `https://en.wikipedia.org/wiki/Spy_vs._Spy_(1984_video_game)`,
  and `https://c64.krissz.hu/spy-vs-spy/play-online/`, read 9 October 2026,
  for release dates and the scoring table, which agrees with the manual.
- Lemon64's transcription of the manual refused automated requests (HTTP
  403), 9 October 2026. A PDF served as the "C64 manual" by
  `api.regvault.org` turned out to be the manual of the sequel, *The
  Island Caper*, and was not used.
- The game's own screens in the emulator (NTSC, `orientation.md`),
  9 October 2026, marked "live".

## Features

| Feature | Status | Where |
|---|---|---|
| Title picture: MAD Magazine's Official Spy vs Spy, by Mike Riedel, First Star Software, 1984 | live | the loader's file `S1`/`S2` (`orientation.md`); `reference/title.png` |
| Options screen in "the top room": number of players, difficulty level, computer IQ (one player only), airport hidden till the end (manual) | live | `reference/options.png`: `NUMBER OF PLAYERS`, `LEVEL OF DIFFICULTY`, `COMPUTER IQ (1 PLAYER)`, `HIDE AIRPORT TILL END`, with the level's rooms (06), traps (12) and minutes (07) |
| Up/down moves the option cursor, left/right changes the setting, fire or space starts (manual; the lower monitor says the same) | open | |
| Joystick port 2 drives the white spy, port 1 the black (the options screen's own text) | open | |
| Simulvision: split screen, white spy above, black below, both shown in either game (manual) | live | `reference/play.png`; a raster split at line 151 changes the background colour (`orientation.md`) |
| Simulplay: both spies move at once; in one-player games the computer plays black (manual) | live | |
| Embassy: a randomly generated maze of rooms on a grid, size by level (manual: "selectable, yet randomly generated") | open | |
| Rooms drawn in 3D; up moves to the back of the room, down to the front (manual) | open | |
| Doors on left, right, back and front walls; fire opens a closed door (manual) | open | |
| A room is drawn as a dashed outline first, then filled in, when a spy enters it | live | `work/shots/menu1.png` |
| Searching furniture: in range a short tone and a flash; fire opens or lifts it (manual) | open | |
| Items to collect: passport, money, key, secret plans, and the briefcase to hold them; one of each per game; never in a remedy's place (manual) | open | |
| Carrying: one thing at a time except inside the briefcase; an item found without the briefcase is carried in a white satchel and flashes on the trapulator (manual) | open | |
| Trapulator: clock at the top, six buttons (bomb, spring, water bucket, gun and string, time bomb, map), inventory row of passport, money, key, plans (manual) | live | `reference/trapulator-arrow.png`: fire twice shows a yellow arrow on the buttons |
| Fire twice opens the trapulator; the stick moves the arrow; fire takes the trap (manual) | live | the arrow appears after two presses and moves with the stick |
| Traps: bomb and spring anywhere but a door; water bucket and gun with string on a closed door only; time bomb anywhere, armed at once, 15 seconds, cannot be carried or defused (manual) | open | |
| Setting a trap costs time, with beeps while the clock deducts it (manual) | open | |
| A trap victim loses 7 seconds of real time and 20 of game time, 27 in all; the other spy laughs (manual) | open | |
| Number of traps limited by level ("total traps available..12" on level 1) | open | |
| Remedies: water bucket (red fire box, left wall) for the bomb, wire cutters (white tool box, right wall) for the spring, umbrella (coat rack) for the water bucket, scissors (first-aid kit, back wall) for the gun (manual) | open | |
| Map button: the embassy's rooms, the spy's room blinking, visited rooms filled, a dot where a needed item is; not the other spy, not the other floor (manual) | open | |
| Clock: both start with equal time; time lost to traps and fights never comes back; the red light flashes when time is nearly out (manual) | live | both clocks start at 7 minutes on level 1 (`reference/options.png`, `06:59` a second in) |
| The two can never run out of time together; the survivor plays on; the dead spy's traps stay (manual) | open | |
| Hand-to-hand combat when both are in one room: one monitor goes blank, the other shows both (manual) | live | `reference/combat.png` |
| In combat: no searching, no trapulator; doors and door traps work (manual) | open | |
| Club: hold fire, stick up to down hits the head, left/right jabs; about 7 blows kill; strength recovers over time (manual) | open | |
| A spy carrying something into a shared room drops it: traps and remedies lost, items and briefcase hidden in the room (manual) | open | |
| Both spies start each game in the same room, a few steps apart (manual) | live | `reference/combat.png`: the game opens in combat |
| Exit: one marked door; the airport guard stops a spy without all four items (manual) | open | |
| Airport: the spy who leaves with everything reaches the plane; a ranking is shown | live | `reference/airport-ranking.png`: the computer's black spy escaped, `2045` and `YOUR RANKING: AVERAGE GUY SPY` |
| Hide airport till end option (manual) | open | |
| Split-level embassies: two floors, ladders (fire lowers or raises), holes under rugs (fire lifts the rug) (manual) | open | |
| "Bread crumbs": arrows below the room pointing the way back, up to 9 rooms, not on the higher levels (manual) | live | arrows show under the black spy's room in `reference/play.png` |
| Scoring: +80 win a fight, −20 lose one, +30 place a trap, −80 trap victim or the guard's boot, +60 steal an item, −70 call up the map, +40 use a remedy (manual) | open | |
| Rank at the end of each game, with bonus points and time penalties (manual) | live | `AVERAGE GUY SPY` with 2045 points; the other ranks are open |
| F5 returns to the options screen (manual) | live | pressed during play, the options screen came back |
| RUN/STOP pauses (manual) | open | |
| S turns the music off and on again (manual) | open | |
| Music by Nick Scarim (wiki) | open | |
| Spy sounds and the laugh when a trap goes off (manual) | open | |
| Computer IQ levels (manual) | open | |
| Difficulty levels change rooms, traps and minutes (options screen) | open | |
| Copy protection: the loader expects read errors 21 and 23 from the original disk and formats the disk on failure | traced | `S0` at `$6114` (`orientation.md`); not annotated, by policy |

## Beyond the documentation

Found in the code, not in the manual.

- The game runs only on NTSC machines: a 60 Hz timing loop at `$8E38`
  restarts for ever on PAL (`orientation.md`).

## Open questions

- After loading on NTSC, one boot showed both spies in rooms with the
  clocks at `-20:53` before any key was pressed: an attract mode, or a game
  the options screen starts by itself after a wait? Not reproduced at the
  hand-over boot, which reached the options screen and waited.
