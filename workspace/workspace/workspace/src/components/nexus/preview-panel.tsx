"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  TrendingUp,
  Bot,
  Mail,
  Phone,
  MapPin,
  Globe,
  FilePlus2,
  Lightbulb,
  Code,
  Briefcase,
  Box,
  CheckCircle2,
  CircleAlert,
  X as XIcon,
  Linkedin,
} from "lucide-react";
import { useResumeStore } from "@/lib/resume-store";
import { calculateAts, generateAiTips, type AiTip } from "@/lib/ats";

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

function ResumePreview() {
  const { data } = useResumeStore();
  const p = data.personal;

  if (!p.name && !p.email) {
    return (
      <div className="nx-resume-preview">
        <div className="nx-empty-state">
          <FilePlus2 size={48} color="#cbd5e1" style={{ margin: "0 auto 15px" }} />
          <p>Start filling the form to see your resume preview here</p>
        </div>
      </div>
    );
  }

  const allSkills = [...data.skills.technical, ...data.skills.programming];

  return (
    <div className="nx-resume-preview">
      <h1>{p.name || "Your Name"}</h1>
      <p style={{ fontSize: "14px", color: "#0891b2", fontWeight: 600, marginBottom: "15px" }}>
        {p.jobTitle || "Professional Title"}
      </p>

      <div className="nx-contact-info">
        {p.email && (
          <span>
            <Mail size={11} /> {p.email}
          </span>
        )}
        {p.phone && (
          <span>
            <Phone size={11} /> {p.phone}
          </span>
        )}
        {p.location && (
          <span>
            <MapPin size={11} /> {p.location}
          </span>
        )}
        {p.linkedin && (
          <span>
            <Linkedin size={11} /> {p.linkedin}
          </span>
        )}
        {p.portfolio && (
          <span>
            <Globe size={11} /> {p.portfolio}
          </span>
        )}
      </div>

      {data.summary && (
        <div className="nx-section-block">
          <h2>Professional Summary</h2>
          <div className="nx-summary-box">{data.summary}</div>
        </div>
      )}

      {data.education.some((e) => e.college) && (
        <div className="nx-section-block">
          <h2>Education</h2>
          {data.education.map(
            (e, i) =>
              (e.college || e.degree) && (
                <div key={i}>
                  <h3>
                    {e.degree || ""} {e.department ? "in " + e.department : ""}
                  </h3>
                  <div className="nx-item-meta">
                    <span>{e.college || ""}</span>
                    <span>{e.year || ""}</span>
                  </div>
                  {e.cgpa && (
                    <p>
                      <strong>Score:</strong> {e.cgpa}
                    </p>
                  )}
                </div>
              )
          )}
        </div>
      )}

      {(allSkills.length > 0 || data.skills.soft.length > 0) && (
        <div className="nx-section-block">
          <h2>Skills</h2>
          {allSkills.length > 0 && (
            <>
              <p style={{ fontWeight: 600, marginBottom: "5px" }}>Technical &amp; Programming</p>
              <div className="nx-skill-tags">
                {allSkills.map((s, i) => (
                  <span className="nx-skill-tag" key={s + i}>
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}
          {data.skills.soft.length > 0 && (
            <>
              <p style={{ fontWeight: 600, marginBottom: "5px" }}>Soft Skills</p>
              <div className="nx-skill-tags">
                {data.skills.soft.map((s, i) => (
                  <span className="nx-skill-tag" key={s + i}>
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {data.experience.some((e) => e.company) && (
        <div className="nx-section-block">
          <h2>Experience</h2>
          {data.experience.map(
            (e, i) =>
              (e.company || e.position) && (
                <div key={i}>
                  <h3>{e.position || ""}</h3>
                  <div className="nx-item-meta">
                    <span>{e.company || ""}</span>
                    <span>{e.duration || ""}</span>
                  </div>
                  {e.responsibilities && (
                    <p style={{ whiteSpace: "pre-line" }}>{e.responsibilities}</p>
                  )}
                </div>
              )
          )}
        </div>
      )}

      {data.projects.some((pr) => pr.title) && (
        <div className="nx-section-block">
          <h2>Projects</h2>
          {data.projects.map(
            (pr, i) =>
              pr.title && (
                <div key={i}>
                  <h3>{pr.title}</h3>
                  {pr.technologies && (
                    <p style={{ color: "#0891b2", fontSize: "12px" }}>
                      <strong>Tech:</strong> {pr.technologies}
                    </p>
                  )}
                  {pr.description && <p>{pr.description}</p>}
                </div>
              )
          )}
        </div>
      )}

      {data.certificates.some((c) => c.name) && (
        <div className="nx-section-block">
          <h2>Certifications</h2>
          {data.certificates.map(
            (c, i) =>
              c.name && (
                <div key={i}>
                  <h3>{c.name}</h3>
                  <div className="nx-item-meta">
                    <span>{c.organization || ""}</span>
                    <span>{c.year || ""}</span>
                  </div>
                </div>
              )
          )}
        </div>
      )}

      {data.languages && (
        <div className="nx-section-block">
          <h2>Languages</h2>
          <p>{data.languages}</p>
        </div>
      )}
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
  const { activePreviewTab, setPreviewTab } = useResumeStore();

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

      {activePreviewTab === "preview" && <ResumePreview />}
      {activePreviewTab === "ats" && <AtsDashboard />}
      {activePreviewTab === "ai" && <AiTips />}
    </div>
  );
}
