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
├── index.html       # entire site — one file
├── package.json     # wrangler dev/deploy scripts (optional local use)
├── wrangler.toml    # cloudflare pages config
├── .gitignore
└── CLAUDE.md        # this file
```

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

## Gotchas

- Tailwind is loaded via CDN — no purging, no build needed, but not suitable for production perf optimization if site grows large
- `cloudflared` ≠ Wrangler. `cloudflared` is the tunnel tool. Wrangler is the Pages/Workers deploy CLI
- Material Symbols: use icon name as text content of `<span class="material-symbols-outlined">`
- PATH: homebrew tools not in PATH by default in tool-spawned shells — source `.zprofile` first
