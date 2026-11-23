import { Brain } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer
      style={{
        padding: "40px 20px",
        textAlign: "center",
        position: "relative",
        zIndex: 3,
        borderTop: "1px solid rgba(255,255,255,0.05)",
        marginTop: "auto",
      }}
    >
      <div className="nx-glass" style={{ maxWidth: "800px", margin: "0 auto", padding: "30px", borderRadius: "20px" }}>
        <div
          className="nx-nav-logo"
          style={{ justifyContent: "center", marginBottom: "15px", fontSize: "20px" }}
        >
          <Brain
            size={20}
            style={{ color: "var(--nx-cyan)", filter: "drop-shadow(0 0 8px rgba(34,211,238,0.6))" }}
          />
          NEXUS AI
        </div>
        <p style={{ color: "rgba(248,253,255,0.5)", fontSize: "13px", marginBottom: "20px" }}>
          The future of resume building. Powered by AI, designed for success.
        </p>
        <p style={{ color: "rgba(248,253,255,0.3)", fontSize: "12px" }}>
          © 2025 NEXUS AI. Built for the National AI Hackathon. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
