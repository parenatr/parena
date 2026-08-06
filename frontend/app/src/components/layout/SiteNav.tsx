import { useState } from "react";

import { AppLink } from "@/components/ui/app-link";
import { ParenaMark } from "@/components/brand/ParenaMark";

const LINKS = [
  { href: "#nasil", label: "Nasıl çalışır" },
  { href: "#ozellikler", label: "Özellikler" },
  { href: "#karne", label: "Karne" },
  { href: "#fiyat", label: "Fiyat" },
  { href: "#sss", label: "SSS" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav" id="nav">
      <div className="wrap nav-in">
        <AppLink className="brand" href="/" aria-label="PARENA ana sayfa">
          <ParenaMark className="brand-mark" size={54} />
          <span>
            <span className="brand-name">
              PAR<em>ENA</em>
            </span>
            <span className="brand-tag">Portföy Arena</span>
          </span>
        </AppLink>

        <nav
          className={open ? "nav-links open" : "nav-links"}
          id="navLinks"
          aria-label="Ana menü"
          onClick={() => setOpen(false)}
        >
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-cta">
          <AppLink className="btn btn-ghost" href="/giris" data-cta="nav-giris">
            Giriş yap
          </AppLink>
          <a className="btn btn-primary" href="#fiyat" data-cta="nav-uyeol">
            Kurucu üye ol
          </a>
          <button
            type="button"
            className="burger"
            id="burger"
            aria-label="Menüyü aç"
            aria-expanded={open}
            aria-controls="navLinks"
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
