# CLAUDE.md — Project Context for Claude Code

## Project Overview

**LinkHub** is a **static demo/portfolio showcase** of a Linktree-style link-in-bio app with NFC wristband UX. It's fully static (no backend, no database, no auth) and deploys to GitHub Pages.

Live demo (once Pages is enabled): `https://theloop705.github.io/my-linktree-clone/`

## What This Is / Isn't

- **Is:** A fully static Next.js showcase site — marketing page, auth mockups, dashboard UI, NFC pairing wizard, public profile themes.
- **Isn't:** A real product. No database, no authentication, no API, no persistence. Forms just navigate; dashboard edits live in React state only.

## Tech Stack

- **Framework:** Next.js 14 (App Router, `output: 'export'` — static export)
- **Styling:** Custom SCSS design system (`src/styles/`) — no Bootstrap, no Tailwind
- **Components:** Custom design components in `src/components/design/`
- **Toast:** Radix UI toast (`@radix-ui/react-toast`) with custom SCSS
- **Deployment:** GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)

## Static Export Configuration

`next.config.mjs` uses `output: 'export'`. When env var `GITHUB_PAGES=true`, the build sets `basePath` and `assetPrefix` to `/my-linktree-clone` (the repo name). Locally, no basePath is set.

## Routes (all statically generated)

- `/` — Marketing landing page
- `/login` — Login mockup (submits → redirects to `/dashboard`)
- `/register` — Register mockup (submits → redirects to `/dashboard`)
- `/dashboard` — Links management + live preview (all client state, no persistence)
- `/dashboard/profile` — Profile/page settings (mock save)
- `/dashboard/nfc` — NFC wristband pairing wizard (5 steps)
- `/[slug]` — Public profile pages. Pre-rendered with `generateStaticParams` for: `demo`, `jordan`, `lena`, `you` (each demos a different theme).

## Design System

### SCSS Structure
- `_tokens.scss` — CSS custom properties for colors, spacing, typography
- `_base.scss` — reset and body defaults
- `components/` — buttons, forms, toggle, logo, NFC band, atoms, toast
- `pages/` — marketing, auth, dashboard, profile, NFC
- `main.scss` — imports everything; imported in `src/app/layout.tsx`

### Design Components (`src/components/design/`)
- `Icon.tsx` — SVG icon set (Plus, Check, Arrow, Link, Chart, Paint, Gear, NFC, Globe, Pin, Grip, Eye, Copy, Sparkle, Trash, External)
- `Logo.tsx` — LinkHub logo
- `NFCBand.tsx` — Animated NFC wristband visual
- `MobileStatus.tsx` — Phone status bar for mockups

### CSS Conventions
- BEM: `.block__element--modifier`
- Data attributes for state: `data-theme`, `data-on`, `data-inactive`, `data-selected`, `aria-pressed`
- Button classes: `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-gradient`, `.btn-white`, `.btn-glass`
- Form classes: `.field`, `.label`, `.input`, `.input-inline-prefix`
- Utility classes: `.mono`, `.chip`, `.gradient-text`

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) runs on push to `main`:
1. Installs deps
2. Builds with `GITHUB_PAGES=true` (applies basePath)
3. Adds `.nojekyll` to `out/`
4. Uploads and deploys to Pages

To enable: in repo **Settings → Pages**, set "Build and deployment" source to **GitHub Actions**.

## Session History

### Session 1: Frontend Bootstrap Redesign
Rebuilt the entire UI from Bootstrap to a custom SCSS design system. Created the Icon/Logo/NFCBand components. Rebuilt marketing, login, register, dashboard, profile, public profile pages. Created the NFC setup wizard.

### Session 2: Strip to Static Demo
Removed Prisma, NextAuth, API routes, tests, editor route, and all database-backed code. Converted pages to use mock/local-state data. Configured Next.js for static export. Added GitHub Actions Pages deployment workflow. Slimmed `package.json` from ~50 deps to ~10.

## Local Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to out/
```

## Potential Future Work

- Wire up localStorage persistence for dashboard/profile state so demo edits survive refresh
- Add more demo slugs with different theme examples
- Polish mobile responsive breakpoints
- Add a subtle "Demo mode" banner on dashboard so visitors know what this is
