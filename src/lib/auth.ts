import crypto from "crypto";
import { cookies } from "next/headers";
import { query } from "./db";

const COOKIE_NAME = "phillipcars_session";
const PASSWORD_ITERATIONS = 210_000;
const PASSWORD_KEY_LENGTH = 64;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production.");
  }
  return secret || "phillipcars_local_development_only";
}

export interface SessionPayload {
  userId: string;
  exp: number;
  sessionVersion: number;
}

export interface SessionUser {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string | Date;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, "sha512").toString("hex");
  return `pbkdf2_sha512:${PASSWORD_ITERATIONS}:${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;

  const parts = storedHash.split(":");
  const isCurrentFormat = parts.length === 4 && parts[0] === "pbkdf2_sha512";
  const iterations = isCurrentFormat ? Number(parts[1]) : 1000;
  const salt = isCurrentFormat ? parts[2] : parts[0];
  const hash = isCurrentFormat ? parts[3] : parts[1];

  if (!salt || !hash || !Number.isInteger(iterations) || iterations < 1) return false;

  const expectedHash = Buffer.from(hash, "hex");
  const testHash = crypto.pbkdf2Sync(password, salt, iterations, expectedHash.length, "sha512");
  return expectedHash.length === testHash.length && crypto.timingSafeEqual(expectedHash, testHash);
}

export function passwordNeedsUpgrade(storedHash: string): boolean {
  const parts = storedHash.split(":");
  return parts.length !== 4 || parts[0] !== "pbkdf2_sha512" || Number(parts[1]) < PASSWORD_ITERATIONS;
}

export function signToken(payload: SessionPayload): string {
  const jwtSecret = getJwtSecret();
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", jwtSecret)
    .update(`${header}.${data}`)
    .digest("base64url");
  return `${header}.${data}.${signature}`;
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const jwtSecret = getJwtSecret();
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, data, signature] = parts;
    const testSig = crypto
      .createHmac("sha256", jwtSecret)
      .update(`${header}.${data}`)
      .digest("base64url");
    const actualSignature = Buffer.from(signature);
    const expectedSignature = Buffer.from(testSig);
    if (
      actualSignature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(actualSignature, expectedSignature)
    ) return null;

    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as Partial<SessionPayload>;
    if (payload.exp && Date.now() > payload.exp) return null;
    if (!payload.userId || !payload.exp) return null;
    return { userId: payload.userId, exp: payload.exp, sessionVersion: payload.sessionVersion ?? 0 };
  } catch {
    return null;
  }
}

export async function createSession(userId: string, sessionVersion = 0) {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const token = signToken({ userId, exp, sessionVersion });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(exp),
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || !payload.userId) return null;

  try {
    const res = await query<SessionUser & { session_version: number }>(
      "SELECT id, email, full_name, phone, created_at, session_version FROM public.profiles WHERE id = $1",
      [payload.userId]
    );
    if (res.rows.length === 0) return null;
    const user = res.rows[0];
    if (payload.sessionVersion !== user.session_version) return null;
    return user;
  } catch (err) {
    console.error("Error fetching session user:", err);
    return null;
  }
}
