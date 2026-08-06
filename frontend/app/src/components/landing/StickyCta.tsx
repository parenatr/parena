import { AppLink } from "@/components/ui/app-link";

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
        <b>Kurucu üyelik 149 ₺/ay</b>
        <span>
          Kontenjan: <span id="stickyQuota">112</span>/150 doldu
        </span>
      </div>
      <AppLink className="btn btn-primary" href="/uye-ol?plan=kurucu" data-cta="sticky">
        Üye ol
      </AppLink>
    </div>
  );
}
