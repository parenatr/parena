import { AppLink } from "@/components/ui/app-link";

export function Faq() {
  return (
    <>
      <section className="sec">
        <div className="wrap">
          <div id="sss" className="sec-head rv">
            <p className="eyebrow">SSS</p>
            <h2>Sık sorulan sorular</h2>
            <p>Aklına takılan başka bir şey varsa <a href="mailto:destek@parena.com.tr" style={{"color": "var(--navy)", "fontWeight": "600"}}>destek@parena.com.tr</a> adresine yazabilirsin.</p>
          </div>

          <div className="faq rv">
            <details open={true}>
              <summary>PARENA yatırım tavsiyesi veriyor mu?</summary>
              <div className="ans">Hayır. PARENA, SPK lisanslı aracı kurumların kamuya açık raporlarındaki borsa görüşlerini derler, karşılaştırır ve sonuçlarını raporlar. Kendi adına hiçbir alım-satım önerisi veya derecelendirme üretmez. Yatırım danışmanlığı, yetkili kuruluşlarla imzalanan sözleşme çerçevesinde sunulur. Ayrıntı: <AppLink href="/kullanim-sartlari#m3">Kullanım Şartları, madde 3</AppLink>.</div>
            </details>
            <details>
              <summary>Borsa verileri nereden geliyor?</summary>
              <div className="ans">Yalnızca SPK lisanslı aracı kurumların kamuya açık olarak yayınladığı günlük bülten ve araştırma raporlarından. Her önerinin yanında kaynak belgenin bağlantısı bulunur; dilediğin an orijinal PDF'i açıp doğrulayabilirsin.</div>
            </details>
            <details>
              <summary>İsabet oranı nasıl hesaplanıyor?</summary>
              <div className="ans">Piyasa verileri 10:00 itibarıyla akmaya başlar. Kapanışın ardından günlük öneriler, haftalık öneriler, model portföyler ve kısa vadeli fırsatların tamamı kapanış verisiyle karşılaştırılır; her biri için isabet ve kâr/zarar ayrı hesaplanır. Sonuçlar 18:30'da yayımlanan günlük bültenle kesinleşir ve geriye dönük değiştirilemez.</div>
            </details>
            <details>
              <summary>Sadece günlük öneriler mi takip ediliyor?</summary>
              <div className="ans">Hayır. Dört içerik tipi de ayrı ayrı takip edilir: günlük öneriler, haftalık öneriler, model portföyler ve kısa vadeli fırsatlar. Her biri için kâr/zarar ve isabet oranı bağımsız hesaplanır; böylece bir kurumun hangi vadede güçlü olduğunu görebilirsin.</div>
            </details>
            <details>
              <summary>Hangi kurum hangi sektörde isabetli, bunu görebilir miyim?</summary>
              <div className="ans">Evet. PARENA her kurumun isabet oranını ve ortalama kâr/zararını sektör bazında ayrı hesaplar. Bir kurum bankacılık hisselerinde güçlü olup enerjide zayıf olabilir; sektör analizi ekranı bu kırılımı gösterir, böylece baktığın hissenin sektöründe gerçekten sicili olan kurumu ayırt edersin.</div>
            </details>
            <details>
              <summary>PARENA ücretsiz mi?</summary>
              <div className="ans">Kayıt ücretsizdir ve ücretsiz hesapla PARENA Telegram topluluğuna katılabilirsin. Platformun kendisi (dört içerik tipi, kâr/zarar karnesi, sektör analizi, portföy takibi ve simülatör) ücretli üyelikle açılır: ilk 150 üye için 149 ₺/ay, 151. üyeden itibaren 249 ₺/ay.</div>
            </details>
            <details>
              <summary>Portföyümü PARENA'ya nasıl bağlıyorum?</summary>
              <div className="ans">Portföyünü elle girersin. PARENA hiçbir aracı kurum hesabına, paranıza veya emir iletim sistemine erişmez; API bağlantısı istemez. Yalnızca girdiğin hisse, adet ve maliyet bilgisiyle takip ve karne hesaplaması yapar. Verilerinin nasıl işlendiğini <AppLink href="/gizlilik">Gizlilik Politikası</AppLink>'nda bulabilirsin.</div>
            </details>
            <details>
              <summary>Ödeme güvenli mi?</summary>
              <div className="ans">Ödemeler iyzico'nun güvenli sayfası üzerinden alınır. Kart bilgilerin PARENA sunucularında saklanmaz. Yıllık ödemede iki ay hediye edilir. Ödeme, ifa ve cayma koşulları <AppLink href="/mesafeli-satis">Mesafeli Satış Sözleşmesi</AppLink>'nde düzenlenmiştir.</div>
            </details>
            <details>
              <summary>Hesabımı arkadaşımla paylaşabilir miyim?</summary>
              <div className="ans">Üyelik kişiseldir ve tek aktif oturumla çalışır. Yeni bir cihazdan giriş yapıldığında önceki oturum kapanır.</div>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
