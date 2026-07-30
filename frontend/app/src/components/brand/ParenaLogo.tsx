import { Link, useNavigate } from "react-router-dom";

import { ParenaMark } from "./ParenaMark";

/** Nav'da kullanılan logo: amblem + PARENA kelime markası + slogan. */
export function ParenaLogo() {
  return (
    <Link to="/" className="flex items-center gap-[11px] text-foreground no-underline">
      <ParenaMark size={60} className="drop-shadow-[0_4px_8px_rgba(19,41,75,.35)]" />
      <span className="block leading-[1.05]">
        <span className="block font-display text-[29px] font-bold tracking-[.5px] text-foreground">
          PAR<span className="text-brand">ENA</span>
        </span>
        <span className="mt-[2px] block text-[14px] font-semibold uppercase tracking-[2.2px] text-muted-foreground">
          Paranın Arenası
        </span>
      </span>
    </Link>
  );
}
