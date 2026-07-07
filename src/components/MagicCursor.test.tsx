import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, fireEvent, act, cleanup } from "@testing-library/react";

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

import MagicCursor from "./MagicCursor";

const wait = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock matchMedia
const createMatchMedia = (matchesMap: Record<string, boolean>) => {
  return (query: string) => ({
    matches: matchesMap[query] ?? false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
};

describe("MagicCursor component", () => {
  beforeEach(() => {
    // Default mock: desktop device (not coarse, no reduced motion)
    window.matchMedia = vi.fn().mockImplementation(
      createMatchMedia({
        "(pointer: coarse)": false,
        "(prefers-reduced-motion: reduce)": false,
      })
    );
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("should initially render null (before mounting)", () => {
    const { container } = render(<MagicCursor />);
    expect(container.firstChild).toBeNull();
  });

  it("should render cursor container after mounting on non-touch desktop device", async () => {
    const { container } = render(<MagicCursor />);
    
    // Wait for the mount setTimeout(..., 0)
    await act(async () => {
      await wait(20);
    });

    const cursorContainer = container.querySelector("#magic-cursor");
    expect(cursorContainer).not.toBeNull();
    const ball = container.querySelector("#ball");
    expect(ball).not.toBeNull();
  });

  it("should disable and return null on touch devices (pointer: coarse)", async () => {
    window.matchMedia = vi.fn().mockImplementation(
      createMatchMedia({
        "(pointer: coarse)": true,
        "(prefers-reduced-motion: reduce)": false,
      })
    );

    const { container } = render(<MagicCursor />);
    
    await act(async () => {
      await wait(20);
    });

    const cursorContainer = container.querySelector("#magic-cursor");
    expect(cursorContainer).toBeNull();
  });

  it("should disable and return null when prefers-reduced-motion is active", async () => {
    window.matchMedia = vi.fn().mockImplementation(
      createMatchMedia({
        "(pointer: coarse)": false,
        "(prefers-reduced-motion: reduce)": true,
      })
    );

    const { container } = render(<MagicCursor />);
    
    await act(async () => {
      await wait(20);
    });

    const cursorContainer = container.querySelector("#magic-cursor");
    expect(cursorContainer).toBeNull();
  });

  it("should react to mousemove events by showing cursor and updating cursor style", async () => {
    const { container } = render(<MagicCursor />);
    
    await act(async () => {
      await wait(20);
    });

    const cursorContainer = container.querySelector("#magic-cursor") as HTMLElement;
    expect(cursorContainer).not.toBeNull();
    
    // Initially visibility is false (opacity 0)
    expect(cursorContainer.style.opacity).toBe("0");

    // Simulate mouse movement and wait for state updates & requestAnimationFrame tick
    await act(async () => {
      fireEvent.mouseMove(window, { clientX: 100, clientY: 200 });
      await wait(30);
    });

    // Should become visible (opacity 1)
    expect(cursorContainer.style.opacity).toBe("1");
    // Direct position update using refs should have modified styles
    expect(cursorContainer.style.left).toBe("100px");
    expect(cursorContainer.style.top).toBe("200px");
  });

  it("should show custom text when hovering over data-cursor-text element", async () => {
    const { container } = render(<MagicCursor />);
    
    await act(async () => {
      await wait(20);
    });

    const ball = container.querySelector("#ball") as HTMLElement;
    expect(ball).not.toBeNull();
    expect(ball.textContent).toBe("");

    // Create target with data-cursor-text
    const hoverEl = document.createElement("div");
    hoverEl.setAttribute("data-cursor-text", "EXPLORE");
    document.body.appendChild(hoverEl);

    // Simulate moving mouse over hoverEl and wait for state update + render
    await act(async () => {
      fireEvent.mouseMove(hoverEl, { clientX: 150, clientY: 250 });
      await wait(30);
    });

    expect(ball.textContent).toBe("EXPLORE");
    // It should have custom size style
    expect(ball.style.width).toBe("75px");
    expect(ball.style.height).toBe("75px");

    // Cleanup DOM
    document.body.removeChild(hoverEl);
  });

  it("should apply opaque styles when hovering over data-cursor element", async () => {
    const { container } = render(<MagicCursor />);
    
    await act(async () => {
      await wait(20);
    });

    const ball = container.querySelector("#ball") as HTMLElement;
    expect(ball).not.toBeNull();

    // Create target with data-cursor
    const hoverEl = document.createElement("div");
    hoverEl.setAttribute("data-cursor", "true");
    document.body.appendChild(hoverEl);

    // Simulate moving mouse over hoverEl and wait
    await act(async () => {
      fireEvent.mouseMove(hoverEl, { clientX: 150, clientY: 250 });
      await wait(30);
    });

    expect(ball.textContent).toBe("");
    expect(ball.style.width).toBe("45px");
    expect(ball.style.height).toBe("45px");

    // Cleanup DOM
    document.body.removeChild(hoverEl);
  });

  it("should prioritize data-cursor-text over data-cursor if parent has both", async () => {
    const { container } = render(<MagicCursor />);
    
    await act(async () => {
      await wait(20);
    });

    const ball = container.querySelector("#ball") as HTMLElement;
    expect(ball).not.toBeNull();

    // Create element with both data-cursor and data-cursor-text
    const hoverEl = document.createElement("div");
    hoverEl.setAttribute("data-cursor", "true");
    hoverEl.setAttribute("data-cursor-text", "TEST");
    document.body.appendChild(hoverEl);

    await act(async () => {
      fireEvent.mouseMove(hoverEl, { clientX: 100, clientY: 100 });
      await wait(30);
    });

    expect(ball.textContent).toBe("TEST");
    expect(ball.style.width).toBe("75px");

    document.body.removeChild(hoverEl);
  });

  it("should reset custom cursor styles when mouse moves out of interactive elements", async () => {
    const { container } = render(<MagicCursor />);
    
    await act(async () => {
      await wait(20);
    });

    const ball = container.querySelector("#ball") as HTMLElement;
    expect(ball).not.toBeNull();

    const hoverEl = document.createElement("div");
    hoverEl.setAttribute("data-cursor-text", "HOVER");
    document.body.appendChild(hoverEl);

    // 1. Move in
    await act(async () => {
      fireEvent.mouseMove(hoverEl, { clientX: 100, clientY: 100 });
      await wait(30);
    });
    expect(ball.textContent).toBe("HOVER");

    // 2. Move out to a regular element
    const normalEl = document.createElement("div");
    document.body.appendChild(normalEl);

    await act(async () => {
      // Simulate pointerout from hoverEl to normalEl
      fireEvent.pointerOut(hoverEl, { relatedTarget: normalEl });
      fireEvent.mouseMove(normalEl, { clientX: 200, clientY: 200 });
      await wait(30);
    });

    expect(ball.textContent).toBe("");
    expect(ball.style.width).toBe("8px");

    document.body.removeChild(hoverEl);
    document.body.removeChild(normalEl);
  });
});
