# Lode Runner — comment audit record

These reports retain the original samples and their pre-recheck estimates. Final symbols include the resulting replacements and precise field annotations. Paths beginning with work/ name private evidence and are not downloadable site files.

# Independent comment audit

Auditor wrote none of the sampled comments. Read `AGENTS.md`, `kit/skills/core/60-verify/SKILL.md`, and the C64 reference. Evidence is the 65536-byte RAM returned by `kit/c64/snapshot.read` from `work/black-entry.vsf`; instruction decoding uses the all256-opcode `kit/c64/opcodes.py` table. No emulator, disassembler, symbols or annotations were mutated. The pending original289-entry `work/annotations-source.json` was the sampling population, not the stale exported comments. Root subsequently enlarged and corrected that source; those changes do not erase the original audit failures.

## Sample and measurement

Python `random.Random(6401983)` was sampled sequentially across these explicitly disjoint strata, retaining original source order within each pool: title3/3, retained4/10, music8/23, graphics14/82, other code22/120, other data9/51. Title pool original indexes0..2. Retained pool3,159,166,167,279..284. Music pool14,15,17,18,19,148,160..165,268..278. Graphics pool53..70,99..112,117..127,157,158,168..178,242..267. Code pool was the remaining entries without an `end`; other-data pool was everything left.

**17 of 60 comments contain at least one materially wrong detail:28.33%; Wilson95% interval18.51%..40.77%.** This is the raw descriptive rate of a deliberately spread, stratified sample, not an assertion that exactly28.33% of all 289 comments are wrong. Error count includes the three already detected by root at9502,626A,7B83. Correct technical detail elsewhere in an erroneous comment does not turn it into a pass.

The material problems are mistaken routine state/callers, a false schedule clamp, sound handling, rendered digit counts, and graphics coordinate/byte counts. `audit-corrections.json` contains precise replacement comments and byte evidence for all 17 sampled errors plus four gross mismatches noticed outside the sample. The initial rate warrants the full-listing audit required by60-verify; root has commissioned that pass.

## Classification of unknowns

The tail at1E64 explicitly leaves other consumers unknown, which is honest and is not counted as an error. Retained blocks have recognizable text/copies and known live callers point to the active lower code or pointer tables. The audit searched decoded direct operands, direct calls/jumps and indexed operand spans; it does not claim exhaustive proof against every possible indirect address. In particular the93BB global no-dispatch statement needs that limit stated. The corrections use positive known-directory evidence. Comments are byte-traced here; none are being promoted to live verification by this audit.

## Original60-entry audit

