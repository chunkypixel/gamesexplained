# Impossible Mission — features

Read this before annotating code. What the game is documented to do, with
verification status against the binary. Statuses: **open** (documented,
not found yet), **traced** (in the code, could not be exercised; say what
was tried), **confirmed** (in the code, consistent with the emulator),
**live** (observed directly), **differs** (the code does something else).
"Absent" is not a status.

Sources:

- The contributor said yes to looking the game up, but this run's
  network refused every page it tried on 1 October 2026: C64-Wiki
  (`https://www.c64-wiki.com/wiki/Impossible_Mission`, over HTTPS and plain
  HTTP), Wikipedia, the Internet Archive and its Wayback Machine, Lemon64
  (game page and manual, `https://www.lemon64.com/doc/impossible-mission/301`),
  MobyGames, GameFAQs, StrategyWiki, manualzz and the fan site
  `impossible-mission.krissz.hu`. What could be read were the result
  summaries of a web search engine, 1 October 2026, which quote or
  paraphrase those pages and the manual. Everything below marked
  "(search)" comes from those summaries: second-hand, and each row is
  to be checked against the code like any other claim.
- The game's own screens, read in the emulator, and its stored text, decoded in `30-text` (`facts.md`, Text alphabets), 1 October 2026.

## Features

| Feature | Status | Where |
|---|---|---|
| Loading screen: three framed panels, EPYX PRESENTS / IMPOSSIBLE MISSION / LOADING | live | loader, `orientation.md` |
| Title state: the agent stands in a lift; fire on joystick port 2 starts the game | live | |
| Speech: "Another visitor. Stay a while, stay forever!" at the start (search) | open | |
| Speech: "Destroy him, my robots!" and other lines, six in all, two of them a scream as the agent falls and Elvin's laugh (search) | open | |
| Speech data is digitised samples by Electronic Speech Systems, played without extra hardware (search) | open | file `words`, `$E000`-`$F77F` |
| Six hours of game time to finish; the clock runs on the pocket computer (search); the pocket computer shows a clock, `12:14:06` at the first start of this run | open | |
| Each death costs ten minutes (search) | open | |
| When the six hours run out, Elvin laughs and the game ends (search) | open | |
| The agent walks, and somersaults to cross gaps (search) | open | |
| The stronghold: rooms joined by lifts and tunnels; 31 or 32 rooms, sources differ (search) | open | |
| Rooms, lifts, the placement of puzzle pieces and the robots' abilities are chosen at random for each game (search) | open | |
| Furniture can be searched; a search yields a puzzle piece, a snooze password, a lift-init password, or nothing (search) | open | |
| Lifting platforms (striped) in rooms, moved up and down by the agent (search) | open | |
| 36 puzzle pieces, nine sets of four; each set makes one letter of a nine-letter password (search) | open | |
| Pieces overlap, so three can be assembled before the player finds they must start again; pieces may need flipping horizontally or vertically (search) | open | |
| A piece's colour depends on the room it was found in; four pieces must share a colour to fit, and colour keys change a piece's colour (search) | open | |
| Pocket computer: map of the rooms and tunnels entered; memory window with two pieces; arrow keys; flip keys; colour keys; password area; phone key "dials out for help" (search) | open | the panel below the play area |
| Pocket computer usable only in a lift or a corridor (search) | open | |
| Pocket computer readout `SNOOZES:` and `LIFT INITS:` counters and `PSW:` | live | |
| Security terminals: stand in front and push up to use a snooze (robots in the room stop for a while) or a lift init (platforms return to their start) (search) | open | |
| Robots: electrified bodies, some fire a short-range ray; each is a mix of can/can't shoot, can/can't turn, and detects the agent at some distance or not; some patrol, some follow, some react only when close, some stay put (search) | open | |
| A black floating ball in some rooms (six, by one source) kills on touch and follows the agent (search) | open | |
| Two code rooms: a terminal with a large chequered screen plays a tone sequence; pointing at the squares in ascending pitch earns a password (search) | open | |
| The end: reach Elvin's control room with the full password; an ending with more speech, in a female voice (search) | open | |
| Score: points for puzzle pieces found and assembled, and for reaching the control room with time left (search) | open | |
| Security terminal menu (game text): SECURITY TERMINAL, SELECT FUNCTION, RESET LIFTING PLATFORMS IN THIS ROOM., TEMPORARILY DISABLE ROBOTS IN THIS ROOM., LOG OFF.; PASSWORD REQUIRED / PASSWORD ACCEPTED | open | text `$A01E`, `$A229` |
| Pocket computer messages (game text): PUSH BUTTON, COLORS MUST MATCH, IMAGES CAN'T OVERLAP, NO IMAGE SELECTED, END OF MEMORY, CAN'T UNDO, TIME IS SUSPENDED, WE JUST DID THIS ONE, NOTHING IN MEMORY, and a confirmation that the orientation has been put right (its exact wording is in the listing at `$7D22`) | open | text `$7D1F`-`$82B7` |
| The phone (game text): HAVE WE ENOUGH PIECES TO SOLVE THE UPPER LEFT PUZZLE, A SOLUTION EXISTS / NEED MORE PIECES, CORRECT ORIENTATIONS OF LEFTMOST PIECES, HANG UP | open | text `$7C46`-`$7D1D` |
| End of game tally (game text): PUZZLE PIECES FOUND, PASSWORDS FOUND, PUZZLES SOLVED, SECONDS REMAINING, MISSION COMPLETE or MISSION TERMINATED, TOTAL SCORE, THIS SURPASSES THE PREVIOUS HIGH SCORE OF, HALL OF FAME | open | text `$B8A7` |
| High-score name entry (game text): ENTER YOUR I.D. CODE ON THE KEYBOARD; HIT RESTORE OR RUN/STOP FOR NEW GAME | open | text `$BD99` |
| A list of nine-letter words in the code (SWORDFISH, ASPARAGUS, ARTICHOKE, CROCODILE, ALLIGATOR, ALBATROSS, BUTTERFLY, CORMORANT): candidates for the password | open | `$208E` |
| Cheat POKEs listed by one cheat site: "Cheat mode: POKE 26831,169" and "No opponents: POKE 27028,0, POKE 31005,12, POKE 21006,221" (search). Those addresses are for some unknown version and may not match this image | open | `cheats.md` |

## Beyond the documentation

Found in the code, not in the manual.

- The program on the disk is deliberately broken in three bytes, and the
  loader's drive check is what mends them (`orientation.md`).
- The start-up code clears its own first 17 bytes (`orientation.md`).

## Open questions

- How the "random" stronghold is generated, and from what seed.
- How many rooms there are in this version.
