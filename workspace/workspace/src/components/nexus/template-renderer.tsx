"use client";

import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Code,
  Briefcase,
  Box,
  Award,
  GraduationCap,
} from "lucide-react";
import type { ResumeData } from "@/lib/resume-store";
import type { PhotoStyle } from "@/lib/resume-store";
import type { TemplateConfig } from "@/lib/templates";
import { SAMPLE_RESUME } from "@/lib/templates";

interface RendererProps {
  template: TemplateConfig;
  data: ResumeData;
  photoStyle: PhotoStyle;
}

function PhotoView({
  photo,
  style,
  size = 90,
  template,
}: {
  photo: string;
  style: PhotoStyle;
  size?: number;
  template: TemplateConfig;
}) {
  if (!photo) return null;
  const borderRadius =
    style === "circular" ? "50%" : style === "rounded" ? "12px" : "0px";
  return (
    <img
      src={photo}
      alt="Profile"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "cover",
        borderRadius,
        border: `3px solid ${template.accent}`,
      }}
    />
  );
}

function ContactLine({ data, template }: { data: ResumeData; template: TemplateConfig }) {
  const p = data.personal;
  return (
    <div className="nx-tpl-contact">
      {p.email && <span><Mail size={10} /> {p.email}</span>}
      {p.phone && <span><Phone size={10} /> {p.phone}</span>}
      {p.location && <span><MapPin size={10} /> {p.location}</span>}
      {p.linkedin && <span><Linkedin size={10} /> {p.linkedin}</span>}
      {p.portfolio && <span><Globe size={10} /> {p.portfolio}</span>}
    </div>
  );
}

function SidebarContent({
  data,
  template,
  photo,
  photoStyle,
}: {
  data: ResumeData;
  template: TemplateConfig;
  photo: string;
  photoStyle: PhotoStyle;
}) {
  const allSkills = [...data.skills.technical, ...data.skills.programming];
  return (
    <>
      {template.hasPhoto && photo && template.photoPosition === "sidebar-top" && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <PhotoView photo={photo} style={photoStyle} size={110} template={template} />
        </div>
      )}
      <div className="nx-tpl-side-block">
        <h3 style={{ color: template.accent }}>CONTACT</h3>
        <div className="nx-tpl-side-contact">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
          {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
          {data.personal.portfolio && <span>{data.personal.portfolio}</span>}
        </div>
      </div>
      {allSkills.length > 0 && (
        <div className="nx-tpl-side-block">
          <h3 style={{ color: template.accent }}>SKILLS</h3>
          <div className="nx-tpl-side-skills">
            {allSkills.map((s, i) => (
              <span key={s + i}>{s}</span>
            ))}
            {data.skills.soft.map((s, i) => (
              <span key={"soft" + i}>{s}</span>
            ))}
          </div>
        </div>
      )}
      {data.languages && (
        <div className="nx-tpl-side-block">
          <h3 style={{ color: template.accent }}>LANGUAGES</h3>
          <p className="nx-tpl-side-text">{data.languages}</p>
        </div>
      )}
      {data.certificates.some((c) => c.name) && (
        <div className="nx-tpl-side-block">
          <h3 style={{ color: template.accent }}>CERTIFICATIONS</h3>
          {data.certificates.map(
            (c, i) =>
              c.name && (
                <div key={i} className="nx-tpl-side-item">
                  <strong>{c.name}</strong>
                  {c.organization && <span>{c.organization}</span>}
                  {c.year && <span>{c.year}</span>}
                </div>
              )
          )}
        </div>
      )}
    </>
  );
}

