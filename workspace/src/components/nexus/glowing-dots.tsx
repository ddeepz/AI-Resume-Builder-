"use client";

import { useEffect, useState } from "react";

interface Dot {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  color: string;
}

export default function GlowingDots() {
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    const colors = ["#22D3EE", "#60A5FA", "#A78BFA", "#A5F3FC"];
    const newDots: Dot[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setDots(newDots);
  }, []);

  return (
    <div className="nx-glowing-dots" aria-hidden="true">
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="nx-glowing-dot"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            animationDelay: `${dot.delay}s`,
            animationDuration: `${dot.duration}s`,
            background: dot.color,
            boxShadow: `0 0 8px ${dot.color}, 0 0 12px ${dot.color}`,
          }}
        />
      ))}
    </div>
  );
}
