/**
 * Collapses the Vite build into ONE self-contained .html file.
 *
 * Two consumers need this:
 *   - the Artifact publish path, which takes a single HTML file, and
 *   - anyone who wants to sideload the game by dropping one file on a phone.
 *
 * Pass --artifact to emit the artifact-hosting variant, which omits the
 * <!doctype>/<html>/<head>/<body> wrapper because the host supplies it.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const artifactMode = process.argv.includes('--artifact');
// indexOf returns -1 when --out is absent, and argv[-1 + 1] is argv[0] - the
// node binary itself, which is truthy, so the `||` default never fired and the
// script tried to overwrite the interpreter running it (ETXTBSY). Only treat
// the next argv slot as a path when the flag is actually there.
const outFlag = process.argv.indexOf('--out');
const out = (outFlag >= 0 && process.argv[outFlag + 1]) || (artifactMode ? 'dist/emeem-artifact.html' : 'dist/emeem-standalone.html');

let html = readFileSync(join(DIST, 'index.html'), 'utf8');
const assets = readdirSync(join(DIST, 'assets'));

// Inline every emitted <script type="module" src> and <link rel=stylesheet>.
for (const file of assets) {
  const body = readFileSync(join(DIST, 'assets', file), 'utf8');
  if (file.endsWith('.js')) {
    const re = new RegExp(`<script[^>]*src="[^"]*${file.replace(/\./g, '\\.')}"[^>]*></script>`);
    if (!re.test(html)) continue;
    // The bundle is an ES module and stays one; a classic script would break
    // three.js's top-level module semantics.
    //
    // The replacement MUST be a function. Passing the bundle as a replacement
    // STRING lets String.replace interpret $&, $', $` and $1 inside it as
    // special patterns - and minified three.js contains such sequences, which
    // spliced fragments of the original HTML back into the output and left a
    // live <script src> pointing at a file the artifact does not ship. The
    // published page loaded, found no bundle, and showed a black screen.
    html = html.replace(re, () => `<script type="module">\n${body}\n</script>`);
  } else if (file.endsWith('.css')) {
    const re = new RegExp(`<link[^>]*href="[^"]*${file.replace(/\./g, '\\.')}"[^>]*>`);
    if (!re.test(html)) continue;
    html = html.replace(re, () => `<style>\n${body}\n</style>`);
  }
}

// Drop any preload hints that now point at files nobody will fetch.
html = html.replace(/<link[^>]*rel="modulepreload"[^>]*>/g, '');

if (artifactMode) {
  // The artifact host wraps content in its own doctype/head/body, so hand it
  // just the inner content: title, styles, then markup and script.
  const head = (html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '').trim();
  const body = (html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || '').trim();
  const keep = head
    .replace(/<meta[^>]*charset[^>]*>/gi, '')
    .replace(/<meta[^>]*name="viewport"[^>]*>/gi, '')
    .trim();
  html = `${keep}\n${body}\n`;
}

writeFileSync(out, html);
const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
console.log(`${out}  ${kb} KB${artifactMode ? '  (artifact-wrapped)' : '  (standalone)'}`);
if (Buffer.byteLength(html) > 15 * 1024 * 1024) {
  console.error('WARNING: over the 15MB artifact comfort limit');
  process.exit(1);
}
