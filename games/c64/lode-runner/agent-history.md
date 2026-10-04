# Lode Runner — agent history

## 4 October 2026: scope and setup

The contributor chose Silver, authorized game/reference research, and requested a pushed review branch without opening a pull request or issues. The destination is `jankfoundry/loderunner-ge`, distinct from their existing `loderunner` repository. Commit identity was checked as jankfoundry with GitHub noreply email. The contributor identified the chat model as GPT-6.1 Sol Extra High; the kit records `gpt-6.1-sol`, a proven model. Independent comment auditors used the same model family with extra-high reasoning.

The repository was cloned from Games Explained at `8ff1a10`, kit 0.0.74. Read START, AGENTS, all eight core skills, house style, the C64 reference, and both C64 tool skills. Tool binaries were local copies of existing VICE MCP 3.13.2 GUI and regenerator2000 0.9.20 installations; state/logs remain under this clone's ignored tools directory. VICE required Xvfb. Ports 6512 and 3003 avoided other sessions. The emulator qualification passed all 57 checks, and both C64 tools passed footprint verification.

## Originals and canonical entry

Read-only c1541 extraction found LR, DB, and IT in the original disk images. IT contributes 22528 payload bytes at $6000; DB contributes 2815 at $1400. Native boot of the Black Label image was checkpointed before instruction $6000, and both extracted payloads compared exactly with the snapshot. This established the denominator before annotation. The BASIC loader is outside the engine scope; authored retained bytes inside IT/DB are included.

Early snapshots with plausible title/play names were taken during loading. Their blank screens and unsettled runtime state were discarded as evidence. Completed title and room-one states were saved separately. Native room-one rightward movement collected gold, leaving the play snapshot at 250 points; isolated scoring tests explicitly clear that baseline.

Gray's DB matches Black and its IT differs by ten bytes; the altered entry skips the first probe stages using prefabricated statuses. Yellow's IT differs by 275 bytes and its native boot reaches attract play through additional startup paths. All 150 room sectors compare byte-for-byte across all three disks, while the score sector differs. The CRT boots a separate 16KB cartridge engine; its filename does not prove it is the disk engine packaged unchanged. No disk addresses were applied to that cartridge analysis.

## Annotation and corrections

Flow tracing alone missed inline text, inline sound events, and editor/control RTS directories. Their words are handler-address minus one. Resolving these tables and resumed addresses kept text/events as data and revealed the handlers. The title is RLE-expanded bitmap data, and the gameplay glyphs are a transposed atlas rather than a VIC charset.

Two mistaken assumptions propagated into early comments: the $8995/$899B display/work bitmap selectors were reversed, and the $0800/$0A00 dynamic/backing maps were mislabeled. Full routine reviews corrected both. The generated row directories also revealed a four-byte gap after row eight. Forced gold and hole tests had initially addressed cells contiguously; the final tests use the actual directories.

An independent seeded sample found 17 material errors in 60 comments, including callers, byte counts, timing, and sound semantics. That result triggered full-body audits of all lower annotations, upper annotations, and remaining data. Agents wrote disjoint correction reports rather than changing the running project. Root checked substantive byte evidence in each report and merged names/comments through the disassembler. Symbols were exported after each session.

A new independent 60-comment sample found two wrong details and one ambiguity. Cold startup's score helper takes the demo path, not score-sector I/O; iris masks are four $F0 followed by four $0F, not alternating. The ambiguity concerned the glyph selector held in zero-page $23. These were corrected and separately rechecked. Source order changed while the second audit ran, so its report retains its original explicit sample addresses; rerunning its seed on the final source would select different entries. Neither correction recheck is represented as a fresh zero-error sample. Rates and limitations are in facts.md.

