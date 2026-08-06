export function Features() {
  return (
    <>
      <section className="sec" style={{"background": "var(--surface)", "borderTop": "1px solid var(--line)"}}>
        <div className="wrap">
          <div id="ozellikler" className="sec-head rv">
            <p className="eyebrow">Özellikler</p>
            <h2 className="oneline">Borsa kararını veriye bağlayan dokuz araç</h2>
            <p>Gün içi işlem de yapsan, uzun vadeli portföy de kursan, dört katmanın her biri ayrı ölçülür.</p>
          </div>

          <div className="fgrid">
            <article className="fcard rv">
              <div className="ficon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M4 18l5-6 4 3 7-9" /><path d="M4 4v16h16" /></svg></div>
              <h3>Dört katmanlı öneri akışı</h3>
              <p>Günlük öneri, haftalık strateji, model portföy ve kısa vadeli fırsat: dördü de öneren kurumu, hedef ve stop seviyesiyle birlikte tek tabloda. Kaynak PDF bir tık uzağında.</p>
            </article>
            <article className="fcard rv">
              <div className="ficon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M9 8V6a3 3 0 016 0v2" /><path d="M3 13h18" /></svg></div>
              <h3>Portföyüm</h3>
              <p>Hisselerini gir, maliyetini yaz. Portföyün hangi kurumun görüşüyle örtüşüyor, hangi pozisyon konsensüse ters, anında gör.</p>
            </article>
            <article className="fcard rv">
              <div className="ficon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></div>
              <h3>Kurum karnesi</h3>
              <p>Her kurumun isabet oranı ve ortalama kâr/zararı dört içerik tipi için ayrı hesaplanır. Kimin hangi alanda söz sahibi olduğu istatistikle belli olur.</p>
            </article>
            <article className="fcard rv">
              <div className="ficon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M3 12h4l3 8 4-16 3 8h4" /></svg></div>
              <h3>Konsensüs analizi</h3>
              <p>Tek hissede kaç kurum ne diyor, ortalama hedef fiyat nerede, son yedi günde görüş nereye kaydı, hepsi tek grafikte.</p>
            </article>
            <article className="fcard rv">
              <div className="ficon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5" /></svg></div>
              <h3>Model portföyler</h3>
              <p>Kurumların model portföy ağırlıkları, haftalık rebalans hareketleri ve portföyün dönemsel getirisi. Hangi hisse eklendi, hangisi çıkarıldı, ne kazandırdı.</p>
            </article>
            <article className="fcard rv">
              <div className="ficon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><rect x="3" y="13" width="4" height="8" rx="1" /><rect x="10" y="8" width="4" height="13" rx="1" /><rect x="17" y="4" width="4" height="17" rx="1" /></svg></div>
              <h3>Sektör isabet analizi</h3>
              <p>Hangi kurum hangi sektörde isabetli? Bankacılıkta güçlü olan kurum enerjide zayıf olabilir. Sektör × kurum kırılımını kâr/zarar verisiyle gör.</p>
            </article>
            <article className="fcard rv">
              <div className="ficon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M21 12a9 9 0 11-3-6.7" /><path d="M21 4v5h-5" /></svg></div>
              <h3>Strateji simülatörü</h3>
              <p>"Sadece şu kurumu izleseydim paran ne olurdu?" Geçmiş öneriler üzerinde stratejini geriye dönük test et.</p>
            </article>
            <article className="fcard rv">
              <div className="ficon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M4 6h7M4 12h7M4 18h7" /><path d="M15 9l3-3 3 3" /><path d="M18 6v12" /></svg></div>
              <h3>Karşılaştırma</h3>
              <p>İki hisseyi ya da iki kurumu yan yana koy. Hedef fiyatlar, isabet oranları ve kâr/zarar geçmişleri aynı ekranda.</p>
            </article>
            <article className="fcard rv">
              <div className="ficon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8" /><path d="M13.7 21a2 2 0 01-3.4 0" /></svg></div>
              <h3>Telegram bildirimleri</h3>
              <p>Takip listendeki hisseye yeni bir kurum görüşü geldiğinde ya da karne kesinleştiğinde anında haber.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