| Stratum | Address | Verdict | Byte/caller evidence |
|---|---|---|---|
| title | $1400 | pass | 512 pairs; decoder62E5 starts output after1FFF, stops on cursor page3F. |
| title | $1800 | pass | 512 pairs continue cursor; cumulative cursor after1024 records36E7; title screenshot checked. |
| title | $1C00 | pass | 306 further records; record1330 ends input1E63 and cursor3F56;6312 stop compare. |
| retained | $1E64 | pass; explicit unknown | 155-byte retained tail; RLE pointer stops1E64, other uses explicitly left unknown. |
| retained | $93BB | error | Opening name truncated ameover; complete later records and words checked. Global indirect non-use is not proved. |
| retained | $B400 | error | ytable is1C51;1C35 belongs to opening truncated equate. |
| retained | $993E | pass | 993E..99FD exact copy693E..69FD; entire993E..9FFF exact copy693E..6FFF. Initialization has no relocation. |
| music | $6319 | error | No tick transposition; loaded fourth event byte overwritten; negative harmony detunes frequency by-$80. |
| music | $643A | error | Harmony zero bypasses transposition; only1..127 transposed. |
| music | $7A94 | pass | Four4-byte events and sentinel7AA4;4 raster-return stores; single inline-music caller7A91 returns7AA5. |
| music | $9501 | pass | Byte02 and semitone-spaced frequency table; reset6416..6419. |
| music | $9502 | error | Byte0C, not04; wrap reloads9501=02. |
| music | $9521 | pass | 37 low bytes9521..9545, zero index silence; paired highs9546..956A;6319 lookups. |
| music | $959C | pass | 22events,97 duration sum, sentinel95F4; selected by950D pointer. |
| music | $9822 | pass | 17events,82 duration sum, sentinel9866; selected by950B pointer. |
| graphics | $8AF8 | pass | 11loops, two104-byte row tables per loop; four phase-page pairs;33 scratch bytes005B..007B. |
| graphics | $8D44 | pass | D015=0; pages20..3F fill, common loop8D53;work counterpart40..5F. |
| graphics | $8A17 | pass | 00 C0 F0 FC /3F0F0300 masks consumed89B2/89B7. |
| graphics | $8BAA | pass | Eight interleaved1<<slot/inverse masks;8B83/8B8F uses even VIC offset. |
| graphics | $8C22 | pass | 00 40 80 C0 00 40; paired highs0C0C0C0C0D0D andslots0,2,3,4,6,7. |
| graphics | $93AF | error | Masks preserve nibbles; two multicolour pixels per nibble/four per byte. |
| graphics | $8F49 | pass | 14inline bytes after8F46 JSR;9079 pulls wrapper return before advancing pointer. |
| graphics | $8F6B | pass | 14inline bytes after8F68 JSR; same stack-consuming callee. |
| graphics | $9079 | pass | 14rows81..94, pointers9063, patterns12bytes withoffset14..25;input90E0 removes outer return. |
| graphics | $9118 | error | X160 is midpoint of320 bit positions, not160-wide multicolour-pixel coordinates. |
| graphics | $8F35 | pass | JSR9079+14bytes; calls8ED9/8EDF/8F1C from banner. |
| graphics | $8F79 | pass | JSR9079+14bytes; calls8ECD/8EEB/8F10 from banner. |
| graphics | $8FBD | pass | JSR9079+14bytes; calls8EF1/8F03 from banner. |
| graphics | $90E4 | error | Increment after full14-row call, not each individual pattern row. |
| code | $6000 | pass | Calls6501,8E11,70DB withA1;1313=0 mutes IRQ volume;falls6010/title. |
| code | $6010 | pass | Option/key state stores checked;131B speed5; five lives set at6082, not6010. |
| code | $605E | error | Preserves1305/1310; clearsprevious-room1304;55/56 is demo cursorB100. |
| code | $6251 | error | Physical index1310 cleared here, not605E. |
| code | $67C9 | pass | Ymatrix19;masterA1 blocked;mode4 call686F;sector loop149..0 plususer marker. |
| code | $6B27 | pass | Inline invalid-disk text thenJMP6AEB shared acknowledge/redraw. |
| code | $6B75 | pass | Row low8D66/high8D76;LDA currentcolumn;JSR8929. |
| code | $6BA2 | pass | Three digit editor;carry-overflow branches;Return validindex0..149 viaCPY150;callers rejectcarry. |
| code | $70DB | pass | Index97=>track12 sector7; operand high bytes patched1000->1100;11-byte signature and11FB classifier. |
| code | $8E44 | error | X/Y patch two track digits; sectorfixed2. |
| code | $7A32 | pass | Runner fields03..07;8C6C/8C7F fine conversions;7865 glyph table;A/X/Y return. |
| code | $7AA5 | pass | Decrement130E;occupancy0B blank;updatework4000 andrestore todisplay;BCD A50/Y02=250. |
| code | $7ACB | pass | Increment07;A lower/X upper inclusive compares andresetA. |
| code | $7B5C | pass | Three-byte cycling36;LSR35 consumes every setbit;rotating guard routine;alive test7B79. |
| code | $7E30 | pass | Bottom15;blocks tiles1,2,8;fine-Y1B wraps5;marker9 runnercontact;shared redraw/save. |
| code | $8297 | pass | Nextrow blockers1/2;sidebar4 orsupport1/2/3;runner-row test;bottom15;candidate2F return. |
| code | $846F | pass | Increment17;A lower/X upper inclusive range andresetA. |
| code | $847D | error | Only1A horizontal centering;independent1B helper8490. |
| code | $86DB | pass | JSR8D44 then8D4F;falls86E1 status. |
| code | $86E1 | error | Shared status score call draws7 digits. |
| code | $87E6 | error | Eight-digit BCD arithmetic but7 rendered digits. |
| code | $8E06 | error | Only pause caller795F;editor/confirmation uses8929. |
| other_data | $626A | error | 11offsets but setup indexesdifficulty+guards withoutsumclamp. |
| other_data | $6F66 | pass | 64matrix-order entries;letter/digit ASCII;function/modifierFF;separate control codes retained. |
| other_data | $723E | pass | U1:02 0 03 00 CR NUL;mutable723F read/write andtrack/sector digits;callers71DC/722A. |
| other_data | $66C3 | pass | CR >>PLAY LEVEL NUL;JSR66C0 to88F4;end66D0=>resume66D1. |
| other_data | $6729 | pass | CR >>EDIT LEVEL NUL;JSR6726;end6736=>resume6737. |
| other_data | $6773 | pass | CR two spaces SOURCE DISKETTE NUL;JSR6770;end6785=>resume6786. |
| other_data | $7B83 | error | No setup clamp;indexed alias can select late masks/animation bytes. |
| other_data | $7D8D | pass | 5words+1=>84A3,7EB4,7F40,7DA2,7E30;dispatch doubles0..4. |
| other_data | $B500 | pass | 256-byte sector,224byte low-first payload=448tiles;actor/tile censusvalid;demo70C9 copiesB500. |

## Gross mismatches outside sample

- $8995 and $899B names/comments reverse bitmap targets:8997 loads20;899D loads40;8D16 ORs that selected base. Correct names are draw_cell_into_display_bitmap at8995 and draw_cell_into_work_bitmap at899B.
- $7875..$7876 contains two glyph bytes0E, 12, despite the singular retained-byte comment.
- $B100..$B3FF spans768 bytes, despite the stated1 KB script area.

## Correction recheck

Rechecking root's edits is a dependent correction recheck, never a new independent sample. At the first recheck most corrections had been applied. Two replacement sound statements introduced new mistakes: negative harmony was described as frequency+1 instead of frequency-$80; the motif wrap was described as returning tozero instead of9501=two. Both were sent back with byte evidence. A subsequent byte-based recheck of all original 60 sampled addresses found all 17 original material errors corrected; zero of those60 retain a detected material error. This is a dependent recheck of the same chosen comments, not a second independent random sample and not a new population error-rate estimate. The retained93BB non-use wording still merits the bounded-evidence qualification provided in the full data report.

