# Lode Runner — features

## Sources

Read on 4 October 2026, before game-code inspection:

- [C64-Wiki](https://www.c64-wiki.com/wiki/Lode_Runner): disk and cartridge documentation leads.
- [C64 disk manual, Project 64 transcription](https://www.lemon64.com/doc/lode-runner/355): search-index excerpts were accessible; direct requests returned HTTP 403. Excerpts supplied credits, the 150-room objective, editor commands, and custom-disk preparation.
- Supplied Black, Gray, and Yellow Label G64 disks and OneLoad-labelled CRT. External descriptions do not establish byte identity between these builds.

Statuses below apply to the Black Label engine unless stated otherwise. “Traced” means the implementing code and data were followed; “confirmed” adds a live observation. Forced tests are identified in `facts.md`.

| Feature | Status | Evidence |
|---|---|---|
| Run, ladders, bars, gravity | confirmed/traced | Native room-one play; $73BD–$78EE movement bodies |
| Gold, hidden exits, top-row completion | confirmed/traced | Native 250-point pickup; isolated $7A4A/$8D96 tests; $611C/$6162 |
| Temporary brick holes; concrete resists drilling | confirmed/traced | Live finish/refill; $76E6/$77A5/$7B12/$84F1 |
| Guards escape holes or are buried and respawn | traced | $7BD2/$84F1/$862F |
| Guards carry and release gold | traced | $83F1 and signed carry-state paths |
| Five guards retained at most | traced | $728F allocation; all 150 stored boards inspected |
| 150 disk rooms and repeated difficulty cycles | confirmed/traced | Sector comparison all three disks; $709C/$70AF; schedule is unchecked and not uniformly faster |
| Gold 250; room 1500; trap/bury 75 each | confirmed/traced | Live gold and score tests; $6162/$7BD2/$84F1 |
| Port-2 joystick, I/K/J/L, U/O | confirmed/traced | Native joystick movement; $79B0/$7A10 key dispatch |
| Ctrl-J/K input; Ctrl-D drill polarity | traced | $78EF–$79AF RTS command targets |
| Pause, pace, abandon life | traced | Run/Stop and +/−/Ctrl-A directory and handler bodies |
| Ctrl-R attract; Return scores | traced | $6010/$61D8/$6E12 |
| Ctrl-F/U cheats and score eligibility | confirmed/traced | Forced live Ctrl-F dispatch saturates at 255; $78EF–$79AF |
| Reveal-animation control | traced | Ctrl-Z dispatch; Ctrl-Y documentation lead does not match this directory |
| Editor menu, number input, disk initialization | partly confirmed/traced | Editor entered through its Ctrl-E latch path; $65D6–$6CA1; initialization warning observed on a private blank disk; completion remains open |
| Ten editor cell types and cursor/save/navigation | traced | $6905/$6B89/$6B92/$6C98; save/reload integration remains open |
| Master-disk protection and high-score persistence | traced/open | $6A88/$6CAD marker/write paths; fresh-boot persistence not tested |
| Collection, drilling, falling, completion, death sound | traced/partly confirmed | IRQ voice-one paths and queue callers; native pickup; motif port checked for 1264 original-code ticks |
| Cartridge room count/editor differences | open | Native CRT boot/play confirmed separate engine; full feature comparison not completed |

## Reference images

C64-Wiki images were saved before annotation; their URLs and attribution are in `reference/README.md`. Native screenshots show the supplied builds. An attract picture is not evidence of an active game. Editor screenshots use the original engine's command-latch entry and private disk copies.

## Open searches

Cartridge engine routines were identified at different addresses, but its full room directory and dispatch tables were not decoded. The disk engine listing does not answer cartridge-specific questions. Master/user marker and score-writing callers were fully traced; persistence across a new emulated boot remains an integration test. Full-hole and bottom-row guard corner cases are recorded in `facts.md` with player reachability unproved.
