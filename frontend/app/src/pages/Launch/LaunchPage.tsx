import { useEffect, useRef } from "react";

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
import { useSession } from "@/features/auth/auth.queries";
import { useLandingEffects } from "@/hooks/use-landing-effects";

import "./LaunchPage.css";

export const launchPageMeta = {
  title: "Parena - Portföy Arena",
  description:
    "68 kurumun günlük, haftalık, model portföy ve kısa vadeli önerileri tek ekranda, her birinin kâr/zararıyla. Sektör bazlı isabet analizi. Ücretsiz başla.",
  ogTitle: "Parena · Portföy Arena | Paranın Arenası",
  ogDescription:
    "68 kurumun önerileri, her biri kâr/zararıyla birlikte. Hangi kurum hangi sektörde isabetli, veriyle gör.",
};

export default function LaunchPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useLandingEffects(rootRef);

  // ── GEÇİCİ DEMO YÖNLENDİRMESİ ──────────────────────────────────────────
  // Sunum için: login/register sonrası bu sayfaya (BFF'in default redirect
  // hedefi) düşen HER authenticated kullanıcı, public/demo-dashboard.html
  // altındaki temsili statik dashboard'a yönlendirilir. Gerçek dashboard
  // henüz yok; bu blok sunum bitince kaldırılacak (bu commit tek başına
  // revert edilebilir, demo/sunum-dashboard branch'inde tutulur).
  const { isAuthenticated, isLoading } = useSession();
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      window.location.replace("/demo-dashboard.html");
    }
  }, [isAuthenticated, isLoading]);
  // ── GEÇİCİ DEMO YÖNLENDİRMESİ SONU ──────────────────────────────────────

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