## Full upper-data pass

The required follow-on pass checked all 42 comments between $93BB and $B7FF. Results and per-entry evidence are in `audit-data-corrections.json`. One remaining material limit claim was found outside the original sample: $B0F0 says the glyph expander only reads $A800..$B0EF, but checksum failure increments its source-page operand at $8B01. The report proposes the correct conditional range. It also records normal transposed note indexes37..42 beyond the37-entry frequency tables, with exact aliased byte addresses and values. Stream event counts/durations, all four phase table pairs for every 256 pattern index, the22-by104 glyph atlas, all six retained code/table copies and three embedded room sectors match the bytes. These are full-pass checks, not independent resampling.


---

# Independent final comment audit

Auditor: independent agent; this agent wrote none of the selected annotations. Date:4 October2026.

The original **365-entry source JSON** was sampled with seed **64202642**, Python `random.Random`, sequential strata using source order then sorting sampled entries by address. Allocation: title/data $1400-$1EFE **4 of4**; lower $6000-$78FF **22 of133**; upper $7900-$93BA **22 of186**; data $93BB-$B7FF **12 of42**. All **60 original selected addresses** are preserved in the table below. Previous audits were not used as evidence.

The parent changed source entry order while the audit ran and corrected $93B7 after receiving the finding. Consequently rerunning the seed against the later file gives a different selection; this report deliberately retains the original sample and measures the comments read at selection time. The original whole-file hash was not captured. The source SHA-256 at report write is `31b12ad74261eaced2a9aee0231ee5880e1a72fc9b3d6afb72ebecb33d3a9b2e`; an intermediate read hash was `0b56173af75703831cb398b99b961d165f6ca280240ab2e22d9ef7124db0b846`. Snapshot SHA-256: `f932b076434513e57ee293e5fb52b104563929c48b91090e53592075b0c20323`.

## Result before these corrections

**2/60 comments contain a wrong factual detail:3.33%, Wilson95% interval0.92%-11.36%.** Separately, **1/60 (1.67%) is unclear**: `$23` can read as a literal glyph number where code uses a selector byte. Its mechanism is otherwise correct. **57/60 pass.** Counting ambiguity as a review finding yields3/60=5.00%, Wilson95% interval1.71%-13.70%. The primary material error rate excludes ambiguity. These are descriptive rates for this stratified sample; the ordinary Wilson interval does not correct unequal sampling fractions.

Wrong details:

- **$70DB:** the inherited demo mode takes embedded sector copying to $1000, leaves $1100 unchanged, and then examines the pre-existing score marker. The comment describes live disk I/O without this caller qualification.
- **$93B7:** reveal masks are four $F0 followed by four $0F, not alternating by index. This was already corrected by the parent during the audit.

`work/final-audit-corrections.json` contains two precise corrections and the separate wording clarification. The auditor changed only this report and that corrections file. Running emulator, disassembler project, source annotations and symbols were untouched by this agent.

## Evidence method

Read repository AGENTS.md, 60-verify and C64 reference. Loaded original RAM with `kit/c64/snapshot.read`; decoded complete bodies with all256 opcodes, skipping the source JSON data regions rather than trusting old names. Full active span $6000-$93AE decoded to **5,197 instructions**, with no instruction crossing a declared data boundary. Reviewed relevant callees and all decoded direct callers/RTS directories. Counted records, accepted values and bounds independently; compared retained copies and the extracted original DB payload byte-for-byte.

The $70DB counterexample executed original bytes in a fresh process-local snapshot copy using the kit 6502 simulator: A=1, inherited mode/index/difficulty0/0/0;1,130 instructions,256 writes to $1000-$10FF,zero to $1100-$11FF,A=0,index restored0,difficulty1. It touches no live emulator and calls no ROM/I/O path; flat memory is valid after machine initialization clears LORAM. This audit verifies bytes/callers, and does not claim new live gameplay tests.

## All sixty entries

