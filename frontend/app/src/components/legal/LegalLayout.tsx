import type { ReactNode } from "react";

import { ParenaMark } from "@/components/brand/ParenaMark";
import { LegalFooter } from "@/components/legal/LegalFooter";
import { AppLink } from "@/components/ui/app-link";

import "./legal.css";


/** Hukuki metinlerin ortak kabuğu: sade üst bar + belge gövdesi + site footer'ı. */
export function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="legal-page">
      <a className="skip" href="#belge">
        İçeriğe geç
      </a>

      <header className="nav">
        <div className="nav-in">
          <AppLink className="brand" href="/" aria-label="PARENA ana sayfa">
            <ParenaMark
              size={48}
              className="brand-mark"
            />
            <span>
              <span className="brand-name">
                PAR<em>ENA</em>
              </span>
              <span className="brand-tag">Portföy Arena</span>
            </span>
          </AppLink>
          <AppLink className="back" href="/">
            ← Ana sayfaya dön
          </AppLink>
        </div>
      </header>

      <main>{children}</main>

      <LegalFooter />
    </div>
  );
}
