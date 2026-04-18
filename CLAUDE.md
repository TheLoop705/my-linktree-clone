# CLAUDE.md — Project Context for Claude Code

## Project Overview

**LinkHub** (my-linktree-clone) is a Linktree-style link-in-bio app with NFC wristband pairing. Built with Next.js 14 (App Router), Prisma, NextAuth, and a custom SCSS design system.

## Tech Stack

- **Framework:** Next.js 14 (App Router, `src/app/`)
- **Auth:** NextAuth with credentials provider
- **Database:** Prisma ORM (SQLite in dev)
- **Styling:** Custom SCSS design system (`src/styles/`) — no Bootstrap, no Tailwind
- **Components:** Custom design components in `src/components/design/`

## Architecture

### Design System (custom, no framework)
- **Tokens:** `src/styles/_tokens.scss` — CSS custom properties for colors, spacing, typography
- **Base:** `src/styles/_base.scss` — reset and body defaults
- **Components:** `src/styles/components/` — buttons, forms, toggle, logo, NFC band, atoms
- **Pages:** `src/styles/pages/` — marketing, auth, dashboard, profile, NFC
- **Entry:** `src/styles/main.scss` — imports everything, imported in `layout.tsx`

### Design Components
- `src/components/design/Icon.tsx` — SVG icon system (Icon.Plus, Icon.Check, Icon.Arrow, etc.)
- `src/components/design/Logo.tsx` — LinkHub logo with optional label color
- `src/components/design/NFCBand.tsx` — NFC wristband visual (size, glow, floating props)
- `src/components/design/MobileStatus.tsx` — phone status bar for previews

### Page Structure
- `/` — Marketing landing page (marketing nav, hero, features, pricing, footer)
- `/login` — Login with split-screen auth layout
- `/register` — Register with split-screen auth layout
- `/dashboard` — Links management + live preview (sidebar from layout)
- `/dashboard/profile` — Profile & page settings
- `/dashboard/nfc` — NFC wristband pairing wizard (5-step flow)
- `/[slug]` — Public profile page (server component, 4 themes: default/dark/gradient/minimal)

### API Routes
- `/api/auth/[...nextauth]` — NextAuth
- `/api/auth/register` — User registration
- `/api/pages`, `/api/pages/[pageId]`, `/api/pages/my-page` — Page CRUD
- `/api/links`, `/api/links/[linkId]` — Link CRUD
- `/api/profile` — Profile GET/PUT

### CSS Naming Convention
- BEM: `.block__element--modifier`
- Data attributes for state: `data-theme`, `data-on`, `data-inactive`, `data-hidden`, `aria-pressed`
- Utility classes: `.mono` (monospace), `.chip` (pill badge), `.gradient-text`
- Button classes: `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-gradient`, `.btn-white`, `.btn-glass`
- Form classes: `.field`, `.label`, `.input`, `.input-inline-prefix`

### Important Patterns
- Dashboard layout (`layout.tsx`) wraps all `/dashboard/*` routes with sidebar
- Dashboard pages render `.dash-main > .dash-main__left + .dash-main__right`
- Auth pages use split-screen: `.auth > .auth-left + .auth-right`
- Public profile uses `data-theme` attribute for theme switching

## What Was Done (Session Summary)

### Complete Frontend Redesign (Bootstrap → Custom Design System)

1. **Created design system from scratch:**
   - Design tokens (colors, spacing, radii, typography as CSS custom properties)
   - Base styles, animations, component SCSS (buttons, forms, toggles, logo, NFC band)
   - Page-specific SCSS (marketing, auth, dashboard, profile, NFC)

2. **Created shared design components:**
   - `Icon.tsx` — Full SVG icon set (16 icons)
   - `Logo.tsx` — Branded logo component
   - `NFCBand.tsx` — NFC wristband visual with glow/floating effects
   - `MobileStatus.tsx` — Phone status bar for preview mockups

3. **Rebuilt all pages:**
   - **Marketing page** (`/`) — Nav, hero with phone mockup, logo strip, features, how-it-works, testimonials, pricing tiers, CTA band, footer
   - **Login page** (`/login`) — Split-screen with testimonial left panel, social auth buttons, email form
   - **Register page** (`/register`) — Same layout with handle field, password confirm, validation errors
   - **Dashboard layout** — Sidebar with nav, account info, upgrade CTA, sign-out button
   - **Dashboard page** (`/dashboard`) — Stats cards, links list with toggles, add-link form, NFC devices block, live phone preview
   - **Profile page** (`/dashboard/profile`) — Profile info form + page settings form with toggle
   - **Public profile** (`/[slug]`) — Theme-aware (4 themes), avatar, meta, link cards, footer
   - **NFC setup** (`/dashboard/nfc`) — 5-step wizard (welcome, band picker, tap-to-pair, name, done with confetti)

4. **Removed Bootstrap dependency** — deleted `BootstrapClient.tsx`, stripped Bootstrap class names from all pages

5. **Design plans preserved** in `docs/plans/` (00-shared through 05-nfc) for reference

## Next Session — Potential Work

### Polish & Testing
- [ ] Start the dev server and visually test each page in browser
- [ ] Test responsive breakpoints (mobile, tablet, desktop)
- [ ] Test dark theme on public profile page
- [ ] Test all dashboard CRUD operations (add/delete/toggle links, save profile)
- [ ] Test auth flow (register → login → dashboard)

### Feature Gaps
- [ ] Theme selector on dashboard page currently uses old Bootstrap code — was removed; could re-add as custom component
- [ ] Drag-to-reorder links (currently visual only, no DnD library)
- [ ] NFC page is UI-only — no actual NFC pairing backend
- [ ] Social auth buttons (Google/Apple) are visual-only — no OAuth providers configured
- [ ] Analytics stats are hardcoded — no real analytics backend
- [ ] Preview "Mobile/Desktop" toggle is non-functional
- [ ] Copy URL button is non-functional

### Code Quality
- [ ] Run `npx next lint` and fix any issues
- [ ] Consider extracting DashPreview as a shared component if profile page needs it
- [ ] Add proper TypeScript types for API responses
- [ ] Remove `docs/plans/` if no longer needed (they're implementation reference docs)
