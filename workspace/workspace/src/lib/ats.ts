import type { ResumeData, AtsFactor } from "@/lib/resume-store";

// Real, data-driven ATS analysis. No random or hardcoded scores.
// Each category is scored against the actual resume content.

export interface AtsCategoryScore {
  id: string;
  label: string;
  score: number; // 0-100
  weight: number; // portion of the overall score
  status: "good" | "warn" | "bad";
  detail: string;
  recommendation: string;
}

export interface AtsAnalysis {
  score: number;
  factors: AtsFactor[];
  categories: AtsCategoryScore[];
  missingKeywords: string[];
  suggestions: string[];
  warnings: string[];
}

const ACTION_VERBS = [
  "developed",
  "implemented",
  "created",
  "designed",
  "built",
  "optimized",
  "led",
  "managed",
  "improved",
  "launched",
  "engineered",
  "architected",
  "delivered",
  "automated",
  "streamlined",
  "spearheaded",
  "coordinated",
  "analyzed",
  "mentored",
  "deployed",
];

const COMMON_ATS_KEYWORDS = [
  "experience",
  "team",
  "project",
  "leadership",
  "communication",
  "analysis",
  "management",
  "development",
  "design",
  "research",
  "strategy",
  "collaboration",
  "stakeholder",
  "cross-functional",
  "agile",
  "scrum",
  "ci/cd",
  "testing",
  "deployment",
  "documentation",
];

function clampScore(v: number): number {
  return Math.max(0, Math.min(100, Math.round(v)));
}

