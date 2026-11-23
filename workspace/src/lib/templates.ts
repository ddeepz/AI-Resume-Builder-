export type TemplateCategory =
  | "professional"
  | "creative"
  | "minimal"
  | "student"
  | "ats-friendly";

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  accent: string;
  accentSecondary: string;
  textColor: string;
  mutedColor: string;
  layout: "single" | "two-column-left" | "two-column-right" | "header-bar" | "sidebar";
  photoPosition: "top-right" | "top-left" | "sidebar-top" | "header-center" | "none";
  fontHeading: string;
  fontBody: string;
  hasPhoto: boolean;
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: "modern-professional",
    name: "Modern Professional",
    description: "Clean, modern design with cyan accents. Perfect for tech and creative roles.",
    category: "professional",
    accent: "#0891b2",
    accentSecondary: "#22d3ee",
    textColor: "#0f172a",
    mutedColor: "#64748b",
    layout: "single",
    photoPosition: "top-right",
    fontHeading: "var(--font-orbitron), sans-serif",
    fontBody: "var(--font-outfit), sans-serif",
    hasPhoto: true,
  },
  {
    id: "classic-corporate",
    name: "Classic Corporate",
    description: "Traditional, professional layout. Ideal for corporate and academic positions.",
    category: "professional",
    accent: "#1e293b",
    accentSecondary: "#475569",
    textColor: "#1e293b",
    mutedColor: "#64748b",
    layout: "single",
    photoPosition: "none",
    fontHeading: "Georgia, serif",
    fontBody: "Georgia, serif",
    hasPhoto: false,
  },
  {
    id: "creative-designer",
    name: "Creative Designer",
    description: "Vibrant, eye-catching design for creative professionals and designers.",
    category: "creative",
    accent: "#ec4899",
    accentSecondary: "#8b5cf6",
    textColor: "#1e1b4b",
    mutedColor: "#6b7280",
    layout: "two-column-left",
    photoPosition: "sidebar-top",
    fontHeading: "var(--font-outfit), sans-serif",
    fontBody: "var(--font-outfit), sans-serif",
    hasPhoto: true,
  },
  {
    id: "minimalist",
    name: "Minimalist Resume",
    description: "Clean, distraction-free layout with maximum whitespace and elegance.",
    category: "minimal",
    accent: "#000000",
    accentSecondary: "#525252",
    textColor: "#171717",
    mutedColor: "#737373",
    layout: "single",
    photoPosition: "none",
    fontHeading: "var(--font-outfit), sans-serif",
    fontBody: "var(--font-outfit), sans-serif",
    hasPhoto: false,
  },
  {
    id: "executive",
    name: "Executive Resume",
    description: "Sophisticated layout for senior executives and leadership positions.",
    category: "professional",
    accent: "#0f4c5c",
    accentSecondary: "#5f0f40",
    textColor: "#1a1a2e",
    mutedColor: "#64748b",
    layout: "header-bar",
    photoPosition: "top-right",
    fontHeading: "Georgia, serif",
    fontBody: "var(--font-outfit), sans-serif",
    hasPhoto: true,
  },
  {
    id: "fresher",
    name: "Fresher Resume",
    description: "Designed for recent graduates entering the job market with limited experience.",
    category: "student",
    accent: "#0d9488",
    accentSecondary: "#14b8a6",
    textColor: "#134e4a",
    mutedColor: "#5eead4",
    layout: "single",
    photoPosition: "top-right",
    fontHeading: "var(--font-outfit), sans-serif",
    fontBody: "var(--font-outfit), sans-serif",
    hasPhoto: true,
  },
  {
    id: "student",
    name: "Student Resume",
    description: "Compact, student-friendly format highlighting education and projects.",
    category: "student",
    accent: "#2563eb",
    accentSecondary: "#3b82f6",
    textColor: "#1e3a8a",
    mutedColor: "#64748b",
    layout: "two-column-right",
    photoPosition: "top-right",
    fontHeading: "var(--font-outfit), sans-serif",
    fontBody: "var(--font-outfit), sans-serif",
    hasPhoto: true,
  },
  {
    id: "software-developer",
    name: "Software Developer",
    description: "Tech-focused layout optimized for developers and engineers.",
    category: "professional",
    accent: "#059669",
    accentSecondary: "#10b981",
    textColor: "#064e3b",
    mutedColor: "#6b7280",
    layout: "two-column-right",
    photoPosition: "top-right",
    fontHeading: "var(--font-orbitron), sans-serif",
    fontBody: "var(--font-outfit), sans-serif",
    hasPhoto: true,
  },
  {
    id: "graphic-designer",
    name: "Graphic Designer",
    description: "Bold, artistic layout that showcases visual creativity and design skills.",
    category: "creative",
    accent: "#f59e0b",
    accentSecondary: "#ef4444",
    textColor: "#1c1917",
    mutedColor: "#78716c",
    layout: "sidebar",
    photoPosition: "sidebar-top",
    fontHeading: "var(--font-outfit), sans-serif",
    fontBody: "var(--font-outfit), sans-serif",
    hasPhoto: true,
  },
  {
    id: "two-column",
    name: "Two-Column Resume",
    description: "Balanced two-column layout with sidebar for skills and contact info.",
    category: "professional",
    accent: "#4f46e5",
    accentSecondary: "#7c3aed",
    textColor: "#1e1b4b",
    mutedColor: "#6b7280",
    layout: "two-column-left",
    photoPosition: "sidebar-top",
    fontHeading: "var(--font-outfit), sans-serif",
    fontBody: "var(--font-outfit), sans-serif",
    hasPhoto: true,
  },
  {
    id: "elegant",
    name: "Elegant Resume",
    description: "Refined, elegant design with sophisticated typography and spacing.",
    category: "professional",
    accent: "#7c2d12",
    accentSecondary: "#a16207",
    textColor: "#292524",
    mutedColor: "#78716c",
    layout: "single",
    photoPosition: "top-right",
    fontHeading: "Georgia, serif",
    fontBody: "Georgia, serif",
    hasPhoto: true,
  },
  {
    id: "ats-friendly",
    name: "ATS-Friendly Resume",
    description: "Optimized for Applicant Tracking Systems with clean, parseable structure.",
    category: "ats-friendly",
    accent: "#374151",
    accentSecondary: "#6b7280",
    textColor: "#111827",
    mutedColor: "#4b5563",
    layout: "single",
    photoPosition: "none",
    fontHeading: "Arial, sans-serif",
    fontBody: "Arial, sans-serif",
    hasPhoto: false,
  },
  {
    id: "academic",
    name: "Academic Resume",
    description: "Formal academic CV format for researchers, professors, and academia.",
    category: "professional",
    accent: "#1e40af",
    accentSecondary: "#3b82f6",
    textColor: "#1e293b",
    mutedColor: "#64748b",
    layout: "single",
    photoPosition: "none",
    fontHeading: "Georgia, serif",
    fontBody: "Georgia, serif",
    hasPhoto: false,
  },
  {
    id: "professional-blue",
    name: "Professional Blue",
    description: "Classic blue-themed professional resume for any industry.",
    category: "professional",
    accent: "#1d4ed8",
    accentSecondary: "#3b82f6",
    textColor: "#1e3a8a",
    mutedColor: "#64748b",
    layout: "header-bar",
    photoPosition: "top-right",
    fontHeading: "var(--font-outfit), sans-serif",
    fontBody: "var(--font-outfit), sans-serif",
    hasPhoto: true,
  },
  {
    id: "modern-colorful",
    name: "Modern Colorful",
    description: "Vibrant, multi-color modern design that stands out from the crowd.",
    category: "creative",
    accent: "#db2777",
    accentSecondary: "#9333ea",
    textColor: "#18181b",
    mutedColor: "#71717a",
    layout: "two-column-left",
    photoPosition: "sidebar-top",
    fontHeading: "var(--font-outfit), sans-serif",
    fontBody: "var(--font-outfit), sans-serif",
    hasPhoto: true,
  },
];

