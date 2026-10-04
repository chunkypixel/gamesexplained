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
and title, with no crack intro or trainer menu observed. Side 2 was used to
load the Downhill Race and Jam overlays. With side 2 mounted on the High Jump
route, the loader displayed `INSERT SIDE 1 AND PRESS BUTTON`; attaching side 1
and pressing fire resumed High Jump (`reference/side1-prompt.png`).

## From power-on to play

1. Hard-reset a PAL C64. Attach side 1 as drive 8 and autostart its `EA` PRG
   (`LOAD"EA",8,1` from a READY prompt is the manual's equivalent).
2. Wait past the blue EA logo for the Skate or Die! title. Hold fire on
   joystick port 1 until Rodney's Skate Shop appears, then release it.
   Port 2 fire did not advance this title in the tested run.
3. Move the shop pointer over `GO PRACTICE` (down, then left from its initial
   position) and press fire. The town square appears. From the initial
   skater position, push forward to skate down the screen; left and right
   rotate the skater rather than moving sideways. From `work/town-square.vsf`,
   80 frames forward, 30 frames turning left, then about 110 frames forward
   reaches High Jump. Turning right instead reaches Pool Joust. A 15-frame
   turn from the initial position followed by about 275 frames forward
   reaches Downhill Race (right turn) or Jam (left turn). These counts were
   measured with VICE frame advance, not joystick holds timed by the host.
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

Other captured states are `work/race-play.vsf`, `work/jam-play.vsf`, and
`work/joust-select.vsf`; they are not interchangeable overlays. The final
loader hand-over snapshot is still to be captured. Compare it with the play
snapshots before selecting the listing image.

## The loader, in a paragraph

The two-block `EA` program starts a loader that first draws the blue EA
logo, then the Skate or Die! title and Rodney's shop. Selecting a town
path displays `SKATING TO HIGH JUMP`, blanks the screen while loading,
then enters the event. High Jump and Pool Joust selection loaded with side 1;
Race and Jam loaded with side 2. A wrong-side attempt produced an explicit
side-1 prompt rather than silently loading another event. The loader's copy
and jump addresses have not yet been established.
