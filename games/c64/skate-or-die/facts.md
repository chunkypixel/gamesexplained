# Skate or Die! - verified technical facts

Current truth for this game. The workflow lives in `kit/skills/`; how this
understanding developed lives in `agent-history.md`. Every fact names
the routine or table it comes from. Unless marked *live*, a fact comes
from reading the code in the snapshot named in `orientation.md`.

## Build

- *Live:* The supplied side-1 G64 boots on PAL VICE v3.13.2. Its directory
  has a two-block `EA` PRG. The title and Rodney's shop load from it, and
  High Jump reaches play without a side swap (`orientation.md`).
- *Live:* Downhill Race and Jam reached their start screens with side 2
  mounted (`reference/race-play.png`, `reference/jam-play.png`). The High Jump
  route with side 2 mounted displayed `INSERT SIDE 1 AND PRESS BUTTON`;
  attaching side 1 and pressing fire resumed into High Jump
  (`reference/side1-prompt.png`). Pool Joust's opponent selector appeared
  with side 1 mounted (`reference/joust-select.png`). These observations do
  not yet map every asset to a disk side.

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

The four captured event snapshots are separate memory images. The current
`listing.json` is built from High Jump only; it must not be presented as a
listing of Race, Jam, or Joust code. Overlay differences and any common
resident code remain to be mapped.

The High Jump snapshot holds RAM beneath the KERNAL ROM at `$F000`-`$FFFF`.
The code at `$0806` calls `$F230`, the event initializer at `$09CF` reads
`$FE00`, and `$1A93` jumps to `$FE06`; the sampled play-state processor
port `$E4` banks out the KERNAL. The `$F230` RAM bytes differ from the ROM
bank at the same address. These are leads to game-owned high RAM, but their
runtime bank state and which routines actually execute still need a
call-path and live-checkpoint audit.

Pairwise RAM comparison after the 209-byte VSF header found 58,451 differing
bytes between `work/highjump-play.vsf` and `work/race-play.vsf`, 57,239
between High Jump and Jam, and 50,864 between High Jump and Joust selection.
These counts include mutable state and screen memory; they establish large
image differences, not the exact size of each loaded overlay.

## Timing

## Controls

The traced routine at `$0D23` reads CIA1 `$DC01` and ANDs it with
`$DC00`; its later interpretation is still to be traced. *Live:* joystick
port 1 fire advanced the title and shop in this image.

*Live, town overlay:* From `work/town-square.vsf`, sprite 0 was at
`(173,117)`. After 80 frames forward, 20 frames turning left and 60 frames
forward, it was at `(260,182)`. In the same two RAM images, `$2F` changed
`$4B->$76` and `$30` changed `$54->$96`. Writing `$90` to `$2F` in a
restored town state moved sprite X from 260 to 314 after two frames; writing
`$60` to `$30` moved sprite Y from 183 to 129. Thus these bytes are town
position inputs to the sprite placement routine, though their exact scale
and offset still need tracing. **They are not stable cross-overlay names:**
the High Jump code at `$0D23` writes combined CIA1 input into `$2F/$30`.

## Graphics

The High Jump VIC state sampled at play reported `video_mode: 3` and
`memory_pointers: $91`; `$D011=$3B` and `$D016=$D8` select multicolour
bitmap display in that sampled band. The raster handler changes video
registers during a frame (`$0CA3`-`$0CB4`), so this one sample is not a
claim that every band has the same mode.

## Mechanics

### High Jump height display

`$17B4` draws the height from mutable byte `$2B`. It shifts right three
times to index paired glyphs at `$2DC7` for the feet, and uses the low
three bits to index paired glyphs at `$2DF1` for the inches. The eight
inch entries are `00, 02, 03, 05, 06, 08, 09, 11`, rounding eighths of a
foot to whole inches. *Live test:* In a restored High Jump play snapshot,
writing `$04` to `$2B` and advancing five frames displayed `HEIGHT: 0' 6"`;
writing `$08` displayed `HEIGHT: 1' 0"`. The two captures are
`reference/highjump-height-test-4.png` and
`reference/highjump-height-test-8.png`. These are controlled RAM tests, not
scores achieved by playing. The rules that increase or record `$2B` remain
to be traced.

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

High Jump prints the header from an inline NUL-terminated byte string
`$09A1`-`$09C9`, containing `PASS:` and `HEIGHT:`. The call at `$099E`
enters `$1242`, which pulls the return address, masks each inline byte with
`$3F`, draws its glyph and returns after the terminator. The bytes that
looked like repeated `JSR $2020` are spaces in this string, not code.

The graphics builder at `$138D` uses the complete 256-byte table
`$2E7B`-`$2F7A` to reverse the individual bits in a byte. The builder at
`$13C5` uses `$2F7B`-`$307A` to reverse four two-bit pixel pairs. A
byte-for-byte check of every index `0..255` matched those transforms
exactly. The builders therefore have both bit-level and two-bit-pixel
reversal available; which poses call each path is traced at `$14DE` but
has not yet been matched to all visible frames.

The input reader at `$0D3F` uses even state byte `$2E` to index nine
little-endian handler pointers at `$2AB9`-`$2ACA`, then patches the call
operand at `$0D4E`. The states are `$00,$02,$04,$06,$08,$0A,$0C,$0E,$10`.
Their handlers update movement, timing and skater poses; the player-facing
meaning of each state needs live tracing before stronger labels are used.

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

The High Jump sound updater at `$232C` drains queued sound IDs from `$2277`.
Its call at `$2337` enters `$2981`, which compares a priority from `$30AF`,
chooses one of three voice slots, loads a script pointer from `$307B/$3095`,
clears counters, and zeros seven SID registers at the selected voice base.
`$29DC` begins the six slot offsets `$0E,$0E,$07,$07,$00,$00` used by this
routine and the update loop at `$2345`. The game meaning of each sound ID
remains open.

The sound-script format is partially traced. `$2389` reads and advances the
current voice's byte pointer. `$2394` uses the low nibble of each command
byte to choose one of 16 handler addresses from split high/low tables at
`$23AE/$23BE`, pushes that address and uses `RTS` to dispatch; the high
nibble remains in A as a subcommand or argument. The decoded handlers
write SID frequency (`$D400/$D401`), pulse width (`$D402/$D403`), control
(`$D404`), attack/decay (`$D405`) and sustain/release (`$D406`), and can
adjust previous values, branch within scripts, queue another sound, or
return from a nested script. A second stream is read through `$08/$09` at
`$26FA`; its 11-entry split address table at `$27ED/$27F8` dispatches
further SID writes and modulation setup. This is code evidence for the
driver, not yet a claim about how the soundtrack sounds or what any sound
ID means in the game.

The sound-ID table at `$307B`-`$30AE` contains 26 split low/high script
pointers; the first points to `$30CC`. The next 26 bytes at `$30AF`-`$30C8`
hold their priorities. These are indexed by ID in `$2981` and `$298D`.

## Live tests

- *Live:* At High Jump play, `$00/$01` was `$FF/$E4`. The RAM vectors at
  `$FFFA`-`$FFFF` read NMI `$0A3A`, reset `$0954`, IRQ `$0AF0`. A
  non-stopping execution checkpoint on `$0AF0` gained hits during play.
