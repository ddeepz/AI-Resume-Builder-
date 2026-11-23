"use client";

import { useState, useMemo } from "react";
import { Eye, ArrowRight, Search, X, Check, Briefcase, Palette, Minimize, GraduationCap, FileCheck, LayoutGrid } from "lucide-react";
import { useResumeStore } from "@/lib/resume-store";
import { useToast } from "./toasts";
import {
  TEMPLATES,
  TEMPLATE_CATEGORIES,
  getTemplate,
  searchTemplates,
  SAMPLE_RESUME,
  type TemplateConfig,
} from "@/lib/templates";
import { TemplateMiniature, TemplateRenderer } from "./template-renderer";
import ScrollReveal from "./scroll-reveal";
import type { ResumeData } from "@/lib/resume-store";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  all: LayoutGrid,
  professional: Briefcase,
  creative: Palette,
  minimal: Minimize,
  student: GraduationCap,
  "ats-friendly": FileCheck,
};

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

function TemplateCard({
  template,
  isSelected,
  onPreview,
  onUse,
}: {
  template: TemplateConfig;
  isSelected: boolean;
  onPreview: () => void;
  onUse: () => void;
}) {
  return (
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
          {isSelected && (
            <span style={{ color: "var(--nx-cyan)", display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "11px" }}>
              <Check size={12} /> Active
            </span>
          )}
        </div>
        <p className="nx-tpl-card-desc">{template.description}</p>
        <div className="nx-tpl-card-actions">
          <button className="nx-tpl-btn" onClick={onPreview} type="button">
            <Eye size={13} /> Preview
          </button>
          <button className="nx-tpl-btn nx-tpl-btn-primary" onClick={onUse} type="button">
            Use This <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
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
  return (
    <div className="nx-tpl-modal-overlay" onClick={onClose}>
      <div className="nx-tpl-modal" onClick={(e) => e.stopPropagation()}>
        <div className="nx-full-preview-header">
          <div>
            <div className="nx-full-preview-title">{template.name}</div>
            <p style={{ fontSize: "12px", color: "rgba(248,253,255,0.5)", marginTop: "2px" }}>
              {template.description}
            </p>
          </div>
          <button className="nx-full-preview-close" onClick={onClose} type="button" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="nx-tpl-modal-body">
          <div className="nx-tpl-modal-a4">
            <TemplateRenderer
              template={template}
              data={SAMPLE_RESUME as unknown as ResumeData}
              photoStyle="circular"
            />
          </div>
        </div>
        <div style={{ padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button className="nx-tpl-btn" onClick={onClose} type="button" style={{ padding: "10px 20px" }}>
            Close
          </button>
          <button
            className="nx-tpl-btn nx-tpl-btn-primary"
            onClick={() => {
              onUse();
              onClose();
            }}
            type="button"
            style={{ padding: "10px 20px" }}
          >
            Use This Template <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Templates() {
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
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, searchQuery]);

  const handleUse = (template: TemplateConfig) => {
    setSelectedTemplate(template.id);
    toast(`${template.name} template opened in editor!`, "success");
    setView("editor");
  };

  return (
    <section className="nx-section" id="templates">
      <ScrollReveal variant="up">
        <h2 className="nx-section-title nx-gradient-animate">PREMIUM TEMPLATES</h2>
      </ScrollReveal>
      <ScrollReveal variant="fade" delay={1}>
        <p className="nx-section-subtitle">
          Choose from 15 professionally designed, ATS-optimized templates
        </p>
      </ScrollReveal>

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
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(248,253,255,0.4)",
              pointerEvents: "none",
            }}
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
        <div className="nx-tpl-empty">
          No templates found. Try a different search or category.
        </div>
      ) : (
        <div className="nx-tpl-gallery-grid">
          {filteredTemplates.map((template, idx) => (
            <ScrollReveal key={template.id} variant="scale" delay={(idx % 4) + 1}>
              <TemplateCard
                template={template}
                isSelected={selectedTemplate === template.id}
                onPreview={() => setPreviewTemplate(template)}
                onUse={() => handleUse(template)}
              />
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
