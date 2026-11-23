"use client";

import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";
import { useToastList, useRemoveToast } from "./toasts";

export default function ToastContainer() {
  const toasts = useToastList();
  const remove = useRemoveToast();

  return (
    <div className="nx-toast-container" role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <div key={t.id} className="nx-toast">
          {t.type === "success" && <CheckCircle2 size={18} />}
          {t.type === "error" && <AlertCircle size={18} />}
          {t.type === "info" && <Info size={18} />}
          <span>{t.message}</span>
          <button
            onClick={() => remove(t.id)}
            aria-label="Dismiss"
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
