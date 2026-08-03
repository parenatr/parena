import { Link } from "react-router-dom";
import { ParenaMark } from "./ParenaMark";

/** Nav'da kullanılan logo: amblem + PARENA kelime markası + slogan. */
export function ParenaLogo() {
  return (
    <Link
      to="/"
      className="flex min-w-0 items-center gap-2 text-foreground no-underline sm:gap-2.75"
    >
      <ParenaMark
        size={60}
        className="h-9 w-9 shrink-0 drop-shadow-[0_4px_8px_rgba(19,41,75,.35)] sm:h-11.5 sm:w-11.5 lg:h-15 lg:w-15"
      />
      <span className="block min-w-0 leading-[1.05]">
        <span className="block truncate font-display text-[19px] font-bold tracking-[.5px] text-foreground sm:text-[24px] lg:text-[29px]">
          PAR<span className="text-brand">ENA</span>
        </span>
        <span className="mt-0.5 hidden truncate text-[11px] font-semibold uppercase tracking-[1.6px] text-muted-foreground sm:block lg:text-[14px] lg:tracking-[2.2px]">
          Paranın Arenası
        </span>
      </span>
    </Link>
  );
}
