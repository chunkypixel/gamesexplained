# Jumpman: kit feedback

Run: 2 October 2026, JankFoundry, GPT-6 Astra Extra High (`gpt-6-astra`). Silver; agent-draft copy. The contributor authorized a pushed branch and requested review before any pull request or maintainer issues.

## Changes made

- **Loaded source images.** A resident-only ledger cannot account for 32 different programs loaded over the same 2 KB. `source_images.py` validates named directories under `reference/`; coverage sums independent ledgers, listing checks include every image, and the Source tab selects each one without conflating its addresses. Its URLs are encoded from canonical contained paths. Four tests cover reused addresses, stale secondary comments, containment and URL metacharacters. The workflow now inventories loaded files before dividing annotation ranges and preserves native pre-initialization snapshots.
- **Explicit entry image.** `listing.py` accepts an explicitly supplied entry snapshot even when it is the same file as the listing image. That is appropriate for a stopped loader capture, not permission to synthesize an image.
- **Concurrent tool sessions.** `tools/ports.json` supplies matching ports to the C64 launcher and clients. This run used 16510/13000 while other work occupied the defaults. Invalid or duplicate port settings fail rather than silently falling back. The alternate disassembler port uses its existing stdio mode through a local HTTP bridge. Snapshot conversion stays inside the declared C64MEM module, JSON-RPC notifications do not wait for replies, and incomplete/failed streams fail closed.
- **Tool containment.** The launcher supplies XDG paths for the disassembler, quotes terminal arguments safely, identifies the actual disassembler source rather than a wrapper's text, and confines stop patterns to this clone. 26 isolated tests cover configuration, paths, transport and snapshot boundaries. The full launcher dispatcher suite also passes. The new tests are in CI.
- **Scanner boundaries.** The verification skill distinguishes a gameplay target count from a record count and requires checking the sentinel the consumer actually uses. A missing terminator remains a source fact; a visible failure still needs a reachable triggering state.
- **Hardware readback.** The minisite skill now tests a writable-register read with the real CPU before accepting a per-register shadow in an audio port. The article names bus-decay and within-frame timing approximations.

## Validation and host behavior

VICE-MCP v3.13.2 Linux x86_64 GUI release, under the existing Xvfb in a Codex desktop session without an X display. regenerator2000 0.9.20 was reused from an existing installation and copied into `tools/cargo/bin/`; no Rust or system package installation was needed. Existing Chromium and Playwright were reused for browser checks.

The emulator capability suite passed 56 of 57 checks. Only warp speed-up failed: 46 versus 45 loop passes/second. Instruction-exact pause, frame advance, input, snapshot determinism and the complete native level loads worked. The run therefore measured frames/cycles, never host elapsed time. The install table and Linux status entry record the dated observation without attributing a cause.

The complete launch/snapshot/disassembler/exit footprint check passed after the launcher changes. Snapshot output stayed under this repository, both local tools stopped, and the scan found no unexpected outside files. The updated bridge was then started on the saved annotated project, initialized through the real stdio server, queried for its 28 tools and stopped successfully. Raw snapshots, disk files, projects, traces and scratch tests remain gitignored.

All 19 games build. The game page passed actual Chromium desktop/mobile checks: 32 map selections and initialized screenshots, 33 source selections, frame comparison, jump controls, score checks, Randomizer examples and AudioWorklet playback/mute/Stop. There were no JavaScript exceptions or local HTTP errors. Visual inspection covered the early map/music sections and the mobile atlas. The explanatory renderer matches 194 original stream executions; the complete frame matches 104,448 pixels with zero differences. Audio and movement validation and their limits are recorded in `facts.md`.

## Maintainer asks

No issue or pull request was opened, as requested. These two asks are prepared under **Maintainer asks** in `review-notes.md` for the eventual pull request description:

1. Investigate the v3.13.2 warp speed-up result on this Linux host. The measurement is reproducible evidence of this test run, not proof of an emulator regression; the right upstream change is undetermined.
2. Consider a shared SID bus-read/timing contract and a hardware comparison fixture. This game-local driver explicitly approximates the last global write without decay; the shared synth does not expose a cycle-accurate writable-register bus.

## What took longest

| Step | Minutes | Model | Sessions | What dominated |
|---|---:|---|---:|---|
| 10-orient | 12 | gpt-6-astra | 1 | Reached first-level play; collecting original loader hand-over at $2F03 while documenting features. Separate ports required for concurrent checkouts. |
| 20-features | 3 | gpt-6-astra | 1 |  |
| 30-text | 1 | gpt-6-astra | 1 |  |
| 40-sweep | 4 | gpt-6-astra | 1 |  |
| 50-coverage | 64 | gpt-6-astra | 1 | Four agents mapped the resident program and 32 separately loaded 2 KB overlays; all overlays captured through the native loader. Includes controlled live checks and renderer/audio port verification performed while annotation agents ran. |
| 60-verify | 12 | gpt-6-astra | 1 | Verified native movement/speed, score boundaries/ties, randomizer01/25, bonus, final-award carry, SID bus behavior and score SAVE/LOAD. Original-code checks cover all PRNG states,194 drawing streams, jumps and23764 sound frames. Coverage90583/90583 across33images. |
| 70-minisite | 13 | gpt-6-astra | 1 | Built self-contained article and32-file atlas, integrated verified drawing/jump/randomizer/audio models and exact reconstructed frame; all33 source selections and desktop/mobile controls pass Chromium. Copy rewritten after widgets; tool footprint also retested clean. |
| 80-retro | 10 | gpt-6-astra | 1 | Added named-source workflow and CI checks, concurrent-port/stdio containment fixes, sentinel/readback verification lessons, dated Linux results and prepared maintainer asks. Full tool footprint clean; all19 game builds and repository checks pass. |
| total | 120 | gpt-6-astra | | 2.0 h of work |

The single change that would have saved the most minutes is identifying independently loaded source images before annotation, so one play snapshot cannot be mistaken for the entire game.
