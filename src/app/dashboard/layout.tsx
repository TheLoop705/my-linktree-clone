"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border spinner-linkhub" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-body">
      {/* Dashboard Navbar */}
      <nav className="navbar navbar-expand-lg dashboard-navbar sticky-top py-2">
        <div className="container-fluid px-3 px-lg-5">
          <Link
            href="/"
            className="navbar-brand d-flex align-items-center text-decoration-none"
          >
            <i
              className="bi bi-link-45deg fs-3 me-2"
              style={{ color: "var(--lh-primary)" }}
            ></i>
            <span className="fw-bold fs-5" style={{ color: "var(--lh-dark)" }}>
              LinkHub
            </span>
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#dashboardNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="dashboardNav">
            <ul className="navbar-nav me-auto ms-4">
              <li className="nav-item">
                <Link
                  href="/dashboard"
                  className="nav-link d-flex align-items-center fw-medium"
                >
                  <i className="bi bi-grid-1x2 me-2"></i>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/dashboard/profile"
                  className="nav-link d-flex align-items-center fw-medium"
                >
                  <i className="bi bi-gear me-2"></i>
                  Settings
                </Link>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-2"
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "var(--lh-gradient)",
                  }}
                >
                  <i className="bi bi-person-fill text-white small"></i>
                </div>
                <span className="text-muted small d-none d-md-inline">
                  {session.user?.email}
                </span>
              </div>
              <button
                className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container-fluid px-3 px-lg-5 py-4">{children}</main>
    </div>
  );
}
