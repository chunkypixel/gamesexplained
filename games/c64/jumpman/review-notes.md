# C64 Jumpman: Silver analysis and interactive minisite

Adds a Silver candidate for C64 Jumpman, covering the resident program and all 32 separately loaded level files: 90,583 annotated bytes, a complete feature ledger, factual evidence, and separate source selections for each image. The minisite includes a 32-layout atlas, interactive bomb changes and robot routes, jump and shooting explanations, recorded Freeze timing, Randomizer inspection, music/effect playback, and a reconstruction of the captured display.

Native evidence includes Dragon Slayer completion, Gunfighter's first accepted hit with a no-fire control, Invasion's wrong-target collision, Grand Puzzle III transformation/death completion, and score entry followed by save and hard-reset reload. Selected-level starting states and controlled experiments are identified explicitly.

The kit changes add named source images to coverage, listing checks and the Source selector; preserve C64 tool isolation and snapshot/stream safeguards alongside the shared launcher and stdio bridge; and reject incomplete frame advances. The About tab distinguishes the main-image footprint from aggregate coverage. General verification lessons are recorded in the per-game lesson file. [kit-bump]

## Validation

- Binary, documentation, listing and skill-quotation checks pass; coverage reproduces and all 25 minisites build locally.
- The shared C64/Spectrum self-tests, 57 C64 unit tests, launcher tests and all 64 Python module imports pass. The live VICE capability suite passes 57/57; the complete tool footprint check is clean.
- All 66 canonical listing/symbol files survive upstream integration unchanged; the updated generator reproduces all 33 listings exactly from native snapshots. The original-data audit checks all 35 identified files, all 90,583 included bytes and 9,498 instruction decodes.
- The drawing viewer matches 1,191 complete original-code bomb-change bitmaps; Randomizer routines are checked over all 65,536 input states. Browser checks cover all maps and source selections, 794 bomb selections, robot/shooting/Freeze controls, audio and desktop/mobile layouts without script or local HTTP errors.

[Integration results](https://github.com/jankfoundry/gamesexplained/blob/a1710622b24f513d503f896c13441f8afd76b9d5/games/c64/jumpman/integration-audit.md), [published-claim audit](https://github.com/jankfoundry/gamesexplained/blob/a1710622b24f513d503f896c13441f8afd76b9d5/games/c64/jumpman/claim-audit.md), and [20-fact/10-routine semantic sample](https://github.com/jankfoundry/gamesexplained/blob/a1710622b24f513d503f896c13441f8afd76b9d5/games/c64/jumpman/semantic-audit.md) record the evidence, corrections and limits. These are self-checks, not independent certification; earlier sample errors and their corrections are disclosed.

The recorded tier is `silver-claimed`: human copy editing has begun, while complete Gold curation remains open. Full campaigns, natural reachability of several controlled edge cases, a full playable port and physical SID waveform fidelity are not claimed. Game binaries, snapshots and binary-bearing projects remain private.

Related maintainer request: #194 (shared SID bus-read verification). This contribution documents the game-local approximation; it does not resolve that shared API/hardware-fixture request.
