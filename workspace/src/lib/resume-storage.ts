// Lightweight localStorage persistence helpers for the NEXUS AI resume builder.
// All resume data, customization and template selection are saved separately
// from the original template designs (Module 13 requirement).

import type { ResumeData } from "@/lib/resume-store";
import type { ResumeCustomization } from "@/lib/customization";

const ACTIVE_KEY = "nexus_active_resume";

export interface ActiveResumeSnapshot {
  data: ResumeData;
  templateId: string;
  customization: ResumeCustomization;
  sectionOrder: string[];
  savedAt: number;
}

export function saveActiveResume(snap: ActiveResumeSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(snap));
  } catch {
    /* storage might be full or unavailable */
  }
}

export function loadActiveResume(): ActiveResumeSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ActiveResumeSnapshot;
  } catch {
    return null;
  }
}

export function clearActiveResume(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACTIVE_KEY);
  } catch {
    /* ignore */
  }
}
