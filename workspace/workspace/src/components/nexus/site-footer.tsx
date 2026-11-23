"use client";

import {
  Brain,
  Sparkles,
  TrendingUp,
  FileText,
  Palette,
  History,
  Info,
  Mail,
  Shield,
  FileCheck,
  Zap,
  Rocket,
  Layout,
  Type,
  Bot,
  Eye,
  Download,
  Heart,
} from "lucide-react";
import { useResumeStore, type ViewId } from "@/lib/resume-store";
import { useToast } from "./toasts";

// Powered by Fusion — internal feature links. Each one navigates to a real
// page/view inside NEXUS AI. No fake or external destinations.
const FUSION_LINKS: {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  view: ViewId;
  desc: string;
}[] = [
  { label: "AI Resume Generator", icon: Sparkles, view: "ai-generator", desc: "One-prompt resume generation" },
  { label: "Live Resume Editor", icon: Layout, view: "editor", desc: "Canva-like click-to-edit" },
  { label: "Premium Templates", icon: Palette, view: "templates-gallery", desc: "15 ATS-ready designs" },
  { label: "ATS Score Analysis", icon: TrendingUp, view: "ats-analysis", desc: "Real-time scoring" },
  { label: "AI Content Studio", icon: Bot, view: "ai-content", desc: "Summary, objective, cover letter" },
  { label: "Resume History", icon: History, view: "history", desc: "Your saved resumes" },
];

const QUICK_NAV: { label: string; view: ViewId | "home-section"; section?: string }[] = [
  { label: "Home", view: "home" },
  { label: "Dashboard", view: "dashboard" },
  { label: "AI Resume Generator", view: "ai-generator" },
  { label: "Premium Templates", view: "templates-gallery" },
  { label: "Resume Editor", view: "editor" },
  { label: "ATS Analysis", view: "ats-analysis" },
  { label: "AI Content Studio", view: "ai-content" },
  { label: "Resume History", view: "history" },
];

