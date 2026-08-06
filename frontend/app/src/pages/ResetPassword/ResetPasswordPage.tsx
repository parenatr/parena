import { useMemo, useState, type FormEvent } from "react";

import { AuthPasswordField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import { AppLink } from "@/components/ui/app-link";
import { useResetPassword } from "@/features/auth/auth.queries";
import { toUserMessage } from "@/lib/http/api-error";
import { STRENGTH_LABELS, scorePassword } from "@/lib/password-strength";

export const resetPasswordPageMeta = {
  title: "Yeni Parola Belirle | PARENA Portföy Arena",
  description:
    "PARENA hesabın için yeni bir parola belirle. Parola değiştiğinde tüm cihazlardaki oturumlar kapanır.",
  ogTitle: "PARENA — Yeni parolanı belirle",
  ogDescription: "Güvenliğin için parola sıfırlandığında açık tüm oturumlar kapatılır.",
};

type Errors = { pass?: string; pass2?: string; form?: string };

export default function ResetPasswordPage({ token }: { token?: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);
  const resetMutation = useResetPassword();

  const strength = useMemo(() => (password ? scorePassword(password) : 0), [password]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (resetMutation.isPending) return;

    const next: Errors = {};
    if (password.length < 8) next.pass = "Parola en az 8 karakter olmalı.";
    if (confirm !== password) next.pass2 = "Parolalar eşleşmiyor.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    try {
      await resetMutation.mutateAsync({ token: token ?? "", password });
      setDone(true);
    } catch (error) {
      setErrors({
        form: toUserMessage(error, "Bağlantının süresi dolmuş olabilir, tekrar dene."),
      });
    }
  }

  return (
    <AuthShell
      sideTitle="Yeni parolanı belirle."
      sideText="Güvenliğin için parolan sıfırlandığında açık olan tüm oturumlar kapatılır."
      proof={[
        { no: "01", text: "En az 8 karakter kullan" },
        { no: "02", text: "Büyük harf, rakam ve simge gücü artırır" },
        { no: "03", text: "Başka bir yerde kullandığın parolayı seçme" },
      ]}
    >
      <div className="card-top">
        <p className="eyebrow">Yeni parola</p>
        <h1>Yeni parolanı belirle</h1>
        <p className="sub">Parolan değiştikten sonra tüm cihazlardaki oturumların kapanır.</p>
      </div>

      {!done ? (
        <form onSubmit={handleSubmit} noValidate>
          <AuthPasswordField
            id="pass"
            label={
              <>
                Yeni parola <span className="hint">— en az 8 karakter</span>
              </>
            }
            name="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.pass}
          >
            <div className={strength ? `meter s${strength}` : "meter"} aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
            <p className="meter-txt">
              {password ? STRENGTH_LABELS[strength] : STRENGTH_LABELS[0]}
            </p>
          </AuthPasswordField>

          <div style={{ marginBottom: 22 }}>
            <AuthPasswordField
              id="pass2"
              label="Yeni parola (tekrar)"
              name="passwordConfirm"
              placeholder="••••••••"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={errors.pass2}
            />
          </div>

          <button type="submit" className="btn" disabled={resetMutation.isPending}>
            {resetMutation.isPending ? "Güncelleniyor…" : "Parolayı güncelle"}
          </button>

          <p
            className={errors.form ? "err on" : "err"}
            role="alert"
            style={{ textAlign: "center", marginTop: 12 }}
          >
            {errors.form}
          </p>
        </form>
      ) : (
        <div className="done on">
          <div className="done-ico">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
              <path d="M4 12l5 5L20 6" />
            </svg>
          </div>
          <h2>Parolan güncellendi</h2>
          <p>Artık yeni parolanla giriş yapabilirsin.</p>
          <AppLink className="btn" href="/giris">
            Giriş yap
          </AppLink>
        </div>
      )}

      <p className="foot">
        Bağlantının süresi dolduysa{" "}
        <AppLink href="/sifremi-unuttum">yeni bir sıfırlama bağlantısı</AppLink> isteyebilirsin.
      </p>
    </AuthShell>
  );
}
