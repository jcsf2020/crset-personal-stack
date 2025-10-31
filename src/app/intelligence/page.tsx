import { Metadata } from "next";
import { IntelligenceHub } from "./components/IntelligenceHub";

export const metadata: Metadata = {
  title: "Intelligence Hub | CRSET Solutions",
  description: "Dashboard inteligente com analytics em tempo real, AI insights e visualizações avançadas",
};

export default function IntelligencePage() {
  return <IntelligenceHub />;
}

