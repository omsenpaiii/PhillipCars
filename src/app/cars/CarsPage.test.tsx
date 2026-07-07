import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";

// Mock globals for JSDOM
if (typeof globalThis.self === "undefined") {
  (globalThis as any).self = globalThis;
}
if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

import CarsPage from "./page";

const wait = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms));

const flushAllAsyncUpdates = async () => {
  // 3 cascade cycles to allow all chained setTimeouts and promises to settle
  for (let i = 0; i < 3; i++) {
    await act(async () => {
      await wait(50);
    });
  }
};

// Mock next/navigation with STABLE object reference
const mockGet = vi.fn().mockReturnValue(null);
const mockSearchParams = { get: mockGet };
vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
}));

// Mock Server Action
const mockGetCarsAction = vi.fn().mockImplementation(async () => {
  return {
    success: true,
    cars: [
      { id: "1", name: "Toyota Yaris 2017", price_per_day: "220", transmission: "auto", type: "sedan", status: "available" }
    ],
  };
});
vi.mock("../actions/cars", () => ({
  getCarsAction: (filters: any) => mockGetCarsAction(filters),
}));

// Mock Subcomponents
vi.mock("@/components/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));
vi.mock("@/components/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));
vi.mock("@/components/Motion", () => ({
  FadeIn: ({ children }: any) => <div>{children}</div>,
  FadeInStagger: ({ children }: any) => <div>{children}</div>,
  FadeInStaggerItem: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("@/components/FleetCard", () => ({
  default: ({ car }: any) => <div data-testid="fleet-card">{car.name}</div>,
}));

describe("CarsPage Search Behavior", () => {
  beforeEach(() => {
    mockGetCarsAction.mockClear();
    mockGet.mockReturnValue(null);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("should perform one database fetch on mount", async () => {
    render(<CarsPage />);

    // Wait for all updates
    await flushAllAsyncUpdates();

    // Should call getCarsAction once on load
    expect(mockGetCarsAction).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("fleet-card")).toBeDefined();
  });

  it("should NOT trigger database fetches while typing in the search input", async () => {
    render(<CarsPage />);

    await flushAllAsyncUpdates();

    expect(mockGetCarsAction).toHaveBeenCalledTimes(1);

    const searchInput = screen.getByPlaceholderText("Search name...") as HTMLInputElement;

    // Simulate rapid typing
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "t" } });
      await wait(10);
      fireEvent.change(searchInput, { target: { value: "te" } });
      await wait(10);
      fireEvent.change(searchInput, { target: { value: "tes" } });
      await wait(10);
      fireEvent.change(searchInput, { target: { value: "tesl" } });
      await wait(10);
      fireEvent.change(searchInput, { target: { value: "tesla" } });
    });

    // Wait to see if any deferred timer triggers a fetch
    await flushAllAsyncUpdates();

    // Confirm getCarsAction was NOT called again during or after typing
    expect(mockGetCarsAction).toHaveBeenCalledTimes(1);
    expect(searchInput.value).toBe("tesla");
  });

  it("should trigger a database fetch when the search form is submitted", async () => {
    render(<CarsPage />);

    await flushAllAsyncUpdates();

    expect(mockGetCarsAction).toHaveBeenCalledTimes(1);

    const searchInput = screen.getByPlaceholderText("Search name...") as HTMLInputElement;
    const form = searchInput.closest("form") as HTMLFormElement;

    // Type query
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "BMW" } });
      await wait(10);
    });

    // Submitting the form
    await act(async () => {
      fireEvent.submit(form);
    });

    // Wait for cascading fetch actions
    await flushAllAsyncUpdates();

    // getCarsAction should be called again
    expect(mockGetCarsAction).toHaveBeenCalledTimes(2);
    // Verified that it was called with the search filter
    expect(mockGetCarsAction).toHaveBeenLastCalledWith({
      type: "all",
      transmission: "all",
      maxPrice: 500,
      search: "BMW",
    });
  });
});
