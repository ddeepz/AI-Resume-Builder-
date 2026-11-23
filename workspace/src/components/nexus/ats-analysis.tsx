"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  CheckCircle2,
  CircleAlert,
  X as XIcon,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  Wand2,
  Target,
} from "lucide-react";
import { useResumeStore } from "@/lib/resume-store";
import { analyzeResume } from "@/lib/ats";
import { useToast } from "./toasts";

const RING_CIRC = 2 * Math.PI * 70;

function AtsRing({ score }: { score: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = display;
    const target = score;
    const t0 = performance.now();
    const dur = 900;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      const v = Math.round(start + (target - start) * k);
      setDisplay(v);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const offset = RING_CIRC - (RING_CIRC * display) / 100;
  const color = display >= 75 ? "#4ade80" : display >= 50 ? "#fbbf24" : "#ef4444";

  return (
    <div className="nx-ats-score-circle">
      <svg width="160" height="160">
        <defs>
          <linearGradient id="nxAtsGradientDetail" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
        <circle className="nx-bg-ring" cx="80" cy="80" r="70" />
        <circle
          className="nx-progress-ring"
          cx="80"
          cy="80"
          r="70"
          stroke={`url(#nxAtsGradientDetail)`}
          strokeDasharray={RING_CIRC}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="nx-ats-score-value">
        <div className="nx-score" style={{ color }}>{display}</div>
        <div className="nx-label">ATS Score</div>
      </div>
    </div>
  );
}

function CategoryBar({ score, status }: { score: number; status: "good" | "warn" | "bad" }) {
  const color = status === "good" ? "#4ade80" : status === "warn" ? "#fbbf24" : "#ef4444";
  return (
    <div className="nx-cat-bar-track">
      <div className="nx-cat-bar-fill" style={{ width: `${score}%`, background: color }} />
    </div>
  );
}

export default function AtsAnalysisView() {
  const { setView, data, setView: goView } = useResumeStore();
  const toast = useToast();
  const analysis = useMemo(() => analyzeResume(data), [data]);

  return (
    <section className="nx-section" style={{ paddingTop: "120px" }}>
      <button className="nx-back-btn" onClick={() => setView("dashboard")} type="button">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <div className="nx-hero-badge" style={{ margin: "0 auto 16px" }}>
          <Target size={12} /> ATS Analysis
        </div>
        <h2 className="nx-section-title nx-gradient-animate" style={{ fontSize: "clamp(26px, 4.5vw, 40px)" }}>
          RESUME SCORE ANALYSIS
        </h2>
        <p className="nx-section-subtitle">
          Real, data-driven analysis of your resume against Applicant Tracking System criteria.
        </p>
      </div>

      {/* Overall score */}
      <div className="nx-glass-strong" style={{ maxWidth: "900px", margin: "0 auto 24px", padding: "32px", borderRadius: "24px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "30px", alignItems: "center", justifyContent: "center" }}>
          <AtsRing score={analysis.score} />
          <div style={{ flex: 1, minWidth: "280px" }}>
            <h3 style={{ fontFamily: "var(--font-orbitron)", fontSize: "16px", color: "var(--nx-frost)", letterSpacing: "1px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp size={18} color="var(--nx-cyan)" /> OVERALL ATS SCORE
            </h3>
            <p style={{ fontSize: "13px", color: "rgba(248,253,255,0.7)", lineHeight: 1.6 }}>
              Your resume scores <strong style={{ color: analysis.score >= 75 ? "#4ade80" : analysis.score >= 50 ? "#fbbf24" : "#ef4444" }}>{analysis.score}/100</strong> against our ATS model.
              {analysis.score >= 75
                ? " Excellent! Your resume is well-optimized."
                : analysis.score >= 50
                  ? " Good progress — follow the recommendations below to improve."
                  : " Needs work. Address the items below to boost your score."}
            </p>
            <div className="nx-ats-disclaimer" style={{ marginTop: "12px", fontSize: "11px", color: "rgba(248,253,255,0.4)", display: "flex", alignItems: "flex-start", gap: "6px", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", padding: "10px 12px", borderRadius: "10px" }}>
              <AlertTriangle size={12} color="#fbbf24" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>ATS scores are estimates and may vary between applicant tracking systems. Use this as a guide, not an absolute measure.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category scores */}
      <div className="nx-glass-strong" style={{ maxWidth: "900px", margin: "0 auto 24px", padding: "32px", borderRadius: "24px" }}>
        <h3 style={{ fontFamily: "var(--font-orbitron)", fontSize: "15px", color: "var(--nx-frost)", letterSpacing: "1px", marginBottom: "20px" }}>
          CATEGORY-WISE SCORES
        </h3>
        <div className="nx-cat-list">
          {analysis.categories.map((cat) => {
            const Icon = cat.status === "good" ? CheckCircle2 : cat.status === "warn" ? CircleAlert : XIcon;
            const iconColor = cat.status === "good" ? "#4ade80" : cat.status === "warn" ? "#fbbf24" : "#ef4444";
            return (
              <div className="nx-cat-item" key={cat.id}>
                <div className="nx-cat-item-head">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Icon size={14} color={iconColor} />
                    <span style={{ fontSize: "13px", color: "var(--nx-ice)", fontWeight: 600 }}>{cat.label}</span>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: iconColor }}>{cat.score}</span>
                </div>
                <CategoryBar score={cat.score} status={cat.status} />
                <div style={{ fontSize: "11px", color: "rgba(248,253,255,0.5)", marginTop: "4px" }}>{cat.detail}</div>
                <div style={{ fontSize: "11px", color: "var(--nx-cyan)", marginTop: "2px" }}>{cat.recommendation}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Missing keywords */}
      {analysis.missingKeywords.length > 0 && (
        <div className="nx-glass-strong" style={{ maxWidth: "900px", margin: "0 auto 24px", padding: "32px", borderRadius: "24px" }}>
          <h3 style={{ fontFamily: "var(--font-orbitron)", fontSize: "15px", color: "var(--nx-frost)", letterSpacing: "1px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Target size={16} color="var(--nx-cyan)" /> MISSING KEYWORDS
          </h3>
          <p style={{ fontSize: "12px", color: "rgba(248,253,255,0.5)", marginBottom: "12px" }}>
            Consider adding these common ATS keywords to your resume:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {analysis.missingKeywords.map((k) => (
              <span key={k} style={{ fontSize: "11px", padding: "5px 12px", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: "14px", color: "#fde68a" }}>{k}</span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="nx-glass-strong" style={{ maxWidth: "900px", margin: "0 auto 24px", padding: "32px", borderRadius: "24px" }}>
        <h3 style={{ fontFamily: "var(--font-orbitron)", fontSize: "15px", color: "var(--nx-frost)", letterSpacing: "1px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Lightbulb size={16} color="var(--nx-cyan)" /> IMPROVEMENT SUGGESTIONS
        </h3>
        <div style={{ display: "grid", gap: "10px" }}>
          {analysis.suggestions.map((s, i) => (
            <div key={i} className="nx-ai-suggestion" style={{ background: "rgba(34,211,238,0.06)" }}>
              <Lightbulb size={14} color="var(--nx-cyan)" />
              <div style={{ fontSize: "12px", color: "rgba(248,253,255,0.8)" }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Warnings */}
      {analysis.warnings.length > 0 && (
        <div className="nx-glass-strong" style={{ maxWidth: "900px", margin: "0 auto 24px", padding: "32px", borderRadius: "24px" }}>
          <h3 style={{ fontFamily: "var(--font-orbitron)", fontSize: "15px", color: "#fbbf24", letterSpacing: "1px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertTriangle size={16} color="#fbbf24" /> FORMATTING WARNINGS
          </h3>
          <div style={{ display: "grid", gap: "8px" }}>
            {analysis.warnings.map((w, i) => (
              <div key={i} className="nx-ai-suggestion" style={{ background: "rgba(251,191,36,0.06)", borderColor: "rgba(251,191,36,0.2)" }}>
                <AlertTriangle size={14} color="#fbbf24" />
                <div style={{ fontSize: "12px", color: "rgba(248,253,255,0.8)" }}>{w}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{ textAlign: "center", maxWidth: "900px", margin: "0 auto" }}>
        <button
          className="nx-btn-primary"
          onClick={() => { toast("Opening AI tools to help improve your resume.", "success"); goView("ai-content"); }}
          type="button"
          style={{ padding: "16px 32px", fontSize: "15px" }}
        >
          <Wand2 size={16} /> Improve My Resume with AI
        </button>
      </div>
    </section>
  );
}
