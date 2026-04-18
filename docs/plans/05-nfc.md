# Plan: NFC onboarding page (`src/app/dashboard/nfc/page.tsx`)

Reference: `/tmp/linkhub-design/linkedtree/project/nfc.jsx`.
Read `docs/plans/00-shared.md` first.

This is a **new page** — there was no NFC flow before.

## File
Create `src/app/dashboard/nfc/page.tsx`. It lives under the dashboard layout (so the sidebar wraps it).

But: the design renders this standalone (no sidebar), since NFC setup is a focused wizard. To get the wizard full-width without the sidebar, use a **route group** or override:

Simplest approach: render the page inside `.dash-main__left` but style the inner wrapper so the wizard is centered. Skip the dashboard sidebar only if you feel strongly — for this pass, **keep the sidebar**; the wizard frame (`.nfc__frame`) handles its own focused layout.

## Page skeleton
```
"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/design/Icon";
import { NFCBand } from "@/components/design/NFCBand";

const STEPS = ["Welcome", "Choose band", "Tap to pair", "Name it", "Done"];

export default function NFCSetupPage() {
  const [step, setStep] = useState(1);
  const [band, setBand] = useState("silicone");
  const [name, setName] = useState("Rose silicone · everyday");

  return (
    <div className="nfc">
      <div className="nfc__stepper">
        {STEPS.map((s, i) => (
          <button key={s} aria-pressed={step === i+1} onClick={() => setStep(i+1)}>
            {i+1}. {s}
          </button>
        ))}
      </div>

      <div className="nfc__frame">
        <NFCShell
          step={step}
          total={STEPS.length}
          onBack={() => setStep(s => Math.max(1, s-1))}
          onNext={() => setStep(s => Math.min(STEPS.length, s+1))}
          nextLabel={step === 1 ? "Let's pair it" : step === 3 ? "I felt the tap" : undefined}
          hideNav={step === STEPS.length}
        >
          {step === 1 && <StepWelcome/>}
          {step === 2 && <StepPicker band={band} setBand={setBand}/>}
          {step === 3 && <StepTap/>}
          {step === 4 && <StepName name={name} setName={setName}/>}
          {step === 5 && <StepDone/>}
        </NFCShell>
      </div>
    </div>
  );
}
```

## NFCShell
```
function NFCShell({ step, total, onBack, onNext, nextLabel = "Continue", hideNav = false, children }) {
  return (
    <div className="nfc-shell">
      <div className="nfc-shell__topbar">
        <button className="back" data-hidden={step === 1} onClick={onBack}>← Back</button>
        <div className="count mono">{step} / {total}</div>
        <button className="skip">Skip</button>
      </div>
      <div className="nfc-shell__progress">
        <div className="nfc-shell__progress-fill" style={{ width: `${(step/total)*100}%` }}/>
      </div>
      <div className="nfc-shell__body">{children}</div>
      {!hideNav && (
        <div className="nfc-shell__nav">
          <button onClick={onNext} className="btn btn-gradient">
            {nextLabel} <Icon.Arrow size={14}/>
          </button>
        </div>
      )}
    </div>
  );
}
```

## Step 1 — Welcome
```
<div className="nfc-welcome">
  <div className="nfc-welcome__band"><NFCBand size={260} floating/></div>
  <div className="chip"><Icon.Sparkle size={12}/> Your wristband arrived</div>
  <h2>One last step.</h2>
  <p>Pair your LinkHub wristband to your account. It takes about 30 seconds — you just hold it near your phone.</p>
</div>
```

## Step 2 — Choose band
Array:
```
const BANDS = [
  { id: "silicone", name: "Silicone band", sub: "LH-S · soft, sweatproof", color: "#ec4899" },
  { id: "leather",  name: "Leather clip",  sub: "LH-L · premium",          color: "#8b5cf6" },
  { id: "card",     name: "Metal card",    sub: "LH-C · wallet-size",      color: "#0b0b12" },
  { id: "key",      name: "Keychain",      sub: "LH-K · compact",          color: "#06b6d4" },
];
```
```
<div className="nfc-picker">
  <h2>Which band do you have?</h2>
  <p>Check the packaging — the serial starts with these letters.</p>
  <div className="nfc-picker__list">
    {BANDS.map(b => (
      <button
        key={b.id}
        type="button"
        className="nfc-picker__item"
        data-selected={band === b.id}
        onClick={() => setBand(b.id)}
      >
        <div className="swatch" style={{ background: `linear-gradient(135deg, ${b.color}, #1a1a24)` }}/>
        <div className="info">
          <div className="n">{b.name}</div>
          <div className="m mono">{b.sub}</div>
        </div>
        <div className="check">{band === b.id && <Icon.Check size={11}/>}</div>
      </button>
    ))}
  </div>
</div>
```

## Step 3 — Tap to pair
```
<div className="nfc-tap">
  <h2>Hold it near your phone</h2>
  <p>Touch the band against the top-back of your phone. You'll feel a gentle haptic buzz.</p>
  <div className="nfc-tap__stage">
    <div className="nfc-tap__phone" aria-hidden/>
    <div className="nfc-tap__band"><NFCBand size={180} glow={false}/></div>
    <span className="pulse-ring"/>
    <span className="pulse-ring pulse-ring--indigo"/>
  </div>
  <div className="nfc-tap__listening">
    <span className="dot"/> Listening for your band…
  </div>
</div>
```

## Step 4 — Name it
```
<div className="nfc-name">
  <div className="nfc-name__ico"><Icon.NFC size={28}/></div>
  <h2>Name your band</h2>
  <p>Helpful if you own more than one. You can change it later.</p>
  <label className="label">Band nickname</label>
  <input className="input" value={name} onChange={e => setName(e.target.value)}/>
  <div className="nfc-name__serial mono">SERIAL · LH-2941-A</div>
  <div className="nfc-name__tip">
    <strong>Tip:</strong> each tap of this band is tracked separately, so you can see which wristband is driving visits.
  </div>
</div>
```

## Step 5 — Done (success)
```
<div className="nfc-done">
  <div className="nfc-done__confetti" aria-hidden>
    {Array.from({ length: 28 }).map((_, i) => {
      const colors = ["#6366f1", "#ec4899", "#06b6d4", "#f59e0b", "#10b981"];
      const size = i % 3 === 0 ? 8 : 5;
      return <i key={i} style={{
        left: `${(i*37)%100}%`,
        top: `${(i*53)%60}%`,
        width: size, height: size,
        background: colors[i%colors.length],
        borderRadius: i%2 === 0 ? "50%" : 2,
        transform: `rotate(${i*27}deg)`,
      }}/>;
    })}
  </div>
  <div className="nfc-done__body">
    <div className="nfc-done__check"><Icon.Check size={46}/></div>
    <h2>You're live.</h2>
    <p>Your band is paired. Try tapping it on a friend's phone — your LinkHub page will open instantly.</p>
    <div className="nfc-done__link">
      <Icon.Globe size={13}/>
      <span className="mono">linkhub.to/you</span>
    </div>
  </div>
  <div className="nfc-done__actions">
    <button className="btn btn-gradient">Share my LinkHub <Icon.Arrow size={14}/></button>
    <Link href="/dashboard" className="btn btn-ghost">Go to dashboard</Link>
  </div>
</div>
```

## Imports
```ts
"use client";
import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/design/Icon";
import { NFCBand } from "@/components/design/NFCBand";
```

## Sidebar link
After the layout shows an "NFC Devices" button in the dashboard sidebar, optionally wire it to `/dashboard/nfc` via `<Link href="/dashboard/nfc">`. Not required for this pass.
