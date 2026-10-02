# Jumpman: run history

## 2 October 2026

The contributor requested Silver, authorized game research and screenshots, and approved downloading VICE-MCP v3.13.2 and reusing an installed regenerator2000 0.9.20 binary. They requested a pushed branch for review before a pull request or maintainer issues. Commit author was verified with a detached, empty commit as JankFoundry using the GitHub noreply address for jankfoundry. The contributor identified the session model as GPT-6 Astra Extra High.

The default emulator and disassembler connections belonged to other active projects. Rather than interrupt those projects, this run added per-clone port settings and used the disassembler's existing stdio interface behind a loopback HTTP bridge. The release downloaded into this clone's tools folder. No Rust installation was needed.

The first emulator capability run stopped at a wall-clock speed test: 22 passes in one second, despite the test program running. A repeat reached the end with 56 checks passing and only warp speed-up failing. Snapshot comparison and instruction-exact tests passed. A footprint run found no unexpected files outside this clone. The bridge's stop pattern initially used a Python-only regular-expression construct that pkill rejects; it was corrected before gameplay. A complete launch/use/stop footprint check will be repeated after the game snapshots are secured.

The supplied disk booted normally. Loading the 32 KB main program took several minutes; two RAM reads showed hundreds of newly loaded bytes, so the unchanged loading picture was not mistaken for a hang. The first level, Easy Does It, was reached through the unmodified menu. The IRQ entry and display registers were recorded, and the disassembler was started on the play snapshot.

The original hand-over was identified from the disk's loader as `$2F03`. A fresh boot with a stopping checkpoint there is collecting an entry image while the documented feature checklist is written. The disk's level and score files have also been extracted locally through sector reads; none will be committed.

The entry capture completed at `$2F03` and matched all32KB of INTRO.SYS. This mattered because spawn changes49 bytes of the original sprite slot at `$8E40`. The main project was rebased to that image while retaining annotations. Five sprite-shaped slots at `$3000` were retained and identified as duplicates rather than treating that pre-overlay workspace as a level.

Three agents independently annotated resident ranges and then disjoint level sets. All32 overlay snapshots were taken after the actual loader copy and before initialization; the entire2KB region of each matched its extracted file. The kit gained named source images so those same-address programs could be counted and browsed independently. Retained earlier-file code and art was compared against its donors and described rather than excluded. Fourteen resident zero gaps were excluded only after all agents' incoming-pointer and drawing-read audits.

The renderer initially reversed multicolor indices by following one intermediate bit permutation. A comparison of all8192 bytes against the original routine caught it; the second permutation cancels the first. All194 initial and post-bomb stream comparisons pass after correction. Hailstones required treating the missing FF bomb terminator as a genuine file property, not interpreting the following executable bytes as intended bomb records.

The first play snapshot preceded the divider9→4 transition. A stable snapshot after20 frames replaced it for input/no-input experiments. Native checks confirmed deferred speed, threshold boundaries, score ties, Randomizer01/25, bonus subtraction and a controlled16-bit final-award overflow. None of the poked rare states was presented as a legal route. A controlled score SAVE followed by zeroing RAM and native LOAD restored all1024 bytes on the working disk.

Sound tests initially left writable SID reads open. Actual CPU writes ofA5/81/21/00 to D406 followed by the game's read ofD404 returned those last global values. The browser default therefore uses a last-write bus approximation, explicitly without decay. Original-code tests cover both declared read models, and Chromium exercised real AudioWorklet playback. The frame reconstruction matches all104448 pixels using200 excerpted character-ROM bytes rather than shipping a complete ROM.

The minisite was assembled from verified models before its prose pass. Browser checks exercise all32 map selections, all33 source images, the jump controls, score threshold, Randomizer examples, frame toggle and sound transport. The first browser harness failed because a numeric HTML id needs a quoted attribute selector in CSS; this was a harness error, corrected before the complete run.

The final native tool cycle passed after the bridge review: launch, snapshot, disassembler start, both tools stopped, and no unexpected files outside the clone. A second bridge launch on the saved project completed real MCP initialization and listed 28 tools before stopping. The shared test suites and page-editor checks passed; the latter exercised 6,350 edits on 46 pages. The measured workflow total was 2.0 hours.