| # | Address | Name | Judgment | Evidence |
|---|---|---|---|---|
| 1 | `$1400` | `title_rle_runs_0_511` | correct | $62D5-$62E3 initializes input $1400/cursor $1FFF. Full $62E5-$6314 decoder consumes512 pairs and reaches $2BE7; first output $2000. No consumed zero count. Stop compares cursor high byte with $3F. |
| 2 | `$1800` | `title_rle_runs_512_1023` | correct | Next512 pairs continue the same decoder: first output $2BE8, 1024th cursor $36E7, next input $1C00. Region length1024 bytes. |
| 3 | `$1C00` | `title_rle_runs_1024_1329` | correct | 306 further pairs, total1330, next input $1E64, last output cursor $3F56. Last stop CMP at $6312 and declining branch at $6314. |
| 4 | `$1E64` | `title_file_retained_tail` | correct | Extracted original disk-black-label/db is2817 bytes including load word $1400; all2815 payload bytes match snapshot $1400-$1EFE. Tail $1E64-$1EFE is155 bytes, unread by title decoder. Other-use uncertainty is explicit. |
| 5 | `$6501` | `initialize_machine` | correct | AND #$FE clears LORAM;25 outer passes times8 inner writes produce200 row offsets. IRQ vector $648A, NMI $65CF. SID $D406=$B0/$D404=$11. Sprite pointers/colors set; Y=0..255 clears $0002-$0101/$0C00-$0DFF; $D015=$FF. Full body $6501-$65A1; sole caller $6005. |
| 6 | `$6623` | `str_6623` | correct | JSR $88F4 at $6620, high-bit PETSCII bytes through $6676: stated heading,28 hyphens,R/S warning. Sole zero $6677. Full printer $88F4-$8913 pushes terminator return; RTS resumes $6678. |
| 7 | `$668B` | `dispatch_editor_command` | correct | Key waiter $6C6B returns X=0; six nonzero command keys $66AD-$66B2 and zero $66B3. Match doubles index and pushes high/low RTS word from $66B5/$66B4. Failure beeps $8914 and prompts $6678. Full dispatch $668B-$66AC. |
| 8 | `$6753` | `read_move_source_number` | correct | Read $6BA2, failure tests carry, accepted source Y stored $6C7F. JSR printer $675B consumes TO LEVEL through zero $6767, resumes destination input $6768. |
| 9 | `$6773` | `str_6773` | correct | JSR printer $6770; high-bit PETSCII newline/two spaces/SOURCE DISKETTE; zero $6785 and resume $6786. |
| 10 | `$679A` | `str_679a` | correct | JSR printer $6797; high-bit PETSCII newline/two spaces/DESTINATION DISKETTE; zero $67B1 and resume $67B2. |
| 11 | `$67CC` | `str_67cc` | correct | JSR printer $67C9; each quoted high-bit PETSCII initialization line verified, including formatted-disk warning, blank line and Y/N. Zero $6852 and resume $6853. |
| 12 | `$6AA2` | `show_master_disk_refusal` | correct | Full body through shared $6B24: clears display, pushes old fill-color operand $65B0, prints master warning/acknowledgement, waits for input, redraws status, sets $1300=0 and rebuilds through $728F, then PLA/tail JMP $65A2 restores color. Callers $6863,$69B1,$6A9B. |
| 13 | `$6B72` | `finish_invalid_disk_warning` | correct | JMP $6AEB immediately after invalid-disk text terminator $6B71. Shared acknowledgement prints HIT A KEY TO CONTINUE and enters $6B07. |
| 14 | `$6B75` | `flash_editor_cell` | correct | Full $6B75-$6B88: row $50 via lows $8D66/dynamic highs $8D76, column $4F, load through ($09),Y, call flashing input-wait $8929. Caller $692A. |
| 15 | `$6BA2` | `read_board_number` | correct | Full $6BA2-$6C6A plus numeric key decoder: initial physical index+1 split into3 decimal digits via $8863. Every ADC overflow rejected with carry. Stores number $1305, decremented Y/$1310, then CPY #$96. Enumerating 000..999 accepts exactly1..150. Run/Stop $3F jumps $6678 at $6C0D. Five callers $66D1,$670A,$6737,$6753,$6768. |
| 16 | `$6C80` | `editor_move_destination_index` | correct | Only decoded direct accesses: STY after destination number at $676D; LDA after destination-disk key/validation at $67B8, then store $1310 before write. |
| 17 | `$6CA2` | `data_disk_signature` | correct | 11 bytes C4 C1 CE C5 A0 C2 C9 C7 C8 C1 CD decode DANE BIGHAM. $7102 compares against $11F0+Y for Y=10..0; preparation copies marker at $71B5. |
| 18 | `$6CAD` | `insert_eligible_high_score` | correct | Full $6CAD-$6E11: eligibility/zero-score exits, read sector, save256 bytes $C800, compare level first then BCD bytes $130D..$130A, shift8-byte records and edit3 initials. Edited256-byte sector saved $C900, second read $6DF4, compare every byte with $C800, write $6E0C only after full equality. Caller $61D2. |
| 19 | `$7055` | `pack_and_write_room` | correct | Full $7055-$709B:16 rows by28 columns =448 cells. Even parity saves low value, odd shifts4 then ORs and stores.224-byte payload $1000-$10DF; tail $10E0-$10FF intact. A=2 tail calls sector I/O. Caller $69B7. |
| 20 | `$709C` | `sector_io` | correct | Full body $709C-$728E: sign bit checked first; negative A strips bit7 and jumps $715C, bypassing mode/digits. Mode>>1=0 means exactly0/1, embedded copies from $B500-$B7FF to $1000. Modes>=2 compute index low nibble sector/high nibble+3 track; channels15/2, U1/U2,256-byte loops. A=4 disk preparation falls through $7190. Eight direct callers/tail calls. |
| 21 | `$70DB` | `read_or_write_score_sector` | wrong | Unqualified requested I/O is false for cold caller $600D with mode0. Helper patches only live page operands $71FF/$7219, saves/restores room index, uses temporary $97. Ordinary live A=1/2 gives track12/sector7 and page $1100, but demo branch $70AF copies to unpatched $1000 and increments difficulty. Original-byte offline call A=1:1130 instructions,256 writes $1000-$10FF,zero $1100-$11FF,A=0,index restored0,difficulty0->1. All11 marker bytes checked, then A=0/1/FF statuses as stated. Ten direct callers checked. |
| 22 | `$7251` | `check_dos_status` | correct | Full $7251-$7275: reads two DOS digits, ORs them, drains through CR. Across ASCII digits0..9, only00 gives OR=$30. Other status JMP $6010. Both callers $71E8/$7236. |
| 23 | `$73C7` | `update_runner` | correct | Full $73C7-$74DD: vulnerability $131D=1; pending drill routes by sign; ladder/bar/fine-Y/bottom-row/floor support before control read $749E. Falling increments fine-Y, centers X, erases/redraws, restores old map marker on row crossing and installs runner9. Supported dispatch up/down/drill before left/right. Caller $611C. |
| 24 | `$76E6` | `start_drill_left` | correct | Full left-drill $76E6-$77A4 plus shared finish $7B12: flag/actions FF,phase0; row<15,column>0,brick1 diagonally below-left,blank0 beside. Align $7AEC/$7AFF, spray/brick indexed phases,phase12 completes. Obstruction restores bitmap, clears flag at $7795. Caller $74BC; continuation $73D3->$76F5. |
| 25 | `$7865` | `runner_animation_glyphs` | correct | Base read $7A44 with frame $07. First16 entries0..15 walking/hanging/drill/fall; climbing $7665-$7669 supplies16..17, reading $7875/$7876 by same base. Full movement/frame callers checked. |
| 26 | `$78EF` | `read_game_controls` | correct | Full $78EF-$7933 and $789B/$79B0 callees: mode1 goes demo; others consume/clear key latch, scan11 key/RTS words. Unknown keyboard keys become both actions; selectorCA goes joystick active-low $DC00. Keyboard CB/no key returns. Nine direct call/tail references checked. |
| 27 | `$7934` | `skip_room_cheat` | correct | INC lives/displayed level/physical index; LSR alive/eligibility clears their normal1 states. Death retry decrements lives, so room-skip increment balances. Lives INC lacks saturation; $7944-$7949 extra-life and $6173-$6178 completion award saturate. Command RTS word $7933. |
| 28 | `$7970` | `select_joystick_input` | correct | LDA #CA/STA $130F/JMP $78EF. Command RTS word $796F reaches entry. Complete3-instruction body. |
| 29 | `$7980` | `increase_game_speed` | correct | Compare pacing threshold with3, otherwise DEC, then controls again. Normal range3..8 from reset5 and paired decrease cap8. Main loop $6152-$6158 compares IRQ count with threshold, confirming fewer ticks for lower value. |
| 30 | `$7A1D` | `game_control_returns_high_alias` | correct | $791B high-base read paired low-base $7A1C at $791F. Y=2*command index0..10.11 words occupy $7A1C-$7A31. |
| 31 | `$7ACB` | `cycle_runner_frame` | correct | Complete $7ACB-$7AD8 increments $07 then compares inclusive A lower/X upper; stores A outside bounds. Callers $754A,$75C2,$7669 checked with ranges0..2/3..5,8..10/11..13,16..17. |
| 32 | `$7AFF` | `center_runner_fine_y` | correct | Complete $7AFF-$7B11: fine-Y compared with2, decrement above/increment below; gold tail-call only after change. Four callers $7515/$7589 horizontal and $7721/$77E2 drill. |
| 33 | `$7B85` | `guard_schedule_third_byte_base` | correct | Room setup adds difficulty+guard count without checking sum, directory $626A yields X, then $6104/$6109/$610E read triplet bases $7B83/$7B84/$7B85. Alias is exactly third byte; late lookups overlap contiguous tables as documented by $7B83. |
| 34 | `$7D5B` | `animate_guard_escape_wiggle` | correct | Caller decrements positive trap state and routes new states<13. Entry CPY #7:7..12 erase/read $7D6E+Y = $7D75-$7D7A wiggle/set fine-X/redraw/save;0..6 normal dispatch. $7FD2 forces direction3 when brick terrain+positive trap state, whose directory handler $7DA2 climbs out. |
| 35 | `$7D8E` | `guard_returns_high_alias` | correct | High base at $7D84 paired low at $7D88; doubled direction index0..4.5 RTS words map $84A3,$7EB4,$7F40,$7DA2,$7E30. |
| 36 | `$84A3` | `save_guard_fields` | correct | Complete stores local column,row,trap/carry,fine-X,fine-Y,frame,facing to $1260,$1268,$1270,$1278,$1280,$1288,$1290 indexed $131F. Selection $7BD2 makes guards1..count.11 tail callers checked. |
| 37 | `$862F` | `update_guard_respawns` | correct | Full $862F-$86CE: nonzero delay decremented; new19/10 draw stages39/3A. Zero first incremented to1; occupied dynamic-map destination preserves1 for retry. Blank writes guard8, clears both appearance bitmaps, zeros trap/delay, redraws actor, enables slot. Caller $84F1. |
| 38 | `$87A1` | `glyph_checksum_source_high` | correct | ADC absolute,Y at $879F has high operand $87A1. Status stores8E at $86E5, checksum loops70 bytes, restoresA8 at $87B0. Probe patches low operand11 at $8EA7. Glyph source immediate at $8B01 is separate and conditionally INC at $87AB. |
| 39 | `$897C` | `input_seen` | correct | Complete $897C-$8994: active-low direction bits0..3 or fire4 or key latch nonzero set carry; else clear. Four callers $60C8/$60DF start flash and $8942/$8961 cursor wait. Movement decoder separate $79B0. |
| 40 | `$8BF3` | `write_actor_sprite_shape` | unclear | Mechanism passes; glyph $23 wording can mean literal35, but $8AF8 indexes by value in ZP $23. Incoming A saved across expansion;zero picks player,any nonzero picks $131F guard. Phase $21&3, patched sprite destination,33 copies Y=32..0,X twice VIC slot. Sole caller $8B73. |
| 41 | `$8C2E` | `actor_sprite_slots` | correct | Raw slots00 02 03 04 06 07; read $8C0F by actor0..5. Actor enable directories $65D0/$86CF omit slots1 and5. |
| 42 | `$8CBA` | `retained_x_phase_table` | correct | 30 bytes exactly [2,3,0,1]*7+[2,3]. Full helper $8C92-$8C9B uses incoming X for this lookup, returns result in X, restores paired A from $8C9C. Retained, no active decoded caller. |
| 43 | `$8D44` | `clear_display_bitmap` | correct | Full entry/shared fill $8D44-$8D65: sprites disabled, zero pages20..3F inclusive,256 bytes each. Work entry picks40..5F with same fill machinery. Nine direct callers. |
| 44 | `$8D76` | `dynamic_grid_row_highs` | correct | 16 highs nine08/seven09 plus lows00,1C,38,54,70,8C,A8,C4,E0,00,1C,38,54,70,8C,A8. Row8 $08E0-$08FB,gap $08FC-$08FF,row9 $0900. Runner/guards write9/8 and restore terrain through paired $8D86.33 exact-base references checked. |
| 45 | `$8D77` | `next_dynamic_row_high_alias` | correct | Second-row high alias. Three below-row readers $740A,$7682,$7C3A pair with low base $8D67, current-row Y selects row+1. |
| 46 | `$8F9E` | `banner_rows_8` | correct | 14 indices immediately after JSR $9079 at $8F9B. Full callee consumes wrapper return PLA/PLA, reads14 bitmap rows81..94, returns outer caller; input abort removes outer return too. Outer calls $8EF7/$8EFD. |
| 47 | `$8FBD` | `banner_step_10` | correct | JSR $9079 plus14 inline indices $8FC0-$8FCD. Same consumed-wrapper return directly resumes outer animate routine; calls $8EF1/$8F03. Input-abort path exits outer routine as separate branch. |
| 48 | `$93B7` | `iris_mask_overlap_tail` | wrong | Original comment claimed alternating F0/0F masks. Bytes $93B3-$93BA are F0 F0 F0 F0 0F 0F 0F 0F. $925F AND #7 supplies index0..7;8 readers AND $93B3,X in full $9270-$93AE. Tail4 bytes0F and symbol start $93BB are correct. Parent corrected this during audit after receiving finding. |
| 49 | `$9500` | `motif_repeat_count` | correct | Raw9. Reset loads it, advance DEC/BPL returns for8..0; tenth decrement goesFF, increments transpose and reloads9. Full $6410-$6439. |
| 50 | `$9521` | `sid_note_frequency_lows` | correct | 37 lows $9521-$9545/paired highs $9546-$956A; index0 word0. All3 driver lookups unchecked. Enumerated normal pointers0..9/transposes2..11 produce each index37..42, e.g event $9904 pitch31+6..11. Low overflow reads highs offsets0..5. |
| 51 | `$959C` | `completion_music_1` | correct | 22 four-byte events,sentinel $95F4,sum durations97. Pointer slot5 selects stream. Full queue transposes nonzero melody/positive harmony; full driver decrements duration once per IRQ call $64D7. |
| 52 | `$966F` | `completion_music_4` | correct | 45 four-byte events,sentinel $9723,sum143,pointer slot8. Same queue/IRQ driver verified. |
| 53 | `$9724` | `completion_music_5` | correct | 27 four-byte events,sentinel $9790,sum128,pointer slot3. Same queue/IRQ driver verified. |
| 54 | `$9791` | `completion_music_6` | correct | 36 four-byte events,sentinel $9821,sum188,pointer slot0. Same queue/IRQ driver verified. |
| 55 | `$993D` | `completion_music_10` | correct | Zero byte:0 events/0 ticks. Directory slots10..14 point $993D; normal countdown9..0 selects0..9. Comment says directory selects, not that normal play reaches it. General driver transposition is correct. |
| 56 | `$993E` | `retained_editor_code_copy` | correct | 192 bytes exactly equal $693E-$69FD, including cell-edit/save/navigation code. Extracted IT already loads upper copy; full initialization contains no relocation. Editor RTS directory resolves lower handlers. No active decoded operand targets retained upper range. |
| 57 | `$9FA6` | `retained_room_loader_prefix` | correct | 90 bytes exactly equal lower $6FA6-$6FFF, truncating loader mid-instruction. Full initialization has no relocation and active targets stay lower. $A000 begins independent identity phase table. |
| 58 | `$A500` | `glyph_phase_2_overflow_bytes` | correct | Phase directory A0 A2 A4 A6; phase2 choosesA4/A5 via patched expansion operands. All256 A400 values equal pattern>>4 and allA500 equal pattern<<4 &255. Full expansion consumes104 glyph entries across11 scanlines/two halves at four2-pixel phases. |
| 59 | `$AE80` | `glyph_rows_8_to_10` | correct | 624 bytes=6*104 pattern entries,offset16*104 from $A800; final scanlines8..10 of11. Digit printer adds59; alphabet decoder C1..DA minus124 gives69..94. Independent bitmap reconstruction shows59=0,60=1,68=9,69=A,94=Z. |
| 60 | `$B100` | `demonstration_input_pairs` | correct | Start sets pointerB100; first pair16,4C. Full $789B-$78E8 loads two bytes/advances2 when duration0, decodes both nibbles through $78E9, repeats per pass. No terminator test; zero duration underflows255.768 bytes include108 zeros/retained tail. No unsupported intended boundary asserted. |

