import { PRICE_FEATURES } from "@/data/landing";
import { ParenaButton } from "@/components/ui/parena-button";
import { Link } from "react-router-dom";

export function Pricing() {
  return (
    <section id="fiyat" className="mx-auto `max-w-270` px-6 py-16">
      <h2 className="text-center text-2xl">Tek plan, şeffaf fiyat</h2>
      <p className="mb-13 mt-2 text-center text-[14.5px] text-muted-foreground">
        Tek plan, net fiyat. Sürpriz yok.
      </p>

      <div className="mx-auto mt-12 max-w-107.5 rounded-[20px] border-t-[3px] border-brand bg-surface px-9 py-9 text-center shadow-brand">
        <span className="mb-3.5 inline-block rounded-full bg-[rgba(232,169,61,0.15)] px-3 py-1 text-[11px] font-bold text-[#B07E1E]">
          KURUCU ÜYE · İLK 150 KİŞİ
        </span>
        <div className="font-tabular text-[40px] font-bold leading-tight">
          ₺149<small className="text-[15px] font-medium text-muted-foreground">/ ay</small>
        </div>
        <div className="mb-3  text-[11px] text-muted-foreground">
          veya <strong>1.490 ₺</strong> / yıl
        </div>
        <div className="my-6 text-left text-[13.5px] text-muted-foreground">
          {PRICE_FEATURES.map((item) => (
            <div key={item} className="py-1.5">
              ✓ {item}
            </div>
          ))}
        </div>
        <Link to="/uye-ol" className="block">
          <ParenaButton className="w-full">
            Üye Ol
          </ParenaButton>
        </Link>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Kontenjan dolduğunda standart fiyat ₺249 / ay olur.
        </p>
      </div>
    </section>
  );
}
