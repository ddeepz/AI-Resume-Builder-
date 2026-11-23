"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;

    document.body.classList.add("nx-cursor-active");

    const cursorX = { v: 0 };
    const cursorY = { v: 0 };
    const ring = { x: 0, y: 0 };
    const spot = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => {
      cursorX.v = e.clientX;
      cursorY.v = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${cursorX.v - 4}px, ${cursorY.v - 4}px)`;
      }
    };

    let raf = 0;
    const tick = () => {
      ring.x += (cursorX.v - ring.x) * 0.15;
      ring.y += (cursorY.v - ring.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x - 20}px, ${ring.y - 20}px)`;
      }
      spot.x += (cursorX.v - spot.x) * 0.08;
      spot.y += (cursorY.v - spot.y) * 0.08;
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate(${spot.x}px, ${spot.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    const interactiveSelector =
      "button, a, input, textarea, .nx-glass-card, .nx-step-item, .nx-preview-tab, [role='button']";

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(interactiveSelector) && ringRef.current) {
        ringRef.current.style.width = "60px";
        ringRef.current.style.height = "60px";
        ringRef.current.style.borderColor = "rgba(167, 139, 250, 0.6)";
      }
    };
    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(interactiveSelector) && ringRef.current) {
        ringRef.current.style.width = "40px";
        ringRef.current.style.height = "40px";
        ringRef.current.style.borderColor = "rgba(34, 211, 238, 0.5)";
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.body.classList.remove("nx-cursor-active");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="nx-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="nx-cursor-ring" aria-hidden="true" />
      <div ref={spotlightRef} className="nx-cursor-spotlight" aria-hidden="true" />
    </>
  );
}