## Correction recheck

Offline tests of $70DB with requests A=1 and A=2 in both modes0 and1 copy256 bytes to $1000, write none to $1100, and advance difficulty to1. In both modes2 and5, with the prior KERNAL close-all-channels call $FFE7 stubbed to RTS, execution halted at $715C after preparing track12/sector07 and patching both disk-transfer pages to $11; no KERNAL body or drive operation ran. Assertions require all four preparation results to match. This confirms the replacement comment's conditional wording. Offline $8BF3 tests with glyph selector byte $23=59,phase2,current guard1 and A=0/1/$80 returned X=0/4/4, selected sprite buffers $0C00/$0C40/$0C40 and wrote33 bytes each. The clarification therefore correctly covers every nonzero A, including negative values.

## Targeted comparison follow-up — 4 October 2026

An independent reviewer who authored none of the four changed/new comments checked their final text against the canonical disk bytes. This selected check is not a random sample and supplies no population error-rate estimate. The preceding sampled counts and intervals remain unchanged.

| Address | Check | Final result |
|---|---|---|
| $6FA6 | Reset clears timer indexes30..0; decoder consumes224bytes at $1000–$10DF through row directories | Pass |
| $76E6 | Start phase0; twelve increments; phase12 completion on thirteenth successful update | Pass |
| $77A5 | Start phase12; twelve increments; phase24 completion on thirteenth update | Pass after correcting retained wording: spray phases12–23 animate;24 branches to allocation before reading the spray tables |
| $71F5 | First CHRIN result discarded before256 storing reads | Pass; native room-one buffer independently matches raw offsets1–224, while offset0 fails |

