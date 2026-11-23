"use client";

import {
  Brain,
  TrendingUp,
  FileText,
  Lightbulb,
  Eye,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import ScrollReveal from "./scroll-reveal";
import { useResumeStore, type ViewId } from "@/lib/resume-store";

const features = [
  {
    icon: Brain,
    title: "AI CONTENT GENERATION",
    desc: "Smart AI engine generates professional summaries, bullet points, and descriptions tailored to your role and industry.",
    bg: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(167,139,250,0.15))",
    neonClass: "nx-neon-card-cyan",
    iconColor: "#22D3EE",
    view: "ai-content" as ViewId,
  },
  {
    icon: TrendingUp,
    title: "ATS SCORE ANALYSIS",
    desc: "Real-time Applicant Tracking System scoring with actionable insights to optimize your resume for any job.",
    bg: "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(34,211,238,0.15))",
    neonClass: "nx-neon-card-pink",
    iconColor: "#EC4899",
    view: "ats-analysis" as ViewId,
  },
  {
    icon: FileText,
    title: "RESUME EDITOR",
    desc: "Canva-like live editing. Click any text to edit, customize fonts, colors and layout with full control.",
    bg: "linear-gradient(135deg, rgba(167,139,250,0.15), rgba(96,165,250,0.15))",
    neonClass: "nx-neon-card-purple",
    iconColor: "#A78BFA",
    view: "editor" as ViewId,
  },
  {
    icon: Lightbulb,
    title: "ONE-PROMPT AI",
    desc: "Describe your profile in plain English and AI builds a complete, professional resume instantly.",
    bg: "linear-gradient(135deg, rgba(165,243,252,0.15), rgba(236,72,153,0.15))",
    neonClass: "nx-neon-card-cyan",
    iconColor: "#A5F3FC",
    view: "ai-generator" as ViewId,
  },
  {
    icon: Eye,
    title: "PREMIUM TEMPLATES",
    desc: "15 professionally designed, ATS-optimized templates. Switch instantly without losing your data.",
    bg: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(96,165,250,0.15))",
    neonClass: "nx-neon-card-pink",
    iconColor: "#60A5FA",
    view: "templates-gallery" as ViewId,
  },
  {
    icon: ShieldCheck,
    title: "AUTO-SAVE & HISTORY",
    desc: "Your resume is auto-saved locally. Reopen and continue editing anytime, even after a refresh.",
    bg: "linear-gradient(135deg, rgba(167,139,250,0.15), rgba(165,243,252,0.15))",
    neonClass: "nx-neon-card-purple",
    iconColor: "#C4B5FD",
    view: "history" as ViewId,
  },
];

export default function Features() {
  const { setView } = useResumeStore();

  return (
    <section className="nx-section" id="features">
      <ScrollReveal variant="up">
        <h2 className="nx-section-title nx-gradient-animate">AI-POWERED FEATURES</h2>
      </ScrollReveal>
      <ScrollReveal variant="fade" delay={1}>
        <p className="nx-section-subtitle">Next-generation tools to craft the perfect resume</p>
      </ScrollReveal>

      <div className="nx-features-grid">
        {features.map((f, idx) => (
          <ScrollReveal key={f.title} variant="up" delay={(idx % 3) + 1}>
            <button
              className={`nx-glass-card nx-feature-card nx-feature-card-3d ${f.neonClass} nx-feature-clickable`}
              onClick={() => setView(f.view)}
              type="button"
              style={{
                cursor: "pointer",
                textAlign: "left",
                background: "transparent",
                border: "none",
                padding: 0,
                color: "inherit",
                width: "100%",
              }}
            >
              <div className="nx-feature-icon-3d">
                <div className="nx-icon-orb" style={{ background: f.bg }}>
                  <f.icon size={32} color={f.iconColor} strokeWidth={1.8} />
                </div>
              </div>
              <h3 style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {f.title}
                <ArrowRight size={14} style={{ opacity: 0.5 }} />
              </h3>
              <p>{f.desc}</p>
            </button>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
