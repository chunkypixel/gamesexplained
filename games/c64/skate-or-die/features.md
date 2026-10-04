# Skate or Die! - features

This checklist was written before code annotation. `open` means documented
but not yet established in this image; it does not mean absent. External
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
| Title music includes sampled guitar and SID voices | open | C64-Wiki and contributor notes; inspect audio/SID use |
| Rodney's shop has a movable cursor and context-sensitive dialogue | live | `reference/skate-shop.png`; pointing at Practice changes the speech bubble |
| Sign in up to eight skaters; type or remove names | open | Manual and wiki; exercise sign-in |
| Choose a board colour after signing in | open | Manual and `reference/wiki-skateshop.png` |
| View high scores and save competition results to disk | open | Manual and wiki; test this image's write behaviour |
| Go Practice leads to event selection without sign-in | live | Shop to `reference/town-square.png` |
| Go Compete supports named skaters and tournament play | open | Manual and wiki |
| Town-square skater travels down labelled paths to events | live | Forward moves in the facing direction; left/right steer. `orientation.md` gives measured routes to four events |
| Compete All plays five events in sequence; placings award 5/3/1 points | open | Manual; wiki says path is unavailable in Practice |
| Commodore key toggles sound; RUN/STOP aborts an event | open | Manual; test live |
| Event code/data reload between disciplines and may require a disk flip | live | High Jump showed `SKATING TO HIGH JUMP`; `reference/side1-prompt.png` records an explicit side-1 request after arriving with side 2 mounted |

## Freestyle

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
| Ramp, skater, pass counter and height display | live | `reference/highjump-play.png`, initially pass 0 and zero height; controlled `$2B` tests confirmed the eighth-foot to inches display (`facts.md`) |
| Rapid joystick movement builds speed and jump height | open | Manual and wiki; measure input accumulator |
| Up to five passes on the right; fire near apex records height or can cause a bail | open | Manual; observe an attempt |
| Last pass counts if fire is never pressed | open | C64-Wiki; test a full run |

## Downhill Race and Jam

| Feature | Status | Evidence / next check |
|---|---|---|
| Race is a timed obstacle course with jump, duck, slide turns and stunt bonuses | open | `reference/race-play.png` confirms the course and timer at zero; the moves and scoring remain to be tested |
| Regular and Goofy foot change movement direction; fire combinations trigger moves | open | `reference/race-play.png` confirms a Regular Foot choice; the alternate choice and control effects remain open |
| Jam races an opponent through hazards, with kicks and punches against rival and scenery | open | `reference/jam-play.png` confirms the street and Practice prompt; combat and finish rules remain open |
| Jam placement uses finish time and score; a trailing opponent can be moved forward with a penalty | open | C64-Wiki; verify live or trace |
| Lester can stand in for a missing human opponent | open | Manual |

## Pool Joust and results

| Feature | Status | Evidence / next check |
|---|---|---|
| Joust alternates hunter and hunted after five passes with the paddle | open | Manual, `reference/wiki-joust.png` |
| A flashing paddle can strike; first to three slams wins by two | open | Manual; verify score and end conditions |
| Poseur Pete, Aggro Eddie and Lester are opponents with different difficulty | open | `reference/joust-select.png` confirms all three choices; the difficulty distinction remains open |
| Multiplayer tournament uses round-robin Joust and displays results/high scores | open | Manual; exercise with signed-in skaters |

## Beyond the documentation

No code-only feature has been identified yet.

## Open questions

- Which other assets are on each disk side, and when does each event request a flip? High Jump and Joust selection were seen on side 1; Race and Jam loaded from side 2.
- Which states' code and data are overwritten by later overlays? Shop and High Jump RAM differ substantially.
- Is port-1 title input image-specific or accepted in addition to documented port 2?
- Can this G64 pair write high scores, and if so to which side?
