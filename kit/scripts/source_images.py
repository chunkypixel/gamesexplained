"""Named source images for games that load overlays into the same addresses.

game.json may declare source_images: [{id, title, path}], where path is a
directory under reference/ containing game.json, symbols.json and listing.json.
Each image has its own ledger and comes from its own real emulator snapshot.
The primary image stays in the game folder; it is never replaced or combined
with another image's bytes. IDs are stable links: source.html?image=<id>#XXXX.
"""
import json
import re
from pathlib import Path
from urllib.parse import quote


def images(gdir, game=None):
    root = Path(gdir).resolve()
    if game is None:
        game = json.loads((root / "game.json").read_text())
    result = [{"id": "main", "title": game.get("source_title", "Main image"),
               "path": ".", "directory": root, "listing": "listing.json"}]
    seen = {"main"}
    for row in game.get("source_images", []):
        ident, title, path = row.get("id"), row.get("title"), row.get("path")
        if not isinstance(ident, str) or not re.fullmatch(r"[a-zA-Z0-9_-]+", ident) or ident in seen:
            raise ValueError(f"{root}: source image needs a unique id: {ident!r}")
        if not isinstance(title, str) or not title.strip() or not isinstance(path, str):
            raise ValueError(f"{root}: source image {ident} needs title and path")
        directory = (root / path).resolve()
        if not path.startswith("reference/") or not directory.is_relative_to(root / "reference"):
            raise ValueError(f"{root}: source image {ident} must be under reference/")
        for filename in ("game.json", "symbols.json", "listing.json"):
            if not (directory / filename).is_file():
                raise ValueError(f"{root}: source image {ident} missing {filename}")
        seen.add(ident)
        listing = quote(directory.relative_to(root).as_posix() + "/listing.json", safe="/")
        result.append({"id": ident, "title": title, "path": path,
                       "directory": directory, "listing": listing})
    return result
