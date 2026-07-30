import { Faq } from "@/components/landing/Faq";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { KarneCard } from "@/components/landing/KarneCard";
import { Pricing } from "@/components/landing/Pricing";
import { ProofBand } from "@/components/landing/ProofBand";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";

import "./LaunchPage.css";
import { loginPageMeta } from "../Login/LoginPage";
import { useDocumentMeta } from "@/hooks/use-document-meta";

export const launchPageMeta = {
  title: "PARENA — Portföy Arena | Günlük Hisse Önerileri Tek Ekranda",
  description:
    "Aracı kurumların günlük hisse önerileri tek ekranda — kaynağıyla, arşiviyle ve her akşam netleşen karnesiyle. Davetli üyelik.",
  ogTitle: "PARENA — Paranın Arenası",
  ogDescription: "Günlük hisse önerileri, tek ekranda. Her öneri, sonucuyla birlikte.",
};


export default function LaunchPage() {
  useDocumentMeta(loginPageMeta);
  return (
    <div className="launch-page">
      <SiteNav />
      <main>
        <div className="launch-hero">
          <Hero />
          <KarneCard />
        </div>
        <Features />
        <ProofBand />
        <Pricing />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  );
}
