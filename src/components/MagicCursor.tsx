"use client";

import React, { useState, useEffect } from "react";

export default function MagicCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ballPos, setBallPos] = useState({ x: 0, y: 0 });
  const [cursorText, setCursorText] = useState("");
  const [isOpaque, setIsOpaque] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Event delegation: find closest elements with cursor attributes
      const target = e.target as HTMLElement;
      if (!target) return;

      const cursorTextEl = target.closest("[data-cursor-text]");
      const cursorOpaqueEl = target.closest("[data-cursor]");

      if (cursorTextEl) {
        setCursorText(cursorTextEl.getAttribute("data-cursor-text") || "");
        setIsOpaque(false);
      } else if (cursorOpaqueEl) {
        setCursorText("");
        setIsOpaque(true);
      } else {
        setCursorText("");
        setIsOpaque(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Smooth ball animation
  useEffect(() => {
    let animationFrameId: number;
    const updateBall = () => {
      setBallPos((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      animationFrameId = requestAnimationFrame(updateBall);
    };

    animationFrameId = requestAnimationFrame(updateBall);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos]);

  // Determine styles dynamically
  const getBallStyle = (): React.CSSProperties => {
    const defaultStyle: React.CSSProperties = {
      position: "fixed",
      left: `${ballPos.x}px`,
      top: `${ballPos.y}px`,
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: 999999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-epilogue), sans-serif",
      fontSize: "10px",
      fontWeight: 800,
      textTransform: "uppercase",
      color: "#fff",
      letterSpacing: "0.5px",
      transition: "width 0.25s ease, height 0.25s ease, background-color 0.25s ease, border 0.25s ease",
    };

    if (cursorText) {
      return {
        ...defaultStyle,
        width: "70px",
        height: "70px",
        backgroundColor: "var(--accent-color)",
        border: "none",
      };
    }

    if (isOpaque) {
      return {
        ...defaultStyle,
        width: "45px",
        height: "45px",
        backgroundColor: "rgba(255, 54, 0, 0.25)",
        border: "1px solid var(--accent-color)",
      };
    }

    return {
      ...defaultStyle,
      width: "8px",
      height: "8px",
      backgroundColor: "var(--accent-color)",
      border: "none",
    };
  };

  return (
    <div id="magic-cursor">
      <div id="ball" style={getBallStyle()}>
        {cursorText}
      </div>
    </div>
  );
}
