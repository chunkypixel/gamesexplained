# Jumpman: upstream integration audit

4 October 2026. This integrates upstream `9b15ea69a3895f69c298f1b671ed4c9235c54490` (kit 0.0.74) into the audited Jumpman candidate `78b879f6f496ab442687269d310c7f707525b016`. It is a compatibility and regression pass by the contributing agent, not independent certification. The compact results are in [integration-verification.json](reference/integration-verification.json).

## What changed

The merge reconciles shared-tool conflicts while preserving named source images, strict port validation, scoped process detection, snapshot module boundaries and completed-frame checks. It uses upstream's shared launcher and stdio bridge instead of keeping two bridge implementations. Ports resolve from environment overrides, saved launcher files, legacy JSON and defaults in that order. Tests cover failed streams, invalid ports, process paths, malformed snapshots and incomplete frame replies.

The retrospective now uses `kit/lessons/2026-10-04-jumpman.md`, records exact skill passages and per-step model provenance, and removes the retired timing record. The original analysis kit version remains 0.0.54 in `game.json`; this integration was tested with 0.0.74. The About tab explicitly distinguishes its main-image memory map from aggregate coverage across additional source images. Upstream already resolved the host-speed test concern; the historical measurement remains documented and the redundant maintainer ask is removed.

## Source preservation and game checks

- All 66 canonical `listing.json` / `symbols.json` files are byte-identical to the audited candidate. The new listing generator independently reproduces all 33 listings exactly from the retained native snapshots and unchanged annotations, writing only private comparison copies.
- The original-data checker rechecks all 35 previously extracted, hash-identified files, all 90,583 included bytes and 9,498 instruction decodes. This pass reuses the fresh extraction from the preceding audit; it does not claim another extraction.
- All 32 initial drawings and 1,191 bomb-change bitmaps match original routine executions. Both the random-number routine and chooser are checked over all 65,536 input states. The four stalled inputs and the limits on natural reachability remain explicit.
- Atlas headers, all 397 bomb records, source selection, jump trajectories, material lookup, IRQ order and retained native capture identities also pass. The earlier semantic sample and wider native routes remain documented evidence; they are not relabelled as newly replayed here.

## Repository and tool checks

The repository binary, documentation, listing, skill-quotation and whitespace checks pass. Coverage reproduces for all 25 games. All 64 tracked Python modules import. The launcher dispatcher, 57 C64 unit tests, source-image tests, C64 CPU/machine/lockstep tests, platform snapshot/project tests, client tests, browser helper tests, and the editor/model/skill/maintainer-ask parser self-tests pass. All 25 game minisites build.

The shared scripts serve both supported platforms, so upstream's Spectrum checks are included. With contributor approval, pinned SkoolKit 10.1 was installed from its project release on PyPI into ignored `tools/skoolkit/` (40 MB including virtual-environment packaging tools). The Z80 comparison passes over every opcode context; the simulator and control-file render tests pass. Earlier missing-dependency/skip logs remain in private work, with the successful reruns recorded separately. No global packages or settings changed.

The real VICE-MCP 3.13.2 capability suite passes 57/57 checks on this Linux host. Host speed is now informational, as upstream intended. A complete launcher/emulator/snapshot/disassembler/exit footprint check reports no unexpected writes outside the repository. The alternate-port stdio bridge is exercised with regenerator2000 0.9.20, and both scoped tools are stopped afterward.

## Page checks

Eight browser suites pass in the existing Chromium/Playwright installation: main controls and audio; Randomizer boundaries; 794 bomb selections; robot controls; shooting/stair displays; all 151 recorded Freeze observations; latest native-route explanations; and final audited wording/source links. They include every map and all 33 source selections, desktop/mobile layouts, evidence links and no JavaScript exceptions or local HTTP errors. Desktop and mobile screenshots were visually inspected. The final About clarification is also checked in the browser. That check exposed mobile overflow from an unbroken disk hash and private reference paths; the hash now has a scrollable code block and the paths separate directory from filenames, preserving their full values.

## Remaining limits and delivery

This integration preserves the Silver claim and its explicit evidence limits. It does not establish untested full campaigns, resolve every bounded anomaly or prove physical SID waveform fidelity. Human curation and independent factual review remain separate work. The contributor requested a pushed branch for review before any pull request or issue is opened.
