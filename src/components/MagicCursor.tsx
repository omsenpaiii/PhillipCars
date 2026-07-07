"use client";

import React, { useState, useEffect, useRef } from "react";

export default function MagicCursor() {
  const [mounted, setMounted] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isOpaque, setIsOpaque] = useState(false);
  const [visible, setVisible] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const mouseCoords = useRef({ x: 0, y: 0 });
  const ballCoords = useRef({ x: 0, y: 0 });

  const cursorTextRef = useRef("");
  const isOpaqueRef = useRef(false);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const timer = setTimeout(() => {
      setMounted(true);
      if (isCoarse || prefersReducedMotion) {
        setDisabled(true);
      }
    }, 0);

    if (isCoarse || prefersReducedMotion) {
      return () => clearTimeout(timer);
    }

    let animationFrameId: number;

    const updatePosition = () => {
      // Interpolate ball position towards mouse position
      const dx = mouseCoords.current.x - ballCoords.current.x;
      const dy = mouseCoords.current.y - ballCoords.current.y;

      ballCoords.current.x += dx * 0.15;
      ballCoords.current.y += dy * 0.15;

      // Update inline styles directly via refs
      if (cursorRef.current) {
        cursorRef.current.style.left = `${mouseCoords.current.x}px`;
        cursorRef.current.style.top = `${mouseCoords.current.y}px`;
      }
      if (ballRef.current) {
        ballRef.current.style.left = `${ballCoords.current.x}px`;
        ballRef.current.style.top = `${ballCoords.current.y}px`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);

    const updateHoverState = (eventTarget: EventTarget | null) => {
      const target = eventTarget instanceof HTMLElement ? eventTarget : null;

      // Find closest element with either attribute to determine precedence
      const closestEl = target?.closest("[data-cursor], [data-cursor-text]");
      let newText = "";
      let newOpaque = false;

      if (closestEl) {
        if (closestEl.hasAttribute("data-cursor-text")) {
          newText = closestEl.getAttribute("data-cursor-text") || "";
        } else if (closestEl.hasAttribute("data-cursor")) {
          newOpaque = true;
        }
      }

      // Only update state if attributes have changed
      if (cursorTextRef.current !== newText) {
        cursorTextRef.current = newText;
        setCursorText(newText);
      }
      if (isOpaqueRef.current !== newOpaque) {
        isOpaqueRef.current = newOpaque;
        setIsOpaque(newOpaque);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseCoords.current = { x: e.clientX, y: e.clientY };

      // Set visibility to true on first movement
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        setVisible(true);
      }

      updateHoverState(e.target);
    };

    const handlePointerOver = (e: PointerEvent) => {
      updateHoverState(e.target);
    };

    const handlePointerOut = (e: PointerEvent) => {
      const nextTarget = e.relatedTarget instanceof HTMLElement ? e.relatedTarget : null;
      if (!nextTarget?.closest("[data-cursor], [data-cursor-text]")) {
        updateHoverState(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("pointerover", handlePointerOver);
    window.addEventListener("pointerout", handlePointerOut);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerout", handlePointerOut);
    };
  }, []);

  if (!mounted || disabled) {
    return null;
  }

  // Determine styles dynamically for non-position aspects
  const getBallStyle = (): React.CSSProperties => {
    const defaultStyle: React.CSSProperties = {
      position: "fixed",
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: 999999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-epilogue), sans-serif",
      fontSize: "11px",
      fontWeight: 900,
      textTransform: "uppercase",
      color: "#000", // Black text inverts beautifully over diff backgrounds
      letterSpacing: "0.5px",
      mixBlendMode: "difference",
      transition: "width 0.25s ease, height 0.25s ease, background-color 0.25s ease, border 0.25s ease",
    };

    if (cursorText) {
      return {
        ...defaultStyle,
        width: "75px",
        height: "75px",
        backgroundColor: "#ffffff",
        border: "none",
      };
    }

    if (isOpaque) {
      return {
        ...defaultStyle,
        width: "45px",
        height: "45px",
        backgroundColor: "#ffffff",
        border: "none",
      };
    }

    return {
      ...defaultStyle,
      width: "8px",
      height: "8px",
      backgroundColor: "#ffffff",
      border: "none",
    };
  };

  return (
    <div
      id="magic-cursor"
      ref={cursorRef}
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 1000000,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <div id="ball" ref={ballRef} style={getBallStyle()}>
        {cursorText}
      </div>
    </div>
  );
}
