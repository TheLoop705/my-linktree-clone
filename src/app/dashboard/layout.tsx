"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Logo } from "@/components/design/Logo";
import { Icon } from "@/components/design/Icon";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          color: "var(--text-2)",
          fontSize: 14,
        }}
      >
        Loading…
      </div>
    );
  }

  const email = session.user?.email ?? "";
  const initial = (email[0] ?? "U").toUpperCase();
  const slug = email ? email.split("@")[0] : "you";

  const isLinksActive = pathname === "/dashboard";
  const isProfileActive = pathname === "/dashboard/profile";
  const isNfcActive = pathname === "/dashboard/nfc";

  return (
    <div className="dash" data-dash-theme="light">
      <aside className="dash-side">
        <div className="dash-side__brand">
          <Logo size={24} />
        </div>

        <div className="dash-side__account">
          <div className="box">
            <div className="avatar">{initial}</div>
            <div className="info">
              <div className="name">Your Hub</div>
              <div className="url mono">linkhub.to/{slug || "you"}</div>
            </div>
          </div>
        </div>

        <nav className="dash-side__nav">
          <Link
            href="/dashboard"
            aria-current={isLinksActive ? "true" : "false"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 10px",
              borderRadius: 8,
              textDecoration: "none",
              color: "inherit",
              fontSize: 13.5,
            }}
          >
            <span className="ico">
              <Icon.Link size={16} />
            </span>
            Links
          </Link>
          <button type="button">
            <span className="ico">
              <Icon.Chart size={16} />
            </span>
            Analytics
          </button>
          <button type="button">
            <span className="ico">
              <Icon.Paint size={16} />
            </span>
            Appearance
          </button>
          <Link
            href="/dashboard/nfc"
            aria-current={isNfcActive ? "true" : "false"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 10px",
              borderRadius: 8,
              textDecoration: "none",
              color: "inherit",
              fontSize: 13.5,
            }}
          >
            <span className="ico">
              <Icon.NFC size={16} />
            </span>
            NFC Devices
            <span className="count">2</span>
          </Link>
          <Link
            href="/dashboard/profile"
            aria-current={isProfileActive ? "true" : "false"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 10px",
              borderRadius: 8,
              textDecoration: "none",
              color: "inherit",
              fontSize: 13.5,
            }}
          >
            <span className="ico">
              <Icon.Gear size={16} />
            </span>
            Settings
          </Link>
        </nav>

        <div className="dash-side__upgrade">
          <div className="eyebrow mono">UPGRADE</div>
          <div className="t">Go Pro for analytics</div>
          <div className="d">14-day free trial. Cancel anytime.</div>
          <button type="button" className="btn btn-gradient">
            Try Pro
          </button>
        </div>
      </aside>

      <main
        style={{
          display: "contents",
        }}
      >
        {children}
        <div
          style={{
            position: "fixed",
            top: 12,
            right: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
            zIndex: 10,
          }}
        >
          <span
            className="mono"
            style={{ fontSize: 12, color: "var(--text-3)" }}
          >
            {email}
          </span>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ fontSize: 12, padding: "6px 10px" }}
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </button>
        </div>
      </main>
    </div>
  );
}
