"use client";

import type { ResumeData } from "@/lib/resume-store";

export async function exportToPDF(data: ResumeData) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF("portrait", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  let y = margin;

  doc.setFillColor(248, 253, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(16, 27, 53);
  doc.text(data.personal.name || "Your Name", margin, y + 10);
  y += 25;

  // Job Title
  if (data.personal.jobTitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(8, 145, 178);
    doc.text(data.personal.jobTitle, margin, y);
    y += 20;
  }

  // Contact
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const contacts: string[] = [];
  if (data.personal.email) contacts.push(data.personal.email);
  if (data.personal.phone) contacts.push(data.personal.phone);
  if (data.personal.location) contacts.push(data.personal.location);
  if (data.personal.linkedin) contacts.push(data.personal.linkedin);
  if (data.personal.portfolio) contacts.push(data.personal.portfolio);
  if (contacts.length) {
    doc.text(contacts.join("  |  "), margin, y);
    y += 10;
  }

  doc.setDrawColor(34, 211, 238);
  doc.setLineWidth(1.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  // Summary
  if (data.summary) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(8, 145, 178);
    doc.text("PROFESSIONAL SUMMARY", margin, y);
    y += 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    const splitSummary = doc.splitTextToSize(data.summary, pageWidth - 2 * margin);
    doc.text(splitSummary, margin, y);
    y += splitSummary.length * 12 + 10;
  }

  // Education
  if (data.education.length > 0 && data.education.some((e) => e.college)) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(8, 145, 178);
    doc.text("EDUCATION", margin, y);
    y += 15;

    data.education.forEach((e) => {
      if (e.college || e.degree) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(16, 27, 53);
        doc.text(`${e.degree || ""} ${e.department ? "in " + e.department : ""}`, margin, y);
        if (e.year) {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100, 116, 139);
          doc.text(e.year, pageWidth - margin, y, { align: "right" });
        }
        y += 13;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(51, 65, 85);
        if (e.college) {
          doc.text(e.college, margin, y);
          y += 12;
        }
        if (e.cgpa) {
          doc.text(`Score: ${e.cgpa}`, margin, y);
          y += 12;
        }
        y += 5;
      }
    });
    y += 5;
  }

  // Skills
  const allSkills = [...data.skills.technical, ...data.skills.programming, ...data.skills.soft];
  if (allSkills.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(8, 145, 178);
    doc.text("SKILLS", margin, y);
    y += 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    const splitSkills = doc.splitTextToSize(allSkills.join(" • "), pageWidth - 2 * margin);
    doc.text(splitSkills, margin, y);
    y += splitSkills.length * 12 + 10;
  }

  // Experience
  if (data.experience.length > 0 && data.experience.some((e) => e.company)) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(8, 145, 178);
    doc.text("EXPERIENCE", margin, y);
    y += 15;

    data.experience.forEach((e) => {
      if (e.company || e.position) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(16, 27, 53);
        doc.text(e.position || "", margin, y);
        if (e.duration) {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100, 116, 139);
          doc.text(e.duration, pageWidth - margin, y, { align: "right" });
        }
        y += 13;
        doc.setFont("helvetica", "italic");
        doc.setTextColor(51, 65, 85);
        if (e.company) {
          doc.text(e.company, margin, y);
          y += 13;
        }
        doc.setFont("helvetica", "normal");
        if (e.responsibilities) {
          const splitResp = doc.splitTextToSize(e.responsibilities, pageWidth - 2 * margin);
          doc.text(splitResp, margin, y);
          y += splitResp.length * 12 + 5;
        }
        y += 8;
      }
    });
  }

  // Projects
  if (data.projects.length > 0 && data.projects.some((p) => p.title)) {
    if (y > pageHeight - 100) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(8, 145, 178);
    doc.text("PROJECTS", margin, y);
    y += 15;

    data.projects.forEach((p) => {
      if (p.title) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(16, 27, 53);
        doc.text(p.title, margin, y);
        y += 13;
        if (p.technologies) {
          doc.setFont("helvetica", "italic");
          doc.setTextColor(8, 145, 178);
          doc.text(`Tech: ${p.technologies}`, margin, y);
          y += 12;
        }
        doc.setFont("helvetica", "normal");
        doc.setTextColor(51, 65, 85);
        if (p.description) {
          const splitDesc = doc.splitTextToSize(p.description, pageWidth - 2 * margin);
          doc.text(splitDesc, margin, y);
          y += splitDesc.length * 12 + 5;
        }
        y += 8;
      }
    });
  }

  // Certificates
  if (data.certificates.length > 0 && data.certificates.some((c) => c.name)) {
    if (y > pageHeight - 80) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(8, 145, 178);
    doc.text("CERTIFICATIONS", margin, y);
    y += 15;

    data.certificates.forEach((c) => {
      if (c.name) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(16, 27, 53);
        doc.text(c.name, margin, y);
        if (c.year) {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100, 116, 139);
          doc.text(c.year, pageWidth - margin, y, { align: "right" });
        }
        y += 13;
        if (c.organization) {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(51, 65, 85);
          doc.text(c.organization, margin, y);
          y += 12;
        }
        y += 5;
      }
    });
  }

  // Languages
  if (data.languages) {
    if (y > pageHeight - 60) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(8, 145, 178);
    doc.text("LANGUAGES", margin, y);
    y += 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text(data.languages, margin, y);
  }

  const fileName = (data.personal.name || "Resume").replace(/\s+/g, "_") + "_Resume.pdf";
  doc.save(fileName);
}
