import { useState, useEffect } from "react";
import { AppLink } from "@/components/ui/app-link";
import { ParenaMark } from "@/components/brand/ParenaMark";

const LINKS = [
  { href: "#nasil", label: "Nasıl çalışır?" },
  { href: "#ozellikler", label: "Özellikler" },
  { href: "#karne", label: "Karne" },
  { href: "#fiyat", label: "Fiyat" },
  { href: "#sss", label: "SSS" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  // Mobil menü açıkken büyük ekrana geçilirse menüyü kapat
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 980 && open) {
        setOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  return (
    <header className="nav" id="nav">
      <div className="wrap nav-in">
        <AppLink className="brand" href="/" aria-label="PARENA ana sayfa" onClick={() => setOpen(false)}>
          <ParenaMark className="brand-mark" size={46} />
          <span className="brand-text-box">
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
          {/* Mobilde açılır menü altında yatay yan yana butonlar */}
          <div className="mob-menu-actions">
            <AppLink className="btn btn-ghost" href="/giris" data-cta="nav-giris-mob">
              Giriş yap
            </AppLink>
            <a className="btn btn-primary" href="#fiyat" data-cta="nav-uyeol-mob" style={{ color: "#ffffff", background: "var(--navy)" }}>
              Kurucu üye ol · 149 ₺/ay
            </a>
          </div>
        </nav>

        <div className="nav-cta">
          <AppLink className="btn btn-ghost desktop-login-btn" href="/giris" data-cta="nav-giris">
            Giriş yap
          </AppLink>
          <a className="btn btn-primary nav-primary-btn" href="#fiyat" data-cta="nav-uyeol">
            Kurucu üye ol
          </a>
          <button
            type="button"
            className={`burger ${open ? "active" : ""}`}
            id="burger"
            aria-label="Menüyü aç/kapat"
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