The reviewer also audited every decoded caller/writer used by the conditional hole bound. The continuing main loop calls runner update at $611C and hole service at $6142 exactly once. Allocation has only the two dig-completion tail callers $779F/$7862, seeds one180 timer at $7B57, and service decrements active timers at $850F. Normal room initialization clears31 timer cells at $6FC5. Other potential indexed aliases are excluded by traced legal guard/exit/hole index bounds; normal indirect stores target grids or bitmaps. These legal-memory and ordinary-reset/control-flow assumptions are explicit in `facts.md`. At least13 continuing passes separate allocations, giving an upper bound of14 active timed holes, not a proof of attaining 14 on a board.

Independent trapdoor/render and edition-timing spot-checks also pass: $733E draws tile5 as1 without changing the maps; side/up tests block5 while support/down tests permit passage under their movement preconditions. Cartridge $825D/$8118 counters and threshold differ from disk $648A/$611C; the recorded 144/48/48 and 144/72/72 IRQ/loop/hole counts are qualified to the tested 120 PAL-frame windows.

## Second full annotation audit — 4 October 2026

Three cold independent reviewers read every complete routine/data body, relevant callers, and indexed ranges for all **371 authored symbols and 371 comments**. Their disjoint ranges cover the complete declared **25,343 bytes**: title/lower engine $1400–$1EFE and $6000–$78EE (139 entries, 9,198 bytes); middle $78EF–$94FF (191 entries, 7,185 bytes); upper $9500–$B7FF (41 entries, 8,960 bytes). All stored listing bytes match the canonical hand-over snapshot. The 20 differences in a later play snapshot are traced runtime operand/data changes, not unexplained source differences. This full-list review supplies no fresh random-sample error estimate.

