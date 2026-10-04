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

## Cross-validation with the contributor's earlier disassembly

The contributor then requested validation and extra content from their separate local/private `jankfoundry/loderunner` project. Its supplied cartridge payload matches this run's CRT. Read the separate project's rules and current-state notes; kept all its existing working edits, services, captures, and files untouched. Recorded exact source hashes and HEAD in `comparison.md`. The contributor recalls mostly GPT-6 Astra; this is qualified as recollection, not a verified complete model history. No earlier labels or comment prose were transplanted into the disk listing.

Reassembled the earlier full source using the already-installed 64tass 1.59.3120, writing the output only to this game's private work directory. All 16,384 bytes match the supplied cartridge payload. This establishes byte representation of that source, not full cartridge semantic coverage or disk reassembly.

A comparison of cartridge room one with the disk buffer exposed a real error in the first Silver minisite: it decoded raw sector bytes 0–223. The original reader discards one CHRIN result, so the room payload is raw offsets 1–224. This had shifted every browser board by two cells, putting the first runner at (16,14) instead of (14,14). Fixed both page datasets and technical reference text. The page-specific verification executes the actual disk read loop and map decoder for all 150 boards from each of three disks, checks the native room-one buffer, and explicitly rejects offset zero. Stored maxima remain six guards and 48 exits.

Executed all 17 original cartridge RLE decodes and matched every expanded payload uniquely against the disk room set. Independently generated the cartridge's 76-source atlas using $A8BB and matched all pattern bytes with this run's native cartridge snapshot. Added edition-order browsing and a separate cartridge atlas view. Both engines agree on all 200704 route costs, 1624 score/display cases, and 50 tile/direction fixtures each. Cartridge motif progression is checked across 70 completions. Fresh VICE cartridge timing counted 144 IRQs, 48 loops, and 48 hole services across 120 PAL frames, supporting its default nominal 20 passes/second versus disk 30.

The prior hole-reachability argument was re-derived for the disk bytes and independently reviewed. Both forced native dig sequences complete on their thirteenth call. Original CPU routines check 18 final-phase obstruction cases, 720 services with 56 arranged allocations and peak 14, and all 16110 distinct positive timer pairs. The widget matches all native timers at each service; the arrangements do not certify a joystick route attaining 14. Trapdoor tests execute all persistent IDs in five approaches, with native support checks as a separate control. Added interactive capacity and directional-tile explanations.

Reconstructed the disassembler project from the committed symbols and canonical hand-over snapshot before changing four comments. The targeted independent audit found one retained spray-phase wording error: right phases12–23 animate, while24 enters allocation. Corrected in the disassembler and exported again; the audit remains a selected four-comment check, separate from the original random samples. The disk ledger remains 25343 explained/authored bytes.

The follow-up browser checks pass both edition selectors, cartridge room 3→disk 111 and room 17→disk 150, 17/150 bounds, marker toggles, both atlas bounds, the capacity boundary between 179/180 services, trapdoor approaches, and 390px overflow checks. All original controls/music/Source checks also pass without page errors. All 25 listings match their symbols and required binary/docs checks pass. The separate source-file hashes remain unchanged. Source-project state was saved and owned emulator/disassembler processes stopped after verification.

The separate final copy run revised 23 prose blocks against the house style, qualifying the normal-flow hole bound, cartridge index/artwork namespaces, and PAL timing measurements. Every script and embedded JSON hash matches the pre-copy baseline; no mechanic implementation changed during this pass.

## Contributor curation: hole countdown presentation

On 4 October 2026 the contributor found the first digging widget unintuitive: Dig a hole reset an already-open initial state, and one/ten-pass controls changed the counter while the picture remained open for most of the lifetime. Replaced that presentation with an intact initial brick, explicit Dig & watch playback, pause/resume, an elapsed-update scrubber, a large remaining count, and four stage buttons showing actual glyphs. The runner sits beside the hole rather than above it. Playback uses the documented approximate default disk cadence; the controller pauses when its document is hidden.

The contributor's presentation review starts curation, so game.json records silver-claimed and steward jankfoundry. Full article curation and Gold remain pending. Copy remains agent-draft for the uncurated article; this widget's text had a separate paragraph-purpose rewrite. Embedded game data, disk listing, original routines, and existing mechanics functions are unchanged.

Added a full-lifetime original-code picture check: all 180 successive updates agree with the displayed closing stage, and original work-bitmap writes select 55 at 20 remaining, 56 at 10, and 1 at zero. The original 203773 route/score/timer/SID cases also pass, giving 203953 cases including the new sequence. An initial probe watched the display selector rather than the work selector; tracing the refill path moved the observation to $899B and runs the original drawing routine without a stub.

Browser checks verified the initial intact brick, immediate digging picture change, countdown playback, stable pause, four distinct stage pictures, six boundary positions of the scrubber, automatic stop, replay, keyboard arrow stepping, and 390px layout with no page errors. The separate original comparison suite and existing browser regressions remain part of validation.

## Contributor curation: Music tab

On 4 October 2026 the contributor requested a Music tab after Maps / levels. Added music.html through the existing game.json tab configuration, keeping About last. Moved the queue player and all detailed music prose out of How it works, with a link beside gold collection. The Music page puts playback first, followed by SID note/envelope details and the disk/cartridge motif comparison. The main edition table now leaves the motif counts to that page.

The verified queue driver and audio data moved without changes, confirmed by hashes. Non-audio data on How it works is unchanged. Removed unused audio data and queue code from the map page as well. verify-mechanics.cjs reads the queue port directly from music.html and still passes all 203953 cases, including 1264 ordered SID ticks. No listing or original routine changed.

Browser checks exercised all eleven music selections, stop, voice mute switches, seeking, navigation into Music, Source and map controls, and both edition browsers. Desktop and 390px screenshots were inspected; neither page has horizontal overflow or page errors. The separate copy pass checked each Music paragraph's purpose against its section and retained the documented playback limits. The full site builds 25 games and 132 pages.
