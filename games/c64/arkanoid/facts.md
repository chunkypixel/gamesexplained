# Arkanoid — verified technical facts

Current truth for this game. The workflow lives in `kit/skills/`; how this
understanding developed lives in `agent-history.md`. Every fact names
the routine or table it comes from. Unless marked *live*, a fact comes
from reading the code in the snapshot named in `orientation.md`
(`work/entry.vsf`, the hand-over); *live* facts were measured in VICE
(x64sc, vice-mcp v3.13.2, PAL) on 5 October 2026, and *sim* facts in the
kit's simulator (`kit/c64/machine.js`) run from the same image.

## Build

Imagine's disk, PAL, as a G64 (`orientation.md`). The game is one file,
`arkaniod`, loaded to `$0400`-`$FFF9` by a fast loader and started at
`$9400`; the hand-over image is that file byte for byte. No build string
or version number was found (string sweep in PETSCII and screen codes).

## Start-up and protection

- `$9400`: `LDA #$35 / STA $01`, then `$80 $AD`, an undocumented two-byte
  `NOP #imm`, then `JMP $095A`.
- `$095A`: `$FC $AD $03`, an undocumented `NOP $03AD,X`, then
  `JSR $B9C3`. The bytes after it (`$0960`: `LAX $F004`, `STX $FCF7`,
  `NOP $AD`, `JMP $F000`) never run: `$B9C3` ends in `JMP $F000` and
  does not return (*sim*: no instruction at `$0960`-`$096A` executed).
- `$B9C3`: stops CIA 1 timer A, sets up CIA 2's timer A NMI, calls
  `$5F42`, `$F7FE`, `$F0C3` and `$F831`, overwrites itself
  (`$B9C3`-`$B9EA`) with `$20`, `CLI`, `JMP $F000`.
- `$5F42`: calls `$A949`, which decrypts `$BA0A`-`$BA6A` in place by
  XOR with `$A71A`-`$A77A`; then shifts a byte out through CIA 1's serial
  port (`$DC0C`, timer A, control `$D9`) and waits until the serial-port
  interrupt bit (`$DC0D` bit 3) comes up, storing the interrupt register
  in `$BA65` (`$09` on VICE, *live*); then fills `$5F40`-`$5F86`, itself,
  with `$01`. The simulator does not model the serial port: a hook at
  `$5F5C` stands in for the wait (`work/sim/cover.js`).

## Memory layout

| Thing | Where |
|---|---|
| Code | `$0600`-`$09FF`, `$2600`-`$34FF`, `$9400`-`$B9FF`, `$F000`-`$FFFF` (traced and *sim*) |
| Title picture, multicolour bitmap (video bank 1) | bitmap `$4000`, colour matrix `$6000` (`$D018` = `$81`, `$DD00` = `$C2`, `$D016` = `$D8`, *live* frame of the title) |
| Menu, story and play screen (video bank 3) | screen `$C000`, character set `$C800` (`$D018` = `$02` from `$B543`, `$03` in play; `$DD00` = `$90` from `$B53E`) |
| Menu, story and ending text, PETSCII capitals | `$B713`-`$B98x` |
| GAME OVER messages, PETSCII | `$9DD7`-`$9E0F` |
| Score panel template, screen codes | around `$782E`-`$7910` |

## Timing

The interrupts, from one recorded frame of play (`work/frame-play.json`,
*live*): three raster interrupts chained through `$FFFE`, each handler
writing the next one's address: `$F75E` (vector set on line 247),
`$FBEE` (line 21), `$F720` (line 26). The NMI vector alternates between
`$F855` (set on line 52) and `$F903` (line 246); CIA 2's timers drive
the NMIs (`$DD04`-`$DD0F`, written in `$F0C3`, `$F76A`, `$F872`,
`$F911`-`$F94A`).

## Controls

*Live*: on the title, fire on port 2 brings up the menu; on the menu, J
selects the joystick and fire on port 1 starts the game. Menu keys
N J K P D 1 2.

## Graphics

## Mechanics

## Data tables

## Sound

The SID registers are all written from `$2600`-`$3400` and `$3756`
(register census, 40-sweep), besides the volume register `$D418` from
`$AF0C`, `$B2AD`, `$F028` and `$FEF0`.

## Hardware register census

Every absolute access to `$D000`-`$DFFF` in the traced code, from the
hand-over image. Indexed accesses with a base outside a chip
(`$D3FE,X`, `$D7FF,Y`) reach the next chip.

| Register | Accesses (routine addresses) | Use |
|---|---|---|
| `$D000`-`$D005` sprite positions | `$F74F`, `$F755`, `$F80A`, `$F97D`, `$FC1E`, `$F223`, `$F226`, `$F982`, `$FC23`, `$F8CF` | |
| `$D010` sprite X high bits | `$08DE`, `$F1E6` | |
| `$D011` | `$B482`, `$B4C0`, `$B548`, `$B9AC`, `$B9B8`, `$B9BF` | |
| `$D012` raster | read `$AF87`; written `$F737`, `$F851`, `$F9A0`, `$F9AE`, `$FC4D`, `$FC69`, `$F8EB`, `$FC72`; compared `$FC05`, `$FC60` | |
| `$D015` sprite enable | `$08D6`, `$9683`, `$96B4`, `$96FC`, `$9B07`, `$9C2B`, `$F08A`, and others | |
| `$D016` | `$F01D` | |
| `$D018` | `$B48C`, `$B543` | |
| `$D019`, `$D01A` | `$F728`, `$F765`, `$FBF6`; `$F83E` | |
| `$D01C`, `$D01D` | `$08D9`, `$F27E`, `$F087`; `$F1E3` | |
| `$D020`, `$D021`, `$D022`, `$D025`-`$D029` | `$B491`, `$B550`, `$B496`, `$9CD1`, `$F600`, `$08EB`, `$08F0`, `$F24C`, `$F24F`, `$F96E`, `$FC0F` | |
| `$D400`-`$D418` SID | `$2694`-`$33FA`, `$3756`, `$AF0C`, `$B2AD`, `$F028`, `$FEF0` | |
| `$D419`, `$D41A` paddles | `$FE20`, `$FEBC` | |
| `$DC00`-`$DC03` CIA 1 ports | `$083D`-`$0868`, `$956B`, `$B4E3`-`$B4E6`, `$B573`, `$F002`-`$F00F`, `$FDB5`-`$FEB9` | |
| `$DC04`, `$DC05`, `$DC0C`-`$DC0E` | `$5F46`-`$5F83` (protection), `$B9C6`-`$B9DB`, `$F841`, `$F844` | |
| `$DD00` | `$B487`, `$B53E` | video bank |
| `$DD04`-`$DD0F` CIA 2 timers, serial, interrupts | `$B9CE`-`$B9D6`, `$F0C3`-`$F0D7`, `$F76A`-`$F774`, `$F856`-`$F87C`, `$F904`-`$F94A` | |
| `$DD18` (a mirror of CIA 2's `$DD08`) | `$F621` | |
| `JSR $DDDD` | `$FEE8`, `$FF12` | an operand written at run time |

## Live tests
