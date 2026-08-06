import { LegalLayout } from "@/components/legal/LegalLayout";

export const kullanimSartlariPageMeta = {
  title: 'Kullanım Şartları ve Üyelik Sözleşmesi | PARENA',
  description: 'PARENA platformunun kullanım şartları, üyelik sözleşmesi, ücretlendirme, cayma hakkı ve sorumluluk sınırlarına ilişkin hükümler.',
  ogTitle: 'Kullanım Şartları ve Üyelik Sözleşmesi | PARENA',
  ogDescription: 'PARENA platformunun kullanım şartları, üyelik sözleşmesi, ücretlendirme, cayma hakkı ve sorumluluk sınırlarına ilişkin hükümler.',
};

export default function KullanimSartlariPage() {
  return (
    <LegalLayout>

<div className="wrap head">
  <p className="eyebrow">Yasal</p>
  <h1>Kullanım Şartları ve Üyelik Sözleşmesi</h1>
  <p className="meta">
    <span>Yürürlük tarihi: <b><span className="fill">[GG.AA.YYYY]</span></b></span>
    <span>Son güncelleme: <b><span className="fill">[GG.AA.YYYY]</span></b></span>
    <span>Sürüm: <b>1.0</b></span>
  </p>
</div>

<div className="wrap">
  <nav className="toc" aria-label="Sözleşme bölümleri">
    <h2>İçindekiler</h2>
    <ol>
      <li><a href="#m1">Taraflar ve tanımlar</a></li>
      <li><a href="#m2">Sözleşmenin konusu</a></li>
      <li><a href="#m3">Hizmetin niteliği ve yatırım danışmanlığı çekincesi</a></li>
      <li><a href="#m4">Üyelik ve hesap koşulları</a></li>
      <li><a href="#m5">Ücretlendirme ve ödeme</a></li>
      <li><a href="#m6">Otomatik yenileme ve fiyat değişikliği</a></li>
      <li><a href="#m7">Cayma hakkı</a></li>
      <li><a href="#m8">Üyeliğin sona ermesi ve fesih</a></li>
      <li><a href="#m9">Üyenin yükümlülükleri</a></li>
      <li><a href="#m10">Fikri mülkiyet hakları</a></li>
      <li><a href="#m11">Hizmet sürekliliği ve mücbir sebep</a></li>
      <li><a href="#m12">Sorumluluğun sınırlandırılması</a></li>
      <li><a href="#m13">Kişisel verilerin korunması</a></li>
      <li><a href="#m14">Ticari elektronik ileti</a></li>
      <li><a href="#m15">Sözleşme değişiklikleri</a></li>
      <li><a href="#m16">Uyuşmazlık çözümü ve yetkili merciler</a></li>
      <li><a href="#m17">Yürürlük</a></li>
    </ol>
  </nav>

  <article className="doc" id="sozlesme">

    <section id="m1">
      <h2>Taraflar ve tanımlar</h2>
      <p>İşbu Kullanım Şartları ve Üyelik Sözleşmesi ("Sözleşme"), aşağıda bilgileri yer alan hizmet sağlayıcı ile Platform'a üye olan gerçek kişi arasında akdedilmiştir.</p>

      <h3>Hizmet sağlayıcı</h3>
      <table>
        <tbody>
          <tr><th scope="row">Ticari unvan</th><td><span className="fill">[TİCARİ UNVAN — örn. PARENA Bilişim ve Teknoloji A.Ş.]</span></td></tr>
          <tr><th scope="row">Adres</th><td><span className="fill">[AÇIK ADRES, İLÇE/İL]</span></td></tr>
          <tr><th scope="row">MERSİS no</th><td><span className="fill">[MERSİS NUMARASI]</span></td></tr>
          <tr><th scope="row">Vergi dairesi / no</th><td><span className="fill">[VERGİ DAİRESİ VE NUMARASI]</span></td></tr>
          <tr><th scope="row">E-posta</th><td>destek@parena.com.tr</td></tr>
          <tr><th scope="row">İnternet sitesi</th><td>parena.com.tr</td></tr>
        </tbody>
      </table>

      <h3>Tanımlar</h3>
      <ul>
        <li><strong>Platform:</strong> parena.com.tr alan adı ve alt alan adlarında sunulan web tabanlı hizmetin tamamı.</li>
        <li><strong>Üye:</strong> Platform'a kayıt olan ve işbu Sözleşme'yi kabul eden gerçek kişi.</li>
        <li><strong>Ücretsiz Üyelik:</strong> Bedelsiz kayıtla elde edilen, topluluk kanalına erişim sağlayan üyelik tipi.</li>
        <li><strong>Ücretli Üyelik:</strong> Aylık veya yıllık bedel karşılığında Platform'un tüm modüllerine erişim sağlayan üyelik tipi.</li>
        <li><strong>İçerik:</strong> Sermaye Piyasası Kurulu ("SPK") lisanslı aracı kurumların kamuya açık yayınlarından derlenen veriler ile Platform'un bu veriler üzerinde ürettiği istatistiksel hesaplamalar.</li>
      </ul>
    </section>

    <section id="m2">
      <h2>Sözleşmenin konusu</h2>
      <p>İşbu Sözleşme'nin konusu; Platform'un sunduğu dijital hizmetin kapsamının, Üye'nin hak ve yükümlülüklerinin, ücretlendirme koşullarının ve tarafların sorumluluk sınırlarının belirlenmesidir.</p>
      <p>Üye, kayıt işlemini tamamlayarak işbu Sözleşme'nin tamamını okuduğunu, anladığını ve kabul ettiğini beyan eder.</p>
    </section>

    <section id="m3">
      <h2>Hizmetin niteliği ve yatırım danışmanlığı çekincesi</h2>
      <p>Platform; SPK lisanslı aracı kurumların kamuya açık olarak yayımladığı araştırma raporlarındaki hisse senedi görüşlerini derleyen, karşılaştıran ve bu görüşlerin olgusal sonuçlarını istatistiksel olarak sunan bir <strong>bilgi toplulaştırma (aggregasyon) platformudur.</strong></p>

      <div className="callout">
        <p><strong>Platform hiçbir koşulda yatırım danışmanlığı, portföy yöneticiliği, yatırım tavsiyesi veya finansal danışmanlık hizmeti sunmaz.</strong></p>
        <p>Yatırım danışmanlığı hizmeti, 6362 sayılı Sermaye Piyasası Kanunu uyarınca yalnızca yetkili kuruluşlar tarafından, kişilerin risk ve getiri tercihleri dikkate alınarak ve imzalanacak bir yatırım danışmanlığı sözleşmesi çerçevesinde sunulabilir.</p>
        <p>Platform'da yer alan görüş ve tavsiyeler, bunları yayımlayan aracı kurumlara aittir. Platform kendi adına hiçbir alım, satım veya derecelendirme önerisi üretmez. İçeriğe dayanılarak verilecek yatırım kararlarının ve bu kararlardan doğabilecek her türlü zararın sorumluluğu münhasıran Üye'ye aittir.</p>
      </div>

      <p>Platform'da yer alan geçmiş performans verileri, isabet oranları ve simülasyon sonuçları geleceğe yönelik sonuçların garantisi değildir. Sermaye piyasası işlemleri, anaparanın tamamının kaybı dâhil olmak üzere risk içerir.</p>
      <p>Platform, verilerin doğruluğu, güncelliği veya eksiksizliği konusunda garanti vermez. Kaynak yayınlardaki hata, gecikme veya eksiklikler Platform'un sorumluluğunda değildir.</p>
    </section>

    <section id="m4">
      <h2>Üyelik ve hesap koşulları</h2>
      <ul>
        <li>Üyelik yalnızca <strong>18 yaşını doldurmuş, fiil ehliyetine sahip gerçek kişiler</strong> tarafından oluşturulabilir.</li>
        <li>Üyelik kişiseldir; başkasına devredilemez, kiralanamaz veya paylaşılamaz.</li>
        <li>Bir hesapta yalnızca <strong>tek aktif oturum</strong> bulunabilir. Yeni bir cihazdan giriş yapıldığında önceki oturum sonlandırılır.</li>
        <li>Bir Telegram hesabı yalnızca bir üyeliğe bağlanabilir.</li>
        <li>24 saat içinde farklı cihaz veya IP adreslerinden üçten fazla giriş denemesi yapılması hâlinde hesap güvenlik incelemesine alınabilir.</li>
        <li>Üye, kayıt sırasında verdiği bilgilerin doğru ve güncel olduğunu; hesap erişim bilgilerinin gizliliğinden bizzat sorumlu olduğunu kabul eder.</li>
        <li>Hesap bilgilerinin yetkisiz kullanıldığını fark eden Üye, durumu gecikmeksizin destek@parena.com.tr adresine bildirmekle yükümlüdür.</li>
      </ul>
    </section>

    <section id="m5">
      <h2>Ücretlendirme ve ödeme</h2>
      <table>
        <thead><tr><th>Üyelik tipi</th><th>Bedel</th><th>Kapsam</th></tr></thead>
        <tbody>
          <tr><td>Ücretsiz Üyelik</td><td>0 TL</td><td>Topluluk kanalına erişim ve duyurular</td></tr>
          <tr><td>Kurucu Üyelik</td><td>149 TL / ay veya 1.490 TL / yıl</td><td>İlk 150 üye ile sınırlıdır; tüm modüller</td></tr>
          <tr><td>Standart Üyelik</td><td>249 TL / ay</td><td>Kurucu kontenjanı dolduktan sonra; tüm modüller</td></tr>
        </tbody>
      </table>
      <p>Belirtilen bedellere ilgili vergiler dâhildir. Ödemeler, ödeme kuruluşu <strong>iyzico</strong> altyapısı üzerinden tahsil edilir. Üye'nin kart bilgileri Platform sunucularında saklanmaz.</p>
      <p>Ödeme onaylanmadan Ücretli Üyelik aktifleştirilmez. Ödemenin doğrulanmasının ardından hizmetin ifasına dijital ortamda derhal başlanır.</p>
    </section>

    <section id="m6">
      <h2>Otomatik yenileme ve fiyat değişikliği</h2>
      <p><strong>Otomatik yenileme:</strong> Ücretli Üyelik, ilk ödeme tarihinden itibaren seçilen dönem (aylık veya yıllık) sonunda, aynı takvim gününde otomatik olarak yenilenir ve bedel aynı ödeme yöntemi üzerinden tahsil edilir.</p>
      <p><strong>Yenilemenin durdurulması:</strong> Üye, yenileme tarihinden en az <strong>7 (yedi) gün</strong> önce destek@parena.com.tr adresine yazılı talep göndererek otomatik yenilemeyi durdurabilir. Talebin alındığı tarihten sonra yeni tahsilat yapılmaz; içinde bulunulan dönemin sonuna kadar erişim devam eder.</p>
      <p><strong>Fiyat değişikliği:</strong> Platform, üyelik bedellerinde değişiklik yapma hakkını saklı tutar. Mevcut üyeler için geçerli olacak her fiyat değişikliği, yürürlüğe girmesinden <strong>en az 30 (otuz) gün önce</strong> Üye'ye e-posta ile bildirilir. Üye, yeni bedeli kabul etmemesi hâlinde bu süre içinde üyeliğini herhangi bir cezai şart ödemeksizin sonlandırabilir. Süre içinde fesih bildiriminde bulunulmaması, yeni bedelin kabulü sayılır.</p>
      <div className="note">Kurucu Üyelik kontenjanının dolması, mevcut kurucu üyelerin bedelinde kendiliğinden bir artışa yol açmaz; kontenjan sonrası bedel yalnızca yeni üyeler için geçerlidir. Mevcut üyelere yönelik her türlü bedel değişikliği bu maddedeki 30 günlük bildirim usulüne tabidir.</div>
    </section>

    <section id="m7">
      <h2>Cayma hakkı</h2>
      <p>Mesafeli Sözleşmeler Yönetmeliği'nin 15/1-(ğ) maddesi uyarınca, <strong>elektronik ortamda anında ifa edilen hizmetler ile tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmelerde cayma hakkı kullanılamaz.</strong></p>
      <p>Üye, ödeme adımında aşağıdaki beyanı açıkça onaylar:</p>
      <div className="note">"Dijital içerik hizmetinin ifasına derhal başlanmasını talep ediyorum. Bu onayımla birlikte 14 günlük cayma hakkımdan feragat ettiğimi kabul ve beyan ederim."</div>
      <p>Bu onay verilmediği sürece hizmetin ifasına başlanmaz. Onay verilmesi hâlinde, ifa başladığından cayma hakkı kullanılamaz ve tahsil edilen bedel iade edilmez.</p>
      <p>Platform kaynaklı, <span className="fill">[X]</span> saatten uzun süren ve Platform'a atfedilebilen kesintiler hâlinde Üye, kesinti süresine karşılık gelen bedelin iadesini veya üyelik süresinin uzatılmasını talep edebilir.</p>
    </section>

    <section id="m8">
      <h2>Üyeliğin sona ermesi ve fesih</h2>
      <h3>Üye tarafından fesih</h3>
      <p>Üye, dilediği zaman destek@parena.com.tr adresine yazılı bildirimde bulunarak üyeliğini sonlandırabilir. Yenileme tarihinden en az 7 gün önce yapılan bildirimlerde yeni tahsilat gerçekleşmez. İçinde bulunulan ve bedeli tahsil edilmiş dönem için iade yapılmaz; erişim dönem sonuna kadar devam eder.</p>
      <h3>Platform tarafından fesih</h3>
      <p>İşbu Sözleşme'nin ihlali hâlinde Üye'ye e-posta ile uyarı yapılır. Üye'nin açıklama yapması için 7 günlük süre tanınır. Bu süre sonunda ihlalin giderilmemesi veya açıklamanın yeterli görülmemesi hâlinde üyelik feshedilebilir.</p>
      <p>Aşağıdaki hâllerde uyarı yapılmaksızın derhal fesih uygulanabilir:</p>
      <ul>
        <li>Hesabın ticari amaçla üçüncü kişilere kullandırılması veya satılması</li>
        <li>İçeriğin sistematik olarak kopyalanması, otomatik araçlarla toplanması (scraping) veya yeniden yayımlanması</li>
        <li>Platform'un teknik altyapısına yönelik yetkisiz erişim girişimleri</li>
        <li>Ödeme aracının hukuka aykırı kullanımı veya haksız ters ibraz (chargeback) talebi</li>
      </ul>
      <p>Haklı nedenle fesih hâlinde tahsil edilmiş bedeller iade edilmez ve Platform'un tazminat hakları saklıdır.</p>
    </section>

    <section id="m9">
      <h2>Üyenin yükümlülükleri</h2>
      <p>Üye aşağıdaki fiillerden kaçınmayı taahhüt eder:</p>
      <ul>
        <li>Platform içeriğini kısmen veya tamamen kopyalamak, çoğaltmak, dağıtmak, satmak veya başka bir mecrada yayımlamak</li>
        <li>Otomatik yazılım, bot, örümcek veya benzeri araçlarla toplu veri çekmek</li>
        <li>Hesap bilgilerini üçüncü kişilerle paylaşmak</li>
        <li>Platform'un çalışmasını engelleyecek, yavaşlatacak veya güvenliğini tehlikeye atacak eylemlerde bulunmak</li>
        <li>Platform verilerini kullanarak üçüncü kişilere yatırım tavsiyesi niteliğinde hizmet sunmak</li>
        <li>Yürürlükteki mevzuata aykırı herhangi bir amaçla Platform'u kullanmak</li>
      </ul>
    </section>

    <section id="m10">
      <h2>Fikri mülkiyet hakları</h2>
      <p>Platform'un tasarımı, yazılımı, veri tabanı yapısı, marka ve logosu ile Platform tarafından üretilen istatistiksel hesaplamalar, sıralamalar ve karne verileri üzerindeki tüm fikri ve sınai mülkiyet hakları hizmet sağlayıcıya aittir ve 5846 sayılı Fikir ve Sanat Eserleri Kanunu ile ilgili mevzuat kapsamında korunmaktadır.</p>
      <p>Kaynak araştırma raporlarındaki içeriğin hakları, bu raporları yayımlayan ilgili aracı kurumlara aittir. Platform bu içerikleri kaynak göstererek ve kamuya açık olmaları koşuluyla derler.</p>
      <p>Üyelik, Üye'ye yalnızca kişisel ve ticari olmayan kullanım için sınırlı, devredilemez ve münhasır olmayan bir erişim lisansı sağlar; herhangi bir mülkiyet hakkı devri anlamına gelmez.</p>
    </section>

    <section id="m11">
      <h2>Hizmet sürekliliği ve mücbir sebep</h2>
      <p>Platform, hizmetin kesintisiz sunulması için makul çabayı gösterir; ancak bakım, güncelleme, altyapı sağlayıcı kaynaklı arıza veya benzeri nedenlerle geçici kesintiler yaşanabilir. Planlı bakım çalışmaları mümkün olduğunca önceden duyurulur.</p>
      <p>Doğal afet, salgın, savaş, siber saldırı, kamu otoritesi kararları, elektrik veya internet altyapısındaki genel kesintiler ve tarafların kontrolü dışındaki benzeri hâller mücbir sebep sayılır. Mücbir sebep süresince tarafların yükümlülükleri askıya alınır ve bu süre boyunca ifa edilemeyen edimler nedeniyle taraflar birbirine karşı sorumlu tutulamaz.</p>
      <p>Platform, veri kaynağı olan aracı kurumların yayın politikalarını değiştirmesi, yayınlarını durdurması veya erişimi kısıtlaması hâlinde kapsamda değişikliğe gitme hakkını saklı tutar. Bu tür bir değişiklik hizmetin özünü esaslı biçimde etkiliyorsa Üye'ye bildirilir ve Üye üyeliğini feshedebilir.</p>
    </section>

    <section id="m12">
      <h2>Sorumluluğun sınırlandırılması</h2>
      <p>Platform, İçerik'in yalnızca bilgilendirme amaçlı olduğunu; verilerin doğruluğu, güncelliği ve eksiksizliği konusunda taahhütte bulunmadığını beyan eder.</p>
      <p>Platform, Üye'nin yatırım kararları sonucunda uğrayabileceği doğrudan veya dolaylı zararlardan, kâr kaybından, veri kaybından veya üçüncü kişilerin taleplerinden sorumlu tutulamaz.</p>
      <p>Platform'un işbu Sözleşme kapsamındaki toplam sorumluluğu, her hâlükârda Üye'nin talebe konu olayın gerçekleştiği tarihten önceki 12 ay içinde ödediği toplam üyelik bedeli ile sınırlıdır.</p>
      <p>Bu maddedeki sınırlamalar, Platform'un kastından veya ağır ihmalinden doğan sorumluluk ile tüketici mevzuatının emredici hükümleri saklı kalmak kaydıyla uygulanır.</p>
    </section>

    <section id="m13">
      <h2>Kişisel verilerin korunması</h2>
      <p>Üye'ye ait kişisel veriler, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, <a href="/kvkk">KVKK Aydınlatma Metni</a>'nde belirtilen amaç, hukuki sebep ve saklama süreleri çerçevesinde işlenir.</p>
      <p>Veri sorumlusu: <span className="fill">[TİCARİ UNVAN]</span> — destek@parena.com.tr</p>
      <p>Üye, KVKK'nın 11. maddesinde sayılan haklarını kullanmak üzere destek@parena.com.tr adresine başvurabilir. Başvurular en geç 30 gün içinde sonuçlandırılır.</p>
    </section>

    <section id="m14">
      <h2>Ticari elektronik ileti</h2>
      <p>Platform, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun uyarınca, yalnızca Üye'nin açık rızası bulunması hâlinde tanıtım, kampanya ve bilgilendirme amaçlı ticari elektronik ileti gönderir.</p>
      <p>Üyelik işlemleri, ödeme bildirimleri, güvenlik uyarıları ve sözleşme değişikliği duyuruları gibi hizmetin ifasına ilişkin zorunlu bildirimler ticari elektronik ileti kapsamında değildir ve rıza aranmaksızın gönderilir.</p>
      <p>Üye, ticari elektronik ileti almayı her zaman ücretsiz olarak reddedebilir. Ret bildirimi, gönderilen iletideki bağlantı üzerinden veya destek@parena.com.tr adresine yazılarak yapılabilir ve en geç 3 iş günü içinde işleme alınır.</p>
    </section>

    <section id="m15">
      <h2>Sözleşme değişiklikleri</h2>
      <p>Platform, işbu Sözleşme'yi tek taraflı olarak değiştirme hakkını saklı tutar. Üye aleyhine sonuç doğuran esaslı değişiklikler, yürürlüğe girmesinden en az 30 gün önce e-posta ile ve Platform üzerinden Üye'ye bildirilir.</p>
      <p>Üye, değişiklikleri kabul etmemesi hâlinde bu süre içinde üyeliğini feshedebilir. Bildirimden sonra Platform'un kullanılmaya devam edilmesi, değişikliklerin kabulü anlamına gelir.</p>
      <p>Güncel sürüm her zaman bu sayfada, yürürlük tarihiyle birlikte yayımlanır.</p>
    </section>

    <section id="m16">
      <h2>Uyuşmazlık çözümü ve yetkili merciler</h2>
      <p>Taraflar, uyuşmazlıkların öncelikle destek@parena.com.tr adresi üzerinden iyi niyetle çözülmesi için çaba gösterir.</p>
      <p>Tüketici sıfatını haiz Üye, 6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca, parasal sınırlar dâhilinde ikametgâhının veya işlemin yapıldığı yerin <strong>Tüketici Hakem Heyeti</strong>'ne; bu sınırların üzerindeki uyuşmazlıklarda <strong>Tüketici Mahkemeleri</strong>'ne başvurabilir. Parasal sınırlar her yıl Ticaret Bakanlığı tarafından güncellenir.</p>
      <p>Tüketici sıfatı bulunmayan Üye bakımından, işbu Sözleşme'den doğan uyuşmazlıklarda <span className="fill">[İSTANBUL (ÇAĞLAYAN)]</span> Mahkemeleri ve İcra Daireleri yetkilidir.</p>
      <p>İşbu Sözleşme Türk hukukuna tabidir.</p>
    </section>

    <section id="m17">
      <h2>Yürürlük</h2>
      <p>On yedi maddeden ibaret işbu Sözleşme, Üye'nin elektronik ortamda onay vermesi ve kayıt işlemini tamamlaması ile karşılıklı olarak kabul edilmiş ve yürürlüğe girmiştir.</p>
      <p>Üye, Sözleşme'nin bir örneğine dilediği zaman bu sayfadan erişebilir ve destek@parena.com.tr adresine talep göndererek kayıt tarihindeki sürümün bir kopyasını isteyebilir.</p>
    </section>

  </article>
</div>

    </LegalLayout>
  );
}
