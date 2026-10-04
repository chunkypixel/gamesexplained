# Lode Runner — kit feedback

Run on 4 October 2026, kit 0.0.74, Ubuntu Linux x86_64, by jankfoundry with Codex. The contributor requested a pushed branch for review before any pull request or issue filing.

## Skill text that changed what I did

- `60-verify`: "Measure the listing before calling it done": the independent sample found 17 wrong details in 60 comments, triggering complete independent routine/data reviews before publication.
- `50-coverage`: "Resolve every pointer table before excluding a region": the editor and guard directories contain target-minus-one return addresses; resolving them exposed code that ordinary flow tracing missed.
- `70-minisite`: "Sweep the whole input space, not a few plausible values": route-cost comparisons cover all 200704 legal inputs; score boundaries and high-pitch aliases also run against original instructions.
- `70-minisite`: "Draw from the memory the game draws from": the widget embeds a trimmed live frame, and compares the play atlas with the hand-over atlas, rather than rendering generated state from the entry image.
- `60-verify`: "When you measure with breakpoints": pacing measurements include an active IRQ checkpoint alongside main-loop and hole-update counts, so a stopped or idle machine cannot masquerade as slow gameplay.

## What was changed in the kit

- `kit/skills/core/60-verify/SKILL.md`: see `kit/lessons/2026-10-04-lode-runner.md`.
- `kit/scripts/browser.py`: an explicitly selected existing Chromium/headless-shell executable offers CDP when Firefox is absent; its profile, XDG state, and temporary directory stay under tools. A selectable port avoids other sessions' browsers.
- `kit/scripts/test_browser.py`: tests check Chromium profile/environment containment, POSIX extended-regex compatibility, and that stopping this clone does not match another profile or shell text.
- `kit/scripts/tools.py`: browser help names the installed-browser option.
- `kit/INSTALL.md` and `kit/skills/core/70-minisite/SKILL.md`: document the explicit option, port setting, tested origin/client, and containment limits.

The launcher downloaded nothing. This host already contained Playwright headless-shell build 1243, Chromium 153.0.8010.12, and Playwright Core 1.59.1. The full Chrome build failed on the deep profile path's Unix socket limit; headless-shell worked. Default Firefox behavior is preserved. Both C64 tool footprints passed the existing verifier; that verifier does not scan browser state. The launcher supplies local browser directories and the stop-pattern tests cover ownership, rather than claiming a complete browser filesystem audit.

## Candidates

Map row directories can conceal gaps between active cells. Here a four-byte gap follows row eight, so a contiguous-grid interpretation silently addresses the wrong cells. The existing pointer-resolution rule led to the correction; no additional skill rule was needed.

## Maintainer asks

None. No issues or pull request were opened, following the contributor's review-first instruction.

## What cost the most time

Enumerating each indexed table's reachable caller range before writing comments would have saved the largest correction pass; the verify rule is sharpened in this branch.

## Tool behavior encountered

VICE pause can briefly leave an instruction in flight; the kit's pause helper plus repeated stable-PC reads was used before pokes. Failed early screenshots were loading states and were replaced with completed title/play states. The editor's physical key chord entered play during automation; the editor integration experiment therefore injected the documented command latch and records that distinction. All disk writes use a private newly formatted user disk. The original images remain unchanged.

Cleanup exposed a regex dialect mismatch: Python accepts noncapturing groups, while pkill uses POSIX extended regex. The launcher uses a capturing alternation, and a grep -E test now checks the actual dialect before process ownership tests. The real stop command passed after this change.

## Prior-analysis validation follow-up

The earlier cartridge disassembly supplied a second data path that exposed a silent room-browser alignment error. The page-specific `verify-comparison.cjs` now rejects the offset-zero decode, compares a native room buffer, executes the original disk read/decode sequence across all three room stores, and checks the cartridge decoder independently. Its hole/tile helpers also run against original routines rather than matching a duplicate formula.

- `kit/skills/core/70-minisite/SKILL.md`: the existing runtime-memory rule now includes resource-transfer alignment; see `kit/lessons/2026-10-04-lode-runner.md`.

Comparison content has its own evidence/provenance record and a separate copy rewrite. The source project was read only. No download, pull request, issue, or deployment was needed for this follow-up.

## Contributor presentation review

The first hole widget began open, so its start button only reset a counter. Small increments gave little visual feedback during the long open-picture interval. It now begins before the user action and offers timed playback, scrubbing, and explicit closing stages. This visible UI problem is recorded here and in agent-history.md; the existing minisite interactivity rule covers it, so no shared skill or launcher change was needed. The page-specific check follows the full original countdown and records its actual picture changes.
