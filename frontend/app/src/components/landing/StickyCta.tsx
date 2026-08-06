import { AppLink } from "@/components/ui/app-link";
import { PRICING_CONFIG, FOUNDER_QUOTA_LEFT } from "@/config/pricing";

/** Hero'dan sonra beliren yapışkan üyelik çubuğu. Görünürlüğü useLandingEffects yönetir. */
export function StickyCta() {
  return (
    <div
      className="sticky-cta"
      id="stickyCta"
      role="complementary"
      aria-label="Hızlı üyelik"
    >
      <div className="s-txt">
        <b>Kurucu üyelik {PRICING_CONFIG.founder.monthlyPriceLabel}</b>
        <span>
          Kontenjan: <span id="stickyQuota">{PRICING_CONFIG.founder.takenFounders}</span>/{PRICING_CONFIG.founder.maxFounders} doldu ({FOUNDER_QUOTA_LEFT} kaldı)
        </span>
      </div>
      <AppLink className="btn btn-primary" href="/uye-ol?plan=kurucu" data-cta="sticky">
        Üye ol
      </AppLink>
    </div>
  );
}