export const TEMPLATE_CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "All Templates" },
  { id: "professional", label: "Professional" },
  { id: "creative", label: "Creative" },
  { id: "minimal", label: "Minimal" },
  { id: "student", label: "Student" },
  { id: "ats-friendly", label: "ATS-Friendly" },
];

export function getTemplate(id: string): TemplateConfig {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}

export function getTemplatesByCategory(category: string): TemplateConfig[] {
  if (category === "all") return TEMPLATES;
  return TEMPLATES.filter((t) => t.category === category);
}

export function searchTemplates(query: string): TemplateConfig[] {
  const q = query.toLowerCase().trim();
  if (!q) return TEMPLATES;
  return TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
  );
}

// Sample resume data used as default preview content
export const SAMPLE_RESUME = {
  personal: {
    name: "Alex Morgan",
    email: "alex.morgan@email.com",
    phone: "+1 234 567 890",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan",
    portfolio: "alexmorgan.dev",
    jobTitle: "Senior Software Engineer",
    photo: "",
  },
  education: [
    {
      id: "e1",
      college: "Stanford University",
      degree: "B.S.",
      department: "Computer Science",
      year: "2019",
      cgpa: "3.8 GPA",
    },
  ],
  skills: {
    technical: ["React", "Node.js", "AWS", "Docker", "GraphQL"],
    programming: ["JavaScript", "TypeScript", "Python", "Java"],
    soft: ["Leadership", "Communication", "Problem Solving"],
  },
  experience: [
    {
      id: "x1",
      company: "Google",
      position: "Senior Software Engineer",
      duration: "2021 - Present",
      responsibilities:
        "• Led development of scalable microservices serving 10M+ users\n• Improved API performance by 40% through optimization\n• Mentored 5 junior engineers on best practices",
    },
    {
      id: "x2",
      company: "Meta",
      position: "Software Engineer",
      duration: "2019 - 2021",
      responsibilities:
        "• Built React-based dashboard used by 500+ teams\n• Implemented CI/CD pipeline reducing deployment time by 60%",
    },
  ],
  projects: [
    {
      id: "p1",
      title: "AI Resume Builder",
      description: "Built a full-stack AI-powered resume builder with real-time ATS scoring.",
      technologies: "Next.js, TypeScript, OpenAI API",
    },
  ],
  certificates: [
    {
      id: "c1",
      name: "AWS Solutions Architect",
      organization: "Amazon Web Services",
      year: "2023",
    },
  ],
  languages: "English (Fluent), Spanish (Intermediate)",
  summary:
    "Senior Software Engineer with 5+ years of experience building scalable web applications. Passionate about clean code, performance optimization, and mentoring teams.",
};
