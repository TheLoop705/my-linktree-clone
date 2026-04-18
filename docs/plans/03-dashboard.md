# Plan: dashboard layout + pages

Reference: `/tmp/linkhub-design/linkedtree/project/dashboard.jsx`.
Read `docs/plans/00-shared.md` first.

## Files to edit
1. `src/app/dashboard/layout.tsx` — sidebar + outer grid.
2. `src/app/dashboard/page.tsx` — links-management inner content + right-rail preview.
3. `src/app/dashboard/profile/page.tsx` — profile settings (stays a two-column form layout; sidebar comes from layout).

## layout.tsx

Auth-guard unchanged. Replace markup with:

```
<div className="dash" data-dash-theme="light">
  <aside className="dash-side">
    <div className="dash-side__brand"><Logo size={24}/></div>

    <div className="dash-side__account">
      <div className="box">
        <div className="avatar">{(session.user?.email ?? "U")[0].toUpperCase()}</div>
        <div className="info">
          <div className="name">Your Hub</div>
          <div className="url mono">linkhub.to/{slug || "you"}</div>
        </div>
      </div>
    </div>

    <nav className="dash-side__nav">
      <Link href="/dashboard" aria-current={pathname === "/dashboard" || "false"}>
        <span className="ico"><Icon.Link size={16}/></span> Links
      </Link>
      <button><span className="ico"><Icon.Chart size={16}/></span> Analytics</button>
      <button><span className="ico"><Icon.Paint size={16}/></span> Appearance</button>
      <button><span className="ico"><Icon.NFC size={16}/></span> NFC Devices <span className="count">2</span></button>
      <Link href="/dashboard/profile" aria-current={pathname === "/dashboard/profile" || "false"}>
        <span className="ico"><Icon.Gear size={16}/></span> Settings
      </Link>
    </nav>

    <div className="dash-side__upgrade">
      <div className="eyebrow mono">UPGRADE</div>
      <div className="t">Go Pro for analytics</div>
      <div className="d">14-day free trial. Cancel anytime.</div>
      <button className="btn btn-gradient">Try Pro</button>
    </div>
  </aside>

  <div className="dash-main">
    {/* left column: page content */}
    <div className="dash-main__left">
      {children}
    </div>
    {/* right column: sign-out + simple account chip (kept simple — preview only shows on /dashboard) */}
    <div className="dash-main__right">
      <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", justifyContent: "flex-end", marginBottom: 16 }}>
        <span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>
          {session.user?.email}
        </span>
        <button className="btn btn-ghost" onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
      </div>
    </div>
  </div>
</div>
```

> The `.dash-main__right` is used by the dashboard page to render the live preview; the sign-out area above is a simple filler. Keep it as shown — if you prefer to push the preview into the layout, don't; the preview depends on the user's links and lives in the page component.

Imports for layout:
```ts
"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Logo } from "@/components/design/Logo";
import { Icon } from "@/components/design/Icon";
```

## page.tsx (links management)

Keep all data fetching, state, `useToast`, API calls — just swap markup.

Left column structure (`.dash-main__left`):

```
<div className="dash-header">
  <div>
    <div className="dash-header__eyebrow mono">LINKS</div>
    <h1>Your links</h1>
  </div>
  <div className="dash-header__actions">
    <button className="btn btn-ghost"><Icon.Eye size={14}/> Preview</button>
    <button className="btn btn-ghost"><Icon.Copy size={14}/> Copy URL</button>
    <button className="btn btn-primary" onClick={() => setIsAddingLink(true)}>
      <Icon.Plus size={14}/> Add link
    </button>
  </div>
</div>

<div className="dash-stats">
  {/* four cards: Page views / Link clicks / NFC taps / Click rate */}
  <div className="dash-stats__card">
    <div className="l">Page views</div>
    <div className="row">
      <div className="v">12,483</div>
      <div className="delta delta--up">+18.2%</div>
    </div>
    <div className="spark"><SparkSvg/></div>
  </div>
  {/* repeat */}
</div>
```

Spark SVG (reuse across the four):
```jsx
const SparkSvg = () => (
  <svg preserveAspectRatio="none" viewBox="0 0 100 20">
    <polyline fill="none" stroke="var(--indigo)" strokeWidth="1.2"
      points="0,15 10,12 20,13 30,9 40,11 50,7 60,8 70,5 80,6 90,3 100,2"/>
  </svg>
);
```

Use the real `userPage.links.length` for "Link clicks" placeholder numbers where possible; otherwise use static values from dashboard.jsx. These stats are read-only for MVP — hardcoded strings are fine.

