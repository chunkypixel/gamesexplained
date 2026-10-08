# Toki — features

Read this before annotating code. What the game is documented to do, with
verification status against the binary. Statuses: **open** (documented,
not found yet), **traced** (in the code, could not be exercised; say what
was tried), **confirmed** (in the code, consistent with the emulator),
**live** (observed directly), **differs** (the code does something else).
"Absent" is not a status.

Sources:

- Wikipedia, https://en.wikipedia.org/wiki/Toki_(video_game), via web search, read 2026-10-08
- Retro Gamer, "Conversion Capers", 29 November 2018, https://www.pressreader.com/uk/retro-gamer/20181129/282415580330175, via web search summary, read 2026-10-08

## Features

| Feature | Status | Where |
|---|---|---|
| Ocean type 1 cartridge, 16 banks of 8 KB at $8000 | confirmed | CRT header and chip packets (read from the image, 2026-10-08) |
| Autostart: CBM80 at $8004, cold start $812C | confirmed | bank 0 bytes $8000-$8008 |
| Run-and-gun platforming as Toki, spitting projectiles | open | Wikipedia |
| One music track (Retro Gamer) | open | |
| Arcade intro cut short and one arcade level missing (Retro Gamer) | open | |

## Beyond the documentation

Nothing yet: no code has been read.

## Open questions

- Which arcade level the C64 version leaves out, and how many levels it has.
