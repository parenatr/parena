export function HowItWorks() {
  return (
    <>
      <section id="nasil" className="sec">
        <div className="wrap">
          <div className="sec-head rv">
            <p className="eyebrow">Nasıl çalışır</p>
            <h2>Bir işlem gününün üç aşaması</h2>
            <p className="oneline">Döngü bir borsa gününü izler: derle, takip et, kâr/zararı yaz.</p>
          </div>

          <div className="steps">
            <article className="step rv">
              <p className="step-time">10:00 · Derleme</p>
              <h3>Piyasa verisi ve yayınlar akmaya başlar</h3>
              <p>Piyasa verileri 10:00 itibarıyla yayına girer. 68 kurumun günlük önerisi, haftalık stratejisi, model portföyü ve kısa vadeli fırsatı ayrıştırılıp kaynak belgeye bağlanır.</p>
            </article>
            <article className="step rv">
              <p className="step-time">10:00–18:00 · İzleme</p>
              <h3>Dört katman canlı takip edilir</h3>
              <p>Her öneri, ait olduğu içerik tipiyle birlikte anlık fiyata bağlanır. Konsensüsün nereye kaydığını, hangi sektörde birleşme olduğunu gün içinde görürsün.</p>
            </article>
            <article className="step rv">
              <p className="step-time">18:30 · Karne ve bülten</p>
              <h3>Kâr/zarar kayda geçer, silinmez</h3>
              <p>Kapanış verisiyle her önerinin kâr/zararı hesaplanır; kurum sicili, sektör analizi ve portföy karnen güncellenir. Günlük bülten 18:30'da yayımlanır.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
