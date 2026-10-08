#!/usr/bin/env python3
"""Self-check for kit/c64/codemap.py: no emulator needed."""
import json
import os
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from codemap import parse_executed, runs  # noqa: E402

SAMPLE = """\
(C:$1005) addr: IO  ROM RAM
1000: --- --- r-x (uninitialized exec)
1002: --- --- r-x (uninitialized exec)
1005: --- --- r-x (uninitialized exec)
e5cd: --- r-x --- (uninitialized exec)
(C:$1005) """


class ParseTests(unittest.TestCase):
    def test_parse_executed(self):
        self.assertEqual(parse_executed(SAMPLE), {0x1000, 0x1002, 0x1005, 0xE5CD})

    def test_parse_empty(self):
        self.assertEqual(parse_executed("(C:$1005) addr: IO  ROM RAM\n(C:$1005) "), set())

    def test_runs(self):
        self.assertEqual(runs({0x1000, 0x1001, 0x1002, 0x1005}), [[0x1000, 0x1002], [0x1005, 0x1005]])
        self.assertEqual(runs(set()), [])


class FormatTests(unittest.TestCase):
    def test_matches_check_listing(self):
        """codemap.json has the keys check_listing.py reads, in its layout."""
        sys.path.insert(0, os.path.join(os.path.dirname(HERE), "scripts"))
        from check_listing import untyped_code  # noqa: E402
        with tempfile.TemporaryDirectory() as gdir:
            cm = {"starts": [0x1000, 0x1005], "code": [[0x1000, 0x1002], [0x1005, 0x1007]],
                  "executed": [0x1000, 0x1005], "ran": [[0x1000, 0x1002], [0x1005, 0x1007]]}
            json.dump(cm, open(os.path.join(gdir, "codemap.json"), "w"))
            # $1000-$1002 typed Code, $1005-$1007 typed as data: ran-as-data is an error
            sym = {"blocks": [{"type": "Code", "start": 0x1000, "end": 0x1002},
                              {"type": "Data", "start": 0x1005, "end": 0x1007}]}
            ran, traced = untyped_code(gdir, sym)
            self.assertEqual(ran, [0x1005, 0x1006, 0x1007])
            self.assertEqual(traced, [])


if __name__ == "__main__":
    unittest.main()
