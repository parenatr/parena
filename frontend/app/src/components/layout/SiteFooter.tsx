import { AppLink } from "@/components/ui/app-link";

import "./site-footer.css";


const SOCIALS = [
  {
    href: "https://x.com/parena_official",
    label: "PARENA X (Twitter) hesabı",
    cta: "social-x",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.11z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/parena_official",
    label: "PARENA Instagram hesabı",
    cta: "social-ig",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "https://t.me/parena_official",
    label: "PARENA Telegram kanalı",
    cta: "social-tg",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.7 4.1 2.9 11.3c-1 .4-1 1.8.1 2.1l4.7 1.5 1.8 5.5c.3.8 1.3 1 1.9.4l2.6-2.5 4.6 3.4c.7.5 1.7.1 1.9-.7l3-14.2c.2-1-.8-1.9-1.8-1.5zM8.9 14.2l9-5.6-7.4 6.6-.3 3.4z" />
      </svg>
    ),
  },
];

const LEGAL_LINKS = [
  { href: "/kullanim-sartlari", label: "Kullanım şartları" },
  { href: "/gizlilik", label: "Gizlilik politikası" },
  { href: "/kvkk", label: "KVKK aydınlatma metni" },
  { href: "/mesafeli-satis", label: "Mesafeli satış sözleşmesi" },
  { href: "/cerez", label: "Çerez politikası" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="sf-wrap">
        <div className="sf-grid">
          <div className="sf-col">
            <span className="sf-brand-name">
              PAR<em>ENA</em>
            </span>
            <span className="sf-brand-tag">
              Portföy Arena<i>Paranın Arenası</i>
            </span>
            <p className="sf-desc">
              SPK lisanslı aracı kurumların borsa önerilerini derleyen, karşılaştıran ve
              sonuçlarını doğrulayan portföy analiz platformu.
            </p>
            <div className="sf-social" aria-label="PARENA sosyal medya hesapları">
              {SOCIALS.map((s) => (
                <a
                  key={s.cta}
                  href={s.href}
                  target="_blank"
                  rel="noopener me"
                  aria-label={s.label}
                  data-cta={s.cta}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="sf-col">
            <h4>Ürün</h4>
            <ul>
              <li><AppLink href="/#ozellikler">Borsa önerileri</AppLink></li>
              <li><AppLink href="/#ozellikler">Portföy takibi</AppLink></li>
              <li><AppLink href="/#karne">Kurum karnesi</AppLink></li>
              <li><AppLink href="/#ozellikler">Sektör analizi</AppLink></li>
              <li><AppLink href="/#ozellikler">Model portföyler</AppLink></li>
              <li><AppLink href="/#ozellikler">Simülatör</AppLink></li>
              <li><AppLink href="/#fiyat">Fiyatlandırma</AppLink></li>
            </ul>
          </div>

          <div className="sf-col">
            <h4>Destek</h4>
            <ul>
              <li><AppLink href="/#sss">Sık sorulan sorular</AppLink></li>
              <li><AppLink href="/#karne">Karne yöntemi</AppLink></li>
              <li><a href="mailto:destek@parena.com.tr">destek@parena.com.tr</a></li>
              <li>
                <a href="https://t.me/parena_official" target="_blank" rel="noopener">
                  Telegram topluluğu
                </a>
              </li>
            </ul>
          </div>

          <div className="sf-col">
            <h4>Yasal</h4>
            <ul>
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <AppLink href={l.href}>{l.label}</AppLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="sf-legal">
          <b>Yasal Uyarı / Çekince:</b> PARENA'da yer alan tüm veriler, SPK lisanslı aracı
          kurumların kamuya açık olarak yayınladığı araştırma raporlarından derlenmiş olup
          yalnızca bilgilendirme amaçlıdır. Burada yer alan hiçbir içerik yatırım danışmanlığı
          kapsamında değildir. Yatırım danışmanlığı hizmeti, yetkili kuruluşlar ile imzalanacak
          yatırım danışmanlığı sözleşmesi çerçevesinde sunulur. Görüş ve tavsiyeler bunları
          yayınlayan aracı kurumlara aittir; PARENA kendi adına hiçbir alım-satım önerisi veya
          derecelendirme üretmez. Simülasyon ve geçmiş performans verileri geleceğe yönelik
          sonuçların garantisi değildir. Yatırım kararlarınızın sorumluluğu tamamen size aittir.
          Ayrıntılı hükümler için{" "}
          <AppLink href="/kullanim-sartlari">Kullanım Şartları</AppLink>'na bakınız.
        </p>

        <div className="sf-bottom">
          <span>© {new Date().getFullYear()} PARENA. Tüm hakları saklıdır.</span>
          <span>parena.com.tr · İstanbul, Türkiye</span>
        </div>
      </div>
    </footer>
  );
}

