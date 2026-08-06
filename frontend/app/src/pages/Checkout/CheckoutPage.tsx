import { useMemo, useState, type FormEvent } from "react";

import { ParenaMark } from "@/components/brand/ParenaMark";
import { AppLink } from "@/components/ui/app-link";
import { FOUNDER_QUOTA } from "@/data/quota";

import "./CheckoutPage.css";

export const checkoutPageMeta = {
  title: "Kurucu Üyeliği Tamamla | PARENA Ödeme",
  description:
    "PARENA kurucu üyeliğini aylık 149 ₺ veya yıllık 1.490 ₺ ile tamamla. Ödeme iyzico'nun güvenli sayfasında yapılır.",
  ogTitle: "PARENA — Kurucu üyeliğini tamamla",
  ogDescription: "Aylık 149 ₺ ya da yıllık 1.490 ₺. Güvenli ödeme iyzico ile.",
};

const PLANS = {
  aylik: { amount: 149, label: "Aylık", months: 1 },
  yillik: { amount: 1490, label: "Yıllık", months: 12 },
} as const;

type PlanKey = keyof typeof PLANS;

const TL = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const CONSENTS = [
  {
    id: "onbilgi",
    content: (
      <>
        <AppLink href="/mesafeli-satis" target="_blank" rel="noopener">
          Ön Bilgilendirme Formu
        </AppLink>
        'nu okudum ve bilgilendirildim.
      </>
    ),
  },
  {
    id: "mesafeli",
    content: (
      <>
        <AppLink href="/mesafeli-satis" target="_blank" rel="noopener">
          Mesafeli Satış Sözleşmesi
        </AppLink>
        'ni ve{" "}
        <AppLink href="/kullanim-sartlari" target="_blank" rel="noopener">
          Kullanım Şartları
        </AppLink>
        'nı okudum, kabul ediyorum.
      </>
    ),
  },
  { id: "cayma", content: <>Cayma hakkı istisnasını kabul ediyorum:</> },
] as const;

type ConsentId = (typeof CONSENTS)[number]["id"];

