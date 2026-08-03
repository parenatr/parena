import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";

import { ParenaLogo } from "@/components/brand/ParenaLogo";
import { ParenaButton } from "@/components/ui/parena-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // BFF hatası oturumu istemcide düşürmemizi engellememeli.
    } finally {
      setMenuOpen(false);
      navigate("/", { replace: true });
    }
  }

  return (
    <nav className="sticky top-0 z-10 border-b border-divider bg-background/90 backdrop-blur-md">
      <div className="mx-auto grid h-14.5 max-w-270 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:h-15.5 sm:px-6">
        <ParenaLogo />

        <div className="flex shrink-0 items-center gap-3 text-[13.5px] sm:gap-4 lg:gap-6.5">
          {SECTIONS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hidden font-medium text-muted-foreground no-underline hover:text-brand lg:inline"
            >
              {item.label}
            </a>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden max-w-35 truncate text-[13px] font-semibold text-brand sm:inline">
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
            <>
              {/* Masaüstü: hover ile açılan giriş/üye ol menüsü */}
              <div className="group relative hidden outline-none md:block" tabIndex={0}>
                <ParenaButton asChild>
                  <Link to="/giris">Giriş yap</Link>
                </ParenaButton>

                <div className="invisible absolute right-0 top-[calc(100%+8px)] z-20 min-w-37.5 -translate-y-1.5 rounded-[10px] border border-divider bg-surface p-1.5 opacity-0 shadow-drop transition-[opacity,transform,visibility] duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
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

              {/* Mobil: tek CTA */}
              <ParenaButton asChild className="md:hidden">
                <Link to="/giris">Giriş yap</Link>
              </ParenaButton>
            </>
          )}

          {/* Mobil / tablet menü */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              aria-label="Menüyü aç"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-divider bg-surface text-brand transition-colors hover:bg-background lg:hidden"
            >
              <Menu className="h-4.5 w-4.5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-70 bg-surface">
              <SheetHeader>
                <SheetTitle className="text-left font-display text-[15px] text-brand">
                  Menü
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-1">
                {SECTIONS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-semibold text-brand no-underline transition-colors hover:bg-background"
                  >
                    {item.label}
                  </a>
                ))}

                <div className="mt-4 border-t border-divider pt-4">
                  {isAuthenticated ? (
                    <ParenaButton
                      size="block"
                      variant="ghost"
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      Çıkış yap
                    </ParenaButton>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <ParenaButton asChild size="block">
                        <Link to="/giris" onClick={() => setMenuOpen(false)}>
                          Giriş yap
                        </Link>
                      </ParenaButton>
                      <ParenaButton asChild size="block" variant="ghost" className="border border-brand text-brand hover:bg-brand/5">
                        <Link to="/uye-ol" onClick={() => setMenuOpen(false)}>
                          Üye ol
                        </Link>
                      </ParenaButton>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
