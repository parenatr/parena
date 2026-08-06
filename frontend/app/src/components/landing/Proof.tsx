export function Proof() {
  return (
    <>
      <section className="sec proof">
        <div id="karne" className="wrap proof-in">
          <p className="eyebrow" style={{"justifyContent": "center"}}>Karne</p>
          <h2>Her öneri, kâr/zararıyla birlikte</h2>
          <p style={{"maxWidth": "60ch", "margin": "14px auto 0"}}>
            Günlük öneriler, haftalık öneriler, model portföyler ve kısa vadeli fırsatlar, dördü de kapanış verisiyle
            ayrı ayrı hesaplanır. Karne 18:30'da yayımlanan günlük bültenle kesinleşir ve geriye dönük değiştirilemez.
          </p>

          <div className="pstats">
            <div className="pstat"><b className="count mono" data-to="68">0</b><span>Takip edilen kurum</span></div>
            <div className="pstat"><b className="count mono" data-to="64" data-pre="%">0</b><span>Son 30 gün isabet</span></div>
            <div className="pstat"><b className="count mono" data-to="9" data-post="">0</b><span>Kapsanan sektör</span></div>
            <div className="pstat"><b className="count mono" data-to="1200" data-sep="1" data-post="+">0</b><span>Aylık takip edilen öneri</span></div>
          </div>

          <div className="pstats" style={{"gridTemplateColumns": "repeat(4,1fr)", "marginTop": "1px"}}>
            <div className="pstat"><b className="mono" style={{"fontSize": "1.15rem"}}>Günlük</b><span>Ort. +%2,4 · isabet %66</span></div>
            <div className="pstat"><b className="mono" style={{"fontSize": "1.15rem"}}>Haftalık</b><span>Ort. +%4,1 · isabet %72</span></div>
            <div className="pstat"><b className="mono" style={{"fontSize": "1.15rem"}}>Model portföy</b><span>Ort. +%3,3 · isabet %69</span></div>
            <div className="pstat"><b className="mono" style={{"fontSize": "1.15rem"}}>Kısa vade</b><span>Ort. +%1,2 · isabet %54</span></div>
          </div>

          <p className="proof-note">
            İsabet tanımı: önerinin geçerlilik süresi içinde hedef fiyat seviyesinin görülmesi. Kâr/zarar, önerinin
            yayımlandığı andaki fiyat ile kapanış (veya hedef/stop) fiyatı arasındaki farktır.
            Geçmiş performans gelecek sonuçların garantisi değildir.
          </p>
        </div>
      </section>
    </>
  );
}
