"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`nx-loading-screen ${hidden ? "hidden" : ""}`} aria-hidden={hidden}>
      <div className="nx-loader-brain">
        <svg
          viewBox="0 0 100 100"
          style={{
            position: "absolute",
            inset: "20px",
            width: "calc(100% - 40px)",
            height: "calc(100% - 40px)",
          }}
        >
          <circle cx="50" cy="50" r="20" fill="none" stroke="#22D3EE" strokeWidth="2" opacity="0.5" />
          <circle cx="50" cy="50" r="12" fill="#22D3EE" opacity="0.3" />
          <circle cx="50" cy="50" r="6" fill="#A5F3FC" />
        </svg>
      </div>
      <div className="nx-loader-text">Initializing AI Engine</div>
    </div>
  );
}
