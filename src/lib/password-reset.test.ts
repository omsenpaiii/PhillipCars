import { describe, expect, it } from "vitest";
import { createResetToken, hashResetToken } from "./reset-token";

describe("password reset token security", () => {
  it("creates distinct high-entropy tokens and stores deterministic hashes", () => {
    const first = createResetToken();
    const second = createResetToken();
    expect(first.token).not.toBe(second.token);
    expect(first.hash).toBe(hashResetToken(first.token));
    expect(first.hash).not.toContain(first.token);
    expect(first.hash).toMatch(/^[a-f0-9]{64}$/);
  });
});
