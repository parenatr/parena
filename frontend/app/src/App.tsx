import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { getLoginRedirectUrl } from "./features/auth/auth.api";
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

  // Başka bir sekmede logout olduğunda bu sekme de aynı şekilde kapanır
  // (multi-tab senkronizasyonu) — login sayfası React tarafında render
  // edilmediği için (bkz. AppRouter, /giris zaten window.location.href ile
  // Keycloak'a redirect ediyor) doğrudan aynı redirect kullanılır.
  useEffect(() => {
    return onRemoteLogout(() => {
      queryClient.clear();
      window.location.href = getLoginRedirectUrl();
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
