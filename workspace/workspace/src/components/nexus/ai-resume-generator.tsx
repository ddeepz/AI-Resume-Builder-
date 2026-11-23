"use client";

import { useState } from "react";
import {
  Sparkles,
  Wand2,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useResumeStore, emptyEducation, emptyExperience, emptyProject, emptyCertificate, emptyAchievement } from "@/lib/resume-store";
import { useToast } from "./toasts";
import AILoading from "./ai-loading";
import type { ResumeData } from "@/lib/resume-store";

interface GeneratedResume {
  summary: string;
  objective: string;
  education: { college: string; degree: string; department: string; year: string; cgpa: string }[];
  skills: { technical: string[]; programming: string[]; soft: string[] };
  projects: { title: string; description: string; technologies: string }[];
  experience: { company: string; position: string; duration: string; responsibilities: string }[];
  certificates: { name: string; organization: string; year: string }[];
  achievements: { title: string; description: string }[];
  languages: string;
  missingInfo: string[];
}

const EXAMPLES = [
  "Create a professional resume for a fresher applying for a Graphic Designer position. I have knowledge of Photoshop, Canva, Figma, UI/UX design and basic HTML.",
  "I'm a software developer with 3 years of experience in React, Node.js and AWS. I've built e-commerce and SaaS dashboards. Looking for a senior frontend role.",
  "Recent computer science graduate with internship experience at a startup. Skills: Python, SQL, machine learning basics. Applying for data analyst roles.",
  "Marketing professional with 5 years of experience in digital campaigns, SEO and content strategy. Led a team of 4 at a B2B SaaS company.",
];

