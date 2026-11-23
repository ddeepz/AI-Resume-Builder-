"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Wand2,
  RefreshCw,
  Copy,
  Check,
  Plus,
  Sparkles,
  FileText,
  Target,
  Briefcase,
  Code,
  Box,
  Mail,
} from "lucide-react";
import { useResumeStore } from "@/lib/resume-store";
import { useToast } from "./toasts";

type ContentType =
  | "summary"
  | "objective"
  | "job-description"
  | "skills-description"
  | "project-description"
  | "cover-letter"
  | "work-experience";

const GENERATORS: {
  id: ContentType;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  desc: string;
  placeholder: string;
  targetField: "summary" | "objective" | "append-experience" | "append-project" | "cover-letter" | "skills-desc";
}[] = [
  { id: "summary", label: "Professional Summary", icon: Sparkles, desc: "2-3 sentence professional summary", placeholder: "e.g. Senior frontend developer with 5 years in React and TypeScript", targetField: "summary" },
  { id: "objective", label: "Career Objective", icon: Target, desc: "1-2 sentence focused career objective", placeholder: "e.g. Recent CS graduate seeking a data analyst role", targetField: "objective" },
  { id: "job-description", label: "Job Description", icon: Briefcase, desc: "Bullet points for a role you're hiring for", placeholder: "e.g. Senior Product Manager for a B2B SaaS platform", targetField: "cover-letter" },
  { id: "skills-description", label: "Skills Description", icon: Code, desc: "Contextualises your skills for a role", placeholder: "e.g. Full-stack developer skilled in React, Node.js and AWS", targetField: "skills-desc" },
  { id: "project-description", label: "Project Description", icon: Box, desc: "Compelling project write-up", placeholder: "e.g. Built an AI resume builder with Next.js and OpenAI", targetField: "append-project" },
  { id: "cover-letter", label: "Cover Letter", icon: Mail, desc: "3-paragraph personalized cover letter", placeholder: "e.g. Cover letter for a software engineer role at Google", targetField: "cover-letter" },
  { id: "work-experience", label: "Work Experience", icon: FileText, desc: "Bullet points for a past role", placeholder: "e.g. Software Engineer at Microsoft, built Azure dashboards", targetField: "append-experience" },
];