function MainContent({ data, template }: { data: ResumeData; template: TemplateConfig }) {
  return (
    <>
      {data.summary && (
        <div className="nx-tpl-section">
          <h2 style={{ color: template.accent }}>PROFESSIONAL SUMMARY</h2>
          <p className="nx-tpl-summary">{data.summary}</p>
        </div>
      )}
      {data.experience.some((e) => e.company || e.position) && (
        <div className="nx-tpl-section">
          <h2 style={{ color: template.accent }}>EXPERIENCE</h2>
          {data.experience.map(
            (e, i) =>
              (e.company || e.position) && (
                <div key={i} className="nx-tpl-entry">
                  <div className="nx-tpl-entry-head">
                    <strong>{e.position || ""}</strong>
                    <span className="nx-tpl-date">{e.duration || ""}</span>
                  </div>
                  <div className="nx-tpl-entry-sub">{e.company || ""}</div>
                  {e.responsibilities && (
                    <p className="nx-tpl-resp">{e.responsibilities}</p>
                  )}
                </div>
              )
          )}
        </div>
      )}
      {data.education.some((e) => e.college) && (
        <div className="nx-tpl-section">
          <h2 style={{ color: template.accent }}>EDUCATION</h2>
          {data.education.map(
            (e, i) =>
              (e.college || e.degree) && (
                <div key={i} className="nx-tpl-entry">
                  <div className="nx-tpl-entry-head">
                    <strong>
                      {e.degree || ""} {e.department ? "in " + e.department : ""}
                    </strong>
                    <span className="nx-tpl-date">{e.year || ""}</span>
                  </div>
                  <div className="nx-tpl-entry-sub">{e.college || ""}</div>
                  {e.cgpa && <p className="nx-tpl-resp">Score: {e.cgpa}</p>}
                </div>
              )
          )}
        </div>
      )}
      {data.projects.some((p) => p.title) && (
        <div className="nx-tpl-section">
          <h2 style={{ color: template.accent }}>PROJECTS</h2>
          {data.projects.map(
            (p, i) =>
              p.title && (
                <div key={i} className="nx-tpl-entry">
                  <strong>{p.title}</strong>
                  {p.technologies && (
                    <div className="nx-tpl-tech" style={{ color: template.accent }}>
                      Tech: {p.technologies}
                    </div>
                  )}
                  {p.description && <p className="nx-tpl-resp">{p.description}</p>}
                </div>
              )
          )}
        </div>
      )}
    </>
  );
}

