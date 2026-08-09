import { useState, type FormEvent } from "react";

import { AuthField, AuthPasswordField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import { AppLink } from "@/components/ui/app-link";
import { isValidEmail, normalizeEmail } from "@/lib/auth-validation";

export const loginPageMeta = {
  title: "Giriş Yap | Parena",
  description:
    "PARENA hesabına giriş yap; 68 kurumun günlük önerilerini kâr/zarar takibiyle tek ekranda gör.",
  ogTitle: "PARENA — Hesabına giriş yap",
  ogDescription: "Bugünün karnesi seni bekliyor. PARENA hesabına güvenli giriş.",
};

/**
 * NOT: Bu bileşen artık routing'de kullanılmıyor (/giris, Keycloak'a doğrudan
 * redirect ediyor — bkz. AppRouter.tsx). Dosya, Keycloakify temasına
 * taşınacak görsel tasarımın referans kaynağı olarak tutuluyor.
 * Validation burada sadece görsel amaçlı kalıyor, gerçek submit yok.
 */
type Errors = { mail?: string; pass?: string; form?: string };

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const mail = normalizeEmail(email);
    const next: Errors = {};
    if (!mail) next.mail = "E-posta adresini gir.";
    else if (!isValidEmail(mail)) next.mail = "Geçerli bir e-posta adresi gir.";
    if (!password) next.pass = "Parolanı gir.";

    setErrors(next);
    // Gerçek submit yok — bu form Keycloakify temasına taşınana kadar pasif.
  }

  return (
    <AuthShell
      sideTitle="Bugünün karnesi seni bekliyor."
      sideText="Günlük, haftalık, model portföy ve kısa vadeli önerilerin tamamı, her birinin kâr/zararıyla birlikte."
    >
      <div className="card-top">
        <p className="eyebrow">Giriş</p>
        <h1>Hesabına giriş yap</h1>
        <p className="sub">
          Hesabın yok mu? <AppLink href="/uye-ol">Ücretsiz oluştur</AppLink>
        </p>
      </div>

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
          error={errors.mail}
        />

        <AuthPasswordField
          id="pass"
          label="Parola"
          name="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.pass}
        />

        <div className="row">
          <label className="check">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />{" "}
            <span>Beni hatırla</span>
          </label>
          <AppLink className="link-sm" href="/sifremi-unuttum">
            Parolamı unuttum
          </AppLink>
        </div>

        <button type="submit" className="btn">
          Giriş yap
        </button>

        <p
          className={errors.form ? "err on" : "err"}
          role="alert"
          style={{ textAlign: "center", marginTop: 12 }}
        >
          {errors.form}
        </p>
      </form>

      <p className="foot">
        Tek aktif oturum kuralı geçerlidir: yeni bir cihazdan giriş yaptığında önceki oturumun
        kapanır.
      </p>
    </AuthShell>
  );
}