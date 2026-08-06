export function Hero() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="hero-badge"><span className="pulse" aria-hidden="true"></span> Bugün 41 kurum yayın yaptı · 137 öneri takipte</p>

            <h1>Borsada 68 kurumun görüşü, <mark>portföyünün karnesi</mark> ve paranın gerçek performansı, tek ekranda.</h1>

            <p className="hero-lede">
              PARENA, SPK lisanslı aracı kurumların günlük ve haftalık önerilerini, model portföylerini
              ve kısa vadeli fırsatlarını tek panelde toplar; her birinin kâr/zararını ayrı ayrı yazar.
              Hangi kurum hangi sektörde isabetli, senin portföyün bunun neresinde? Hepsi ölçülebilir.
            </p>

            <div className="hero-cta" style={{"marginBottom": "0"}}>
              <a className="btn btn-primary btn-lg" href="#fiyat" data-cta="hero-primary">Kurucu üye ol · 149 ₺/ay</a>
              <a className="btn btn-ghost btn-lg" href="#nasil" data-cta="hero-secondary">Nasıl çalışıyor?</a>
            </div>

          </div>


          <div>
            <figure className="board" id="board" aria-label="Kurum önerilerinin içerik tipine göre kâr/zarar tablosu">
              <div className="board-top">
                <span className="board-title">Bugünün Arenası</span>
                <span className="board-live"><i aria-hidden="true"></i> 18:30 · günlük bülten yayında</span>
              </div>
              <div className="board-cols" aria-hidden="true">
                <span>Hisse</span><span>Kurum · Tür</span><span className="c-tgt" style={{"textAlign": "right"}}>Kâr/Zarar</span><span style={{"textAlign": "center"}}>Sonuç</span>
              </div>
              <div className="board-rows" id="boardRows">
                <div className="brow" style={{"animationDelay": ".15s"}}><span className="tk">THYAO</span><span className="src">İş Yatırım<small className="tp t-gun">Günlük</small></span><span className="tgt up">+4,82%</span><span className="verdict v-ok" data-short="Hedef ✓">Hedef görüldü</span></div>
                <div className="brow" style={{"animationDelay": ".30s"}}><span className="tk">ASELS</span><span className="src">Ak Yatırım<small className="tp t-haf">Haftalık</small></span><span className="tgt up">+7,15%</span><span className="verdict v-ok" data-short="Hedef ✓">Hedef görüldü</span></div>
                <div className="brow" style={{"animationDelay": ".45s"}}><span className="tk">EREGL</span><span className="src">Garanti Yatırım<small className="tp t-kv">Kısa vade</small></span><span className="tgt down">−2,40%</span><span className="verdict v-no" data-short="Stop">Stop oldu</span></div>
                <div className="brow" style={{"animationDelay": ".60s"}}><span className="tk">TUPRS</span><span className="src">Gedik Yatırım<small className="tp t-mod">Model portföy</small></span><span className="tgt up">+3,06%</span><span className="verdict v-ok" data-short="Hedef ✓">Hedef görüldü</span></div>
                <div className="brow" style={{"animationDelay": ".75s"}}><span className="tk">SAHOL</span><span className="src">Halk Yatırım<small className="tp t-gun">Günlük</small></span><span className="tgt flat">+0,84%</span><span className="verdict v-open" data-short="Açık">Açık pozisyon</span></div>
                <div className="brow" style={{"animationDelay": ".90s"}}><span className="tk">TOASO</span><span className="src">Deniz Yatırım<small className="tp t-haf">Haftalık</small></span><span className="tgt up">+5,90%</span><span className="verdict v-ok" data-short="Hedef ✓">Hedef görüldü</span></div>
              </div>
              <div className="board-foot">
                <div className="bstat"><b className="count" data-to="68">0</b><span>Takip edilen kurum</span></div>
                <div className="bstat"><b className="count" data-to="4">0</b><span>Ayrı içerik tipi</span></div>
                <div className="bstat"><b className="count" data-to="64" data-pre="%">0</b><span>30 gün isabet</span></div>
              </div>
            </figure>
          </div>
        </div>
      </section>
    </>
  );
}
