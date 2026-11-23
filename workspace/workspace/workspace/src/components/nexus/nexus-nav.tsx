"use client";

import { Brain } from "lucide-react";

const links = [
  { label: "Home", href: "home" },
  { label: "Features", href: "features" },
  { label: "Builder", href: "builder" },
  { label: "Templates", href: "templates" },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function NexusNav() {
  return (
    <nav className="nx-nav nx-glass" aria-label="Primary">
      <div className="nx-nav-logo">
        <Brain
          size={20}
          style={{
            color: "var(--nx-cyan)",
            filter: "drop-shadow(0 0 8px rgba(34,211,238,0.6))",
          }}
        />
        NEXUS AI
      </div>
      <div className="nx-nav-links">
        {links.map((l) => (
          <a key={l.href} onClick={() => scrollToSection(l.href)}>
            {l.label}
          </a>
        ))}
      </div>
      <button
        className="nx-btn-primary"
        style={{ padding: "8px 24px", fontSize: "12px" }}
        onClick={() => scrollToSection("builder")}
      >
        Get Started
      </button>
    </nav>
  );
}
