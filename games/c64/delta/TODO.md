# Delta — TODO

Tier: **Silver**. Coverage 100 %, `facts.md` verified, every feature
confirmed, live or explicitly open, minisite built, copy `agent-draft`,
coverage and verify on a proven model.

## For Gold

A human curates the page section by section (`kit/START.md`, the
`curate` step) and records it in `copy` and `steward`.

## Open

- Mix-E-Load, the loading-music remixer, belonged to the original loader;
  this crack does not contain it. An original disk or tape image would.
- "Delta Patrol", the US release, is not identified in this image.
- Which wave records take a credit away (bit 6 of byte 3) in play.

## Ideas for the page

- The attack-wave player on `waves.html` carries every stage but 14, 20, 25
  and 29, which differ from VICE in places (below). The recording
  run (`work/waves/record.js`, `pack.js`) covers all 32 stages and
  `work/waves/compare2.js` compares them with VICE; a stage that is made to
  match goes in by copying its file into `reference/waves/` and adding it
  to `STAGES` in `reference/delta-waves.js`.
  Later stages start from the VICE snapshots `delta_stageNN` that
  `vice_stage.py` saves at each stage's first frame (in the gitignored
  `tools/vice-home/`); without them, one pass from `wave1_start` remakes
  them, or VICE can be started from the machine's own state at the stage.
  Stage 14: in group `$32` (list 157) two enemies leave the top edge on the
  same frames in both, but VICE frees slot 3 a frame earlier and slot 4 a
  frame later than the machine, so the next enemies take other slots and
  the rest of the stage differs. Probably the cycles the video chip takes,
  which the machine does not model; not settled. Stage 20 has an
  enemy entering on the right one frame apart (group `$6F`, list 211; the
  same group in stage 29, list 91, and group `$2B` in stage 25, list 35);
  both are probably one timing difference the machine does not reproduce.
  But stage 19 looked like stage 14 and was not: VICE's own play had
  reached it with different game state (the random pointer `$8F` among
  900 bytes), and from the machine's state (`work/waves/state_at.js`,
  `inject.py`, at `irq_band_first` `$1888` on the group's first frame)
  its boss group matched. The VICE snapshots of stages 15 onward all
  descend from VICE's own play of stage 14, so the same check may settle
  14, 20, 25 and 29.
- A sound-effect player for the 21 effects at `$0406`.
- The hazard rows (rocks, bubbles, machinery) drawn from the spawn lists
  under the I/O area, stage by stage.
- A Play tab: the demo at `$9F40` replays recorded input and would be the
  test for a port.
- The trainer patch in `cheats.md`, tried live.
