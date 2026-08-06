import { useMemo, useState, type FormEvent } from "react";

import { AuthField, AuthPasswordField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import { AppLink } from "@/components/ui/app-link";
import { FOUNDER_PRICE, FOUNDER_QUOTA_LEFT } from "@/data/quota";
import { useRegister } from "@/features/auth/auth.queries";
import { isValidEmail, normalizeEmail } from "@/lib/auth-validation";
import { toUserMessage } from "@/lib/http/api-error";

export const registerPageMeta = {
  title: "Ücretsiz Üye Ol | Parena",
  description:
    "2 dakikada ücretsiz PARENA hesabı oluştur; kart bilgisi istenmez. Kurucu üyeliğe istediğin zaman yükselt.",
  ogTitle: "PARENA — Ücretsiz hesap oluştur",
  ogDescription: "Kurucu kontenjanı sınırlı. Kart bilgisi istenmeden 2 dakikada üye ol.",
};

const STRENGTH_LABELS = [
  "Parola gücü ölçülüyor",
  "Zayıf",
  "Orta",
  "İyi",
  "Güçlü",
] as const;

function scorePassword(value: string) {
  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[A-ZÇĞİÖŞÜ]/.test(value) && /[a-zçğıöşü]/.test(value)) score++;
  if (/[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value)) score++;
  return Math.min(score, 4);
}

type Errors = {
  ad?: string;
  soyad?: string;
  mail?: string;
  pass?: string;
  terms?: string;
  form?: string;
};

export default function RegisterPage({ plan = "topluluk" }: { plan?: string }) {
  const isFounder = plan === "kurucu";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [doneMail, setDoneMail] = useState<string | null>(null);

  const registerMutation = useRegister();
  const strength = useMemo(() => (password ? scorePassword(password) : 0), [password]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (registerMutation.isPending) return;

    const ad = firstName.trim().slice(0, 60);
    const soyad = lastName.trim().slice(0, 60);
    const mail = normalizeEmail(email);
    const next: Errors = {};
    if (ad.length < 2) next.ad = "Adını gir.";
    if (soyad.length < 2) next.soyad = "Soyadını gir.";
    if (!isValidEmail(mail)) next.mail = "Geçerli bir e-posta adresi gir.";
    if (password.length < 8) next.pass = "Parola en az 8 karakter olmalı.";
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
      setErrors({ form: toUserMessage(error, "Kayıt tamamlanamadı, tekrar dene.") });
    }
  }

  return (
    <AuthShell
      sideTitle={`Kurucu kontenjanında ${FOUNDER_QUOTA_LEFT} kişilik yer kaldı.`}
      sideText={`İlk 150 üye için ${FOUNDER_PRICE}. 151. üyeden itibaren aynı platform 249 ₺/ay olarak devam edecek.`}
      proof={[
        { no: "01", text: "Ücretsiz hesapla Telegram topluluğuna katıl" },
        { no: "02", text: "Kart bilgisi istenmez, kayıt 2 dakika sürer" },
        { no: "03", text: "İstediğinde kurucu üyeliğe yükselt" },
      ]}
    >
      <div className="card-top">
        <p className="eyebrow">Kayıt</p>
        <h1>{isFounder ? "Önce hesabını oluştur" : "Ücretsiz hesap oluştur"}</h1>
        <p className="sub">
          Zaten hesabın var mı? <AppLink href="/giris">Giriş yap</AppLink>
        </p>
        {isFounder ? (
          <div className="planbar">
            <span className="pb-tag">Kurucu üyelik</span>
            <span className="pb-txt">
              Önce hesabını oluştur, sonra ödemeye geç. <b>{FOUNDER_PRICE}</b>
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
                Parola <span className="hint">— en az 8 karakter</span>
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
                </AppLink>
                ,{" "}
                <AppLink href="/gizlilik" target="_blank" rel="noopener">
                  Gizlilik Politikası
                </AppLink>{" "}
                ve{" "}
                <AppLink href="/kvkk" target="_blank" rel="noopener">
                  KVKK Aydınlatma Metni
                </AppLink>
                'ni okudum, kabul ediyorum.
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
                Kampanya ve duyurulardan e-posta ile haberdar olmak istiyorum.{" "}
                <span style={{ color: "var(--muted)" }}>(isteğe bağlı)</span>
              </span>
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
          {isFounder ? (
            <>
              <AppLink className="btn" href="/odeme?plan=kurucu">
                Ödemeye geç · {FOUNDER_PRICE}
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
