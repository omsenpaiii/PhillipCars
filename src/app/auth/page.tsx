"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInAction, signUpAction } from "../actions/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ScaleIn } from "@/components/Motion";

function AuthFormContent() {
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "true";
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(
    isRegistered ? "Account created successfully! Please login." : null
  );
  const [loading, setLoading] = useState(false);
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
      className="bg-section"
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
                  style={{
                    display: "flex",
                    marginBottom: "30px",
                    borderBottom: "2px solid var(--divider-color)",
                    paddingBottom: "10px",
                  }}
                >
                  <button
                    onClick={() => {
                      setTab("login");
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
                    onClick={() => {
                      setTab("signup");
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
                    className="alert alert-danger text-center"
                    style={{ borderRadius: "12px", fontSize: "14px", padding: "12px" }}
                  >
                    <i className="fa-solid fa-triangle-exclamation me-2"></i>
                    {error}
                  </div>
                )}

                {success && (
                  <div
                    className="alert alert-success text-center"
                    style={{ borderRadius: "12px", fontSize: "14px", padding: "12px" }}
                  >
                    <i className="fa-solid fa-circle-check me-2"></i>
                    {success}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-4">
                  {tab === "signup" && (
                    <>
                      <div className="form-group mb-3">
                        <label
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
                          type="text"
                          name="fullName"
                          className="form-control"
                          placeholder="John Doe"
                          required
                          style={{ borderRadius: "10px", height: "48px", border: "1px solid var(--divider-color)" }}
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label
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
                          type="tel"
                          name="phone"
                          className="form-control"
                          placeholder="+1 (555) 019-2834"
                          style={{ borderRadius: "10px", height: "48px", border: "1px solid var(--divider-color)" }}
                        />
                      </div>
                    </>
                  )}

                  <div className="form-group mb-3">
                    <label
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
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="email@example.com"
                      required
                      style={{ borderRadius: "10px", height: "48px", border: "1px solid var(--divider-color)" }}
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--primary-color)",
                        marginBottom: "6px",
                      }}
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="••••••••"
                      required
                      style={{ borderRadius: "10px", height: "48px", border: "1px solid var(--divider-color)" }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-default btn-no-overflow w-100"
                    style={{
                      height: "52px",
                      borderRadius: "100px",
                      marginRight: 0,
                      backgroundColor: loading ? "#cccccc" : "var(--accent-color)",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? "Processing..." : tab === "login" ? "Sign In" : "Register"}
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
        fallback={
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "80vh", backgroundColor: "var(--secondary-color)", marginTop: "120px" }}
          >
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading Auth...</span>
            </div>
          </div>
        }
      >
        <AuthFormContent />
      </Suspense>
      <Footer />
    </>
  );
}
