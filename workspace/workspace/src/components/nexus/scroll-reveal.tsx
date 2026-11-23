"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealVariant = "up" | "fade" | "scale" | "left" | "right";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span";
}

const variantClass: Record<RevealVariant, string> = {
  up: "nx-reveal",
  fade: "nx-reveal-fade",
  scale: "nx-reveal-scale",
  left: "nx-reveal-left",
  right: "nx-reveal-right",
};

export default function ScrollReveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const delayClass = delay > 0 ? `nx-reveal-delay-${Math.min(delay, 6)}` : "";

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${variantClass[variant]} ${delayClass} ${revealed ? "nx-revealed" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}

// Word-by-word reveal for headings
export function WordReveal({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className={`nx-word-reveal ${revealed ? "nx-revealed" : ""}`}
          style={{ transitionDelay: `${i * 0.08}s` }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
