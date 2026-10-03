#!/usr/bin/env python3
"""Extract this revision with an existing VICE c1541; download nothing.

The image and output files are private inputs, never files to commit.
"""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--c1541', type=Path, required=True)
    parser.add_argument('--image', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True,
                        help='Empty directory for private extracted PRGs, normally under work/')
    args = parser.parse_args()
    manifest = json.loads(Path(__file__).with_name('inputs.json').read_text())
    image, out = args.image.resolve(), args.out.resolve()
    if sha256(image) != manifest['disk_sha256']:
        parser.error('Image differs from the audited JUMPMAN REV 1.0 input.')
    if out.exists() and any(out.iterdir()):
        parser.error('Output directory must be empty; existing evidence will not be overwritten.')
    out.mkdir(parents=True, exist_ok=True)
    command = [str(args.c1541.resolve()), '-attach', str(image)]
    for item in manifest['files']:
        command += ['-read', item['name'].lower(), str(out / (item['name'].lower() + '.prg'))]
    subprocess.run(command, check=True)
    for item in manifest['files']:
        file = out / (item['name'].lower() + '.prg')
        if sha256(file) != item['sha256']:
            raise RuntimeError(f'{file.name}: extracted bytes differ from the recorded input')
    if sha256(image) != manifest['disk_sha256']:
        raise RuntimeError('Input image changed during extraction')
    print(f"PASS: {len(manifest['files'])} file hashes match; input image is unchanged.")


if __name__ == '__main__':
    main()
