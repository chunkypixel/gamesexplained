# Private working evidence

This directory is gitignored except for this README. Keep supplied G64/CRT
files, extracted programs and sectors, emulator snapshots, ROMs,
disassembler projects, CPU traces, browser screenshots, and intermediate
reports here. They are never pushed.

The canonical entry is `black-entry.vsf`, captured at PC=$6000 from the
Black Label disk. `play-round1.vsf` is a separate native room-one play
snapshot. See ../orientation.md for the boot procedure and file identity.

Recreate a private disassembler project from the committed symbols:

```
python3 kit/scripts/symbols_import.py games/c64/lode-runner games/c64/lode-runner/work/black-entry.vsf
```

Run the widget comparisons against the private play snapshot:

```
node games/c64/lode-runner/verify-mechanics.cjs games/c64/lode-runner/work/play-round1.vsf
```

All editor-write experiments use `user.d64`, a separate private blank disk.
