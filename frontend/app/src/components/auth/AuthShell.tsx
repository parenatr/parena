import type { ReactNode } from "react";

import { ParenaMark } from "@/components/brand/ParenaMark";
import { AppLink } from "../ui/app-link";
import type { KcContext } from "@/keycloak-theme/login/KcContext";
import "./auth-shell.css";

type ProofItem = { no: string; text: string };

type AuthShellProps = {
  /** Sol panel başlığı */
  sideTitle: string;
  sideText: string;
  proof?: ProofItem[];
  children: ReactNode,
  kcContext?: KcContext;
};

const DEFAULT_PROOF: ProofItem[] = [
  { no: "01", text: "68 SPK lisanslı kurumun yayını tek akışta" },
  { no: "02", text: "Her önerinin kâr/zararı, kapanış verisiyle" },
  { no: "03", text: "Sektör bazlı kurum isabet analizi" },
];


function BrandBlock({ className, homeHref }: { className: string; homeHref: string }) {
  return (
    <AppLink className={className} href={homeHref} aria-label="PARENA ana sayfa">
      <ParenaMark size={48} className="brand-mark" />
      <span>
        <span className="brand-name">
          PAR<em>ENA</em>
        </span>
        <span className="brand-tag">Portföy Arena</span>
      </span>
    </AppLink>
  );
}

/** Auth ekranlarının iki panelli ortak kabuğu (sol marka paneli + sağ form kartı). */
export function AuthShell({ sideTitle, sideText, proof = DEFAULT_PROOF, children, kcContext }: AuthShellProps) {
  const homeHref = kcContext?.properties?.APP_URL ?? "/";
  return (
    <div className="auth-page">
      <a className="skip" href="#icerik">
        İçeriğe geç
      </a>

      <div className="shell">
        <aside className="side">
          <BrandBlock className="side-brand" homeHref={homeHref} />

          <div className="side-mid">
            <h2>{sideTitle}</h2>
            <p>{sideText}</p>
            <ul className="proof">
              {proof.map((item) => (
                <li key={item.no}>
                  <i>{item.no}</i>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="side-foot">
            PARENA yatırım tavsiyesi vermez. İçerikler yalnızca bilgilendirme amaçlıdır.
            <br />
            <AppLink href="/kullanim-sartlari">Kullanım Şartları</AppLink> ·{" "}
            <AppLink href="/gizlilik">Gizlilik</AppLink> · <AppLink href="/kvkk">KVKK</AppLink>
          </p>
        </aside>

        <main className="main">
          <div className="card" id="icerik">
            <BrandBlock className="side-brand" homeHref={homeHref} />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
