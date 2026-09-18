import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { onRemoteLogout } from "./features/auth/auth-broadcast";
import { AppRouter } from "./router/AppRouter";

/**
 * App.tsx
 * Asıl uygulama
 * Fast Refresh kuralı aktif
 *
 * Uygulama kabuğu.
 * Mimari: React -> react-router-dom -> Pages
 *         React Components -> React Query -> API Client -> BFF
 */
export default function App() {
  // QueryClient bileşen ömrü boyunca tek örnek kalsın (StrictMode remount güvenli).
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
        },
      }),
  );

  // Başka bir sekmede logout olduğunda bu sekme de senkronize olur
  // (multi-tab senkronizasyonu). ÖNEMLİ: `broadcastLogout()` logout formunun
  // `form.submit()`'inden (asıl POST, session'ı sonlandıran istek) ÖNCE
  // çağrılıyor — yani bu sinyal diğer sekmelere ulaştığında Keycloak SSO
  // session'ı ve BFF Redis session'ı hâlâ TAMAMEN canlı olabilir. Bu yüzden
  // burada `getLoginRedirectUrl()` (Keycloak'a yeni bir OAuth2 authorization
  // isteği başlatan `/oauth2/authorization/keycloak` redirect'i) KULLANILAMAZ:
  // SSO session hâlâ canlıyken bu istek Keycloak tarafından sessizce (login
  // prompt'u göstermeden) yeniden authenticate edilir ve diğer sekme taze bir
  // `__Host-session` ile tekrar login olmuş hâle gelir — logout'un amacını
  // tam tersine çevirir. `/giris` (AppRouter'daki LoginRoute) da aynı
  // redirect'i tetiklediği için o da güvenli değil. Bunun yerine SPA'nın kendi
  // kök route'una ("/") gidilir — bu route React tarafında render edilir,
  // hiçbir redirect BAŞLATMAZ; sonraki `/api/auth/me` çağrısı zaten
  // unauthenticated dönecektir çünkü bu noktada gerçek logout tamamlanmış olur.
  useEffect(() => {
    return onRemoteLogout(() => {
      queryClient.clear();
      window.location.href = "/";
    });
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
