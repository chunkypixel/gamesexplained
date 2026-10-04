# Skate or Die! - verified technical facts

Current truth for this game. The workflow lives in `kit/skills/`; how this
understanding developed lives in `agent-history.md`. Every fact names
the routine or table it comes from. Unless marked *live*, a fact comes
from reading the code in the snapshot named in `orientation.md`.

## Build

- *Live:* The supplied side-1 G64 boots on PAL VICE v3.13.2. Its directory
  has a two-block `EA` PRG. The title and Rodney's shop load from it, and
  High Jump reaches play without a side swap (`orientation.md`).

## Memory layout

| Thing | Where |
|---|---|
| Shop dialogue, uppercase ASCII-compatible bytes | `$2180`-`$2280` in `work/skate-shop.vsf`; includes `GO PRACTICE` at `$2229` and `GO AND COMPETE` at `$2247` |
| Compact event headings | `$68C9`-`$68EE` and `$6A09`-`$6A2E` in `work/skate-shop.vsf`; the latter pair remains in `work/highjump-play.vsf` |
| Repeated/menu text | `$76FD`-`$7799` in `work/skate-shop.vsf`; much of it is overwritten in High Jump |

The first flow trace from the sampled PC `$08DC`, IRQ `$0AF0` and vector
`$0A3A` marked 2,018 bytes as code across 23 blocks in
`work/highjump-play.vsf`. This is an initial trace, not an inventory of
the full event. The IRQ at `$0AF0` acknowledges `$D019`, loads a handler
address from `$2A01/$2A02` indexed by `$1E`, patches the call at
`$0B0C/$0B0D`, and selects the next raster line from `$2A05` (`$0AF0`-
`$0B20`).

## Timing

## Controls

The traced routine at `$0D23` reads CIA1 `$DC01` and ANDs it with
`$DC00`; its later interpretation is still to be traced. *Live:* joystick
port 1 fire advanced the title and shop in this image.

## Graphics

The High Jump VIC state sampled at play reported `video_mode: 3` and
`memory_pointers: $91`; `$D011=$3B` and `$D016=$D8` select multicolour
bitmap display in that sampled band. The raster handler changes video
registers during a frame (`$0CA3`-`$0CB4`), so this one sample is not a
claim that every band has the same mode.

## Mechanics

## Data tables

Two observed text alphabets coexist. In the shop snapshot, Rodney's
dialogue uses `$41`-`$5A` for `A`-`Z` and `$20` for a space. The compact
event labels use `$01`-`$1A` for `A`-`Z` and `$20` for a space. This is a
fixed offset of 64 for letters, established by the consecutive-letter
differences of `PRACTICE`, `FREESTYLE`, and `HIGHJUMP` in both snapshots.
For example, `$6A11` begins `08 09 07 08 0A 15 0D 10`, or `HIGHJUMP`;
`$68D0` begins `06 12 05 05 13 14 19 0C 05`, or `FREESTYLE`. `$FE` and
`$FF` surround these labels but their rendering roles are not yet traced.
The shop snapshot also has compact `BOARD COLOR` near `$75E8` and
`PUSH BUTTON` near `$77E9`; their surrounding control bytes need a later
pass before attributing either to a particular screen.

The uppercase-byte sweep found Rodney's speech and menu strings in the
shop image at `$20A9` (`WHO NEEDS A BOARD`), `$20BB` (`MUST REGISTER AT
SKATESHOP`), `$20D6` (`SKATE AGAIN`) and `$2180`-`$2280` (speech about
sign-in, board colour, high scores, Practice and Compete). The same sweep
also produced long runs inside graphics; a printable run alone is not
evidence of text. The compact-alphabet sweep found the four event headings
listed above; it did not establish an absence of other strings in later
event overlays.

### Twin copy under KERNAL RAM

In `work/highjump-play.vsf`, `$C2B0`-`$C67A` and `$F9E0`-`$FDAA` are
byte-for-byte identical (971 bytes), an offset of `$3730`. The beginning
decodes as instructions and contains absolute `$Fxxx` operands. Bytes
after these ranges differ, while another run of 64-byte windows agrees
from around `$C690/$FDC0`. This is a candidate copied code/data block;
the executed copy and exact boundaries remain open until traced live.

### Hardware register census (initial trace only)

| Register | Traced use | Instructions |
|---|---|---|
| `$D011`, `$D016` | write display controls during raster work | `$0CA3`-`$0CB4` |
| `$D012` | read current raster and write next compare line | `$0B18`, `$0CAA`, `$0D14` |
| `$D019`, `$D01A` | acknowledge raster IRQ; enable VIC interrupt | `$0AF5`-`$0AF8`, `$0A41` |
| `$D400,Y` | clear seven SID registers for a selected voice | `$29B5`-`$29BA`; indexed range not represented by one fixed register |
| `$D404`, `$D40B`, `$D412`, `$D418` | clear the three voice controls and set volume `$0F`; later Voice 1 control write | `$22C8`-`$22D3`, `$2362` |
| `$DC00`, `$DC01` | combine the two CIA1 input ports | `$0D23`-`$0D26` |

This table covers only the 2,018 bytes first marked as code. An untouched
register here says nothing about the rest of the image or other events.

## Sound

## Live tests

- *Live:* At High Jump play, `$00/$01` was `$FF/$E4`. The RAM vectors at
  `$FFFA`-`$FFFF` read NMI `$0A3A`, reset `$0954`, IRQ `$0AF0`. A
  non-stopping execution checkpoint on `$0AF0` gained hits during play.
