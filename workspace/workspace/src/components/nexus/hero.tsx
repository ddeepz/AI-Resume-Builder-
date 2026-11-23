"use client";

import { Rocket, Sparkles } from "lucide-react";
import { useResumeStore } from "@/lib/resume-store";

export default function Hero() {
  const { setView } = useResumeStore();

  return (
    <section className="nx-hero" id="home">
      {/* AI Robot on the left */}
      <div className="nx-hero-robot-wrap">
        <div className="nx-hero-robot-glow" />
        <div
          className="nx-hero-orbit-2"
          style={{
            position: "absolute",
            inset: "-50px",
            border: "1px dotted rgba(167,139,250,0.15)",
            borderRadius: "50%",
            animation: "nx-orbit-spin 25s linear infinite reverse",
          }}
        />
        <div className="nx-hero-orbit" />
        <div className="nx-robot-eyes-glow" />
        <div className="nx-greeting-bubble">Hello! Let's build your resume</div>
        <img
          src="/ai-robot-glow.png"
          alt="NEXUS AI Robot Assistant"
          className="nx-hero-robot-img"
          draggable={false}
        />
      </div>

      <div className="nx-hero-content">
        <div className="nx-hero-badge">
          <div className="nx-pulse-dot" />
          Powered by Advanced AI
        </div>

        <h1 className="nx-hero-title nx-gradient-animate">
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
          <button className="nx-btn-primary" onClick={() => setView("ai-generator")}>
            <Rocket size={16} />
            Start Building Resume
          </button>
          <button className="nx-btn-secondary" onClick={() => setView("dashboard")}>
            <Sparkles size={16} />
            Explore Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}
