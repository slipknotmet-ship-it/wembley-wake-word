#!/usr/bin/env bash
# Build, inline, and refresh the local preview the test suites point at.
#
# WHY THIS EXISTS: the preview server serves a SNAPSHOT (/tmp/artitest/index.html),
# not dist/. Running `vite build` alone leaves that snapshot stale, so the suites
# happily test the previous build and report PASS for code that is not running.
# Every path that rebuilds must come through here.
set -euo pipefail
cd "$(dirname "$0")/.."
npx vite build >/dev/null
node tools/inline.mjs --artifact >/dev/null
node tools/inline.mjs --out ../docs/index.html >/dev/null
mkdir -p /tmp/artitest
python3 - <<'PY'
import io
body = io.open('dist/emeem-artifact.html', encoding='utf-8').read()
io.open('/tmp/artitest/index.html', 'w', encoding='utf-8').write(
    '<!doctype html><html><head><meta charset="utf-8">'
    '<meta name="viewport" content="width=device-width, initial-scale=1">'
    '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3C/svg%3E">'
    '<style>body{margin:0;background:#fafaf9}</style></head><body>' + body + '</body></html>')
PY
curl -sf -o /dev/null http://127.0.0.1:4199/ || (cd /tmp/artitest && nohup python3 -m http.server 4199 >/dev/null 2>&1 & sleep 1)
echo "preview refreshed -> http://127.0.0.1:4199/  ($(stat -c%s /tmp/artitest/index.html) bytes)"
