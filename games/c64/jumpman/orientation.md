# Jumpman: orientation

## Image and machine

The contributor supplied `jumpman.g64`, a GCR image (`GCR-1541`, format version 0, 84 half-track slots), 282,168 bytes. Its SHA-256 is `de3ae72cb2ce3c7a34924ad03db3640c8b70e3663fa0d9d705cc971e8ac4c9b5`. The disk directory names it `JUMPMAN REV 1.0`. The original remains outside the repository; the run uses a copy in `work/`.

Machine: PAL C64SC, standard 64 KB, VICE-MCP release v3.13.2 (`v3.13.2-linux-x86_64-gui.zip`), Linux x86_64 without a display. The release's GTK build runs under Xvfb. The emulator capability suite passed 56 of 57 checks on 2 October 2026. Only `warp` failed: the test measured 46 loop passes per second with warp and 45 without. Exact stopping, frame stepping, input and snapshot determinism passed. All timings must use emulated frames or cycles, not host elapsed time.

This machine was already running tools for another checkout. This clone uses its own `tools/ports.json`; the emulator and disassembler clients read the same settings. regenerator2000 0.9.20 runs through its stdio interface with a local HTTP bridge. It answers on a full 65,536-byte snapshot image. Tool settings and logs stay in `tools/`.

## Reproduce first-level play

1. Start the emulator with `python3 kit/scripts/tools.py vice`.
2. Hard-reset it, resume execution, and autostart the working G64 image. VICE selects the first file, `JUMPMAN`. There is no trainer menu.
3. Wait through the coloured loading illustration. Loading `INTRO.SYS` takes minutes on this host; a static loading picture alone is not a failure. The first completed screen is an animated structure with the Epyx copyright and address.
4. Press and release RETURN. The five-option menu appears. Press and release `1`, then RETURN, then `1` for one player. In this run each key was held for 12 emulated frames and released for three frames; the first RETURN was held for 15.
5. Wait through `NEXT LEVEL / EASY DOES IT`, disk access and the level introduction. The completed first level has a bitmap playfield, ladders, bombs and the status panel.
6. Turn warp off before measurements. Stop between instructions and save without ROMs, with disk state. `work/play-level01.vsf` is a saved state in first-level play; `reference/level01.png` shows it.

Saved states also include `work/title-attract.vsf` and `work/options.vsf`. A snapshot load must use the local VICE snapshot name, and the working disk must remain available. Input held through a load must be released explicitly.

## Loader and loaded files

`JUMPMAN` is a 1,024-byte program loaded at `$0800`; its BASIC line enters `$0811`. It draws the loading picture, opens `INTRO.SYS` on device 8, and calls KERNAL LOAD at `$08D7`. `INTRO.SYS` carries 32,768 bytes for `$2000`–`$9FFF`. The loader checks `$9FFF` and, on success, jumps from `$08FB` to `$2F03`. The hand-over snapshot `work/entry.vsf` stops at `$2F03`, before its first instruction. Its complete `$2000`–`$9FFF` region matches the file byte for byte. The resident listing uses that original image; self-modified operands are described in their comments. The already-executed boot loader at `$0800-$0BFF` differs from its disk file in exactly two bytes: destination high bytes `$082F` and `$0834` have changed from `$FF/$FF` to `$08/$DC` after its screen/color clearing loop. Executing the original loop reproduces both changes; the other1,022 loader bytes match.

The disk contains 32 level files, `PLF01`–`PLF24`, `PLF2A`–`PLF2C`, and `PLF26`–`PLF30`. Each is 2,048 bytes loaded at `$3800`. These are overlays: one first-level snapshot cannot contain them all. For every file, a separate emulator snapshot stops at `$7514`, after the real loader has copied all 2,048 bytes into `$3000`–`$37FF` and before drawing or initialization. Each active overlay was compared byte for byte with its disk file and matched. `SCORES` is 1,024 bytes loaded at `$2000`. File sizes, load addresses and chains were read from this same disk through the emulator; extracted files remain under `work/disk/`.

## First-level observations

- Processor port: `$00=$2F`, `$01=$37`; BASIC and KERNAL ROM and I/O are visible to the CPU.
- IRQ vector `$0314/$0315` is `$4100`. Reading that entry shows a handler that examines `$D019` and `$D011`; this is not the default KERNAL handler.
- BRK and NMI RAM vectors are `$FE66` and `$FE47`. Hardware vectors read through the CPU view are the KERNAL vectors.
- At the observed raster position, `$D011=$3B`, `$D018=$09`, `$DD00=$C1`: bitmap mode in VIC bank `$8000`, screen matrix `$8000`, bitmap `$A000`. This is a sampled band, not a claim that the whole frame uses one mode.

## Stable measurements and level captures

The earlier `play-level01` capture occurs near the end of spawn while the live divider still reads9. `work/stable-01.vsf`, saved after20 additional no-input frames, has completed that transition and is the baseline for input/control comparisons. Input tests always restore the same snapshot and release controls between cases.

Each `reference/level-xx.png` comes from that file's real native load and private initialization, stopped at `$759C` before the main life-start animation. These images demonstrate initialized scenery; they do not demonstrate successful play or completion. `reference/frame.png` is the exact gameplay frame paired with the reconstructed memory excerpt.
