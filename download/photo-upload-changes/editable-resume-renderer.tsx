"use client";

import { useRef, useEffect, useCallback } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
} from "lucide-react";
import type {
  ResumeData,
  PhotoStyle,
} from "@/lib/resume-store";
import type { TemplateConfig } from "@/lib/templates";
import type { ResumeCustomization } from "@/lib/customization";
import { fontStackById, sectionLabel } from "@/lib/customization";
import { SAMPLE_RESUME } from "@/lib/templates";

interface EditableProps {
  template: TemplateConfig;
  data: ResumeData;
  photoStyle: PhotoStyle;
  customization: ResumeCustomization;
  sectionOrder: string[];
  editable?: boolean;
  onEditField?: (path: string, value: string) => void;
  selectedPath?: string | null;
  onSelectPath?: (path: string | null) => void;
}

// EditableText renders a contentEditable span when `editable` is true.
// It only updates the store on blur to avoid cursor jumps.
function EditableText({
  value,
  path,
  editable,
  onEditField,
  onSelectPath,
  selectedPath,
  style,
  as: Tag = "span",
  placeholder,
}: {
  value: string;
  path: string;
  editable: boolean;
  onEditField?: (path: string, value: string) => void;
  onSelectPath?: (path: string | null) => void;
  selectedPath?: string | null;
  style?: React.CSSProperties;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3" | "strong";
  placeholder?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  // Keep the DOM in sync with the store value when not focused.
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      if (ref.current.innerText !== (value || "")) {
        ref.current.innerText = value || "";
      }
    }
  }, [value]);

  const handleBlur = useCallback(() => {
    if (!ref.current || !onEditField) return;
    const text = ref.current.innerText.replace(/\n{2,}/g, "\n").trim();
    if (text !== value) {
      onEditField(path, text);
    }
    onSelectPath?.(null);
  }, [onEditField, onSelectPath, path, value]);

  const handleFocus = useCallback(() => {
    onSelectPath?.(path);
  }, [onSelectPath, path]);

  if (!editable) {
    return (
      <Tag style={style}>
        {value || placeholder || ""}
      </Tag>
    );
  }

  const selected = selectedPath === path;
  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement & HTMLSpanElement>}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onFocus={handleFocus}
      spellCheck={false}
      data-editable-path={path}
      style={{
        ...style,
        outline: selected ? "2px solid #22d3ee" : "none",
        outlineOffset: "2px",
        borderRadius: "3px",
        transition: "outline 0.15s",
        cursor: "text",
        minHeight: "1em",
        display: style?.display || "inline-block",
        minWidth: value ? undefined : "60px",
      }}
      aria-label={placeholder || path}
    />
  );
}

function PhotoView({
  photo,
  style,
  size = 90,
  color,
}: {
  photo: string;
  style: PhotoStyle;
  size?: number;
  color: string;
}) {
  if (!photo) return null;
  const borderRadius = style === "circular" ? "50%" : style === "rounded" ? "12px" : "0px";
  return (
    <img
      src={photo}
      alt="Profile"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "cover",
        borderRadius,
        border: `3px solid ${color}`,
      }}
    />
  );
}

// Builds a flat list of (path -> value) text fields for a section.
function DividerLine({ customization }: { customization: ResumeCustomization }) {
  return (
    <div
      style={{
        height: `${customization.design.dividerThickness}px`,
        width: `${customization.design.dividerLength}%`,
        background: customization.colors.divider,
        margin: `${customization.design.sectionSpacing}px 0`,
        borderRadius: "2px",
      }}
    />
  );
}

