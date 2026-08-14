import { useState, useEffect } from "react";
import { AppLink } from "@/components/ui/app-link";
import { ParenaMark } from "@/components/brand/ParenaMark";
import { useSession } from "@/features/auth/auth.queries";
import { logout } from "@/features/auth/auth.api"; // Doğrudan API fonksiyonunu içe aktarıyoruz

const LINKS = [
  { href: "#nasil", label: "Nasıl çalışır?" },
  { href: "#ozellikler", label: "Özellikler" },
  { href: "#karne", label: "Karne" },
  { href: "#fiyat", label: "Fiyat" },
  { href: "#sss", label: "SSS" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isLoading } = useSession();

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 980 && open) {
        setOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  function AuthAction({ variant }: { variant: "desktop" | "mobile" }) {
    if (isLoading) return null; // Session sorgusu dönene kadar flicker önleme

    if (isAuthenticated) {
      return (
        <button
          type="button"
          className={variant === "desktop" ? "btn btn-ghost desktop-login-btn" : "btn btn-ghost"}
          onClick={() => logout()} // React Query mutation yerine doğrudan tam sayfa yönlendiren logout'u çağırıyoruz
          data-cta={variant === "desktop" ? "nav-cikis" : "nav-cikis-mob"}
        >
          Çıkış yap
        </button>
      );
    }

    return (
      <AppLink
        className={variant === "desktop" ? "btn btn-ghost desktop-login-btn" : "btn btn-ghost"}
        href="/giris"
        data-cta={variant === "desktop" ? "nav-giris" : "nav-giris-mob"}
      >
        Giriş yap
      </AppLink>
    );
  }

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
          <div className="mob-menu-actions">
            <AuthAction variant="mobile" />
            <a className="btn btn-primary" href="#fiyat" data-cta="nav-uyeol-mob" style={{ color: "#ffffff", background: "var(--navy)" }}>
              Kurucu üye ol · 149 ₺/ay
            </a>
          </div>
        </nav>

        <div className="nav-cta">
          <AuthAction variant="desktop" />
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