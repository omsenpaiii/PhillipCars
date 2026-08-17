"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInAction, signUpAction } from "../actions/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ScaleIn } from "@/components/Motion";
import BrandedLoader from "@/components/BrandedLoader";
import Link from "next/link";

function AuthFormContent() {
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "true";
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(
    isRegistered ? "Account created successfully! Please login." : null
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const router = useRouter();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      if (tab === "login") {
        const res = await signInAction(null, formData);
        if (res?.error) {
          setError(res.error);
        } else {
          setSuccess("Login successful! Redirecting...");
          setTimeout(() => {
            router.push(redirectTo);
            router.refresh();
          }, 1000);
        }
      } else {
        const res = await signUpAction(null, formData);
        if (res?.error) {
          setError(res.error);
        } else {
          setSuccess("Account registered! Logging you in...");
          setTimeout(() => {
            router.push(redirectTo);
            router.refresh();
          }, 1000);
        }
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-section auth-section"
      style={{
        margin: "120px auto 60px",
        padding: "80px 0",
        backgroundColor: "var(--secondary-color)",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            <ScaleIn>
              <div
                className="auth-card"
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "24px",
                  padding: "40px",
                  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.03)",
                  border: "1px solid var(--divider-color)",
                }}
              >
                {/* Tabs */}
                <div
                  role="tablist"
                  aria-label="Account access"
                  className="auth-tabs"
                  style={{
                    display: "flex",
                    marginBottom: "30px",
                    borderBottom: "2px solid var(--divider-color)",
                    paddingBottom: "10px",
                  }}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "login"}
                    aria-controls="auth-form-panel"
                    onClick={() => {
                      setTab("login");
                      setShowPassword(false);
                      setError(null);
                      setSuccess(null);
                    }}
                    style={{
                      flex: 1,
                      background: "none",
                      border: "none",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: tab === "login" ? "var(--accent-color)" : "var(--primary-color)",
                      cursor: "pointer",
                      paddingBottom: "10px",
                      borderBottom: tab === "login" ? "3px solid var(--accent-color)" : "none",
                      marginBottom: "-12px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "signup"}
                    aria-controls="auth-form-panel"
                    onClick={() => {
                      setTab("signup");
                      setShowPassword(false);
                      setError(null);
                      setSuccess(null);
                    }}
                    style={{
                      flex: 1,
                      background: "none",
                      border: "none",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: tab === "signup" ? "var(--accent-color)" : "var(--primary-color)",
                      cursor: "pointer",
                      paddingBottom: "10px",
                      borderBottom: tab === "signup" ? "3px solid var(--accent-color)" : "none",
                      marginBottom: "-12px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Title */}
                <div className="text-center mb-4">
                  <h2 style={{ fontSize: "28px", color: "var(--primary-color)" }}>
                    {tab === "login" ? "Welcome Back" : "Create Account"}
                  </h2>
                  <p style={{ color: "var(--text-color)", fontSize: "14px", marginTop: "5px" }}>
                    {tab === "login"
                      ? "Enter your credentials to access your booking dashboard"
                      : "Sign up to rent cars and access exclusive deals"}
                  </p>
                </div>

                {/* Message Banners */}
                {error && (
                  <div
                    role="alert"
                    className="alert alert-danger text-center"
                    style={{ borderRadius: "12px", fontSize: "14px", padding: "12px" }}
                  >
                    <i className="fa-solid fa-triangle-exclamation me-2"></i>
                    {error}
                  </div>
                )}

                {success && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="alert alert-success text-center"
                    style={{ borderRadius: "12px", fontSize: "14px", padding: "12px" }}
                  >
                    <i className="fa-solid fa-circle-check me-2"></i>
                    {success}
                  </div>
                )}

                {/* Form */}
                <form
                  id="auth-form-panel"
                  role="tabpanel"
                  aria-label={tab === "login" ? "Login form" : "Create account form"}
                  aria-busy={loading}
                  onSubmit={handleSubmit}
                  className="mt-4"
                >
                  {tab === "signup" && (
                    <>
                      <div className="form-group mb-3">
                        <label
                          htmlFor="auth-full-name"
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "var(--primary-color)",
                            marginBottom: "6px",
                          }}
                        >
                          Full Name
                        </label>
                        <input
                          id="auth-full-name"
                          type="text"
                          name="fullName"
                          autoComplete="name"
                          className="form-control"
                          placeholder="John Doe"
                          required
                          style={{ borderRadius: "10px", height: "48px", border: "1px solid var(--divider-color)" }}
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label
                          htmlFor="auth-phone"
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "var(--primary-color)",
                            marginBottom: "6px",
                          }}
                        >
                          Phone Number
                        </label>
                        <input
                          id="auth-phone"
                          type="tel"
                          name="phone"
                          className="form-control"
                          placeholder="+61 4XX XXX XXX"
                          inputMode="tel"
                          autoComplete="tel"
                          pattern="(?:\+61[ ]?|0)4[0-9 ]{8,11}"
                          title="Enter an Australian mobile number, such as +61 411 588 932"
                          style={{ borderRadius: "10px", height: "48px", border: "1px solid var(--divider-color)" }}
                        />
                      </div>
                    </>
                  )}

                  <div className="form-group mb-3">
                    <label
                      htmlFor="auth-email"
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--primary-color)",
                        marginBottom: "6px",
                      }}
                    >
                      Email Address
                    </label>
                    <input
                      id="auth-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      inputMode="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      className="form-control"
                      placeholder="email@example.com"
                      required
                      style={{ borderRadius: "10px", height: "48px", border: "1px solid var(--divider-color)" }}
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label
                      htmlFor="auth-password"
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--primary-color)",
                        marginBottom: "6px",
                      }}
                    >
                      Password
                    </label>
                    <div className="auth-password-field">
                      <input
                        id="auth-password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control"
                        placeholder="••••••••"
                        autoComplete={tab === "login" ? "current-password" : "new-password"}
                        aria-describedby={tab === "signup" ? "auth-password-hint" : undefined}
                        required
                        minLength={8}
                        maxLength={128}
                        onKeyUp={(event) => setCapsLockOn(event.getModifierState("CapsLock"))}
                        onBlur={() => setCapsLockOn(false)}
                      />
                      <button
                        type="button"
                        className="auth-password-toggle"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                        title={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((visible) => !visible)}
                      >
                        <i
                          className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    {tab === "signup" && (
                      <p id="auth-password-hint" className="auth-field-hint">
                        Use at least 8 characters.
                      </p>
                    )}
                    {capsLockOn && (
                      <p className="auth-caps-warning" role="status">
                        Caps Lock is on
                      </p>
                    )}
                  </div>

                  {tab === "login" && <div className="text-end mb-3"><Link href="/forgot-password" className="auth-forgot-link">Forgot your password?</Link></div>}

                  <button
                    type="submit"
                    disabled={loading}
                    aria-disabled={loading}
                    className="btn-default btn-no-overflow w-100"
                    style={{
                      height: "52px",
                      borderRadius: "100px",
                      marginRight: 0,
                      backgroundColor: loading ? "#cccccc" : "var(--accent-color)",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="auth-button-spinner" aria-hidden="true" />
                        {tab === "login" ? "Signing in…" : "Creating account…"}
                      </>
                    ) : tab === "login" ? "Sign In" : "Create Account"}
                  </button>
                </form>
              </div>
            </ScaleIn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={<BrandedLoader label="Loading authentication..." fullScreen={false} />}
      >
        <AuthFormContent />
      </Suspense>
      <Footer />
    </>
  );
}
