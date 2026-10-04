# Lode Runner — orientation

## Analysed image

The canonical image is the supplied **Lode Runner (Black Label).g64**, SHA-256 `7b42d319e107bc4228da582eec12dfc62b68b1b6869c51e56299ed735293919f`. Its directory contains LR (3 blocks), DB (12), and IT (89). IT loads 22,528 payload bytes at $6000–$B7FF. DB loads 2,815 bytes at $1400–$1EFE. The listing includes all 25,343 bytes of those two payloads.

The supplied files remain private in `work/`. No disk, cartridge, emulator snapshot, ROM, or disassembler project is part of the contribution.

## From power-on to the listing

1. Start VICE through `python3 kit/scripts/tools.py --platform c64 vice`. This run used vice-mcp v3.13.2, PAL C64SC, 6581 SID, and true-drive emulation. All 57 emulator qualification checks passed.
2. Hard-reset. Arm an execution checkpoint at $6000, then autostart the Black Label G64. Allow the original loader to finish its disk reads; its screen warns that loading can take about 1.5 minutes. The checkpoint must report PC=$6000 before the first engine instruction.
3. Save `work/black-entry.vsf` with disk state included and ROMs omitted. This is the canonical listing image. Its entire IT and DB payloads compare byte-for-byte with read-only extraction from the original disk.
4. Delete the checkpoint and run through initialization and the original disk probe. Wait for the complete LODE RUNNER logo, rather than saving the temporary blank loading display. This run saved `work/black-title-ready.vsf` and `reference/black-title.png`.
5. Press port-2 fire to start. Allow the first board's disk read and reveal to finish. The runner flashes while waiting for input; moving right starts the main loop. `work/play-round1.vsf` holds room-one play after a short rightward movement, with inputs released. `reference/black-playing.png` shows this state.
6. Start regenerator2000 through the launcher with `work/black-entry.vsf`. Import the committed symbols if recreating the project. Seed engine $6000, IRQ $648A, NMI $65CF, and the explicitly resolved editor/control/guard RTS targets. Inline strings and sound events must remain data.
7. Export symbols, then build: `python3 kit/scripts/listing.py games/c64/lode-runner games/c64/lode-runner/work/black-entry.vsf`.

Tool ports in this run were VICE 6512 and disassembler 3003; other local instances occupied the default ports. The launcher records the chosen ports under `tools/`.

## Steady state

In the captured play state, $01 is $36. Its low three banking bits are %110: BASIC is out, KERNAL and I/O remain visible. The IRQ vector at $0314 is $648A, which chains to KERNAL $EA31. The NMI vector at $0318 is $65CF, a single RTI. Engine code and authored tables remain at $6000–$B7FF; room sectors are loaded into $1000. High scores use $1100. The display bitmap is $2000; the preserved work bitmap is $4000. Startup generates their row lookup tables and the actor sprite buffers.

The Source listing contains hand-over bytes. Separate entry/play comparisons identify live self-modification and generated state; the private play snapshot supplies runtime tests and the captured frame. The title RLE is present at hand-over; the expanded bitmap is generated output. Retained copies, assembler records, lookup pages, music streams, and embedded demonstration sectors remain in the coverage denominator.

## Other supplied copies

The Gray Label image boots natively. Its DB payload is identical, and its IT differs in ten bytes: the entry selects $8E32 rather than $8E11, earlier probe result bytes are supplied in advance, and one probe comparison byte changes. The Yellow Label image also boots natively and reaches the same room-one/room-two attract screens; its IT differs from Black in 275 bytes, including startup. The 150 room sectors compare identically across the three disks; their score sector differs.

The supplied CRT is labelled **Official Cartridge Image**. It is a generic 16 KB cartridge with a CBM80 header and entry $8009. It boots natively and shows a separate cartridge engine, with routines at different addresses from the disk engine. The disk listing must not be used as its disassembly. Its 17-board directory and selected engine differences are independently verified in `facts.md`; complete cartridge controls/editor comparison remains open.

## Loader boundary

LR is the original BASIC/machine-code loader; it loads DB and IT before the engine hand-over. The Yellow disk has additional loader/protection files. Loader internals and disk-protection implementation outside IT are outside this engine analysis. The disk probe inside IT is annotated. Read-only `c1541` extraction and all editor-write experiments use private working copies, preserving the supplied originals.
