"use client";

import { useToast } from "./toasts";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Templates() {
  const toast = useToast();

  const select = (name: string) => {
    toast(`${name.charAt(0).toUpperCase() + name.slice(1)} template selected!`, "success");
    scrollToSection("builder");
  };

  return (
    <section className="nx-section" id="templates">
      <h2 className="nx-section-title">PREMIUM TEMPLATES</h2>
      <p className="nx-section-subtitle">
        Choose from professionally designed, ATS-optimized templates
      </p>

      <div className="nx-features-grid">
        {/* Modern Pro */}
        <div
          className="nx-glass-card nx-feature-card"
          onClick={() => select("modern")}
          style={{ cursor: "pointer" }}
          role="button"
          tabIndex={0}
        >
          <div
            style={{
              height: "200px",
              background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
              borderRadius: "12px",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              padding: "15px",
              gap: "6px",
            }}
          >
            <div style={{ height: "12px", width: "60%", background: "#0891b2", borderRadius: "4px" }} />
            <div style={{ height: "6px", width: "40%", background: "#94a3b8", borderRadius: "3px" }} />
            <div style={{ marginTop: "10px", display: "grid", gap: "4px" }}>
              <div style={{ height: "4px", background: "#cbd5e1", borderRadius: "2px" }} />
              <div style={{ height: "4px", background: "#cbd5e1", borderRadius: "2px", width: "90%" }} />
              <div style={{ height: "4px", background: "#cbd5e1", borderRadius: "2px", width: "75%" }} />
            </div>
            <div style={{ marginTop: "auto", display: "flex", gap: "4px" }}>
              <div style={{ height: "12px", width: "30px", background: "#e0f2fe", borderRadius: "10px" }} />
              <div style={{ height: "12px", width: "25px", background: "#e0f2fe", borderRadius: "10px" }} />
            </div>
          </div>
          <h3>MODERN PRO</h3>
          <p>Clean, modern design with cyan accents. Perfect for tech and creative roles.</p>
        </div>

        {/* Classic Elegant */}
        <div
          className="nx-glass-card nx-feature-card"
          onClick={() => select("classic")}
          style={{ cursor: "pointer" }}
          role="button"
          tabIndex={0}
        >
          <div
            style={{
              height: "200px",
              background: "#ffffff",
              borderRadius: "12px",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              padding: "15px",
              gap: "6px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ height: "12px", width: "50%", background: "#1e293b", borderRadius: "2px" }} />
            <div style={{ height: "6px", width: "35%", background: "#64748b", borderRadius: "2px" }} />
            <div style={{ marginTop: "10px", display: "grid", gap: "4px" }}>
              <div style={{ height: "4px", background: "#e2e8f0", borderRadius: "2px" }} />
              <div style={{ height: "4px", background: "#e2e8f0", borderRadius: "2px", width: "85%" }} />
              <div style={{ height: "4px", background: "#e2e8f0", borderRadius: "2px", width: "70%" }} />
            </div>
          </div>
          <h3>CLASSIC ELEGANT</h3>
          <p>Traditional, professional layout. Ideal for corporate and academic positions.</p>
        </div>

        {/* Creative Bold */}
        <div
          className="nx-glass-card nx-feature-card"
          onClick={() => select("creative")}
          style={{ cursor: "pointer" }}
          role="button"
          tabIndex={0}
        >
          <div
            style={{
              height: "200px",
              background: "linear-gradient(135deg, #fef3c7, #fce7f3)",
              borderRadius: "12px",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              padding: "15px",
              gap: "6px",
            }}
          >
            <div
              style={{
                height: "12px",
                width: "55%",
                background: "linear-gradient(90deg, #ec4899, #8b5cf6)",
                borderRadius: "6px",
              }}
            />
            <div style={{ height: "6px", width: "40%", background: "#a78bfa", borderRadius: "3px" }} />
            <div style={{ marginTop: "10px", display: "grid", gap: "4px" }}>
              <div style={{ height: "4px", background: "#c4b5fd", borderRadius: "2px" }} />
              <div style={{ height: "4px", background: "#c4b5fd", borderRadius: "2px", width: "88%" }} />
            </div>
            <div style={{ marginTop: "auto", display: "flex", gap: "4px" }}>
              <div
                style={{
                  height: "14px",
                  width: "35px",
                  background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                  borderRadius: "10px",
                }}
              />
              <div
                style={{
                  height: "14px",
                  width: "30px",
                  background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
                  borderRadius: "10px",
                }}
              />
            </div>
          </div>
          <h3>CREATIVE BOLD</h3>
          <p>Vibrant, eye-catching design for creative professionals and designers.</p>
        </div>
      </div>
    </section>
  );
}
