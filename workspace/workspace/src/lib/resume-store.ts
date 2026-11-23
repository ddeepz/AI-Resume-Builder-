"use client";

import { create } from "zustand";
import {
  DEFAULT_CUSTOMIZATION,
  type ResumeCustomization,
} from "@/lib/customization";

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  jobTitle: string;
  photo: string; // data URL for uploaded profile photo
}

export type PhotoStyle = "circular" | "square" | "rounded";

export interface EducationItem {
  id: string;
  college: string;
  degree: string;
  department: string;
  year: string;
  cgpa: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  duration: string;
  responsibilities: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string;
}

export interface CertificateItem {
  id: string;
  name: string;
  organization: string;
  year: string;
}

export interface Skills {
  technical: string[];
  programming: string[];
  soft: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  education: EducationItem[];
  skills: Skills;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certificates: CertificateItem[];
  achievements: AchievementItem[];
  languages: string;
  summary: string;
  objective: string;
}

export interface AtsFactor {
  name: string;
  desc: string;
  status: "good" | "warn" | "bad";
  icon: "check" | "circle-exclamation" | "times";
}

export type ViewId =
  | "home"
  | "dashboard"
  | "ai-generator"
  | "editor"
  | "ats-analysis"
  | "ai-content"
  | "templates-gallery"
  | "history";

const emptyPersonal: PersonalInfo = {
  name: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  portfolio: "",
  jobTitle: "",
  photo: "",
};

const uid = () => Math.random().toString(36).slice(2, 11) + Date.now().toString(36);

export const emptyEducation = (): EducationItem => ({
  id: uid(),
  college: "",
  degree: "",
  department: "",
  year: "",
  cgpa: "",
});

export const emptyExperience = (): ExperienceItem => ({
  id: uid(),
  company: "",
  position: "",
  duration: "",
  responsibilities: "",
});

export const emptyProject = (): ProjectItem => ({
  id: uid(),
  title: "",
  description: "",
  technologies: "",
});

export const emptyCertificate = (): CertificateItem => ({
  id: uid(),
  name: "",
  organization: "",
  year: "",
});

export const emptyAchievement = (): AchievementItem => ({
  id: uid(),
  title: "",
  description: "",
});

interface NexusState {
  data: ResumeData;
  currentStep: number;
  activePreviewTab: "preview" | "ats" | "ai";
  atsScore: number;
  atsFactors: AtsFactor[];
  selectedTemplate: string;
  photoStyle: PhotoStyle;
  previewZoom: number;
  showFullPreview: boolean;

  // View routing
  view: ViewId;
  setView: (v: ViewId) => void;

  // Customization (fonts, colors, design)
  customization: ResumeCustomization;
  setCustomization: (c: Partial<ResumeCustomization>) => void;
  resetCustomization: () => void;

  // Editor panel (which side panel is active)
  editorPanel: "fonts" | "colors" | "design" | "sections" | "ai";
  setEditorPanel: (p: NexusState["editorPanel"]) => void;

  // Section order for the resume editor
  sectionOrder: string[];
  setSectionOrder: (order: string[]) => void;

  // History (undo/redo) for the design editor
  designHistory: ResumeCustomization[];
  designHistoryIndex: number;
  pushDesignHistory: (c: ResumeCustomization) => void;
  undoDesign: () => void;
  redoDesign: () => void;

  setPersonal: (p: Partial<PersonalInfo>) => void;
  updateEducation: (id: string, p: Partial<EducationItem>) => void;
  addEducation: () => void;
  removeEducation: (id: string) => void;
  updateExperience: (id: string, p: Partial<ExperienceItem>) => void;
  addExperience: () => void;
  removeExperience: (id: string) => void;
  updateProject: (id: string, p: Partial<ProjectItem>) => void;
  addProject: () => void;
  removeProject: (id: string) => void;
  updateCertificate: (id: string, p: Partial<CertificateItem>) => void;
  addCertificate: () => void;
  removeCertificate: (id: string) => void;
  updateAchievement: (id: string, p: Partial<AchievementItem>) => void;
  addAchievement: () => void;
  removeAchievement: (id: string) => void;
  addSkill: (type: keyof Skills, value: string) => void;
  removeSkill: (type: keyof Skills, index: number) => void;
  setLanguages: (v: string) => void;
  setSummary: (v: string) => void;
  setObjective: (v: string) => void;

