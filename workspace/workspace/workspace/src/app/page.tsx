import BackgroundCanvas from "@/components/nexus/background-canvas";
import CustomCursor from "@/components/nexus/custom-cursor";
import LoadingScreen from "@/components/nexus/loading-screen";
import ToastContainer from "@/components/nexus/toast-container";
import NexusNav from "@/components/nexus/nexus-nav";
import Hero from "@/components/nexus/hero";
import Features from "@/components/nexus/features";
import Builder from "@/components/nexus/builder";
import Templates from "@/components/nexus/templates";
import SiteFooter from "@/components/nexus/site-footer";

export default function Home() {
  return (
    <div className="nexus-body" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <LoadingScreen />
      <BackgroundCanvas />
      <div className="nx-bg-gradient-overlay" aria-hidden="true" />
      <CustomCursor />
      <ToastContainer />

      <NexusNav />

      <main style={{ flex: 1, position: "relative", zIndex: 3 }}>
        <Hero />
        <Features />
        <Builder />
        <Templates />
      </main>

      <SiteFooter />
    </div>
  );
}
