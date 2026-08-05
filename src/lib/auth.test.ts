import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("./db", () => ({ query: vi.fn() }));

import { hashPassword, passwordNeedsUpgrade, signToken, verifyPassword, verifyToken } from "./auth";

describe("authentication primitives", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-only-secret-with-enough-entropy";
  });

  it("hashes new passwords with the current work factor", () => {
    const stored = hashPassword("SecurePass123!");

    expect(stored).toMatch(/^pbkdf2_sha512:210000:/);
    expect(verifyPassword("SecurePass123!", stored)).toBe(true);
    expect(verifyPassword("wrong-password", stored)).toBe(false);
    expect(passwordNeedsUpgrade(stored)).toBe(false);
  });

  it("accepts legacy hashes and marks them for upgrade", async () => {
    const crypto = await import("crypto");
    const salt = "0123456789abcdef0123456789abcdef";
    const hash = crypto.pbkdf2Sync("LegacyPass123", salt, 1000, 64, "sha512").toString("hex");
    const stored = `${salt}:${hash}`;

    expect(verifyPassword("LegacyPass123", stored)).toBe(true);
    expect(passwordNeedsUpgrade(stored)).toBe(true);
  });

  it("rejects tampered and expired session tokens", () => {
    const valid = signToken({ userId: "user-123", exp: Date.now() + 60_000 });
    expect(verifyToken(valid)?.userId).toBe("user-123");
    expect(verifyToken(`${valid.slice(0, -1)}x`)).toBeNull();

    const expired = signToken({ userId: "user-123", exp: Date.now() - 1 });
    expect(verifyToken(expired)).toBeNull();
  });
});
