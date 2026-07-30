import { TELEGRAM_URL } from "@/data/landing";

const SOCIALS = [
  {
    title: "Telegram",
    href: TELEGRAM_URL,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.9 4.6 18.7 19.7c-.2 1-.9 1.2-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.2-8.3c.4-.4-.1-.6-.6-.2L6.2 13.3 1.3 11.8c-1-.3-1-1 .2-1.5L20.5 3.1c.9-.3 1.7.2 1.4 1.5z" />
      </svg>
    ),
  },
  {
    title: "X (Twitter)",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.9 2H22l-6.8 7.8L23.3 22h-6.3l-4.9-6.4L6.5 22H3.4l7.3-8.4L1 2h6.5l4.4 5.9L18.9 2zm-1.1 18.1h1.7L7.6 3.8H5.7l12.1 16.3z" />
      </svg>
    ),
  },
  {
    title: "Instagram",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-divider py-9 text-[11.5px] text-muted-foreground">
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="mb-[18px] flex gap-3.5">
          {SOCIALS.map((social) => (
            <a
              key={social.title}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              title={social.title}
              aria-label={social.title}
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-brand text-brand-foreground transition-colors hover:bg-deep"
            >
              {social.icon}
            </a>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap gap-5">
          <a href="#" className="text-deep no-underline hover:underline">
            Kullanım Şartları
          </a>
          <a href="#" className="text-deep no-underline hover:underline">
            KVKK Aydınlatma Metni
          </a>
          <a
            href="mailto:destek@parena.com.tr"
            className="text-deep no-underline hover:underline"
          >
            İletişim
          </a>
        </div>

        <p>
          <b>Yasal Uyarı:</b> PARENA'da yer alan tüm veriler, SPK lisanslı aracı kurumların
          kamuya açık raporlarından derlenmiş olup yalnızca bilgilendirme amaçlıdır; yatırım
          danışmanlığı kapsamında değildir. Görüş ve tavsiyeler bunları yayınlayan kurumlara
          aittir. Simülasyon ve geçmiş performans verileri geleceğe yönelik sonuçların
          garantisi değildir. Bilgilere dayanılarak verilecek yatırım kararlarının
          sorumluluğu kullanıcıya aittir. © 2026 PARENA
        </p>
      </div>
    </footer>
  );
}
