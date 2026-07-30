import { Link, useNavigate } from "react-router-dom";

import { ParenaLogo } from "@/components/brand/ParenaLogo";
import { ParenaButton } from "@/components/ui/parena-button";
import { useLogout, useSession } from "@/features/auth/auth.queries";

const SECTIONS = [
  { label: "Özellikler", href: "#ozellikler" },
  { label: "Karne", href: "#karne" },
  { label: "Fiyat", href: "#fiyat" },
  { label: "SSS", href: "#sss" },
];

export function SiteNav() {
  const { user, isAuthenticated } = useSession();
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      navigate("/", { replace: true });
    }
  }

  return (
    <nav className="sticky top-0 z-10 border-b border-divider bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-[62px] max-w-[1080px] items-center justify-between px-6">
        <ParenaLogo />

        <div className="flex items-center gap-[26px] text-[13.5px]">
          {SECTIONS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hidden font-medium text-muted-foreground no-underline hover:text-brand md:inline"
            >
              {item.label}
            </a>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-[13px] font-semibold text-brand sm:inline">
                {user?.firstName ?? user?.email}
              </span>
              <ParenaButton
                variant="ghost"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                Çıkış yap
              </ParenaButton>
            </div>
          ) : (
            <div className="group relative outline-none" tabIndex={0}>
              <Link to="/giris">
                <ParenaButton>Giriş yap</ParenaButton>
              </Link>

              <div className="invisible absolute right-0 top-[calc(100%+8px)] z-20 min-w-[150px] -translate-y-1.5 rounded-[10px] border border-divider bg-surface p-1.5 opacity-0 shadow-drop transition-[opacity,transform,visibility] duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <span className="pointer-events-auto absolute inset-x-0 -top-2 h-2" />
                <Link
                  to="/giris"
                  className="block whitespace-nowrap rounded-[7px] px-3.5 py-2.5 text-[13.5px] font-semibold text-brand no-underline transition-colors hover:bg-background"
                >
                  Giriş yap
                </Link>
                <Link
                  to="/uye-ol"
                  className="block whitespace-nowrap rounded-[7px] px-3.5 py-2.5 text-[13.5px] font-semibold text-brand no-underline transition-colors hover:bg-background"
                >
                  Üye ol
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
