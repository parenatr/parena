import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, type FormEvent } from "react";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthLink } from "@/components/auth/AuthLink";
import { ParenaButton } from "@/components/ui/parena-button";
import { TextField } from "@/components/ui/text-field";
import { useLogin } from "@/features/auth/auth.queries";
import { useSubmitFeedback } from "@/hooks/use-submit-feedback";
import { isValidEmail, isValidPassword, normalizeEmail } from "@/lib/auth-validation";
import { toUserMessage } from "@/lib/http/api-error";

import "./LoginPage.css";
import { useDocumentMeta } from "@/hooks/use-document-meta";

export const loginPageMeta = {
  title: "PARENA — Giriş Yap",
  description: "PARENA hesabına giriş yap; günlük hisse önerilerini tek ekranda gör.",
  ogTitle: "PARENA — Giriş Yap",
  ogDescription: "PARENA hesabına güvenli giriş.",
};


export default function LoginPage() {
   useDocumentMeta(loginPageMeta);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { label, status, fail, succeed } = useSubmitFeedback("Giriş yap");
  const loginMutation = useLogin();
  const [searchParams] = useSearchParams();
  const raw = searchParams.get("redirect");
  const redirectTo = raw?.startsWith("/") && !raw.startsWith("//") ? raw : "/";

  async function handleSubmit(event: FormEvent) {
  
    event.preventDefault();
    if (loginMutation.isPending) return;

    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) return fail("Geçerli bir e-posta gir");
    if (!isValidPassword(password)) return fail("Şifreni eksiksiz gir");

    try {
      await loginMutation.mutateAsync({ email: normalized, password });
      succeed("✓ Giriş yapılıyor…");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      fail(toUserMessage(error, "E-posta veya şifre hatalı"));
    }
  }

  return (
    <AuthCard
      title="Giriş yap"
      footer={
        <>
          Hesabın yok mu? <AuthLink to="/uye-ol">Üye ol</AuthLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="E-posta"
          type="email"
          autoComplete="email"
          placeholder="ornek@eposta.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Şifre"
          type="password"
          autoComplete="current-password"
          placeholder="Şifren"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="login-forgot">
          <AuthLink to="/sifremi-unuttum">Şifremi unuttum</AuthLink>
        </div>

        <ParenaButton
          type="submit"
          size="block"
          disabled={loginMutation.isPending}
          variant={status === "success" ? "success" : "brand"}
        >
          {loginMutation.isPending ? "Giriş yapılıyor…" : label}
        </ParenaButton>
      </form>
    </AuthCard>
  );
}
