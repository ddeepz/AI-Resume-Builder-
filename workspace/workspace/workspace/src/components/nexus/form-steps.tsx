"use client";

import { useState, useRef } from "react";
import {
  UserRound,
  GraduationCap,
  Code,
  Briefcase,
  Box,
  Award,
  Trophy,
  Info,
  PlusCircle,
  X,
  Wand2,
  Sparkles,
  RefreshCw,
  Download,
  PieChart,
  Brain,
  CheckCircle2,
} from "lucide-react";
import { useResumeStore } from "@/lib/resume-store";
import { useToast } from "./toasts";
import { calculateAts } from "@/lib/ats";
import { exportToPDF } from "@/lib/pdf-export";

/* ---------- Shared bits ---------- */

function FormHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="nx-form-header">
      <div className="nx-form-header-icon">
        <Icon size={24} color="var(--nx-ice)" strokeWidth={1.8} />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label>{children}</label>;
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="nx-remove-btn" onClick={onClick} aria-label="Remove" type="button">
      <X size={14} />
    </button>
  );
}

function AddItemButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button className="nx-add-item-btn" onClick={onClick} type="button">
      <PlusCircle size={16} />
      {label}
    </button>
  );
}

/* ---------- Step 1: Personal ---------- */
export function PersonalStep() {
  const { data, setPersonal } = useResumeStore();
  const p = data.personal;
  const fields: { key: keyof typeof p; label: string; placeholder: string; type?: string }[] = [
    { key: "name", label: "Full Name *", placeholder: "John Doe" },
    { key: "email", label: "Email *", placeholder: "john@example.com", type: "email" },
    { key: "phone", label: "Phone", placeholder: "+1 234 567 890", type: "tel" },
    { key: "location", label: "Location", placeholder: "San Francisco, CA" },
    { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/johndoe" },
    { key: "portfolio", label: "Portfolio", placeholder: "johndoe.dev" },
  ];

  return (
    <div className="nx-form-step active">
      <FormHeader
        icon={UserRound}
        title="Personal Information"
        subtitle="Let's start with your basic details"
      />
      <div className="nx-form-grid">
        {fields.map((f) => (
          <div className="nx-input-group" key={f.key}>
            <Label>{f.label}</Label>
            <input
              type={f.type || "text"}
              className="nx-input-field"
              placeholder={f.placeholder}
              value={p[f.key]}
              onChange={(e) => setPersonal({ [f.key]: e.target.value } as Partial<typeof p>)}
            />
          </div>
        ))}
      </div>
      <div className="nx-input-group">
        <Label>Target Job Title</Label>
        <input
          type="text"
          className="nx-input-field"
          placeholder="Software Engineer"
          value={p.jobTitle}
          onChange={(e) => setPersonal({ jobTitle: e.target.value })}
        />
        <p style={{ fontSize: "11px", color: "rgba(248,253,255,0.4)", marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
          <Info size={12} color="var(--nx-cyan)" />
          AI uses this to generate tailored content and skill suggestions
        </p>
      </div>
    </div>
  );
}

/* ---------- Step 2: Education ---------- */
export function EducationStep() {
  const { data, updateEducation, addEducation, removeEducation } = useResumeStore();
  return (
    <div className="nx-form-step active">
      <FormHeader icon={GraduationCap} title="Education" subtitle="Add your academic background" />
      <div>
        {data.education.map((e) => (
          <div className="nx-repeatable-item" key={e.id}>
            <RemoveButton onClick={() => removeEducation(e.id)} />
            <div className="nx-form-grid">
              <div className="nx-input-group">
                <Label>College/University</Label>
                <input
                  className="nx-input-field"
                  placeholder="Harvard University"
                  value={e.college}
                  onChange={(ev) => updateEducation(e.id, { college: ev.target.value })}
                />
              </div>
              <div className="nx-input-group">
                <Label>Degree</Label>
                <input
                  className="nx-input-field"
                  placeholder="B.Tech"
                  value={e.degree}
                  onChange={(ev) => updateEducation(e.id, { degree: ev.target.value })}
                />
              </div>
              <div className="nx-input-group">
                <Label>Department/Field</Label>
                <input
                  className="nx-input-field"
                  placeholder="Computer Science"
                  value={e.department}
                  onChange={(ev) => updateEducation(e.id, { department: ev.target.value })}
                />
              </div>
              <div className="nx-input-group">
                <Label>Graduation Year</Label>
                <input
                  className="nx-input-field"
                  placeholder="2024"
                  value={e.year}
                  onChange={(ev) => updateEducation(e.id, { year: ev.target.value })}
                />
              </div>
              <div className="nx-input-group" style={{ gridColumn: "span 2" }}>
                <Label>Percentage / CGPA</Label>
                <input
                  className="nx-input-field"
                  placeholder="8.5 CGPA / 85%"
                  value={e.cgpa}
                  onChange={(ev) => updateEducation(e.id, { cgpa: ev.target.value })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddItemButton onClick={addEducation} label="Add Another Education" />
    </div>
  );
}

/* ---------- Step 3: Skills ---------- */
function TagInput({
  type,
  label,
}: {
  type: "technical" | "programming" | "soft";
  label: string;
}) {
  const { data, addSkill, removeSkill } = useResumeStore();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const v = value.trim().replace(",", "");
      if (v) {
        addSkill(type, v);
        setValue("");
      }
    }
  };

  return (
    <div className="nx-input-group">
      <Label>{label}</Label>
      <div className="nx-tag-container" onClick={() => inputRef.current?.focus()}>
        {data.skills[type].map((s, idx) => (
          <span className="nx-tag" key={s + idx}>
            {s}
            <button
              className="nx-tag-remove"
              onClick={(e) => {
                e.stopPropagation();
                removeSkill(type, idx);
              }}
              type="button"
              aria-label={`Remove ${s}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className="nx-tag-input"
          placeholder="Type and press Enter..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
        />
      </div>
    </div>
  );
}

export function SkillsStep() {
  const { data, addSkill } = useResumeStore();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{ technical: string[]; soft: string[] } | null>(null);

  const generate = async () => {
    const jobTitle = data.personal.jobTitle.trim();
    if (!jobTitle) {
      toast("Please enter a job title in the Personal Information step first.", "info");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to generate suggestions");
      setSuggestions(json);
      toast("AI skill suggestions generated!", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to generate suggestions", "error");
    } finally {
      setLoading(false);
    }
  };

  const addSuggested = (skill: string) => {
    const isSoft = suggestions?.soft.includes(skill);
    const exists =
      data.skills.technical.includes(skill) ||
      data.skills.programming.includes(skill) ||
      data.skills.soft.includes(skill);
    if (exists) {
      toast("Skill already added!", "info");
      return;
    }
    if (isSoft) addSkill("soft", skill);
    else {
      const progSkills = ["JavaScript", "Python", "TypeScript", "Java", "Go", "SQL", "HTML5", "CSS3", "R"];
      if (progSkills.includes(skill)) addSkill("programming", skill);
      else addSkill("technical", skill);
    }
    toast(`Added: ${skill}`, "success");
  };

  return (
    <div className="nx-form-step active">
      <FormHeader icon={Code} title="Skills" subtitle="Showcase your technical and soft skills" />
      <TagInput type="technical" label="Technical Skills" />
      <TagInput type="programming" label="Programming Languages" />
      <TagInput type="soft" label="Soft Skills" />

      <div className="nx-ai-panel nx-holo-border" style={{ marginTop: "20px" }}>
        <div className="nx-ai-header">
          <div className="nx-ai-icon">
            <Wand2 size={20} color="var(--nx-navy)" />
          </div>
          <div>
            <h4>AI SKILL SUGGESTIONS</h4>
            <p>Based on your target job title</p>
          </div>
        </div>
        <div id="skillSuggestions">
          {!suggestions && !loading && (
            <p style={{ fontSize: "13px", color: "rgba(248,253,255,0.5)" }}>
              Enter a job title in Personal Info to get AI-powered skill suggestions.
            </p>
          )}
          {loading && (
            <div className="nx-typing-indicator">
              <div className="nx-typing-dot" />
              <div className="nx-typing-dot" />
              <div className="nx-typing-dot" />
            </div>
          )}
          {suggestions && !loading && (
            <>
              <p style={{ fontSize: "12px", color: "var(--nx-ice)", marginBottom: "12px" }}>
                Recommended for <strong>{data.personal.jobTitle}</strong>:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {[...suggestions.technical, ...suggestions.soft].map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSuggested(skill)}
                    style={{
                      padding: "6px 12px",
                      background: "rgba(34,211,238,0.1)",
                      border: "1px solid rgba(34,211,238,0.3)",
                      borderRadius: "20px",
                      fontSize: "12px",
                      color: "var(--nx-ice)",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <PlusCircle size={9} /> {skill}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <button className="nx-ai-action-btn" onClick={generate} disabled={loading} type="button">
          <Sparkles size={14} />
          {loading ? "Generating..." : "Generate Suggestions"}
        </button>
      </div>
    </div>
  );
}

/* ---------- Step 4: Experience ---------- */
export function ExperienceStep() {
  const { data, updateExperience, addExperience, removeExperience } = useResumeStore();
  return (
    <div className="nx-form-step active">
      <FormHeader icon={Briefcase} title="Experience" subtitle="Add your work history" />
      <div>
        {data.experience.map((e) => (
          <div className="nx-repeatable-item" key={e.id}>
            <RemoveButton onClick={() => removeExperience(e.id)} />
            <div className="nx-form-grid">
              <div className="nx-input-group">
                <Label>Company</Label>
                <input
                  className="nx-input-field"
                  placeholder="Google"
                  value={e.company}
                  onChange={(ev) => updateExperience(e.id, { company: ev.target.value })}
                />
              </div>
              <div className="nx-input-group">
                <Label>Job Position</Label>
                <input
                  className="nx-input-field"
                  placeholder="Software Engineer"
                  value={e.position}
                  onChange={(ev) => updateExperience(e.id, { position: ev.target.value })}
                />
              </div>
              <div className="nx-input-group" style={{ gridColumn: "span 2" }}>
                <Label>Duration</Label>
                <input
                  className="nx-input-field"
                  placeholder="Jan 2023 - Present"
                  value={e.duration}
                  onChange={(ev) => updateExperience(e.id, { duration: ev.target.value })}
                />
              </div>
              <div className="nx-input-group" style={{ gridColumn: "span 2" }}>
                <Label>Responsibilities &amp; Achievements</Label>
                <textarea
                  className="nx-input-field"
                  placeholder={"• Developed and maintained web applications using React and Node.js\n• Improved API performance by 40%\n• Led a team of 5 developers"}
                  value={e.responsibilities}
                  onChange={(ev) => updateExperience(e.id, { responsibilities: ev.target.value })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddItemButton onClick={addExperience} label="Add Another Experience" />
    </div>
  );
}

/* ---------- Step 5: Projects ---------- */
export function ProjectsStep() {
  const { data, updateProject, addProject, removeProject } = useResumeStore();
  return (
    <div className="nx-form-step active">
      <FormHeader icon={Box} title="Projects" subtitle="Highlight your best work" />
      <div>
        {data.projects.map((p) => (
          <div className="nx-repeatable-item" key={p.id}>
            <RemoveButton onClick={() => removeProject(p.id)} />
            <div className="nx-form-grid">
              <div className="nx-input-group" style={{ gridColumn: "span 2" }}>
                <Label>Project Title</Label>
                <input
                  className="nx-input-field"
                  placeholder="AI Resume Builder"
                  value={p.title}
                  onChange={(ev) => updateProject(p.id, { title: ev.target.value })}
                />
              </div>
              <div className="nx-input-group" style={{ gridColumn: "span 2" }}>
                <Label>Description</Label>
                <textarea
                  className="nx-input-field"
                  placeholder="Built a futuristic AI-powered resume builder with 3D visuals and real-time ATS scoring..."
                  value={p.description}
                  onChange={(ev) => updateProject(p.id, { description: ev.target.value })}
                />
              </div>
              <div className="nx-input-group" style={{ gridColumn: "span 2" }}>
                <Label>Technologies Used</Label>
                <input
                  className="nx-input-field"
                  placeholder="React, Three.js, Node.js, OpenAI API"
                  value={p.technologies}
                  onChange={(ev) => updateProject(p.id, { technologies: ev.target.value })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddItemButton onClick={addProject} label="Add Another Project" />
    </div>
  );
}

/* ---------- Step 6: Certificates & Languages ---------- */
export function CertificatesStep() {
  const { data, updateCertificate, addCertificate, removeCertificate, setLanguages } =
    useResumeStore();
  return (
    <div className="nx-form-step active">
      <FormHeader
        icon={Award}
        title="Certificates & Languages"
        subtitle="Add your certifications and language proficiency"
      />
      <h4
        style={{
          fontFamily: "var(--font-orbitron), sans-serif",
          fontSize: "14px",
          color: "var(--nx-ice)",
          marginBottom: "15px",
          letterSpacing: "1px",
        }}
      >
        CERTIFICATES
      </h4>
      <div>
        {data.certificates.map((c) => (
          <div className="nx-repeatable-item" key={c.id}>
            <RemoveButton onClick={() => removeCertificate(c.id)} />
            <div className="nx-form-grid">
              <div className="nx-input-group">
                <Label>Certificate Name</Label>
                <input
                  className="nx-input-field"
                  placeholder="AWS Solutions Architect"
                  value={c.name}
                  onChange={(ev) => updateCertificate(c.id, { name: ev.target.value })}
                />
              </div>
              <div className="nx-input-group">
                <Label>Organization</Label>
                <input
                  className="nx-input-field"
                  placeholder="Amazon Web Services"
                  value={c.organization}
                  onChange={(ev) => updateCertificate(c.id, { organization: ev.target.value })}
                />
              </div>
              <div className="nx-input-group">
                <Label>Year</Label>
                <input
                  className="nx-input-field"
                  placeholder="2024"
                  value={c.year}
                  onChange={(ev) => updateCertificate(c.id, { year: ev.target.value })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddItemButton onClick={addCertificate} label="Add Certificate" />

      <h4
        style={{
          fontFamily: "var(--font-orbitron), sans-serif",
          fontSize: "14px",
          color: "var(--nx-ice)",
          margin: "30px 0 15px",
          letterSpacing: "1px",
        }}
      >
        LANGUAGES
      </h4>
      <div className="nx-input-group">
        <Label>Languages (comma separated)</Label>
        <input
          className="nx-input-field"
          placeholder="English (Fluent), Spanish (Intermediate), Hindi (Native)"
          value={data.languages}
          onChange={(e) => setLanguages(e.target.value)}
        />
      </div>
    </div>
  );
}

/* ---------- Step 7: Review & Export ---------- */
export function ReviewStep() {
  const { data, setSummary, setAts } = useResumeStore();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.personal.name,
          jobTitle: data.personal.jobTitle,
          skills: [...data.skills.technical, ...data.skills.programming],
          experience: data.experience,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to generate summary");
      setSummary(json.summary);
      setDone(true);
      toast("AI summary generated successfully!", "success");
      const ats = calculateAts({ ...data, summary: json.summary });
      setAts(ats.score, ats.factors);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to generate summary", "error");
    } finally {
      setLoading(false);
    }
  };

  const recalc = () => {
    const ats = calculateAts(data);
    setAts(ats.score, ats.factors);
    toast("ATS score recalculated!", "success");
  };

  const onExport = async () => {
    try {
      await exportToPDF(data);
      toast("Resume downloaded successfully!", "success");
    } catch {
      toast("PDF export failed", "error");
    }
  };

  return (
    <div className="nx-form-step active">
      <FormHeader icon={Trophy} title="Review & Export" subtitle="AI analysis and final polish" />

      {/* AI Summary Generator */}
      <div className="nx-ai-panel nx-holo-border">
        <div className="nx-ai-header">
          <div className="nx-ai-icon">
            <Brain size={20} color="var(--nx-navy)" />
          </div>
          <div>
            <h4>AI SUMMARY GENERATOR</h4>
            <p>Generate a professional summary instantly</p>
          </div>
        </div>
        <div>
          {!data.summary && !loading && (
            <p style={{ fontSize: "13px", color: "rgba(248,253,255,0.5)" }}>
              Click below to generate a tailored professional summary using AI.
            </p>
          )}
          {loading && (
            <div className="nx-typing-indicator">
              <div className="nx-typing-dot" />
              <div className="nx-typing-dot" />
              <div className="nx-typing-dot" />
            </div>
          )}
          {data.summary && !loading && (
            <div
              className="nx-ai-suggestion"
              style={{ background: "rgba(34,211,238,0.08)", borderColor: "rgba(34,211,238,0.2)" }}
            >
              <CheckCircle2 size={18} color="#4ade80" />
              <div>
                <p style={{ marginBottom: "10px" }}>{data.summary}</p>
              </div>
            </div>
          )}
        </div>
        <button className="nx-ai-action-btn" onClick={generate} disabled={loading} type="button">
          {loading ? (
            <>
              <RefreshCw size={14} className="animate-spin" /> Generating...
            </>
          ) : done ? (
            <>
              <CheckCircle2 size={14} /> Regenerate Summary
            </>
          ) : (
            <>
              <Wand2 size={14} /> Generate AI Summary
            </>
          )}
        </button>
      </div>

      {/* ATS recalc */}
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
          <PieChart size={18} color="var(--nx-cyan)" />
          ATS SCORE ANALYSIS
        </h4>
        <p style={{ fontSize: "13px", color: "rgba(248,253,255,0.6)", textAlign: "center" }}>
          Check the live ATS dashboard on the right, or recalculate your score below.
        </p>
        <button className="nx-ai-action-btn" onClick={recalc} type="button" style={{ marginTop: "20px" }}>
          <RefreshCw size={14} /> Recalculate Score
        </button>
      </div>

      {/* Export */}
      <button
        className="nx-btn-primary"
        style={{ width: "100%", marginTop: "20px", padding: "18px", fontSize: "16px" }}
        onClick={onExport}
        type="button"
      >
        <Download size={16} />
        Download PDF Resume
      </button>
    </div>
  );
}
