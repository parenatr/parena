import { useMemo, useState, type FormEvent } from "react";

import { AuthField, AuthPasswordField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import { AppLink } from "@/components/ui/app-link";
import { useRegister } from "@/features/auth/auth.queries";
import { isValidEmail, normalizeEmail } from "@/lib/auth-validation";
import { ApiError, toUserMessage } from "@/lib/http/api-error";
import { getPasswordRuleError, scorePasswordStrength, STRENGTH_LABELS } from "@/lib/password-policy";

export const registerPageMeta = {
  title: "Üye Ol | Parena",
  description: "PARENA hesabını oluştur; ücretsiz erişimle başla veya Premium plana devam et.",
  ogTitle: "PARENA — Hesabını oluştur",
  ogDescription: "Ücretsiz hesapla başla veya Premium planına devam et.",
};


const BACKEND_FIELD_MAP: Record<string, keyof Errors> = {
  firstName: "ad",
  lastName: "soyad",
  email: "mail",
  password: "pass",
};

type Errors = {
  ad?: string;
  soyad?: string;
  mail?: string;
  pass?: string;
  terms?: string;
  form?: string;
};

type RegisterPlan = "ucretsiz" | "premium";

export default function RegisterPage({
  plan,
}: {
  plan?: string | null;
}) {
  // Geçersiz veya eksik parametreler ücretsiz akışa güvenli biçimde döner.
  const selectedPlan: RegisterPlan = plan === "premium" ? "premium" : "ucretsiz";
  const isPremium = selectedPlan === "premium";
  const paymentHref = "/odeme?plan=premium";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [doneMail, setDoneMail] = useState<string | null>(null);

  const registerMutation = useRegister();
  const strength = useMemo(() => (password ? scorePasswordStrength(password) : 0), [password]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (registerMutation.isPending) return;

    const ad = firstName.trim().slice(0, 60);
    const soyad = lastName.trim().slice(0, 60);
    const mail = normalizeEmail(email);
    const passwordError = getPasswordRuleError(password, mail);
    const next: Errors = {};
    if (ad.length < 2) next.ad = "Adını gir.";
    if (soyad.length < 2) next.soyad = "Soyadını gir.";
    if (!isValidEmail(mail)) next.mail = "Geçerli bir e-posta adresi gir.";
    if (passwordError) next.pass = passwordError;
    if (!terms) next.terms = "Devam etmek için sözleşmeleri kabul etmelisin.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    try {
      await registerMutation.mutateAsync({
        firstName: ad,
        lastName: soyad,
        email: mail,
        password,
        marketingConsent: marketing,
      });
      setDoneMail(mail);
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        const mapped: Errors = {};
        for (const [backendField, message] of Object.entries(error.fieldErrors)) {
          const frontendField = BACKEND_FIELD_MAP[backendField];
          if (frontendField) mapped[frontendField] = message;
        }
        setErrors(Object.keys(mapped).length > 0 ? mapped : { form: toUserMessage(error) });
      } else {
        setErrors({ form: toUserMessage(error, "Kayıt tamamlanamadı, tekrar dene.") });
      }
    }
  }
  const STANDARD_PREMIUM_PRICE = "249 ₺/ay";
  const shellContent = isPremium
      ? {
        sideTitle: "Premium üyeliğe bir adım kaldı.",
        sideText:
          `Premium planla tüm önerilere, kurum karnesine ve ileri analiz araçlarına ` +
          `${STANDARD_PREMIUM_PRICE} ile erişebilirsin.`,
        proof: [
          { no: "01", text: "Dört içerik tipindeki tüm öneriler ve kaynak PDF" },
          { no: "02", text: "Kurum ve sektör analizi, portföy takibi ve simülatör" },
          { no: "03", text: "Ödeme hesabın oluşturulduktan sonra tamamlanır" },
        ],
      }
      : {
        sideTitle: "Parena’yı kendi hızında dene.",
        sideText: "Ücretsiz hesabını oluştur, topluluğa katıl ve platformu yakından tanı.",
        proof: [
          { no: "01", text: "Ücretsiz hesapla Telegram topluluğuna katıl" },
          { no: "02", text: "Kart bilgisi istenmez, kayıt 2 dakika sürer" },
          { no: "03", text: "Hazır olduğunda Premium plana geç" },
        ],
      };

  return (
    <AuthShell
      sideTitle={shellContent.sideTitle}
      sideText={shellContent.sideText}
      proof={shellContent.proof}
    >
      <div className="card-top">
        <p className="eyebrow">Kayıt</p>
        <h1>{isPremium ? "Önce hesabını oluştur" : "Ücretsiz hesap oluştur"}</h1>
        <p className="sub">
          Zaten hesabın var mı? <AppLink href="/giris">Giriş yap</AppLink>
        </p>

        {isPremium ? (
          <div className="planbar">
            <span className="pb-tag">
              Premium plan
            </span>
            <span className="pb-txt">
              Önce hesabını oluştur, sonra Premium üyeliğe devam et.
            </span>
          </div>
        ) : null}
      </div>

      {!doneMail ? (
        <form onSubmit={handleSubmit} noValidate>
          <div className="name-row">
            <AuthField
              id="ad"
              label="Ad"
              type="text"
              name="given-name"
              placeholder="Adın"
              autoComplete="given-name"
              maxLength={60}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={errors.ad}
            />

            <AuthField
              id="soyad"
              label="Soyad"
              type="text"
              name="family-name"
              placeholder="Soyadın"
              autoComplete="family-name"
              maxLength={60}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={errors.soyad}
            />
          </div>


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
            label={
              <>
                Parola <span className="hint">— en az 10 karakter</span>
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

          <div className="field" style={{ marginTop: 20 }}>
            <label className="check">
              <input
                type="checkbox"
                checked={terms}
                aria-invalid={errors.terms ? true : undefined}
                onChange={(e) => setTerms(e.target.checked)}
              />
              <span>
                <AppLink href="/kullanim-sartlari" target="_blank" rel="noopener">
                  Kullanım Şartları
                </AppLink>'nı okudum, kabul ediyorum.
              </span>
            </label>
            <p className={errors.terms ? "err on" : "err"} role="alert">
              {errors.terms}
            </p>
          </div>

          <div className="field" style={{ marginBottom: 22 }}>
            <label className="check">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
              <span>
                Tarafıma ürün, hizmet ve kampanyalara ilişkin ticari elektronik ileti almak istiyorum.
                <span style={{ color: "var(--muted)" }}>(isteğe bağlı)</span>
              </span>
            </label>
          </div>

          <div className="field" style={{ marginTop: 20 }}>
            <label className="check">
              <span>Kişisel verilerinizin işlenmesine ilişkin{" "}
                <AppLink href="/kvkk" target="_blank" rel="noopener">
                  Kvkk Aydınlatma Metni
                </AppLink>'ni inceleyebilirsiniz.</span>
            </label>
          </div>
          <div className="field" style={{ marginTop: 20 }}>
            <label className="check">
              <span>
                <AppLink href="/gizlilik" target="_blank" rel="noopener">
                  Gizlilik Politikası
                </AppLink>'nı inceleyebilirsiniz.</span>
            </label>
          </div>

          <button type="submit" className="btn" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Oluşturuluyor…" : "Hesabı oluştur"}
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
          <h2>Hesabın oluşturuldu</h2>
          <p>
            <span className="mail">{doneMail}</span> adresine bir doğrulama bağlantısı
            gönderdik. Bağlantıya tıklayarak hesabını etkinleştir.
          </p>
          {isPremium ? (
            <>
              <AppLink className="btn" href={paymentHref}>
                Premium üyeliğe devam et
              </AppLink>
              <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: 14 }}>
                Ödemeyi sonra da tamamlayabilirsin;{" "}
                <AppLink href="/giris" style={{ fontWeight: 600 }}>
                  giriş yap
                </AppLink>{" "}
                ve hesabından devam et.
              </p>
            </>
          ) : (
            <AppLink className="btn" href="/giris">
              Giriş sayfasına dön
            </AppLink>
          )}
        </div>
      )}

      <p className="legal-note">
        Ücretli üyeliğe geçtiğinde{" "}
        <AppLink href="/mesafeli-satis" target="_blank" rel="noopener">
          Mesafeli Satış Sözleşmesi
        </AppLink>{" "}
        de geçerli olur.
      </p>
    </AuthShell>
  );
}
