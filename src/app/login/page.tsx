"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        const errorMessage =
          result.error === "CredentialsSignin"
            ? "Invalid email or password."
            : result.error;
        setError(errorMessage);
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoading(false);
      } else if (result?.ok) {
        toast({
          title: "Login Successful",
          description: "You are now logged in.",
        });
        router.push("/");
      } else {
        setError("An unexpected error occurred during login.");
        toast({
          title: "Login Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login submit error", err);
      setError("An unexpected error occurred.");
      toast({
        title: "Login Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
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
          <h4 className="fw-bold mb-1">Welcome back</h4>
          <p className="text-muted small mb-0">
            Enter your credentials to access your account.
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
                  className="form-control border-start-0 ps-0"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  required
                  disabled={isLoading}
                />
              </div>
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
                  className="form-control border-start-0 ps-0"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
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
                  Logging in...
                </>
              ) : (
                <>
                  Sign In <i className="bi bi-arrow-right ms-1"></i>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="card-footer">
          <span className="text-muted">Don&apos;t have an account? </span>
          <Link
            href="/register"
            className="fw-semibold text-decoration-none"
            style={{ color: "var(--lh-primary)" }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
