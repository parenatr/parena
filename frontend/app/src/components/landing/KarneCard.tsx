export function KarneCard() {
  return (
    <>
      <section className="sec" style={{"paddingTop": "0", "background": "var(--surface)"}}>
        <div className="wrap">

          <div className="frow rv">
            <div>
              <h3>Tek kurum, dört ayrı defter</h3>
              <p>Bir kurumun haftalık stratejisi güçlü olup günlük önerileri zayıf olabilir; model portföyü kazandırırken kısa vadeli çağrıları kaybettirebilir.
              PARENA dört içerik tipini ayrı ayrı hesaplar ve her biri için hem isabet oranını hem <span className="kw">ortalama kâr/zararı</span> yazar.
              Kapanış verisine bakarak, iddiaya değil.</p>
            </div>
            <div className="fvis">
              <div className="vhead"><b>İş Yatırım</b><span>son 90 gün</span></div>
              <div className="vrow"><span className="vlabel">Günlük öneri</span><span><span className="mono up">%78</span> <span className="mono" style={{"color": "var(--muted)", "fontSize": "12px"}}>ort. +%2,1</span></span></div>
              <div className="vrow"><span className="vlabel">Haftalık öneri</span><span><span className="mono up">%85</span> <span className="mono" style={{"color": "var(--muted)", "fontSize": "12px"}}>ort. +%4,6</span></span></div>
              <div className="vrow"><span className="vlabel">Model portföy</span><span><span className="mono up">%71</span> <span className="mono" style={{"color": "var(--muted)", "fontSize": "12px"}}>ort. +%3,2</span></span></div>
              <div className="vrow"><span className="vlabel">Kısa vadeli fırsat</span><span><span className="mono" style={{"color": "var(--sell)"}}>%49</span> <span className="mono" style={{"color": "var(--muted)", "fontSize": "12px"}}>ort. −%0,8</span></span></div>
            </div>
          </div>

          <div className="frow rev rv">
            <div>
              <h3>Hangi kurum, hangi sektörde isabetli?</h3>
              <p>Bir kurumun genel isabet oranı ortalamadır; asıl bilgi kırılımda. Bankacılık hisselerinde sürekli tutturan bir kurum,
              enerjide sistematik olarak yanılıyor olabilir. <span className="kw">Sektör × kurum matrisi</span> bunu kâr/zarar verisiyle açığa çıkarır; böylece bir hisseye bakarken, o sektörde gerçekten sicili olan kurumun görüşünü ayırt edebilirsin.</p>
            </div>
            <div className="fvis">
              <div className="vhead"><span>Sektör</span><span>En isabetli kurum · 90 gün</span></div>
              <div className="vrow"><span className="vlabel">Bankacılık</span><span>Ak Yatırım <span className="mono up">%81</span></span></div>
              <div className="vrow"><span className="vlabel">Havacılık</span><span>İş Yatırım <span className="mono up">%77</span></span></div>
              <div className="vrow"><span className="vlabel">Enerji &amp; petrokimya</span><span>Gedik Yatırım <span className="mono up">%69</span></span></div>
              <div className="vrow"><span className="vlabel">Perakende</span><span>Garanti Yatırım <span className="mono" style={{"color": "#B07E1E"}}>%64</span></span></div>
              <div className="vrow"><span className="vlabel">Demir &amp; çelik</span><span>Halk Yatırım <span className="mono" style={{"color": "#B07E1E"}}>%58</span></span></div>
            </div>
          </div>

          <div className="frow rv">
            <div>
              <h3>Aynı hisseye kaç kurum bakıyor?</h3>
              <p>Bir hisseyi hangi kurumlar, hangi içerik tipinde önerdi? Ortalama hedef fiyat nerede duruyor, son bir haftada
              kaç kurum listeye girdi ya da çıktı? <span className="kw">İlgi yoğunlaşıyor mu, dağılıyor mu</span>, tek bakışta görürsün.</p>
            </div>
            <div className="fvis">
              <div className="vhead"><b className="mono">THYAO</b><span>13 kurum · güncel</span></div>
              <div className="bar" role="img" aria-label="THYAO önerilerinin içerik tipine göre dağılımı: 6 günlük, 4 haftalık, 2 model portföy, 1 kısa vadeli">
                <i className="b-gun" style={{"width": "46%"}}></i><i className="b-haf" style={{"width": "31%"}}></i><i className="b-mod" style={{"width": "15%"}}></i><i className="b-kv" style={{"width": "8%"}}></i>
              </div>
              <div className="barkey">
                <span><i className="b-gun"></i>6 günlük</span><span><i className="b-haf"></i>4 haftalık</span>
                <span><i className="b-mod"></i>2 model</span><span><i className="b-kv"></i>1 kısa vade</span>
              </div>
              <div className="vrow"><span className="vlabel">Ortalama hedef</span><span className="mono">420,00 ₺</span></div>
              <div className="vrow"><span className="vlabel">7 günlük değişim</span><span className="mono up">▲ +2 kurum</span></div>
              <div className="vrow"><span className="vlabel">Kaynak belge</span><span className="mono" style={{"color": "var(--navy)"}}>13 PDF →</span></div>
            </div>
          </div>

          <div className="frow rev rv">
            <div>
              <h3>Portföyün gerçek karnesi</h3>
              <p>Portföyünü elle girersin; PARENA hiçbir aracı kurum hesabına veya paranıza erişmez.
              Karşılığında <span className="kw">her pozisyonun konsensüse göre nerede durduğunu</span>, hangi kararın kazandırdığını ve
              hangisinin şans eseri olduğunu ayrıştıran bir performans dökümü alırsın.</p>
            </div>
            <div className="fvis">
              <div className="vrow"><span className="vlabel">Portföy değeri</span><span className="mono">184.320 ₺</span></div>
              <div className="vrow"><span className="vlabel">30 günlük getiri</span><span className="mono up">▲ %6,4</span></div>
              <div className="vrow"><span className="vlabel">BIST 100 farkı</span><span className="mono up">▲ %2,1</span></div>
              <div className="vrow"><span className="vlabel">Model portföylerle örtüşme</span><span className="mono">%58</span></div>
              <div className="vrow"><span className="vlabel">Konsensüse ters pozisyon</span><span className="mono" style={{"color": "var(--sell)"}}>2 hisse</span></div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