The reviewers supplied **17 replacements**: 14 comments with wrong details and three precision/evidence expansions. Root checked substantive findings against the bytes, applied corrections through the disassembler, exported symbols, and regenerated the listing. No symbol name, original opcode, stored byte, or coverage block changed. Private full reports and independently rerun fixtures are work/audit2-lower.md, work/audit2-middle.md, work/audit2-upper.md, and their matching scripts/correction files.

| Address | Corrected detail | Original-code evidence |
|---|---|---|
| $65A2 | Screen clear includes visible cells and padding, preserving sprite pointers | Four stores per 256-iteration loop; 1,000 visible cells, 16 padding cells, and eight overlapping stores |
| $7251 | DOS success tests the OR of two status bytes | All 65,536 prefixes: nine byte pairs satisfy OR=$30; ordinary ASCII decimal replies accept only 00 |
| $73C7 | Falling erases the picture each update but changes occupancy only at phase wrap | Five vertical-phase fixtures through the original runner routine |
| $789B | Demo durations count scripted-control polls | Supported, falling, and pending-dig fixtures; zero duration lasts 256 polls |
| $78E9 | Six authored actions do not bound every possible decoded nibble | Nibble 6 aliases following opcode $AD; larger indexes read subsequent code |
| $8297 | Right bar test can reuse the below-row pointer | Original $82FC indirect read and controlled current-right/below-right/left-bar fixtures; ordinary reachability open |
| $8863 | Rank digits bypass the binary converter | Three converter callers; rank calls $8885 directly; all 256 binary inputs checked |
| $889A | Punctuation ends at glyph 101 | All 256 input bytes; seven accepted punctuation bytes produce 95–101 |
| $A000–$A700 | Four phases advance by 0, 2, 4, and 6 physical pixels | All eight 256-byte lookup pages and all four original expansion phases; equivalent to 0–3 multicolour pixels |
| $B100 | Loaded 768-byte command area includes retained tail and has no encoded stop test | All 384 loaded pairs, supported control polling, zero-duration underflow, and directory aliases; ordinary tail consumption open |

