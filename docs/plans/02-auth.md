# Plan: auth pages (`src/app/login/page.tsx` + `src/app/register/page.tsx`)

Reference: `/tmp/linkhub-design/linkedtree/project/auth.jsx`.
Read `docs/plans/00-shared.md` first.

The design's `AuthPage` is a single split-screen with a login ↔ register toggle. Our Next.js app has **two** separate routes. Implement the same visual, but each route pre-selects its mode and the header "switch mode" button navigates to the other route.

## Both routes share this skeleton

```
<div className="auth">
  <AuthLeft />
  <section className="auth-right">
    <div className="auth-right__toggle">
      <Link href={isLogin ? "/register" : "/login"} className="btn btn-ghost">
        {isLogin ? "Create account" : "Sign in instead"}
      </Link>
    </div>

    <div className="auth-right__form">
      <h1 className="auth-right__title">{isLogin ? "Welcome back" : "Claim your link"}</h1>
      <p className="auth-right__sub">{isLogin ? "Sign in to your LinkHub dashboard." : "Free forever. No card required."}</p>

      <div className="auth-right__socials">
        <SocialBtn provider="Google"/>
        <SocialBtn provider="Apple"/>
      </div>

      <div className="auth-right__divider">
        <div className="line"/> <span className="mono">or with email</span> <div className="line"/>
      </div>

      {/* fields */}

      <button className="btn btn-gradient" style={{ width: "100%", padding: "13px 18px" }}>
        {isLogin ? "Sign in" : "Create account"} <Icon.Arrow size={14}/>
      </button>

      <p className="auth-right__terms">
        By continuing you agree to our <a>Terms</a> and <a>Privacy Policy</a>.
      </p>
    </div>

    <div className="auth-right__footer mono">🔒 SOC 2 Type II · Data encrypted end-to-end</div>
  </section>
</div>
```

## AuthLeft (shared component, defined inline in both files — no extraction needed)

```
<aside className="auth-left">
  <span className="auth-left__ring auth-left__ring--lg" aria-hidden/>
  <span className="auth-left__ring auth-left__ring--md" aria-hidden/>
  <span className="auth-left__ring auth-left__ring--sm" aria-hidden/>
  <span className="auth-left__glow" aria-hidden/>

  <Logo labelColor="#fff"/>

  <div className="auth-left__content">
    <div className="auth-left__band">
      <div><NFCBand size={260} glow={false} floating/></div>
    </div>
    <blockquote>
      "I stopped carrying business cards two months ago. Every new contact starts with a tap."
    </blockquote>
    <div className="auth-left__cite">
      <div className="avatar">J</div>
      <div>
        <div className="name">Jordan Reyes</div>
        <div className="role">Founder · Helix Studio</div>
      </div>
    </div>
  </div>
</aside>
```

## Fields — login
```
<div className="field">
  <label className="label" htmlFor="email">Email</label>
  <input className="input" id="email" type="email" placeholder="you@studio.co" …/>
</div>
<div className="field field--lg">
  <div className="field-row">
    <label className="label" htmlFor="password">Password</label>
    <a className="forgot-link">Forgot?</a>
  </div>
  <input className="input" id="password" type="password" placeholder="••••••••••" …/>
</div>
```

## Fields — register (prepend a handle field)
```
<div className="field">
  <label className="label">Your link</label>
  <div className="input-inline-prefix">
    <span className="prefix mono">linkhub.to/</span>
    <input className="input" defaultValue="yourname"/>
  </div>
</div>
```
…then email + password (no "Forgot" link; add a second password confirm field with `className="input"` and `htmlFor="confirmPassword"`), plus inline validation `<div class="text-danger small">` style errors should be swapped to `<div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>…</div>` (simple inline color) since we don't have a dedicated error class yet.

## SocialBtn
```
function SocialBtn({ provider }) {
  const isGoogle = provider === "Google";
  return (
    <button type="button" className="btn btn-ghost" style={{ width: "100%", padding: "11px 14px", fontSize: 14, fontWeight: 500, justifyContent: "center", gap: 10 }}>
      {/* SVG from auth.jsx — copy the <svg>s verbatim */}
      Continue with {provider}
    </button>
  );
}
```
Copy the two `<svg>` blocks (Google multi-color + Apple mono) directly from `auth.jsx` lines ~155–164.

## Keep
- All form state (`useState` for email, password, etc.).
- `signIn("credentials", ...)` in login.
- POST `/api/auth/register` in register.
- Toast calls on success/failure.
- `router.push` after success.
- Loading states — display a spinner inside the submit button or just switch copy ("Signing in…" / "Creating account…").

## Imports
```ts
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";       // login only
import { useState, FormEvent, ChangeEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { Icon } from "@/components/design/Icon";
import { Logo } from "@/components/design/Logo";
import { NFCBand } from "@/components/design/NFCBand";
```

## Remove
All imports from `@/components/ui/*`. Remove `bootstrap-icons` class usage.
