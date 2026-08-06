import { Link } from "react-router-dom";

import { ParenaMark } from "@/components/brand/ParenaMark";

/**
 * Kurumsal auth standardı: form ekranlarında tam navbar yerine
 * yalnızca anasayfaya dönen tıklanabilir logo + tek geri bağlantısı.
 */
export function AuthHeader() {
  return (
    <header className="w-full border-b border-divider bg-background/90 backdrop-blur-md">
      <div className="mx-auto grid h-[58px] max-w-[1080px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:h-[62px] sm:px-6">
        <Link
          to="/"
          aria-label="PARENA anasayfa"
          className="flex min-w-0 items-center gap-2.5 no-underline"
        >
          <ParenaMark size={34} className="h-8 w-8 shrink-0 sm:h-[34px] sm:w-[34px]" />
          <span className="truncate font-display text-[15px] font-bold tracking-[.5px] text-foreground sm:text-[17px]">
            PAR<span className="text-brand">ENA</span>
          </span>
        </Link>

        <Link
          to="/"
          className="shrink-0 whitespace-nowrap text-[12px] font-semibold text-muted-foreground no-underline transition-colors hover:text-brand sm:text-[13px]"
        >
          ← Anasayfaya dön
        </Link>
      </div>
    </header>
  );
}