export default function SiteFooter() {
  const { setView } = useResumeStore();
  const toast = useToast();

  const goHomeSection = (section: string) => {
    setView("home");
    setTimeout(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const navTo = (item: { view: ViewId | "home-section"; section?: string }) => {
    if (item.view === "home-section" && item.section) {
      goHomeSection(item.section);
    } else {
      setView(item.view as ViewId);
    }
  };

  const showInfo = (title: string) => {
    toast(`${title} — this page is part of the NEXUS AI demo.`, "info");
  };

  return (
    <footer className="nx-site-footer" style={{ marginTop: "auto", position: "relative", zIndex: 3 }}>
      <div className="nx-footer-inner">
        {/* Thanks for visiting banner */}
        <div className="nx-footer-thanks">
          <div className="nx-footer-thanks-glow" />
          <Heart size={16} color="#EC4899" style={{ display: "inline", marginBottom: "-2px" }} />
          <h3>Thanks for Visiting NEXUS AI!</h3>
          <p>Your career journey deserves a professional beginning. Create, customize, and build your future with NEXUS AI.</p>
        </div>

        <div className="nx-footer-grid">
          {/* Brand + about */}
          <div className="nx-footer-col nx-footer-brand">
            <div className="nx-nav-logo" style={{ fontSize: "22px", marginBottom: "12px" }}>
              <Brain
                size={22}
                style={{ color: "var(--nx-cyan)", filter: "drop-shadow(0 0 8px rgba(34,211,238,0.6))" }}
              />
              NEXUS AI
            </div>
            <p className="nx-footer-about">
              The future of resume building. Powered by AI, designed for success. Create smarter, faster, and professional resumes with real-time ATS scoring, AI-generated content, and stunning visual design.
            </p>
            <div className="nx-footer-social">
              <button className="nx-footer-social-btn" onClick={() => showInfo("LinkedIn")} type="button" aria-label="LinkedIn" title="LinkedIn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34v-7.4H5.67v7.4h2.67zM7 9.84a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.34 18.34v-4.06c0-2.17-1.16-3.18-2.7-3.18-1.25 0-1.8.69-2.11 1.17v-1.33h-2.67v7.4h2.67v-4.13c0-.22.02-.43.08-.59.18-.43.58-.88 1.26-.88.89 0 1.5.67 1.5 1.66v3.94h2.97z"/></svg>
              </button>
              <button className="nx-footer-social-btn" onClick={() => showInfo("Twitter / X")} type="button" aria-label="Twitter" title="Twitter / X">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.5h3.7l-8 9.1 9.4 12.4h-7.4l-5.8-7.6-6.6 7.6H.5l8.5-9.7L0 1.5h7.6l5.2 6.9 6.1-6.9zm-1.3 19.8h2.1L6.5 3.6H4.3l13.3 17.7z"/></svg>
              </button>
              <button className="nx-footer-social-btn" onClick={() => showInfo("GitHub")} type="button" aria-label="GitHub" title="GitHub">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 5 18 5.3 18 5.3c.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/></svg>
              </button>
            </div>
          </div>

          {/* Quick navigation */}
          <div className="nx-footer-col">
            <h4 className="nx-footer-heading">
              <Layout size={12} /> Quick Navigation
            </h4>
            <ul className="nx-footer-links">
              {QUICK_NAV.map((l) => (
                <li key={l.label}>
                  <button className="nx-footer-link" onClick={() => navTo(l)} type="button">{l.label}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* About / Features */}
          <div className="nx-footer-col">
            <h4 className="nx-footer-heading">
              <Info size={12} /> About
            </h4>
            <ul className="nx-footer-links">
              <li><button className="nx-footer-link" onClick={() => navTo({ view: "home-section", section: "home" })} type="button">About NEXUS AI</button></li>
              <li><button className="nx-footer-link" onClick={() => navTo({ view: "home-section", section: "features" })} type="button">Features</button></li>
              <li><button className="nx-footer-link" onClick={() => setView("ai-generator")} type="button">AI Resume Generator</button></li>
              <li><button className="nx-footer-link" onClick={() => setView("templates-gallery")} type="button">Premium Templates</button></li>
              <li><button className="nx-footer-link" onClick={() => showInfo("Contact")} type="button">Contact</button></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="nx-footer-col">
            <h4 className="nx-footer-heading">
              <Shield size={12} /> Legal
            </h4>
            <ul className="nx-footer-links">
              <li><button className="nx-footer-link" onClick={() => showInfo("Privacy Policy")} type="button">Privacy Policy</button></li>
              <li><button className="nx-footer-link" onClick={() => showInfo("Terms and Conditions")} type="button">Terms and Conditions</button></li>
            </ul>
          </div>
        </div>

        {/* Powered by Fusion section (Module 12) */}
        <div className="nx-fusion-section">
          <div className="nx-fusion-header">
            <Zap size={16} color="var(--nx-cyan)" />
            <span className="nx-fusion-title">Powered by Fusion</span>
            <span className="nx-fusion-badge">All tools fully functional</span>
          </div>
          <div className="nx-fusion-grid">
            {FUSION_LINKS.map((f) => {
              const Icon = f.icon;
              return (
                <button key={f.label} className="nx-fusion-card" onClick={() => setView(f.view)} type="button">
                  <div className="nx-fusion-card-icon">
                    <Icon size={16} />
                  </div>
                  <div className="nx-fusion-card-text">
                    <div className="nx-fusion-card-label">{f.label}</div>
                    <div className="nx-fusion-card-desc">{f.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="nx-footer-bottom">
          <div className="nx-footer-copyright">
            © 2026 NEXUS AI. All Rights Reserved.
          </div>
          <div className="nx-footer-powered">
            <span>Powered by</span>
            <span className="nx-footer-fusion-brand">FUSION</span>
            <Rocket size={12} color="var(--nx-cyan)" />
          </div>
        </div>
      </div>
    </footer>
  );
}
