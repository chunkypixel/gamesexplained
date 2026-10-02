"""A rejected or interrupted frame request must not look like elapsed game time."""
import json
import unittest
from unittest.mock import patch

import vice


class FrameAdvanceTests(unittest.TestCase):
    def test_complete_count_is_returned(self):
        result = {"status": "ok", "frames": 120, "PC": 0x4000}
        rpc = object()
        with patch.object(vice, "call", return_value=json.dumps(result)) as call:
            self.assertEqual(vice.frames(rpc, 120), result)
            call.assert_called_once_with(rpc, "vice_frame_advance", {"frames": 120})

    def test_rejection_or_partial_advance_raises(self):
        replies = [
            {"error": "frames must be between 1 and 1000"},
            {"error": {"code": -32602, "message": "Invalid params"}},
            {"status": "stopped", "frames": 4},
            {"status": "ok", "frames": 4},
            {"status": "ok"},
            None,
        ]
        for result in replies:
            with self.subTest(result=result), patch.object(vice, "call", return_value=json.dumps(result)):
                with self.assertRaisesRegex(RuntimeError, "did not complete 120 frames"):
                    vice.frames(object(), 120)


if __name__ == "__main__":
    unittest.main()
