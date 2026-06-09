# K-Roll LA

**K-Roll LA** — robotic kimbap restaurant in Koreatown LA. Static marketing site with a live AI chat backend.

## Stack

- **Frontend:** Pure HTML + Tailwind CSS (CDN) + Google Fonts + Material Symbols — `index.html` is the entire site
- **Backend:** Cloudflare Pages Functions (serverless JS) — `functions/chat.js` proxies user messages to Gemini
- **AI:** Google Gemini 2.5 Flash (`gemini-2.5-flash`) via REST API
- **Hosting:** Cloudflare Pages (auto-deploy on push to `main`)
- **No build step** — static files served as-is

## Repo

- GitHub: `ljh9663-dev/kroll-la` → `git@github.com:ljh9663-dev/kroll-la.git`
- Production branch: `main`

## Deploy Pipeline

```bash
git add . && git commit -m "..." && git push
```

Every push to `main` triggers an automatic Cloudflare Pages deployment. No manual step needed.

Dashboard: https://dash.cloudflare.com → Workers & Pages → kroll-la

## Project Structure

```
kroll-la/
├── index.html               # entire frontend — HTML + Tailwind + inline JS
├── functions/
│   ├── chat.js              # POST /chat — Cloudflare Pages Function, Gemini proxy
│   └── system-prompt.js     # AI persona + menu data (edit freely to update chatbot)
├── assets/
│   ├── images/              # photos, hero images, product shots (prefer .webp)
│   ├── icons/               # custom SVG icons (not Material Symbols)
│   ├── fonts/               # self-hosted fonts (woff2 only)
│   └── video/               # mp4/webm video files (keep under 5MB)
├── _meta/                   # agent session logs and DB (not user-facing, gitignored)
├── package.json             # wrangler dev/deploy scripts
├── wrangler.toml            # cloudflare pages config
├── .gitignore
├── README.md                # bilingual (EN/KR) guide for non-technical editors
└── CLAUDE.md                # this file
```

## AI Chat Architecture

The floating chatbot widget in `index.html` POSTs to `/chat` with a `messages` array. The Cloudflare Pages Function at `functions/chat.js` proxies this to Gemini and returns `{ reply: string }`.

```
Browser (index.html)
  └─ POST /chat { messages: [{role, content}, ...] }
       └─ functions/chat.js (Cloudflare Pages Function)
            └─ Gemini 2.5 Flash API (google generativelanguage)
                 └─ { reply: "..." } → browser
```

**To change the AI's personality, menu data, or tone:** edit `functions/system-prompt.js` only. The `SYSTEM_PROMPT` export is injected into every Gemini request as `systemInstruction`. The menu in `system-prompt.js` is the authoritative source for the chatbot — keep it in sync with `index.html`.

**Message truncation:** each message content is capped at 2000 chars in `chat.js` before forwarding to Gemini.

**Gemini config:** `maxOutputTokens: 512`, `temperature: 0.7`.

## Environment Variables

Set in the Cloudflare Pages dashboard (Settings → Environment Variables):

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google AI Studio API key for Gemini |

Without `GEMINI_API_KEY`, `/chat` returns HTTP 500. The frontend displays a generic error message.

## Local Dev

```bash
npm install               # installs wrangler
npm run dev               # serves at http://localhost:3000 (wrangler pages dev)
```

Wrangler Pages Dev serves both the static site and `functions/` at localhost:3000. Set `GEMINI_API_KEY` in a `.dev.vars` file (not committed) for local AI chat:

```
# .dev.vars (gitignored)
GEMINI_API_KEY=your-key-here
```

## Design System

All colors and fonts are defined in the `<script id="tailwind-config">` block at the top of `index.html`.

### Color Tokens (Material Design 3 scheme)

| Token | Value | Usage |
|---|---|---|
| `primary` | `#9e001f` | Deep red — CTAs, highlights, brand |
| `primary-container` | `#c8102e` | Brighter red — gradients |
| `tertiary` | `#5d483b` | Warm brown — body text, footer bg |
| `secondary` | `#526348` | Muted green — secondary labels |
| `surface` | `#fcf9f4` | Warm white — page background |
| `on-surface` | `#1c1c19` | Near-black — body text |
| `surface-container` | `#f0ede9` | Light warm gray — card backgrounds |
| `outline-variant` | `#e5bdbb` | Pinkish border — dividers |

**Gradient classes:**
- `.bg-primary-gradient` — `linear-gradient(135deg, #9e001f, #c8102e)` — used on primary CTAs
- `.glass-nav` — frosted glass navbar (`rgba(252,249,244,0.92)` + `backdrop-filter: blur(12px)`)

### Typography

| Role | Font | Usage |
|---|---|---|
| `font-headline` | Noto Serif | Section headings, logo, nav links |
| `font-body` | Plus Jakarta Sans | Body copy, chat bubbles |
| `font-label` | Space Grotesk | Buttons, tags, overlines, stats |

