# Plan: marketing / landing page (`src/app/page.tsx`)

Reference: `/tmp/linkhub-design/linkedtree/project/marketing.jsx`.
Read `docs/plans/00-shared.md` first.

## File to edit
- `src/app/page.tsx`

## Keep
- `"use client"` directive.
- `useSession()` from next-auth.
- Router-level `<Link>` from `next/link` for internal hrefs.

## Structure

```
<div className="mkt">
  <MarketingNav session={session} />
  <Hero session={session} />
  <LogoStrip />
  <Features />
  <HowItWorks />
  <Testimonials />
  <Pricing />
  <CTABand session={session} />
  <Footer />
</div>
```

Keep all sub-components **in this same file** (not extracted). The design already proved they work in one file.

## MarketingNav
```
<nav class="mkt-nav">
  <Logo />
  <div class="mkt-nav__links">
    <a>Product</a> <a>Wristbands</a> <a>Pricing</a> <a>Customers</a> <a>Changelog</a>
  </div>
  <div class="mkt-nav__actions">
    {session ? (
      <Link href="/dashboard" class="btn btn-primary">Go to dashboard <Icon.Arrow size={14}/></Link>
    ) : (
      <>
        <Link href="/login" class="signin-link">Sign in</Link>
        <Link href="/register" class="btn btn-primary">Get LinkHub <Icon.Arrow size={14}/></Link>
      </>
    )}
  </div>
</nav>
```

## Hero
Copy:
- Chip: `<Icon.Sparkle size={12}/> New · NFC wristband v2 now shipping`
- H1 (two lines): `One tap.\nEvery link.` — wrap "Every link." in `<span class="gradient-text">`.
- Lead: same as marketing.jsx hero lead paragraph.
- Actions:
  - `<Link class="btn btn-gradient">Claim your link <Icon.Arrow size={15}/></Link>` → `/register` (if no session) or `/dashboard` (if session).
  - `<button class="btn btn-ghost"><Icon.NFC size={15}/> See the wristband</button>`
- 3 proofs row (Free forever / No code / Ships worldwide). Use `.mkt-hero__proofs`.

Visual column (right): use `.mkt-hero-visual`. Build the phone + wristband + tap ripple with the exact element structure defined in `_marketing.scss` (search for `.mkt-hero-visual__phone`, `__band`, `__tap`). For the wristband use `<NFCBand size={260} floating glow={false}/>` inside `.mkt-hero-visual__band`.

Phone link items swatch colors (in order): `#6366f1`, `#ec4899`, `#06b6d4`, `#0b0b12`.

## LogoStrip
Class `.mkt-logos`. Eyebrow text `Trusted by 40,000+ creators at`. Brand list: `HELIX`, `NOVA/FM`, `Ashcroft &Co`, `ORBIT`, `fieldnotes`, `PARALLEL`, `Kite Studio`.

## Features (4 cards)
Class `.mkt-features`. Eyebrow `Why LinkHub` (`.mkt-eyebrow`). H2 `A link page you're proud to tap into existence.` (`.mkt-h2`).
Cards (icon / title / desc) — use the `Icon` mapping exactly as in marketing.jsx:
1. NFC — Tap to share
2. Paint — Beautiful themes
3. Chart — Real analytics
4. Sparkle — 60-second setup

## HowItWorks
Class `.mkt-how`. Center-aligned head. Three steps with the `.badge` containing `01 / 02 / 03`, plus the absolutely-positioned hairline `.mkt-how__line` between them.

## Testimonials
Class `.mkt-tests`. Three `<figure class="mkt-tests__card">`. Match quotes/names/roles/colors from marketing.jsx.

## Pricing
Class `.mkt-price`. Three tiers. The middle tier gets `.mkt-price__tier--featured` plus the `.popular` badge. Use the exact features arrays from marketing.jsx. CTA button classes: featured tier → `btn btn-gradient`, others → `btn btn-ghost`.

## CTABand
Class `.mkt-cta` > `.mkt-cta__inner` > `.mkt-cta__copy` + `.mkt-cta__actions`. Buttons: `btn btn-white` (Claim your link) and `btn btn-glass` (Order wristband).

## Footer
Class `.mkt-foot`. Columns: Product / Company / Resources / Legal (exact lists from marketing.jsx). Bottom row: `© 2026 LinkHub Labs, Inc. Made with tap.` and `v2.4.1 · All systems normal` (latter with `className="mono"`).

## Imports needed
```ts
"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Icon } from "@/components/design/Icon";
import { Logo } from "@/components/design/Logo";
import { NFCBand } from "@/components/design/NFCBand";
```

Do NOT import anything from `@/components/ui/*` or `lucide-react` or `react-bootstrap` etc.
