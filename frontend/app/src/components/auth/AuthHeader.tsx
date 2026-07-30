import { Link } from "react-router-dom";

import { ParenaMark } from "@/components/brand/ParenaMark";

/**
 * Kurumsal auth standardı: form ekranlarında tam navbar yerine
 * yalnızca anasayfaya dönen tıklanabilir logo + tek geri bağlantısı.
 * Odak formda kalır, çıkış yolu her zaman görünür durumdadır.
 */
export function AuthHeader() {
  return (
    <header className="w-full border-b border-divider bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-[62px] max-w-[1080px] items-center justify-between px-6">
        <Link
          to="/"
          aria-label="PARENA anasayfa"
          className="flex items-center gap-2.5 no-underline"
        >
          <ParenaMark size={34} />
          <span className="font-display text-[17px] font-bold tracking-[.5px] text-foreground">
            PAR<span className="text-brand">ENA</span>
          </span>
        </Link>

        <Link
          to="/"
          className="text-[13px] font-semibold text-muted-foreground no-underline transition-colors hover:text-brand"
        >
          ← Anasayfaya dön
        </Link>
      </div>
    </header>
  );
}
