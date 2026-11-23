import type { Metadata } from "next";
import { Orbitron, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "NEXUS AI — Build Your Future With AI",
  description:
    "Create smarter, faster, and professional resumes with the power of Artificial Intelligence. Real-time ATS scoring, AI-generated content, and stunning 3D visual design.",
  keywords: [
    "NEXUS AI",
    "AI Resume Builder",
    "ATS Score",
    "Resume Generator",
    "AI",
    "Resume",
  ],
  authors: [{ name: "NEXUS AI" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "NEXUS AI — Build Your Future With AI",
    description:
      "Next-generation AI resume builder with real-time ATS scoring and 3D visual design.",
    siteName: "NEXUS AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${orbitron.variable} ${outfit.variable} antialiased nexus-body`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
