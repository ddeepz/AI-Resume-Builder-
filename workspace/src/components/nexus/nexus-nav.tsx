"use client";

import { useState, useEffect } from "react";
import { Brain, Menu, X, LayoutDashboard } from "lucide-react";
import { useResumeStore } from "@/lib/resume-store";

const links = [
  { label: "Home", href: "home", view: "home" as const },
  { label: "Features", href: "features", view: "home-section" as const, section: "features" },
  { label: "Builder", href: "builder", view: "home-section" as const, section: "builder" },
  { label: "Templates", href: "templates", view: "home-section" as const, section: "templates" },
];

export default function NexusNav() {
  const { setView, view } = useResumeStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleLinkClick = (link: (typeof links)[number]) => {
    setMobileOpen(false);
    if (link.view === "home") {
      setView("home");
      setTimeout(() => scrollToSection("home"), 80);
    } else if (link.view === "home-section" && link.section) {
      // If we're not on the home view, switch first, then scroll.
      if (view !== "home") {
        setView("home");
        setTimeout(() => scrollToSection(link.section!), 150);
      } else {
        scrollToSection(link.section);
      }
    }
  };

  const goToDashboard = () => {
    setMobileOpen(false);
    setView("dashboard");
  };

  return (
    <nav className={`nx-nav nx-glass ${scrolled ? "nx-nav-scrolled" : ""}`} aria-label="Primary">
      <button
        className="nx-nav-logo"
        style={{ whiteSpace: "nowrap", flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "inherit" }}
        onClick={() => handleLinkClick(links[0])}
        type="button"
        aria-label="NEXUS AI home"
      >
        <Brain
          size={20}
          style={{
            color: "var(--nx-cyan)",
            filter: "drop-shadow(0 0 8px rgba(34,211,238,0.6))",
            flexShrink: 0,
          }}
        />
        NEXUS AI
      </button>

      <div className={`nx-nav-links ${mobileOpen ? "nx-nav-links-open" : ""}`}>
        {links.map((l) => (
          <a
            key={l.href}
            onClick={() => handleLinkClick(l)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter") handleLinkClick(l); }}
          >
            {l.label}
          </a>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          className="nx-btn-secondary nx-nav-dashboard-btn"
          onClick={goToDashboard}
          type="button"
          style={{ padding: "8px 16px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
          aria-label="Go to dashboard"
        >
          <LayoutDashboard size={14} />
          Dashboard
        </button>
        <button
          className="nx-btn-primary"
          style={{ padding: "8px 24px", fontSize: "12px" }}
          onClick={() => { setMobileOpen(false); setView("ai-generator"); }}
          type="button"
        >
          Get Started
        </button>
        <button
          className="nx-nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          type="button"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </nav>
  );
}
