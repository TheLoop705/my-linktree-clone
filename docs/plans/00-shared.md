# Shared implementation rules (READ FIRST)

## Design source
- SCSS lives in `src/styles/` — **do NOT write new CSS files or inline `style=` blobs**. Use the existing SCSS classes.
- The canonical design is the bundle at `/tmp/linkhub-design/linkedtree/project/`. Match it visually, but **don't copy the prototype's inline `style={{}}` patterns** — every style you need is already in SCSS.
- The 4 shared React components are in `src/components/design/`: `Icon`, `Logo`, `NFCBand`, `MobileStatus`. Import these — don't re-implement.

## Must-keep behaviors
- Keep all existing API calls, NextAuth wiring, and Prisma queries exactly as they were before. You are replacing markup + classes, not business logic.
- Preserve `"use client"` pragmas where present.
- Toasts still come from `useToast` — keep those working.
- Form state (email/password/etc.) stays in React state; just swap markup.

## What to remove
- Any import of `@/components/ui/button`, `@/components/ui/card`, `@/components/ui/input`, `@/components/ui/label`, `@/components/ui/textarea`, `@/components/ui/switch` — replace with native elements + SCSS classes.
- Any `lucide-react` import — use `Icon.<Name>` from `@/components/design/Icon`.
- Any Bootstrap classes (`btn btn-primary`, `card`, `col-*`, `row`, `container`, `navbar`, `bi bi-*`, `form-control`, `form-switch`, `text-muted`, `d-flex`, `g-3`, etc.). Replace with the SCSS class names listed in each page plan.
- Any `bootstrap-icons` references.
- Tailwind utility classes like `text-gray-*`, `bg-gray-*`, `rounded`, `px-*`, `py-*`, `flex`, `grid-cols-*` — none of these exist in the SCSS.

## Class conventions
- Buttons: `btn btn-primary`, `btn btn-gradient`, `btn btn-ghost`, `btn btn-white`, `btn btn-glass`.
- Inputs: `<input class="input">`, `<label class="label">`.
- Inline prefix (e.g. `linkhub.to/...`): wrap `.input` in `.input-inline-prefix` with a `.prefix` span.
- Generic surface card: `.card`.
- Chip: `.chip` (optionally containing an `<Icon.Sparkle />`).
- Monospace text: `className="mono"`.
- Gradient text: `<span class="gradient-text">…</span>`.
- Toggle switch: `<button class="lh-toggle" data-on="true"><span class="lh-toggle__knob"/></button>`.

## Typography reminders
- Body font is Geist (loaded by `_base.scss`). **Don't set `fontFamily` anywhere.**
- Numbers in data contexts (URLs, serials, counts) use `className="mono"`.

## Icons quick ref
`Icon.Plus` · `Icon.Check` · `Icon.Arrow` · `Icon.ArrowUp` · `Icon.Link` · `Icon.Chart` · `Icon.Paint` · `Icon.Gear` · `Icon.Device` · `Icon.Grip` · `Icon.Eye` · `Icon.Copy` · `Icon.Sparkle` · `Icon.NFC` · `Icon.Globe` · `Icon.Pin` · `Icon.Trash` · `Icon.External`.

Each icon accepts a `size` prop (default 16 unless the icon overrides).

## Layout wrappers to use
- Marketing: `<div className="mkt">...</div>` at root of the page.
- Auth: `<div className="auth">` with `.auth-left` and `.auth-right` children.
- Dashboard: layout lives in `/dashboard/layout.tsx` and renders `<div className="dash" data-dash-theme="light">` wrapping `.dash-side` + `.dash-main`. Individual dashboard pages render only the `.dash-main__left` content; the right-rail preview lives in the layout.
- Public profile (`[slug]`): `<div className="profile" data-theme="{default|dark|gradient|minimal}">…</div>`.
- NFC setup: `<div className="nfc">…</div>` with `.nfc__frame` as the wizard container.

## Reference source files
When in doubt, open these files for the canonical structure (they are prototypes — copy the **visual layout**, not the inline styles):
- `/tmp/linkhub-design/linkedtree/project/marketing.jsx`
- `/tmp/linkhub-design/linkedtree/project/auth.jsx`
- `/tmp/linkhub-design/linkedtree/project/dashboard.jsx`
- `/tmp/linkhub-design/linkedtree/project/profile.jsx`
- `/tmp/linkhub-design/linkedtree/project/nfc.jsx`

## Done-criteria
- Page uses the class names in its plan.
- No Bootstrap / Tailwind / Shadcn imports remain.
- `npm run build` succeeds (will be verified after all pages land).
