"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordResetAction, resetPasswordAction } from "@/app/actions/password-reset";

export function PasswordResetForm({ token }: { token?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isReset = Boolean(token);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    const result = isReset ? await resetPasswordAction(token!, password, confirmation) : await requestPasswordResetAction(email);
    if (!result.success) setError("error" in result ? result.error || "Something went wrong." : "Something went wrong.");
    else setMessage(isReset ? "Your password has been changed. You can now sign in." : "message" in result ? result.message : "Check your email.");
    setBusy(false);
  }

  return <div className="auth-card password-reset-card">
    <p className="legal-eyebrow">Secure account access</p>
    <h1>{isReset ? "Choose a new password" : "Forgot your password?"}</h1>
    <p>{isReset ? "Use a strong, unique password for your Zoomli account." : "Enter your registered email and we’ll send a secure 30-minute reset link."}</p>
    {error && <div className="alert alert-danger" role="alert">{error}</div>}
    {message && <div className="alert alert-success" role="status">{message}</div>}
    {!message || !isReset ? <form onSubmit={submit} aria-busy={busy}>
      {!isReset ? <label>Email address<input className="form-control" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label> : <>
        <label>New password<div className="password-field"><input className="form-control" type={visible ? "text" : "password"} autoComplete="new-password" minLength={8} maxLength={128} value={password} onChange={(e) => setPassword(e.target.value)} required /><button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? "Hide password" : "Show password"}><i className={`fa-solid ${visible ? "fa-eye-slash" : "fa-eye"}`} /></button></div></label>
        <label>Confirm new password<input className="form-control" type={visible ? "text" : "password"} autoComplete="new-password" minLength={8} maxLength={128} value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required /></label>
      </>}
      <button className="btn-default auth-submit" disabled={busy}>{busy ? "Please wait…" : isReset ? "Reset password" : "Send reset link"}</button>
    </form> : null}
    <Link href="/auth">Back to sign in</Link>
  </div>;
}