Links list (`.dash-links`):
```
<div className="dash-links__head">
  <div className="t">{userPage?.links?.length ?? 0} links · drag to reorder</div>
  <div className="r mono">LAST 30 DAYS</div>
</div>
<div className="dash-links__list">
  {links.sort((a,b)=>a.position-b.position).map(l => (
    <div key={l.id} className="dash-links__item" data-inactive={!l.isActive}>
      <span className="grip"><Icon.Grip size={14}/></span>
      <div className="emoji" style={{ background: (l.color || "#6366f1")+"22", color: l.color || "#6366f1" }}>🔗</div>
      <div className="body">
        <div className="t">{l.title}</div>
        <div className="u mono">{l.url}</div>
      </div>
      <div className="clicks"><Icon.ArrowUp size={11}/> <span className="mono">{(l.clicks ?? 0).toLocaleString()}</span></div>
      <button
        className="lh-toggle"
        data-on={l.isActive ? "true" : "false"}
        onClick={() => toggleLinkStatus(l.id, !l.isActive)}
        aria-label="Toggle link"
      >
        <span className="lh-toggle__knob"/>
      </button>
      <button className="btn btn-ghost" style={{ padding: 6 }} onClick={() => deleteLink(l.id)}>
        <Icon.Trash size={14}/>
      </button>
    </div>
  ))}
  <button className="dash-links__add" onClick={() => setIsAddingLink(true)}>
    <Icon.Plus size={14}/> Add a new link
  </button>
</div>
```

Keep the "add link" form from the current implementation, but restyle with `.input`, `.label`, and `.btn btn-primary` / `.btn btn-ghost`. Put the form in a plain `<div className="card" style={{padding:20,marginTop:20}}>` when visible.

NFC devices block (static is fine; the data model doesn't have them yet):
```
<div className="dash-nfc">
  <div className="dash-nfc__head">
    <div className="t">Paired NFC devices</div>
    <button className="pair-btn">+ Pair new wristband</button>
  </div>
  <div className="dash-nfc__list">
    {/* two items — copy from dashboard.jsx DashNFC */}
  </div>
</div>
```

## Right column: live preview

Render this **inside the dashboard page component** (not layout) by rendering into the layout's right slot with a portal? Simplest: since layout renders `<div className="dash-main__right">` and we need the preview inside, instead move the right-column wrapper into the page and drop the filler. That means:

**Revise**: the layout should only render `.dash-side` and the `<main>` children — don't include `.dash-main` or right column wrapper. The page component owns both left and right columns:

In layout.tsx, replace the `.dash-main` block with just `<main>{children}</main>`. The *page* component then wraps in `.dash-main`:
```
return (
  <div className="dash-main">
    <div className="dash-main__left">…</div>
    <div className="dash-main__right"><DashPreview userPage={userPage}/></div>
  </div>
);
```

`DashPreview` body mirrors `dashboard.jsx::DashPreview`:
```
<div className="dash-preview">
  <div className="dash-preview__head">
    <div className="eyebrow mono">LIVE PREVIEW</div>
    <div className="seg">
      <button aria-pressed="true">Mobile</button>
      <button aria-pressed="false">Desktop</button>
    </div>
  </div>
  <div className="dash-preview__phone">
    <div className="screen">
      <div className="avatar">{initial}</div>
      <div className="name">{displayName}</div>
      <div className="role">Your link page</div>
      <div className="links">
        {activeLinks.slice(0,6).map(l => (
          <div key={l.id} className="item">
            <div className="emoji" style={{ background: (l.color||"#6366f1")+"22", color: l.color||"#6366f1" }}>🔗</div>
            <span>{l.title}</span>
          </div>
        ))}
      </div>
      <div className="foot">Powered by LinkHub</div>
    </div>
  </div>
  <div className="dash-preview__url">
    <Icon.Globe size={14}/> <span className="mono">linkhub.to/{slug}</span>
    <button>Copy</button>
  </div>
</div>
```

## dashboard/profile/page.tsx

Settings form layout. Keep all fetch/save logic. Replace markup:

```
<div className="dash-main">
  <div className="dash-main__left" style={{ padding: "20px 28px 32px" }}>
    <div className="dash-header">
      <div>
        <div className="dash-header__eyebrow mono">SETTINGS</div>
        <h1>Profile</h1>
      </div>
    </div>

    <div className="card" style={{ padding: 24, marginBottom: 16 }}>
      <h2 style={{ fontSize: 17, margin: "0 0 16px", fontWeight: 600 }}>Profile information</h2>
      {/* fields: displayName, bio (textarea), profession, location, websiteUrl, profileImageUrl */}
      {/* each: <div className="field"> <label className="label">…</label> <input className="input" …/> </div> */}
      <button type="submit" className="btn btn-primary">
        {isLoading ? "Saving…" : "Save changes"}
      </button>
    </div>

    <div className="card" style={{ padding: 24 }}>
      <h2 style={{ fontSize: 17, margin: "0 0 16px", fontWeight: 600 }}>Page settings</h2>
      {/* slug (disabled, with .input-inline-prefix), title, description (textarea), isPublic toggle */}
      {/* For the isPublic row, use .lh-toggle */}
      <button type="submit" className="btn btn-primary">
        {isLoadingPage ? "Saving…" : "Save settings"}
      </button>
    </div>
  </div>
  <div className="dash-main__right">
    <DashPreview userPage={pageSettings.asUserPage}/>  {/* optional — can render empty div if simpler */}
  </div>
</div>
```

If reusing DashPreview from the links page is awkward, it's fine to skip the preview on the profile page and leave `.dash-main__right` with just a placeholder helper card.

## Imports
```ts
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Icon } from "@/components/design/Icon";
```

## Remove
All `@/components/ui/*`, all `lucide-react`. No Bootstrap class names.
