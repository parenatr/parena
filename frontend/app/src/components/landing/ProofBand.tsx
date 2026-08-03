import { PROOF_STATS } from "@/data/landing";

export function ProofBand() {
  return (
    <section id="karne" className="mx-auto max-w-270 px-6 py-16">
      <div className="rounded-[22px] bg-linear-to-br from-deep to-brand px-8 py-13 text-center text-brand-foreground">
        <h2 className="mb-2 text-[21px] text-brand-foreground">
          Her öneri, sonucuyla birlikte
        </h2>
        <p className="mb-6 text-sm opacity-85">
          Her akşam 18:10'da tüm gün içi öneriler kapanış verisiyle otomatik kontrol edilir
          ve karne kesinleşir.
        </p>
        <div className="flex flex-wrap justify-center gap-13">
          {PROOF_STATS.map((stat) => (
            <div key={stat.label}>
              <div className="font-tabular text-[32px] font-bold text-gold">{stat.n}</div>
              <div className="text-[11.5px] tracking-[.5px] opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
