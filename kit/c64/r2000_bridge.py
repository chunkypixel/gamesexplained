#!/usr/bin/env python3
"""Expose regenerator2000's stdio MCP server on a private loopback HTTP port.

Started only by tools.py when tools/ports.json selects a nondefault port.
No packages are needed. One process owns the disassembler and serializes requests.
"""
import base64
import gzip
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os
from pathlib import Path
import select
import signal
import subprocess
import sys
import time


def snapshot_ram(raw):
    """Extract C64 RAM within its declared module, never into a following one."""
    if len(raw) < 37 or not raw.startswith(b"VICE Snapshot File\x1a"):
        raise ValueError("not a VICE snapshot")
    pos = 58 if raw[37:50] == b"VICE Version\x1a" else 37
    while pos + 22 <= len(raw):
        name = raw[pos:pos + 16].split(b"\0")[0]
        size = int.from_bytes(raw[pos + 18:pos + 22], "little")
        if size < 22 or pos + size > len(raw):
            raise ValueError("invalid snapshot module size")
        if name == b"C64MEM":
            if size < 26 + 65536:
                raise ValueError("snapshot lacks a complete C64MEM RAM image")
            return raw[pos + 26:pos + 26 + 65536]
        pos += size
    raise ValueError("snapshot lacks a complete C64MEM RAM image")


def prepare_source(source, tools_dir):
    """Keep converted snapshot input in this clone's tools directory."""
    source = Path(source)
    if source.suffix.lower() == ".vsf":
        ram = snapshot_ram(source.read_bytes())
        project = Path(tools_dir) / "r2000-input.regen2000proj"
        project.parent.mkdir(parents=True, exist_ok=True)
        project.write_text(json.dumps({
            "version": 1, "origin": 0,
            "raw_data_base64": base64.b64encode(gzip.compress(ram, mtime=0)).decode(),
            "blocks": [{"start": 0, "end": 65535, "type_": "Undefined", "collapsed": False}],
            "labels": {}, "user_line_comments": {}, "user_side_comments": {},
        }))
        source = project
    elif source.suffix.lower() != ".regen2000proj":
        raise ValueError("a custom port supports .vsf or .regen2000proj input")
    return source


class ChildRPC:
    """Single serialized JSON-lines exchange, including partial reads and EOF."""
    def __init__(self, child):
        self.child = child
        self.buffer = b""
        self.broken = False

    def exchange(self, request, timeout=60):
        if not isinstance(request, dict) or not isinstance(request.get("method"), str):
            raise ValueError("expected a JSON-RPC request object")
        if self.broken:
            raise ConnectionError("disassembler stream is unavailable; restart the bridge")
        try:
            self.child.stdin.write(json.dumps(request).encode() + b"\n")
            self.child.stdin.flush()
            if "id" not in request:
                return None             # JSON-RPC notifications have no response
            deadline = time.monotonic() + timeout
            while True:
                if b"\n" in self.buffer:
                    line, self.buffer = self.buffer.split(b"\n", 1)
                    value = json.loads(line)
                    if not isinstance(value, dict):
                        raise ValueError("invalid disassembler response")
                    if "id" not in value or (value["id"] is None and request["id"] is not None):
                        continue        # child notifications, or a legacy null-id acknowledgement
                    if value["id"] != request["id"]:
                        raise ValueError("disassembler response ID mismatch")
                    return line
                remaining = deadline - time.monotonic()
                if remaining <= 0 or not select.select([self.child.stdout], [], [], remaining)[0]:
                    raise TimeoutError("disassembler response timed out")
                chunk = os.read(self.child.stdout.fileno(), 65536)
                if not chunk:
                    raise ConnectionError("disassembler closed its response stream")
                self.buffer += chunk
        except (OSError, ValueError):
            # A late reply after a timeout must not be matched to another client's
            # reused request id. Refuse later calls until the bridge is restarted.
            self.broken = True
            raise


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/mcp":
            self.send_error(404)
            return
        try:
            length = int(self.headers["Content-Length"])
            if length <= 0:
                raise ValueError("invalid Content-Length")
            request = json.loads(self.rfile.read(length))
            response = self.server.rpc.exchange(request)
            self.send_response(202 if response is None else 200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(response) if response is not None else 0))
            self.end_headers()
            if response is not None:
                self.wfile.write(response)
        except (OSError, ValueError, KeyError, TypeError) as exc:
            self.send_error(502, str(exc))


def main():
    if len(sys.argv) != 4:
        raise SystemExit("usage: r2000_bridge.py <regenerator2000> <source> <port>")
    exe, source, port = sys.argv[1], Path(sys.argv[2]), int(sys.argv[3])
    if not 1024 <= port <= 65535:
        raise ValueError("port must be from 1024 to 65535")

    def stop(*_):
        raise SystemExit(0)

    signal.signal(signal.SIGTERM, stop)
    # Bind first: an occupied port must not spawn a child or overwrite converted
    # input belonging to another session in this clone.
    with HTTPServer(("127.0.0.1", port), Handler) as server:
        source = prepare_source(source, Path(__file__).resolve().parents[2] / "tools")
        child = subprocess.Popen([exe, "--mcp-server-stdio", str(source)],
                                 stdin=subprocess.PIPE, stdout=subprocess.PIPE, bufsize=0)
        try:
            server.rpc = ChildRPC(child)
            server.serve_forever()
        finally:
            child.terminate()
            try:
                child.wait(timeout=5)
            except subprocess.TimeoutExpired:
                child.kill()
                child.wait()


if __name__ == "__main__":
    main()