export function analyzeResume(data: ResumeData): AtsAnalysis {
  const categories: AtsCategoryScore[] = [];
  const suggestions: string[] = [];
  const warnings: string[] = [];
  const missingKeywords: string[] = [];

  const allText = JSON.stringify(data).toLowerCase();

  /* 1. Resume Structure (weight 15) */
  const sectionsPresent = [
    data.personal.name && data.personal.email,
    data.summary,
    data.experience.some((e) => e.company),
    data.education.some((e) => e.college),
    data.projects.some((p) => p.title),
    data.skills.technical.length + data.skills.programming.length + data.skills.soft.length > 0,
  ].filter(Boolean).length;
  const structScore = (sectionsPresent / 6) * 100;
  categories.push({
    id: "structure",
    label: "Resume Structure",
    score: clampScore(structScore),
    weight: 15,
    status: sectionsPresent >= 5 ? "good" : sectionsPresent >= 3 ? "warn" : "bad",
    detail: `${sectionsPresent}/6 core sections present`,
    recommendation:
      sectionsPresent >= 5
        ? "Structure looks complete."
        : "Add missing core sections (summary, experience, education, projects, skills).",
  });

  /* 2. Keyword Optimization (weight 15) */
  const foundKeywords = COMMON_ATS_KEYWORDS.filter((k) => allText.includes(k));
  const missing = COMMON_ATS_KEYWORDS.filter((k) => !allText.includes(k));
  missingKeywords.push(...missing.slice(0, 8));
  const kwScore = (foundKeywords.length / COMMON_ATS_KEYWORDS.length) * 100;
  categories.push({
    id: "keywords",
    label: "Keyword Optimization",
    score: clampScore(kwScore),
    weight: 15,
    status: foundKeywords.length >= 12 ? "good" : foundKeywords.length >= 7 ? "warn" : "bad",
    detail: `${foundKeywords.length}/${COMMON_ATS_KEYWORDS.length} common ATS keywords found`,
    recommendation:
      missing.length > 0
        ? `Consider adding: ${missing.slice(0, 5).join(", ")}.`
        : "Great keyword coverage.",
  });
  if (missing.length > 5) {
    suggestions.push(
      `Add more industry-standard keywords (e.g. ${missing.slice(0, 4).join(", ")}).`
    );
  }

  /* 3. Skills Relevance (weight 12) */
  const totalSkills =
    data.skills.technical.length + data.skills.programming.length + data.skills.soft.length;
  const skillScore = Math.min(totalSkills / 12, 1) * 100;
  categories.push({
    id: "skills",
    label: "Skills Relevance",
    score: clampScore(skillScore),
    weight: 12,
    status: totalSkills >= 10 ? "good" : totalSkills >= 5 ? "warn" : "bad",
    detail: `${totalSkills} skills listed (aim for 10+)`,
    recommendation:
      totalSkills < 10
        ? "Add more relevant technical and soft skills (target 10-15)."
        : "Good skills coverage.",
  });

  /* 4. Professional Summary (weight 10) */
  const summaryLen = data.summary.trim().length;
  const summaryScore = !data.summary
    ? 0
    : summaryLen < 100
      ? 50
      : summaryLen > 400
        ? 70
        : 100;
  categories.push({
    id: "summary",
    label: "Professional Summary",
    score: clampScore(summaryScore),
    weight: 10,
    status: summaryScore >= 100 ? "good" : summaryScore >= 50 ? "warn" : "bad",
    detail: !data.summary ? "Missing" : `${summaryLen} characters`,
    recommendation: !data.summary
      ? "Generate a 2-3 sentence professional summary."
      : summaryLen < 100
        ? "Expand your summary to 2-3 sentences."
        : summaryLen > 400
          ? "Shorten your summary to keep it punchy."
          : "Summary length is ideal.",
  });

  /* 5. Experience Details (weight 15) */
  const expWithDetails = data.experience.filter(
    (e) => e.company && e.position && e.responsibilities && e.responsibilities.length > 30
  ).length;
  const expScore = !data.experience.some((e) => e.company)
    ? 0
    : Math.min(expWithDetails / Math.max(1, data.experience.length), 1) * 100;
  categories.push({
    id: "experience",
    label: "Experience Details",
    score: clampScore(expScore),
    weight: 15,
    status: expScore >= 80 ? "good" : expScore >= 40 ? "warn" : "bad",
    detail: `${expWithDetails} detailed role(s)`,
    recommendation:
      expScore < 80
        ? "Add responsibilities with measurable achievements for each role."
        : "Experience is well documented.",
  });

  /* 6. Education Details (weight 8) */
  const eduWithDetails = data.education.filter(
    (e) => e.college && e.degree && e.year
  ).length;
  const eduScore = !data.education.some((e) => e.college)
    ? 0
    : Math.min(eduWithDetails / Math.max(1, data.education.length), 1) * 100;
  categories.push({
    id: "education",
    label: "Education Details",
    score: clampScore(eduScore),
    weight: 8,
    status: eduScore >= 80 ? "good" : eduScore >= 40 ? "warn" : "bad",
    detail: `${eduWithDetails} complete education entr(ies)`,
    recommendation:
      eduScore < 80 ? "Complete degree, year and institution for each entry." : "Education looks complete.",
  });

  /* 7. Formatting (weight 10) */
  const formatIssues: string[] = [];
  if (data.experience.some((e) => e.responsibilities && !e.responsibilities.includes("•") && !e.responsibilities.includes("-")))
    formatIssues.push("Use bullet points (•) for experience responsibilities.");
  const longFields = [data.summary, ...data.experience.map((e) => e.responsibilities)].filter(
    (t) => t && t.length > 600
  );
  if (longFields.length > 0) formatIssues.push("Some text blocks are very long — consider trimming.");
  const formatScore = Math.max(0, 100 - formatIssues.length * 25);
  categories.push({
    id: "formatting",
    label: "Formatting",
    score: clampScore(formatScore),
    weight: 10,
    status: formatIssues.length === 0 ? "good" : formatIssues.length <= 2 ? "warn" : "bad",
    detail: `${formatIssues.length} formatting issue(s)`,
    recommendation:
      formatIssues.length === 0 ? "Formatting looks clean." : formatIssues.join(" "),
  });
  formatIssues.forEach((f) => warnings.push(f));

  /* 8. Readability (weight 8) */
  const allWords = allText.split(/\s+/).filter(Boolean).length;
  const avgWordLen =
    allWords > 0 ? allText.replace(/[^a-z\s]/g, "").split(/\s+/).filter(Boolean).join("").length / allWords : 5;
  const readabilityScore = avgWordLen > 7 ? 60 : avgWordLen > 6 ? 80 : 100;
  categories.push({
    id: "readability",
    label: "Readability",
    score: clampScore(readabilityScore),
    weight: 8,
    status: readabilityScore >= 80 ? "good" : readabilityScore >= 60 ? "warn" : "bad",
    detail: `Avg word length ${avgWordLen.toFixed(1)} chars`,
    recommendation:
      readabilityScore < 80
        ? "Use shorter, simpler words for better ATS parsing."
        : "Readability is good.",
  });

  /* 9. Section Completeness (weight 7) */
  const completenessItems = [
    !!data.personal.name,
    !!data.personal.email,
    !!data.personal.phone,
    !!data.personal.location,
    !!data.personal.linkedin,
    !!data.summary,
    !!data.objective,
    data.experience.some((e) => e.company),
    data.education.some((e) => e.college),
    data.projects.some((p) => p.title),
    totalSkills > 0,
    !!data.languages,
  ];
  const completed = completenessItems.filter(Boolean).length;
  const completeScore = (completed / completenessItems.length) * 100;
  categories.push({
    id: "completeness",
    label: "Section Completeness",
    score: clampScore(completeScore),
    weight: 7,
    status: completed >= 10 ? "good" : completed >= 6 ? "warn" : "bad",
    detail: `${completed}/${completenessItems.length} key fields filled`,
    recommendation:
      completed < completenessItems.length
        ? "Fill the remaining empty fields for maximum ATS score."
        : "All key fields are filled.",
  });

  // Weighted overall score
  const totalWeight = categories.reduce((s, c) => s + c.weight, 0);
  const overall = categories.reduce((s, c) => s + (c.score * c.weight) / totalWeight, 0);

  // Build the legacy factors list (kept for the live preview dashboard)
  const factors: AtsFactor[] = categories.map((c) => ({
    name: c.label,
    desc: c.detail,
    status: c.status,
    icon: c.status === "good" ? "check" : c.status === "warn" ? "circle-exclamation" : "times",
  }));

  // General improvement suggestions
  if (!data.personal.linkedin) suggestions.push("Add a LinkedIn URL — most recruiters check it.");
  if (!data.personal.portfolio) suggestions.push("Add a portfolio/GitHub link if you have one.");
  const verbCount = ACTION_VERBS.filter((v) => allText.includes(v)).length;
  if (verbCount < 4) {
    suggestions.push(
      `Use more action verbs (developed, led, optimized, delivered). Found ${verbCount}.`
    );
  }
  const hasMetrics = /(\d+%|\$\s?\d|\d+x|\d+\s?(users|customers|teams|hours))/i.test(allText);
  if (!hasMetrics) {
    suggestions.push("Quantify achievements with numbers, percentages or metrics.");
  }
  if (totalSkills < 8) suggestions.push("Expand your skills section to at least 8-10 skills.");
  if (!data.summary) suggestions.push("Generate a professional summary with the AI tool.");
  if (data.projects.length === 0 || !data.projects.some((p) => p.title)) {
    suggestions.push("Add at least one project to showcase applied skills.");
  }
  if (suggestions.length === 0) {
    suggestions.push("Excellent! Your resume is comprehensive and ATS-ready.");
  }

  return {
    score: clampScore(overall),
    factors,
    categories,
    missingKeywords,
    suggestions,
    warnings,
  };
}

// Backwards-compatible helper used by the existing live dashboard.
export function calculateAts(data: ResumeData): { score: number; factors: AtsFactor[] } {
  const a = analyzeResume(data);
  return { score: a.score, factors: a.factors };
}

export interface AiTip {
  icon: string;
  text: string;
}

export function generateAiTips(data: ResumeData): AiTip[] {
  const tips: AiTip[] = [];
  const analysis = analyzeResume(data);

  analysis.categories.slice(0, 4).forEach((c) => {
    if (c.status !== "good") {
      tips.push({
        icon:
          c.id === "skills"
            ? "code"
            : c.id === "summary"
              ? "lightbulb"
              : c.id === "experience"
                ? "briefcase"
                : "chart-line",
        text: c.recommendation,
      });
    }
  });

  if (!data.personal.linkedin) {
    tips.push({
      icon: "linkedin",
      text: "Add your LinkedIn profile link - 87% of recruiters check LinkedIn profiles.",
    });
  }

  if (tips.length === 0) {
    tips.push({
      icon: "check-circle",
      text: "Excellent! Your resume looks comprehensive. Generate an AI summary and download your PDF.",
    });
  }

  return tips.slice(0, 5);
}