export function TemplateRenderer({ template, data, photoStyle }: RendererProps) {
  const p = data.personal;
  const photo = p.photo;
  const hasData = p.name || p.email;
  const renderData = hasData ? data : (SAMPLE_RESUME as unknown as ResumeData);
  const rp = renderData.personal;

  const rootStyle: React.CSSProperties = {
    background: "#ffffff",
    color: template.textColor,
    fontFamily: template.fontBody,
    borderRadius: "8px",
    overflow: "hidden",
    minHeight: "100%",
    position: "relative",
  };

  // HEADER BAR layout (executive, professional-blue)
  if (template.layout === "header-bar") {
    return (
      <div className="nx-tpl-root" style={rootStyle}>
        <div
          className="nx-tpl-header-bar"
          style={{
            background: `linear-gradient(135deg, ${template.accent}, ${template.accentSecondary})`,
            padding: "30px 40px",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: template.fontHeading,
                fontSize: "26px",
                fontWeight: 800,
                margin: 0,
                letterSpacing: "1px",
              }}
            >
              {rp.name || "Your Name"}
            </h1>
            <p style={{ fontSize: "14px", opacity: 0.9, margin: "4px 0 0" }}>
              {rp.jobTitle || "Professional Title"}
            </p>
          </div>
          {template.hasPhoto && photo && template.photoPosition === "top-right" && (
            <PhotoView photo={photo} style={photoStyle} size={90} template={template} />
          )}
        </div>
        <div style={{ padding: "25px 40px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              fontSize: "12px",
              marginBottom: "20px",
              color: template.mutedColor,
              paddingBottom: "15px",
              borderBottom: `2px solid ${template.accent}33`,
            }}
          >
            {rp.email && <span>{rp.email}</span>}
            {rp.phone && <span>{rp.phone}</span>}
            {rp.location && <span>{rp.location}</span>}
            {rp.linkedin && <span>{rp.linkedin}</span>}
          </div>
          <MainContent data={renderData} template={template} />
        </div>
      </div>
    );
  }

  // SIDEBAR layout (graphic-designer) - left sidebar with accent background
  if (template.layout === "sidebar") {
    return (
      <div className="nx-tpl-root" style={rootStyle}>
        <div style={{ display: "flex", minHeight: "500px" }}>
          <div
            style={{
              width: "35%",
              background: `linear-gradient(180deg, ${template.accent}, ${template.accentSecondary})`,
              color: "#fff",
              padding: "30px 20px",
            }}
          >
            <SidebarContent
              data={renderData}
              template={{ ...template, accent: "#fff", accentSecondary: "#fff" }}
              photo={photo}
              photoStyle={photoStyle}
            />
          </div>
          <div style={{ flex: 1, padding: "30px 25px" }}>
            <h1
              style={{
                fontFamily: template.fontHeading,
                fontSize: "24px",
                fontWeight: 800,
                color: template.textColor,
                margin: 0,
              }}
            >
              {rp.name || "Your Name"}
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: template.accent,
                fontWeight: 600,
                margin: "3px 0 15px",
              }}
            >
              {rp.jobTitle || "Professional Title"}
            </p>
            <MainContent data={renderData} template={template} />
          </div>
        </div>
      </div>
    );
  }

  // TWO-COLUMN layouts
  if (
    template.layout === "two-column-left" ||
    template.layout === "two-column-right"
  ) {
    const isLeft = template.layout === "two-column-left";
    const sidebar = (
      <div
        style={{
          width: "32%",
          background: `linear-gradient(180deg, ${template.accent}15, ${template.accentSecondary}10)`,
          padding: "25px 18px",
          borderRight: isLeft ? `2px solid ${template.accent}33` : "none",
          borderLeft: !isLeft ? `2px solid ${template.accent}33` : "none",
        }}
      >
        <SidebarContent
          data={renderData}
          template={template}
          photo={photo}
          photoStyle={photoStyle}
        />
      </div>
    );
    const main = (
      <div style={{ flex: 1, padding: "25px 22px" }}>
        <h1
          style={{
            fontFamily: template.fontHeading,
            fontSize: "24px",
            fontWeight: 800,
            color: template.textColor,
            margin: 0,
          }}
        >
          {rp.name || "Your Name"}
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: template.accent,
            fontWeight: 600,
            margin: "3px 0 15px",
          }}
        >
          {rp.jobTitle || "Professional Title"}
        </p>
        <MainContent data={renderData} template={template} />
      </div>
    );
    return (
      <div className="nx-tpl-root" style={rootStyle}>
        <div style={{ display: "flex", minHeight: "500px" }}>
          {isLeft ? (
            <>
              {sidebar}
              {main}
            </>
          ) : (
            <>
              {main}
              {sidebar}
            </>
          )}
        </div>
      </div>
    );
  }

  // SINGLE column layout (default)
  return (
    <div className="nx-tpl-root" style={{ ...rootStyle, padding: "35px 40px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "15px",
          borderBottom: `3px solid ${template.accent}`,
          paddingBottom: "15px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: template.fontHeading,
              fontSize: "28px",
              fontWeight: 800,
              color: template.textColor,
              margin: 0,
              letterSpacing: template.fontHeading.includes("serif") ? "0" : "1px",
            }}
          >
            {rp.name || "Your Name"}
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: template.accent,
              fontWeight: 600,
              margin: "4px 0 0",
            }}
          >
            {rp.jobTitle || "Professional Title"}
          </p>
        </div>
        {template.hasPhoto && photo && template.photoPosition === "top-right" && (
          <PhotoView photo={photo} style={photoStyle} size={90} template={template} />
        )}
      </div>
      <ContactLine data={renderData} template={template} />
      <MainContent data={renderData} template={template} />
      {data.certificates.some((c) => c.name) && template.layout === "single" && (
        <div className="nx-tpl-section">
          <h2 style={{ color: template.accent }}>CERTIFICATIONS</h2>
          {data.certificates.map(
            (c, i) =>
              c.name && (
                <div key={i} className="nx-tpl-entry">
                  <div className="nx-tpl-entry-head">
                    <strong>{c.name}</strong>
                    <span className="nx-tpl-date">{c.year}</span>
                  </div>
                  <div className="nx-tpl-entry-sub">{c.organization}</div>
                </div>
              )
          )}
        </div>
      )}
      {data.languages && template.layout === "single" && (
        <div className="nx-tpl-section">
          <h2 style={{ color: template.accent }}>LANGUAGES</h2>
          <p className="nx-tpl-resp">{data.languages}</p>
        </div>
      )}
    </div>
  );
}

