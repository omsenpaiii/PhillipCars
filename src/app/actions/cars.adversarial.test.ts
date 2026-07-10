import { describe, it, expect, vi, beforeEach } from "vitest";
import { listCarAction } from "./cars";
import { query } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

vi.mock("@/lib/db", () => ({
  query: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  getSessionUser: vi.fn(),
}));

describe("listCarAction - Adversarial & Edge Case Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default logged in user mock
    vi.mocked(getSessionUser).mockResolvedValue({
      id: "test-host-123",
      email: "host@test.com",
      full_name: "Test Host",
      phone: null,
      created_at: new Date(),
    });
    // Default database query mock (resolves with empty result for success)
    vi.mocked(query).mockResolvedValue({ rows: [], rowCount: 0, command: "", oid: 0, fields: [] });
  });

  it("should successfully list a car with standard valid inputs", async () => {
    const formData = new FormData();
    formData.append("name", "Tesla Model S");
    formData.append("type", "luxury");
    formData.append("image", "/images/tesla.jpg");
    formData.append("price_per_day", "250");
    formData.append("rent_to_own_price", "1200");
    formData.append("doors", "4");
    formData.append("passengers", "5");
    formData.append("bags", "3");
    formData.append("transmission", "auto");
    formData.append("features", "Autopilot, Ludicrous Mode");

    const result = await listCarAction(formData);

    expect(result).toEqual({ success: true });
    expect(query).toHaveBeenCalledTimes(1);
    const sqlArgs = vi.mocked(query).mock.calls[0];
    expect(sqlArgs[1]).toEqual([
      "Tesla Model S",
      "luxury",
      "/images/tesla.jpg",
      250,
      1200,
      4,
      5,
      3,
      "auto",
      ["Autopilot", "Ludicrous Mode"],
      "test-host-123",
    ]);
  });

  it("should reject whitespace-only names", async () => {
    const formData = new FormData();
    formData.append("name", "   "); // Whitespace only name
    formData.append("type", "sedan");
    formData.append("image", "/images/car.jpg");
    formData.append("price_per_day", "150");
    formData.append("rent_to_own_price", "500");

    const result = await listCarAction(formData);

    expect(result).toEqual({
      success: false,
      error: "Please fill in all required fields with valid values.",
    });
    expect(query).not.toHaveBeenCalled();
  });

  it("should reject negative rates", async () => {
    const formData = new FormData();
    formData.append("name", "Cheap Car");
    formData.append("type", "sport");
    formData.append("image", "/images/car.jpg");
    formData.append("price_per_day", "-50"); // Negative price
    formData.append("rent_to_own_price", "0.01"); // Extremely low price
    
    const result = await listCarAction(formData);

    expect(result).toEqual({
      success: false,
      error: "Please enter non-negative rates.",
    });
    expect(query).not.toHaveBeenCalled();
  });

  it("should handle SQL injection strings safely without injecting syntax (ROBUST)", async () => {
    const maliciousName = "Tesla'; DROP TABLE public.cars; --";
    const formData = new FormData();
    formData.append("name", maliciousName);
    formData.append("type", "sedan");
    formData.append("image", "/images/car.jpg");
    formData.append("price_per_day", "150");
    formData.append("rent_to_own_price", "500");

    const result = await listCarAction(formData);

    expect(result.success).toBe(true);
    expect(query).toHaveBeenCalledTimes(1);
    // Verified that the malicious name is stored literally as a parameterized value, rendering SQL injection impossible.
    expect(vi.mocked(query).mock.calls[0][0]).toContain("INSERT INTO public.cars");
    expect(vi.mocked(query).mock.calls[0][1]?.[0]).toBe(maliciousName);
  });

  it("should reject whitespace-only image URLs", async () => {
    const formData = new FormData();
    formData.append("name", "No Image Car");
    formData.append("type", "sedan");
    formData.append("image", "   "); // Whitespace only image
    formData.append("price_per_day", "150");
    formData.append("rent_to_own_price", "500");

    const result = await listCarAction(formData);

    expect(result).toEqual({
      success: false,
      error: "Please fill in all required fields with valid values.",
    });
    expect(query).not.toHaveBeenCalled();
  });

  it("should handle extremely long field lengths without code crash (ROBUST/DB CAUGHT)", async () => {
    const extremelyLongUrl = "https://example.com/" + "a".repeat(10000) + ".jpg";
    const formData = new FormData();
    formData.append("name", "Long URL Car");
    formData.append("type", "sedan");
    formData.append("image", extremelyLongUrl);
    formData.append("price_per_day", "150");
    formData.append("rent_to_own_price", "500");

    const result = await listCarAction(formData);

    expect(result.success).toBe(true);
    expect(query).toHaveBeenCalledTimes(1);
    expect(vi.mocked(query).mock.calls[0][1]?.[2]).toBe(extremelyLongUrl);
  });
});
