# Gauntlet — agent history

Narrative of how the analysis went, including wrong turns, for the next
agent's benefit. This is the only file that narrates; `facts.md` and
`features.md` state current truth only.

## 11 October 2026, orient

The contributor uploaded `gauntletus_gold_1986cyan1.g64`. The release
v3.13.2 emulator passed 57 of 57; the frame renderer test passed. The
image booted through VICE's defaults, no `vicerc`, in about 75 seconds
to the credits.

The selection screen cost the first wrong turns. Fire on joystick 1 did
nothing, and neither did the `1` key. Reading the loop at `$3390` showed
why: fire is read only once `$FD` is no longer `$FF`, and `$FD` is set by
`$36E1` only while the glove's position (`$38A2`/`$38A3`) is inside the
box around ONE or TWO. Steering the glove there by reading its position
back, then pressing fire, worked; `work/route.py` does it.

A first scripted route lost the second SPACE (the controls screen stayed
up); the script now presses again until the loader is seen running in the
KERNAL's `$EExx`.

The hand-over (`JMP $8000` at `$34E2`) holds only the main program and
the font: the game loads its graphics, music player and object code
after the jump, so the play snapshot is the image to analyse.