Coverage revealed tiny fields split by indexed references and self-modifying operands. They received precise comments rather than denominator exclusions. All 25343 authored bytes are explained in the final ledger. A final name/comment cross-check found the bitmap selector labels still reversed because renaming them directly collided with the existing names. A temporary label allowed the swap; every final source annotation name and comment now matches the export. Exact retained copies at $993E–$9FFF, source records, table tails, and demo boards remain included. Claims of complete non-use were narrowed to the direct/decoded searches actually performed.

## Verification

Forced VICE calls use a private play snapshot, stable-PC pause, scratch return checkpoint, and verified original opcodes. Tests check a positive control and restore between unrelated cases. Verified effects include packed-BCD +250/overflow, centered gold removal, exit processing, completed hole timer/refill, Ctrl-F saturation/eligibility, and a complete-room call awarding 1500 points plus one life. A full hole-table test shows an unregistered hole after a forced completed dig; player reachability remains open.

A 120-PAL-frame run counts 144 IRQs, 72 main-loop passes, and 72 hole updates. The original CIA latch is $4025. Since the pacing wait resets its counter to three, default threshold five waits for two IRQs. The first timing interpretation incorrectly treated five as the number of ticks per pass; the control counts and instructions corrected it.

The original CPU simulator checks the exact HTML widget functions: 200704 route costs, 1624 score/display cases, 181 hole timers, and 1264 ordered SID ticks, totaling 203773 cases. Sound testing includes ordinary high transpositions that read adjacent frequency bytes, and preserves the negative-harmony detune. The fourth event byte is loaded then overwritten, contrary to an early envelope interpretation. Guard schedule indexes likewise spill into adjacent threshold bytes; the page avoids claiming uniformly increasing guard speed.

The live frame was captured and rendered using the shared C64 renderer. All 104448 pixels match the VICE picture; no pixels differ. The page carries only 9257 RAM bytes read for that frame, plus extracted graphics/tables and decoded boards. No complete machine image is published.

The editor was entered by injecting the documented Ctrl-E command latch at the attract input loop. Automated physical chord injection had raced into live play, so that attempt does not establish successful keyboard entry. The editor menu and initialization warning were observed. Final cross-reading of $70DB with $6A88 also reversed a draft facts sentence: nonzero $11FB marks the master disk, while zero marks a recognized user disk. The listing status values were already correct. A private blank D64 was used for initialization; completion and save/reload were not established within this test. Misleading intermediate screenshots were removed. Disk-marker and editor-save paths are traced; end-to-end persistence remains open. No supplied original was written.

## Minisite and retrospective

Built interactive room browser, glyph viewer, exact captured frame, hole stepper, guard-cost controls, score arithmetic, and ten motif buttons plus a high-transposition example. Copy was drafted after analysis and then rewritten as a separate final pass against kit/style.md. Copy provenance remains agent-draft.

Firefox was unavailable. The host already had Playwright Chromium and a client, so the shared browser launcher was extended to accept an explicitly selected existing executable. Full Chrome failed because this deep profile path exceeded the Unix socket pathname limit; existing chrome-headless-shell worked. Chromium 153.0.8010.12 was driven over CDP by Playwright Core 1.59.1. No browser download or global installation occurred. The launcher isolates profile/XDG/temp state; existing footprint verification does not scan browser state, which is documented.

Browser checks exercised every mechanic control, all motif buttons, first/last room bounds, marker visibility, Source and Maps pages, and desktop/390px layouts. Every canvas drew, no script errors appeared, and the mobile page had no horizontal overflow. Browser review found a SID-row callback contract mismatch; changing `text` to `f` restored the voice panel before the passing check. The shared browser tests include ownership-pattern and directory-containment checks.

The retrospective sharpens indexed-table verification in the existing rule, records one lesson, and documents the browser fallback. Delivery is the contributor's review branch; a maintainer PR and any deployment wait for their instruction.

Final cleanup found that the new browser alternation used Python’s noncapturing-group syntax, which pkill rejects. A POSIX-compatible group and an actual-dialect grep -E regression test fixed it; stopping the owned browser was then exercised directly. Ten browser-launcher tests pass.
