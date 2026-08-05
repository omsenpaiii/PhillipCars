import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockQuery,
  mockCreateSession,
  mockHashPassword,
  mockVerifyPassword,
  mockPasswordNeedsUpgrade,
} = vi.hoisted(() => ({
  mockQuery: vi.fn(),
  mockCreateSession: vi.fn(),
  mockHashPassword: vi.fn(() => "new-password-hash"),
  mockVerifyPassword: vi.fn(() => true),
  mockPasswordNeedsUpgrade: vi.fn(() => false),
}));

vi.mock("@/lib/db", () => ({ query: mockQuery }));
vi.mock("@/lib/auth", () => ({
  hashPassword: mockHashPassword,
  verifyPassword: mockVerifyPassword,
  passwordNeedsUpgrade: mockPasswordNeedsUpgrade,
  createSession: mockCreateSession,
  clearSession: vi.fn(),
  getSessionUser: vi.fn(),
}));

import { signInAction, signUpAction } from "./auth";

function registrationForm(overrides: Record<string, string> = {}) {
  const values = {
    fullName: "Test Driver",
    phone: "+61 411 588 932",
    email: " DRIVER@EXAMPLE.COM ",
    password: "SecurePass123!",
    ...overrides,
  };
  const form = new FormData();
  Object.entries(values).forEach(([key, value]) => form.set(key, value));
  return form;
}

describe("auth server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuery.mockResolvedValue({ rows: [] });
  });

  it("normalizes Australian registration data and creates a session", async () => {
    const result = await signUpAction(null, registrationForm());

    expect(result).toEqual({ success: true });
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery.mock.calls[0][1].slice(1)).toEqual([
      "driver@example.com",
      "Test Driver",
      "+61411588932",
      "new-password-hash",
    ]);
    expect(mockCreateSession).toHaveBeenCalledOnce();
  });

  it("rejects invalid Australian phone numbers before querying", async () => {
    const result = await signUpAction(null, registrationForm({ phone: "+1 555 019 2834" }));

    expect(result).toEqual({ error: "Enter an Australian mobile number, such as +61 4XX XXX XXX." });
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("returns a stable duplicate-account message for unique violations", async () => {
    mockQuery.mockRejectedValue(Object.assign(new Error("duplicate"), { code: "23505" }));

    const result = await signUpAction(null, registrationForm());
    expect(result).toEqual({ error: "An account with this email already exists." });
  });

  it("normalizes login email and upgrades a legacy password hash", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ id: "user-1", password_hash: "legacy-hash" }] })
      .mockResolvedValueOnce({ rows: [] });
    mockPasswordNeedsUpgrade.mockReturnValueOnce(true);
    const form = new FormData();
    form.set("email", " DRIVER@EXAMPLE.COM ");
    form.set("password", "SecurePass123!");

    const result = await signInAction(null, form);

    expect(result).toEqual({ success: true });
    expect(mockQuery.mock.calls[0][1]).toEqual(["driver@example.com"]);
    expect(mockQuery.mock.calls[1][0]).toContain("UPDATE public.profiles");
    expect(mockCreateSession).toHaveBeenCalledWith("user-1");
  });
});
