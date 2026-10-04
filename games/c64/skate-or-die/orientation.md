# Skate or Die! - orientation

The images are the contributor's copies. They are kept in `work/` and are
never committed.

## The image

Side 1 is `work/side1.g64` (SHA-256
`45e07b324597540886ea0f409f32e27ec320ba18f2e0f9ca338f1f51d5d0ab84`);
side 2 is `work/side2.g64` (SHA-256
`7a402586d501b7904fa1c1106ad1432700b467fade4bfbe2c2ca9e5dae51f53e`).
Both are PAL G64 images. Side 1's directory contains one two-block PRG named
`EA`. Its label reads `skate or die!` and `ea 2a`. The boot showed the EA logo
and title, with no crack intro or trainer menu observed. Side 2 has not yet
been attached.

## From power-on to play

1. Hard-reset a PAL C64. Attach side 1 as drive 8 and autostart its `EA` PRG
   (`LOAD"EA",8,1` from a READY prompt is the manual's equivalent).
2. Wait past the blue EA logo for the Skate or Die! title. Hold fire on
   joystick port 1 until Rodney's Skate Shop appears, then release it.
   Port 2 fire did not advance this title in the tested run.
3. Move the shop pointer over `GO PRACTICE` (down, then left from its initial
   position) and press fire. The town square appears. From the initial
   skater position, steer right, then forward into the `HIGHJUMP` path.
4. Wait for the ramp with `PRACTICE`, `PASS: 0` and `HEIGHT: 0' 0"` at
   the top. Save `work/highjump-play.vsf` at this state. The earlier shop
   and town checkpoints are `work/skate-shop.vsf` and
   `work/town-square.vsf`.

## Steady state

VICE v3.13.2 (`v3.13.2-macos-arm64-gui.dmg`) passed all 57 emulator checks;
there are no failed-check workarounds. At High Jump play, processor port
`$00/$01` read `$FF/$E4`, so the BASIC and KERNAL ROMs were out and I/O was
visible. The RAM hardware vectors at `$FFFA-$FFFF` read NMI `$0A3A`, reset
`$0954`, IRQ `$0AF0`. A non-stopping execution checkpoint at `$0AF0` gained
hits while the event ran; the sampled CPU PC was `$08DC`. The KERNAL vector
table at `$0314` still contained its defaults. Shop and High Jump RAM differ
in 43,751 byte positions, so the event loads or replaces substantial memory;
one event snapshot cannot be assumed to hold every event's code and data.

The final loader hand-over snapshot is still to be captured. Compare it
with `highjump-play.vsf` before selecting the listing image.

## The loader, in a paragraph

The two-block `EA` program starts a loader that first draws the blue EA
logo, then the Skate or Die! title and Rodney's shop. Selecting a town
path displays `SKATING TO HIGH JUMP`, blanks the screen while loading,
then enters the event. High Jump loaded from side 1 without a disk swap.
The loader's copy and jump addresses have not yet been established.
