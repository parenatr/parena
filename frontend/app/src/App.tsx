import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { AppRouter } from "./router/AppRouter";

/**
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

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
