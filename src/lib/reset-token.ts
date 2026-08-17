import crypto from "crypto";

export function createResetToken() {
  const token = crypto.randomBytes(32).toString("base64url");
  return { token, hash: hashResetToken(token) };
}

export function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function hashRequestFingerprint(value: string) {
  const secret = process.env.JWT_SECRET || "zoomli-local-reset-fingerprint";
  return crypto.createHmac("sha256", secret).update(value || "unknown").digest("hex");
}
