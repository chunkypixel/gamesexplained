# Jumpman: kit feedback

Run: 2–4 October 2026, JankFoundry, GPT-6 Astra Extra High (`gpt-6-astra`). Silver, claimed by jankfoundry for curation; human copy editing has begun. The contributor authorized a pushed branch and requested review before any pull request or issues. Original analysis used kit 0.0.54; the submission integrates upstream kit 0.0.74. `agent-history.md` and the audit reports retain the individual investigations and corrections.

## Skill text that changed what I did

- `70-minisite`: "Draw from the memory the game draws from.": the atlas uses native initialized level captures; disk drawing data alone does not include every private initialization change.
- `70-minisite`: "Sweep the whole input space, not a few plausible values.": exhaustive Randomizer inputs found three nonzero seeds missed by the earlier sample; the page now handles all four zero-state traps.
- `60-verify`: "A live test in one room tests one room.": the evidence distinguishes selected-level ordinary-input interactions, controlled setups and complete campaign routes, including in the submission description.

## Changes made

- `kit/scripts/source_images.py`, `coverage.py`, `check_listing.py`, `build.py`: named, contained source images count independently and receive separate Source selections; the About tab distinguishes its main-image memory map from aggregate coverage. Jumpman's 32 overlays reuse the same addresses; a single resident ledger would silently omit them. Four tests cover independent counting, stale comments, path containment and URL encoding.
- `kit/scripts/listing.py`: an explicit entry snapshot may be the same file as the listing snapshot, allowing a stopped loader capture without inventing an entry image. Upstream's platform decoding and undocumented-opcode handling are retained.
- `kit/c64/ports.py`, `tools.py`, `vice.py`, `r2000.py`: launcher and clients share environment, saved-file, legacy JSON and default port resolution; invalid or colliding settings fail explicitly. This permits separate active checkouts without connecting to the wrong session.
- `kit/c64/stdio_bridge.py`: upstream's alternate-port bridge retains snapshot module-boundary checks, unique converted projects, notification handling, serialized reply matching, and refusal after a timeout or broken stream. The older duplicate bridge is removed. Occupied ports fail before spawning the backend.
- `kit/c64/tools.py`, `test_tool_isolation.py`: retain actual process-argument/source checks and clone-scoped stop patterns while using upstream's shared launcher and XDG containment. Tests exercise paths with spaces and shell metacharacters, process ownership, ports and snapshot boundaries.
- `kit/c64/vice.py`, `test_vice_client.py`: a frame request rejects a failed, partial or malformed completion; an RPC reply alone is not evidence that game time advanced.
- `.github/workflows/ci.yml`: adds the source-image checks to upstream's full C64/Spectrum suite; C64 unittest discovery includes the isolation and frame-client checks.
- `kit/skills/core/10-orient`, `50-coverage`, `60-verify`, `70-minisite`, and the C64 tool skills: general lessons are collected in `kit/lessons/2026-10-04-jumpman.md`.
- `kit/c64/INSTALL.md`: records the tested Linux setup and consolidated port precedence. Retired timing records are removed in accordance with upstream; `game.json.step_models` records coverage and verification provenance.

- `games/c64/jumpman/orientation.md`, `features.md`: present the disk hash in a scrollable code block and split private directory/filename references so the About tab fits mobile screens without shortening the evidence.

## What cost the most time

Inventorying every independently loaded image before assigning annotation ranges would have avoided the largest recovery: reconstructing separate native projects, ledgers and evidence for 32 programs sharing one address range (see `kit/lessons/2026-10-04-jumpman.md`).

## Validation and host behavior

VICE-MCP v3.13.2 Linux x86_64 GUI release runs under the existing Xvfb in a Codex desktop session without an X display. regenerator2000 0.9.20 was reused from an existing installation and copied into `tools/cargo/bin/`; existing Chromium and Playwright were also reused. For upstream CI compatibility checks, the contributor approved SkoolKit 10.1 from its own PyPI release (GPLv3); its virtual environment occupies 40 MB under ignored `tools/skoolkit/`, including Python packaging tools. Download, cache and temporary paths were confined to `tools/`. No Rust or system package installation was needed. Raw disk files, snapshots, projects, traces and scratch tests remain gitignored.

The original capability suite passed 56 of 57 checks: only its host warp speed comparison failed (46 versus 45 loop passes/second). Upstream has since changed those host-speed measurements to information rather than capability failures (issues #176/#178, commit `cdd6381`), so this is no longer an unresolved ask. Instruction stopping, frame advance and determinism passed in that run; gameplay measurements use frames/cycles rather than host elapsed time.

Original-code, native and browser evidence is indexed by `facts.md`, `claim-audit.md` and their linked reports. It includes exact included-byte checks, all initial level renderings, bomb changes, robot decisions, exhaustive score/maze/Randomizer inputs, ordinary Dragon Slayer completion, Gunfighter hit/no-fire control, puzzle transformation/death completion, score save/reboot and bounded anomaly checks. Corrections are recorded rather than hidden. The audio model still approximates bus decay and within-frame write timing; selected-level routes do not establish a full legal campaign.

The upstream integration is checked separately in `integration-audit.md`; it must preserve all 66 canonical listing/symbol files from the audited candidate. These are self-checks, not independent certification.

## Maintainer asks

The contributor requested review before publication. The full ask below is prepared for the repository's issue-on-merge workflow; no issue or pull request has been opened. Open and closed `kit-ask` issues were searched on 4 October 2026; no existing SID bus-read/timing fixture ask was found.

- **Consider shared SID bus-read verification.** The original driver reads a writable SID control register, and native CPU probes see the most recent global SID write. A per-register shadow would make a port and its CPU test agree for the wrong reason, requiring game-local probes to catch it. The game-local model declares its last-write/no-decay approximation. A shared timing/readback contract for `site/lib/sid.js` and a recorded hardware comparison fixture would let later ports verify this more accurately; this is a maintainer decision about the synth API.
