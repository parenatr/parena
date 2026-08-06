import { AppLink } from "@/components/ui/app-link";

export function Pricing() {
  return (
    <>
      <section className="sec" style={{"background": "var(--surface)", "borderTop": "1px solid var(--line)"}}>
        <div className="wrap">
          <div id="fiyat" className="sec-head rv" style={{"maxWidth": "640px"}}>
            <p className="eyebrow">Fiyat</p>
            <h2>Ücretsiz başla, hazır olduğunda yükselt</h2>
            <p>Dört içerik tipinin tamamı ve sektör analizi tek pakette. Kurucu üyelik yalnızca ilk 150 kişi için geçerli; 151. üyeden itibaren fiyat 249 ₺/ay olarak devam edecek.</p>
          </div>

          <div className="price-wrap">

            <div className="pcard rv">
              <span className="ptag free">Ücretsiz</span>
              <p className="pname">Topluluk</p>
              <p className="pprice">0 ₺<small>/ay</small></p>
              <p className="pyear">Kart bilgisi istenmez</p>
              <ul className="plist">
                <li>PARENA Telegram topluluğuna katılım</li>
                <li>Topluluk içi piyasa sohbeti ve duyurular</li>
                <li>Yeni özelliklerden ve kontenjan durumundan ilk haberdar olma</li>
                <li className="off">Günlük, haftalık, model portföy ve kısa vadeli öneriler</li>
                <li className="off">Her önerinin kâr/zararı ve hedef fiyatlar</li>
                <li className="off">Sektör bazlı kurum isabet analizi</li>
                <li className="off">Portföy karnesi, konsensüs ve simülatör</li>
              </ul>
              <AppLink className="btn btn-ghost btn-block" href="/uye-ol?plan=topluluk" data-cta="plan-free">Topluluğa katıl</AppLink>
              <p className="pfoot">Kayıt 2 dakika sürer.<br />
                <AppLink href="/kullanim-sartlari">Kullanım Şartları</AppLink> ve <AppLink href="/gizlilik">Gizlilik Politikası</AppLink> geçerlidir.</p>
            </div>

            <div className="pcard hero-plan rv">
              <span className="ptag">Kurucu üye · ilk 150 kişi</span>
              <p className="pname">PARENA Premium</p>
              <p className="pprice">149 ₺<small>/ay</small><span className="pold">249 ₺</span></p>
              <p className="pyear">veya <strong>1.490 ₺/yıl</strong>, iki ay hediye</p>

              <div className="ladder" aria-label="Üyelik fiyat kademeleri">
                <div className="lstep on">
                  <span className="lrank">1 – 150. üye</span>
                  <span className="lprice">149 ₺<small>/ay</small></span>
                  <span className="lnote">Kurucu üye</span>
                </div>
                <span className="larrow" aria-hidden="true">→</span>
                <div className="lstep">
                  <span className="lrank">151. üyeden sonra</span>
                  <span className="lprice">249 ₺<small>/ay</small></span>
                  <span className="lnote">Standart</span>
                </div>
              </div>

              <div className="quota">
                <div className="quota-bar" role="progressbar" aria-valuemin={0} aria-valuemax={150} aria-valuenow={112} aria-label="Kurucu üyelik kontenjanı">
                  <i id="quotaFill" data-w="74.6"></i>
                </div>
                <p className="quota-txt"><span><b id="quotaNow">112</b> / 150 üye katıldı</span><span className="qleft"><b id="quotaLeft">38</b> kontenjan kaldı</span></p>
              </div>

              <ul className="plist">
                <li>Günlük, haftalık, model portföy ve kısa vadeli önerilerin tamamı + kaynak PDF</li>
                <li>Her önerinin kâr/zararı ve içerik tipine göre kurum sicili</li>
                <li>Sektör × kurum isabet analizi</li>
                <li>Portföy takibi, konsensüs ve hisse karşılaştırma</li>
                <li>Strateji simülatörü, model portföy rebalansı, KAP akışı</li>
                <li>Hisse ve kurum karşılaştırma, Telegram bildirimleri</li>
                <li>Kurucu üyelere özel Telegram kanalı ve yeni özelliklere ilk erişim</li>
              </ul>

              <AppLink className="btn btn-primary btn-block btn-lg" href="/uye-ol?plan=kurucu" data-cta="plan-premium">Kurucu üye ol · 149 ₺/ay</AppLink>
              <p className="pfoot">
                🔒 Ödeme iyzico'nun güvenli sayfasında tamamlanır; kart bilgilerin PARENA'da saklanmaz.<br />
                Kurucu kontenjanı dolduğunda üyelik 249 ₺/ay olarak devam eder.<br />
                Üyelik <AppLink href="/kullanim-sartlari">Kullanım Şartları</AppLink> ve
                <AppLink href="/mesafeli-satis">Mesafeli Satış Sözleşmesi</AppLink>'ne tabidir.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
