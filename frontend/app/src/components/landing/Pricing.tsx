import { PRICE_FEATURES, TELEGRAM_URL } from "@/data/landing";
import { ParenaButton } from "@/components/ui/parena-button";

export function Pricing() {
  return (
    <section id="fiyat" className="mx-auto max-w-[1080px] px-6 py-16">
      <h2 className="text-center text-2xl">Tek plan, şeffaf fiyat</h2>
      <p className="mb-13 mt-2 text-center text-[14.5px] text-muted-foreground">
        Davetle katılınır. Tek plan, net fiyat — sürpriz yok.
      </p>

      <div className="mx-auto mt-12 max-w-[430px] rounded-[20px] border-t-[3px] border-brand bg-surface px-9 py-9 text-center shadow-brand">
        <span className="mb-3.5 inline-block rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold text-gold">
          KURUCU ÜYE · İLK 150 KİŞİ
        </span>
        <div className="font-tabular text-[44px] font-bold leading-tight">
          149 ₺<small className="text-[15px] font-medium text-muted-foreground">/ay</small>
        </div>
        <div className="my-6 text-left text-[13.5px] text-muted-foreground">
          {PRICE_FEATURES.map((item) => (
            <div key={item} className="py-1.5">
              ✓ {item}
            </div>
          ))}
        </div>
        <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="block">
          <ParenaButton className="w-full">Telegram'dan Davet İste</ParenaButton>
        </a>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Kontenjan dolduğunda standart fiyat 249 ₺/ay olur.
        </p>
      </div>
    </section>
  );
}
