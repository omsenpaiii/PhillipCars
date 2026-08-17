"use server";

import { headers } from "next/headers";
import { clearSession, hashPassword } from "@/lib/auth";
import { query, withTransaction } from "@/lib/db";
import { createResetToken, hashRequestFingerprint, hashResetToken, RESET_REQUEST_LIMIT, RESET_TOKEN_TTL_MS, sendPasswordResetEmail } from "@/lib/password-reset";

const GENERIC_MESSAGE = "If an account exists for that email, a password reset link will arrive shortly.";

export async function requestPasswordResetAction(emailValue: string) {
  const email = emailValue.trim().toLowerCase();
  const headerStore = await headers();
  const fingerprint = hashRequestFingerprint(headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "unknown");
  const { token, hash } = createResetToken();
  try {
    const profile = await query<{ id: string; email: string; full_name: string | null }>("SELECT id, email, full_name FROM public.profiles WHERE lower(btrim(email)) = $1", [email]);
    if (profile.rows[0]) {
      const allowed = await withTransaction(async (client) => {
        const limit = await client.query<{ count: string }>(`SELECT count(*)::text AS count FROM public.password_reset_tokens WHERE created_at > now() - interval '1 hour' AND (profile_id = $1 OR request_fingerprint = $2)`, [profile.rows[0].id, fingerprint]);
        if (Number(limit.rows[0]?.count || 0) >= RESET_REQUEST_LIMIT) return false;
        await client.query("UPDATE public.password_reset_tokens SET used_at = now() WHERE profile_id = $1 AND used_at IS NULL", [profile.rows[0].id]);
        await client.query("INSERT INTO public.password_reset_tokens (profile_id, token_hash, request_fingerprint, expires_at) VALUES ($1, $2, $3, $4)", [profile.rows[0].id, hash, fingerprint, new Date(Date.now() + RESET_TOKEN_TTL_MS)]);
        return true;
      });
      if (allowed) {
        try { await sendPasswordResetEmail(profile.rows[0].email, profile.rows[0].full_name, token); }
        catch (error) { console.error("Password reset email delivery failed:", error instanceof Error ? error.message : "Unknown error"); await query("UPDATE public.password_reset_tokens SET used_at = now() WHERE token_hash = $1", [hash]); }
      }
    }
  } catch (error) {
    console.error("Password reset request failed:", error instanceof Error ? error.message : "Unknown error");
  }
  return { success: true, message: GENERIC_MESSAGE };
}

export async function resetPasswordAction(token: string, password: string, confirmation: string) {
  if (!token) return { success: false, error: "This reset link is invalid." };
  if (password !== confirmation) return { success: false, error: "Passwords do not match." };
  if (password.length < 8 || password.length > 128) return { success: false, error: "Password must be between 8 and 128 characters." };
  try {
    const result = await withTransaction(async (client) => {
      const tokenRow = await client.query<{ id: string; profile_id: string; expires_at: Date; used_at: Date | null }>("SELECT id, profile_id, expires_at, used_at FROM public.password_reset_tokens WHERE token_hash = $1 FOR UPDATE", [hashResetToken(token)]);
      const row = tokenRow.rows[0];
      if (!row) return "invalid" as const;
      if (row.used_at) return "used" as const;
      if (new Date(row.expires_at).getTime() <= Date.now()) return "expired" as const;
      await client.query("UPDATE public.profiles SET password_hash = $1, session_version = session_version + 1 WHERE id = $2", [hashPassword(password), row.profile_id]);
      await client.query("UPDATE public.password_reset_tokens SET used_at = now() WHERE profile_id = $1 AND used_at IS NULL", [row.profile_id]);
      return "success" as const;
    });
    if (result === "used") return { success: false, error: "This reset link has already been used." };
    if (result === "expired") return { success: false, error: "This reset link has expired. Request a new one." };
    if (result === "invalid") return { success: false, error: "This reset link is invalid." };
    await clearSession();
    return { success: true };
  } catch (error) {
    console.error("Password reset failed:", error instanceof Error ? error.message : "Unknown error");
    return { success: false, error: "We couldn’t reset your password right now. Please try again." };
  }
}
