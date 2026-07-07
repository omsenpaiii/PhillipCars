"use server";

import crypto from "crypto";
import { query } from "@/lib/db";
import { hashPassword, verifyPassword, createSession, clearSession, getSessionUser } from "@/lib/auth";

type AuthActionState = { success?: boolean; error?: string } | null;

interface ProfilePasswordRow {
  id: string;
  password_hash: string;
}

export async function signUpAction(_prevState: AuthActionState, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;

  if (!email || !password || !fullName) {
    return { error: "Email, password, and full name are required." };
  }

  try {
    // Check if user already exists
    const userCheck = await query<{ id: string }>("SELECT id FROM public.profiles WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return { error: "An account with this email already exists." };
    }

    const userId = crypto.randomUUID();
    const passwordHash = hashPassword(password);

    await query(
      "INSERT INTO public.profiles (id, email, full_name, phone, password_hash) VALUES ($1, $2, $3, $4, $5)",
      [userId, email, fullName, phone || null, passwordHash]
    );

    await createSession(userId);
    return { success: true };
  } catch (err: unknown) {
    console.error("Sign up error:", err);
    return { error: err instanceof Error ? err.message : "An error occurred during sign up." };
  }
}

export async function signInAction(_prevState: AuthActionState, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const res = await query<ProfilePasswordRow>("SELECT id, password_hash FROM public.profiles WHERE email = $1", [email]);
    if (res.rows.length === 0) {
      return { error: "Invalid email or password." };
    }

    const user = res.rows[0];
    const isCorrect = verifyPassword(password, user.password_hash);
    if (!isCorrect) {
      return { error: "Invalid email or password." };
    }

    await createSession(user.id);
    return { success: true };
  } catch (err: unknown) {
    console.error("Sign in error:", err);
    return { error: "An error occurred during sign in." };
  }
}

export async function signOutAction() {
  await clearSession();
  return { success: true };
}

export async function getCurrentUserAction() {
  return await getSessionUser();
}
