import type { ComponentType } from "react";
import { Navigate, Route, Routes, useSearchParams } from "react-router-dom";

import { useDocumentMeta, type PageMeta } from "@/hooks/use-document-meta";
import CheckoutPage, { checkoutPageMeta } from "@/pages/Checkout/CheckoutPage";
import ForgotPasswordPage, {
  forgotPasswordPageMeta,
} from "@/pages/ForgotPassword/ForgotPasswordPage";
import LaunchPage, { launchPageMeta } from "@/pages/Launch/LaunchPage";
import CerezPage, { cerezPageMeta } from "@/pages/Legal/CerezPage";
import GizlilikPage, { gizlilikPageMeta } from "@/pages/Legal/GizlilikPage";
import KullanimSartlariPage, {
  kullanimSartlariPageMeta,
} from "@/pages/Legal/KullanimSartlariPage";
import KvkkPage, { kvkkPageMeta } from "@/pages/Legal/KvkkPage";
import MesafeliSatisPage, { mesafeliSatisPageMeta } from "@/pages/Legal/MesafeliSatisPage";
import LoginPage, { loginPageMeta } from "@/pages/Login/LoginPage";
import RegisterPage, { registerPageMeta } from "@/pages/Register/RegisterPage";
import ResetPasswordPage, { resetPasswordPageMeta } from "@/pages/ResetPassword/ResetPasswordPage";

/** Sayfayı meta yönetimiyle sarmalar (TanStack `head()` karşılığı). */
function withMeta(Page: ComponentType, meta: PageMeta) {
  return function MetaBoundPage() {
    useDocumentMeta(meta);
    return <Page />;
  };
}

/** Sadece uygulama içi (relative) yollara izin ver — open redirect koruması. */
function safeRedirect(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

function LoginRoute() {
  useDocumentMeta(loginPageMeta);
  const [params] = useSearchParams();
  return <LoginPage redirectTo={safeRedirect(params.get("redirect"))} />;
}

function ResetPasswordRoute() {
  useDocumentMeta(resetPasswordPageMeta);
  const [params] = useSearchParams();
  return <ResetPasswordPage token={params.get("token") ?? undefined} />;
}

const LaunchRoute = withMeta(LaunchPage, launchPageMeta);
const RegisterRoute = withMeta(RegisterPage, registerPageMeta);
const ForgotPasswordRoute = withMeta(ForgotPasswordPage, forgotPasswordPageMeta);
const CheckoutRoute = withMeta(CheckoutPage, checkoutPageMeta);
const CerezRoute = withMeta(CerezPage, cerezPageMeta);
const GizlilikRoute = withMeta(GizlilikPage, gizlilikPageMeta);
const KullanimSartlariRoute = withMeta(KullanimSartlariPage, kullanimSartlariPageMeta);
const KvkkRoute = withMeta(KvkkPage, kvkkPageMeta);
const MesafeliSatisRoute = withMeta(MesafeliSatisPage, mesafeliSatisPageMeta);

/** Uygulamanın tek yönlendirme merkezi. */
export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LaunchRoute />} />
      <Route path="/giris" element={<LoginRoute />} />
      <Route path="/uye-ol" element={<RegisterRoute />} />
      <Route path="/sifremi-unuttum" element={<ForgotPasswordRoute />} />
      <Route path="/sifre-sifirla" element={<ResetPasswordRoute />} />
      <Route path="/odeme" element={<CheckoutRoute />} />
      <Route path="/cerez" element={<CerezRoute />} />
      <Route path="/gizlilik" element={<GizlilikRoute />} />
      <Route path="/kullanim-sartlari" element={<KullanimSartlariRoute />} />
      <Route path="/kvkk" element={<KvkkRoute />} />
      <Route path="/mesafeli-satis" element={<MesafeliSatisRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
