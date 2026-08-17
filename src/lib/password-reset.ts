import "server-only";
import { Resend } from "resend";
import { BRAND, getSiteUrl } from "@/lib/brand";
export { createResetToken, hashRequestFingerprint, hashResetToken } from "@/lib/reset-token";

export const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;
export const RESET_REQUEST_LIMIT = 3;

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]!);
}

export async function sendPasswordResetEmail(email: string, name: string | null, token: string) {
  if (!process.env.RESEND_API_KEY) throw new Error("Password reset email is not configured.");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const url = `${getSiteUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  const greeting = name ? `Hi ${escapeHtml(name)},` : "Hello,";
  return resend.emails.send({
    from: process.env.EMAIL_FROM || `${BRAND.name} <support@phillipcars.com>`,
    to: email,
    subject: "Reset your Zoomli password",
    html: `<div style="background:#f8f3ef;padding:40px 16px;font-family:Arial,sans-serif;color:#171717"><div style="max-width:560px;margin:auto;background:#fff;border-radius:20px;padding:36px"><p style="color:#ff3600;font-weight:800;letter-spacing:.12em">ZOOMLI</p><h1 style="font-size:28px">Reset your password</h1><p>${greeting}</p><p>We received a request to reset your Zoomli password. This secure link expires in 30 minutes and can only be used once.</p><p style="margin:30px 0"><a href="${url}" style="background:#ff3600;color:#fff;text-decoration:none;padding:14px 24px;border-radius:999px;font-weight:700">Choose a new password</a></p><p>If you did not request this, you can safely ignore this email.</p><p style="font-size:13px;color:#666">Zoomli · Melbourne, Victoria, Australia</p></div></div>`,
    text: `Reset your Zoomli password using this link (valid for 30 minutes): ${url}`,
  });
}
