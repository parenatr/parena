import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { AuthField, AuthPasswordField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import { AppLink } from "@/components/ui/app-link";
import { useLogin } from "@/features/auth/auth.queries";
import { isValidEmail, normalizeEmail } from "@/lib/auth-validation";
import { toUserMessage } from "@/lib/http/api-error";

export const loginPageMeta = {
  title: "Giriş Yap | PARENA Portföy Arena",
  description:
    "PARENA hesabına giriş yap; 68 kurumun günlük önerilerini kâr/zarar takibiyle tek ekranda gör.",
  ogTitle: "PARENA — Hesabına giriş yap",
  ogDescription: "Bugünün karnesi seni bekliyor. PARENA hesabına güvenli giriş.",
};

type Errors = { mail?: string; pass?: string; form?: string };

export default function LoginPage({ redirectTo = "/" }: { redirectTo?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();
  const loginMutation = useLogin();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (loginMutation.isPending) return;

    const mail = normalizeEmail(email);
    const next: Errors = {};
    if (!mail) next.mail = "E-posta adresini gir.";
    else if (!isValidEmail(mail)) next.mail = "Geçerli bir e-posta adresi gir.";
    if (!password) next.pass = "Parolanı gir.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    try {
      await loginMutation.mutateAsync({ email: mail, password, remember });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrors({ form: toUserMessage(error, "E-posta veya parola hatalı.") });
    }
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

        <button type="submit" className="btn" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "Giriş yapılıyor…" : "Giriş yap"}
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
