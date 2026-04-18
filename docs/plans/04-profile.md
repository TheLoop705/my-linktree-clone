# Plan: public profile page (`src/app/[slug]/page.tsx`)

Reference: `/tmp/linkhub-design/linkedtree/project/profile.jsx`.
Read `docs/plans/00-shared.md` first.

## File
`src/app/[slug]/page.tsx` (server component — keeps Prisma query).

## Data handling
- `getPageData(slug)` stays exactly as is — no changes to the DB call.
- `notFound()` on missing.
- `generateMetadata` stays.

## Theme resolution
- Current DB stores `theme?.themeName`: `"default" | "dark" | "gradient" | "minimal"`.
- Default to `"default"` if missing.

## Structure
```
<div className="profile" data-theme={themeName}>
  {themeName === "dark" && (
    <div className="profile__blobs" aria-hidden>
      <span className="blob blob--pink"/>
      <span className="blob blob--indigo"/>
      <span className="blob blob--cyan"/>
    </div>
  )}

  <div className="profile__inner">
    <div className="profile__avatar">
      {profile?.profileImageUrl
        ? <img src={profile.profileImageUrl} alt=""/>
        : <span>{initial}</span>}
    </div>

    <div className="profile__meta">
      <div className="name">{title || profile?.displayName || user.email}</div>
      {profile?.profession && <div className="role">{profile.profession}</div>}
      {profile?.location && (
        <div className="loc"><Icon.Pin size={12}/> {profile.location}</div>
      )}
      {(description || profile?.bio) && <p className="bio">{description || profile?.bio}</p>}
    </div>

    <div className="profile__links">
      {links.map(l => (
        <Link
          key={l.id}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className="link-card"
        >
          <div className="link-card__emoji" style={{ background: "var(--indigo-100)", color: "var(--indigo-600)" }}>
            <Icon.Link size={16}/>
          </div>
          <div className="link-card__body">
            <div className="t">{l.title}</div>
            {l.description && <div className="s">{l.description}</div>}
          </div>
          <div className="link-card__arrow"><Icon.Arrow size={14}/></div>
        </Link>
      ))}
      {links.length === 0 && (
        <div style={{ textAlign: "center", padding: "32px 0", opacity: 0.7, fontSize: 13 }}>
          No links yet — check back soon.
        </div>
      )}
    </div>

    <div className="profile__footer">
      <span className="mark" aria-hidden/>
      Powered by <strong>LinkHub</strong>
    </div>
  </div>
</div>
```

Notes on per-theme details (SCSS already handles these):
- `default`: emoji chip already colored by inline style; keep as above.
- `dark`: the `.profile__blobs` element is required so the glow shows.
- `gradient`: the pill-shaped link cards hide the `.s` sub-label automatically (SCSS rule). Render it anyway — CSS hides it.
- `minimal`: emoji hidden, sub-text shown in mono/uppercase (SCSS handles it). The bio text uses the current bio copy as-is.

## Imports
```ts
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Icon } from "@/components/design/Icon";
```

## Remove
- `@/components/ui/card`, `@/components/ui/button`.
- `lucide-react`.
- Bootstrap / bootstrap-icons class names.
