import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";

// Mock globals for JSDOM
if (typeof globalThis.self === "undefined") {
  (globalThis as any).self = globalThis;
}

import ListCarPage from "./page";

const wait = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms));

const flushAllAsyncUpdates = async () => {
  for (let i = 0; i < 3; i++) {
    await act(async () => {
      await wait(50);
    });
  }
};

// Mock next/navigation
const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// Mock Server Actions
const mockGetCurrentUserAction = vi.fn().mockResolvedValue({ id: "user-1", email: "user@test.com" });
vi.mock("../actions/auth", () => ({
  getCurrentUserAction: () => mockGetCurrentUserAction(),
}));

const mockListCarAction = vi.fn().mockResolvedValue({ success: true });
vi.mock("../actions/cars", () => ({
  listCarAction: (formData: FormData) => mockListCarAction(formData),
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
  ScaleIn: ({ children }: any) => <div>{children}</div>,
}));

describe("ListCarPage Custom Image URL Behavior", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockRefresh.mockClear();
    mockGetCurrentUserAction.mockClear();
    mockListCarAction.mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("should render Step 2 with custom image URL input", async () => {
    render(<ListCarPage />);
    await flushAllAsyncUpdates();

    // Click Next to go to Step 2
    const nextBtn = screen.getAllByText("Next Step")[0];
    fireEvent.click(nextBtn);

    // Verify step 2 content
    expect(screen.getByText("Select Car Template Styling")).toBeDefined();
    expect(screen.getByText("Or Provide a Custom Image URL")).toBeDefined();
    expect(screen.getByPlaceholderText("https://example.com/your-car.jpg")).toBeDefined();
    expect(screen.getByText("If provided, this URL will override the selected template.")).toBeDefined();
    expect(screen.getByText("Upload Your Car Image")).toBeDefined();
    expect(screen.getByLabelText("Upload Your Car Image")).toBeDefined();
  });

  it("should submit listCarAction with the selected template if custom image is empty", async () => {
    render(<ListCarPage />);
    await flushAllAsyncUpdates();

    // Fill Step 1
    const nameInput = screen.getByPlaceholderText("e.g. BMW M4 Coupe 2021") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "My Car Model" } });

    // Go to Step 2
    const nextBtn1 = screen.getAllByText("Next Step")[0];
    fireEvent.click(nextBtn1);

    // Click template BMW M2 Template image container
    const templateOption = screen.getByText("BMW M2 Template");
    fireEvent.click(templateOption);

    // Go to Step 3
    const nextBtn2 = screen.getAllByText("Next Step")[1];
    fireEvent.click(nextBtn2);

    // Fill Step 3
    const pricePerDayInput = screen.getByPlaceholderText("e.g. 250") as HTMLInputElement;
    fireEvent.change(pricePerDayInput, { target: { value: "300" } });
    const rentToOwnInput = screen.getByPlaceholderText("e.g. 750") as HTMLInputElement;
    fireEvent.change(rentToOwnInput, { target: { value: "800" } });

    // Submit form
    const submitBtn = screen.getByText("List Vehicle Now");
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await flushAllAsyncUpdates();

    expect(mockListCarAction).toHaveBeenCalledTimes(1);
    const passedFormData = mockListCarAction.mock.calls[0][0] as FormData;
    expect(passedFormData.get("image")).toBe("/images/perfect-fleet-img-1.png");
  });

  it("should submit listCarAction with the custom image URL overriding the template", async () => {
    render(<ListCarPage />);
    await flushAllAsyncUpdates();

    // Fill Step 1
    const nameInput = screen.getByPlaceholderText("e.g. BMW M4 Coupe 2021") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "Custom Styled Car" } });

    // Go to Step 2
    const nextBtn1 = screen.getAllByText("Next Step")[0];
    fireEvent.click(nextBtn1);

    // Fill Custom Image URL
    const customImageInput = screen.getByPlaceholderText("https://example.com/your-car.jpg") as HTMLInputElement;
    fireEvent.change(customImageInput, { target: { value: "  https://example.com/custom.png  " } });

    // Go to Step 3
    const nextBtn2 = screen.getAllByText("Next Step")[1];
    fireEvent.click(nextBtn2);

    // Fill Step 3
    const pricePerDayInput = screen.getByPlaceholderText("e.g. 250") as HTMLInputElement;
    fireEvent.change(pricePerDayInput, { target: { value: "450" } });
    const rentToOwnInput = screen.getByPlaceholderText("e.g. 750") as HTMLInputElement;
    fireEvent.change(rentToOwnInput, { target: { value: "1200" } });

    // Submit form
    const submitBtn = screen.getByText("List Vehicle Now");
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await flushAllAsyncUpdates();

    expect(mockListCarAction).toHaveBeenCalledTimes(1);
    const passedFormData = mockListCarAction.mock.calls[0][0] as FormData;
    expect(passedFormData.get("image")).toBe("https://example.com/custom.png");
  });
});
