# K-Roll LA

**K-Roll LA** — robotic kimbap restaurant in Koreatown LA. Static marketing site.

## Stack

- Pure HTML + Tailwind CSS (CDN) + Google Fonts + Material Symbols
- No build step — `index.html` is the entire site
- Hosted on **Cloudflare Pages**

## Repo

- GitHub: `ljh9663-dev/kroll-la` → `git@github.com:ljh9663-dev/kroll-la.git`
- Branch: `main`

## Deploy Pipeline

```
git add . && git commit -m "..." && git push
```

That's it. Cloudflare Pages is connected to the GitHub repo with:
- **Production branch:** `main`
- **Auto-deploy:** enabled
- **Build command:** (none — static site)
- **Build output:** `.` (root)

Every push to `main` triggers an automatic Cloudflare Pages deployment. No manual deploy step needed.

Dashboard: https://dash.cloudflare.com → Workers & Pages → kroll-la

## Project Structure

```
kroll-la/
├── assets/
│   ├── images/      # photos, hero images, product shots
│   ├── icons/       # custom SVG icons (not Material Symbols)
│   ├── fonts/       # self-hosted font files (woff2)
│   └── video/       # background or promo video files
├── index.html       # entire site — one file
├── package.json     # wrangler dev/deploy scripts (optional local use)
├── wrangler.toml    # cloudflare pages config
├── .gitignore
└── CLAUDE.md        # this file
```

## Assets Protocol

All local assets live under `assets/`. Cloudflare Pages serves them at the root, so paths are relative from `index.html`.

**Folder rules:**
- `assets/images/` — photos and raster images (jpg, png, webp). Prefer webp for new additions.
- `assets/icons/` — custom SVG icons only. For UI icons, use Material Symbols (`<span class="material-symbols-outlined">`) instead.
- `assets/fonts/` — self-hosted fonts (woff2 only). Only add here if Google Fonts CDN is insufficient.
- `assets/video/` — mp4/webm video files. Keep under 5MB for web perf.

**How to reference in HTML:**
```html
<!-- Image -->
<img src="assets/images/hero.webp" alt="..." />

<!-- Background image via inline style -->
<div style="background-image: url('assets/images/bg.webp')"></div>

<!-- Video -->
<video src="assets/video/intro.mp4" autoplay muted loop></video>

<!-- Self-hosted font (in <style> block) -->
@font-face {
  font-family: 'CustomFont';
  src: url('assets/fonts/custom.woff2') format('woff2');
}
```

**Naming convention:** `kebab-case`, descriptive, no spaces or special characters.
Examples: `hero-robot.webp`, `kimbap-closeup.webp`, `logo-icon.svg`

**Before adding a new asset:**
1. Confirm it belongs in `assets/` (not an external CDN link)
2. Place in the correct subfolder
3. Use the path format above in `index.html`
4. Commit + push (see Deploy Pipeline)

## Local Dev (optional)

```bash
source ~/.zprofile        # ensure homebrew in PATH
npm install               # installs wrangler locally
npm run dev               # serves at localhost:3000
```

## Design System

Colors, fonts, and spacing are defined inline in the Tailwind config inside `index.html`:
- **Primary:** `#9e001f` (deep red)
- **Tertiary:** `#5d483b` (warm brown)
- **Surface:** `#fcf9f4` (warm white)
- **Fonts:** Noto Serif (headline), Plus Jakarta Sans (body), Space Grotesk (label)

## Session Rule: Always Commit + Push

**At the end of every reply that modifies any file, Claude MUST:**
```bash
eval "$(/opt/homebrew/bin/brew shellenv zsh)"
git add .
git commit -m "..."
git push
```
No exceptions. Every session ends with a clean working tree and a live deploy triggered.

## Gotchas

- Tailwind is loaded via CDN — no purging, no build needed, but not suitable for production perf optimization if site grows large
- `cloudflared` ≠ Wrangler. `cloudflared` is the tunnel tool. Wrangler is the Pages/Workers deploy CLI
- Material Symbols: use icon name as text content of `<span class="material-symbols-outlined">`
- PATH: homebrew tools not in PATH by default in tool-spawned shells — source `.zprofile` first
