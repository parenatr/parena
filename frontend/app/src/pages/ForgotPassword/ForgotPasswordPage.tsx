import { useState, type FormEvent } from "react";

import { AuthField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import { AppLink } from "@/components/ui/app-link";
import { useForgotPassword } from "@/features/auth/auth.queries";
import { isValidEmail, normalizeEmail } from "@/lib/auth-validation";

export const forgotPasswordPageMeta = {
  title: "Parolamı Unuttum | Parena",
  description:
    "PARENA hesabının parolasını sıfırla. E-posta adresini gir, 60 dakika geçerli sıfırlama bağlantısını gönderelim.",
  ogTitle: "PARENA — Parola sıfırlama",
  ogDescription: "E-posta adresini gir, sıfırlama bağlantısını gönderelim.",
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [doneMail, setDoneMail] = useState<string | null>(null);
  const forgotMutation = useForgotPassword();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (forgotMutation.isPending) return;

    const mail = normalizeEmail(email);
    if (!isValidEmail(mail)) {
      setError("Geçerli bir e-posta adresi gir.");
      return;
    }
    setError(undefined);

    try {
      await forgotMutation.mutateAsync({ email: mail });
    } catch {
      /* Hesap numaralandırmasını önlemek için hata da olsa aynı ekran gösterilir. */
    }
    setDoneMail(mail);
  }

  return (
    <AuthShell
      sideTitle="Parolanı sıfırlamak birkaç saniye sürer."
      sideText="E-posta adresini gir; hesabın varsa sıfırlama bağlantısını gönderelim."
      proof={[
        { no: "01", text: "Bağlantı 60 dakika geçerlidir" },
        { no: "02", text: "Sıfırlama sonrası tüm oturumlar kapanır" },
        { no: "03", text: "Talep etmediysen bir işlem yapmana gerek yok" },
      ]}
    >
      <div className="card-top">
        <p className="eyebrow">Parola sıfırlama</p>
        <h1>Parolanı mı unuttun?</h1>
        <p className="sub">
          E-posta adresini gir, sıfırlama bağlantısını gönderelim.{" "}
          <AppLink href="/giris">Giriş sayfasına dön</AppLink>
        </p>
      </div>

      {!doneMail ? (
        <form onSubmit={handleSubmit} noValidate>
          <AuthField
            id="mail"
            label="E-posta adresi"
            type="email"
            name="email"
            placeholder="ornek@eposta.com"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />

          <button type="submit" className="btn" disabled={forgotMutation.isPending}>
            {forgotMutation.isPending ? "Gönderiliyor…" : "Sıfırlama bağlantısı gönder"}
          </button>
        </form>
      ) : (
        <div className="done on">
          <div className="done-ico">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </div>
          <h2>Bağlantı gönderildi</h2>
          <p>
            <span className="mail">{doneMail}</span> adresine kayıtlı bir hesap varsa,
            sıfırlama bağlantısını gönderdik. Bağlantı <b>60 dakika</b> geçerlidir.
          </p>
          <AppLink className="btn btn-ghost" href="/giris">
            Giriş sayfasına dön
          </AppLink>
        </div>
      )}

      <p className="foot">
        E-posta birkaç dakika içinde gelmezse gereksiz (spam) klasörünü kontrol et.
        <br />
        Sorun sürerse <a href="mailto:destek@parena.com.tr">destek@parena.com.tr</a> adresine
        yaz.
      </p>
    </AuthShell>
  );
}
