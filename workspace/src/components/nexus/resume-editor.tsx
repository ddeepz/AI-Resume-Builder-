"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ArrowLeft,
  Save,
  Download,
  Eye,
  Type,
  Palette,
  Layout,
  Bot,
  ListOrdered,
  Undo2,
  Redo2,
  RotateCcw,
  Sparkles,
  Wand2,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  FileText,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RefreshCw,
  Camera,
} from "lucide-react";
import { useResumeStore } from "@/lib/resume-store";
import { useToast } from "./toasts";
import { exportToPDF } from "@/lib/pdf-export";
import { getTemplate, TEMPLATES } from "@/lib/templates";
import { EditableResumeRenderer, applyEditPath } from "./editable-resume-renderer";
import PhotoUpload from "./photo-upload";
import {
  FONT_OPTIONS,
  COLOR_PRESETS,
  ALL_SECTIONS,
  sectionLabel,
  type ResumeCustomization,
} from "@/lib/customization";
import { calculateAts } from "@/lib/ats";

/* ---------- Font panel ---------- */
function FontPanel() {
  const { customization, setCustomization, pushDesignHistory } = useResumeStore();
  const f = customization.fonts;

  const update = (patch: Partial<typeof f>) => {
    const next = { ...customization, fonts: { ...f, ...patch } };
    setCustomization(patch);
    pushDesignHistory(next);
  };

  return (
    <div className="nx-editor-panel-body">
      <div className="nx-custom-row">
        <label>Heading Font</label>
        <select className="nx-custom-select" value={f.headingFamily} onChange={(e) => update({ headingFamily: e.target.value })}>
          {FONT_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
      </div>
      <div className="nx-custom-row">
        <label>Body Font</label>
        <select className="nx-custom-select" value={f.bodyFamily} onChange={(e) => update({ bodyFamily: e.target.value })}>
          {FONT_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
      </div>
      <div className="nx-custom-row">
        <label>Body Size: {f.baseSize}px</label>
        <input type="range" min={10} max={18} value={f.baseSize} onChange={(e) => update({ baseSize: Number(e.target.value) })} className="nx-custom-slider" />
      </div>
      <div className="nx-custom-row">
        <label>Heading Size: {f.headingSize}px</label>
        <input type="range" min={14} max={26} value={f.headingSize} onChange={(e) => update({ headingSize: Number(e.target.value) })} className="nx-custom-slider" />
      </div>
      <div className="nx-custom-row">
        <label>Letter Spacing: {f.letterSpacing}px</label>
        <input type="range" min={-1} max={4} step={0.1} value={f.letterSpacing} onChange={(e) => update({ letterSpacing: Number(e.target.value) })} className="nx-custom-slider" />
      </div>
      <div className="nx-custom-row">
        <label>Line Height: {f.lineHeight.toFixed(1)}</label>
        <input type="range" min={1} max={2} step={0.1} value={f.lineHeight} onChange={(e) => update({ lineHeight: Number(e.target.value) })} className="nx-custom-slider" />
      </div>
      <div className="nx-custom-toggle-row">
        <button className={`nx-custom-toggle ${f.bold ? "active" : ""}`} onClick={() => update({ bold: !f.bold })} type="button"><b>B</b></button>
        <button className={`nx-custom-toggle ${f.italic ? "active" : ""}`} onClick={() => update({ italic: !f.italic })} type="button"><i>I</i></button>
        <button className={`nx-custom-toggle ${f.underline ? "active" : ""}`} onClick={() => update({ underline: !f.underline })} type="button"><u>U</u></button>
      </div>
    </div>
  );
}

/* ---------- Color panel ---------- */
function ColorPanel() {
  const { customization, setCustomization, pushDesignHistory } = useResumeStore();
  const c = customization.colors;

  const targets: { key: keyof typeof c; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "mainHeadings", label: "Main Headings" },
    { key: "sectionHeadings", label: "Section Headings" },
    { key: "bodyText", label: "Body Text" },
    { key: "subheadings", label: "Subheadings" },
    { key: "contactInfo", label: "Contact Info" },
    { key: "divider", label: "Divider Lines" },
    { key: "bullets", label: "Bullet Points" },
    { key: "background", label: "Background" },
  ];

  const updateColor = (key: keyof typeof c, value: string) => {
    const nextColors = { ...c, [key]: value };
    const next = { ...customization, colors: nextColors };
    setCustomization({ colors: nextColors });
    pushDesignHistory(next);
  };

  return (
    <div className="nx-editor-panel-body">
      <div style={{ fontSize: "11px", color: "var(--nx-cyan)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px", fontWeight: 600 }}>
        Color Presets
      </div>
      <div className="nx-preset-grid">
        {COLOR_PRESETS.map((p) => (
          <button
            key={p.id}
            className="nx-preset-chip"
            onClick={() => {
              const next = { ...customization, colors: { ...p.colors } };
              setCustomization({ colors: { ...p.colors } });
              pushDesignHistory(next);
            }}
            type="button"
            title={p.label}
          >
            <span style={{ background: p.colors.mainHeadings }} />
            <span style={{ background: p.colors.sectionHeadings }} />
            <span style={{ background: p.colors.background, border: "1px solid #e5e7eb" }} />
            <span style={{ fontSize: "10px", color: "rgba(248,253,255,0.7)", marginLeft: "4px" }}>{p.label}</span>
          </button>
        ))}
      </div>

      <div style={{ fontSize: "11px", color: "var(--nx-cyan)", letterSpacing: "1px", textTransform: "uppercase", margin: "20px 0 10px", fontWeight: 600 }}>
        Per-Element Colors
      </div>
      {targets.map((t) => (
        <div className="nx-custom-row" key={t.key}>
          <label>{t.label}</label>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <input
              type="color"
              value={c[t.key]}
              onChange={(e) => updateColor(t.key, e.target.value)}
              className="nx-color-picker"
            />
            <input
              type="text"
              value={c[t.key]}
              onChange={(e) => updateColor(t.key, e.target.value)}
              className="nx-hex-input"
              maxLength={7}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Design panel ---------- */
function DesignPanel() {
  const { customization, setCustomization, pushDesignHistory } = useResumeStore();
  const d = customization.design;

  const update = (patch: Partial<typeof d>) => {
    const next = { ...customization, design: { ...d, ...patch } };
    setCustomization({ design: { ...d, ...patch } });
    pushDesignHistory(next);
  };

  return (
    <div className="nx-editor-panel-body">
      <div className="nx-custom-row">
        <label>Margin: {d.margin}px</label>
        <input type="range" min={16} max={60} value={d.margin} onChange={(e) => update({ margin: Number(e.target.value) })} className="nx-custom-slider" />
      </div>
      <div className="nx-custom-row">
        <label>Section Spacing: {d.sectionSpacing}px</label>
        <input type="range" min={4} max={40} value={d.sectionSpacing} onChange={(e) => update({ sectionSpacing: Number(e.target.value) })} className="nx-custom-slider" />
      </div>
      <div className="nx-custom-row">
        <label>Column Gap: {d.columnGap}px</label>
        <input type="range" min={8} max={48} value={d.columnGap} onChange={(e) => update({ columnGap: Number(e.target.value) })} className="nx-custom-slider" />
      </div>
      <div className="nx-custom-row">
        <label>Divider Thickness: {d.dividerThickness}px</label>
        <input type="range" min={1} max={6} value={d.dividerThickness} onChange={(e) => update({ dividerThickness: Number(e.target.value) })} className="nx-custom-slider" />
      </div>
      <div className="nx-custom-row">
        <label>Divider Length: {d.dividerLength}%</label>
        <input type="range" min={20} max={100} value={d.dividerLength} onChange={(e) => update({ dividerLength: Number(e.target.value) })} className="nx-custom-slider" />
      </div>
      <div className="nx-custom-row">
        <label>Alignment</label>
        <div className="nx-custom-toggle-row">
          <button className={`nx-custom-toggle ${d.alignment === "left" ? "active" : ""}`} onClick={() => update({ alignment: "left" })} type="button" title="Left"><AlignLeft size={14} /></button>
          <button className={`nx-custom-toggle ${d.alignment === "center" ? "active" : ""}`} onClick={() => update({ alignment: "center" })} type="button" title="Center"><AlignCenter size={14} /></button>
          <button className={`nx-custom-toggle ${d.alignment === "right" ? "active" : ""}`} onClick={() => update({ alignment: "right" })} type="button" title="Right"><AlignRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Sections panel (reorder, add, delete) ---------- */
function SectionsPanel() {
  const { sectionOrder, setSectionOrder, data, addExperience, addEducation, addProject, addCertificate, addAchievement } = useResumeStore();
  const toast = useToast();

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...sectionOrder];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setSectionOrder(next);
  };

  const remove = (id: string) => {
    setSectionOrder(sectionOrder.filter((s) => s !== id));
    toast(`${sectionLabel(id)} section hidden.`, "info");
  };

  const add = (id: string) => {
    if (sectionOrder.includes(id)) {
      toast("Section already in resume.", "info");
      return;
    }
    setSectionOrder([...sectionOrder, id]);
    toast(`${sectionLabel(id)} section added.`, "success");
  };

  const addItemToSection = (id: string) => {
    switch (id) {
      case "experience": addExperience(); toast("Experience entry added.", "success"); break;
      case "education": addEducation(); toast("Education entry added.", "success"); break;
      case "projects": addProject(); toast("Project added.", "success"); break;
      case "certificates": addCertificate(); toast("Certificate added.", "success"); break;
      case "achievements": addAchievement(); toast("Achievement added.", "success"); break;
      default: toast(`Add items to ${sectionLabel(id)} from the form builder.`, "info");
    }
  };

  const hidden = ALL_SECTIONS.filter((s) => !sectionOrder.includes(s.id));

  return (
    <div className="nx-editor-panel-body">
      <div style={{ fontSize: "11px", color: "var(--nx-cyan)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px", fontWeight: 600 }}>
        Visible Sections (drag to reorder)
      </div>
      <div className="nx-section-order-list">
        {sectionOrder.map((id, idx) => (
          <div className="nx-section-order-item" key={id}>
            <div className="nx-section-drag-handle" title="Drag to reorder">
              <ListOrdered size={12} />
            </div>
            <span style={{ flex: 1, fontSize: "12px", color: "var(--nx-ice)" }}>{sectionLabel(id)}</span>
            <div className="nx-section-order-actions">
              <button onClick={() => addItemToSection(id)} type="button" title="Add item" className="nx-mini-btn"><Plus size={11} /></button>
              <button onClick={() => move(idx, -1)} type="button" disabled={idx === 0} className="nx-mini-btn" title="Move up"><ChevronUp size={11} /></button>
              <button onClick={() => move(idx, 1)} type="button" disabled={idx === sectionOrder.length - 1} className="nx-mini-btn" title="Move down"><ChevronDown size={11} /></button>
              <button onClick={() => remove(id)} type="button" className="nx-mini-btn nx-mini-btn-danger" title="Hide section"><Trash2 size={11} /></button>
            </div>
          </div>
        ))}
      </div>

      {hidden.length > 0 && (
        <>
          <div style={{ fontSize: "11px", color: "var(--nx-cyan)", letterSpacing: "1px", textTransform: "uppercase", margin: "16px 0 10px", fontWeight: 600 }}>
            Add Hidden Section
          </div>
          <div className="nx-section-add-list">
            {hidden.map((s) => (
              <button key={s.id} className="nx-tpl-chip" onClick={() => add(s.id)} type="button">
                <Plus size={11} /> {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- AI improvement panel ---------- */
const AI_ACTIONS = [
  { id: "improve", label: "Improve Writing", icon: Sparkles },
  { id: "professional", label: "Make Professional", icon: Wand2 },
  { id: "grammar", label: "Fix Grammar", icon: Type },
  { id: "shorten", label: "Shorten", icon: ChevronUp },
  { id: "expand", label: "Expand", icon: ChevronDown },
  { id: "ats", label: "Rewrite for ATS", icon: FileText },
] as const;

function AiPanel() {
  const { data } = useResumeStore();
  const toast = useToast();
  const [selectedText, setSelectedText] = useState<string>(data.summary || "");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const candidateTexts = useMemo(() => {
    const list: { label: string; text: string }[] = [];
    if (data.summary) list.push({ label: "Summary", text: data.summary });
    if (data.objective) list.push({ label: "Objective", text: data.objective });
    data.experience.forEach((e, i) => {
      if (e.responsibilities) list.push({ label: `Experience #${i + 1} (${e.position || e.company})`, text: e.responsibilities });
    });
    data.projects.forEach((p, i) => {
      if (p.description) list.push({ label: `Project #${i + 1} (${p.title})`, text: p.description });
    });
    return list;
  }, [data]);

  const runAction = async (action: string) => {
    if (!selectedText.trim()) {
      toast("Select or paste text to improve first.", "info");
      return;
    }
    setLoading(true);
    setPreview(null);
    try {
      const res = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, text: selectedText, role: data.personal.jobTitle }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to improve text");
      setPreview(json.content);
      toast("AI improved the text. Review below.", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const applyToResume = () => {
    if (!preview) return;
    const { setSummary, data: d } = useResumeStore.getState();
    if (d.summary && selectedText === d.summary) {
      setSummary(preview);
      setSelectedText(preview);
      toast("Updated summary in resume.", "success");
      return;
    }
    // For other fields, copy to clipboard as fallback
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(preview).then(() => toast("Improved text copied. Paste it into the field.", "success"));
    } else {
      toast("Copy the improved text and paste it into the editor.", "info");
    }
    setPreview(null);
  };

  return (
    <div className="nx-editor-panel-body">
      <div style={{ fontSize: "11px", color: "var(--nx-cyan)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px", fontWeight: 600 }}>
        Select Text to Improve
      </div>
      <select className="nx-custom-select" value="" onChange={(e) => { const found = candidateTexts.find((c) => c.label === e.target.value); if (found) { setSelectedText(found.text); setPreview(null); } }}>
        <option value="">Choose a section...</option>
        {candidateTexts.map((c) => <option key={c.label} value={c.label}>{c.label}</option>)}
      </select>
      <textarea
        className="nx-input-field"
        value={selectedText}
        onChange={(e) => { setSelectedText(e.target.value); setPreview(null); }}
        rows={4}
        placeholder="Paste or edit the text you want AI to improve..."
        style={{ width: "100%", marginTop: "10px", fontSize: "12px", resize: "vertical" }}
      />

      <div className="nx-ai-action-grid">
        {AI_ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <button key={a.id} className="nx-ai-action-mini" onClick={() => runAction(a.id)} disabled={loading} type="button">
              <Icon size={12} /> {a.label}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="nx-typing-indicator" style={{ marginTop: "12px" }}>
          <div className="nx-typing-dot" /><div className="nx-typing-dot" /><div className="nx-typing-dot" />
        </div>
      )}

      {preview && !loading && (
        <div className="nx-ai-preview-block">
          <div style={{ fontSize: "11px", color: "var(--nx-cyan)", marginBottom: "6px", fontWeight: 600 }}>AI Result</div>
          <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "12px", color: "var(--nx-ice)", margin: 0 }}>{preview}</pre>
          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
            <button className="nx-tpl-btn" onClick={() => { if (typeof navigator !== "undefined" && navigator.clipboard) navigator.clipboard.writeText(preview); toast("Copied to clipboard.", "success"); }} type="button">Copy</button>
            <button className="nx-tpl-btn nx-tpl-btn-primary" onClick={applyToResume} type="button">Apply</button>
          </div>
        </div>
      )}
      <p style={{ fontSize: "10px", color: "rgba(248,253,255,0.4)", marginTop: "10px" }}>
        AI will ask for confirmation before replacing your existing content. Review the preview, then click Apply.
      </p>
    </div>
  );
}

/* ---------- Photo panel ---------- */
function PhotoPanel() {
  const { selectedTemplate } = useResumeStore();
  const template = getTemplate(selectedTemplate);
  return (
    <div className="nx-editor-panel-body">
      <div style={{ fontSize: "11px", color: "var(--nx-cyan)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px", fontWeight: 600 }}>
        Profile Photo
      </div>
      {!template.hasPhoto && (
        <div style={{ fontSize: "11px", color: "rgba(248,253,255,0.5)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", padding: "8px 10px", borderRadius: "8px" }}>
          <Camera size={12} color="#fbbf24" />
          The current template does not display a photo. Switch templates to show it.
        </div>
      )}
      <PhotoUpload />
      <p style={{ fontSize: "10px", color: "rgba(248,253,255,0.4)", marginTop: "12px" }}>
        The uploaded photo appears in the live preview and the downloaded PDF for every template that supports photos.
      </p>
    </div>
  );
}

/* ---------- Full preview modal ---------- */
function FullPreviewModal({ onClose }: { onClose: () => void }) {
  const { data, selectedTemplate, photoStyle, customization, sectionOrder } = useResumeStore();
  const template = getTemplate(selectedTemplate);
  return (
    <div className="nx-full-preview-overlay" onClick={onClose}>
      <div className="nx-full-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="nx-full-preview-header">
          <div className="nx-full-preview-title">{template.name} — Full Preview</div>
          <button className="nx-full-preview-close" onClick={onClose} type="button" aria-label="Close"><X size={18} /></button>
        </div>
        <div className="nx-full-preview-body">
          <div className="nx-full-preview-a4">
            <EditableResumeRenderer template={template} data={data} photoStyle={photoStyle} customization={customization} sectionOrder={sectionOrder} editable={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main editor ---------- */
export default function ResumeEditor() {
  const {
    setView,
    data,
    selectedTemplate,
    setSelectedTemplate,
    photoStyle,
    customization,
    setCustomization,
    resetCustomization,
    sectionOrder,
    setData,
    editorPanel,
    setEditorPanel,
    previewZoom,
    setPreviewZoom,
    saveCurrentResume,
    pushDesignHistory,
    undoDesign,
    redoDesign,
    designHistory,
    designHistoryIndex,
    setAts,
  } = useResumeStore();
  const toast = useToast();
  const [exporting, setExporting] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const template = getTemplate(selectedTemplate);

  const onEditField = useCallback((path: string, value: string) => {
    const next = applyEditPath(data, path, value);
    setData(next);
    // Recalculate ATS
    const ats = calculateAts(next);
    setAts(ats.score, ats.factors);
  }, [data, setData, setAts]);

  const onExport = async () => {
    setExporting(true);
    try {
      await exportToPDF(data, selectedTemplate, photoStyle);
      toast("Resume downloaded successfully!", "success");
    } catch (err) {
      toast(err instanceof Error ? `Export failed: ${err.message}` : "PDF export failed", "error");
    } finally {
      setExporting(false);
    }
  };

  const onSave = () => {
    const id = saveCurrentResume();
    if (id) toast("Resume saved! Find it in Resume History.", "success");
  };

  const onReset = () => {
    resetCustomization();
    pushDesignHistory({ ...useResumeStore.getState().customization });
    toast("Design reset to defaults.", "info");
  };

  const onTemplateSwitch = (id: string) => {
    setSelectedTemplate(id);
    toast(`Switched to ${getTemplate(id).name}. Your content is preserved.`, "success");
  };

  const canUndo = designHistoryIndex > 0;
  const canRedo = designHistoryIndex < designHistory.length - 1;

  const panels = [
    { id: "fonts" as const, label: "Fonts", icon: Type },
    { id: "colors" as const, label: "Colors", icon: Palette },
    { id: "design" as const, label: "Design", icon: Layout },
    { id: "sections" as const, label: "Sections", icon: ListOrdered },
    { id: "ai" as const, label: "AI Improve", icon: Bot },
    { id: "photo" as const, label: "Photo", icon: Camera },
  ];

  return (
    <section className="nx-section" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
      {/* Top toolbar */}
      <div className="nx-editor-toolbar nx-glass">
        <button className="nx-back-btn" onClick={() => setView("dashboard")} type="button">
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div className="nx-editor-toolbar-center">
          <select
            className="nx-preview-tpl-select"
            value={selectedTemplate}
            onChange={(e) => onTemplateSwitch(e.target.value)}
            aria-label="Switch template"
            title="Switch template without losing data"
          >
            {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="nx-editor-toolbar-right">
          <button className="nx-icon-btn" onClick={undoDesign} disabled={!canUndo} type="button" title="Undo"><Undo2 size={15} /></button>
          <button className="nx-icon-btn" onClick={redoDesign} disabled={!canRedo} type="button" title="Redo"><Redo2 size={15} /></button>
          <button className="nx-icon-btn" onClick={onReset} type="button" title="Reset design"><RotateCcw size={15} /></button>
          <button className="nx-icon-btn" onClick={() => setPreviewZoom(previewZoom - 0.1)} type="button" title="Zoom out"><ZoomOut size={15} /></button>
          <span style={{ fontSize: "11px", color: "rgba(248,253,255,0.5)", minWidth: "36px", textAlign: "center" }}>{Math.round(previewZoom * 100)}%</span>
          <button className="nx-icon-btn" onClick={() => setPreviewZoom(previewZoom + 0.1)} type="button" title="Zoom in"><ZoomIn size={15} /></button>
          <button className="nx-icon-btn" onClick={() => setShowFull(true)} type="button" title="Full view"><Maximize2 size={15} /></button>
          <button className="nx-tpl-btn" onClick={onSave} type="button"><Save size={13} /> Save</button>
          <button className="nx-tpl-btn nx-tpl-btn-primary" onClick={onExport} disabled={exporting} type="button">
            {exporting ? <RefreshCw size={13} className="animate-spin" /> : <Download size={13} />} PDF
          </button>
        </div>
      </div>

      <div className="nx-editor-layout">
        {/* Left: customization panels */}
        <aside className="nx-editor-sidebar nx-glass-strong">
          <div className="nx-editor-panel-tabs">
            {panels.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  className={`nx-editor-panel-tab ${editorPanel === p.id ? "active" : ""}`}
                  onClick={() => setEditorPanel(p.id)}
                  type="button"
                >
                  <Icon size={14} /> {p.label}
                </button>
              );
            })}
          </div>
          <div className="nx-editor-panel-content nx-scroll-area">
            {editorPanel === "fonts" && <FontPanel />}
            {editorPanel === "colors" && <ColorPanel />}
            {editorPanel === "design" && <DesignPanel />}
            {editorPanel === "sections" && <SectionsPanel />}
            {editorPanel === "ai" && <AiPanel />}
            {editorPanel === "photo" && <PhotoPanel />}
          </div>
        </aside>

        {/* Center: live editable resume */}
        <div className="nx-editor-canvas-wrap">
          <div className="nx-editor-canvas-hint">
            <Sparkles size={12} color="var(--nx-cyan)" />
            Click any text in the resume to edit it directly.
          </div>
          <div className="nx-editor-canvas">
            <div className="nx-preview-a4" style={{ transform: `scale(${previewZoom})`, transformOrigin: "top center" }}>
              <EditableResumeRenderer
                template={template}
                data={data}
                photoStyle={photoStyle}
                customization={customization}
                sectionOrder={sectionOrder}
                editable={true}
                onEditField={onEditField}
                selectedPath={selectedPath}
                onSelectPath={setSelectedPath}
              />
            </div>
          </div>
        </div>
      </div>

      {showFull && <FullPreviewModal onClose={() => setShowFull(false)} />}
    </section>
  );
}
