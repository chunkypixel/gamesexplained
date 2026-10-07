#!/usr/bin/env python3
"""r2000.py asks the disassembler who refers to each address in batches, and keeps the answers."""
import importlib.util
import json
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('c64_r2000', Path(__file__).with_name('r2000.py'))
r2000 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(r2000)


def text(value):
    return {'content': [{'type': 'text', 'text': json.dumps(value)}]}


class CrossReferences(unittest.TestCase):
    def test_asked_in_batches(self):
        sizes = []

        def make_client(gdir=None):
            def rpc(method, params=None, notif=False):
                self.assertEqual(params['name'], 'r2000_batch_execute')
                ask = params['arguments']['calls']
                sizes.append(len(ask))
                return {'result': text([{'status': 'error', 'error': {'code': -32602}} if c['arguments']['address'] == 5
                                        else {'status': 'success', 'result': text([c['arguments']['address'] + 1])}
                                        for c in ask])}
            return rpc
        keep, r2000.make_client = r2000.make_client, make_client
        try:
            out = r2000.cross_references(range(450), 'games/c64/fixture/parts/park')
        finally:
            r2000.make_client = keep
        self.assertEqual(sizes, [200, 200, 50])
        self.assertEqual(out[0], [1])
        self.assertEqual(out[449], [450])
        self.assertNotIn(5, out)                 # no answer: nothing is known to refer to it
        self.assertEqual(len(out), 449)


if __name__ == '__main__':
    unittest.main()