// Miniature preview for template gallery cards
// ===== REALISTIC MINIATURE RESUME PREVIEW =====
// Each miniature looks like an actual miniature resume document with real text content

function MiniText({ children, color, size = 6, weight = 400, italic = false }: {
  children: React.ReactNode;
  color?: string;
  size?: number;
  weight?: number;
  italic?: boolean;
}) {
  return (
    <span
      style={{
        fontSize: `${size}px`,
        lineHeight: 1.3,
        color: color || "#475569",
        fontWeight: weight,
        fontStyle: italic ? "italic" : "normal",
        display: "block",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      {children}
    </span>
  );
}

function MiniSectionTitle({ children, color, align = "left" }: {
  children: React.ReactNode;
  color: string;
  align?: "left" | "center";
}) {
  return (
    <div
      style={{
        fontSize: "7px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.8px",
        color,
        borderBottom: `1px solid ${color}40`,
        paddingBottom: "2px",
        marginBottom: "4px",
        marginTop: "8px",
        textAlign: align,
      }}
    >
      {children}
    </div>
  );
}

function MiniLine({ width = "100%", color = "#cbd5e1" }: { width?: string; color?: string }) {
  return (
    <div
      style={{
        height: "2px",
        background: color,
        borderRadius: "1px",
        width,
        marginBottom: "2px",
      }}
    />
  );
}

function MiniPhoto({ color, size = 22, shape = "circle" }: { color: string; size?: number; shape?: "circle" | "square" | "rounded" }) {
  const radius = shape === "circle" ? "50%" : shape === "rounded" ? "4px" : "0px";
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: radius,
        background: `linear-gradient(135deg, ${color}40, ${color}80)`,
        border: `1.5px solid ${color}`,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: `${size * 0.4}px`, height: `${size * 0.4}px`, borderRadius: "50%", background: `${color}60` }} />
    </div>
  );
}

function MiniExperienceEntry({ accent, role, company, date }: { accent: string; role: string; company: string; date: string }) {
  return (
    <div style={{ marginBottom: "5px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <MiniText color={accent} size={6} weight={700}>{role}</MiniText>
        <MiniText color="#94a3b8" size={5}>{date}</MiniText>
      </div>
      <MiniText color="#64748b" size={5} italic>{company}</MiniText>
      <MiniLine width="90%" />
      <MiniLine width="75%" />
    </div>
  );
}

function MiniSidebar({ template }: { template: TemplateConfig }) {
  const accent = template.accent;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      {template.hasPhoto && template.photoPosition === "sidebar-top" && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2px" }}>
          <MiniPhoto color={accent} size={20} />
        </div>
      )}
      <div>
        <MiniSectionTitle color={accent}>Contact</MiniSectionTitle>
        <MiniText size={5}>alex@email.com</MiniText>
        <MiniText size={5}>+1 234 567 890</MiniText>
        <MiniText size={5}>San Francisco</MiniText>
      </div>
      <div>
        <MiniSectionTitle color={accent}>Skills</MiniSectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
          {["React", "Node", "AWS", "Python", "SQL"].map((s) => (
            <span key={s} style={{ fontSize: "5px", padding: "1px 3px", background: `${accent}20`, borderRadius: "2px", color: accent, fontWeight: 600 }}>
              {s}
            </span>
          ))}
        </div>
      </div>
      <div>
        <MiniSectionTitle color={accent}>Languages</MiniSectionTitle>
        <MiniText size={5}>English, Spanish</MiniText>
      </div>
      <div>
        <MiniSectionTitle color={accent}>Certifications</MiniSectionTitle>
        <MiniText size={5} weight={600}>AWS Architect</MiniText>
        <MiniText size={5} color="#94a3b8">2023</MiniText>
      </div>
    </div>
  );
}