Independent CPU checks also cover all route costs, decimal/text inputs, disk and cartridge source expansion, actor routing, timer/sentinel/refill paths, exit limits, guard respawn/joystick routing, banner/iris geometry, resident demos, all 450 disk room sectors, and all 17 compressed cartridge rooms. Main published-widget regression: **214,299 cases**, including **11,610 ordered SID ticks** across all 100 motif/offset combinations and every frequency-table alias 37–42. Picture gallery: **180 original source expansions**, **53 actor selectors**, and **47,520 pixel comparisons**. Selected cartridge comparison checks remain separately scoped in comparison.md.

Root repeated native forced-state score, gold, exits, digging, refill, life-control, completion, and pacing checks in VICE. Both the published reference and a fresh live capture match all 104,448 pixels through the shared renderer. These checks establish routine behavior and the recorded setup's timing. They do not prove playable reachability of arranged guard/hole states, editor save/reload, fresh-boot high-score persistence, loader/protection reconstruction, or complete cartridge semantic coverage.

## Fresh post-correction sample — 4 October 2026

A further cold reviewer who authored none of the annotations sampled the stable exported listing after the 17 replacements. Seed **6401042602**, Python random.Random, selects without replacement from address-sorted comments in the following stratum order. The complete sampled texts, byte differences, input hashes, evidence, and 25 original-code test suites are retained privately in work/audit2-sample.json, work/audit2-sample.md, and work/audit2-sample-tests.cjs. Root independently checked the substantive mask finding and reran the fixtures.

| Stratum | Population | Sample | Retained addresses |
|---|---:|---:|---|
| Below $7400 | 125 | 20 | $628A, $6681, $66D7, $66FB, $679A, $67B2, $67CC, $6905, $6A6C, $6AEE, $6B40, $6B93, $6BA2, $6C7E, $6C80, $6DCA, $6E9A, $7219, $723E, $723F |
| $7400–$88FF | 101 | 20 | $7934, $7955, $7970, $79A5, $7A1C, $7A4A, $7ACB, $7D7B, $7FD2, $8106, $8338, $8439, $84A3, $84F1, $86D5, $870F, $8710, $87A0, $87DF, $87E6 |
| $8900 and above | 145 | 20 | $8A1F, $8B1D, $8B58, $8BBA, $8C7F, $8D07, $8EBE, $8F79, $8F8D, $8FAF, $8FD1, $93B7, $9500, $9502, $956B, $95F5, $993E, $A300, $A800, $B600 |

**59 pass, 0 wrong, 1 ambiguous.** The unweighted wrong-detail fraction is 0/60, with descriptive Wilson 95% interval **0–6.02%**. Counting ambiguity as adverse gives 1/60 (**1.67%**), interval **0.29–8.86%**. These intervals do not adjust for unequal stratum populations and do not certify zero remaining errors. None of the dedicated title-data comments was drawn; sampled $628A and a separate fact claim executed the complete title decoder.

The ambiguity at **$86D5** was “Complementary six mask bytes.” Disable bytes are `00 FB F7 EF BF 7F`, versus enable bytes `00 04 08 10 40 80`: active guard entries 1–5 are inverse masks; unused entry zero is a zero sentinel. Original reader $859E scans legal guard indexes 5–1. Root clarified the sentinel and active entries after the sample. That dependent correction preserves the original ambiguous verdict; it is not a new zero-error sample.

Original-code fixtures cover all 1,000 three-digit board inputs, 256 initials bytes, 256 modifier flags, four graphics phases, six sprite buffers, the complete title decoder, surplus marker retention, score boundaries, both digs and final obstruction, gold collection, every hole countdown, motif cycling, control/guard dispatch, four inline banner streams, and resident demo copying. All listing bytes and symbols hash agree with the canonical input; 20 runtime byte changes are explicitly retained. No complete indirect non-use or ordinary reachability is inferred from these tests.

A separate seed **6401042622** selected **20 factual/page units: all pass**. Predeclared focused pools were facts.md 10/20, index.html 4/12, music.html 3/6, and levels.html 3/5. Selected units cover hole timing/pictures, completion awards, marker limits, room decoding, title extent, sprite buffers/slots, glyph dimensions, modifier handling, master-disk protection, trapdoor direction, score display, motif/transposition selection, and raw sector tail size. This is a numerical/widget claim sample, not a random sample from an exhaustive factual census. Orientation banking, declared engine scope, and entry/play identity also pass. Boot recipes, live pacing, drive persistence, and complete cartridge/Yellow behavior were not replayed by this reviewer; root's separately scoped checks supply the native/comparison evidence above. This contributor audit is not kit/CHECKING maintainer verification and changes no tier.
