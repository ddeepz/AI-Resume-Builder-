"use client";

import { useEffect } from "react";
import {
  ArrowLeft,
  History,
  FileText,
  Trash2,
  Pencil,
  Plus,
  Calendar,
  Award,
} from "lucide-react";
import { useResumeStore } from "@/lib/resume-store";
import { useToast } from "./toasts";
import { getTemplate } from "@/lib/templates";

export default function ResumeHistory() {
  const { setView, savedResumes, loadSavedResumes, openSavedResume, deleteSavedResume } = useResumeStore();
  const toast = useToast();

  useEffect(() => {
    loadSavedResumes();
  }, [loadSavedResumes]);

  const onDelete = (id: string, name: string) => {
    deleteSavedResume(id);
    toast(`Deleted "${name}".`, "info");
  };

  const onOpen = (id: string) => {
    openSavedResume(id);
    toast("Resume loaded into the editor.", "success");
  };

  return (
    <section className="nx-section" style={{ paddingTop: "120px" }}>
      <button className="nx-back-btn" onClick={() => setView("dashboard")} type="button">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <div className="nx-hero-badge" style={{ margin: "0 auto 16px" }}>
          <History size={12} /> Saved Resumes
        </div>
        <h2 className="nx-section-title nx-gradient-animate" style={{ fontSize: "clamp(26px, 4.5vw, 40px)" }}>
          RESUME HISTORY
        </h2>
        <p className="nx-section-subtitle">
          Reopen, continue editing, or delete your previously saved resumes.
        </p>
      </div>

      {savedResumes.length === 0 ? (
        <div className="nx-glass-strong" style={{ maxWidth: "600px", margin: "0 auto", padding: "40px", borderRadius: "24px", textAlign: "center" }}>
          <div className="nx-icon-orb" style={{ width: "60px", height: "60px", margin: "0 auto 16px" }}>
            <FileText size={24} color="var(--nx-cyan)" />
          </div>
          <h3 style={{ fontSize: "16px", color: "var(--nx-frost)", marginBottom: "8px" }}>No saved resumes yet</h3>
          <p style={{ fontSize: "13px", color: "rgba(248,253,255,0.5)", marginBottom: "20px" }}>
            Build a resume and click <strong>Save</strong> in the editor to keep it here.
          </p>
          <button className="nx-btn-primary" onClick={() => setView("ai-generator")} type="button">
            <Plus size={15} /> Create a Resume
          </button>
        </div>
      ) : (
        <div className="nx-history-grid">
          {savedResumes.map((r) => {
            const tpl = getTemplate(r.templateId);
            const expCount = r.data.experience.filter((e) => e.company).length;
            const skillCount = r.data.skills.technical.length + r.data.skills.programming.length + r.data.skills.soft.length;
            return (
              <div className="nx-glass-card nx-history-card" key={r.id}>
                <div className="nx-history-card-header" style={{ background: `linear-gradient(135deg, ${tpl.accent}20, ${tpl.accentSecondary}20)` }}>
                  <div style={{ fontSize: "16px", color: "var(--nx-frost)", fontWeight: 700 }}>
                    {r.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(248,253,255,0.5)" }}>
                    {r.data.personal.jobTitle || "No title"}
                  </div>
                </div>
                <div className="nx-history-card-body">
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "12px" }}>
                    <span style={{ fontSize: "11px", color: "var(--nx-ice)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={11} /> {new Date(r.savedAt).toLocaleDateString()}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--nx-cyan)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Award size={11} /> {tpl.name}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "16px" }}>
                    <div>
                      <div style={{ fontSize: "18px", color: "var(--nx-cyan)", fontWeight: 800 }}>{expCount}</div>
                      <div style={{ fontSize: "10px", color: "rgba(248,253,255,0.4)" }}>Experience</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "18px", color: "#EC4899", fontWeight: 800 }}>{skillCount}</div>
                      <div style={{ fontSize: "10px", color: "rgba(248,253,255,0.4)" }}>Skills</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="nx-tpl-btn nx-tpl-btn-primary" onClick={() => onOpen(r.id)} type="button" style={{ flex: 1 }}>
                      <Pencil size={12} /> Open & Edit
                    </button>
                    <button className="nx-tpl-btn nx-mini-btn-danger" onClick={() => onDelete(r.id, r.name)} type="button" title="Delete">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
