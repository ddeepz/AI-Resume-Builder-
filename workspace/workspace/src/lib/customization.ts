// Font, color and design customization definitions for the NEXUS AI resume editor.

export interface FontOption {
  id: string;
  label: string;
  stack: string;
}

// 12 professional font families requested by the user.
export const FONT_OPTIONS: FontOption[] = [
  { id: "arial", label: "Arial", stack: "Arial, Helvetica, sans-serif" },
  { id: "roboto", label: "Roboto", stack: "Roboto, Arial, sans-serif" },
  { id: "poppins", label: "Poppins", stack: "Poppins, Arial, sans-serif" },
  { id: "montserrat", label: "Montserrat", stack: "Montserrat, Arial, sans-serif" },
  { id: "open-sans", label: "Open Sans", stack: "'Open Sans', Arial, sans-serif" },
  { id: "lato", label: "Lato", stack: "Lato, Arial, sans-serif" },
  { id: "inter", label: "Inter", stack: "Inter, Arial, sans-serif" },
  { id: "merriweather", label: "Merriweather", stack: "Merriweather, Georgia, serif" },
  { id: "playfair", label: "Playfair Display", stack: "'Playfair Display', Georgia, serif" },
  { id: "georgia", label: "Georgia", stack: "Georgia, 'Times New Roman', serif" },
  { id: "times", label: "Times New Roman", stack: "'Times New Roman', Times, serif" },
  { id: "calibri", label: "Calibri", stack: "Calibri, 'Segoe UI', Arial, sans-serif" },
];

export function fontStackById(id: string): string {
  return (FONT_OPTIONS.find((f) => f.id === id) || FONT_OPTIONS[0]).stack;
}

// Per-element color targets. Each can be set independently so changing one
// never unintentionally changes another (Module 5 requirement).
export interface ColorTargets {
  name: string;
  mainHeadings: string;
  sectionHeadings: string;
  bodyText: string;
  subheadings: string;
  contactInfo: string;
  divider: string;
  bullets: string;
  background: string;
}

export interface FontSettings {
  headingFamily: string; // font option id
  bodyFamily: string; // font option id
  baseSize: number; // px
  headingSize: number; // px
  letterSpacing: number; // px
  lineHeight: number; // unitless
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export interface DesignSettings {
  margin: number; // px
  sectionSpacing: number; // px
  columnGap: number; // px
  dividerThickness: number; // px
  dividerLength: number; // percent (0-100)
  alignment: "left" | "center" | "right";
}

export interface ResumeCustomization {
  fonts: FontSettings;
  colors: ColorTargets;
  design: DesignSettings;
}

export const DEFAULT_CUSTOMIZATION: ResumeCustomization = {
  fonts: {
    headingFamily: "roboto",
    bodyFamily: "roboto",
    baseSize: 13,
    headingSize: 18,
    letterSpacing: 0,
    lineHeight: 1.5,
    bold: true,
    italic: false,
    underline: false,
  },
  colors: {
    name: "#0f172a",
    mainHeadings: "#0f172a",
    sectionHeadings: "#0891b2",
    bodyText: "#1f2937",
    subheadings: "#475569",
    contactInfo: "#475569",
    divider: "#0891b2",
    bullets: "#0891b2",
    background: "#ffffff",
  },
  design: {
    margin: 36,
    sectionSpacing: 16,
    columnGap: 24,
    dividerThickness: 2,
    dividerLength: 100,
    alignment: "left",
  },
};

// Ready-made color combinations (Module 5).
export interface ColorPreset {
  id: string;
  label: string;
  colors: ColorTargets;
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: "navy-white",
    label: "Navy Blue + White",
    colors: {
      name: "#1e3a8a",
      mainHeadings: "#1e3a8a",
      sectionHeadings: "#1d4ed8",
      bodyText: "#1f2937",
      subheadings: "#475569",
      contactInfo: "#1d4ed8",
      divider: "#1d4ed8",
      bullets: "#1d4ed8",
      background: "#ffffff",
    },
  },
  {
    id: "black-gold",
    label: "Black + Gold",
    colors: {
      name: "#0a0a0a",
      mainHeadings: "#0a0a0a",
      sectionHeadings: "#b8860b",
      bodyText: "#1f2937",
      subheadings: "#6b7280",
      contactInfo: "#b8860b",
      divider: "#b8860b",
      bullets: "#b8860b",
      background: "#ffffff",
    },
  },
  {
    id: "purple-white",
    label: "Purple + White",
    colors: {
      name: "#4c1d95",
      mainHeadings: "#4c1d95",
      sectionHeadings: "#7c3aed",
      bodyText: "#1f2937",
      subheadings: "#6b7280",
      contactInfo: "#7c3aed",
      divider: "#7c3aed",
      bullets: "#7c3aed",
      background: "#ffffff",
    },
  },
  {
    id: "green-cream",
    label: "Dark Green + Cream",
    colors: {
      name: "#14532d",
      mainHeadings: "#14532d",
      sectionHeadings: "#166534",
      bodyText: "#1f2937",
      subheadings: "#475569",
      contactInfo: "#166534",
      divider: "#166534",
      bullets: "#166534",
      background: "#fffbeb",
    },
  },
  {
    id: "burgundy-white",
    label: "Burgundy + White",
    colors: {
      name: "#7f1d1d",
      mainHeadings: "#7f1d1d",
      sectionHeadings: "#991b1b",
      bodyText: "#1f2937",
      subheadings: "#475569",
      contactInfo: "#991b1b",
      divider: "#991b1b",
      bullets: "#991b1b",
      background: "#ffffff",
    },
  },
  {
    id: "brown-beige",
    label: "Brown + Beige",
    colors: {
      name: "#451a03",
      mainHeadings: "#451a03",
      sectionHeadings: "#78350f",
      bodyText: "#292524",
      subheadings: "#57534e",
      contactInfo: "#78350f",
      divider: "#78350f",
      bullets: "#78350f",
      background: "#fef3c7",
    },
  },
  {
    id: "blue-grey",
    label: "Blue + Light Grey",
    colors: {
      name: "#1e40af",
      mainHeadings: "#1e40af",
      sectionHeadings: "#2563eb",
      bodyText: "#1f2937",
      subheadings: "#475569",
      contactInfo: "#2563eb",
      divider: "#2563eb",
      bullets: "#2563eb",
      background: "#f1f5f9",
    },
  },
];

// All editable resume sections (Module 3 + 6 requirement to add/delete/rearrange).
export interface SectionDef {
  id: string;
  label: string;
}

export const ALL_SECTIONS: SectionDef[] = [
  { id: "summary", label: "Professional Summary" },
  { id: "objective", label: "Career Objective" },
  { id: "experience", label: "Work Experience" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "certificates", label: "Certifications" },
  { id: "achievements", label: "Achievements" },
  { id: "languages", label: "Languages" },
];

export function sectionLabel(id: string): string {
  return ALL_SECTIONS.find((s) => s.id === id)?.label || id;
}
