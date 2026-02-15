"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>(
    {}
  );
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Registration Successful",
          description:
            data.message || "Please check your email to verify your account.",
        });
        router.push("/login");
      } else {
        if (data.errors) {
          setFieldErrors(data.errors);
          setError(data.message || "Please fix the validation errors");
        } else {
          setError(data.message || "Registration failed");
        }

        toast({
          title: "Registration Failed",
          description: data.message || "Registration failed",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Registration error", err);
      setError("An unexpected error occurred");
      setFieldErrors({});
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card card">
        <div className="card-header">
          <Link
            href="/"
            className="d-flex align-items-center justify-content-center text-decoration-none mb-3"
          >
            <i
              className="bi bi-link-45deg fs-2 me-2"
              style={{ color: "var(--lh-primary)" }}
            ></i>
            <span className="fw-bold fs-4" style={{ color: "var(--lh-dark)" }}>
              LinkHub
            </span>
          </Link>
          <h4 className="fw-bold mb-1">Create your account</h4>
          <p className="text-muted small mb-0">
            Enter your details to get started with LinkHub.
          </p>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-medium">
                Email address
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-envelope text-muted"></i>
                </span>
                <input
                  id="email"
                  type="email"
                  className={`form-control border-start-0 ps-0 ${fieldErrors.email ? "is-invalid" : ""}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  required
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.email && (
                <div className="text-danger small mt-1">
                  {fieldErrors.email.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-medium">
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-lock text-muted"></i>
                </span>
                <input
                  id="password"
                  type="password"
                  className={`form-control border-start-0 ps-0 ${fieldErrors.password ? "is-invalid" : ""}`}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.password ? (
                <div className="text-danger small mt-1">
                  {fieldErrors.password.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              ) : (
                <div className="form-text">
                  <i className="bi bi-info-circle me-1"></i>
                  Must be 8+ characters with uppercase, lowercase, and numbers
                </div>
              )}
            </div>

            <div className="mb-3">
              <label
                htmlFor="confirmPassword"
                className="form-label fw-medium"
              >
                Confirm Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-shield-lock text-muted"></i>
                </span>
                <input
                  id="confirmPassword"
                  type="password"
                  className="form-control border-start-0 ps-0"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small" role="alert">
                <i className="bi bi-exclamation-circle me-1"></i>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account <i className="bi bi-arrow-right ms-1"></i>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="card-footer">
          <span className="text-muted">Already have an account? </span>
          <Link
            href="/login"
            className="fw-semibold text-decoration-none"
            style={{ color: "var(--lh-primary)" }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
