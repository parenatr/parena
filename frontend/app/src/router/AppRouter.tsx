import type { ComponentType } from "react";
import { Route, Routes, useSearchParams, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { useDocumentMeta, type PageMeta } from "@/hooks/use-document-meta";
import { ROUTES } from "@/router/routes";
import CheckoutPage, { checkoutPageMeta } from "@/pages/Checkout/CheckoutPage";
import LaunchPage, { launchPageMeta } from "@/pages/Launch/LaunchPage";
import NotFoundPage, { notFoundPageMeta } from "@/pages/NotFound/NotFoundPage";
import CerezPage, { cerezPageMeta } from "@/pages/Legal/CerezPage";
import GizlilikPage, { gizlilikPageMeta } from "@/pages/Legal/GizlilikPage";
import KullanimSartlariPage, {
  kullanimSartlariPageMeta,
} from "@/pages/Legal/KullanimSartlariPage";
import KvkkPage, { kvkkPageMeta } from "@/pages/Legal/KvkkPage";
import MesafeliSatisPage, { mesafeliSatisPageMeta } from "@/pages/Legal/MesafeliSatisPage";
import RegisterPage, { registerPageMeta } from "@/pages/Register/RegisterPage";
import { getLoginRedirectUrl } from "@/features/auth/auth.api";

/** Sayfayı meta yönetimiyle sarmalar. */
function withMeta(Page: ComponentType, meta: PageMeta) {
  return function MetaBoundPage() {
    useDocumentMeta(meta);
    return <Page />;
  };
}

function LoginRoute() {
  useEffect(() => {
    window.location.href = getLoginRedirectUrl();
  }, []);
  return null;
}

const LaunchRoute = withMeta(LaunchPage, launchPageMeta);
function RegisterRoute() {
  const [params] = useSearchParams();

  const rawPlan = params.get("plan");

  // Geçersiz veya eksik parametrelerde ücretsiz akışa dön.
  const plan = rawPlan === "premium" ? "premium" : "ucretsiz";

  useDocumentMeta(registerPageMeta);

  return <RegisterPage plan={plan} />;
}

const CheckoutRoute = withMeta(CheckoutPage, checkoutPageMeta);
const CerezRoute = withMeta(CerezPage, cerezPageMeta);
const GizlilikRoute = withMeta(GizlilikPage, gizlilikPageMeta);
const KullanimSartlariRoute = withMeta(KullanimSartlariPage, kullanimSartlariPageMeta);
const KvkkRoute = withMeta(KvkkPage, kvkkPageMeta);
const MesafeliSatisRoute = withMeta(MesafeliSatisPage, mesafeliSatisPageMeta);
const NotFoundRoute = withMeta(NotFoundPage, notFoundPageMeta);

/** Uygulamanın tek yönlendirme merkezi. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Eğer URL'de bir hash (#m3 vb.) varsa, elementin DOM'a yüklenmesini bekleyip oraya kaydır
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, hash]);

  return null;
}

export function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path={ROUTES.home} element={<LaunchRoute />} />
        <Route path={ROUTES.login} element={<LoginRoute />} />
        <Route path={ROUTES.register} element={<RegisterRoute />} />
        <Route path={ROUTES.checkout} element={<CheckoutRoute />} />
        <Route path={ROUTES.cerez} element={<CerezRoute />} />
        <Route path={ROUTES.gizlilik} element={<GizlilikRoute />} />
        <Route path={ROUTES.kullanimSartlari} element={<KullanimSartlariRoute />} />
        <Route path={ROUTES.kvkk} element={<KvkkRoute />} />
        <Route path={ROUTES.mesafeliSatis} element={<MesafeliSatisRoute />} />
        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </>
  );
}

export default AppRouter;
