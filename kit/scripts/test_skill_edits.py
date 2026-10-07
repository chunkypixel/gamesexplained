#!/usr/bin/env python3
"""A game's branch that adds to a core skill names another game where the lesson would
have mattered (kit/skills/core/80-retro, step 3), and skill_edits.py fails it otherwise."""
from pathlib import Path
import os
import subprocess
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parent))
import skill_edits  # noqa: E402

FEEDBACK = "# Jumpman — kit feedback\n\n## What was changed in the kit\n\n{}\n\n## Candidates\n\nNone.\n"


class SkillEdits(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = self.tmp.name
        for d in ("games/c64/jumpman", "games/c64/wizard", "kit/skills/core/60-verify"):
            os.makedirs(os.path.join(self.root, d))
        self.write("kit/skills/core/60-verify/SKILL.md", "# Verify\n")
        self.write("games/c64/wizard/facts.md", "x\n")
        self.git("init", "-q", "-b", "main")
        self.git("add", "-A")
        self.git("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "base")
        self.git("checkout", "-qb", "game/c64/jumpman")

    def tearDown(self):
        self.tmp.cleanup()

    def write(self, rel, text):
        Path(self.root, rel).write_text(text, encoding="utf-8")

    def git(self, *args):
        subprocess.run(["git", "-C", self.root, *args], check=True)

    def run_check(self, feedback, skill_text="# Verify\nA new rule.\n"):
        self.write("kit/skills/core/60-verify/SKILL.md", skill_text)
        self.write("games/c64/jumpman/kit-feedback.md", FEEDBACK.format(feedback))
        self.git("add", "-A")
        self.git("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "game")
        return skill_edits.problems(skill_edits.changed("main", self.root), self.root)

    def test_another_game_named_passes(self):
        self.assertEqual(self.run_check(
            "- `kit/skills/core/60-verify`: check callback tables;\n  the same miss is in `games/c64/wizard`"), [])

    def test_no_other_game_fails(self):
        found = self.run_check("- `kit/skills/core/60-verify`: check callback tables, as every game with a header table")
        self.assertEqual([s for s, _ in found], ["kit/skills/core/60-verify"])

    def test_naming_only_its_own_game_fails(self):
        found = self.run_check("- `kit/skills/core/60-verify`: as in `games/c64/jumpman`")
        self.assertEqual(len(found), 1)

    def test_a_folder_that_does_not_exist_fails(self):
        found = self.run_check("- `kit/skills/core/60-verify`: as in `games/c64/nosuchgame`")
        self.assertEqual(len(found), 1)

    def test_cutting_text_is_not_checked(self):
        self.assertEqual(self.run_check("None.", skill_text=""), [])

    def test_a_kit_only_branch_is_not_checked(self):
        self.write("kit/skills/core/60-verify/SKILL.md", "# Verify\nA new rule.\n")
        self.git("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qam", "kit")
        self.assertEqual(skill_edits.problems(skill_edits.changed("main", self.root), self.root), [])

    def test_a_sweep_across_games_is_not_checked(self):
        self.write("kit/skills/core/60-verify/SKILL.md", "# Verify\nA new rule.\n")
        self.write("games/c64/wizard/facts.md", "y\n")
        self.git("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qam", "sweep")
        self.assertEqual(skill_edits.problems(skill_edits.changed("main", self.root), self.root), [])

    def test_no_base_compares_nothing(self):
        self.assertIsNone(skill_edits.changed("no-such-ref", self.root))


if __name__ == "__main__":
    unittest.main()
