import { AppLink } from "@/components/ui/app-link";

const LINKS = [
  { href: "/", label: "Ana sayfa" },
  { href: "/kullanim-sartlari", label: "Kullanım şartları" },
  { href: "/gizlilik", label: "Gizlilik politikası" },
  { href: "/kvkk", label: "KVKK aydınlatma metni" },
  { href: "/mesafeli-satis", label: "Mesafeli satış sözleşmesi" },
  { href: "/cerez", label: "Çerez politikası" },
];

/**
 * Hukuki sayfaların sade footer'ı – kaynak HTML tasarımıyla birebir.
 * Stilleri `legal.css` içinde `.legal-page footer` altında kapsüllenmiştir.
 */
export function LegalFooter() {
  return (
    <footer>
      <div className="wrap">
        <nav className="flinks" aria-label="Yasal bağlantılar">
          {LINKS.map((l) => (
            <AppLink key={l.href} href={l.href}>
              {l.label}
            </AppLink>
          ))}
          <a href="mailto:destek@parena.com.tr">destek@parena.com.tr</a>
        </nav>
        <p className="fnote">
          <b>Yasal Uyarı / Çekince:</b> PARENA'da yer alan tüm veriler, SPK lisanslı aracı
          kurumların kamuya açık olarak yayınladığı araştırma raporlarından derlenmiş olup yalnızca
          bilgilendirme amaçlıdır. Burada yer alan hiçbir içerik yatırım danışmanlığı kapsamında
          değildir. Görüş ve tavsiyeler bunları yayınlayan aracı kurumlara aittir. Geçmiş performans
          verileri geleceğe yönelik sonuçların garantisi değildir.
        </p>
        <p className="fnote fnote-copy">© {new Date().getFullYear()} PARENA · parena.com.tr</p>
      </div>
    </footer>
  );
}
