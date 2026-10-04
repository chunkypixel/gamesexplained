# Skate Or Die — agent history

Narrative of how the analysis went, including wrong turns, for the next
agent's benefit. This is the only file that narrates; `facts.md` and
`features.md` state current truth only.

## Town navigation and overlays

The first High Jump load suggested all right-hand town paths might be on
side 1. Later Jam and Race loaded with side 2 mounted. Returning to High
Jump with side 2 mounted produced the explicit `INSERT SIDE 1 AND PRESS
BUTTON` prompt, and the load resumed after a side swap and joystick fire.
Do not infer a disk-side map from the directory: side 1 lists only `EA`, but
the loader reads further tracks directly.

Early town navigation held left or right for seconds, causing apparently
random results. The manual's "forward in the direction you face" is
literal: up moves forward, while left and right rotate. VICE frame advance
gave reproducible routes in `orientation.md`. The central `DOWNHILL` sign is
not itself an event entrance; the separate lower-left and lower-right paths
lead to Race and Jam.

Several attempts to reach Freestyle by steering around the right side
entered High Jump. A town snapshot taken before the High Jump gate changed
only 324 RAM bytes from the initial town state. `$2F/$30` tracked the skater
sprite: writing them in a restored snapshot moved the sprite after two
frames. Poking coordinates beside the Freestyle label and skating forward
still selected High Jump, even when the upper lane was used. The remaining
selection state or path logic has not been identified, so do not present
this as a Freestyle capture. All modified states were throwaway snapshot
loads; the source images and saved clean snapshots were not changed.

The first High Jump flow trace covered 2,018 code bytes, but the ledger
tracked only 3,612 bytes in total and initially explained 1.1%. Describing
raster work, sound scheduling and graphics routines improved the figure,
but it remained a fraction of the High Jump image, not a whole-game
measurement. RAM comparisons between event snapshots differed in more than
50,000 byte positions and confirmed that the events need separate analysis.

The first sound trace stopped at `$2394`, which dispatches via an RTS target
from split tables rather than a direct jump. Seeding its ten distinct
targets exposed a second dispatch table at `$27ED/$27F8`; seeding those 11
targets expanded the High Jump listing from 996 to 1,628 instructions. This
is why a low early code count was not evidence that the rest of the overlay
was data. No bytecode behavior was named until its handler was read.

The phase table at `$2AB9` exposed nine handlers. The first flow trace from
them decoded inline text after `JSR $1242` as repeated `JSR $2020`, then
invented an edge to `$4150`. Reading `$1242` showed that it consumes the
NUL-terminated `PASS:`/`HEIGHT:` string after its call and resumes at
`$09CA`. The string was retyped as bytes, `$4150` was cleared to undefined,
and disassembly restarted at `$09CA`. High-RAM `$Fxxx` code was retained:
there are actual calls and data references to that area while the KERNAL
is banked out, and its RAM bytes differ from the ROM bank. Its loader and
play roles remain to be separated.