export default function CheckoutPage() {
  const [period, setPeriod] = useState<PlanKey>("aylik");
  const [consents, setConsents] = useState<Record<ConsentId, boolean>>({
    onbilgi: false,
    mesafeli: false,
    cayma: false,
  });
  const [errors, setErrors] = useState<Partial<Record<ConsentId | "form", string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const plan = PLANS[period];
  const allChecked = CONSENTS.every((c) => consents[c.id]);

  const renewal = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + plan.months);
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, [plan.months]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;

    const next: Partial<Record<ConsentId | "form", string>> = {};
    CONSENTS.forEach((c) => {
      if (!consents[c.id]) next[c.id] = "Devam etmek için bu onay gereklidir.";
    });
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    // TODO: POST /api/odeme/baslat → iyzico Checkout Form oturumu ve yönlendirme.
    setTimeout(() => {
      setSubmitting(false);
      setErrors({ form: "Ödeme altyapısı henüz bağlanmadı. (Arayüz önizlemesi)" });
    }, 600);
  }

  return (
    <div className="checkout-page">
      <a className="skip" href="#odeme">
        İçeriğe geç
      </a>

      <header className="nav">
        <div className="nav-in">
          <AppLink className="brand" href="/" aria-label="PARENA ana sayfa">
            <ParenaMark size={48} />
            <span>
              <span className="brand-name">
                PAR<em>ENA</em>
              </span>
              <span className="brand-tag">Portföy Arena</span>
            </span>
          </AppLink>
          <span className="secure">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="4" y="11" width="16" height="9" rx="2" />
              <path d="M8 11V7a4 4 0 018 0v4" />
            </svg>
            Güvenli ödeme
          </span>
        </div>
      </header>

      <main>
        <div className="wrap head">
          <p className="eyebrow">Ödeme</p>
          <h1>Kurucu üyeliğini tamamla</h1>
          <p className="steps">
            <b>✓ Hesap oluşturuldu</b> <span>›</span> <span className="now">Ödeme</span>{" "}
            <span>›</span> <span>Platform açılır</span>
          </p>
        </div>

        <div className="wrap grid" id="odeme">
          <form className="panel" id="payForm" onSubmit={handleSubmit} noValidate>
            <h2>Ödeme dönemini seç</h2>
            <div className="plans" role="radiogroup" aria-label="Ödeme dönemi">
              <label className="plan">
                <input
                  type="radio"
                  name="donem"
                  value="aylik"
                  checked={period === "aylik"}
                  onChange={() => setPeriod("aylik")}
                />
                <span className="plan-body">
                  <span className="plan-name">Aylık</span>
                  <span className="plan-sub">Her ay otomatik yenilenir</span>
                </span>
                <span className="plan-price">149 ₺</span>
              </label>

              <label className="plan">
                <input
                  type="radio"
                  name="donem"
                  value="yillik"
                  checked={period === "yillik"}
                  onChange={() => setPeriod("yillik")}
                />
                <span className="plan-body">
                  <span className="plan-name">
                    Yıllık <span className="save">2 ay hediye</span>
                  </span>
                  <span className="plan-sub">1.490 ₺ · aylık 124 ₺'ye denk gelir</span>
                </span>
                <span className="plan-price">1.490 ₺</span>
              </label>
            </div>

            <div className="consents">
              <h2 style={{ marginBottom: 6 }}>Onaylar</h2>

              {CONSENTS.map((consent) => (
                <div key={consent.id}>
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={consents[consent.id]}
                      aria-invalid={errors[consent.id] ? true : undefined}
                      onChange={(e) => {
                        setConsents((prev) => ({ ...prev, [consent.id]: e.target.checked }));
                        setErrors((prev) => ({ ...prev, [consent.id]: undefined }));
                      }}
                    />
                    <span>{consent.content}</span>
                  </label>
                  {consent.id === "cayma" ? (
                    <p className="quote">
                      "Dijital içerik hizmetinin ifasına derhal başlanmasını talep ediyorum. Bu
                      onayımla birlikte 14 günlük cayma hakkımdan feragat ettiğimi kabul ve
                      beyan ederim."
                    </p>
                  ) : null}
                  <p className={errors[consent.id] ? "err on" : "err"} role="alert">
                    {errors[consent.id]}
                  </p>
                </div>
              ))}
            </div>
          </form>

          <aside className="panel sum">
            <h2>Sipariş özeti</h2>
            <div className="sum-row">
              <span>Hizmet</span>
              <span>PARENA Kurucu Üyelik</span>
            </div>
            <div className="sum-row">
              <span>Dönem</span>
              <span>{plan.label}</span>
            </div>
            <div className="sum-row">
              <span>Kontenjan</span>
              <span className="mono">
                {FOUNDER_QUOTA.taken} / {FOUNDER_QUOTA.total}
              </span>
            </div>
            <div className="sum-row">
              <span>Sonraki yenileme</span>
              <span className="mono">{renewal}</span>
            </div>

            <div className="sum-total">
              <span>Toplam</span>
              <b className="mono">{TL.format(plan.amount)} ₺</b>
            </div>
            <p className="kdv">KDV dâhil</p>

            <button
              type="submit"
              form="payForm"
              className="btn"
              aria-disabled={!allChecked}
              style={{ opacity: allChecked ? 1 : 0.72 }}
              disabled={submitting}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="4" y="11" width="16" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 018 0v4" />
              </svg>
              {submitting ? "Ödeme sayfasına yönlendiriliyor…" : "iyzico ile güvenli öde"}
            </button>

            <p
              className={errors.form ? "err on" : "err"}
              role="alert"
              style={{ textAlign: "center", marginTop: 10 }}
            >
              {errors.form}
            </p>

            <p className="paynote">
              Ödeme iyzico'nun güvenli sayfasında tamamlanır. Kart bilgilerin PARENA
              sunucularında saklanmaz.
            </p>

            <div className="renew">
              <b>Yenileme:</b> Üyelik dönem sonunda otomatik yenilenir. Yenileme tarihinden en
              az <b>7 gün</b> önce destek@parena.com.tr adresine yazarak durdurabilirsin.
              <br />
              <b>Kontenjan:</b> Kurucu fiyatı ilk 150 üye içindir; sonrasında üyelik 249 ₺/ay
              olarak devam eder.
            </div>
          </aside>
        </div>
      </main>

      <footer>
        <div className="wrap">
          <div className="flinks">
            <AppLink href="/">Ana sayfa</AppLink>
            <AppLink href="/kullanim-sartlari">Kullanım şartları</AppLink>
            <AppLink href="/mesafeli-satis">Mesafeli satış sözleşmesi</AppLink>
            <AppLink href="/gizlilik">Gizlilik politikası</AppLink>
            <AppLink href="/kvkk">KVKK</AppLink>
            <a href="mailto:destek@parena.com.tr">destek@parena.com.tr</a>
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,.42)", lineHeight: 1.7 }}>
            PARENA yatırım danışmanlığı hizmeti sunmaz. İçerikler yalnızca bilgilendirme
            amaçlıdır. © {new Date().getFullYear()} PARENA
          </p>
        </div>
      </footer>
    </div>
  );
}
