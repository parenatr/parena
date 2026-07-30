import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Kart altındaki metin bağlantısı. */
export function AuthLink({
  to,
  children,
  className,
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn("font-semibold text-brand no-underline hover:underline", className)}
    >
      {children}
    </Link>
  );
}
