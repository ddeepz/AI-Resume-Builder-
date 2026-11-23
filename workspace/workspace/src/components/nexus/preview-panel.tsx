"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  TrendingUp,
  Bot,
  FilePlus2,
  Lightbulb,
  Code,
  Briefcase,
  Box,
  CheckCircle2,
  CircleAlert,
  X as XIcon,
  Linkedin,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
} from "lucide-react";
import { useResumeStore } from "@/lib/resume-store";
import { calculateAts, generateAiTips, type AiTip } from "@/lib/ats";
import { TEMPLATES, getTemplate, SAMPLE_RESUME } from "@/lib/templates";
import { TemplateRenderer } from "./template-renderer";
import type { ResumeData } from "@/lib/resume-store";

const tabs = [
  { id: "preview" as const, label: "Preview", icon: FileText },
  { id: "ats" as const, label: "ATS Analysis", icon: TrendingUp },
  { id: "ai" as const, label: "AI Tips", icon: Bot },
];

const RING_CIRC = 2 * Math.PI * 70;

function AtsRing({ score }: { score: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = display;
    const target = score;
    const t0 = performance.now();
    const dur = 800;
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

  return (
    <div className="nx-ats-score-circle">
      <svg width="160" height="160">
        <defs>
          <linearGradient id="nxAtsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
        <circle className="nx-bg-ring" cx="80" cy="80" r="70" />
        <circle
          className="nx-progress-ring"
          cx="80"
          cy="80"
          r="70"
          strokeDasharray={RING_CIRC}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="nx-ats-score-value">
        <div className="nx-score">{display}</div>
        <div className="nx-label">ATS Score</div>
      </div>
    </div>
  );
}

function ResumePreviewContent() {
  const { data, selectedTemplate, photoStyle, previewZoom } = useResumeStore();
  const template = getTemplate(selectedTemplate);
  const hasData = data.personal.name || data.personal.email;

  return (
    <div style={{ position: "relative" }}>
      {!hasData && (
        <div className="nx-preview-default-badge">Sample Preview</div>
      )}
      <div
        style={{
          transform: `scale(${previewZoom})`,
          transformOrigin: "top center",
        }}
      >
        <TemplateRenderer
          template={template}
          data={data}
          photoStyle={photoStyle}
        />
      </div>
    </div>
  );
}

function FullPreviewModal({ onClose }: { onClose: () => void }) {
  const { data, selectedTemplate, photoStyle } = useResumeStore();
  const template = getTemplate(selectedTemplate);
  const hasData = data.personal.name || data.personal.email;

  return (
    <div className="nx-full-preview-overlay" onClick={onClose}>
      <div className="nx-full-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="nx-full-preview-header">
          <div className="nx-full-preview-title">
            {template.name} — Full Preview
          </div>
          <button className="nx-full-preview-close" onClick={onClose} type="button" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="nx-full-preview-body">
          <div className="nx-full-preview-a4">
            <TemplateRenderer
              template={template}
              data={data}
              photoStyle={photoStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AtsDashboard() {
  const { data, atsScore, atsFactors, setAts } = useResumeStore();

  useEffect(() => {
    const ats = calculateAts(data);
    setAts(ats.score, ats.factors);
  }, [data]);

  return (
    <div className="nx-glass-card nx-ats-dashboard nx-holo-border">
      <h4
        style={{
          fontFamily: "var(--font-orbitron), sans-serif",
          fontSize: "16px",
          color: "var(--nx-frost)",
          textAlign: "center",
          marginBottom: "20px",
          letterSpacing: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <TrendingUp size={18} color="var(--nx-cyan)" />
        LIVE ATS DASHBOARD
      </h4>
      <AtsRing score={atsScore} />
      <div className="nx-ats-factors">
        {atsFactors.length === 0 && (
          <div className="nx-ats-factor">
            <div className="nx-factor-icon nx-factor-bad">
              <XIcon size={14} />
            </div>
            <div className="nx-factor-info">
              <div className="nx-name">No data yet</div>
              <div className="nx-desc">Fill the form to see analysis</div>
            </div>
          </div>
        )}
        {atsFactors.map((f, i) => (
          <div className="nx-ats-factor" key={i}>
            <div className={`nx-factor-icon nx-factor-${f.status}`}>
              {f.icon === "check" && <CheckCircle2 size={14} />}
              {f.icon === "circle-exclamation" && <CircleAlert size={14} />}
              {f.icon === "times" && <XIcon size={14} />}
            </div>
            <div className="nx-factor-info">
              <div className="nx-name">{f.name}</div>
              <div className="nx-desc">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const tipIcons: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  lightbulb: Lightbulb,
  code: Code,
  briefcase: Briefcase,
  cube: Box,
  "chart-line": TrendingUp,
  linkedin: Linkedin,
  "check-circle": CheckCircle2,
};

function AiTips() {
  const { data } = useResumeStore();
  const [tips, setTips] = useState<AiTip[]>([]);

  useEffect(() => {
    setTips(generateAiTips(data));
  }, [data]);

  return (
    <div className="nx-ai-panel nx-holo-border">
      <div className="nx-ai-header">
        <div className="nx-ai-icon">
          <Bot size={20} color="var(--nx-navy)" />
        </div>
        <div>
          <h4>AI ASSISTANT</h4>
          <p>Real-time tips &amp; recommendations</p>
        </div>
      </div>
      <div>
        {tips.map((t, i) => {
          const Icon = tipIcons[t.icon] || Lightbulb;
          return (
            <div className="nx-ai-suggestion" key={i}>
              <Icon size={16} color="var(--nx-cyan)" />
              <div>{t.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PreviewPanel() {
  const {
    activePreviewTab,
    setPreviewTab,
    selectedTemplate,
    setSelectedTemplate,
    previewZoom,
    setPreviewZoom,
    setShowFullPreview,
    showFullPreview,
  } = useResumeStore();

  return (
    <div className="nx-preview-container">
      <div className="nx-preview-tabs">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              className={`nx-preview-tab ${activePreviewTab === t.id ? "active" : ""}`}
              onClick={() => setPreviewTab(t.id)}
              type="button"
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {activePreviewTab === "preview" && (
        <>
          <div className="nx-preview-controls">
            <select
              className="nx-preview-tpl-select"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              aria-label="Select template"
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <button
              className="nx-preview-zoom-btn"
              onClick={() => setPreviewZoom(previewZoom - 0.1)}
              type="button"
              aria-label="Zoom out"
            >
              <ZoomOut size={15} />
            </button>
            <span className="nx-preview-zoom-label">{Math.round(previewZoom * 100)}%</span>
            <button
              className="nx-preview-zoom-btn"
              onClick={() => setPreviewZoom(previewZoom + 0.1)}
              type="button"
              aria-label="Zoom in"
            >
              <ZoomIn size={15} />
            </button>
            <button
              className="nx-preview-full-btn"
              onClick={() => setShowFullPreview(true)}
              type="button"
            >
              <Maximize2 size={13} /> Full View
            </button>
          </div>
          <div className="nx-preview-scroll-wrap">
            <div className="nx-preview-a4">
              <ResumePreviewContent />
            </div>
          </div>
        </>
      )}

      {activePreviewTab === "ats" && <AtsDashboard />}
      {activePreviewTab === "ai" && <AiTips />}

      {showFullPreview && <FullPreviewModal onClose={() => setShowFullPreview(false)} />}
    </div>
  );
}
