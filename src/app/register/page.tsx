"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent, ChangeEvent } from "react";
import { Icon } from "@/components/design/Icon";
import { Logo } from "@/components/design/Logo";
import { NFCBand } from "@/components/design/NFCBand";

function AuthLeft() {
  return (
    <aside className="auth-left">
      <span className="auth-left__ring auth-left__ring--lg" aria-hidden />
      <span className="auth-left__ring auth-left__ring--md" aria-hidden />
      <span className="auth-left__ring auth-left__ring--sm" aria-hidden />
      <span className="auth-left__glow" aria-hidden />

      <Logo labelColor="#fff" />

      <div className="auth-left__content">
        <div className="auth-left__band">
          <div>
            <NFCBand size={260} glow={false} floating />
          </div>
        </div>
        <blockquote>
          &ldquo;I stopped carrying business cards two months ago. Every new
          contact starts with a tap.&rdquo;
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
  );
}

function SocialBtn({ provider }: { provider: "Google" | "Apple" }) {
  const isGoogle = provider === "Google";
  return (
    <button
      type="button"
      className="btn btn-ghost"
      style={{
        width: "100%",
        padding: "11px 14px",
        fontSize: 14,
        fontWeight: 500,
        justifyContent: "center",
        gap: 10,
      }}
    >
      {isGoogle ? (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.5 12.25c0-.8-.07-1.56-.2-2.3H12v4.35h5.9a5 5 0 0 1-2.2 3.3v2.75h3.56c2.08-1.92 3.28-4.75 3.28-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.45-.98 7.26-2.65l-3.55-2.75c-.98.66-2.24 1.05-3.7 1.05-2.85 0-5.26-1.92-6.12-4.5H2.22v2.84A11 11 0 0 0 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.88 14.15a6.6 6.6 0 0 1 0-4.2V7.11H2.22a11 11 0 0 0 0 9.88l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.55 4.2 1.65l3.15-3.15C17.45 2.1 14.97 1 12 1 7.7 1 3.99 3.47 2.22 7.1l3.66 2.85c.86-2.58 3.27-4.57 6.12-4.57z"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
      )}
      Continue with {provider}
    </button>
  );
}

export default function RegisterPage() {
  const [handle, setHandle] = useState("yourname");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="auth">
      <AuthLeft />
      <section className="auth-right">
        <div className="auth-right__toggle">
          <Link href="/login" className="btn btn-ghost">
            Sign in instead
          </Link>
        </div>

        <div className="auth-right__form">
          <h1 className="auth-right__title">Claim your link</h1>
          <p className="auth-right__sub">Free forever. No card required.</p>

          <div className="auth-right__socials">
            <SocialBtn provider="Google" />
            <SocialBtn provider="Apple" />
          </div>

          <div className="auth-right__divider">
            <div className="line" />
            <span className="mono">or with email</span>
            <div className="line" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label" htmlFor="handle">
                Your link
              </label>
              <div className="input-inline-prefix">
                <span className="prefix mono">linkhub.to/</span>
                <input
                  className="input"
                  id="handle"
                  value={handle}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setHandle(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                className="input"
                id="email"
                type="email"
                placeholder="you@studio.co"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                className="input"
                id="password"
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            <div className="field field--lg">
              <label className="label" htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                className="input"
                id="confirmPassword"
                type="password"
                placeholder="••••••••••"
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
              />
            </div>

            <button
              type="submit"
              className="btn btn-gradient"
              style={{ width: "100%", padding: "13px 18px" }}
            >
              Create account <Icon.Arrow size={14} />
            </button>
          </form>

          <p className="auth-right__terms">
            By continuing you agree to our <a>Terms</a> and{" "}
            <a>Privacy Policy</a>.
          </p>
        </div>

        <div className="auth-right__footer mono">
          🔒 Demo mode · No real sign-up required
        </div>
      </section>
    </div>
  );
}
