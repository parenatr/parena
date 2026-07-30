import type { ReactNode } from "react";

import { AuthHeader } from "@/components/auth/AuthHeader";
import { ParenaMark } from "@/components/brand/ParenaMark";

type AuthCardProps = {
  title: string;
  hint?: string;
  children: ReactNode;
  footer?: ReactNode;
};

/** Keycloak tarzı ortalanmış kimlik doğrulama kartı + sade auth header. */
export function AuthCard({ title, hint, children, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AuthHeader />

      <main className="flex flex-1 items-center justify-center p-5">
        <div className="w-[410px] max-w-full overflow-hidden rounded-[14px] border border-divider bg-surface shadow-card">
          <div className="px-[34px] pb-1.5 pt-7 text-center">
            <ParenaMark size={52} className="mx-auto" />
          </div>

          <div className="px-[34px] pb-[30px] pt-[22px]">
            <h1 className="mb-[22px] text-center font-display text-[17px] font-semibold text-brand">
              {title}
            </h1>

            {hint ? (
              <p className="-mt-1 mb-[18px] text-xs leading-relaxed text-muted-foreground">
                {hint}
              </p>
            ) : null}

            {children}

            {footer ? (
              <div className="mt-5 border-t border-divider pt-[18px] text-center text-[13px] text-muted-foreground">
                {footer}
              </div>
            ) : null}
          </div>

          <div className="border-t border-divider bg-background px-[34px] py-3 text-center text-[10.5px] text-muted-foreground">
            🔒 Kimlik doğrulama Keycloak ile güvenli şekilde sağlanır
          </div>
        </div>
      </main>
    </div>
  );
}
