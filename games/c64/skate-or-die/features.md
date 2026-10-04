# Skate or Die! - features

This checklist was written before code annotation and updated from the
High Jump listing. `open` means documented but not established in this
image; it does not mean absent. The listing covers the High Jump load
only, so features of the other loads stay open with that reason. External
screenshots are C64-Wiki examples, not captures from the supplied disks.

## Sources

- [Skate or Die! manual](https://www.abandonwaredos.com/docawd.php?idg=1509&sf=skate_or_die_manual.txt&sg=Skate+or+Die&st=manual), C64/128 instructions and event rules, read 4 October 2026.
- [C64-Wiki](https://www.c64-wiki.com/wiki/Skate_or_Die!), C64-specific modes, controls and screenshots, read 4 October 2026. Its port-2 icon needs comparison with this image: port 1 fire advanced the tested title and port 2 fire did not.
- C64-Wiki images saved as `reference/wiki-*.png` on 4 October 2026. Source GIFs remain in ignored `work/`.
- Contributor-supplied research notes, received 4 October 2026; credits and historical claims are leads pending direct source checks.
- PAL VICE v3.13.2 captures from the contributor's disks: `reference/title-screen.png`, `skate-shop.png`, `town-square.png`, `highjump-play.png`, `race-play.png`, `jam-play.png`, `joust-select.png`, `side1-prompt.png`, 4 October 2026.

## Hub and modes

| Feature | Status | Evidence / next check |
|---|---|---|
| EA logo, title and on-screen developer credits | live | `reference/title-screen.png` names Michael Kosaka, Stephen Landrum and David Bunch |
| Title music includes sampled guitar and SID voices | open | The title is another load, not in this listing. High Jump's own music is SID only: nothing in the load uses the NMI or CIA 2 timers (`facts.md`, "Sound", register census) |
| Rodney's shop has a movable cursor and context-sensitive dialogue | live | `reference/skate-shop.png`; pointing at Practice changes the speech bubble |
| Sign in up to eight skaters; type or remove names | open | The shop is another load. The resident roster has room for eight 16-byte names (`$FCDA`) |
| Choose a board colour after signing in | traced (High Jump side) | High Jump colours the board, sprite 4, from the skater attribute `$FE02` (`$09EE`). That the shop's colour choice sets `$FE02` is inferred: the shop is another load |
| View high scores and save competition results to disk | open | The shop is another load. The resident loader has a save entry (`save_file` `$F233`) and the drive server a write command; nothing in High Jump calls them |
| Go Practice leads to event selection without sign-in | live | Shop to `reference/town-square.png` |
| Go Compete supports named skaters and tournament play | open | The shop is another load. The event manager's competition path (NEXT SKATER, results) is traced in `facts.md`; not played |
| Town-square skater travels down labelled paths to events | live | Forward moves in the facing direction; left/right steer. `orientation.md` gives measured routes to four events |
| Compete All plays five events in sequence; placings award 5/3/1 points | traced (in part) | The resident event manager sorts results and awards 5, 3 and 1 points (`$F743`, `$F7E0`); its load table lists the five events (`$F8A0`). The competition flow was not played |
| Commodore key toggles sound; RUN/STOP aborts an event | live (High Jump) | C= flips `$FE10` and silences or restarts the music (`$1A24`); RUN/STOP returns to the skate shop (`$1A08`, `$1A49`) |
| Event code/data reload between disciplines and may require a disk flip | live | High Jump showed `SKATING TO HIGH JUMP`; `reference/side1-prompt.png` records an explicit side-1 request after arriving with side 2 mounted |

## Freestyle

This event is a separate load and is not in this listing; its rows stay open until a run documents that load.

| Feature | Status | Evidence / next check |
|---|---|---|
| U-shaped ramp has ten passes, tricks, a score and falls | open | Manual, `reference/wiki-freestyle.png` |
| Forward/back sets entry position; dropping through the channel causes a fall | open | Manual |
| Fire in pump zones builds speed; zero, one or two pumps select tricks | open | Manual; find pump timing |
| Kickturn, Rock-n-Roll, Footplant, Rail Slide, Handplant, Ollie Air and Aerial use lean/pump combinations | open | Manual trick table; verify labels and inputs |
| Rotations, held tricks, variety and channel crossing affect points; bad landings fall | open | Manual and wiki; trace score and failure rules |

## High Jump

| Feature | Status | Evidence / next check |
|---|---|---|
| Ramp, skater, pass counter and height display | live | `reference/highjump-play.png`; height in eighths of a foot, shown rounded up to 0, 2, 3, 5, 6, 8, 9 or 11 inches (`$17B4`, `$2DF1`) |
| Rapid joystick movement builds speed and jump height | live; **differs** in detail | `pump_speed` (`$16E3`) rewards any newly pressed direction while the skater is low on the ramp; alternating is not needed (simulated). Live: pumping every two frames gave passes of 47, 75 and 95 eighths |
| Up to five passes on the right; fire near apex records height or can cause a bail | live | Passes counted at each turn on the right (`$1AD0`), five lock the controls. Fire on the right half starts a trick that adds half a foot and ends the attempt (`$0F4B`, `$104D`); holding fire spins the pose and a landing in the wrong pose falls (`$0F21`) |
| Last pass counts if fire is never pressed | traced | The fifth pass locks the controls and its height is no longer cleared (`$1AF4`, `$1798`); each earlier pass's height is cleared when the next begins (live) |

## Downhill Race and Jam

This event is a separate load and is not in this listing; its rows stay open until a run documents that load.

| Feature | Status | Evidence / next check |
|---|---|---|
| Race is a timed obstacle course with jump, duck, slide turns and stunt bonuses | open | `reference/race-play.png` confirms the course and timer at zero; the moves and scoring remain to be tested |
| Regular and Goofy foot change movement direction; fire combinations trigger moves | open | `reference/race-play.png` confirms a Regular Foot choice; the alternate choice and control effects remain open |
| Jam races an opponent through hazards, with kicks and punches against rival and scenery | open | `reference/jam-play.png` confirms the street and Practice prompt; combat and finish rules remain open |
| Jam placement uses finish time and score; a trailing opponent can be moved forward with a penalty | open | C64-Wiki; verify live or trace |
| Lester can stand in for a missing human opponent | open | Manual |

## Pool Joust and results

This event is a separate load and is not in this listing; its rows stay open until a run documents that load.

| Feature | Status | Evidence / next check |
|---|---|---|
| Joust alternates hunter and hunted after five passes with the paddle | open | Manual, `reference/wiki-joust.png` |
| A flashing paddle can strike; first to three slams wins by two | open | Manual; verify score and end conditions |
| Poseur Pete, Aggro Eddie and Lester are opponents with different difficulty | open | `reference/joust-select.png` confirms all three choices; the difficulty distinction remains open |
| Multiplayer tournament uses round-robin Joust and displays results/high scores | open | Manual; exercise with signed-in skaters |

## Beyond the documentation

| Feature | Status | Evidence |
|---|---|---|
| High Jump's music is put together at random from nine two-voice phrases | traced | successor table `$3C6C`, chooser `$3549`; it always opens with phrase 0 and never repeats the phrase just played (`facts.md`, "Sound") |
| The crowd moves more after a higher pass | traced | `animate_crowd_cell` (`$19AE`) uses half the last height as its chance (`$1AD0`) |
| The flags on the poles wave | traced | `animate_flag_pair` (`$199B`) |
| The keyboard works as joystick 1: SPACE fire, 1 up, left-arrow down, CTRL left, 2 right | traced | `$0D23` ANDs the keyboard row with both ports |
| Holding fire through the trick spins the skater | traced | `$107D`-`$108B` |
| The final pose has three versions, by height: under 10 ft, under 13 ft, higher | traced | `$10F0`-`$1106` |
| One of two colour sets is chosen at random for the skater each attempt | traced | `$19D3` |
| PRACTICE AGAIN replays High Jump without touching the disk | traced | `$0880` erases its own loading jump; `$F93E` |
| A height of 18 ft 9 in or more would register as zero | traced | `$1ABC`; not reached in play |
| Disk ID "EA" and a side marker on track 18 sector 18 decide which side is in the drive | traced | `$F295`, `$FA69` |

## Open questions

- Which files belong to each event beyond High Jump? The loader's file table (`$F2F9`) lists 49 files; side 1 holds `$00`-`$1A`, side 2 `$1B`-`$30`.
- Which other assets are on each disk side, and when does each event request a flip? High Jump and Joust selection were seen on side 1; Race and Jam loaded from side 2.
- Which states' code and data are overwritten by later overlays? Shop and High Jump RAM differ substantially.
- Is port-1 title input image-specific or accepted in addition to documented port 2?
- Can this G64 pair write high scores, and if so to which side?
