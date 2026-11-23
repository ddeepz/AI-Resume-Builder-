"use client";

import { Rocket, Sparkles } from "lucide-react";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  return (
    <section className="nx-hero" id="home">
      {/* Floating Resume Cards */}
      <div className="nx-floating-resume nx-glass-card nx-glass-reflection">
        <div style={{ padding: "25px" }}>
          <div
            style={{
              width: "60%",
              height: "8px",
              background: "linear-gradient(90deg, var(--nx-cyan), var(--nx-purple))",
              borderRadius: "4px",
              marginBottom: "15px",
            }}
          />
          <div
            style={{
              width: "40%",
              height: "6px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "4px",
              marginBottom: "20px",
            }}
          />
          <div style={{ display: "grid", gap: "8px" }}>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }} />
            <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", width: "90%" }} />
            <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", width: "75%" }} />
          </div>
          <div style={{ marginTop: "20px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <div style={{ padding: "3px 10px", background: "rgba(34,211,238,0.2)", borderRadius: "20px", fontSize: "8px", color: "var(--nx-ice)" }}>
              SKILL
            </div>
            <div style={{ padding: "3px 10px", background: "rgba(167,139,250,0.2)", borderRadius: "20px", fontSize: "8px", color: "var(--nx-lavender)" }}>
              AI
            </div>
            <div style={{ padding: "3px 10px", background: "rgba(96,165,250,0.2)", borderRadius: "20px", fontSize: "8px", color: "var(--nx-holo)" }}>
              TECH
            </div>
          </div>
        </div>
      </div>

      <div className="nx-floating-resume-2 nx-glass-card nx-glass-reflection">
        <div style={{ padding: "22px" }}>
          <div
            style={{
              width: "50%",
              height: "7px",
              background: "linear-gradient(90deg, var(--nx-purple), var(--nx-cyan))",
              borderRadius: "4px",
              marginBottom: "12px",
            }}
          />
          <div style={{ display: "grid", gap: "6px" }}>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }} />
            <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", width: "85%" }} />
            <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", width: "70%" }} />
          </div>
        </div>
      </div>

      <div className="nx-hero-content">
        {/* 3D Brain */}
        <div className="nx-brain-3d">
          <div className="nx-brain-orb">
            <svg viewBox="0 0 200 200">
              <defs>
                <radialGradient id="nxBrainGrad" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#A5F3FC" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.2" />
                </radialGradient>
                <filter id="nxBrainGlow">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#nxBrainGlow)">
                <ellipse cx="100" cy="100" rx="60" ry="55" fill="url(#nxBrainGrad)" stroke="#22D3EE" strokeWidth="1.5" opacity="0.8" />
                <path
                  d="M100,45 Q80,50 75,70 Q60,80 65,100 Q60,120 75,135 Q80,155 100,155 Q120,155 125,135 Q140,120 135,100 Q140,80 125,70 Q120,50 100,45"
                  fill="none"
                  stroke="#A5F3FC"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <line x1="100" y1="45" x2="100" y2="155" stroke="#22D3EE" strokeWidth="1" opacity="0.4" />
                <path d="M70,80 Q85,90 75,110" fill="none" stroke="#A5F3FC" strokeWidth="0.8" opacity="0.5" />
                <path d="M130,80 Q115,90 125,110" fill="none" stroke="#A5F3FC" strokeWidth="0.8" opacity="0.5" />
                <circle cx="80" cy="95" r="4" fill="#A5F3FC" opacity="0.8">
                  <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="120" cy="95" r="4" fill="#A5F3FC" opacity="0.8">
                  <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="120" r="3" fill="#C4B5FD" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
              <circle cx="100" cy="40" r="2" fill="#22D3EE">
                <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="8s" repeatCount="indefinite" />
              </circle>
              <circle cx="100" cy="160" r="2" fill="#A78BFA">
                <animateTransform attributeName="transform" type="rotate" from="180 100 100" to="540 100 100" dur="8s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
        </div>

        <div className="nx-hero-badge">
          <div className="nx-pulse-dot" />
          Powered by Advanced AI
        </div>

        <h1 className="nx-hero-title">
          BUILD YOUR FUTURE
          <br />
          WITH AI
        </h1>
        <p className="nx-hero-subtitle">
          Create smarter, faster, and professional resumes with the power of Artificial Intelligence.
          Experience the next generation of resume building with real-time ATS scoring, AI-generated
          content, and stunning 3D visual design.
        </p>

        <div className="nx-hero-buttons">
          <button className="nx-btn-primary" onClick={() => scrollToSection("builder")}>
            <Rocket size={16} />
            Start Building Resume
          </button>
          <button className="nx-btn-secondary" onClick={() => scrollToSection("features")}>
            <Sparkles size={16} />
            Explore Features
          </button>
        </div>
      </div>
    </section>
  );
}