function scrollToSection(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function AiResumeGenerator() {
  const { setView, setData, setSummary, setObjective } = useResumeStore();
  const toast = useToast();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResume | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!prompt.trim()) {
      toast("Please describe your profile first.", "info");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/ai/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to generate resume");
      setResult(json as GeneratedResume);
      toast("Resume generated! Review and load it into the editor.", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to generate resume";
      setError(msg);
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const loadIntoEditor = () => {
    if (!result) return;
    const uid = () => Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
    const data: ResumeData = {
      personal: {
        name: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        portfolio: "",
        jobTitle: "",
        photo: "",
      },
      summary: result.summary || "",
      objective: result.objective || "",
      education: (result.education.length ? result.education : [{ college: "", degree: "", department: "", year: "", cgpa: "" }]).map((e) => ({
        id: uid(),
        ...e,
      })),
      skills: {
        technical: result.skills.technical || [],
        programming: result.skills.programming || [],
        soft: result.skills.soft || [],
      },
      experience: (result.experience.length ? result.experience : [emptyExperience()]).map((e) => ({
        id: uid(),
        ...e,
      })),
      projects: (result.projects.length ? result.projects : [emptyProject()]).map((p) => ({
        id: uid(),
        ...p,
      })),
      certificates: (result.certificates.length ? result.certificates : [emptyCertificate()]).map((c) => ({
        id: uid(),
        ...c,
      })),
      achievements: (result.achievements || []).map((a) => ({ id: uid(), ...a })),
      languages: result.languages || "",
    };
    setData(data);
    setSummary(data.summary);
    setObjective(data.objective);
    toast("Resume loaded into the editor!", "success");
    setView("editor");
  };

  return (
    <section className="nx-section" style={{ paddingTop: "120px" }}>
      <button className="nx-back-btn" onClick={() => setView("dashboard")} type="button">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div className="nx-hero-badge" style={{ margin: "0 auto 16px" }}>
          <Sparkles size={12} /> Powered by Advanced AI
        </div>
        <h2 className="nx-section-title nx-gradient-animate" style={{ fontSize: "clamp(26px, 4.5vw, 40px)" }}>
          ONE-PROMPT AI RESUME GENERATOR
        </h2>
        <p className="nx-section-subtitle">
          Describe your profile in plain English. AI builds a complete, professional, ATS-friendly resume.
        </p>
      </div>

      <div className="nx-glass-strong" style={{ maxWidth: "900px", margin: "0 auto", padding: "32px", borderRadius: "24px" }}>
        <label style={{ fontSize: "13px", color: "var(--nx-ice)", fontWeight: 600, display: "block", marginBottom: "10px" }}>
          Describe yourself, your target role, skills and experience
        </label>
        <textarea
          className="nx-input-field"
          placeholder="Example: Create a professional resume for a fresher applying for a Graphic Designer position. I have knowledge of Photoshop, Canva, Figma, UI/UX design and basic HTML."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          style={{ width: "100%", minHeight: "120px", resize: "vertical" }}
        />

        <div style={{ marginTop: "16px" }}>
          <div style={{ fontSize: "11px", color: "rgba(248,253,255,0.5)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Info size={12} color="var(--nx-cyan)" /> Try one of these examples:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                className="nx-tpl-chip"
                onClick={() => setPrompt(ex)}
                type="button"
                style={{ fontSize: "11px", maxWidth: "100%", textAlign: "left" }}
              >
                {ex.slice(0, 60)}...
              </button>
            ))}
          </div>
        </div>

        <button
          className="nx-btn-primary"
          onClick={generate}
          disabled={loading}
          type="button"
          style={{ width: "100%", marginTop: "20px", padding: "16px", fontSize: "15px" }}
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="animate-spin" /> Generating Resume...
            </>
          ) : (
            <>
              <Wand2 size={16} /> Generate My Resume
            </>
          )}
        </button>

        {error && (
          <div className="nx-ai-suggestion" style={{ marginTop: "16px", background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)" }}>
            <AlertCircle size={18} color="#ef4444" />
            <div style={{ fontSize: "13px", color: "#fca5a5" }}>{error}</div>
          </div>
        )}
      </div>

      {/* Result preview */}
      {result && !loading && (
        <div className="nx-glass-strong" style={{ maxWidth: "900px", margin: "24px auto", padding: "32px", borderRadius: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
            <h3 style={{ fontFamily: "var(--font-orbitron)", fontSize: "16px", color: "var(--nx-frost)", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle2 size={18} color="#4ade80" /> GENERATED RESUME PREVIEW
            </h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="nx-tpl-btn" onClick={generate} type="button">
                <RefreshCw size={13} /> Regenerate
              </button>
              <button className="nx-tpl-btn nx-tpl-btn-primary" onClick={loadIntoEditor} type="button">
                Open in Editor <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {result.missingInfo.length > 0 && (
            <div className="nx-ai-suggestion" style={{ background: "rgba(251,191,36,0.1)", borderColor: "rgba(251,191,36,0.3)", marginBottom: "16px" }}>
              <AlertCircle size={18} color="#fbbf24" />
              <div>
                <strong style={{ color: "#fde68a" }}>Missing information:</strong>
                <span style={{ color: "rgba(248,253,255,0.7)", fontSize: "13px" }}> {result.missingInfo.join(", ")}</span>
                <div style={{ fontSize: "12px", color: "rgba(248,253,255,0.5)", marginTop: "4px" }}>
                  You can add these in the editor after loading the resume.
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "grid", gap: "16px" }}>
            {result.summary && (
              <div>
                <h4 style={{ fontSize: "11px", color: "var(--nx-cyan)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Summary</h4>
                <p style={{ fontSize: "13px", color: "rgba(248,253,255,0.8)", lineHeight: 1.6 }}>{result.summary}</p>
              </div>
            )}
            {result.objective && (
              <div>
                <h4 style={{ fontSize: "11px", color: "var(--nx-cyan)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Objective</h4>
                <p style={{ fontSize: "13px", color: "rgba(248,253,255,0.8)", lineHeight: 1.6 }}>{result.objective}</p>
              </div>
            )}
            {result.skills.technical.length + result.skills.programming.length + result.skills.soft.length > 0 && (
              <div>
                <h4 style={{ fontSize: "11px", color: "var(--nx-cyan)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Skills</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {[...result.skills.technical, ...result.skills.programming, ...result.skills.soft].map((s, i) => (
                    <span key={i} style={{ fontSize: "11px", padding: "4px 10px", background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)", borderRadius: "12px", color: "var(--nx-ice)" }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
            {result.experience.filter((e) => e.company).length > 0 && (
              <div>
                <h4 style={{ fontSize: "11px", color: "var(--nx-cyan)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Experience</h4>
                {result.experience.filter((e) => e.company).map((e, i) => (
                  <div key={i} style={{ fontSize: "13px", color: "rgba(248,253,255,0.8)", marginBottom: "8px" }}>
                    <strong>{e.position}</strong> at {e.company} ({e.duration})
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: "4px 0 0", fontSize: "12px", color: "rgba(248,253,255,0.6)" }}>{e.responsibilities}</pre>
                  </div>
                ))}
              </div>
            )}
            {result.projects.filter((p) => p.title).length > 0 && (
              <div>
                <h4 style={{ fontSize: "11px", color: "var(--nx-cyan)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Projects</h4>
                {result.projects.filter((p) => p.title).map((p, i) => (
                  <div key={i} style={{ fontSize: "13px", color: "rgba(248,253,255,0.8)", marginBottom: "6px" }}>
                    <strong>{p.title}</strong> — {p.description}
                    {p.technologies && <span style={{ color: "var(--nx-cyan)", fontSize: "12px" }}> ({p.technologies})</span>}
                  </div>
                ))}
              </div>
            )}
            {result.education.filter((e) => e.college).length > 0 && (
              <div>
                <h4 style={{ fontSize: "11px", color: "var(--nx-cyan)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Education</h4>
                {result.education.filter((e) => e.college).map((e, i) => (
                  <div key={i} style={{ fontSize: "13px", color: "rgba(248,253,255,0.8)" }}>
                    <strong>{e.degree}</strong> in {e.department}, {e.college} ({e.year}){e.cgpa && ` — ${e.cgpa}`}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="nx-btn-primary"
            onClick={loadIntoEditor}
            type="button"
            style={{ width: "100%", marginTop: "24px", padding: "14px" }}
          >
            <ArrowRight size={16} /> Load This Resume Into Editor
          </button>
        </div>
      )}

      <AILoading show={loading} text="NEXUS AI is generating your complete resume" duration={5000} />
    </section>
  );
}
