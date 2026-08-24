# AGENTS.md

Static, dependency-free VPN speed-comparison site. No build, lint, test, or package manager.

## Running / testing
- No dev server or toolchain. Serve the folder over HTTP or the ES modules and `fetch('vpn-data.json')` break.
  - `python -m http.server` from the repo root, then open `http://localhost:8000/index.html`.
- Never open `index.html`/`detail.html` via `file://` — module scripts and JSON fetch fail there.

## Architecture
- Pure vanilla JS with ES modules (`<script type="module">`). Do NOT add npm dependencies or a bundler.
- Entrypoints: `index.html` → `js/main.js`; `detail.html` → `vpn-detail.js`. Both share `js/utils-shared.js`.
- Keep shared render/escape/format helpers in `js/utils-shared.js`; don't duplicate them.
- `js/vpn-data.js` fetches `vpn-data.json` at runtime; it tolerates `{ "services": [...] }` (current) or a bare array.

## Data & content
- All VPN data lives in `vpn-data.json` (`lastUpdated` + `services` array). To add a VPN:
  1. Create `assets/<Name>/icon.webp`.
  2. Add an entry to `services` (see README "Добавить VPN").
- Speed color thresholds differ per page in `js/utils-shared.js` `SPEED_THRESHOLDS` (main: high≥10 / medium≥5; detail: high≥50 / medium≥10). Preserve them when editing.
- UI text and README are Russian; numbers are formatted with a comma via `formatNumber`.

## Deploy
- Published to GitHub Pages (https://mrcecece.github.io/VPNs/) from the `main` branch. To publish, push to `main`. No CI.
