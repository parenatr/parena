import { useState, type FormEvent } from "react";

import { AppLink } from "@/components/ui/app-link";
import { isValidEmail, normalizeEmail } from "@/lib/auth-validation";

/** E-posta yakalama bloğu (bülten kaydı). */
export function LeadCapture() {
  const [email, setEmail] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    // TODO: BFF hazır olduğunda POST /api/leads çağrısı buraya bağlanacak.
    setSent(true);
  }

  return (
    <section className="sec" style={{ paddingTop: 0, background: "var(--surface)" }}>
      <div className="wrap">
        <div className="capture rv">
          <h3 style={{ fontSize: "1.35rem" }}>Kontenjan dolmadan haber al</h3>
          <p
            style={{
              color: "var(--muted)",
              maxWidth: "54ch",
              margin: "10px auto 0",
              fontSize: "15px",
            }}
          >
            E-postanı bırak: kurucu kontenjanı azaldığında, yeni bir modül açıldığında ve ara
            ara örnek bir gün karnesi paylaştığımızda sana yazalım.
          </p>

          {!sent && (
            <form className="cap-form" onSubmit={handleSubmit} noValidate>
              <label className="sr" htmlFor="capMail">
                E-posta adresin
              </label>
              <input
                type="email"
                id="capMail"
                name="email"
                placeholder="ornek@eposta.com"
                required
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={invalid || undefined}
                style={invalid ? { borderColor: "var(--sell)" } : undefined}
              />
              <button type="submit" className="btn btn-gold" data-cta="lead-magnet">
                Haber ver
              </button>
            </form>
          )}

          <p className="cap-note">
            E-posta adresin <AppLink href="/kvkk">KVKK Aydınlatma Metni</AppLink> kapsamında
            işlenir. Sohbete katılmak istersen{" "}
            <AppLink href="/uye-ol?plan=topluluk">ücretsiz hesap açıp</AppLink> PARENA Telegram
            topluluğuna girebilirsin.
          </p>

          <p className="cap-ok" role="status" style={sent ? { display: "block" } : undefined}>
            ✓ Kaydın alındı. Kontenjan ve yeni modül haberlerini e-postana göndereceğiz.
          </p>
        </div>
      </div>
    </section>
  );
}
