"use client";

import { useState, useMemo, useCallback } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Search,
  X,
  Check,
  Briefcase,
  Palette,
  Minimize,
  GraduationCap,
  FileCheck,
  LayoutGrid,
  Pencil,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useResumeStore } from "@/lib/resume-store";
import { useToast } from "./toasts";
import {
  TEMPLATES,
  TEMPLATE_CATEGORIES,
  getTemplate,
  SAMPLE_RESUME,
  type TemplateConfig,
} from "@/lib/templates";
import { TemplateMiniature, TemplateRenderer } from "./template-renderer";
import { EditableResumeRenderer, applyEditPath } from "./editable-resume-renderer";
import { DEFAULT_CUSTOMIZATION, type ResumeCustomization } from "@/lib/customization";
import ScrollReveal from "./scroll-reveal";
import type { ResumeData } from "@/lib/resume-store";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  all: LayoutGrid,
  professional: Briefcase,
  creative: Palette,
  minimal: Minimize,
  student: GraduationCap,
  "ats-friendly": FileCheck,
};

// Builds editor customization (fonts + colors) from a template config so the
// in-modal editable preview visually matches the selected template.
function customizationFromTemplate(template: TemplateConfig): ResumeCustomization {
  const isSerif = template.fontHeading.includes("Georgia");
  return {
    fonts: {
      ...DEFAULT_CUSTOMIZATION.fonts,
      headingFamily: isSerif ? "georgia" : "roboto",
      bodyFamily: isSerif ? "georgia" : "roboto",
    },
    colors: {
      name: template.textColor,
      mainHeadings: template.textColor,
      sectionHeadings: template.accent,
      bodyText: template.textColor,
      subheadings: template.mutedColor,
      contactInfo: template.mutedColor,
      divider: template.accent,
      bullets: template.accent,
      background: "#ffffff",
    },
    design: { ...DEFAULT_CUSTOMIZATION.design },
  };
}

function categoryBadgeStyle(cat: string): React.CSSProperties {
  const map: Record<string, { bg: string; color: string }> = {
    professional: { bg: "rgba(34,211,238,0.85)", color: "#0f172a" },
    creative: { bg: "rgba(236,72,153,0.85)", color: "#fff" },
    minimal: { bg: "rgba(100,116,139,0.85)", color: "#fff" },
    student: { bg: "rgba(96,165,250,0.85)", color: "#0f172a" },
    "ats-friendly": { bg: "rgba(55,65,81,0.85)", color: "#fff" },
  };
  const s = map[cat] || map.professional;
  return { background: s.bg, color: s.color };
}

