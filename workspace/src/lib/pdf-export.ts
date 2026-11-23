"use client";

import type { ResumeData, PhotoStyle } from "@/lib/resume-store";
import { getTemplate } from "@/lib/templates";

export async function exportToPDF(
  data: ResumeData,
  templateId: string,
  photoStyle: PhotoStyle
) {
  const template = getTemplate(templateId);
  const hasData = data.personal.name || data.personal.email;
  const renderData = hasData ? data : data;

  // Dynamically import dependencies
  const [{ jsPDF }, html2canvasMod, React, ReactDOMClient] = await Promise.all([
    import("jspdf"),
    import("html2canvas-pro"),
    import("react"),
    import("react-dom/client"),
  ]);

  const { TemplateRenderer } = await import(
    "@/components/nexus/template-renderer"
  );

  // Create an off-screen container at A4 width (794px at 96dpi)
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-99999px";
  container.style.top = "0";
  container.style.width = "794px";
  container.style.background = "#ffffff";
  container.style.zIndex = "-1";
  container.style.pointerEvents = "none";
  document.body.appendChild(container);

  // Render the template into the container
  const root = ReactDOMClient.createRoot(container);
  await new Promise<void>((resolve) => {
    root.render(
      React.createElement(TemplateRenderer, {
        template,
        data: renderData,
        photoStyle,
      })
    );
    // Allow React to flush
    setTimeout(resolve, 600);
  });

  try {
    const html2canvas = html2canvasMod.default;
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      allowTaint: true,
      logging: false,
      windowWidth: 794,
    });

    const doc = new jsPDF("portrait", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Scale image to fit page width
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const imgData = canvas.toDataURL("image/jpeg", 0.92);

    // Multi-page support
    let heightLeft = imgHeight;
    let position = 0;

    doc.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    root.unmount();
    document.body.removeChild(container);

    const fileName =
      (data.personal.name || "Resume").replace(/\s+/g, "_") + "_Resume.pdf";
    doc.save(fileName);
  } catch (err) {
    root.unmount();
    document.body.removeChild(container);
    throw err;
  }
}