  setStep: (s: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (s: number) => void;
  setPreviewTab: (t: "preview" | "ats" | "ai") => void;
  setAts: (score: number, factors: AtsFactor[]) => void;
  setSelectedTemplate: (id: string) => void;
  setPhotoStyle: (style: PhotoStyle) => void;
  setPreviewZoom: (zoom: number) => void;
  setShowFullPreview: (show: boolean) => void;

  // Bulk replace data (used by AI generator + load saved resume)
  setData: (d: ResumeData) => void;

  // Saved resumes
  savedResumes: SavedResume[];
  loadSavedResumes: () => void;
  saveCurrentResume: (name?: string) => string;
  openSavedResume: (id: string) => void;
  deleteSavedResume: (id: string) => void;

  // Hydration flag
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
}

export interface SavedResume {
  id: string;
  name: string;
  data: ResumeData;
  templateId: string;
  customization: ResumeCustomization;
  sectionOrder: string[];
  savedAt: number;
}

const initialData: ResumeData = {
  personal: { ...emptyPersonal },
  education: [emptyEducation()],
  skills: { technical: [], programming: [], soft: [] },
  experience: [emptyExperience()],
  projects: [emptyProject()],
  certificates: [emptyCertificate()],
  achievements: [],
  languages: "",
  summary: "",
  objective: "",
};

const DEFAULT_SECTION_ORDER = [
  "summary",
  "objective",
  "experience",
  "education",
  "projects",
  "skills",
  "certificates",
  "achievements",
  "languages",
];

export const useResumeStore = create<NexusState>((set, get) => ({
  data: initialData,
  currentStep: 0,
  activePreviewTab: "preview",
  atsScore: 0,
  atsFactors: [],
  selectedTemplate: "modern-professional",
  photoStyle: "circular",
  previewZoom: 1,
  showFullPreview: false,

  view: "home",
  setView: (v) => {
    set({ view: v });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },

  customization: { ...DEFAULT_CUSTOMIZATION },
  setCustomization: (c) =>
    set((s) => {
      const next = { ...s.customization, ...c };
      return { customization: next };
    }),
  resetCustomization: () => set({ customization: { ...DEFAULT_CUSTOMIZATION } }),

  editorPanel: "fonts",
  setEditorPanel: (p) => set({ editorPanel: p }),

  sectionOrder: [...DEFAULT_SECTION_ORDER],
  setSectionOrder: (order) => set({ sectionOrder: order }),

  designHistory: [{ ...DEFAULT_CUSTOMIZATION }],
  designHistoryIndex: 0,
  pushDesignHistory: (c) =>
    set((s) => {
      const truncated = s.designHistory.slice(0, s.designHistoryIndex + 1);
      const next = [...truncated, { ...c }];
      // cap history at 30 entries
      const capped = next.slice(-30);
      return { designHistory: capped, designHistoryIndex: capped.length - 1 };
    }),
  undoDesign: () =>
    set((s) => {
      if (s.designHistoryIndex <= 0) return s;
      const idx = s.designHistoryIndex - 1;
      return { designHistoryIndex: idx, customization: { ...s.designHistory[idx] } };
    }),
  redoDesign: () =>
    set((s) => {
      if (s.designHistoryIndex >= s.designHistory.length - 1) return s;
      const idx = s.designHistoryIndex + 1;
      return { designHistoryIndex: idx, customization: { ...s.designHistory[idx] } };
    }),

  setPersonal: (p) =>
    set((s) => ({
      data: { ...s.data, personal: { ...s.data.personal, ...p } },
    })),

  updateEducation: (id, p) =>
    set((s) => ({
      data: {
        ...s.data,
        education: s.data.education.map((e) => (e.id === id ? { ...e, ...p } : e)),
      },
    })),
  addEducation: () =>
    set((s) => ({ data: { ...s.data, education: [...s.data.education, emptyEducation()] } })),
  removeEducation: (id) =>
    set((s) => ({
      data: { ...s.data, education: s.data.education.filter((e) => e.id !== id) },
    })),

  updateExperience: (id, p) =>
    set((s) => ({
      data: {
        ...s.data,
        experience: s.data.experience.map((e) => (e.id === id ? { ...e, ...p } : e)),
      },
    })),
  addExperience: () =>
    set((s) => ({ data: { ...s.data, experience: [...s.data.experience, emptyExperience()] } })),
  removeExperience: (id) =>
    set((s) => ({
      data: { ...s.data, experience: s.data.experience.filter((e) => e.id !== id) },
    })),

  updateProject: (id, p) =>
    set((s) => ({
      data: {
        ...s.data,
        projects: s.data.projects.map((e) => (e.id === id ? { ...e, ...p } : e)),
      },
    })),
  addProject: () =>
    set((s) => ({ data: { ...s.data, projects: [...s.data.projects, emptyProject()] } })),
  removeProject: (id) =>
    set((s) => ({
      data: { ...s.data, projects: s.data.projects.filter((e) => e.id !== id) },
    })),

  updateCertificate: (id, p) =>
    set((s) => ({
      data: {
        ...s.data,
        certificates: s.data.certificates.map((e) => (e.id === id ? { ...e, ...p } : e)),
      },
    })),
  addCertificate: () =>
    set((s) => ({ data: { ...s.data, certificates: [...s.data.certificates, emptyCertificate()] } })),
  removeCertificate: (id) =>
    set((s) => ({
      data: { ...s.data, certificates: s.data.certificates.filter((e) => e.id !== id) },
    })),

  updateAchievement: (id, p) =>
    set((s) => ({
      data: {
        ...s.data,
        achievements: s.data.achievements.map((e) => (e.id === id ? { ...e, ...p } : e)),
      },
    })),
  addAchievement: () =>
    set((s) => ({ data: { ...s.data, achievements: [...s.data.achievements, emptyAchievement()] } })),
  removeAchievement: (id) =>
    set((s) => ({
      data: { ...s.data, achievements: s.data.achievements.filter((e) => e.id !== id) },
    })),

  addSkill: (type, value) =>
    set((s) => {
      const v = value.trim();
      if (!v) return s;
      if (s.data.skills[type].includes(v)) return s;
      return {
        data: {
          ...s.data,
          skills: { ...s.data.skills, [type]: [...s.data.skills[type], v] },
        },
      };
    }),
  removeSkill: (type, index) =>
    set((s) => ({
      data: {
        ...s.data,
        skills: {
          ...s.data.skills,
          [type]: s.data.skills[type].filter((_, i) => i !== index),
        },
      },
    })),
  setLanguages: (v) => set((s) => ({ data: { ...s.data, languages: v } })),
  setSummary: (v) => set((s) => ({ data: { ...s.data, summary: v } })),
  setObjective: (v) => set((s) => ({ data: { ...s.data, objective: v } })),

  setStep: (st) => set({ currentStep: st }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 6) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
  goToStep: (st) => set((s) => ({ currentStep: st <= s.currentStep ? st : s.currentStep })),
  setPreviewTab: (t) => set({ activePreviewTab: t }),
  setAts: (score, factors) => set({ atsScore: score, atsFactors: factors }),
  setSelectedTemplate: (id) => set({ selectedTemplate: id }),
  setPhotoStyle: (style) => set({ photoStyle: style }),
  setPreviewZoom: (zoom) => set({ previewZoom: Math.max(0.5, Math.min(2, zoom)) }),
  setShowFullPreview: (show) => set({ showFullPreview: show }),

  setData: (d) => set({ data: d }),

  savedResumes: [],
  loadSavedResumes: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("nexus_saved_resumes");
      if (!raw) return;
      const list = JSON.parse(raw) as SavedResume[];
      set({ savedResumes: Array.isArray(list) ? list : [] });
    } catch {
      /* ignore */
    }
  },
  saveCurrentResume: (name) => {
    if (typeof window === "undefined") return "";
    const s = get();
    const id = uid();
    const record: SavedResume = {
      id,
      name: name || s.data.personal.name || `Resume ${new Date().toLocaleDateString()}`,
      data: JSON.parse(JSON.stringify(s.data)) as ResumeData,
      templateId: s.selectedTemplate,
      customization: JSON.parse(JSON.stringify(s.customization)) as ResumeCustomization,
      sectionOrder: [...s.sectionOrder],
      savedAt: Date.now(),
    };
    const next = [record, ...s.savedResumes].slice(0, 20);
    localStorage.setItem("nexus_saved_resumes", JSON.stringify(next));
    set({ savedResumes: next });
    return id;
  },
  openSavedResume: (id) => {
    const s = get();
    const rec = s.savedResumes.find((r) => r.id === id);
    if (!rec) return;
    set({
      data: JSON.parse(JSON.stringify(rec.data)) as ResumeData,
      selectedTemplate: rec.templateId,
      customization: JSON.parse(JSON.stringify(rec.customization)) as ResumeCustomization,
      sectionOrder: [...rec.sectionOrder],
      view: "editor",
    });
  },
  deleteSavedResume: (id) => {
    const s = get();
    const next = s.savedResumes.filter((r) => r.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem("nexus_saved_resumes", JSON.stringify(next));
    }
    set({ savedResumes: next });
  },

  hydrated: false,
  setHydrated: (v) => set({ hydrated: v }),
}));
