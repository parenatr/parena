import { AppLink } from "@/components/ui/app-link";

export function FinalCta() {
  return (
    <>
      <section className="sec" style={{"paddingTop": "0"}}>
        <div className="wrap">
          <div className="final rv">
            <h2>Paran arenada. Skoru tutan biri olsun.</h2>
            <p>Kurucu üyelik yalnızca ilk 150 kişi için 149 ₺. 151. üyeden itibaren aynı platform 249 ₺ olacak. Yerini şimdi al.</p>
            <div className="final-cta">
              <AppLink className="btn btn-gold btn-lg" href="/uye-ol?plan=kurucu" data-cta="final-primary">Kurucu üye ol · 149 ₺/ay</AppLink>
              <AppLink className="btn btn-ghost btn-lg" href="/uye-ol?plan=topluluk" data-cta="final-secondary">Önce topluluğa katıl</AppLink>
            </div>
            <p className="final-micro">Kurucu kontenjanında <b style={{"color": "var(--gold)"}}><span id="finalLeft">38</span> kişilik</b> yer kaldı.</p>
          </div>
        </div>
      </section>
    </>
  );
}
