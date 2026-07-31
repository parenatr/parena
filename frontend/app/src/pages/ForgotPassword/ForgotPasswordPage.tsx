import { useState, type FormEvent } from "react";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthLink } from "@/components/auth/AuthLink";
import { ParenaButton } from "@/components/ui/parena-button";
import { TextField } from "@/components/ui/text-field";
import { useForgotPassword } from "@/features/auth/auth.queries";
import { useSubmitFeedback } from "@/hooks/use-submit-feedback";
import { isValidEmail, normalizeEmail } from "@/lib/auth-validation";
import { toUserMessage } from "@/lib/http/api-error";

import "./ForgotPasswordPage.css";
import { useDocumentMeta } from "@/hooks/use-document-meta";

export const forgotPasswordPageMeta = {
  title: "PARENA — Şifremi Unuttum",
  description: "PARENA hesabının şifresini e-posta ile güvenli şekilde sıfırla.",
  ogTitle: "PARENA — Şifremi Unuttum",
  ogDescription: "Şifre sıfırlama bağlantısı gönderelim.",
};

export default function ForgotPasswordPage() {
  useDocumentMeta(forgotPasswordPageMeta);
  const [email, setEmail] = useState("");
  const { label, status, fail, succeed } = useSubmitFeedback(
    "Sıfırlama bağlantısı gönder",
  );
  const forgotPasswordMutation = useForgotPassword();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (forgotPasswordMutation.isPending) return;

    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) return fail("Geçerli bir e-posta gir");

    try {
      await forgotPasswordMutation.mutateAsync({ email: normalized });
      succeed("✓ Bağlantı gönderildi");
    } catch (error) {
      fail(toUserMessage(error, "Gönderilemedi, tekrar dene"));
    }
  }

  const isSent = status === "success";

  return (
    <AuthCard
      title="Şifreni sıfırla"
      hint={
        isSent
          ? "E-posta adresin kayıtlıysa sıfırlama bağlantısını gönderdik. Gelen kutunu ve spam klasörünü kontrol et."
          : "Kayıtlı e-posta adresini gir; şifreni sıfırlaman için bir bağlantı gönderelim."
      }
      footer={<AuthLink to="/giris">← Girişe dön</AuthLink>}
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
        <ParenaButton
          type="submit"
          size="block"
          disabled={forgotPasswordMutation.isPending || isSent}
          variant={isSent ? "success" : "brand"}
        >
          {forgotPasswordMutation.isPending ? "Gönderiliyor…" : label}
        </ParenaButton>
      </form>
    </AuthCard>
  );
}
