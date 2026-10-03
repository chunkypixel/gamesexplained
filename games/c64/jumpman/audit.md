# Jumpman audit — 3 October 2026

This is a self-audit of branch baseline `936fa3d74982064b43c8bbce370200ceef7c9994`, followed by corrections and regression checks. It is **not independent certification** under `kit/CHECKING.md`, and no `verification` attestation has been added to `game.json`.

The [review of another contribution](https://github.com/gamesexplained/gamesexplained/pull/152#pullrequestreview-5398251577) supplied by the contributor illustrated useful failure patterns: a shared routine mistaken for every private handler, unchecked branch preconditions, page claims stronger than their evidence, and research images unintentionally published. Those patterns informed this audit; that other game's conclusions were not treated as evidence about Jumpman.

## Corrections

- **Randomizer inputs missed by the earlier sample.** The earlier chooser comparison covered 5,042 inputs. Exhaustive execution finds that `0000`, `4000`, `8000` and `C000` reach/stay at zero and retry `00` indefinitely. The page handled an initial zero but threw an uncaught error after repeated retries for the other three. It now explains all four stalls and clears the previous selection. All 65,536 inputs are checked against unchanged original instructions; 65,532 return a file suffix within three attempts. Controlled native checks confirm the four stalls while interrupts continue. These inputs are outside the uninterrupted sequence from the loaded seed; no normal-play exploit is claimed.
- **Disassembly comments mixed image states.** Several comments described a gameplay snapshot even though the canonical listing had changed to the original entry image. Fifteen comments now distinguish original placeholders from the values the running program writes. For example, `$4300` initially contains `JSR $FFFF`; a completed task pass leaves `$EA31`. The comments were edited in the native disassembler and exported, preserving source bytes, labels, types and coverage. The chooser comment also records the exhaustive results.
- **Loader provenance needed a qualification.** `INTRO.SYS` and all 32 overlays match their original file bytes. The already-executed boot loader has two modified destination high bytes, `$082F` and `$0834`. Executing its original clearing loop independently reproduces both. Orientation now states this distinction explicitly.
- **Private research images were publishable.** Two unused third-party screenshots were removed from `reference/` and retained under ignored `work/research/reference/`. The source URLs remain in `features.md`. Native captures remain published.
- **Evidence and delivery details.** Shooting evidence now names the exact start snapshots beside their hashes. Maintainer asks use the structured bold-bullet format introduced upstream. No pull request or issue was opened.

## Checks and their scope

The machine-readable results are in [reference/audit-verification.json](reference/audit-verification.json). The extraction, structural/original-code audit and Randomizer browser regression are committed under [checks/](checks/). Raw game files and snapshots remain private.

| Area | What was checked | What that establishes |
|---|---|---|
| Input revision | Original G64 SHA-256; all 35 files independently extracted with VICE `c1541` and compared to the earlier native-sector extraction | Both extraction paths produce the same identified inputs |
| Listings | Every included byte across 33 images; all 9,498 decoded instructions; symbol/listing hashes; complete included ranges without overlaps or gaps | 90,583 listed bytes match the inputs or the two reproduced loader changes; this does not prove each comment's interpretation |
| Native source images | Entry PC `$2F03` and 32 overlay PCs `$7514`; full original payload comparisons | The listings identify real native captures at the stated stage |
| Atlas | All 32 suffix/title/header mappings, 397 bomb records and 16,148 excerpt bytes; both pages' embedded data | The page's source data agrees with the files |
| Drawing widgets | Actual functions extracted from both authored pages versus original code; 32 initial bitmaps and 1,191 bomb comparisons, each 8,192 bytes | Erase/draw equivalence in the stated scope; private callbacks and legal collection order are excluded |
| Randomizer | All 65,536 PRNG states and chooser inputs; uninterrupted loaded-seed sequence; four controlled native stalls | Returning and non-returning inputs are distinguished; a selection boundary during ordinary play is a separate question |
| Timing | 512 native frames, 512 game services at `$417E`, 966 IRQ entries at `$4100`; one bonus decrement during the first 256 frames | Raw IRQ entry counts are not the game's clock; later death disables bonus timing |
| Level screenshots | All32 original pre-initialization states executed natively to `$759C`; fresh captures compared with the published images | All3,342,336 RGB pixels match; initialized scenes, not successful playthroughs |
| Evidence | Fifteen shooting screenshot hashes; all 49 Dragon Slayer hit records and summed input frames; 48 distinct named evidence snapshot hashes | The reports identify the local artifacts and their numeric summaries agree |
| Earlier original-code suites | Seventeen scripts replayed, covering movement, jumps, sound, drawing, robot routes, shooting, followers, progression, scores, maze bounds and Hailstones | The existing controlled tests still pass; rerunning them is not an independent semantic review |
| Browser | Existing atlas/source, scenery, robot, shooting and Freeze checks, plus all four stalled chooser inputs at desktop/mobile widths | Controls work and report their evidence consistently, without script or HTTP errors |

### Claim sample

This sample spans more than twenty claims and ten named routines/tables. “Repeated” means an existing original-code harness was rerun; “new” identifies an additional audit check. It deliberately includes behaviors whose scope is limited, rather than treating a passing controlled test as a complete playthrough.

| Claim / source | Recheck |
|---|---|
| Boot clear initializes its destination pages, `$0811` | New original-loop execution explains both modified operands |
| Loader and overlay load addresses / payload lengths | New independent extraction and all 33 native image comparisons |
| IRQ task order and `$EA` high-byte terminator, `$4004` | New table comparison; dispatcher order repeated in gameplay suite |
| Game-service clock, `$417E`, and enabled bonus counter | New native 512-frame observation; stopped-machine readings |
| Grounded movement requires pulse, live state and speed below9, `$4900` | Repeated original-code movement and gate cases |
| Second unsupported grounded update starts death | Repeated original movement calls with controlled material flags |
| Three 22-pair jumps; rise12, final descent14, lateral travel52 | New table arithmetic plus repeated 264 movement updates |
| Landing begins before pair8; lateral-only climbing contact | Repeated 396 contact decisions and Y-boundary checks |
| Bitmap address formula, `$4740` | Repeated 1,760 position/boundary cases |
| Material table's `FF` exception, `$7D00` | New exhaustive comparison of all 256 entries |
| Geometry stream interpreter, `$4D0F` | New comparisons using the actual published renderer; earlier 194-stream suite repeated |
| Collector drawing tail, `$567A` | New isolated, forward and reverse comparisons for all397 records |
| PRNG / chooser, `$5832/$5B8F` | New exhaustive inputs, repeat-state detection and native stall controls |
| Title lookup for missing suffix25, `$759F` | Repeated valid controls and repeated-state proof over128 pairs |
| One award per threshold invocation, `$5E06` | Existing native threshold evidence retained; browser repeated checks pass; not freshly recaptured natively |
| Sound priority, commands and voice state, `$458E/$44C0` | Repeated23,764 state/frame and23,413 ordered-write comparisons under the declared SID models |
| Zero-priority tune definitions, `$603C` | New descriptor comparison for IDs9/11/12/13; allocation behavior repeated |
| Initials selector, held fire and failed-partner sentinel writes | Repeated score-sentinel tests, including exact write destinations |
| Jungle's three reserve-count buckets | Repeated all256 cleanup inputs; prior controlled native transitions retained |
| Three Mystery Maze reveal bounds and inherited carry | Repeated393,216 original-coordinate cases; prior18 native boundary cases retained |
| Hailstones' missing terminator and ordinary contacts | Repeated all262,144 normal-coordinate sampler cases:1,600 collectible contacts, none unmatched; geometry/erasure checks also pass; no natural crash claim |
| Robots III private routes and asymmetric openings | Repeated21,456 calls, all30 nodes and four opening states; actual page controls checked |
| Freeze countdown, contact refresh, poll order and existing motion | Repeated original dispatcher/movement cases; all151 displayed observations match the recorded native series |
| Dragon Slayer hit awards and stair limit | Repeated original-hit/bitmap comparison; all49 published hit records and13 scenery states agree |
| Invasion's wrong-target hit | Repeated original sprite-pixel pair check against the pristine captured native state; no injected collision mask in that capture |

## Reproduce the committed checks

Use Node.js and Python with the existing kit. Supply your own copy of this precise disk revision. The scripts download nothing and contain no game image. Run from the repository root; choose a new empty extraction directory:

```sh
python3 games/c64/jumpman/checks/extract.py --c1541 tools/vice-mcp/bin/c1541 --image games/c64/jumpman/work/jumpman.g64 --out games/c64/jumpman/work/audit-inputs
node games/c64/jumpman/checks/audit.js --disk-dir games/c64/jumpman/work/audit-inputs --report games/c64/jumpman/work/audit-result.json
```

The extraction step verifies the complete disk hash before reading and all35 file hashes afterward. A different revision or modified score file fails identification rather than silently testing other bytes. The audit executes the original code from those files; it does not need the author's snapshots for those checks.

To also verify the **exact author's local captures** and report hashes, add `--snapshots games/c64/jumpman/work`. Those snapshots cannot be distributed with the contribution. A separately made snapshot normally has a different whole-file hash; that is not automatically evidence of a wrong game image. The optional check explicitly verifies the recorded artifacts.

For the browser regression, build with `python3 kit/scripts/build.py`, serve `_site`, and use an existing Playwright installation:

```sh
node games/c64/jumpman/checks/browser.js --url http://127.0.0.1:8000/c64/jumpman/
```

Use `--playwright /path/to/playwright` and `--chromium /path/to/chromium` when those existing tools are outside Node's normal lookup. No browser is installed by this script.

The earlier seventeen harnesses and native replay helpers remain in ignored `work/`; their outputs and limits are recorded, but they are not all distributable reruns in this change. Native checks require the emulator and a matching local starting state. A fresh independent review should select its own claims and cases.

## Limits and next review

100% coverage means every **included** byte has an annotation; excluded machine memory, generated output and justified padding are outside that denominator. Byte identity, passing tests and full annotation coverage do not certify every name, negative claim, code/data classification or prose interpretation. This audit did not independently re-derive every annotation or re-run every historical native route.

Full campaign completion, the open legal routes in `TODO.md`, physical SID fidelity and a complete attract replay remain unverified. No hidden feature is labelled an intentional Easter egg without evidence. Before submission, a separate reviewer should select at least twenty factual claims and ten routines/tables under `kit/CHECKING.md`, especially private level handlers and claims involving “all”, “only” or absence. The branch also needs a normal synchronization/review against the then-current upstream before opening the contribution.