export function EditableResumeRenderer({
  template,
  data,
  photoStyle,
  customization,
  sectionOrder,
  editable = false,
  onEditField,
  selectedPath,
  onSelectPath,
}: EditableProps) {
  const hasData = data.personal?.name || data.personal?.email;
  // Normalize the data so arrays are never undefined (prevents runtime crashes
  // when loading from localStorage or AI-generated data).
  const normalizeData = (src: ResumeData): ResumeData => ({
    personal: src.personal || { name: "", email: "", phone: "", location: "", linkedin: "", portfolio: "", jobTitle: "", photo: "" },
    education: Array.isArray(src.education) ? src.education : [],
    skills: {
      technical: Array.isArray(src.skills?.technical) ? src.skills.technical : [],
      programming: Array.isArray(src.skills?.programming) ? src.skills.programming : [],
      soft: Array.isArray(src.skills?.soft) ? src.skills.soft : [],
    },
    experience: Array.isArray(src.experience) ? src.experience : [],
    projects: Array.isArray(src.projects) ? src.projects : [],
    certificates: Array.isArray(src.certificates) ? src.certificates : [],
    achievements: Array.isArray(src.achievements) ? src.achievements : [],
    languages: src.languages || "",
    summary: src.summary || "",
    objective: src.objective || "",
  });
  const renderData = normalizeData(hasData ? data : (SAMPLE_RESUME as unknown as ResumeData));
  const rp = renderData.personal;

  const headingFont = fontStackById(customization.fonts.headingFamily);
  const bodyFont = fontStackById(customization.fonts.bodyFamily);
  const c = customization.colors;
  const d = customization.design;
  const f = customization.fonts;

  const baseBodyStyle: React.CSSProperties = {
    fontFamily: bodyFont,
    fontSize: `${f.baseSize}px`,
    color: c.bodyText,
    lineHeight: f.lineHeight,
    letterSpacing: `${f.letterSpacing}px`,
    fontWeight: f.bold ? 600 : 400,
    fontStyle: f.italic ? "italic" : "normal",
    textDecoration: f.underline ? "underline" : "none",
    textAlign: d.alignment,
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: headingFont,
    fontSize: `${f.headingSize}px`,
    fontWeight: 800,
    color: c.sectionHeadings,
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "8px",
    marginTop: `${d.sectionSpacing}px`,
  };

  const nameStyle: React.CSSProperties = {
    fontFamily: headingFont,
    fontSize: `${f.headingSize + 10}px`,
    fontWeight: 800,
    color: c.name,
    letterSpacing: "1px",
    margin: 0,
  };

  const renderSection = (sectionId: string): React.ReactNode => {
    switch (sectionId) {
      case "summary":
        if (!renderData.summary && !editable) return null;
        return (
          <section key={sectionId} data-section={sectionId}>
            <h2 style={headingStyle}>
              <EditableText
                value="Professional Summary"
                path="section.summary.title"
                editable={editable}
                onEditField={onEditField}
                onSelectPath={onSelectPath}
                selectedPath={selectedPath}
                style={{ color: c.sectionHeadings }}
              />
            </h2>
            <EditableText
              value={renderData.summary}
              path="summary"
              editable={editable}
              onEditField={onEditField}
              onSelectPath={onSelectPath}
              selectedPath={selectedPath}
              placeholder="Your professional summary..."
              as="p"
              style={{ ...baseBodyStyle, marginBottom: "4px" }}
            />
          </section>
        );

      case "objective":
        if (!renderData.objective && !editable) return null;
        return (
          <section key={sectionId} data-section={sectionId}>
            <h2 style={headingStyle}>
              <EditableText
                value="Career Objective"
                path="section.objective.title"
                editable={editable}
                onEditField={onEditField}
                onSelectPath={onSelectPath}
                selectedPath={selectedPath}
                style={{ color: c.sectionHeadings }}
              />
            </h2>
            <EditableText
              value={renderData.objective}
              path="objective"
              editable={editable}
              onEditField={onEditField}
              onSelectPath={onSelectPath}
              selectedPath={selectedPath}
              placeholder="Your career objective..."
              as="p"
              style={{ ...baseBodyStyle, marginBottom: "4px" }}
            />
          </section>
        );

      case "experience":
        if (!renderData.experience.some((e) => e.company || e.position) && !editable) return null;
        return (
          <section key={sectionId} data-section={sectionId}>
            <h2 style={headingStyle}>
              <EditableText
                value="Experience"
                path="section.experience.title"
                editable={editable}
                onEditField={onEditField}
                onSelectPath={onSelectPath}
                selectedPath={selectedPath}
                style={{ color: c.sectionHeadings }}
              />
            </h2>
            {renderData.experience.map((e, i) => (
              <div key={e.id || i} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "6px" }}>
                  <EditableText
                    value={e.position}
                    path={`experience.${e.id}.position`}
                    editable={editable}
                    onEditField={onEditField}
                    onSelectPath={onSelectPath}
                    selectedPath={selectedPath}
                    placeholder="Position"
                    as="strong"
                    style={{ ...baseBodyStyle, fontWeight: 700, color: c.mainHeadings, fontSize: `${f.baseSize + 1}px` }}
                  />
                  <EditableText
                    value={e.duration}
                    path={`experience.${e.id}.duration`}
                    editable={editable}
                    onEditField={onEditField}
                    onSelectPath={onSelectPath}
                    selectedPath={selectedPath}
                    placeholder="Duration"
                    as="span"
                    style={{ ...baseBodyStyle, color: c.subheadings, fontSize: `${f.baseSize - 1}px` }}
                  />
                </div>
                <EditableText
                  value={e.company}
                  path={`experience.${e.id}.company`}
                  editable={editable}
                  onEditField={onEditField}
                  onSelectPath={onSelectPath}
                  selectedPath={selectedPath}
                  placeholder="Company"
                  as="div"
                  style={{ ...baseBodyStyle, color: c.subheadings, fontStyle: "italic", marginBottom: "4px" }}
                />
                <EditableText
                  value={e.responsibilities}
                  path={`experience.${e.id}.responsibilities`}
                  editable={editable}
                  onEditField={onEditField}
                  onSelectPath={onSelectPath}
                  selectedPath={selectedPath}
                  placeholder={"• Responsibility 1\n• Responsibility 2"}
                  as="p"
                  style={{ ...baseBodyStyle, whiteSpace: "pre-wrap" }}
                />
              </div>
            ))}
          </section>
        );

      case "education":
        if (!renderData.education.some((e) => e.college) && !editable) return null;
        return (
          <section key={sectionId} data-section={sectionId}>
            <h2 style={headingStyle}>
              <EditableText
                value="Education"
                path="section.education.title"
                editable={editable}
                onEditField={onEditField}
                onSelectPath={onSelectPath}
                selectedPath={selectedPath}
                style={{ color: c.sectionHeadings }}
              />
            </h2>
            {renderData.education.map((e) => (
              <div key={e.id} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "6px" }}>
                  <EditableText
                    value={`${e.degree}${e.department ? " in " + e.department : ""}`.trim()}
                    path={`education.${e.id}.degree`}
                    editable={editable}
                    onEditField={onEditField}
                    onSelectPath={onSelectPath}
                    selectedPath={selectedPath}
                    placeholder="Degree in Field"
                    as="strong"
                    style={{ ...baseBodyStyle, fontWeight: 700, color: c.mainHeadings }}
                  />
                  <EditableText
                    value={e.year}
                    path={`education.${e.id}.year`}
                    editable={editable}
                    onEditField={onEditField}
                    onSelectPath={onSelectPath}
                    selectedPath={selectedPath}
                    placeholder="Year"
                    as="span"
                    style={{ ...baseBodyStyle, color: c.subheadings, fontSize: `${f.baseSize - 1}px` }}
                  />
                </div>
                <EditableText
                  value={e.college}
                  path={`education.${e.id}.college`}
                  editable={editable}
                  onEditField={onEditField}
                  onSelectPath={onSelectPath}
                  selectedPath={selectedPath}
                  placeholder="College / University"
                  as="div"
                  style={{ ...baseBodyStyle, color: c.subheadings, fontStyle: "italic" }}
                />
                {e.cgpa && (
                  <EditableText
                    value={`Score: ${e.cgpa}`}
                    path={`education.${e.id}.cgpa`}
                    editable={editable}
                    onEditField={onEditField}
                    onSelectPath={onSelectPath}
                    selectedPath={selectedPath}
                    as="div"
                    style={{ ...baseBodyStyle, fontSize: `${f.baseSize - 1}px` }}
                  />
                )}
              </div>
            ))}
          </section>
        );

      case "projects":
        if (!renderData.projects.some((p) => p.title) && !editable) return null;
        return (
          <section key={sectionId} data-section={sectionId}>
            <h2 style={headingStyle}>
              <EditableText
                value="Projects"
                path="section.projects.title"
                editable={editable}
                onEditField={onEditField}
                onSelectPath={onSelectPath}
                selectedPath={selectedPath}
                style={{ color: c.sectionHeadings }}
              />
            </h2>
            {renderData.projects.map((p) => (
              <div key={p.id} style={{ marginBottom: "10px" }}>
                <EditableText
                  value={p.title}
                  path={`projects.${p.id}.title`}
                  editable={editable}
                  onEditField={onEditField}
                  onSelectPath={onSelectPath}
                  selectedPath={selectedPath}
                  placeholder="Project Title"
                  as="strong"
                  style={{ ...baseBodyStyle, fontWeight: 700, color: c.mainHeadings }}
                />
                {p.technologies && (
                  <div style={{ ...baseBodyStyle, color: c.sectionHeadings, fontSize: `${f.baseSize - 1}px`, marginTop: "2px" }}>
                    <span>Tech: </span>
                    <EditableText
                      value={p.technologies}
                      path={`projects.${p.id}.technologies`}
                      editable={editable}
                      onEditField={onEditField}
                      onSelectPath={onSelectPath}
                      selectedPath={selectedPath}
                      as="span"
                    />
                  </div>
                )}
                <EditableText
                  value={p.description}
                  path={`projects.${p.id}.description`}
                  editable={editable}
                  onEditField={onEditField}
                  onSelectPath={onSelectPath}
                  selectedPath={selectedPath}
                  placeholder="Project description..."
                  as="p"
                  style={{ ...baseBodyStyle, whiteSpace: "pre-wrap", marginTop: "4px" }}
                />
              </div>
            ))}
          </section>
        );

      case "skills": {
        const allSkills = [...renderData.skills.technical, ...renderData.skills.programming];
        if (allSkills.length === 0 && renderData.skills.soft.length === 0 && !editable) return null;
        return (
          <section key={sectionId} data-section={sectionId}>
            <h2 style={headingStyle}>
              <EditableText
                value="Skills"
                path="section.skills.title"
                editable={editable}
                onEditField={onEditField}
                onSelectPath={onSelectPath}
                selectedPath={selectedPath}
                style={{ color: c.sectionHeadings }}
              />
            </h2>
            {allSkills.length > 0 && (
              <div style={{ marginBottom: "6px" }}>
                <div style={{ ...baseBodyStyle, fontWeight: 700, color: c.subheadings, marginBottom: "4px" }}>Technical</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {allSkills.map((s, i) => (
                    <span
                      key={s + i}
                      style={{
                        ...baseBodyStyle,
                        background: `${c.bullets}15`,
                        border: `1px solid ${c.bullets}40`,
                        borderRadius: "12px",
                        padding: "2px 10px",
                        fontSize: `${f.baseSize - 1}px`,
                        color: c.bodyText,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {renderData.skills.soft.length > 0 && (
              <div>
                <div style={{ ...baseBodyStyle, fontWeight: 700, color: c.subheadings, marginBottom: "4px" }}>Soft Skills</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {renderData.skills.soft.map((s, i) => (
                    <span
                      key={"soft" + i}
                      style={{
                        ...baseBodyStyle,
                        background: `${c.bullets}10`,
                        border: `1px solid ${c.bullets}30`,
                        borderRadius: "12px",
                        padding: "2px 10px",
                        fontSize: `${f.baseSize - 1}px`,
                        color: c.bodyText,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      }

      case "certificates":
        if (!renderData.certificates.some((c2) => c2.name) && !editable) return null;
        return (
          <section key={sectionId} data-section={sectionId}>
            <h2 style={headingStyle}>
              <EditableText
                value="Certifications"
                path="section.certificates.title"
                editable={editable}
                onEditField={onEditField}
                onSelectPath={onSelectPath}
                selectedPath={selectedPath}
                style={{ color: c.sectionHeadings }}
              />
            </h2>
            {renderData.certificates.map((cert) => (
              <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", flexWrap: "wrap", gap: "6px" }}>
                <EditableText
                  value={cert.name}
                  path={`certificates.${cert.id}.name`}
                  editable={editable}
                  onEditField={onEditField}
                  onSelectPath={onSelectPath}
                  selectedPath={selectedPath}
                  placeholder="Certificate Name"
                  as="strong"
                  style={{ ...baseBodyStyle, fontWeight: 700, color: c.mainHeadings }}
                />
                <div style={{ ...baseBodyStyle, color: c.subheadings }}>
                  <EditableText
                    value={cert.organization}
                    path={`certificates.${cert.id}.organization`}
                    editable={editable}
                    onEditField={onEditField}
                    onSelectPath={onSelectPath}
                    selectedPath={selectedPath}
                    placeholder="Organization"
                    as="span"
                  />
                  {" — "}
                  <EditableText
                    value={cert.year}
                    path={`certificates.${cert.id}.year`}
                    editable={editable}
                    onEditField={onEditField}
                    onSelectPath={onSelectPath}
                    selectedPath={selectedPath}
                    placeholder="Year"
                    as="span"
                  />
                </div>
              </div>
            ))}
          </section>
        );

      case "achievements":
        if (!renderData.achievements.some((a) => a.title) && !editable) return null;
        return (
          <section key={sectionId} data-section={sectionId}>
            <h2 style={headingStyle}>
              <EditableText
                value="Achievements"
                path="section.achievements.title"
                editable={editable}
                onEditField={onEditField}
                onSelectPath={onSelectPath}
                selectedPath={selectedPath}
                style={{ color: c.sectionHeadings }}
              />
            </h2>
            {renderData.achievements.map((a) => (
              <div key={a.id} style={{ marginBottom: "6px", display: "flex", gap: "8px" }}>
                <span style={{ color: c.bullets, fontWeight: 700 }}>•</span>
                <div>
                  <EditableText
                    value={a.title}
                    path={`achievements.${a.id}.title`}
                    editable={editable}
                    onEditField={onEditField}
                    onSelectPath={onSelectPath}
                    selectedPath={selectedPath}
                    placeholder="Achievement Title"
                    as="strong"
                    style={{ ...baseBodyStyle, fontWeight: 700, color: c.mainHeadings }}
                  />
                  {a.description && (
                    <EditableText
                      value={` — ${a.description}`}
                      path={`achievements.${a.id}.description`}
                      editable={editable}
                      onEditField={onEditField}
                      onSelectPath={onSelectPath}
                      selectedPath={selectedPath}
                      as="span"
                      style={{ ...baseBodyStyle, color: c.bodyText }}
                    />
                  )}
                </div>
              </div>
            ))}
          </section>
        );

      case "languages":
        if (!renderData.languages && !editable) return null;
        return (
          <section key={sectionId} data-section={sectionId}>
            <h2 style={headingStyle}>
              <EditableText
                value="Languages"
                path="section.languages.title"
                editable={editable}
                onEditField={onEditField}
                onSelectPath={onSelectPath}
                selectedPath={selectedPath}
                style={{ color: c.sectionHeadings }}
              />
            </h2>
            <EditableText
              value={renderData.languages}
              path="languages"
              editable={editable}
              onEditField={onEditField}
              onSelectPath={onSelectPath}
              selectedPath={selectedPath}
              placeholder="English (Fluent), Spanish (Intermediate)"
              as="p"
              style={baseBodyStyle}
            />
          </section>
        );

      default:
        return null;
    }
  };

  const rootStyle: React.CSSProperties = {
    background: c.background,
    color: c.bodyText,
    fontFamily: bodyFont,
    borderRadius: "8px",
    overflow: "hidden",
    minHeight: "100%",
    position: "relative",
    padding: `${d.margin}px`,
  };

  return (
    <div className="nx-tpl-root" style={rootStyle}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "15px",
          paddingBottom: "12px",
          marginBottom: "12px",
          borderBottom: `${d.dividerThickness}px solid ${c.divider}`,
        }}
      >
        <div style={{ flex: 1, minWidth: "200px" }}>
          <EditableText
            value={rp.name}
            path="personal.name"
            editable={editable}
            onEditField={onEditField}
            onSelectPath={onSelectPath}
            selectedPath={selectedPath}
            placeholder="Your Name"
            as="h1"
            style={nameStyle}
          />
          <EditableText
            value={rp.jobTitle}
            path="personal.jobTitle"
            editable={editable}
            onEditField={onEditField}
            onSelectPath={onSelectPath}
            selectedPath={selectedPath}
            placeholder="Professional Title"
            as="p"
            style={{
              fontFamily: headingFont,
              fontSize: `${f.headingSize}px`,
              color: c.sectionHeadings,
              fontWeight: 600,
              margin: "4px 0 0",
            }}
          />
        </div>
        {template.hasPhoto && rp.photo && (
          <PhotoView photo={rp.photo} style={photoStyle} size={90} color={c.divider} />
        )}
      </div>

      {/* Contact info */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px 18px",
          fontSize: `${f.baseSize - 1}px`,
          color: c.contactInfo,
          marginBottom: `${d.sectionSpacing}px`,
          paddingBottom: "10px",
          borderBottom: `1px solid ${c.divider}40`,
        }}
      >
        {rp.email && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Mail size={10} /> <EditableText value={rp.email} path="personal.email" editable={editable} onEditField={onEditField} onSelectPath={onSelectPath} selectedPath={selectedPath} as="span" />
          </span>
        )}
        {rp.phone && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Phone size={10} /> <EditableText value={rp.phone} path="personal.phone" editable={editable} onEditField={onEditField} onSelectPath={onSelectPath} selectedPath={selectedPath} as="span" />
          </span>
        )}
        {rp.location && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <MapPin size={10} /> <EditableText value={rp.location} path="personal.location" editable={editable} onEditField={onEditField} onSelectPath={onSelectPath} selectedPath={selectedPath} as="span" />
          </span>
        )}
        {rp.linkedin && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Linkedin size={10} /> <EditableText value={rp.linkedin} path="personal.linkedin" editable={editable} onEditField={onEditField} onSelectPath={onSelectPath} selectedPath={selectedPath} as="span" />
          </span>
        )}
        {rp.portfolio && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Globe size={10} /> <EditableText value={rp.portfolio} path="personal.portfolio" editable={editable} onEditField={onEditField} onSelectPath={onSelectPath} selectedPath={selectedPath} as="span" />
          </span>
        )}
      </div>

      {/* Sections in the user-defined order */}
      <div>
        {sectionOrder.map((sid) => renderSection(sid))}
      </div>
    </div>
  );
}

// Helper to apply an edit path to the resume store.
// Path examples: "personal.name", "summary", "experience.<id>.position",
// "section.experience.title"
export function applyEditPath(
  data: ResumeData,
  path: string,
  value: string
): ResumeData {
  const next = JSON.parse(JSON.stringify(data)) as ResumeData;

  if (path.startsWith("personal.")) {
    const key = path.split(".")[1] as keyof typeof next.personal;
    (next.personal as Record<string, string>)[key] = value;
    return next;
  }

  if (path === "summary") {
    next.summary = value;
    return next;
  }
  if (path === "objective") {
    next.objective = value;
    return next;
  }
  if (path === "languages") {
    next.languages = value;
    return next;
  }

  // Section title edits — stored as overrides (kept simple: we just
  // map known titles; the renderer uses these when present).
  if (path.startsWith("section.")) {
    // Title overrides are purely cosmetic and not persisted to ResumeData.
    // They would require an extra field; for now we ignore them client-side
    // to avoid breaking the data shape.
    return next;
  }

  // experience.<id>.field
  if (path.startsWith("experience.")) {
    const [, id, field] = path.split(".");
    next.experience = next.experience.map((e) =>
      e.id === id ? { ...e, [field]: value } : e
    );
    return next;
  }
  if (path.startsWith("education.")) {
    const [, id, field] = path.split(".");
    next.education = next.education.map((e) =>
      e.id === id ? { ...e, [field]: value } : e
    );
    return next;
  }
  if (path.startsWith("projects.")) {
    const [, id, field] = path.split(".");
    next.projects = next.projects.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    return next;
  }
  if (path.startsWith("certificates.")) {
    const [, id, field] = path.split(".");
    next.certificates = next.certificates.map((c2) =>
      c2.id === id ? { ...c2, [field]: value } : c2
    );
    return next;
  }
  if (path.startsWith("achievements.")) {
    const [, id, field] = path.split(".");
    next.achievements = next.achievements.map((a) =>
      a.id === id ? { ...a, [field]: value } : a
    );
    return next;
  }

  return next;
}
