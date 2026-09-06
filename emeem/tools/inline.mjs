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
const out = process.argv[process.argv.indexOf('--out') + 1] || (artifactMode ? 'dist/emeem-artifact.html' : 'dist/emeem-standalone.html');

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
    html = html.replace(re, `<script type="module">\n${body}\n</script>`);
  } else if (file.endsWith('.css')) {
    const re = new RegExp(`<link[^>]*href="[^"]*${file.replace(/\./g, '\\.')}"[^>]*>`);
    if (!re.test(html)) continue;
    html = html.replace(re, `<style>\n${body}\n</style>`);
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
