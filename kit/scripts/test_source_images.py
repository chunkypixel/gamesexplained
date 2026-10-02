#!/usr/bin/env python3
"""Overlays must count independently and stale secondary listings must fail CI."""
import hashlib
import json
import tempfile
import unittest
from pathlib import Path
from urllib.parse import unquote, urlsplit
from source_images import images
from coverage import tracked_count
from check_listing import check

class SourceImagesTest(unittest.TestCase):
    def image(self, root, label):
        root.mkdir(parents=True, exist_ok=True)
        game = {'platform':'c64','coverage':{'extra':[['$3000','$3002','overlay']]}}
        symbols = {'blocks':[{'start':0x3000,'end':0x3002,'type':'Code'}],
                   'symbols':[{'address':0x3000,'name':label,'type':'Subroutine','kind':'user'}],
                   'comments':[{'address':0x3000,'type':'line','text':label}]}
        (root/'game.json').write_text(json.dumps(game))
        (root/'symbols.json').write_text(json.dumps(symbols))
        listing = {'symbols_sha256':hashlib.sha256((root/'symbols.json').read_bytes()).hexdigest(),
                   'records':[{'a':0x3000,'l':label,'c':label}]}
        (root/'listing.json').write_text(json.dumps(listing))
        return game

    def test_reused_addresses_count_and_check_independently(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            game=self.image(root,'resident')
            self.image(root/'reference/overlay','overlay')
            game['source_images']=[{'id':'level','title':'Level','path':'reference/overlay'}]
            (root/'game.json').write_text(json.dumps(game))
            self.assertEqual(tracked_count(root),(6,6))
            self.assertEqual(check(root),[])
            p=root/'reference/overlay/listing.json'
            listing=json.loads(p.read_text());listing['records'][0]['c']='stale';p.write_text(json.dumps(listing))
            self.assertTrue(any('line comment' in e for e in check(root)))

    def test_external_path_and_duplicate_id_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);game=self.image(root,'resident')
            for row in ({'id':'escape','title':'Escape','path':'reference/../../private'},
                        {'id':'main','title':'Duplicate','path':'reference/overlay'}):
                game['source_images']=[row]
                with self.assertRaises(ValueError):images(root,game)

    def test_listing_urls_encode_filesystem_names(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);game=self.image(root,'resident')
            cases=(('reference/plain','reference/plain/listing.json'),
                   ('reference/hash#name','reference/hash%23name/listing.json'),
                   ('reference/query?name','reference/query%3Fname/listing.json'),
                   ('reference/percent%name','reference/percent%25name/listing.json'),
                   ('reference/%2e%2e/private','reference/%252e%252e/private/listing.json'))
            for folder,expected in cases:
                with self.subTest(folder=folder):
                    self.image(root/folder,'overlay')
                    game['source_images']=[{'id':'level','title':'Level','path':folder}]
                    image=images(root,game)[1]
                    self.assertEqual(image['listing'],expected)
                    self.assertEqual(image['path'],folder)
                    parsed=urlsplit(image['listing'])
                    self.assertFalse(parsed.query or parsed.fragment)
                    resolved=(root/unquote(parsed.path)).resolve()
                    self.assertTrue(resolved.is_relative_to(root/'reference'))
                    self.assertEqual(resolved,image['directory']/'listing.json')

    def test_listing_url_uses_canonical_relative_directory(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);game=self.image(root,'resident')
            self.image(root/'reference/overlay','overlay')
            game['source_images']=[{'id':'level','title':'Level',
                                    'path':'reference/unused/../overlay/'}]
            self.assertEqual(images(root,game)[1]['listing'],'reference/overlay/listing.json')

if __name__=='__main__':unittest.main()
