## next · 4 October 2026 · Skate or Die! · unorig with Claude

**A value the code never writes came from the disk.** High Jump's music
picks its phrases from a random byte that nothing in the event sets. The
first draft called it left over from earlier loads; the event's own file
brings it, so the music takes the same path the first time it plays
after every load, and the snapshot held a value it had moved on to. A
page built from the snapshot would have played an order the game never
plays first. `60-verify` now says to find such a value in the loaded
file before describing it.

**Typed inline text does not stay typed.** A routine that prints the
string after its call was found and its argument typed as bytes, and
twice a later trace, entering from another agent's range, decoded the
string as code again and invented a code block inside the bitmap where
the bogus operand pointed. Coverage counted it. `50-coverage` now says
to check every call site's argument after each agent's export.

**The game's own sound driver can be the page's player.** Running the
event's driver in the page's 6502 interpreter, and comparing its SID
writes with the game's own over 15,000 frames in the kit's simulator,
gave a player that is the game rather than a transcription, with a test
that says so.
