import { describe, expect, it } from "vitest";
import { getDefaultVehicleSearch, parseVehicleSearch, serializeVehicleSearch, validateVehicleSearch } from "./vehicle-search";

describe("vehicle search URL model", () => {
  const now = new Date("2026-08-17T12:00:00+10:00");

  it("round-trips every supported criterion", () => {
    const criteria = { ...getDefaultVehicleSearch(now), pickup: "st_kilda", dropoff: "geelong", type: "luxury", search: "BMW", transmission: "auto", maxPrice: 350, sort: "price-desc" as const };
    expect(parseVehicleSearch(serializeVehicleSearch(criteria), now)).toEqual(criteria);
  });

  it("rejects past and non-increasing journey dates", () => {
    const criteria = getDefaultVehicleSearch(now);
    expect(validateVehicleSearch({ ...criteria, pickupDate: "2026-08-16" }, now)).toMatch(/past/);
    expect(validateVehicleSearch({ ...criteria, returnDate: criteria.pickupDate }, now)).toMatch(/after/);
  });
});
