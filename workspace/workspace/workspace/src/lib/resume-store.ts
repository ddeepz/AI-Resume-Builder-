"use client";

import { create } from "zustand";

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  jobTitle: string;
}

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

export interface ResumeData {
  personal: PersonalInfo;
  education: EducationItem[];
  skills: Skills;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certificates: CertificateItem[];
  languages: string;
  summary: string;
}

export interface AtsFactor {
  name: string;
  desc: string;
  status: "good" | "warn" | "bad";
  icon: "check" | "circle-exclamation" | "times";
}

const emptyPersonal: PersonalInfo = {
  name: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  portfolio: "",
  jobTitle: "",
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

interface NexusState {
  data: ResumeData;
  currentStep: number;
  activePreviewTab: "preview" | "ats" | "ai";
  atsScore: number;
  atsFactors: AtsFactor[];

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
  addSkill: (type: keyof Skills, value: string) => void;
  removeSkill: (type: keyof Skills, index: number) => void;
  setLanguages: (v: string) => void;
  setSummary: (v: string) => void;

  setStep: (s: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (s: number) => void;
  setPreviewTab: (t: "preview" | "ats" | "ai") => void;
  setAts: (score: number, factors: AtsFactor[]) => void;
}

const initialData: ResumeData = {
  personal: { ...emptyPersonal },
  education: [emptyEducation()],
  skills: { technical: [], programming: [], soft: [] },
  experience: [emptyExperience()],
  projects: [emptyProject()],
  certificates: [emptyCertificate()],
  languages: "",
  summary: "",
};

export const useResumeStore = create<NexusState>((set) => ({
  data: initialData,
  currentStep: 0,
  activePreviewTab: "preview",
  atsScore: 0,
  atsFactors: [],

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

  setStep: (st) => set({ currentStep: st }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 6) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
  goToStep: (st) => set((s) => ({ currentStep: st <= s.currentStep ? st : s.currentStep })),
  setPreviewTab: (t) => set({ activePreviewTab: t }),
  setAts: (score, factors) => set({ atsScore: score, atsFactors: factors }),
}));
