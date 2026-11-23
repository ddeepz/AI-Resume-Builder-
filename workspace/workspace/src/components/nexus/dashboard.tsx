"use client";

import {
  Sparkles,
  TrendingUp,
  FileText,
  Palette,
  Bot,
  History,
  LayoutGrid,
  Download,
  Eye,
  ArrowRight,
  Rocket,
  Wand2,
} from "lucide-react";
import { useResumeStore } from "@/lib/resume-store";
import { useToast } from "./toasts";
import { exportToPDF } from "@/lib/pdf-export";
import { useState } from "react";

interface DashboardCard {
  id: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  iconColor: string;
  bg: string;
  action: () => void;
  badge?: string;
}

function scrollToSection(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Dashboard() {
  const { setView, data, selectedTemplate, photoStyle, atsScore } = useResumeStore();
  const toast = useToast();
  const [exporting, setExporting] = useState(false);

  const hasResume = data.personal.name || data.summary;

  const onExport = async () => {
    if (!hasResume) {
      toast("Build your resume first before downloading.", "info");
      setView("ai-generator");
      return;
    }
    setExporting(true);
    try {
      await exportToPDF(data, selectedTemplate, photoStyle);
      toast("Resume downloaded successfully!", "success");
    } catch (err) {
      toast(err instanceof Error ? `Export failed: ${err.message}` : "PDF export failed", "error");
    } finally {
      setExporting(false);
    }
  };

  const cards: DashboardCard[] = [
    {
      id: "ai-generator",
      title: "AI Resume Generator",
      desc: "Describe your profile in one prompt and let AI build the complete resume instantly.",
      icon: Sparkles,
      iconColor: "#22D3EE",
      bg: "linear-gradient(135deg, rgba(34,211,238,0.18), rgba(167,139,250,0.18))",
      action: () => setView("ai-generator"),
      badge: "New",
    },
    {
      id: "editor",
      title: "Resume Builder & Editor",
      desc: hasResume ? "Continue editing your resume with the Canva-like live editor." : "Open the form-based builder to enter your details step by step.",
      icon: FileText,
      iconColor: "#A78BFA",
      bg: "linear-gradient(135deg, rgba(167,139,250,0.18), rgba(96,165,250,0.18))",
      action: () => setView("editor"),
    },
    {
      id: "templates",
      title: "Premium Templates",
      desc: "Browse 15 professionally designed, ATS-optimized templates and switch instantly.",
      icon: Palette,
      iconColor: "#EC4899",
      bg: "linear-gradient(135deg, rgba(236,72,153,0.18), rgba(34,211,238,0.18))",
      action: () => setView("templates-gallery"),
    },
    {
      id: "ai-content",
      title: "AI Content Generation",
      desc: "Generate summaries, objectives, cover letters, project and experience descriptions.",
      icon: Bot,
      iconColor: "#60A5FA",
      bg: "linear-gradient(135deg, rgba(96,165,250,0.18), rgba(34,211,238,0.18))",
      action: () => setView("ai-content"),
      badge: "AI",
    },
    {
      id: "ats-analysis",
      title: "ATS Score Analysis",
      desc: hasResume ? `Current score: ${atsScore}/100. Get detailed analysis and improvement tips.` : "Analyze your resume against ATS criteria with actionable recommendations.",
      icon: TrendingUp,
      iconColor: "#4ade80",
      bg: "linear-gradient(135deg, rgba(74,222,128,0.18), rgba(34,211,238,0.18))",
      action: () => setView("ats-analysis"),
    },
    {
      id: "history",
      title: "Resume History",
      desc: "Reopen, continue editing or delete your previously saved resumes.",
      icon: History,
      iconColor: "#fbbf24",
      bg: "linear-gradient(135deg, rgba(251,191,36,0.18), rgba(167,139,250,0.18))",
      action: () => setView("history"),
    },
    {
      id: "preview",
      title: "Resume Preview",
      desc: hasResume ? "View your resume in full A4 preview mode." : "Build a resume first to preview it.",
      icon: Eye,
      iconColor: "#22D3EE",
      bg: "linear-gradient(135deg, rgba(34,211,238,0.18), rgba(96,165,250,0.18))",
      action: () => {
        if (!hasResume) {
          toast("Build your resume first.", "info");
          setView("ai-generator");
          return;
        }
        setView("editor");
      },
    },
    {
      id: "download",
      title: "Download Resume PDF",
      desc: "Export your polished, ATS-friendly resume as a professional PDF.",
      icon: Download,
      iconColor: "#A78BFA",
      bg: "linear-gradient(135deg, rgba(167,139,250,0.18), rgba(236,72,153,0.18))",
      action: onExport,
    },
  ];

  const quickActions = [
    { label: "Generate with AI", icon: Wand2, view: "ai-generator" as const },
    { label: "Open Editor", icon: FileText, view: "editor" as const },
    { label: "Templates", icon: Palette, view: "templates-gallery" as const },
    { label: "ATS Analysis", icon: TrendingUp, view: "ats-analysis" as const },
  ];

  return (
    <section className="nx-section" id="dashboard" style={{ paddingTop: "120px" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div className="nx-hero-badge" style={{ margin: "0 auto 16px" }}>
          <div className="nx-pulse-dot" />
          NEXUS AI Dashboard
        </div>
        <h2 className="nx-section-title nx-gradient-animate" style={{ fontSize: "clamp(28px, 5vw, 44px)" }}>
          WELCOME TO YOUR WORKSPACE
        </h2>
        <p className="nx-section-subtitle">
          {hasResume
            ? "Pick up where you left off or explore a new tool."
            : "Start by generating a resume with AI, or build one step by step."}
        </p>
      </div>

      {/* Quick actions row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
          marginBottom: "40px",
        }}
      >
        {quickActions.map((q) => {
          const Icon = q.icon;
          return (
            <button
              key={q.label}
              className="nx-quick-action-btn"
              onClick={() => setView(q.view)}
              type="button"
            >
              <Icon size={15} />
              {q.label}
            </button>
          );
        })}
      </div>

      {/* Status bar */}
      {hasResume && (
        <div
          className="nx-glass"
          style={{
            maxWidth: "900px",
            margin: "0 auto 30px",
            padding: "16px 24px",
            borderRadius: "14px",
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="nx-icon-orb" style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, rgba(34,211,238,0.2), rgba(167,139,250,0.2))" }}>
              <Rocket size={16} color="#22D3EE" />
            </div>
            <div>
              <div style={{ fontSize: "13px", color: "var(--nx-frost)", fontWeight: 600 }}>
                {data.personal.name || "Untitled Resume"}
              </div>
              <div style={{ fontSize: "11px", color: "rgba(248,253,255,0.5)" }}>
                {data.personal.jobTitle || "No title set"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", color: "var(--nx-cyan)", fontWeight: 800 }}>{atsScore}</div>
              <div style={{ fontSize: "10px", color: "rgba(248,253,255,0.5)" }}>ATS Score</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", color: "var(--nx-ice)", fontWeight: 800 }}>
                {data.experience.filter((e) => e.company).length}
              </div>
              <div style={{ fontSize: "10px", color: "rgba(248,253,255,0.5)" }}>Experience</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", color: "#EC4899", fontWeight: 800 }}>
                {data.skills.technical.length + data.skills.programming.length + data.skills.soft.length}
              </div>
              <div style={{ fontSize: "10px", color: "rgba(248,253,255,0.5)" }}>Skills</div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard cards grid */}
      <div className="nx-features-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              className="nx-glass-card nx-feature-card nx-feature-card-3d nx-dashboard-card"
              onClick={card.action}
              type="button"
              style={{
                cursor: "pointer",
                textAlign: "left",
                background: "transparent",
                border: "none",
                padding: 0,
                color: "inherit",
                position: "relative",
              }}
            >
              <div className="nx-feature-icon-3d">
                <div className="nx-icon-orb" style={{ background: card.bg }}>
                  <Icon size={28} color={card.iconColor} strokeWidth={1.8} />
                </div>
              </div>
              {card.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "#0f172a",
                    background: "var(--nx-cyan)",
                    padding: "3px 8px",
                    borderRadius: "10px",
                  }}
                >
                  {card.badge}
                </span>
              )}
              <h3 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {card.title}
                <ArrowRight size={14} style={{ opacity: 0.5 }} />
              </h3>
              <p>{card.desc}</p>
            </button>
          );
        })}
      </div>

      {exporting && (
        <div style={{ textAlign: "center", marginTop: "20px", color: "var(--nx-ice)", fontSize: "13px" }}>
          <LayoutGrid size={16} className="animate-spin" style={{ display: "inline-block", marginRight: "6px" }} />
          Exporting PDF...
        </div>
      )}
    </section>
  );
}
