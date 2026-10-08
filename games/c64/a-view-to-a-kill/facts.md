# A View to a Kill — verified technical facts

Current truth for this game. The workflow lives in `kit/skills/`; how this
understanding developed lives in `agent-history.md`. Every fact names
the routine or table it comes from. Unless marked *live*, a fact comes
from reading the code in the snapshots named in `orientation.md`.

The game is five programs, and each has its own facts, listing and
symbols under `parts/<id>/`: `parts/intro/facts.md`, `parts/paris/facts.md`,
`parts/city-hall/facts.md`, `parts/mine/facts.md`,
`parts/finale/facts.md`. An address is always an address in the part
named with it. This file holds what spans the parts.

## Build

Five programs, loaded one at a time from a menu, each unpacked over the
whole of memory and started at its own entry (`orientation.md`):

| Part | Entry | Interrupt in play | Screen | Sound |
|---|---|---|---|---|
| intro | `$8020` | `$CC00` | bitmap, banks 1 and 2 | the Bond theme, speech |
| Paris | `$43B0`, then `$5A00` | `$5026` | `$0400` | the theme, effects, speech |
| City Hall | `$1000` | `$4022` | `$0400` | the intro's tune, effects |
| mine | `$5660` | `$1022` | `$4000` | Paris's tune, effects |
| finale | `$8000` | the KERNAL's | bitmap `$2000`, `$6000` | none |

Nothing is loaded once a part runs, and no part loads the next: the
player goes back to the menu for each.

## The codes

The three later parts start at a KERNAL "PLEASE ENTER CODE" prompt with
the same routine (`read_code`: City Hall `$1088`, mine `$5707`, finale
`$804C`): five characters through CHRIN, compared with a fixed string. A
match stores 1 in `$1BA0`; RETURN before five characters stores 0 and
plays on without the code (the finale goes back to its prompt instead);
a wrong code is read again, with no limit on tries.

| Given by | Where it is shown | Code | Checked by |
|---|---|---|---|
| Paris, on a catch | the telex, Paris `$8140` | CCPHJ | City Hall `$10D8` |
| City Hall, on escape | `mission_complete`, City Hall `$1334` | DB4CT | mine `$5757` |
| the mine, on defusing | `mission_complete`, mine `$0AFE` | ILVCT | finale `$809C` |