function TemplatePreviewModal({
  template,
  onClose,
  onUse,
}: {
  template: TemplateConfig;
  onClose: () => void;
  onUse: () => void;
}) {
  const { data, sectionOrder, photoStyle, setData } = useResumeStore();
  const toast = useToast();
  const [editMode, setEditMode] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [hasEdits, setHasEdits] = useState(false);

  // Draft content for in-place editing: start from the user's resume when they
  // have one, otherwise from the sample placeholder content so a fresh user can
  // personalize the template right here without leaving the gallery.
  const hasData = data.personal?.name || data.personal?.email;
  const [draft, setDraft] = useState<ResumeData>(
    hasData ? data : (SAMPLE_RESUME as unknown as ResumeData)
  );

  // Editor styling derived from the template so the editable preview matches
  // the template's accent colors and typography.
  const tplCustomization = useMemo(
    () => customizationFromTemplate(template),
    [template]
  );

  const onEditField = useCallback(
    (path: string, value: string) => {
      setDraft((prev) => applyEditPath(prev, path, value));
      setHasEdits(true);
    },
    []
  );

  const resetDraft = () => {
    setDraft(hasData ? data : (SAMPLE_RESUME as unknown as ResumeData));
    setHasEdits(false);
    setSelectedPath(null);
    toast("Preview reset — your edits in this dialog were discarded.", "info");
  };

  const requestClose = () => {
    if (editMode && hasEdits) {
      toast("You have unsaved edits. Click Open in Editor to keep them, or Reset to discard.", "info");
      return;
    }
    onClose();
  };

  const openInEditor = () => {
    if (hasEdits) {
      setData(draft);
      toast("Edits saved to your resume data.", "success");
    }
    onUse();
    onClose();
  };

  return (
    <div className="nx-tpl-modal-overlay" onClick={requestClose}>
      <div className="nx-tpl-modal" onClick={(e) => e.stopPropagation()}>
        <div className="nx-full-preview-header">
          <div>
            <div className="nx-full-preview-title">{template.name}</div>
            <p style={{ fontSize: "12px", color: "rgba(248,253,255,0.5)", marginTop: "2px" }}>
              {template.description}
            </p>
          </div>
          <button className="nx-full-preview-close" onClick={requestClose} type="button" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="nx-tpl-modal-body">
          <div className="nx-tpl-modal-a4">
            {editMode ? (
              <EditableResumeRenderer
                template={template}
                data={draft}
                photoStyle={photoStyle}
                customization={tplCustomization}
                sectionOrder={sectionOrder}
                editable={true}
                onEditField={onEditField}
                selectedPath={selectedPath}
                onSelectPath={setSelectedPath}
              />
            ) : (
              <TemplateRenderer
                template={template}
                data={SAMPLE_RESUME as unknown as ResumeData}
                photoStyle="circular"
              />
            )}
          </div>
        </div>
        <div
          style={{
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {editMode ? (
            <div className="nx-editor-canvas-hint" style={{ marginBottom: 0 }}>
              <Sparkles size={12} color="var(--nx-cyan)" />
              Click any text to edit it directly.
              {hasEdits && (
                <span style={{ color: "#fbbf24", marginLeft: "4px" }}>· Unsaved edits</span>
              )}
            </div>
          ) : (
            <span />
          )}
          <div style={{ display: "flex", gap: "10px", marginLeft: "auto", flexWrap: "wrap" }}>
            <button
              className={`nx-tpl-btn ${editMode ? "nx-tpl-btn-primary" : ""}`}
              onClick={() => {
                setEditMode((v) => !v);
                setSelectedPath(null);
              }}
              type="button"
              style={{ padding: "10px 20px" }}
              title={editMode ? "Switch back to the static template preview" : "Edit this template's content directly"}
            >
              {editMode ? <Eye size={13} /> : <Pencil size={13} />}
              {editMode ? "Preview" : "Edit Content"}
            </button>
            {editMode && hasEdits && (
              <button className="nx-tpl-btn" onClick={resetDraft} type="button" style={{ padding: "10px 20px" }}>
                <RotateCcw size={13} /> Reset
              </button>
            )}
            <button
              className="nx-tpl-btn"
              onClick={() => {
                if (editMode && hasEdits) {
                  toast("You have unsaved edits. Click Open in Editor to keep them, or Reset to discard.", "info");
                  return;
                }
                onClose();
              }}
              type="button"
              style={{ padding: "10px 20px" }}
            >
              Close
            </button>
            <button
              className="nx-tpl-btn nx-tpl-btn-primary"
              onClick={openInEditor}
              type="button"
              style={{ padding: "10px 20px" }}
            >
              Open in Editor <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TemplatesGallery() {
  const toast = useToast();
  const { selectedTemplate, setSelectedTemplate, setView } = useResumeStore();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateConfig | null>(null);

  const filteredTemplates = useMemo(() => {
    let list = TEMPLATES;
    if (activeCategory !== "all") {
      list = list.filter((t) => t.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, searchQuery]);

  // Open the selected template directly in the editor (Module 2 requirement).
  const handleUse = (template: TemplateConfig) => {
    setSelectedTemplate(template.id);
    toast(`${template.name} template opened in editor.`, "success");
    setView("editor");
  };

  return (
    <section className="nx-section" style={{ paddingTop: "120px" }}>
      <button className="nx-back-btn" onClick={() => setView("dashboard")} type="button">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <div className="nx-hero-badge" style={{ margin: "0 auto 16px" }}>
          <Palette size={12} /> {TEMPLATES.length} Templates
        </div>
        <h2 className="nx-section-title nx-gradient-animate" style={{ fontSize: "clamp(26px, 4.5vw, 40px)" }}>
          PREMIUM TEMPLATE GALLERY
        </h2>
        <p className="nx-section-subtitle">
          Click <strong>Use This Template</strong> to open it directly in the editor — no re-entering your info. You can also edit content right inside the preview.
        </p>
      </div>

      <div className="nx-tpl-filter-row">
        <div className="nx-tpl-filter-chips">
          {TEMPLATE_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || Briefcase;
            return (
              <button
                key={cat.id}
                className={`nx-tpl-chip ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
                type="button"
              >
                <Icon size={13} />
                {cat.label}
              </button>
            );
          })}
        </div>
        <div className="nx-tpl-search">
          <Search
            size={15}
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(248,253,255,0.4)", pointerEvents: "none" }}
          />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="nx-tpl-empty">No templates found. Try a different search or category.</div>
      ) : (
        <div className="nx-tpl-gallery-grid">
          {filteredTemplates.map((template, idx) => (
            <ScrollReveal key={template.id} variant="scale" delay={(idx % 4) + 1}>
              <div className="nx-glass-card nx-tpl-card">
                <div className="nx-tpl-preview-frame">
                  <div className="nx-tpl-category-badge" style={categoryBadgeStyle(template.category)}>
                    {template.category}
                  </div>
                  <div style={{ padding: "12px", height: "100%" }}>
                    <TemplateMiniature template={template} />
                  </div>
                </div>
                <div style={{ padding: "0 4px 4px" }}>
                  <div className="nx-tpl-card-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{template.name}</span>
                    {selectedTemplate === template.id && (
                      <span style={{ color: "var(--nx-cyan)", display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "11px" }}>
                        <Check size={12} /> Active
                      </span>
                    )}
                  </div>
                  <p className="nx-tpl-card-desc">{template.description}</p>
                  <div className="nx-tpl-card-actions">
                    <button className="nx-tpl-btn" onClick={() => setPreviewTemplate(template)} type="button">
                      <Eye size={13} /> Preview
                    </button>
                    <button className="nx-tpl-btn nx-tpl-btn-primary" onClick={() => handleUse(template)} type="button">
                      Use This <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}

      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={() => handleUse(previewTemplate)}
        />
      )}
    </section>
  );
}
