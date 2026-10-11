# Gauntlet — features

Read this before annotating code. What the game is documented to do, with
verification status against the binary. Statuses: **open** (documented,
not found yet), **traced** (in the code, could not be exercised; say what
was tried), **confirmed** (in the code, consistent with the emulator),
**live** (observed directly), **differs** (the code does something else).
"Absent" is not a status.

Sources:

- C64-Wiki, "Gauntlet", https://www.c64-wiki.com/wiki/Gauntlet (revision 45583), read 11 October 2026
- Mindscape's US manual, "Commodore C64 Manual: Gauntlet (1987)(Mindscape)(US)", the Internet Archive's OCR text of https://archive.org/details/Gauntlet_1987_Mindscape_US, read 11 October 2026. It covers the C64, Atari 8-bit and Atari ST versions in one booklet; where it names a machine, only its C64 lines are used here. The disk analysed is U.S. Gold's, and the manual is Mindscape's: what the two editions share is not known
- The game's own screens: credits, controls, selection and play, 11 October 2026 (`reference/`)

## Features

| Feature | Status | Where |
|---|---|---|
| One or two players; the glove on the selection screen picks the count, then each player's hero | live | selection program `$3390`-`$3420` (not in the play image); `orientation.md` |
| Four heroes: Thor the Warrior, Thyra the Valkyrie, Questor the Elf, Merlin the Wizard | live | selection screen |
| Each hero differs in armour, shot power, hand-to-hand and magic (manual: Warrior armour 20 %, shots twice normal, axe destroys generators, poor magic; Valkyrie armour 50 %, poor shots, sword destroys generators, moderate magic; Wizard no armour, good shots, bare hands cannot destroy generators, excellent magic; Elf armour 10 %, poor shots, dagger cannot destroy generators, very good magic) | open | |
| A one-player game gets a second, computer-chosen hero (manual: "the computer will randomly assign a second character") | open | |
| A second player can join at any time by pressing their joystick's fire button | open | the "Press fire" panel beside the active player (`reference/play-level1.png`) |
| Player one: joystick 1 and SPACE for magic; player two: joystick 2 and the function keys (controls screen; the manual says the "F1" key) | live | controls screen (`reference/controls.png`) |
| Health starts at 2000 and counts down all the time | live | 2000 at the start, 1566 about 30 seconds later |
| Hold fire to shoot, release to move; shots travel in eight directions, diagonals included | open | |
| Unlimited shots | open | |
| Moving into a monster fights it hand to hand; hand-to-hand scores more than shooting | open | |
| Monster generators make one kind of monster each, at three strengths; they can be shot, pounded by the strong heroes, or destroyed with magic | open | |
| Monsters come in three levels of toughness: a level one takes one hit, a level three takes three | open | |
| Ghosts hit once and vanish | open | |
| Grunts close in and club | open | |
| Demons shoot fireballs and bite | open | |
| Lobbers throw rocks over walls and run away | open | |
| Sorcerers flicker in and out of sight and cannot be hit while invisible | open | |
| Death takes up to 200 health, then dies; only magic kills it | open | |
| Potions: SPACE (player one) uses one; its effect on the monsters on screen scales with the hero's magic; a potion that is shot works too, but less | open | |
| Special potions: extra armour, magic power, shot speed, shot power, fight power, pickup power | open | |
| Food: +100 health and +100 score | open | |
| Cider: as food, but a shot destroys it | open | |
| Poison: takes one special power and 100 health | open | |
| Keys: 100 points each, open doors | open | |
| Treasure chests: 100 points | open | |
| Amulet: invisibility for a short time | open | |
| Some walls crumble under repeated shots | open | |
| Traps: glowing floor patterns that make some walls disappear | open | |
| Transporters: to the nearest visible transporter, a random one when several are as near | open | |
| Exits are labelled with the level they lead to; some skip levels | open | |
| After 30 seconds without action every wall vanishes; after another 30, the walls become exits (manual; the wiki says "a minute" before the doors open) | open | |
| An exit can lead to a treasure room: collect within the time limit and escape for the bonus, nothing if you do not escape | open | |
| From level 10 shots stun the other player (wiki: a caption "Shots will from now on stun other players") | open | |
| 512 dungeons (wiki); the disk holds 128 level files, `level 001` to `level 128` | open | |
| A dead player in a two-player game can come back by pressing fire while the other is alive (wiki) | open | |
| A short form of the title tune plays while each level loads (wiki) | open | |
| Scrolling play area with the status panel below: hero name, score and health for each player, the inventory of keys and potions, and the "Press fire" panel for an empty slot | live | `reference/play-level1.png`, `reference/wiki-play2.jpg`; panel split at raster line 207 (`orientation.md`) |
| Music by Ben Daglish (credits) | open | `player-$e000`, loaded at `$E000` |

## Beyond the documentation

Found in the code, not in the manual.

## Open questions

- How 512 dungeons come from 128 files.
- Whether "Level: 001" and the exit labels number levels from 1 to 512.
