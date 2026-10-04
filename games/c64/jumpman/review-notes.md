# C64 Jumpman: Silver candidate covering all 32 level programs

Prepared for contributor review; no pull request or issue has been opened.

This adds a C64 Jumpman explanation covering the resident program and all 32 separately loaded level files. The contribution includes 90,583 annotated bytes, verified factual and feature ledgers, a 32-layout atlas and source selection for each image. Its interactive explanations cover bomb-driven scenery changes, robot routes, jumps, shooting, freeze timing, scoring, Randomizer choices, music and the raster display.

Native evidence includes Dragon Slayer completion with 54 hits and 2,800 points without losing a life, Gunfighter's first accepted hit with a no-fire control, Invasion's wrong-target collision, Grand Puzzle III transformation and death completion, and ordinary score qualification/initials entry followed by a save and hard-reset reload. Selected-level starting states and controlled experiments are labelled explicitly.

Validation of `78b879f` includes fresh identification of all 35 extracted files, all 90,583 included source bytes and 9,498 instruction decodes, a 20-fact/10-routine sample, 17 broader original-code suites, 114 additional boundary cases and 22 matching native comparisons. The drawing viewer matches 1,191 complete original-code bitmaps; the robot model matches 21,456 routine calls. Exhaustive Randomizer inputs, score/maze tests and bounded anomaly checks are recorded with their limits. Browser controls pass on desktop/mobile, and all 19 games in that checkout build. The audit reports explain corrections and distinguish self-validation from independent certification.

The kit gains named source images for overlays and tests for source selection, path handling, tool isolation and completed frame advances. These are integrated with upstream's shared launcher, stdio bridge, platform-aware listing and site changes. General reverse-engineering lessons use the new per-entry lesson format. [kit-bump]

The recorded tier is `silver-claimed`: Silver requirements are met and human copy editing has begun, while complete human curation for Gold remains open. Full campaigns, several natural consequences of controlled edge cases, and physical SID waveform fidelity are not claimed. No game binaries, snapshots or binary-bearing disassembler projects are included.

## Integration validation

The branch integrates upstream `9b15ea6` (kit 0.0.74). Conflicts in the launcher, bridge, listing, build checks and workflow records are reconciled; obsolete timing records are removed and per-step model provenance is recorded. All 25 minisites build; repository checks, 57 C64 unit tests, the shared C64/Spectrum self-tests, 57 native emulator checks and the complete tool footprint check pass. Desktop/mobile browser suites pass, including all maps/source selections and 794 bomb selections. Fresh results and remaining test limits are in `integration-audit.md`. The 66 canonical source listing/symbol files remain those of the audited candidate.

## Maintainer asks

- **Consider shared SID bus-read verification.** The original driver reads a writable SID control register; native CPU probes see the most recent global SID write. The game-local model declares its last-write/no-decay approximation. A shared timing/readback contract and a recorded hardware fixture would make later ports easier to validate. Open and closed kit asks were searched on 4 October 2026; no matching fixture request was found.

Upstream already addressed the host-speed test concern in `cdd6381`. The original measurement remains documented as historical host behavior in `kit-feedback.md`.
