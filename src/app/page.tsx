"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border spinner-linkhub" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light navbar-linkhub sticky-top py-3">
        <div className="container">
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <i className="bi bi-link-45deg fs-3 me-2"></i>
            LinkHub
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center gap-2">
              {session ? (
                <li className="nav-item">
                  <Link href="/dashboard" className="btn btn-primary px-4">
                    Go to Dashboard <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link href="/login" className="nav-link fw-medium">
                      Sign In
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/register" className="btn btn-gradient px-4 py-2 rounded-pill">
                      Get Started Free
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 text-center text-lg-start">
              <div className="fade-in-up">
                <span className="badge rounded-pill bg-light text-dark px-3 py-2 mb-4 fw-medium">
                  <i className="bi bi-stars me-1 text-warning"></i> Free to use
                </span>
                <h1 className="hero-title mb-4">
                  One link to{" "}
                  <span className="gradient-text">rule them all</span>
                </h1>
                <p className="lead text-muted mb-5" style={{ maxWidth: "540px" }}>
                  Share all your important links in one beautiful, customizable
                  page. Perfect for social media bios, business cards, and
                  everywhere else you need to share multiple links.
                </p>

                {!session && (
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                    <Link
                      href="/register"
                      className="btn btn-gradient btn-lg px-5 py-3 rounded-pill"
                    >
                      Start For Free{" "}
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                    <Link
                      href="/login"
                      className="btn btn-outline-primary btn-lg px-5 py-3 rounded-pill"
                    >
                      Sign In
                    </Link>
                  </div>
                )}

                {session && (
                  <div>
                    <p className="text-muted mb-3">
                      Welcome back, <strong>{session.user?.email}</strong>
                    </p>
                    <Link
                      href="/dashboard"
                      className="btn btn-gradient btn-lg px-5 py-3 rounded-pill"
                    >
                      Go to Your Dashboard{" "}
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-5 d-none d-lg-block fade-in-up-delay-2">
              <div className="text-center">
                {/* Decorative phone mockup */}
                <div
                  className="mx-auto rounded-4 shadow-lg p-4"
                  style={{
                    maxWidth: "280px",
                    background: "white",
                    border: "8px solid #1e1b4b",
                    borderRadius: "2rem",
                  }}
                >
                  <div className="text-center mb-3">
                    <div
                      className="rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: "56px",
                        height: "56px",
                        background: "var(--lh-gradient)",
                      }}
                    >
                      <i className="bi bi-person-fill text-white fs-4"></i>
                    </div>
                    <h6 className="mb-0 fw-bold">@yourname</h6>
                    <small className="text-muted">Creator & Designer</small>
                  </div>
                  {["Portfolio", "YouTube", "Twitter", "Blog"].map(
                    (label, i) => (
                      <div
                        key={label}
                        className="rounded-3 p-2 mb-2 text-center fw-medium"
                        style={{
                          background:
                            i === 0
                              ? "var(--lh-gradient)"
                              : i === 1
                                ? "#fee2e2"
                                : i === 2
                                  ? "#dbeafe"
                                  : "#ecfdf5",
                          color: i === 0 ? "#fff" : "#333",
                          fontSize: "0.85rem",
                        }}
                      >
                        {label}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5 my-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-6 mb-3">
              Everything you need to{" "}
              <span className="text-gradient">share your world</span>
            </h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: "600px" }}>
              Powerful features to help you manage, customize, and track your
              online presence.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4 fade-in-up-delay-1">
              <div className="card feature-card h-100 p-4">
                <div className="card-body text-center">
                  <div className="feature-icon feature-icon-purple mx-auto mb-4">
                    <i className="bi bi-link-45deg"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Easy Link Management</h5>
                  <p className="text-muted mb-0">
                    Add, organize, and manage all your important links in one
                    place. Perfect for social media, portfolios, and business.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 fade-in-up-delay-2">
              <div className="card feature-card h-100 p-4">
                <div className="card-body text-center">
                  <div className="feature-icon feature-icon-pink mx-auto mb-4">
                    <i className="bi bi-palette-fill"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Beautiful Themes</h5>
                  <p className="text-muted mb-0">
                    Customize your page with beautiful themes and colors that
                    match your brand. Make your link page uniquely yours.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 fade-in-up-delay-3">
              <div className="card feature-card h-100 p-4">
                <div className="card-body text-center">
                  <div className="feature-icon feature-icon-cyan mx-auto mb-4">
                    <i className="bi bi-graph-up-arrow"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Analytics</h5>
                  <p className="text-muted mb-0">
                    Track clicks and visitor data to understand how people
                    interact with your links. Make data-driven decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="display-6 fw-bold mb-3">Ready to get started?</h2>
            <p className="lead opacity-75 mb-4 mx-auto" style={{ maxWidth: "500px" }}>
              Join thousands of creators, businesses, and influencers who trust
              LinkHub.
            </p>
            {!session && (
              <Link
                href="/register"
                className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-semibold"
              >
                Create Your Free Page{" "}
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-linkhub py-5 mt-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                <i className="bi bi-link-45deg fs-4 me-2"></i>
                <span className="fw-bold fs-5 text-white">LinkHub</span>
              </div>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <small>&copy; {new Date().getFullYear()} LinkHub. All rights reserved.</small>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
