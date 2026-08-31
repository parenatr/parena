import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { KcPage, type KcContext } from "./keycloak-theme/kc.gen";

/**
 * main.tsx
 * Uygulamayı başlatır
 * Keycloak context kontrolü yapar
 * App'i lazy-load eder
 * Component export etmez
 */
const LazyApp = lazy(() => import("./main.app"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {window.kcContext ? (
      <KcPage kcContext={window.kcContext} />
    ) : (
      <Suspense>
        <LazyApp />
      </Suspense>
    )}
  </StrictMode>,
);

declare global {
  interface Window {
    kcContext?: KcContext;
  }
}
