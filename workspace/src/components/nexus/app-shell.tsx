"use client";

import { useEffect } from "react";
import BackgroundCanvas from "@/components/nexus/background-canvas";
import CustomCursor from "@/components/nexus/custom-cursor";
import LoadingScreen from "@/components/nexus/loading-screen";
import ToastContainer from "@/components/nexus/toast-container";
import NexusNav from "@/components/nexus/nexus-nav";
import Hero from "@/components/nexus/hero";
import Features from "@/components/nexus/features";
import Builder from "@/components/nexus/builder";
import Templates from "@/components/nexus/templates";
import SiteFooter from "@/components/nexus/site-footer";
import GlowingDots from "@/components/nexus/glowing-dots";
import ResumeHydrator from "@/components/nexus/resume-hydrator";
import Dashboard from "@/components/nexus/dashboard";
import AiResumeGenerator from "@/components/nexus/ai-resume-generator";
import ResumeEditor from "@/components/nexus/resume-editor";
import AtsAnalysisView from "@/components/nexus/ats-analysis";
import AiContentWorkspace from "@/components/nexus/ai-content-workspace";
import TemplatesGallery from "@/components/nexus/templates-gallery";
import ResumeHistory from "@/components/nexus/resume-history";
import { useResumeStore } from "@/lib/resume-store";

export default function AppShell() {
  const { view } = useResumeStore();

  // Scroll to top whenever the view changes (except for home sections which
  // manage their own scroll).
  useEffect(() => {
    if (view !== "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [view]);

  return (
    <div className="nexus-body" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <ResumeHydrator />
      <LoadingScreen />
      <BackgroundCanvas />
      <div className="nx-digital-grid" aria-hidden="true" />
      <GlowingDots />
      <div className="nx-bg-gradient-overlay" aria-hidden="true" />
      <CustomCursor />
      <ToastContainer />

      <NexusNav />

      <main style={{ flex: 1, position: "relative", zIndex: 3 }}>
        {view === "home" && (
          <>
            <Hero />
            <Features />
            <Builder />
            <Templates />
          </>
        )}
        {view === "dashboard" && <Dashboard />}
        {view === "ai-generator" && <AiResumeGenerator />}
        {view === "editor" && <ResumeEditor />}
        {view === "ats-analysis" && <AtsAnalysisView />}
        {view === "ai-content" && <AiContentWorkspace />}
        {view === "templates-gallery" && <TemplatesGallery />}
        {view === "history" && <ResumeHistory />}
      </main>

      <SiteFooter />
    </div>
  );
}
