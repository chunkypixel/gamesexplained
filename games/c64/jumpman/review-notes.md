# Proposed pull request

Title: Explain C64 Jumpman, including all 32 level programs

Jumpman replaces the same 2 KB with 32 separate level files. This contribution explains the resident image and every loaded level independently, with 100% aggregate coverage (90,583 bytes), verified facts and a complete feature ledger. The minisite includes a 32-file atlas, a jump stepper, a recorded freeze-timer scrubber, a Randomizer inspector, stored music/effect playback and a frame reconstruction matching all 104,448 captured pixels.

The kit gains named source images so the Source tab, coverage and stale-listing checks handle overlays. Alternate per-clone ports and a stdio bridge let the tools coexist with other active checkouts; launcher containment, notification/EOF handling and path encoding have regression tests. Workflow notes cover record sentinels, callback order and hardware readback. [kit-bump]

Validation: all 19 game minisites build; binary, documentation and listing checks pass; 4 source-image and 26 tool-isolation tests pass; launcher dispatch tests pass. Chromium exercises all 32 map images, all 33 source images and desktop/mobile controls with no script errors. Native and original-code tests are detailed in facts.md, including naturalABC score save/reboot, exhaustive maze bounds, controlled final-stage death completion,25 title-loop behavior and bounded Hailstones contacts. Broader checks cover14 private programs, with ordinary-input interactions in eight selected levels; corrected robot edge openings and follower delays are recorded alongside explicit legal-playthrough limits. The full tool footprint check is clean.

This is Silver, claimed by jankfoundry for curation. Human copy edits have begun in the Randomizer paragraph; full section-by-section review remains open. Natural consequences of several traced edge cases remain explicitly open; the sound model omits SID bus decay and within-frame write timing. No full playable port or Gold curation is claimed.

## Maintainer asks

**Investigate the Linux warp measurement.** On 2 October 2026, VICE-MCP 3.13.2 release under Xvfb passed 56 of 57 capability checks; the warp comparison reported 46 versus 45 loop passes/second. Exact instruction stopping and determinism passed. Please determine whether the speed check needs host-specific treatment or whether an upstream issue is warranted. The measured result is in the C64 install table and this game's kit-feedback.md; no cause is inferred.

**Consider shared SID bus-read verification.** The original driver reads a writable SID control register, and actual CPU probes see the most recent global SID write. A per-register shadow would make a port and its CPU test agree for the wrong reason. The game-local model now declares its last-write/no-decay approximation. A shared timing/readback contract and recorded hardware fixture would let subsequent games verify that behavior more accurately; this is a maintainer decision about the synth API.

The contributor requested review before opening anything. This text is a prepared description, not an opened pull request or filed issue.
