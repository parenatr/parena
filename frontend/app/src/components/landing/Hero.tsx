import { ParenaButton } from "@/components/ui/parena-button";
import { TELEGRAM_URL } from "@/data/landing";

export function Hero() {
  return (
    <div>
      <p className="mb-1 font-display text-xl font-bold uppercase tracking-[3px] text-gold">
        Portföy Arena
      </p>
      <p className="mb-3.5 text-xs font-semibold uppercase tracking-[2.6px] text-muted-foreground">
        Paranın Arenası
      </p>
      <h1 className="mb-[18px] max-w-[22ch] text-[32px] md:text-[38px]">
        Günlük hisse önerileri,
        <br />
        tek ekranda.
      </h1>
      <p className="mb-7 max-w-[46ch] text-base text-muted-foreground">
        Aracı kurumların sabah bültenlerindeki öneriler bir arada. Kaynağıyla, arşiviyle,
        her akşam kendiliğinden netleşen karnesiyle. Sen sadece kahveni al, gel.
      </p>
      <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="inline-block">
        <ParenaButton>Davet İste</ParenaButton>
      </a>
    </div>
  );
}
