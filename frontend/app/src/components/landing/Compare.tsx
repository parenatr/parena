export function Compare() {
  return (
    <>
      <section className="sec">
        <div className="wrap">
          <div className="sec-head rv">
            <p className="eyebrow">Karşılaştırma</p>
            <h2>Borsa takibinin üç yolu</h2>
            <p>Aynı bilgiye üç farklı yoldan ulaşabilirsin. Fark, bilginin kendisinde değil, doğrulanabilirliğinde.</p>
          </div>

          <div className="tscroll rv">
            <table className="cmp">
              <caption className="sr">PARENA, manuel bülten takibi ve sosyal medya karşılaştırması</caption>
              <thead>
                <tr>
                  <th scope="col">Ölçüt</th>
                  <th scope="col">Bültenleri tek tek okumak</th>
                  <th scope="col">Sosyal medya / gruplar</th>
                  <th scope="col" className="hi">PARENA</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Günlük harcanan süre</td><td>2–3 saat</td><td>Sürekli, dağınık</td><td className="hi">~10 dakika</td></tr>
                <tr><td>Kapsanan kurum sayısı</td><td>3–5</td><td>Belirsiz</td><td className="hi">68</td></tr>
                <tr><td>Kapsanan içerik tipi</td><td>Genelde sadece günlük</td><td>Karışık</td><td className="hi">4 (günlük, haftalık, model, kısa vade)</td></tr>
                <tr><td>Kaynak belgeye erişim</td><td className="yes">✓</td><td className="no">✕</td><td className="hi yes">✓</td></tr>
                <tr><td>Her önerinin kâr/zararı</td><td className="no">✕</td><td className="no">✕</td><td className="hi yes">✓</td></tr>
                <tr><td>Sektör bazlı kurum isabet analizi</td><td className="no">✕</td><td className="no">✕</td><td className="hi yes">✓</td></tr>
                <tr><td>Geriye dönük değiştirilemeyen kayıt</td><td className="no">✕</td><td className="no">✕</td><td className="hi yes">✓</td></tr>
                <tr><td>Portföyünle eşleştirme</td><td className="no">✕</td><td className="no">✕</td><td className="hi yes">✓</td></tr>
                <tr><td>Aylık maliyet</td><td>Ücretsiz, zaman pahalı</td><td>Ücretsiz, bilgi güvenilmez</td><td className="hi">149 ₺</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
