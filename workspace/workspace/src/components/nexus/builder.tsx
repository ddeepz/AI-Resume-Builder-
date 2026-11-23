"use client";

import { useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useResumeStore } from "@/lib/resume-store";
import { calculateAts } from "@/lib/ats";
import {
  PersonalStep,
  EducationStep,
  SkillsStep,
  ExperienceStep,
  ProjectsStep,
  CertificatesStep,
  ReviewStep,
} from "./form-steps";
import PreviewPanel from "./preview-panel";
import ScrollReveal from "./scroll-reveal";

const steps = [
  { label: "Personal" },
  { label: "Education" },
  { label: "Skills" },
  { label: "Experience" },
  { label: "Projects" },
  { label: "Certificates" },
  { label: "Review" },
];

const TOTAL = 7;

export default function Builder() {
  const {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    setAts,
    data,
  } = useResumeStore();

  // Recalculate ATS whenever data changes (keeps dashboard live)
  useEffect(() => {
    const ats = calculateAts(data);
    setAts(ats.score, ats.factors);
  }, [data, setAts]);

  const progress = (currentStep / (TOTAL - 1)) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalStep />;
      case 1:
        return <EducationStep />;
      case 2:
        return <SkillsStep />;
      case 3:
        return <ExperienceStep />;
      case 4:
        return <ProjectsStep />;
      case 5:
        return <CertificatesStep />;
      case 6:
        return <ReviewStep />;
      default:
        return null;
    }
  };

  return (
    <section className="nx-section" id="builder">
      <ScrollReveal variant="up">
        <h2 className="nx-section-title nx-gradient-animate">AI RESUME BUILDER</h2>
      </ScrollReveal>
      <ScrollReveal variant="fade" delay={1}>
        <p className="nx-section-subtitle">
          Fill in your details and watch AI craft your perfect resume
        </p>
      </ScrollReveal>

      <div className="nx-builder-container">
        {/* Form Side */}
        <div className="nx-glass-strong" style={{ padding: "40px", borderRadius: "24px" }}>
          {/* Step Progress */}
          <div
            className="nx-step-progress"
            style={{ ["--nx-progress-width" as string]: `${progress}%` }}
          >
            {steps.map((s, idx) => {
              const state =
                idx === currentStep ? "active" : idx < currentStep ? "completed" : "";
              return (
                <button
                  key={s.label}
                  className={`nx-step-item ${state}`}
                  onClick={() => goToStep(idx)}
                  type="button"
                  aria-label={`Go to ${s.label}`}
                >
                  <div className="nx-step-circle">{idx + 1}</div>
                  <div className="nx-step-label">{s.label}</div>
                </button>
              );
            })}
          </div>

          {/* Active form step */}
          <div>{renderStep()}</div>

          {/* Form Navigation */}
          <div className="nx-form-nav">
            <button
              className="nx-nav-btn nx-nav-btn-prev"
              onClick={prevStep}
              type="button"
              disabled={currentStep === 0}
              style={{
                opacity: currentStep === 0 ? 0.4 : 1,
                pointerEvents: currentStep === 0 ? "none" : "auto",
              }}
            >
              <ArrowLeft size={16} />
              Previous
            </button>
            {currentStep === TOTAL - 1 ? (
              <span style={{ color: "rgba(248,253,255,0.4)", fontSize: "13px", alignSelf: "center" }}>
                You&apos;re all set!
              </span>
            ) : (
              <button className="nx-nav-btn nx-nav-btn-next" onClick={nextStep} type="button">
                Next
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Preview Side */}
        <PreviewPanel />
      </div>
    </section>
  );
}