- Every code is fixed text. No part computes one from play: there is no
  score, no time or result in them (read in each part's end routine).
- `$1BA0` is the same address in all three parts, and a part reads it
  once, at its end:
  - City Hall (`$7096`): with the code, reaching room 76 with Stacey shows
    DB4CT; without it the game starts again (`$8600`).
  - mine (`$25F2`): with the code, the right bomb digits show ILVCT;
    without it the bomb goes off, whatever the digits (`game_over`, `$25D0`).
  - finale: written, never read. The ending plays only after ILVCT.
- *Live*, 30 September 2026: CCPHJ, DB4CT and ILVCT were each accepted at
  their prompts. City Hall's end with and without CCPHJ, and the mine's
  with and without DB4CT, behaved as above (`parts/city-hall/facts.md`,
  `parts/mine/facts.md`). The finale compared only five characters:
  ILVCTX was accepted.
- So a part can be played from the menu without its code, but only
  Paris gives a code without one: City Hall and the mine can be finished
  only by a player who typed the code that came before.

## Code the parts share

Bytes identical at the same addresses, compared in the unpacked images:

| What | Where |
|---|---|
| the three-voice music driver | intro and City Hall `$C621`-`$C7FE` |
| the Bond theme's notes | intro `$E000`, City Hall `$E000` (and intro `$8500`, the copy it moves there) |
| the second tune's notes | Paris and mine `$E000`-`$FFFF` |
| `read_joystick` | City Hall `$4700`, mine `$17A0` |
| `tick_clock` | Paris `$4170`, City Hall `$6E40` |
| the "OK" sound | City Hall `$6B50`, mine `$3B7D` |
| `read_code` | City Hall `$1088`, mine `$5707`, finale `$804C`, apart from the addresses they name |
| `mission_complete` and its text with ILVCT | mine `$0A00`-`$0B04`, and the same bytes in City Hall, where nothing calls them |

All four playable parts read the joystick in port 2 only (`$DC00`) and
stop CIA 1's timer A, so the KERNAL never scans the keyboard during play;
the keyboard is used only at the code prompts.

## Layers of the copy studied

Each part carries leftovers of earlier work on the game, none of which
runs:

- intro: a crack's menu and title ("THE DYNAMIC-DUO PRESENTS"), `$8020`
  onwards, overwritten by a 14-byte patch (`parts/intro/facts.md`).
- Paris: an earlier crack's BASIC line and depacker at `$0800`.
- City Hall: an older code prompt (code "QRS21", `$967B`), an older end
  screen ("WEBL DONE 007 YOUR CODE IS 111122", `$7E5A`), and the mine's
  end screen at `$0A00`.
- mine: stretches that match City Hall at the same addresses
  (`$0B04`-`$0FFF`).
- finale: memory the part's packer never writes, holding bytes that
  match Paris's code in part.

The code prompts are the original game's: City Hall's `code_prompt`
(`$1000`) and the mine's prompt text (`$56AD`) are byte for byte the same
on Domark's uncracked disk (below). The published game is documented with
the three codes (C64-Wiki, `features.md`).

## The original disk

Domark's uncracked PAL disk (`a_view_to_a_killdomark_1985pal.g64`) was
compared on 7 October 2026: each part loaded from that disk's menu and
saved in play (City Hall and the mine entered with CCPHJ and DB4CT), every
byte the listings call code compared, operands the game rewrites set
aside. Bytes that differ: intro 231 of 3,015, Paris 185 of 5,741, City
Hall 168 of 6,078, mine 51 of 7,927. The finale was not compared: the
original menu has no entry for it.

- The crack's: on the original, ABORT and RESTORE in City Hall and the
  mine go to a screen at `$0C00` offering to replay the part or load
  "MENU" (`$0C54`, KERNAL SETLFS, SETNAM, LOAD); the crack restarts the
  part (City Hall `$966F`, mine `$176A` and `$3A93`). On the original,
  Paris's instruction page and success telex play the theme from their
  interrupt (`$5046` JSR `$7AAB`); the crack swaps in a do-nothing
  interrupt (`$4F30`, `$5800`) and starts the chase through its own reset
  (`$43E0`-`$43F7`, `$4025`). The intro's `$8000`-`$80BF` is the crack's
  hand-over; the original blanks the top text rows' colour before the
  credits (`$90CD` JSR `$9FA0`) and clears the credit line differently
  (`$900A`).
- Play, order of the two unknown: in the original's City Hall, sprites 4
  and 5 follow Bond every pass by direction and walking frame (`$8900`,
  called from `$703D`), all four of his sprites hi-res (`$8654` writes 0
  to the multicolour register); the crack uses them for the energy gauge
  (`gauge_update`, `$8900`) and makes sprite 0 multicolour. The original
  draws no gauge, though the energy items still set `$1B5B`, and draws
  Stacey in the panel with characters when she is in Bond's room
  (`$8999`, three rows from `$89B0`). The crack blinks the item window's
  edge red and yellow (`$6D5D`, `$6D66`); the original's two colours are
  both purple. In the original mine the main loop's delay is 10 against 5
  (`$254E`), a second wait 128 against 32 (`$2E5E`), and the three hazard
  animations step once a main-loop pass (`$2558` JSR `$2CD6`) instead of
  every frame in the mid-screen interrupt (`$10CD`).

## Live tests

| Test | Part | Result |
|---|---|---|
| each code at its prompt; a wrong code; RETURN | City Hall, mine, finale | as above |
| four intro boots, start moved a tenth of a second each time | intro | the credits stalled in one (`parts/intro/facts.md`) |
| Bond's room set burning, with and without CCPHJ | City Hall | the DB4CT screen; a new game |
| `end_check` run with set digits, with and without DB4CT | mine | ILVCT; `game_over` |
| RESTORE after the ending | finale | the prompt again, blind |
| holding fire for 1.2 s on Paris's instruction page | Paris | the chase started normally; a stuck start seen once earlier was not reproduced |
