"use client";

import { useRef, useState } from "react";
import { Upload, Trash2, Image as ImageIcon, Info, Crop } from "lucide-react";
import { useResumeStore, type PhotoStyle } from "@/lib/resume-store";
import { useToast } from "./toasts";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function PhotoUpload() {
  const { data, setPersonal, photoStyle, setPhotoStyle } = useResumeStore();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCropper, setShowCropper] = useState(false);

  const handleFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast("Please upload a JPG, PNG, or WebP image.", "error");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast("Image too large. Maximum size is 5MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Downscale large images to keep performance reasonable
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 400;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setPersonal({ photo: result });
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL("image/png");
        setPersonal({ photo: compressed });
        toast("Profile photo uploaded!", "success");
      };
      img.onerror = () => {
        setPersonal({ photo: result });
        toast("Profile photo uploaded!", "success");
      };
      img.src = result;
    };
    reader.onerror = () => toast("Failed to read image file.", "error");
    reader.readAsDataURL(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const removePhoto = () => {
    setPersonal({ photo: "" });
    toast("Profile photo removed.", "info");
  };

  const replacePhoto = () => {
    fileInputRef.current?.click();
  };

  const styleOptions: { id: PhotoStyle; label: string }[] = [
    { id: "circular", label: "Circle" },
    { id: "rounded", label: "Rounded" },
    { id: "square", label: "Square" },
  ];

  const previewRadius =
    photoStyle === "circular" ? "50%" : photoStyle === "rounded" ? "12px" : "0px";

  return (
    <div className="nx-photo-upload-area" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={onInputChange}
        style={{ display: "none" }}
      />
      <div className="nx-photo-preview-box" style={{ borderRadius: previewRadius }}>
        {data.personal.photo ? (
          <img src={data.personal.photo} alt="Profile preview" />
        ) : (
          <ImageIcon size={28} color="rgba(248,253,255,0.25)" />
        )}
      </div>
      <div className="nx-photo-controls">
        <div className="nx-photo-btn-row">
          {!data.personal.photo ? (
            <button className="nx-photo-btn" onClick={() => fileInputRef.current?.click()} type="button">
              <Upload size={14} /> Upload Photo
            </button>
          ) : (
            <>
              <button className="nx-photo-btn" onClick={replacePhoto} type="button">
                <Upload size={14} /> Replace
              </button>
              <button className="nx-photo-btn nx-photo-btn-danger" onClick={removePhoto} type="button">
                <Trash2 size={14} /> Remove
              </button>
            </>
          )}
        </div>
        {data.personal.photo && (
          <div className="nx-photo-style-row">
            <span>Style:</span>
            {styleOptions.map((opt) => (
              <button
                key={opt.id}
                className={`nx-photo-style-opt ${photoStyle === opt.id ? "active" : ""}`}
                onClick={() => setPhotoStyle(opt.id)}
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
        <div className="nx-photo-hint">
          <Info size={11} />
          JPG, PNG, or WebP. Max 5MB. Optional.
        </div>
      </div>
    </div>
  );
}
