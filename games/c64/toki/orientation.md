# Toki — orientation

## The image

`work/toki.crt`, 131,392 bytes: a CRT image named TOKI, hardware type 5
(Ocean type 1), EXROM and GAME both 0, sixteen 8 KB chip packets for banks
0 to 15, each loaded at $8000. Bank 0 holds the CBM80 autostart signature at
$8004 and cold start vector $812C. Whether it is the original release is
unknown.

## From power-on to play

1. Autostart `work/toki.crt` (VICE's autostart attaches the cartridge).
2. The title screen appears after about four seconds of warp.
3. Fire on joystick port 2 shows the "STAGE 1 / LABYRINTH OF CAVES" card
   with SFX and MUSIC; fire again starts play.
4. Snapshot `work/play.vsf`, taken about three seconds into stage 1.

## Steady state

Not examined: no code has been read (TODO.md).
