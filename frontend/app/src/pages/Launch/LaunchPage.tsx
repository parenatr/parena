import { useRef } from "react";

import { Compare } from "@/components/landing/Compare";
import { Faq } from "@/components/landing/Faq";
import { Features } from "@/components/landing/Features";
import { FinalCta } from "@/components/landing/FinalCta";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { KarneCard } from "@/components/landing/KarneCard";
import { LeadCapture } from "@/components/landing/LeadCapture";
import { Pain } from "@/components/landing/Pain";
import { Pricing } from "@/components/landing/Pricing";
import { Proof } from "@/components/landing/Proof";
import { SeoBlock } from "@/components/landing/SeoBlock";
import { StickyCta } from "@/components/landing/StickyCta";
import { TrustBar } from "@/components/landing/TrustBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { useLandingEffects } from "@/hooks/use-landing-effects";

import "./LaunchPage.css";

export const launchPageMeta = {
  title: "PARENA (Portföy Arena) | Borsa ve Portföy Analiz Platformu",
  description:
    "68 kurumun günlük, haftalık, model portföy ve kısa vadeli önerileri tek ekranda, her birinin kâr/zararıyla. Sektör bazlı isabet analizi. Ücretsiz başla.",
  ogTitle: "PARENA · Portföy Arena | Paranın Arenası",
  ogDescription:
    "68 kurumun önerileri, her biri kâr/zararıyla birlikte. Hangi kurum hangi sektörde isabetli, veriyle gör.",
};

export default function LaunchPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useLandingEffects(rootRef);

  return (
    <div className="launch-page" ref={rootRef}>
      <a className="skip" href="#icerik">İçeriğe geç</a>
      <SiteNav />
      <main id="icerik">
        <Hero /><TrustBar /><Pain /><HowItWorks /><Features />
        <KarneCard /><Proof /><Compare /><Pricing /><LeadCapture />
        <Faq /><FinalCta /><SeoBlock />
      </main>
      <SiteFooter />
      <StickyCta />
    </div>
  );
}

