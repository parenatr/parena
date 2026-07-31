import { useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthLink } from "@/components/auth/AuthLink";
import { ParenaButton } from "@/components/ui/parena-button";
import { TextField } from "@/components/ui/text-field";
import { useRegister } from "@/features/auth/auth.queries";
import { useSubmitFeedback } from "@/hooks/use-submit-feedback";
import { isValidEmail, isValidPassword, normalizeEmail } from "@/lib/auth-validation";
import { toUserMessage } from "@/lib/http/api-error";

import "./RegisterPage.css";
import { useDocumentMeta } from "@/hooks/use-document-meta";

export const registerPageMeta = {
  title: "PARENA — Üye Ol",
  description: "PARENA hesabı oluştur ve günlük hisse önerilerini takip etmeye başla.",
  ogTitle: "PARENA — Üye Ol",
  ogDescription: "Dakikalar içinde PARENA hesabı oluştur.",
};


export default function RegisterPage() {
  useDocumentMeta(registerPageMeta); 
  const [form, setForm] = useState({ ad: "", soyad: "", eposta: "", sifre: "" });
  const [kvkk, setKvkk] = useState(false);
  const [ticari, setTicari] = useState(false);
  const navigate = useNavigate();
  const { label, status, fail, succeed } = useSubmitFeedback("Üye ol");
  const registerMutation = useRegister();

  const update = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (registerMutation.isPending) return;

    const eposta = normalizeEmail(form.eposta);
    if (
      !form.ad.trim() ||
      !form.soyad.trim() ||
      !isValidEmail(eposta) ||
      !isValidPassword(form.sifre)
    ) {
      return fail("Alanları eksiksiz doldur");
    }
    if (!kvkk) return fail("Sözleşmeleri onaylamalısın");

    try {
      await registerMutation.mutateAsync({
        firstName: form.ad.trim(),
        lastName: form.soyad.trim(),
        email: eposta,
        password: form.sifre,
        marketingConsent: ticari,
      });
      succeed("✓ Hesap oluşturuldu");
      navigate("/", { replace: true });
    } catch (error) {
      fail(toUserMessage(error, "Kayıt tamamlanamadı"));
    }
  }

  return (
    <AuthCard
      title="Üye ol"
      footer={
        <>
          Zaten üye misin? <AuthLink to="/giris">Giriş yap</AuthLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="register-name-row">
          <TextField
            label="Ad"
            autoComplete="given-name"
            placeholder="Adın"
            containerClassName="flex-1 min-w-0"
            value={form.ad}
            onChange={(e) => update("ad")(e.target.value)}
          />
          <TextField
            label="Soyad"
            autoComplete="family-name"
            placeholder="Soyadın"
            containerClassName="flex-1 min-w-0"
            value={form.soyad}
            onChange={(e) => update("soyad")(e.target.value)}
          />
        </div>

        <TextField
          label="E-posta"
          type="email"
          autoComplete="email"
          placeholder="ornek@eposta.com"
          value={form.eposta}
          onChange={(e) => update("eposta")(e.target.value)}
        />
        <TextField
          label="Şifre"
          type="password"
          autoComplete="new-password"
          placeholder="En az 8 karakter"
          value={form.sifre}
          onChange={(e) => update("sifre")(e.target.value)}
        />

        <div className="register-consents">
          <label className="register-consent">
            <input
              type="checkbox"
              checked={kvkk}
              onChange={(e) => setKvkk(e.target.checked)}
            />
            <span>
              <span className="cursor-pointer text-brand hover:underline">
                Kullanım Şartları
              </span>
              'nı ve{" "}
              <span className="cursor-pointer text-brand hover:underline">
                KVKK Aydınlatma Metni
              </span>
              'ni okudum, onaylıyorum.
            </span>
          </label>
          <label className="register-consent">
            <input
              type="checkbox"
              checked={ticari}
              onChange={(e) => setTicari(e.target.checked)}
            />
            <span>
              PARENA'dan kampanya ve bilgilendirme iletileri almak istiyorum.{" "}
              <span className="opacity-70">(opsiyonel)</span>
            </span>
          </label>
        </div>

        <ParenaButton
          type="submit"
          size="block"
          disabled={registerMutation.isPending}
          variant={status === "success" ? "success" : "brand"}
          className="mt-2"
        >
          {registerMutation.isPending ? "Hesap oluşturuluyor…" : label}
        </ParenaButton>
      </form>
    </AuthCard>
  );
}
