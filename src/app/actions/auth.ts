"use server";

import crypto from "crypto";
import { query } from "@/lib/db";
import { hashPassword, verifyPassword, passwordNeedsUpgrade, createSession, clearSession, getSessionUser } from "@/lib/auth";

type AuthActionState = { success?: boolean; error?: string } | null;

interface ProfilePasswordRow {
  id: string;
  password_hash: string;
  session_version: number;
}

function normalizeEmail(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizePhone(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const compact = value.replace(/[\s()-]/g, "");
  if (/^04\d{8}$/.test(compact)) return `+61${compact.slice(1)}`;
  return compact;
}

function isValidAustralianPhone(phone: string | null): boolean {
  return phone === null || /^\+614\d{8}$/.test(phone);
}

function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}

export async function signUpAction(_prevState: AuthActionState, formData: FormData) {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("fullName") || "").trim();
  const phone = normalizePhone(formData.get("phone"));

  if (!email || !password || !fullName) {
    return { error: "Email, password, and full name are required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };
  if (fullName.length < 2 || fullName.length > 100) return { error: "Full name must be between 2 and 100 characters." };
  if (password.length < 8 || password.length > 128) return { error: "Password must be between 8 and 128 characters." };
  if (!isValidAustralianPhone(phone)) return { error: "Enter an Australian mobile number, such as +61 4XX XXX XXX." };

  try {
    const userId = crypto.randomUUID();
    const passwordHash = hashPassword(password);

    await query(
      "INSERT INTO public.profiles (id, email, full_name, phone, password_hash) VALUES ($1, $2, $3, $4, $5)",
      [userId, email, fullName, phone, passwordHash]
    );

    await createSession(userId);
    return { success: true };
  } catch (err: unknown) {
    console.error("Sign up error:", err);
    if (isUniqueViolation(err)) return { error: "An account with this email already exists." };
    return { error: "We couldn’t create your account right now. Please try again shortly." };
  }
}

export async function signInAction(_prevState: AuthActionState, formData: FormData) {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const res = await query<ProfilePasswordRow>("SELECT id, password_hash, session_version FROM public.profiles WHERE lower(btrim(email)) = $1", [email]);
    if (res.rows.length === 0) {
      return { error: "Invalid email or password." };
    }

    const user = res.rows[0];
    const isCorrect = verifyPassword(password, user.password_hash);
    if (!isCorrect) {
      return { error: "Invalid email or password." };
    }

    if (passwordNeedsUpgrade(user.password_hash)) {
      await query("UPDATE public.profiles SET password_hash = $1 WHERE id = $2", [hashPassword(password), user.id]);
    }

    await createSession(user.id, user.session_version ?? 0);
    return { success: true };
  } catch (err: unknown) {
    console.error("Sign in error:", err);
    return { error: "We couldn’t sign you in right now. Please try again shortly." };
  }
}

export async function signOutAction() {
  await clearSession();
  return { success: true };
}

export async function getCurrentUserAction() {
  return await getSessionUser();
}
