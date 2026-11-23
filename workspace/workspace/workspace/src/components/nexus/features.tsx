"use client";

import {
  Brain,
  TrendingUp,
  FileText,
  Lightbulb,
  Eye,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI CONTENT GENERATION",
    desc: "Smart AI engine generates professional summaries, bullet points, and descriptions tailored to your role and industry.",
    bg: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(167,139,250,0.15))",
  },
  {
    icon: TrendingUp,
    title: "ATS SCORE ANALYSIS",
    desc: "Real-time Applicant Tracking System scoring with actionable insights to optimize your resume for any job.",
    bg: "linear-gradient(135deg, rgba(167,139,250,0.15), rgba(34,211,238,0.15))",
  },
  {
    icon: FileText,
    title: "PDF EXPORT",
    desc: "Download polished, ATS-friendly PDF resumes with a single click. Professional formatting guaranteed.",
    bg: "linear-gradient(135deg, rgba(96,165,250,0.15), rgba(196,181,253,0.15))",
  },
  {
    icon: Lightbulb,
    title: "SMART SUGGESTIONS",
    desc: "Context-aware recommendations for skills, keywords, and improvements based on your target position.",
    bg: "linear-gradient(135deg, rgba(165,243,252,0.15), rgba(167,139,250,0.15))",
  },
  {
    icon: Eye,
    title: "LIVE PREVIEW",
    desc: "Watch your resume come to life in real-time with instant updates as you type every field.",
    bg: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(96,165,250,0.15))",
  },
  {
    icon: ShieldCheck,
    title: "PRIVACY FIRST",
    desc: "Your data never leaves your browser. All processing happens locally for complete privacy and security.",
    bg: "linear-gradient(135deg, rgba(196,181,253,0.15), rgba(165,243,252,0.15))",
  },
];

export default function Features() {
  return (
    <section className="nx-section" id="features">
      <h2 className="nx-section-title">AI-POWERED FEATURES</h2>
      <p className="nx-section-subtitle">Next-generation tools to craft the perfect resume</p>

      <div className="nx-features-grid">
        {features.map((f) => (
          <div key={f.title} className="nx-glass-card nx-feature-card">
            <div className="nx-feature-icon-3d">
              <div className="nx-icon-orb" style={{ background: f.bg }}>
                <f.icon size={32} color="var(--nx-ice)" strokeWidth={1.8} />
              </div>
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