function MiniMainContent({ template }: { template: TemplateConfig }) {
  const accent = template.accent;
  return (
    <div>
      <MiniSectionTitle color={accent}>Experience</MiniSectionTitle>
      <MiniExperienceEntry accent={accent} role="Senior Engineer" company="Google" date="2021-Now" />
      <MiniExperienceEntry accent={accent} role="Software Engineer" company="Meta" date="2019-21" />

      <MiniSectionTitle color={accent}>Education</MiniSectionTitle>
      <div style={{ marginBottom: "5px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <MiniText color={accent} size={6} weight={700}>B.S. Computer Science</MiniText>
          <MiniText color="#94a3b8" size={5}>2019</MiniText>
        </div>
        <MiniText color="#64748b" size={5} italic>Stanford University</MiniText>
      </div>

      <MiniSectionTitle color={accent}>Projects</MiniSectionTitle>
      <MiniText color={accent} size={6} weight={700}>AI Resume Builder</MiniText>
      <MiniText size={5}>Next.js, TypeScript, OpenAI</MiniText>
      <MiniLine width="85%" />
      <MiniLine width="65%" />
    </div>
  );
}

export function TemplateMiniature({ template }: { template: TemplateConfig }) {
  const accent = template.accent;
  const accentSec = template.accentSecondary;
  const textColor = template.textColor;
  const mutedColor = template.mutedColor;
  const isSerif = template.fontHeading.includes("serif");

  const headerNameSize = isSerif ? 11 : 12;
  const headerFontFamily = isSerif ? "Georgia, serif" : "inherit";

  // HEADER BAR layout (executive, professional-blue)
  if (template.layout === "header-bar") {
    return (
      <div style={{ height: "100%", background: "#fff", borderRadius: "6px", overflow: "hidden", fontFamily: template.fontBody }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${accent}, ${accentSec})`,
            padding: "8px 10px",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: `${headerNameSize}px`, fontWeight: 800, fontFamily: headerFontFamily, lineHeight: 1.1 }}>Alex Morgan</div>
            <div style={{ fontSize: "7px", opacity: 0.85, marginTop: "1px" }}>Senior Software Engineer</div>
          </div>
          {template.hasPhoto && (
            <MiniPhoto color="#fff" size={22} />
          )}
        </div>
        <div style={{ padding: "5px 10px" }}>
          <div style={{ display: "flex", gap: "6px", fontSize: "5px", color: mutedColor, marginBottom: "3px", flexWrap: "wrap" }}>
            <span>alex@email.com</span>
            <span>+1 234 567</span>
            <span>San Francisco</span>
          </div>
          <MiniMainContent template={template} />
        </div>
      </div>
    );
  }

  // SIDEBAR layout (graphic-designer) - full colored sidebar
  if (template.layout === "sidebar") {
    return (
      <div style={{ height: "100%", display: "flex", background: "#fff", borderRadius: "6px", overflow: "hidden", fontFamily: template.fontBody }}>
        <div
          style={{
            width: "35%",
            background: `linear-gradient(180deg, ${accent}, ${accentSec})`,
            color: "#fff",
            padding: "8px 6px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
            <MiniPhoto color="#fff" size={24} />
          </div>
          <div style={{ fontSize: "6px", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: "2px", marginBottom: "4px", letterSpacing: "0.5px" }}>
            Contact
          </div>
          <div style={{ fontSize: "5px", lineHeight: 1.5, opacity: 0.9 }}>
            <div>alex@email.com</div>
            <div>+1 234 567</div>
            <div>San Francisco</div>
          </div>
          <div style={{ fontSize: "6px", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: "2px", marginBottom: "4px", marginTop: "6px", letterSpacing: "0.5px" }}>
            Skills
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
            {["React", "Node", "AWS", "Python"].map((s) => (
              <span key={s} style={{ fontSize: "5px", padding: "1px 3px", background: "rgba(255,255,255,0.2)", borderRadius: "2px" }}>{s}</span>
            ))}
          </div>
          <div style={{ fontSize: "6px", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: "2px", marginBottom: "4px", marginTop: "6px", letterSpacing: "0.5px" }}>
            Languages
          </div>
          <div style={{ fontSize: "5px", opacity: 0.9 }}>English, Spanish</div>
        </div>
        <div style={{ flex: 1, padding: "8px 7px" }}>
          <div style={{ fontSize: `${headerNameSize}px`, fontWeight: 800, fontFamily: headerFontFamily, color: textColor, lineHeight: 1.1 }}>Alex Morgan</div>
          <div style={{ fontSize: "7px", color: accent, fontWeight: 600, marginTop: "1px" }}>Senior Engineer</div>
          <MiniMainContent template={template} />
        </div>
      </div>
    );
  }

  // TWO-COLUMN layouts
  if (template.layout === "two-column-left" || template.layout === "two-column-right") {
    const isLeft = template.layout === "two-column-left";
    const sidebar = (
      <div
        style={{
          width: "33%",
          background: `linear-gradient(180deg, ${accent}12, ${accentSec}08)`,
          padding: "8px 5px",
          borderRight: isLeft ? `1.5px solid ${accent}30` : "none",
          borderLeft: !isLeft ? `1.5px solid ${accent}30` : "none",
        }}
      >
        <MiniSidebar template={template} />
      </div>
    );
    const main = (
      <div style={{ flex: 1, padding: "8px 7px" }}>
        <div style={{ fontSize: `${headerNameSize}px`, fontWeight: 800, fontFamily: headerFontFamily, color: textColor, lineHeight: 1.1 }}>Alex Morgan</div>
        <div style={{ fontSize: "7px", color: accent, fontWeight: 600, marginTop: "1px", marginBottom: "3px" }}>Senior Engineer</div>
        <MiniMainContent template={template} />
      </div>
    );
    return (
      <div style={{ height: "100%", display: "flex", background: "#fff", borderRadius: "6px", overflow: "hidden", fontFamily: template.fontBody }}>
        {isLeft ? (
          <>
            {sidebar}
            {main}
          </>
        ) : (
          <>
            {main}
            {sidebar}
          </>
        )}
      </div>
    );
  }

  // SINGLE column layout (default)
  return (
    <div style={{ height: "100%", background: "#fff", borderRadius: "6px", overflow: "hidden", fontFamily: template.fontBody, padding: "8px 10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: `2px solid ${accent}`,
          paddingBottom: "5px",
          marginBottom: "5px",
        }}
      >
        <div>
          <div style={{ fontSize: `${headerNameSize}px`, fontWeight: 800, fontFamily: headerFontFamily, color: textColor, lineHeight: 1.1, letterSpacing: isSerif ? "0" : "0.5px" }}>
            Alex Morgan
          </div>
          <div style={{ fontSize: "7px", color: accent, fontWeight: 600, marginTop: "1px" }}>
            Senior Software Engineer
          </div>
        </div>
        {template.hasPhoto && template.photoPosition === "top-right" && (
          <MiniPhoto color={accent} size={22} />
        )}
      </div>
      <div style={{ display: "flex", gap: "6px", fontSize: "5px", color: mutedColor, marginBottom: "3px", flexWrap: "wrap" }}>
        <span>alex@email.com</span>
        <span>+1 234 567</span>
        <span>San Francisco</span>
        <span>linkedin.com/in/alex</span>
      </div>
      <MiniMainContent template={template} />
    </div>
  );
}
