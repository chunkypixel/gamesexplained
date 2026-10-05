# Arkanoid — kit feedback

Written in the retrospective (`kit/skills/core/80-retro`). Which skill text
changed what the run did, what the skills and kit got wrong or left out,
what was changed, what needs a maintainer's decision, what took longest,
operating system and tool versions.

## Skill text that changed what I did

- `kit/skills/core/10-orient`: "Save the hand-over too": the stop on `$9400` gave the image the whole run is read from; the start-up erases itself, so the play snapshot lacks it.
- `kit/skills/core/20-features`: "Its result summaries quote the pages: use them for plain claims only": every page fetch was refused, and the search summaries gave the credits and the capsule list, marked second-hand.

## What was changed in the kit

<one line per change: the file and what it now says. For a change that
carries a lesson, name its file in `kit/lessons/` and stop there: the
lesson is told once, in that file. Any other change (a script, a path,
the site) says why here.>

## Candidates

<a silent failure no other game could be named for (80-retro, step 3),
one paragraph each: what went wrong unnoticed, how it was caught, and
what the skill would say. The next run that meets it makes the edit.
"None." if there were none.>

## Maintainer asks

<one bullet per ask. Filed: "- #123: the ask in one line". Not filed (no
yes, or no way to reach the repository): "- **The ask, in one line.** The
problem, what it cost, what to change and where", which the repository
files when the pull request merges. Prose around the bullets is free;
check_docs.py checks the bullets.>

## What took longest

<the table from `python3 kit/scripts/clock.py report`>

The one change to the kit that would have saved the most minutes:
