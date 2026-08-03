import { YESTERDAY_KARNE } from "@/data/karne";

export function KarneCard() {
  return (
    <section className="rounded-[18px] border-t-[3px] border-gold bg-surface p-5.5 shadow-brand">
      <h3 className="mb-1 text-[15px]">Dünün Karnesi · Gün İçi Öneriler</h3>
      <p className="mb-4 text-xs text-muted-foreground">
        18:10 kapanış kontrolüyle kesinleşti
      </p>

      {YESTERDAY_KARNE.map((row) => (
        <div
          key={row.ticker}
          className="flex items-center justify-between gap-3 border-b border-divider py-2.25 text-[12.5px] last:border-b-0"
        >
          <span className="font-tabular">
            <b>{row.ticker}</b> · {row.broker}
          </span>
          <span className="font-tabular">{row.range}</span>
          <span
            className={`whitespace-nowrap rounded-full px-2 py-0.75 text-[10.5px] font-bold ${
              row.hit ? "bg-buy/12 text-buy" : "bg-sell/12 text-sell"
            }`}
          >
            {row.hit ? "✓ GERÇEKLEŞTİ" : "✗ GERÇEKLEŞMEDİ"}
          </span>
        </div>
      ))}

      <p className="mt-3 text-xs text-muted-foreground">
        Dün 12 öneriden <b className="text-buy">8'i hedefini gördü</b> · her sonuç kaynak
        PDF'ine bağlı
      </p>
    </section>
  );
}
