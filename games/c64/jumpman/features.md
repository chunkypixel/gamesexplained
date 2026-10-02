# Jumpman: feature checklist

The inventory began from the supplied game's screens and the C64 manual, before code analysis. Status is the evidence now available: **live** means VICE observation, **traced** means original instructions/data, **differs** means the code contradicts the documentation, and **open** names a remaining verification limit. Controlled state tests do not prove player reachability. Addresses refer to the resident image unless a PLF file is named.

| Feature | Status | Evidence / limits |
|---|---|---|
| Animated EPYX and JUMPMAN title, attract demonstration | live + traced | Captured title; scripts `$93EE/$94D4/$998C` and actor VM `$9A98` explain animation and synthetic controls. |
| Five modes: Beginner, Intermediate, Advanced, Grand Loop, Randomizer | live + traced | Options screenshot; `$7A1C`, starts `$7BF1/$7BF6`, termination `$5BB4/$5BB9`. |
| Groups of 8, 10 and 12 numbered levels; 30 in Grand Loop | traced | Next-file markers 09,19,XX. Mystery Maze has three alternative files displaying25. All 32 files loaded and captured. |
| One to four players, alternating turns | traced | `$7A9C` rejects5; four 11-byte records `$51C4`, rotation `$5106/$7400`. Full four-player campaign not played. |
| Port2 joystick, directional jumping, ladders and ropes | live + traced | Controlled identical-snapshot input/no-input replays verify walking/up-fire/right-fire; `$4320/$4900`, level climb columns `$3020`. |
| Speeds1–8; new speed waits for next life | live | Key 1 changes `$40E3` while live divider remains 4; native respawn after controlled death applies1 at `$5799`. |
| Seven starting lives | traced | Initial reserve counter 6 at `$7BAF`; current life is separate, `$FF` is eliminated. |
| Extra life each10,000 points | live | `$5E06` tests at9999/10000; one award per invocation even for controlled30000. |
| Jump and fall hazards | live + original-code tests | Jump inputs verified live; 22-pair trajectory/contact port checked against original code. Unsupported grounded movement uses two updates, not a distance threshold. |
| Smart perimeter bullets | traced | `$6800`: cruise horizontal±2/vertical±1, align to player then attack±6/±3; initial header slot limits0/2/3/5. All-level survival behavior not replayed. |
| Collect all ordinary bombs; usually100 points | traced | Seven-byte records and `$55BF`; per-file points in `$3015`. Special records and callbacks change count/awards. |
| Bonus falls100 about every five seconds | live + traced | `$4026` wraps every256 enabled IRQs, about5.107s PAL. Live1500→1400,100→0 and zero-disable checks. |
| Completing a level adds remaining bonus to both totals | traced | `$5B00`; 24-bit score and cumulative-bonus fields `$40DA–$40DF`. |
| Geometry changes after bomb collection | original-code tests | Every decoded initial and post-bomb stream, including level30 stage2, matches all8192 output bytes of `$4D0F`. |
| Fixed up/down rope routes | traced | Header arrays `$3020–$302D`, movement `$4900`; bitmap contact and column matching determine traversal. |
| Moving blocks, lifts, robots, bats and level-specific hazards | traced | Each of32 PLF listings identifies private callbacks; initialized screenshots for every file. Individual level completion remains unplayed. |
| Shooting in Invasion, Dragon Slayer and Gunfighter | traced | PLF06/14/26 private controls and projectile callbacks; Invasion kill25 points, Gunfighter100. No declining initial bonus in these three files. |
| Puzzle bombs worth500 | traced | PLF07/15 special callbacks add 400 before ordinary 100; PLF30 second-stage special records use the same sum. |
| Three Mystery Maze variants selected by remaining lives | traced | PLF24 `$3214` tests reserve counts below 3,3–4,at least 5 and selects2A/2B/2C. All three loaded; full legal Jungle exit not replayed. |
| Mystery Maze hidden scenery reveals around player | traced | Private init colors hide existing bitmap; callback changes nearby matrix cells. Collision reads unchanged bitmap. |
| Randomizer excludes level1 | differs, live | `$5B8F` rejects only00; controlled seeds0002/1F27 emit01. E9A7 emits25, a missing file. Actual natural-session failure remains open. |
| Final life awards100/250/500/750 | traced + live corner case | `$29FF` rates; controlled 88×750 displays66000 but stores/adds464. A legal88-life route is unverified. |
| Completed groups light buildings | traced | `$2C00` flashes4/5/6/15 window pairs for modes1–4. |
| Separate total and bonus top20 score tables | live + traced | Records `$20A6/$20BA`, stride40; native insertion tests zero, positive, tie, greater. Ties rank below existing equal entries. |
| Three joystick-selected initials | traced | `$25FF` input,32-character alphabet `$26D4`, fire advances; complete natural qualification/input not exercised. |
| Completion mode letters / Randomizer R | traced | `$26CD` marks B/I/A/G/R/space; `$6CB0` sets exhaustion marker. |
| Scores saved on writable disk | live controlled + traced | `$2F84` scratches SCORES then saves exactly$2000–$23FF. Native SAVE, clearing1024 RAM bytes, then LOAD restores the full image. Natural qualification/reboot not tested; no explicit save-error branch. |
| HOME/CLEAR at initial loading resets score records | traced | `$2F08` accepts PETSCII13/93; replaces disk file with resident defaults. It does not zero the whole image. |
| Music and action effects | original-code + browser tests |16 tune IDs,11 effect auditions;23764 frame/state and23413 ordered-write comparisons. PAL synthesis and SID bus decay are approximated as stated by the player. |
| All intended Hailstones bomb records terminate correctly | differs; consequence open | PLF13 four 7-byte records end immediately before code at3109, withoutFF. Natural unmatched-key failure unproven. |

## Sources

Read on 2 October 2026:

- [Epyx's C64 instruction manual, transcribed by Project 64](https://www.abandonwaredos.com/docawd.php?idg=1121&sf=jumpman_manual.txt&sg=Jumpman&st=manual). Primary documentation; claims remain separate from observations.
- [C64-Wiki: Jumpman](https://www.c64-wiki.com/wiki/Jumpman). Secondary documentation. Its game-option terminology differs from the supplied game's menu; this checklist uses the game's names.
- [C64 Boxed Sets: Jumpman](https://c64sets.com/jumpman.html). Independent screenshots saved as `reference/external-c64sets-02.png` and `reference/external-c64sets-03.png` from `https://c64sets.com/jumpman/scr02.png` and `https://c64sets.com/jumpman/scr03.png`. These are reference images from that collection, not captures of this run.
- The supplied disk's own menus and first level, observed in VICE-MCP v3.13.2. `reference/options.png` and `reference/level01.png` are captures of this run.

The contributor authorized online research and reference screenshots. No game image was downloaded.
