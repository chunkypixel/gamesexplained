# Uridium — features

Read this before annotating code. What the game is documented to do, with
verification status against the binary. Statuses: **open** (documented,
not found yet), **traced** (in the code, could not be exercised; say what
was tried), **confirmed** (in the code, consistent with the emulator),
**live** (observed directly), **differs** (the code does something else).
"Absent" is not a status.

Sources:

- The Hewson manual, as printed in the Uridium / Paradroid Double Value
  Pack (Hewson, 1987), cassette inlay scan
  https://archive.org/details/Uridium_Paradroid_Double_Value_Pack_1987_Hewson_compilation,
  read from the PDF on 10 October 2026 (the item's OCR text is
  unreadable: the scan is rotated). It is the cassette release's text
  ("Loading the Tape"); this run's image is a disk. It outranks the rest.
- C64-Wiki, https://www.c64-wiki.com/wiki/Uridium, read 10 October 2026.
  Its infobox picture is a cracker's loading picture ("by m.b.s. '86"),
  kept as `reference/wiki-loading-picture-other-release.png`; it is not
  this release's.
- The game's own screens, recorded from the image in this run
  (`reference/`).

## Features

| Feature | Status | Where |
|---|---|---|
| Joystick only, in either port (manual); fire starts the game | live | fire on port 2 started a game from the title (`orientation.md`); port 1 open |
| Title-sequence options: F1 one player one joystick, F2 two players sharing one joystick, F3 two players two joysticks, F5/F6 music volume up/down, F7 colour, F8 monochrome (manual, C64-Wiki) | open | |
| Run/stop pauses; fire or run/stop restarts; run/stop then clr/home abandons the game (manual) | open | |
| Up/down sets the Manta's position above the Super-Dreadnought; left/right accelerate and decelerate (manual) | open | |
| Below a minimum speed the Manta half-loops and half-rolls to face the other way; the manoeuvre lifts it above the surface for a while, over missiles and mines (manual, C64-Wiki) | open | |
| Fire held with up or down rolls the Manta 90 degrees to pass narrow gaps (manual) | open | |
| The Manta reverses out of its transporter at the start of each Dreadnought (manual) | live | `reference/play-level1-launch.png`: the Manta beside its mothership, "01. Zinc." |
| Fifteen Dreadnoughts, one per planet, each after a different metal (manual) | open | fifteen names in the game's alphabet: 1 to 7 at `$E079` (Zinc, Lead, Copper, Silver, Iron, Gold, Platinum), 8 to 15 at `$EF59` (Tungsten, Iridon, Kallisto, Tri-alloy, Quadmium, Ergonite, Galactium, Uridium); level 1 shown live |
| Meteor shields and communications aerials must be avoided (manual) | open | |
| Fighters attack in waves; a bonus when every ship of a wave is destroyed, 100 per wave (manual) | open | |
| Homing mines materialise over flashing generator ports (manual) | open | |
| Score table: small explodable surface feature 10, large 25, enemy ship on runway 100, enemy fighter 100-1000 (manual) | open | |
| A bonus Manta every 10,000 points (manual) | open | |
| "Land Now" appears when the defences are cleared; land by flying flat left to right over the master runway at the right-hand end (manual) | open | |
| Fuel rod chamber after landing: fire at the right moment selects a bonus or "Quit"; it must be quit before the countdown at the top reaches zero (manual); first step worth 900 + 100 × level, each later step 100 × the time left (C64-Wiki) | open | |
| After take-off, the Dreadnought vapourises and its remaining surface can still be strafed (manual, C64-Wiki) | open | |
| Two players take turns (C64-Wiki) | live | the status line shows Player1 and Player2 scores on the title (`reference/title.png`) |
| A hall of fame of eight scores with initials (C64-Wiki screenshot `reference/wiki-highscore-quadmium.png`) | open | the attract scroller shows "HI - 12000 AEB" (`reference/attract-big-scroller.png`) |
| Three-voice music by Steve Turner and sound effects (manual) | open | |
| Fifty frames a second scrolling to single-pixel resolution (manual, "Technical Data") | open | the playfield's horizontal scroll comes from `$2C` in the raster handler at `$3F38` (`orientation.md`) |
| Hardware and software sprites (manual, "Technical Data") | open | |
| Attract mode: title page, a giant scrolling message, a demo flight with "Demo" in the status line | live | `reference/title.png`, `reference/attract-big-scroller.png`, `reference/attract-demo-dreadnought.png`, `reference/attract-demo-fighters.png` |

## Beyond the documentation

Found in the code, not in the manual.

## Open questions
