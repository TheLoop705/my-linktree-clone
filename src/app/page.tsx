"use client";

import Link from "next/link";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { Icon } from "@/components/design/Icon";
import { Logo } from "@/components/design/Logo";
import { NFCBand } from "@/components/design/NFCBand";

export default function HomePage() {
  const { data: session } = useSession();

  return (
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
  );
}

function MarketingNav({ session }: { session: Session | null }) {
  return (
    <nav className="mkt-nav">
      <Logo />
      <div className="mkt-nav__links">
        <a>Product</a>
        <a>Wristbands</a>
        <a>Pricing</a>
        <a>Customers</a>
        <a>Changelog</a>
      </div>
      <div className="mkt-nav__actions">
        {session ? (
          <Link href="/dashboard" className="btn btn-primary">
            Go to dashboard <Icon.Arrow size={14} />
          </Link>
        ) : (
          <>
            <Link href="/login" className="signin-link">
              Sign in
            </Link>
            <Link href="/register" className="btn btn-primary">
              Get LinkHub <Icon.Arrow size={14} />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function Hero({ session }: { session: Session | null }) {
  const claimHref = session ? "/dashboard" : "/register";
  return (
    <section className="mkt-hero">
      <div className="mkt-hero__blob-pink" />
      <div className="mkt-hero__blob-indigo" />

      <div className="mkt-hero__grid">
        <div>
          <div className="chip">
            <Icon.Sparkle size={12} /> New · NFC wristband v2 now shipping
          </div>
          <h1 className="mkt-hero__title">
            One tap.
            <br />
            <span className="gradient-text">Every link.</span>
          </h1>
          <p className="mkt-hero__lead">
            LinkHub is the link-in-bio for creators, networkers and brands — paired with a physical NFC wristband that shares your whole world with a single tap.
          </p>
          <div className="mkt-hero__actions">
            <Link href={claimHref} className="btn btn-gradient">
              Claim your link <Icon.Arrow size={15} />
            </Link>
            <button type="button" className="btn btn-ghost">
              <Icon.NFC size={15} /> See the wristband
            </button>
          </div>
          <div className="mkt-hero__proofs">
            <div>
              <div className="top">Free forever</div>
              <div className="bot">Start in 60 seconds</div>
            </div>
            <div>
              <div className="top">No code</div>
              <div className="bot">Launch in a tap</div>
            </div>
            <div>
              <div className="top">Ships worldwide</div>
              <div className="bot">3-day delivery</div>
            </div>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  const swatchColors = ["#6366f1", "#ec4899", "#06b6d4", "#0b0b12"];
  const links = ["Portfolio", "Latest collection", "Book a call", "Instagram"];
  return (
    <div className="mkt-hero-visual">
      <div className="mkt-hero-visual__phone">
        <div className="mkt-hero-visual__phone-screen">
          <div className="mkt-hero-visual__phone-avatar">M</div>
          <div className="mkt-hero-visual__phone-name">Maya Okafor</div>
          <div className="mkt-hero-visual__phone-role">Designer · Brooklyn</div>
          <div className="mkt-hero-visual__phone-links">
            {links.map((label, i) => (
              <div key={label} className="item">
                <div
                  className="swatch"
                  style={{ background: swatchColors[i] }}
                />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mkt-hero-visual__band">
        <NFCBand size={260} floating glow={false} />
      </div>

      <div className="mkt-hero-visual__tap" />
    </div>
  );
}

function LogoStrip() {
  const brands = [
    "HELIX",
    "NOVA/FM",
    "Ashcroft &Co",
    "ORBIT",
    "fieldnotes",
    "PARALLEL",
    "Kite Studio",
  ];
  return (
    <div className="mkt-logos">
      <div className="mkt-logos__eyebrow mono">Trusted by 40,000+ creators at</div>
      <div className="mkt-logos__row">
        {brands.map((b) => (
          <span key={b}>{b}</span>
        ))}
      </div>
    </div>
  );
}

function Features() {
  const feats = [
    {
      icon: <Icon.NFC size={22} />,
      title: "Tap to share",
      desc: "One touch delivers your page to any phone — no app required. Works with every NFC-capable device.",
    },
    {
      icon: <Icon.Paint size={22} />,
      title: "Beautiful themes",
      desc: "Four curated themes, custom fonts, branded colors. Your page looks native on any device, not like a template.",
    },
    {
      icon: <Icon.Chart size={22} />,
      title: "Real analytics",
      desc: "See where every tap happened, what gets clicked, and which wristband drove the visit. Exportable.",
    },
    {
      icon: <Icon.Sparkle size={22} />,
      title: "60-second setup",
      desc: "Pair your wristband, drop in your links, done. No configuration, no domain setup, no IT team.",
    },
  ];
  return (
    <section className="mkt-features">
      <div className="mkt-features__head">
        <div className="mkt-eyebrow mono">Why LinkHub</div>
        <h2 className="mkt-h2">A link page you&apos;re proud to tap into existence.</h2>
      </div>
      <div className="mkt-features__grid">
        {feats.map((f) => (
          <div key={f.title} className="mkt-features__card">
            <div className="ico">{f.icon}</div>
            <div className="t">{f.title}</div>
            <div className="d">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Order your wristband",
      desc: "Silicone, leather, or clip-on. Ships in 3 days, preconfigured and ready to pair.",
    },
    {
      n: "02",
      title: "Set up your page",
      desc: "Pick a theme, drop in your links, add your bio. Takes less time than making coffee.",
    },
    {
      n: "03",
      title: "Tap to share",
      desc: "Touch the wristband to any phone. Your page opens instantly — no app, no friction.",
    },
  ];
  return (
    <section className="mkt-how">
      <div className="mkt-how__head">
        <div className="mkt-eyebrow mono">How it works</div>
        <h2 className="mkt-h2">From unboxing to first tap in three steps.</h2>
      </div>
      <div className="mkt-how__grid">
        <div className="mkt-how__line" />
        {steps.map((s) => (
          <div key={s.n} className="mkt-how__step">
            <div className="badge">
              <span>{s.n}</span>
            </div>
            <div className="t">{s.title}</div>
            <div className="d">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    {
      q: "I handed out 200 wristbands at a gallery opening and had 180 visits to my portfolio before I got home. Nothing else even comes close.",
      name: "Lena Morikawa",
      role: "Product photographer",
      initial: "L",
      color: "#ec4899",
    },
    {
      q: "Our reps wear the bands at trade shows. Leads doubled because people actually tap instead of taking a card and losing it.",
      name: "Priya Shah",
      role: "Head of Growth, FIELDHAND",
      initial: "P",
      color: "#6366f1",
    },
    {
      q: "Setup took four minutes. Honestly that's my whole review.",
      name: "Marcus Ellington",
      role: "DJ / Creator",
      initial: "M",
      color: "#06b6d4",
    },
  ];
  return (
    <section className="mkt-tests">
      <div className="mkt-tests__head">
        <div className="mkt-eyebrow mono">Loved by 40,000+</div>
        <h2 className="mkt-h2">Real creators. Real taps.</h2>
      </div>
      <div className="mkt-tests__grid">
        {quotes.map((q) => (
          <figure key={q.name} className="mkt-tests__card">
            <blockquote>&ldquo;{q.q}&rdquo;</blockquote>
            <figcaption>
              <div className="avatar" style={{ background: q.color }}>
                {q.initial}
              </div>
              <div>
                <div className="name">{q.name}</div>
                <div className="role">{q.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      cadence: "forever",
      desc: "Everything you need to claim your link.",
      feats: ["Unlimited links", "Four themes", "Basic analytics", "Community support"],
      cta: "Get started",
      featured: false,
    },
    {
      name: "Pro",
      price: "$6",
      cadence: "per month",
      desc: "For creators who want the full toolkit.",
      feats: [
        "Everything in Free",
        "Custom domain",
        "Advanced analytics",
        "Link scheduling",
        "1 NFC wristband included",
      ],
      cta: "Start 14-day trial",
      featured: true,
    },
    {
      name: "Business",
      price: "$18",
      cadence: "per seat / month",
      desc: "For teams, brands and events at scale.",
      feats: [
        "Everything in Pro",
        "Team workspace",
        "Bulk wristband orders",
        "API + webhooks",
        "Priority support",
      ],
      cta: "Talk to sales",
      featured: false,
    },
  ];
  return (
    <section className="mkt-price">
      <div className="mkt-price__head">
        <div className="mkt-eyebrow mono">Pricing</div>
        <h2 className="mkt-h2">Simple plans. No hidden taps.</h2>
      </div>
      <div className="mkt-price__grid">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`mkt-price__tier${t.featured ? " mkt-price__tier--featured" : ""}`}
          >
            {t.featured && <div className="popular">Most popular</div>}
            <div>
              <div className="name">{t.name}</div>
              <div className="price">
                <span className="amt">{t.price}</span>
                <span className="cadence">{t.cadence}</span>
              </div>
              <div className="desc">{t.desc}</div>
            </div>
            <div className="divider" />
            <ul>
              {t.feats.map((f) => (
                <li key={f}>
                  <div className="dot">
                    <Icon.Check size={11} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={t.featured ? "btn btn-gradient" : "btn btn-ghost"}
            >
              {t.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTABand({ session }: { session: Session | null }) {
  const claimHref = session ? "/dashboard" : "/register";
  return (
    <section className="mkt-cta">
      <div className="mkt-cta__inner">
        <div className="mkt-cta__copy">
          <h3>Your link, one tap away.</h3>
          <p>Claim yours free, or order a wristband and be live in three days.</p>
        </div>
        <div className="mkt-cta__actions">
          <Link href={claimHref} className="btn btn-white">
            Claim your link
          </Link>
          <button type="button" className="btn btn-glass">
            Order wristband
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols: Record<string, string[]> = {
    Product: ["Link pages", "NFC wristbands", "Themes", "Analytics", "Integrations"],
    Company: ["About", "Careers", "Blog", "Press kit", "Contact"],
    Resources: ["Help center", "Changelog", "Status", "API docs", "Community"],
    Legal: ["Privacy", "Terms", "Cookies", "Security", "DPA"],
  };
  return (
    <footer className="mkt-foot">
      <div className="mkt-foot__grid">
        <div>
          <Logo />
          <p className="mkt-foot__brand-blurb">
            The link-in-bio for people who still believe in showing up in person.
          </p>
        </div>
        {Object.entries(cols).map(([k, items]) => (
          <div key={k} className="mkt-foot__col">
            <h4>{k}</h4>
            <div>
              {items.map((i) => (
                <a key={i}>{i}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mkt-foot__bottom">
        <span>&copy; 2026 LinkHub Labs, Inc. Made with tap.</span>
        <span className="mono">v2.4.1 · All systems normal</span>
      </div>
    </footer>
  );
}
