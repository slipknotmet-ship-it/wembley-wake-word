# Emeem — playable build

`index.html` is the whole game in one self-contained file: no server, no
install, no account. Open it and it runs.

It is committed deliberately, not as a build artifact left lying around. Two
things use it:

- **GitHub Pages**, once Pages is enabled for this repo (Settings → Pages →
  Source: GitHub Actions). The `pages.yml` workflow then rebuilds and deploys
  on every push.
- **A raw-content CDN**, which needs nothing enabled at all, for when someone
  just wants to open the game on a phone right now.

Regenerate it with:

    cd emeem && npm run build && node tools/inline.mjs --out ../docs/index.html