Loaded via Google Fonts CDN. No self-hosted fonts currently in `assets/fonts/`.

### Border Radius

| Class | Value |
|---|---|
| `rounded` (DEFAULT) | `0.25rem` |
| `rounded-lg` | `0.5rem` |
| `rounded-xl` | `1.5rem` |
| `rounded-full` | `9999px` |

## Page Sections (index.html)

| Section | ID | Description |
|---|---|---|
| TopNavBar | _(fixed)_ | Logo, nav links, CTA button, hamburger (mobile) |
| Hero | _(no id)_ | Headline, subtext, hero image, 2 CTAs |
| Marquee Strip | _(no id)_ | Scrolling text band — CSS `@keyframes marquee` |
| Our Story | `#our-story` | Brand story, 3 stat callouts |
| How It Works | `#how-it-works` | 5-step process with icon circles |
| Menu | `#menu` | Filterable 6-card grid (All / Meat / Spicy / Vegan / GF) |
| AI Chat | `#ai-chat` | Static demo mockup + floating widget launch |
| Partners | `#partners` | 3-column: Investors, Partners, Catering |
| Order CTA | _(no id)_ | Full-width red CTA banner |
| Footer | _(no id)_ | 4-column: brand, company, services, contact |
| Floating Chat | _(global)_ | Bottom-right button → chat window overlay |

## Menu (source of truth: system-prompt.js)

| Item | Price | Tags |
|---|---|---|
| LA Galbi Roll | $15 | Meat ⭐ Best Seller |
| The Classic | $12 | Gluten-Free |
| Seoul Spice | $14 | Meat · Spicy |
| Garden Roll | $13 | Vegan |
| K-BBQ Fusion | $16 | Meat |
| Sunrise Roll | $13 | Gluten-Free |
| Tuna Crunch | $15 | Gluten-Free |
| Beast Mode | $17 | Meat · Gluten-Free · Keto option |

**Note:** `index.html` shows 6 cards (LA Galbi, Classic, Spicy Tuna, Veggie Fresh, K-BBQ Chicken, Protein Power) which differ slightly from the authoritative list in `system-prompt.js`. When updating menu items, update **both files** to keep them in sync.

## Assets Protocol

**Folder rules:**
- `assets/images/` — photos and raster images. Prefer `.webp` for new additions.
- `assets/icons/` — custom SVG icons only. For UI icons, use Material Symbols (`<span class="material-symbols-outlined">`).
- `assets/fonts/` — self-hosted fonts (woff2 only). Only add if Google Fonts CDN is insufficient.
- `assets/video/` — mp4/webm. Keep under 5MB.

**Naming convention:** `kebab-case`, no spaces or special characters. Examples: `hero-robot.webp`, `kimbap-closeup.webp`.

**Reference in HTML:**
```html
<img src="assets/images/hero.webp" alt="..." />
<div style="background-image: url('assets/images/bg.webp')"></div>
<video src="assets/video/intro.mp4" autoplay muted loop></video>
```

## Key Conventions

- **One-file frontend:** All HTML, Tailwind config, CSS `<style>`, and JavaScript live in `index.html`. No separate JS or CSS files.
- **Inline `<script>` blocks:** JS is colocated with the feature it powers (mobile menu, menu filter, chat widget — each has its own `<script>` block right after its HTML).
- **Material Symbols:** Use icon name as text content — `<span class="material-symbols-outlined">send</span>`.
- **Tailwind CDN:** No purging, no build. All tokens must be registered in the `tailwind.config` block or used as arbitrary values.
- **Images:** Current hero images use external `lh3.googleusercontent.com` URLs (placeholder). Replace with `assets/images/` paths when real photos are available.
- **System prompt edits:** Edit `functions/system-prompt.js` to change the AI chatbot's personality, menu data, hours, or tone. No code changes needed.

## Session Rule: Always Commit + Push

**At the end of every reply that modifies any file, Claude MUST:**
```bash
git add .
git commit -m "..."
git push -u origin <branch>
```
No exceptions. Every session ends with a clean working tree and a live deploy triggered.

## Gotchas

- **Tailwind CDN:** Not suitable for production perf optimization if site grows large. Purging requires a build step.
- **`cloudflared` ≠ Wrangler:** `cloudflared` is the tunnel tool. Wrangler is the Pages/Workers deploy CLI.
- **Material Symbols:** Icon name goes as text content, not as a class — `<span class="material-symbols-outlined">icon_name</span>`.
- **PATH:** Homebrew tools not in PATH by default in tool-spawned shells — `source ~/.zprofile` first if running locally on Mac.
- **Menu sync:** `index.html` menu cards and `functions/system-prompt.js` menu list can drift. Keep both updated.
- **Gemini model:** Currently `gemini-2.5-flash`. Model name is hardcoded in `functions/chat.js` line 29.
- **`_meta/` directory:** Contains agent session DB and action logs — not user-facing. Should not affect site behavior.
