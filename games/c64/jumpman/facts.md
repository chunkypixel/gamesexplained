# Jumpman: verified facts

## Evidence and image

Address-based statements below are traced from this disk's instructions and data. **Live input** means ordinary controls applied to a running saved game. **Controlled live** means the original code ran in VICE with specified memory or entry conditions. **CPU checked** means unchanged instructions ran in the kit's 6502 simulator with declared inputs; it does not establish a naturally reachable game state.

The supplied disk identifies itself as `JUMPMAN REV 1.0`. Its loader at `$0800` enters `$0811`, loads the 32,768-byte `INTRO.SYS` at `$2000`, tests `$9FFF`, and hands over at `$2F03`. The canonical entry snapshot stops before that first instruction: every byte at `$2000-$9FFF` matches the file. This preserves authored sprites at `$8E40` that ordinary play overwrites.

There are 32 native 2,048-byte level files: `PLF01`–`PLF24`, `PLF2A`–`PLF2C`, and `PLF26`–`PLF30`. Each loads at `$3800`; `$74F3` copies `$3800-$3FFF` to active [$3000-$37FF](source.html?image=01#3000). **Live loader captures** stopped at `$7514`, before drawing or initialization, and matched all 2,048 disk bytes for every file. Each overlay has its own Source selection. Shared level-header links use PLF01 as an example; private addresses in the level table link to their own file. `SCORES` is a separate 1,024-byte file loaded at `$2000`.

Evidence: `orientation.md`, `work/level-captures.json`, the entry and level snapshots, and their corresponding extracted files. The machine is PAL C64SC; host elapsed time is not used for game timing. The coverage ledger explains all 90,583 included bytes across 33 source images: 25,047 resident bytes and all 65,536 overlay bytes. Machine memory, generated output and specifically justified padding are outside that denominator; retained overlay tails remain included.

## Display, interrupts and clocks

`$4306` installs IRQ `$4100` through `$0314/$0315` and requests raster line 233. During play the handler switches to bank-0 text, matrix `$0400`, character ROM at `$1000`, for the status band. `$42AD` restores multicolor bitmap mode in bank `$8000`, matrix `$8000`, bitmap `$A000`, when the low raster byte is at least 251 or below 50. This check runs between dispatched callbacks, so the actual switch follows execution timing. `$404F` suppresses the split for full-screen text.

A recorded first-level frame was rebuilt from memory and raster-register writes: **104,448 of 104,448 compared pixels match**. This establishes that captured frame's bitmap, sprites, border and text-band layout; it is not a claim about every possible scene.

The fourteen words at `$4004-$401F` dispatch keyboard `$57C0`, death `$5C00`, six initially empty `$40C3` hooks, movement `$4900`, perimeter bullets `$6800`, sprite upload `$4600`, terrain sampling `$47C0`, sound `$44C0`, and an `$EA31` sentinel. A target high byte `$EA` terminates the list before a call. Four pending vectors `$40C8-$40CF` replace slots `$400C-$4013` when their high bytes are nonzero. The IRQ saves the CPU banking port in `$4099`, exposes bitmap RAM by clearing `$01` bit 0, and restores the port on exit.

Player and hazard dividers are `$4029/$402A`; pulses are `$402B/$402C`. After the initial counter transient, divisor *n* produces one update per *n* serviced raster interrupts. Player divisor at least 9 suppresses both pulse streams. Frame counter `$4020` increments each service, and `$4047` increments every eighth service.

The measured PAL configuration has 985,248 CPU cycles per second and 19,656 cycles per frame: **50.124542 frames/s**. Bonus counter `$4026` wraps every 256 services while `$4027` is enabled. `$57D9-$580E` subtracts 100 from [$3017/$3018](source.html?image=01#3017), approximately **5.107279 seconds** per subtraction at one service per frame. Zero bonus disables the countdown. Controlled live tests confirmed 1500→1400, 100→0, and disabling at zero (`work/live-tests.json`). Values below 100 are not clamped before subtraction.

## Controls, speed and player movement

Joystick port 2 is read through `$DC00`. The active-low direction nibble indexes sixteen signed X/Y intent pairs at `$4320`, stored in `$4050/$4051`. A nonzero high nibble in `$4052` substitutes scripted direction and is mirrored into the low nibble. In `$4053`, bit 0 forces fire released; otherwise bit 1 forces it pressed; otherwise the IRQ reads joystick bit 4. Enabled RETURN and SPACE escape hooks use vectors `$4048/$404A` and gates `$404C/$404D`.

Digits 1–8 are decoded by `$57C0/$5819` using `$57D0-$57D8`, with debounce `$40E7`. They change requested speed `$40E3`. Spawn `$5799-$579F` copies that request to both live dividers, so it takes effect on the next life spawn, including a new level's spawn. **Live input:** pressing 1 changed requested speed 4→1 while the active divisor remained 4; native respawn then made it 1 (`work/live-input-tests.json`).

`$4900` runs on a player pulse only while life state `$4028` is zero and the divisor is below 9. Walking changes hardware X by four pixels. Climbing changes Y by two and snaps to one of eight columns `$40B0-$40B7` when the current 160-wide bitmap X is equal or two pixels to either side. Destination Y at least 218 is refused. Six down-rope columns `$40B8-$40BD` cause automatic two-pixel descent on exact alignment with climbable terrain. Body overlap with support can move the player up two pixels.

A grounded player without support or climbable contact first sets `$40C0` and moves down two pixels; a second unsupported grounded update sets `$4028=1`. This is a two-update state test, not an accumulated fall-distance limit. Original-code tests confirm both updates. Jump descent uses a separate path.

The tables `$4BFF`, `$4C2B`, `$4C57` hold 22 pairs for vertical, right and left jumps. Horizontal bytes `$02/$FE` mean hardware X changes of +4/−4; other horizontal values mean no X change. The signed vertical sequence is six −2 moves, three zero moves, then thirteen +2 moves. An uninterrupted sequence rises 12 pixels and finishes 14 below its start; lateral sequences move 52 pixels sideways. Fire plus up or horizontal intent starts a jump; fire alone does not.

`$4B23` ignores landing contact for the first seven pairs. Beginning **before pair 8**, support may end any trajectory. Climbable contact may end only lateral jumps (`$4BAE`), and requires an exact configured column; grounded climbing's ±2 tolerance does not apply. After pair 22, the next update returns to the grounded controller. Prospective jump Y at least 222 requests death before storing that Y, after any X movement.

**Live input:** from X=176,Y=168 at speed 4, twenty frames of right/left produced X=196/156 with unchanged Y. Right+fire produced X=188,Y=158; up+fire produced X=176,Y=158. The no-input control stayed put. **CPU checked:** all 132 trajectory bytes, 264 movement updates including X-byte crossings, 396 controlled contact decisions, and three Y-boundary cases match the trajectory inspector (`work/agent1/jump/verification.json`). The inspector covers the jump phase, not complete player physics.

## Bitmap geometry and collision

`$4740` maps multicolor coordinate (x,y) to `$A000 + 40*(y & $F8) + 2*(x & $FC) + (y & 7)`, with pixel position `x & 3`. All 160 X coordinates at eleven Y boundaries, 1,760 cases, match original-code execution. `$47C0` samples the actual bitmap: five body rows spaced two pixels apart and a foot strip at saved player Y+11, using alignment/pose masks `$48E1-$48F8`.

`$7D00-$7DFF` translates four two-bit pixel codes into material flags:

| Pixel code | Material flag | Engine interpretation |
|---|---:|---|
| 0 | 1 | Background |
| 1 | 2 | Collectible |
| 2 | 4 | Support |
| 3 | 8 | Climbable |

For byte inputs `$00-$FE`, the table ORs the four pixel flags. **Input `$FF` is the exception: `$7DFF=0`, not 8.** The sampler can pass an unmasked middle byte, so the exception is not removed by its masks. Its effect in ordinary play remains unverified. Geometry changes affect movement and collection because these systems read the rendered bitmap; they do not consult a separate terrain grid.

`$4D0F` reads a stream through `$4000/$4001`: `$FE lo hi` selects a shape, `$FD dx dy` selects repetition displacement, `$FC lo hi` jumps to another stream, `[x,y,count]` stamps the current shape, and `$FF` ends. Count zero wraps to 256 placements. `$4DA6` reads shape rows `[length,xOffset,yOffset,<length pixel bytes>]`, ending at `$FF`. Each source byte's low two bits become the same destination pixel code.

Resident shapes are girder/eraser `$7E00/$7E2B`, ladder/eraser `$7E56/$7EA9`, bomb/eraser `$7EFC/$7F27`, support-colored rope `$7F52`, climbable rope `$7F73`, and rope eraser `$7F94`; the final shape ends `$7FBC`. **CPU checked:** 194 initial, secondary and post-bomb streams across all 32 files produce exactly the same complete 8,192-byte bitmap as original `$4D0F` (`work/geometry-tests.json`).

Sprite collisions are separate hardware results. The IRQ copies the whole sprite collision mask to each participating sprite's `$4088-$408F` entry, or zero for a nonparticipant. These are not pairwise collision identities. Background-collision entries `$4090-$4097` latch hits; the IRQ does not clear unhit entries. Overlay callbacks interpret and clear them as needed.

## Level contract and collection

The shared loader `$74C3-$759C` loads/restores the overlay, draws its initial stream, copies climb columns, calls initialization, installs four IRQ callbacks and jumps to its main routine. Core header fields are:

| Address | Meaning |
|---|---|
| [$3000-$3005](source.html?image=01#3000) | Displayed number, initial draw pointer, background/border |
| [$3006-$300F](source.html?image=01#3006) | Bomb-list pointer and four IRQ callback pointers |
| [$3010-$3014](source.html?image=01#3010) | Player X low/high/Y, remaining targets, perimeter-bullet slot limit |
| [$3015-$3018](source.html?image=01#3015) | Collection points and remaining bonus, two binary words |
| [$3019-$301E](source.html?image=01#3019) | Initialization, main and cleanup vectors |
| [$301F](source.html?image=01#301F) | Shared RTS |
| [$3020-$302D](source.html?image=01#3020) | Eight climbing and six down-rope columns |
| [$3030/$3032](source.html?image=01#3030) | Completion `$5B00` and exhaustion `$5FFD`→`$6A80` |
| [$3034-$3039](source.html?image=01#3034) | Next filename suffix, empty draw terminator, spare, collection-key X/Y offsets |
| [$303A/$303B](source.html?image=01#303A) | Optional global bomb callback |

`$55BF` requires body material flag 2, quantizes player position using [$3038/$3039](source.html?image=01#3038), and searches seven-byte records `[key,x,y,callbackLow,callbackHigh,drawLow,drawHigh]`. On a match it calls the optional global and individual callbacks, adds [$3015/$3016](source.html?image=01#3015) to the 24-bit total, services score/extra life, erases the bomb with `$7F27`, executes the post-draw stream and decrements [$3013](source.html?image=01#3013). The counter does not bound this search; an `$FF` key normally terminates it.

Record count and target count can differ. PLF11 has 18 records for twelve initial targets; PLF15 has fourteen records with count ten. PLF13 has four records at [$30ED-$3108](source.html?image=13#30ED) **without a terminator**: [$3109](source.html?image=13#3109) begins callback code. An unmatched search can therefore continue into code; normal matched-key collection does not prove such an overrun occurs naturally.

## Sprites, hazards and death

Eight-slot arrays hold enable `$405B`, X low `$4063`, X high `$406B`, Y `$4073`, and shape pointer `$407B`; slot 0 is Jumpman. `$4600` uploads them to the VIC and sprite pointers `$83F8-$83FF`. In bitmap bank `$8000`, each pointer names `$8000 + 64*pointer`. `$4059/$405A` hold horizontal/vertical expansion masks.

`$4376`→`$5E03`→`$5E6F` clears `$8400-$85FF` and expands eight consecutive 30-byte frames from X=source high,Y=source low into eight 64-byte slots, leaving 34 zero bytes per slot. It always reads 240 source bytes; there is no count or terminator. Some overlays select fewer frames, so unused copied slots contain following source bytes. `$4FC0` separately copies an uncompressed 512-byte bank.

`$8600-$87BF` contains seven authored title-letter sprites; `$87C0` a small stripe; `$8800-$8FFF` authored actor/action graphics. Spawn `$56E0` clears `$8E40-$8E7F` and progressively builds its first thirty bytes from `$8800`, using pointer `$39`. The entry/play comparison differs in 49 bytes of that slot. The canonical entry image retains its original authored contents. Matrix `$8000-$83FF`, dynamic sprites `$8400-$85FF` and bitmap `$A000-$BFFF` are runtime output.

`$6800` manages ordinary perimeter bullets in slots 1 through [$3014-1](source.html?image=01#3014), using `$6922-$693D` state and six 32-byte tables `$693E-$69FD`. Cruising velocity is ±2 X or ±1 Y; exact alignment with the player selects an attack at ±6 X or ±3 Y and plays the lock-on effect. Bullets recycle outside Y=6…227 or half-X=3…175. Private overlays supply additional actors and collision rules.

Life state `$4028=1` invokes `$5C00`: falling motion, changing pose and SID pitch, with support-triggered ten-step bounce tables `$5D25/$5D39/$5D4D`. Reaching Y≥222 advances to state 2; `$5D61` starts death tune 8, waits for sound/delay, then `$5DCF` decrements reserve lives. Reserve zero becomes `$FF`, the exhaustion sentinel.

## Players, modes, bonuses and progression

The current eleven-byte record `$40DA-$40E4` contains 24-bit total score, 24-bit accumulated bonus, 24-bit next-life threshold, requested speed and reserve lives. Four saved records occupy `$51C4-$51EF`. `$7BAF` initializes zero totals, threshold 10,000, speed 4 and six reserves: seven lives including the current one.

`$5106/$7400` saves/restores records, skips `$FF` reserves and rotates players. Only a wrap of the active roster loads the next level; each turn restores the pristine overlay buffer. All active players therefore receive the same level before progression. `$40E5` marks complete roster exhaustion; `$40E6` marks the wrap.

`$5B00` adds remaining level bonus to both total score and accumulated bonus, queues a random tune 0–7 and waits for all sound slots. `$5E06` grants one reserve life when total score reaches the next 10,000-point threshold, then adds 10,000 to that threshold. It awards **at most one life per call**. Controlled live tests at scores 9,999, 10,000 and 30,000 confirmed respectively zero, one and one awards from threshold 10,000.

Menu `$7800/$7A59` offers five modes and accepts one to four players; `$7A9C` rejects 5. Later text patches visibly replace an old RUN/STOP prompt with RETURN and `(1 - 5)` with `1 - 4`. Mode starts at `$7BF1/$7BF6` and end suffixes `$5BB4/$5BB9` are:

| Mode | First file suffix | Next-file suffix that ends the mode |
|---|---|---|
| Beginner | 01 | 09 |
| Intermediate | 09 | 19 |
| Advanced | 19 | XX |
| Grand Loop | 01 | XX |
| Randomizer | 12 | ZZ |

`$763A-$7679` lists the 32 filename pairs; `$767A-$7699` maps them to title rows. The three Mystery Maze variants share title number 25. Titles are twenty PETSCII bytes each at `$5880`; the 32 stored rows include two unused duplicate titles. `$759F` searches filename pairs without an explicit bound.

At completed-mode life counting, `$2900` converts reserves to remaining lives. `$29FF-$2A06` awards 100/250/500/750 per life for modes 1–4. `$2A1C` adds this award to both score totals. **Controlled live overflow:** 88×750 creates the final display value 66,000 but stores/adds only 464. `$297F-$299D` retains only the low two award bytes while computing a transient third display byte. A legal route to 88 remaining lives has not been established.

Completion buildings `$2A60/$2B83` are five cells wide and 8/10/12 high. `$2C00` flashes 4/5/6/all 15 window pairs for modes 1/2/3/4. `$2C45` copies `$8800-$8FFF` over active [$3000-$37FF](source.html?image=01#3000) for the text-bank ending sprites, then `$2CB6/$2D0C` animate the exit, show scores and retire that player. Ordinary exhaustion instead uses `$6A80` color phases of 60,60,30 callback counts before total-score/bonus display and score entry.

## Randomizer

PRNG `$5832` advances 16-bit state `$585B/$585C` eight shift steps, inserting XOR of old bits 13 and 8; initial state is `$7B7B`. `$5B8F` selects units from `0123456789024681` at `$5BBE`, then tens from `01201212` at `$5BCE`. It rejects only `00`. It neither excludes `01` nor prevents `25`, although this disk has no `PLF25` and the title table has no `25` pair. Its digit generator cannot produce the configured end suffix `ZZ`.

**CPU checked:** all 65,536 PRNG states and 5,042 chooser states match the original instructions (`work/randomizer-tests.json`). States `$1F27` and `$E9A7` occur in the sequence reachable from the initialized seed. **Controlled live:** `$1F27` produced `01`, `$E9A7` produced `25`; `$0002` also produced `01` (`work/live-tests.json`). This proves the chooser accepts those results. It does **not** prove an ordinary Randomizer session crashes or reaches either tested state at a selection boundary. The missing-file and unbounded-title-search consequences remain open.

## High scores, text and persistence

`$2000-$23E7` is the stored screen image, including two twenty-entry tables. TOP SCORES starts `$20A6`, HIGH BONUS `$20BA`, both at a forty-byte row stride. Each record holds three initials, separator, six digits, separator and mode marker. `$2553/$2592` independently format total score and accumulated bonus through `$554B`; decimal conversion uses six 24-bit place values at `$5539` and blanks leading zeroes.

Insertion `$24A8` requires a strictly greater candidate; equal scores remain below existing ties. `$24EB` moves twelve-byte records, preserving rank labels and frame. Failure is `$FEFE`. **Controlled live:** 0 did not qualify against a zero list; 1 took first place; 100 tied with first-place 100 entered second; 101 entered first (`work/live-score-tests.json`). These tests stopped before disk persistence.

Initials entry `$25EB-$268D` cycles 32 characters at `$26D4` with vertical joystick intent; fire accepts three initials. It writes both table destinations even if one is the `$FEFE` failure sentinel, producing offscreen/under-ROM writes whose visible effect is unverified. Marker table `$26CD` supplies B/I/A/G/R for modes, with a space for ordinary exhaustion.

Startup `$2F03` reads GETIN once. HOME `$13` or CLEAR `$93` bypasses the disk score load and saves the default image already supplied by `INTRO.SYS`; this reset does not zero the score screen. Otherwise it loads `SCORES` from device 8. `$2F84` issues `S0:SCORES`, then SAVE from `$2000` to exclusive end `$2400`: **exactly `$2000-$23FF`**, including the nonvisible final 24 bytes. No explicit error branch follows these load/scratch/save calls. The default image matches the extracted file. **Controlled live persistence:** native SAVE at `$2F84` wrote a score image containing controlled initials JAN; all 1,024 RAM bytes were then cleared, and native LOAD at `$2F13` restored every byte exactly (`work/live-persistence.json`). This validates the real KERNAL/disk round trip. A complete natural qualification followed by save and reboot/reload has not been demonstrated.

Menu/title text uses uppercase PETSCII; the status and stored score screen use screen codes. `$5400` copies eighty status characters `$545E-$54AD` and colors `$54AE-$54FD` into the two bottom rows at `$0798/$DB98`. Turn placards copy the 40×7 artwork `$5200-$5317` plus one 5×7 numeral from `$5318-$53A3`.

## Sound

Sound tick `$44C0`, allocator `$458E`, and tune selector `$6000` share three seven-byte records at `$4030/$4037/$403E`: release threshold, remaining duration, priority, stream pointer low/high, control and spare. A request supplies pointer `$402E/$402F`, A=priority, X=release threshold, Y=control. It takes the first idle voice, otherwise the first strictly lower-priority voice; equal priority cannot preempt.

Stream commands are 0=end, 1=AD/SR, 2=pulse width, 3=pointer jump. A first byte at least 4 starts `[frequencyLow,frequencyHigh,duration]`. Control commands execute immediately in the same tick. Duration zero still consumes a tick. A decremented duration equal to the nonzero release threshold clears the gate; reaching zero loads the next command first. End clears frequency and active priority, leaving its pointer on the end byte.

Sixteen tune definitions at `$603C-$613B` each hold three five-byte voice descriptors plus padding; streams occupy `$613C-$657C`. Tunes 0–7 accompany level completion, 8 death, 10 game over, 14 score-table completion and 15 the mission ending. IDs 9/11/12/13 are identical zero-priority definitions: they do not silence occupied voices. Resident effects include collection `$569D`, bonus `$580F`, death bounce `$5DD4`, extra life `$5E5C`, bullet lock-on `$69FE`, and menu `$7B7B/$7B9C`.

`$44E8` reads a writable SID control address during gate release. **Live native-CPU probes** wrote `$A5/$81/$21/$00` to `$D406`; the subsequent original `LDA $D404` returned that most recent global SID write, despite stored voice control `$40`. Natural tune samples also differed from the control shadow. The player therefore uses a last-write bus approximation; it omits analogue decay and timing between writes within a frame. Direct SID effects outside this stream interpreter are outside the player.

**CPU checked:** 23,764 frame/state comparisons and 23,413 ordered SID writes match the original routines, including all 25 SID register-shadow bytes and 21 voice-state bytes after each frame. Both explicitly selected SID read models were tested; the live probe establishes last-write behavior for the tested machine. Every tune/effect was exercised, with stream jumps, zero durations, priority ties and mixed requests. Browser playback, mute, seek and stop passed. This establishes driver/write equivalence under the stated model, not a recorded-waveform or specific physical-SID match (`work/agent3/audio/verification.json`, `work/sid-bus-probe.json`, `work/sid-read-probe.json`).

## Title and attract scripts

`$9000/$9022` initialize the presentation and RETURN escape to `$7800`. `$90A7` reveals the 9×26 EPYX tile map `$9106-$91EF` through six character codes at `$91F0`. `$92E5` draws stream `$9370` and selects the seven title-letter sprites. Title player pointer `$23` addresses `$88C0`.

`$9440` feeds duration/direction/fire triples `$93EE-$943F` into the input overrides on player pulses. Letter callback `$952E` interprets 29 sprite/duration/operation triples at `$94D4-$952D`: wait, move left four, descend four with pitch slide, or move right four. Copyright/address rows are `$9649-$9698`; the Randy Glover credit is `$9699-$96B8`.

Demo `$9900` draws `$9A27`, displays the RETURN prompt and runs 26 input triples at `$998C-$99DA` through `$99DB`, on the opposite player-pulse phase. `$9A98` interprets two actor programs `$9BF2/$9C8A`: `$80` loads frame pairs/color, `$81` sets position/enables, `$82` calls a sound wrapper, `$83` stops; other four-byte records specify signed movement and duration. Five compact 48-byte frame pairs occupy `$9CC2-$9DB1`. `$9BE2` waits for a collectible-material condition, displays high scores through `$2800`, then repeats the presentation. These script formats and phase conditions are traced; a complete frame-for-frame attract replay is not claimed.

## Remaining source anomalies and limits

- `$45EB` preemption clears `$D404 + incoming release`, using X rather than the selected voice offset. Controlled CPU tests reproduce replacing voice 1 while clearing voice 0. Its audible effect during ordinary play is unverified.
- `$464B` compares the sprite high-X condition against `$D00A` (sprite 5 X), rather than `$D010`. A controlled CPU test skips a needed X update; natural visible impact remains unverified.
- `$5006` clears `$0498-$04E7` while the status panel is at `$0798-$07E7`. Its natural caller and visible effect remain open.
- `$49BB` compares vertical intent with zero-page `$01`, not immediate 1. Ordinary-play consequences are unverified.
- The demo frame loader clears offsets 1…128 of a 128-byte workspace, including one byte beyond its end. The next copy masks some effects; no visible corruption is established.
- Fully climbable bitmap byte `$FF`, PLF13's missing bomb terminator, Randomizer's missing suffix, the final-life award overflow, and score-entry sentinel stores have the precise evidence limits stated above. None is promoted to a naturally reachable exploit without an input route.
- Six-digit decimal output has no wider-value display guard; bonus subtraction has no nonzero-under-100 clamp. These are code properties outside normal supplied bonus values.
- Reserved fields, sound tails `$5DF6-$5DF8` and `$6A05-$6A24`, inactive sound `$4CA3-$4CAB`, the caller of placard loop `$7C00`, and trailing marker `LOLOXVM4.` at `$9FF6-$9FFE` retain unresolved purposes. `$9FFF` itself is the meaningful loader sentinel.

## Private behavior in all 32 level files

These mechanics are traced from the C64 overlay instructions and data at active [$3000-$37FF](source.html?image=01#3000). The native captures establish exact loaded bytes; they do not themselves establish each interaction during ordinary play. The open-behavior column distinguishes those remaining live tests. Separate controlled CPU tests cover selected callbacks without proving a complete level sequence.

| File / title |Traced mechanic and evidence | Specific open behavior |
|---|---|---|
| 01 — Easy Does It | The ordinary life loop is at [$3050](source.html?image=01#3050), with sprite-collision death at [$31C7](source.html?image=01#31C7). Bomb-linked streams [$3199/$31A6/$31B3/$31BD](source.html?image=01#3199) change girders and ladders; the first selects girder eraser `$7E2B`. | Interaction sequence has not been live checked. |
| 02 — Robots I | Two robots run three-byte route programs through [$32AB](source.html?image=02#32AB): ordinary commands select motion, `$FF` jumps, and `$FE` waits. Every bomb increments shared event [$3336](source.html?image=02#3336) at [$325F](source.html?image=02#325F), allowing both waiting robots to advance before [$3263](source.html?image=02#3263) clears the event. | Simultaneous release of both robots remains a live test. |
| 03 — Bombs Away | Falling hazards spawn through [$32EC](source.html?image=03#32EC), fall three pixels per update at [$3336](source.html?image=03#3336), and expand into impact animation at [$3385](source.html?image=03#3385). Bomb-linked streams [$3153-$318E](source.html?image=03#3153) erase six-cell girder spans at three heights. | Falling/impact timing and resulting geometry changes have not been live checked. |
| 04 — Jumping Blocks | Callback [$31AC](source.html?image=04#31AC) converts collision into forced fire and a randomly chosen right/up/up/left direction instead of requesting death. Initialization [$31F1](source.html?image=04#31F1) expands sprites 1-4 horizontally and vertically. | Collision-driven jump trajectories remain a live test. |
| 05 — Vampire | Every third collected bomb activates another hunter, capped at three ([$3317](source.html?image=05#3317), counters [$3454/$3455](source.html?image=05#3454)). The hunter update [$3368](source.html?image=05#3368) moves and wraps them, while [$33E0](source.html?image=05#33E0) turns toward the player only on exact row or half-X alignment. | Pursuit behavior and activation timing have not been live checked. |
| 06 — Invasion | Fire callback [$33B0](source.html?image=06#33B0) launches up to three directional shots with an eight-call cooldown; target hits at [$3373](source.html?image=06#3373) add 25 points and start falling animation. The single exit bomb at [$30E3](source.html?image=06#30E3) uses the ordinary 100-point award, and the initial bonus is zero. | Collision shadows contain the whole VIC collision mask rather than pair identities, so unrelated simultaneous collisions may alter hit/death decisions; visible consequences are untested. |
| 07 — Grand Puzzle I | Eight bomb callbacks can enable a player-following marker ([$3245](source.html?image=07#3245), [$31D9](source.html?image=07#31D9)); exact alignment at X=176 and the current target Y triggers another drawing step at [$31EC](source.html?image=07#31EC). Four special records call [$3282](source.html?image=07#3282) for an extra 400 before the resident 100, totaling 500. | Initial remaining count is 12 but the table stores 16 records through [$31A2](source.html?image=07#31A2); the complete collection/appearance sequence has not been verified live. |
| 08 — Builder | This overlay installs the standard collision callback [$308F](source.html?image=08#308F) and no private moving-hazard routine. Bomb-linked streams [$31B8-$323B](source.html?image=08#31B8) change girders, ladders, ropes and collectible graphics through the resident renderer. | The order and accessibility of successive geometry changes remain live unverified. |
| 09 — Look Out Below | Bomb callbacks [$3295-$3323](source.html?image=09#3295) launch or replace one falling object at distinct coordinates. Its IRQ [$31FC](source.html?image=09#31FC) advances Y by three and periodically queues erase/girder edits in stream [$3288](source.html?image=09#3288); main loop [$3050](source.html?image=09#3050) renders those edits outside the interrupt. | The visible floor-contact sequence remains a live test. |
| 10 — Hot Foot | At the first jump step, callback [$3214](source.html?image=10#3214) places a sprite effect and stamps private bitmap shape [$32BB](source.html?image=10#32BB), saving renderer state around the draw. Animation [$33C8](source.html?image=10#33C8) advances the effect on three of every four raster services. | The stamp's collectible-colour pixels are traced; their full interaction with collection and later movement has not been live checked. |
| 11 — Runaway | Initialization [$3161](source.html?image=11#3161) randomly occupies 12 of 18 bomb locations; [$323D](source.html?image=11#323D) turns static bombs into moving sprites, and [$32E5](source.html?image=11#32E5) returns them to empty static locations. Sprite collection [$3385](source.html?image=11#3385) awards 100 and decrements bombs, while [$3462/$348B](source.html?image=11#3462) queue and apply bitmap edits. | The six-byte edit queue has no bounds check; overload behavior and simultaneous collision cases are untested. |
| 12 — Robots II | Four robots interpret route programs [$32B3-$33D2](source.html?image=12#32B3) through [$3402](source.html?image=12#3402). Conditional commands `$10-$13` branch on the player's quadrant, calculated at [$3508](source.html?image=12#3508) using Y=144 and half-X=92 thresholds. | Route choices at quadrant boundaries remain live unverified. |
| 13 — Hailstones | [$3149](source.html?image=13#3149) creates falling objects at current player X; [$3178](source.html?image=13#3178) makes them fall, bounce along one of three ten-step arcs, and disappear below Y=225. Arc tables are [$322C-$3285](source.html?image=13#322C). | The four-record bomb table [$30ED-$3108](source.html?image=13#30ED) has no `$FF` terminator; an unmatched collector key could scan into code, but no visible consequence is established. |
| 14 — Dragon Slayer | Fire processing [$339A/$342B](source.html?image=14#339A) substitutes an arcing horizontal projectile for the ordinary sideways jump; a hit at [$343C](source.html?image=14#343C) awards 50. Every fourth hit advances one of twelve stair placements ([$34BB](source.html?image=14#34BB), tables [$3502-$3525](source.html?image=14#3502)), drawn by foreground helper [$34EA](source.html?image=14#34EA); the level has one goal bomb and zero initial bonus. | The complete stair-building progression remains a live test. |
| 15 — Grand Puzzle II | Bomb callbacks [$31C6-$31FC](source.html?image=15#31C6) change player visibility and schedule wall erasure/regrowth; [$34FC](source.html?image=15#34FC) animates the middle wall and [$36B2](source.html?image=15#36B2) changes the lower wall according to player position. Four special records reach [$3667](source.html?image=15#3667), adding 400 before the resident 100 for 500 total. | Initial count 10 and 14 stored records are distinct; the full visibility/wall/collection sequence remains live unverified. |
| 16 — Ride Around | Two horizontally expanded platforms follow the rectangular route at [$3251](source.html?image=16#3251) through updater [$3266](source.html?image=16#3266), with different initial phases. Contact callback [$32C7](source.html?image=16#32C7) supplies support and adds two to player Y when a platform moves down by one. | Riding, transfer between platforms and collision exemptions remain live unverified. |
| 17 — The Roost | Three pursuers update at [$32EB](source.html?image=17#32EB): equal Y causes horizontal pursuit, background contact selects upward motion, and airborne movement steers diagonally toward player X. Crossing the top boundary resets an actor to its starting position. | Pursuit transitions and reset behavior have not been live checked. |
| 18 — Roll Me Over | Two rolling-ball sprites follow looping route triples at [$326D/$3291](source.html?image=18#326D) through [$331E](source.html?image=18#331E). The interpreter supports cardinal/diagonal vectors, alternates two frames and queues a sound when selecting a new route segment. | Ball trajectories and their collision timing remain live unverified. |
| 19 — Ladder Challenge | Three expanded ladder pieces move together at [$3237](source.html?image=19#3237); [$32AD](source.html?image=19#32AD) adds ladder X velocity to the player and supplies climbing flag 8 during contact. [$31C9](source.html?image=19#31C9) treats ladder collisions as safe, including masks that also contain another hazard. | Mixed ladder/hazard collisions remain untested; horizontal reversal was statically checked to sign-extend +4 to -4 correctly. |
| 20 — Figurit | Standard movement/collision code uses bomb-linked geometry edits at [$3183-$3223](source.html?image=20#3183) to replace or remove girders. No private moving-hazard callback is installed. | The complete geometry-edit sequence remains live unverified. |
| 21 — Jump-N-Run | Standard movement/collision code uses bomb-linked streams [$31A6-$31F9](source.html?image=21#31A6), including girder placement and horizontal erasure. No private moving-hazard callback is installed. | The sequence of route changes remains live unverified. |
| 22 — Freeze | Three creatures switch between tracking and erratic states in [$328B](source.html?image=22#328B); eligible creature/player contact at [$33DC](source.html?image=22#33DC) starts an 80-update timer. [$340C](source.html?image=22#340C) forces invalid direction `$88` and released fire `$11`, cycles player colour, then restores normal input. | Freeze duration, release and mixed creature/bullet collisions remain live tests. |
| 23 — Follow the Leader | Bomb callback [$31A2](source.html?image=23#31A2) creates up to seven followers; [$3218](source.html?image=23#3218) records player X-low/X-high/Y/frame into four circular pages [$3400-$37FF](source.html?image=23#3400). [$31DF](source.html?image=23#31DF) replays those pages through separate follower cursors, and [$324B](source.html?image=23#324B) clears followers during death. | Initial cursor placement and fixed replay lag remain live unverified. |
| 24 — Jungle | Cleanup [$3214](source.html?image=24#3214) chooses the next filename letter from [$322A](source.html?image=24#322A): reserves 0-2 select A, 3-4 select B, and at least 5 select C. With displayed lives equal to reserves+1, these are 1-3, 4-5 and at least 6 lives for PLF2A/2B/2C. | Bucket boundaries and the actual next-file transition remain a live test; terminal-death cleanup chooses a letter but does not advance. |
| 2A — Mystery Maze, variant A | Initialization [$317A](source.html?image=2a#317A) hides 1000 matrix and colour cells without erasing the bitmap; [$319C](source.html?image=2a#319C) permanently reveals a 4x3 area around the player, reduced to 4x2 near the top. Jungle selects this layout with reserves 0-2. | Boundary arithmetic inherits carry from X-column shifting; exact edge behavior remains live unverified. |
| 2B — Mystery Maze, variant B | The shifted hide/reveal routines are [$3179/$319B](source.html?image=2b#3179), with the same persistent colour reveal and a different geometry/bomb layout. Jungle selects this file with reserves 3-4. | Exact reveal boundaries and the selection transition remain live unverified. |
| 2C — Mystery Maze, variant C | The shifted hide/reveal routines are [$3192/$31B4](source.html?image=2c#3192), again preserving bitmap geometry and revealing colour cells permanently. Jungle selects this file with at least 5 reserves. | Exact reveal boundaries and the selection transition remain live unverified. |
| 26 — Gunfighter | Route interpreter [$327F](source.html?image=26#327F) branches on player quadrant; [$345A](source.html?image=26#345A) fires one shot per shooter when input/alignment permits. Hits at [$3505](source.html?image=26#3505) add 100, respawn the enemy and advance the counter selecting future navigation thresholds. | Shot/enemy collision combinations, fire consumption and changing pursuit thresholds remain live unverified. |
| 27 — Robots III | Three robots choose among thirty navigation nodes using four edge-duration tables [$331E-$3395](source.html?image=27#331E); [$33E2](source.html?image=27#33E2) tries one random direction toward the player per update. Bomb callbacks [$31E3/$31EC](source.html?image=27#31E3) open pairs of vertical edges by setting durations to 16. | Newly opened routes and rejected-choice waiting remain live tests. |
| 28 — Now You See It | Global bomb callback [$322F](source.html?image=28#322F) alternates matrix bytes `$80/$05`, hiding different bitmap colour classes without changing bitmap pixels. Death callback [$328C](source.html?image=28#328C) requests a foreground [$3261](source.html?image=28#3261) fill of `$85` to restore visibility. | Visibility alternation and restoration timing remain live unverified. |
| 29 — Going Down? | [$31EF](source.html?image=29#31EF) moves an expanded elevator down one pixel, wraps Y=226 to 0, and adds two to a colliding rider's Y while supplying support. [$308F](source.html?image=29#308F) exempts player collision whenever the elevator also has any collision. | Rider motion, wrap and simultaneous hazard exemptions remain live unverified. |
| 30 — Grand Puzzle III | At fewer than five bombs, trigger contact requests transformation [$3393](source.html?image=30#3393), installing layout [$31AA](source.html?image=30#31AA), bomb table [$3226](source.html?image=30#3226) and new callbacks without resetting remaining count. Special callback [$347C](source.html?image=30#347C) adds 400 before the resident 100, while the main loop's [$3078](source.html?image=30#3078) test sends stage-two death directly to completion when [$3014=5](source.html?image=30#3014). | The 500-point award order is traced; the transformation sequence and death-to-completion shortcut require live confirmation. |
