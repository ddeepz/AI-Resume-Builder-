"use client";

import { useEffect, useState, useRef } from "react";

interface AILoadingProps {
  show: boolean;
  text?: string;
  duration?: number;
  onComplete?: () => void;
}

export default function AILoading({
  show,
  text = "NEXUS AI is creating your future",
  duration = 2500,
  onComplete,
}: AILoadingProps) {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!show) {
      setProgress(0);
      return;
    }

    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => onComplete?.(), 300);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [show, duration, onComplete]);

  if (!show) return null;

  // Generate particle positions
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const radius = 40 + Math.random() * 20;
    return {
      tx: Math.cos(angle) * radius,
      ty: Math.sin(angle) * radius,
      delay: (i / 12) * 2,
      color: ["#22D3EE", "#60A5FA", "#A78BFA"][i % 3],
    };
  });

  return (
    <div className="nx-ai-loading-overlay">
      <div className="nx-ai-loading-robot">
        <div className="nx-ai-loading-particles">
          {particles.map((p, i) => (
            <div
              key={i}
              className="nx-ai-loading-particle"
              style={{
                top: "50%",
                left: "50%",
                "--tx": `${p.tx}px`,
                "--ty": `${p.ty}px`,
                animationDelay: `${p.delay}s`,
                background: p.color,
                boxShadow: `0 0 8px ${p.color}`,
              } as React.CSSProperties}
            />
          ))}
        </div>
        <img src="/ai-robot-glow.png" alt="NEXUS AI Robot" />
      </div>

      <div className="nx-ai-loading-text">
        <span className="nx-loading-highlight">{text}</span>
        <span className="nx-ai-loading-dots">
          <span />
          <span />
          <span />
        </span>
      </div>

      <div className="nx-ai-loading-bar">
        <div
          className="nx-ai-loading-bar-fill"
          style={{ width: `${progress}%`, animation: "none" }}
        />
      </div>
    </div>
  );
}