export default function AiContentWorkspace() {
  const { setView, data, setSummary, setObjective, addExperience, updateExperience, addProject, updateProject } = useResumeStore();
  const toast = useToast();
  const [active, setActive] = useState<ContentType>("summary");
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const gen = GENERATORS.find((g) => g.id === active)!;

  const generate = async () => {
    if (!prompt.trim()) {
      toast("Enter a prompt first.", "info");
      return;
    }
    setLoading(true);
    setOutput(null);
    try {
      const res = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: active,
          prompt,
          context: {
            name: data.personal.name,
            jobTitle: data.personal.jobTitle,
            skills: [...data.skills.technical, ...data.skills.programming, ...data.skills.soft],
            experience: data.experience,
            projects: data.projects,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to generate content");
      setOutput(json.content);
      toast("Content generated!", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const regenerate = () => {
    if (!prompt.trim()) return;
    generate();
  };

  const copy = () => {
    if (!output || typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      toast("Copied to clipboard.", "success");
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const addToResume = () => {
    if (!output) return;
    switch (gen.targetField) {
      case "summary":
        setSummary(output);
        toast("Added to Professional Summary.", "success");
        break;
      case "objective":
        setObjective(output);
        toast("Added to Career Objective.", "success");
        break;
      case "append-experience": {
        addExperience();
        const exp = useResumeStore.getState().data.experience;
        const last = exp[exp.length - 1];
        if (last) updateExperience(last.id, { responsibilities: output });
        toast("Added to a new experience entry.", "success");
        break;
      }
      case "append-project": {
        addProject();
        const proj = useResumeStore.getState().data.projects;
        const last = proj[proj.length - 1];
        if (last) updateProject(last.id, { description: output });
        toast("Added to a new project entry.", "success");
        break;
      }
      case "skills-desc":
      case "cover-letter":
      default:
        copy();
        toast("Copied — paste it where you need it.", "info");
        break;
    }
  };

  return (
    <section className="nx-section" style={{ paddingTop: "120px" }}>
      <button className="nx-back-btn" onClick={() => setView("dashboard")} type="button">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <div className="nx-hero-badge" style={{ margin: "0 auto 16px" }}>
          <Sparkles size={12} /> AI Workspace
        </div>
        <h2 className="nx-section-title nx-gradient-animate" style={{ fontSize: "clamp(26px, 4.5vw, 40px)" }}>
          AI CONTENT GENERATION
        </h2>
        <p className="nx-section-subtitle">
          Generate professional content for every part of your resume. Add it directly with one click.
        </p>
      </div>

      <div className="nx-ai-workspace-layout">
        {/* Left: generator list */}
        <aside className="nx-glass-strong nx-ai-workspace-sidebar">
          <h3 style={{ fontFamily: "var(--font-orbitron)", fontSize: "12px", color: "var(--nx-cyan)", letterSpacing: "1px", marginBottom: "12px" }}>
            GENERATORS
          </h3>
          <div className="nx-ai-gen-list">
            {GENERATORS.map((g) => {
              const Icon = g.icon;
              return (
                <button
                  key={g.id}
                  className={`nx-ai-gen-item ${active === g.id ? "active" : ""}`}
                  onClick={() => { setActive(g.id); setOutput(null); setPrompt(""); }}
                  type="button"
                >
                  <Icon size={14} />
                  <div>
                    <div style={{ fontSize: "12px", color: "var(--nx-ice)", fontWeight: 600 }}>{g.label}</div>
                    <div style={{ fontSize: "10px", color: "rgba(248,253,255,0.4)" }}>{g.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right: workspace */}
        <div className="nx-glass-strong nx-ai-workspace-main">
          <div className="nx-ai-workspace-header">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="nx-icon-orb" style={{ width: "32px", height: "32px" }}>
                <gen.icon size={16} />
              </div>
              <div>
                <h3 style={{ fontSize: "15px", color: "var(--nx-frost)", fontWeight: 700 }}>{gen.label} Generator</h3>
                <p style={{ fontSize: "11px", color: "rgba(248,253,255,0.5)" }}>{gen.desc}</p>
              </div>
            </div>
          </div>

          <label style={{ fontSize: "12px", color: "var(--nx-ice)", fontWeight: 600, display: "block", marginBottom: "6px" }}>
            Your prompt
          </label>
          <textarea
            className="nx-input-field"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={gen.placeholder}
            rows={3}
            style={{ width: "100%", resize: "vertical", fontSize: "13px" }}
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
            <button className="nx-tpl-btn nx-tpl-btn-primary" onClick={generate} disabled={loading} type="button">
              {loading ? <RefreshCw size={13} className="animate-spin" /> : <Wand2 size={13} />}
              {loading ? "Generating..." : "Generate"}
            </button>
            {output && (
              <>
                <button className="nx-tpl-btn" onClick={regenerate} disabled={loading} type="button">
                  <RefreshCw size={13} /> Regenerate
                </button>
                <button className="nx-tpl-btn" onClick={copy} type="button">
                  {copied ? <Check size={13} /> : <Copy size={13} />} Copy
                </button>
                <button className="nx-tpl-btn nx-tpl-btn-primary" onClick={addToResume} type="button">
                  <Plus size={13} /> Add to Resume
                </button>
              </>
            )}
          </div>

          {loading && (
            <div className="nx-typing-indicator" style={{ marginTop: "20px" }}>
              <div className="nx-typing-dot" /><div className="nx-typing-dot" /><div className="nx-typing-dot" />
            </div>
          )}

          {output && !loading && (
            <div className="nx-ai-output-block">
              <div style={{ fontSize: "11px", color: "var(--nx-cyan)", marginBottom: "8px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
                Generated Content
              </div>
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "13px", color: "var(--nx-ice)", lineHeight: 1.6, margin: 0 }}>
                {output}
              </pre>
              <p style={{ fontSize: "11px", color: "rgba(248,253,255,0.4)", marginTop: "12px" }}>
                Review the content, then click <strong>Add to Resume</strong> to insert it into the matching section. You can edit it further in the resume editor.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
