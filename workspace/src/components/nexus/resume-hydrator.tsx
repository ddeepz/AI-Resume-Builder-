"use client";

import { useEffect } from "react";
import { useResumeStore } from "@/lib/resume-store";
import { loadActiveResume, saveActiveResume } from "@/lib/resume-storage";

// Hydrates the store from localStorage on mount and persists changes.
export default function ResumeHydrator() {
  const {
    data,
    selectedTemplate,
    customization,
    sectionOrder,
    setHydrated,
    hydrated,
    setData,
    setSelectedTemplate,
    setCustomization,
    setSectionOrder,
    loadSavedResumes,
  } = useResumeStore();

  // Load on mount
  useEffect(() => {
    loadSavedResumes();
    const snap = loadActiveResume();
    if (snap) {
      if (snap.data) setData(snap.data);
      if (snap.templateId) setSelectedTemplate(snap.templateId);
      if (snap.customization) setCustomization(snap.customization);
      if (snap.sectionOrder) setSectionOrder(snap.sectionOrder);
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    saveActiveResume({
      data,
      templateId: selectedTemplate,
      customization,
      sectionOrder,
      savedAt: Date.now(),
    });
  }, [data, selectedTemplate, customization, sectionOrder, hydrated]);

  return null;
}
