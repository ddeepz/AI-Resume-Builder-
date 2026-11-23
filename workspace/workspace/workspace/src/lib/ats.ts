import type { ResumeData, AtsFactor } from "@/lib/resume-store";

export function calculateAts(data: ResumeData): { score: number; factors: AtsFactor[] } {
  let score = 0;
  const factors: AtsFactor[] = [];

  // Contact Info (20 points)
  const contactFields: (keyof ResumeData["personal"])[] = ["name", "email", "phone", "location"];
  const filledContact = contactFields.filter((f) => data.personal[f]).length;
  score += (filledContact / contactFields.length) * 20;

  factors.push({
    name: "Contact Information",
    desc: `${filledContact}/${contactFields.length} fields filled`,
    status: filledContact === 4 ? "good" : filledContact >= 2 ? "warn" : "bad",
    icon: filledContact === 4 ? "check" : filledContact >= 2 ? "circle-exclamation" : "times",
  });

  // Professional Summary (15 points)
  if (data.summary) {
    score += 15;
    factors.push({ name: "Professional Summary", desc: "AI summary generated", status: "good", icon: "check" });
  } else {
    factors.push({ name: "Professional Summary", desc: "No summary yet - generate one!", status: "bad", icon: "times" });
  }

  // Skills (20 points)
  const totalSkills =
    data.skills.technical.length + data.skills.programming.length + data.skills.soft.length;
  score += Math.min(totalSkills / 10, 1) * 20;

  factors.push({
    name: "Skills Section",
    desc: `${totalSkills} skills listed`,
    status: totalSkills >= 10 ? "good" : totalSkills >= 5 ? "warn" : "bad",
    icon: totalSkills >= 10 ? "check" : totalSkills >= 5 ? "circle-exclamation" : "times",
  });

  // Experience (20 points)
  score += (Math.min(data.experience.length, 2) / 2) * 20;
  factors.push({
    name: "Work Experience",
    desc: `${data.experience.length} experience(s) added`,
    status: data.experience.length >= 2 ? "good" : data.experience.length >= 1 ? "warn" : "bad",
    icon: data.experience.length >= 2 ? "check" : data.experience.length >= 1 ? "circle-exclamation" : "times",
  });

  // Education (10 points)
  if (data.education.length > 0 && data.education.some((e) => e.college)) {
    score += 10;
    factors.push({ name: "Education", desc: "Education details added", status: "good", icon: "check" });
  } else {
    factors.push({ name: "Education", desc: "No education added", status: "bad", icon: "times" });
  }

  // Projects (10 points)
  if (data.projects.length > 0 && data.projects.some((p) => p.title)) {
    score += 10;
    factors.push({
      name: "Projects",
      desc: `${data.projects.length} project(s) added`,
      status: "good",
      icon: "check",
    });
  } else {
    factors.push({ name: "Projects", desc: "No projects added", status: "warn", icon: "circle-exclamation" });
  }

  // Action Verbs / Keywords (5 points)
  const allText = JSON.stringify(data).toLowerCase();
  const actionVerbs = [
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
  ];
  const verbCount = actionVerbs.filter((v) => allText.includes(v)).length;
  score += (verbCount / 5) * 5;

  factors.push({
    name: "Action Verbs",
    desc: `${verbCount} action verbs found`,
    status: verbCount >= 5 ? "good" : verbCount >= 2 ? "warn" : "bad",
    icon: verbCount >= 5 ? "check" : verbCount >= 2 ? "circle-exclamation" : "times",
  });

  return { score: Math.round(score), factors };
}

export interface AiTip {
  icon: string;
  text: string;
}

export function generateAiTips(data: ResumeData): AiTip[] {
  const tips: AiTip[] = [];

  if (!data.summary) {
    tips.push({
      icon: "lightbulb",
      text: "Generate an AI-powered professional summary to make your resume stand out to recruiters.",
    });
  }

  if (data.skills.technical.length + data.skills.programming.length < 5) {
    tips.push({
      icon: "code",
      text: "Add more technical skills. Aim for at least 8-10 relevant skills to pass ATS screening.",
    });
  }

  if (data.experience.length === 0 || !data.experience.some((e) => e.company)) {
    tips.push({
      icon: "briefcase",
      text: "Add work experience, even internships or personal projects count!",
    });
  }

  const allText = JSON.stringify(data).toLowerCase();
  if (!allText.includes("%") && !allText.includes("improved") && !allText.includes("increased")) {
    tips.push({
      icon: "chart-line",
      text: "Quantify your achievements! Use numbers, percentages, and metrics to show impact.",
    });
  }

  if (data.projects.length === 0 || !data.projects.some((p) => p.title)) {
    tips.push({
      icon: "cube",
      text: "Add projects to showcase your practical skills and creativity.",
    });
  }

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

  return tips;
}
