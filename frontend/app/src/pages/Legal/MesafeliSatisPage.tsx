import { LegalLayout } from "@/components/legal/LegalLayout";

export const mesafeliSatisPageMeta = {
  title: 'Mesafeli Satış Sözleşmesi | PARENA',
  description: 'PARENA dijital abonelik hizmetine ilişkin mesafeli satış sözleşmesi: bedel, ifa, cayma hakkı, otomatik yenileme ve uyuşmazlık çözümü.',
  ogTitle: 'Mesafeli Satış Sözleşmesi | PARENA',
  ogDescription: 'PARENA dijital abonelik hizmetine ilişkin mesafeli satış sözleşmesi: bedel, ifa, cayma hakkı, otomatik yenileme ve uyuşmazlık çözümü.',
};

export default function MesafeliSatisPage() {
  return (
    <LegalLayout>

<div className="wrap head">
  <p className="eyebrow">Yasal</p>
  <h1>Mesafeli Satış Sözleşmesi</h1>
  <p className="meta">
    <span>Yürürlük tarihi: <b><span className="fill">[GG.AA.YYYY]</span></b></span>
    <span>Son güncelleme: <b><span className="fill">[GG.AA.YYYY]</span></b></span>
    <span>Sürüm: <b>1.0</b></span>
  </p>
</div>

<div className="wrap">
  <nav className="toc" aria-label="Bölümler">
    <h2>İçindekiler</h2>
    <ol>
      <li><a href="#m1">Taraflar</a></li>
      <li><a href="#m2">Sözleşmenin konusu</a></li>
      <li><a href="#m3">Hizmetin temel nitelikleri ve bedeli</a></li>
      <li><a href="#m4">Genel hükümler</a></li>
      <li><a href="#m5">İfa ve hizmete erişim</a></li>
      <li><a href="#m6">Abonelik ve otomatik yenileme</a></li>
      <li><a href="#m7">Cayma hakkı ve istisnası</a></li>
      <li><a href="#m8">Fesih ve iade</a></li>
      <li><a href="#m9">Temerrüt hâli</a></li>
      <li><a href="#m10">Şikâyet ve uyuşmazlık çözümü</a></li>
      <li><a href="#m11">Delil sözleşmesi</a></li>
      <li><a href="#m12">Yürürlük</a></li>
    </ol>
  </nav>

  <article className="doc" id="belge">

    <section id="m1">
      <h2>Taraflar</h2>
      <h3>Satıcı / Sağlayıcı</h3>
      <table>
        <tbody>
          <tr><th scope="row">Ticari unvan</th><td><span className="fill">[TİCARİ UNVAN]</span></td></tr>
          <tr><th scope="row">Adres</th><td><span className="fill">[AÇIK ADRES, İLÇE/İL]</span></td></tr>
          <tr><th scope="row">MERSİS no</th><td><span className="fill">[MERSİS NUMARASI]</span></td></tr>
          <tr><th scope="row">Vergi dairesi / no</th><td><span className="fill">[VERGİ DAİRESİ VE NUMARASI]</span></td></tr>
          <tr><th scope="row">Telefon</th><td><span className="fill">[TELEFON NUMARASI]</span></td></tr>
          <tr><th scope="row">E-posta</th><td>destek@parena.com.tr</td></tr>
        </tbody>
      </table>
      <h3>Alıcı</h3>
      <p>Platform üzerinde üyelik kaydını tamamlayan ve ödeme adımında işbu sözleşmeyi elektronik ortamda onaylayan kişi ("Alıcı"). Alıcı'nın ad, soyad, e-posta ve fatura bilgileri sipariş kaydında yer alır ve sipariş özeti Alıcı'ya e-posta ile iletilir.</p>
      <div className="note">Alıcı, bu sözleşmenin bir örneğini kayıt e-postasında alır ve dilediği zaman hesap ekranından görüntüleyebilir.</div>
    </section>

    <section id="m2">
      <h2>Sözleşmenin konusu</h2>
      <p>İşbu sözleşmenin konusu, Alıcı'nın Platform üzerinden elektronik ortamda siparişini verdiği, aşağıda nitelikleri ve bedeli belirtilen dijital abonelik hizmetinin satışı ve ifasına ilişkin olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri uyarınca tarafların hak ve yükümlülüklerinin belirlenmesidir.</p>
    </section>

    <section id="m3">
      <h2>Hizmetin temel nitelikleri ve bedeli</h2>
      <p>Hizmet; SPK lisanslı aracı kurumların kamuya açık araştırma yayınlarındaki hisse senedi görüşlerinin derlendiği, karşılaştırıldığı ve sonuçlarının istatistiksel olarak sunulduğu web tabanlı bir dijital abonelik hizmetidir.</p>
      <table>
        <thead><tr><th>Hizmet</th><th>Dönem</th><th>Bedel (KDV dâhil)</th></tr></thead>
        <tbody>
          <tr><td>PARENA Kurucu Üyelik (ilk 150 üye ile sınırlı)</td><td>Aylık</td><td>149,00 TL</td></tr>
          <tr><td>PARENA Kurucu Üyelik (ilk 150 üye ile sınırlı)</td><td>Yıllık</td><td>1.490,00 TL</td></tr>
          <tr><td>PARENA Standart Üyelik</td><td>Aylık</td><td>249,00 TL</td></tr>
        </tbody>
      </table>
      <p><strong>Ödeme yöntemi:</strong> Kredi/banka kartı ile, ödeme kuruluşu iyzico'nun güvenli ödeme sayfası üzerinden. Kart bilgileri Satıcı tarafından saklanmaz.</p>
      <p><strong>Ek masraf:</strong> Hizmet dijital ortamda ifa edildiğinden kargo, teslimat veya benzeri bir ek masraf bulunmamaktadır.</p>
      <div className="callout">
        <p><strong>Hizmetin niteliğine ilişkin uyarı:</strong> Platform yatırım danışmanlığı, portföy yöneticiliği veya yatırım tavsiyesi hizmeti sunmaz. Sunulan içerik yalnızca bilgilendirme amaçlıdır ve yatırım kararlarının sorumluluğu münhasıran Alıcı'ya aittir. Ayrıntı için <a href="/kullanim-sartlari">Kullanım Şartları</a>'nın 3. maddesine bakınız.</p>
      </div>
    </section>

    <section id="m4">
      <h2>Genel hükümler</h2>
      <ul>
        <li>Alıcı, sipariş vermeden önce hizmetin temel nitelikleri, vergiler dâhil toplam bedeli, ödeme ve ifa şekli ile cayma hakkına ilişkin bilgileri okuyup anladığını ve gerekli teyidi elektronik ortamda verdiğini kabul eder.</li>
        <li>Alıcı, 18 yaşını doldurduğunu ve fiil ehliyetine sahip olduğunu beyan eder.</li>
        <li>Ön bilgilendirme ve işbu sözleşme, Alıcı'nın e-posta adresine gönderilir ve hesap ekranından erişilebilir durumda tutulur.</li>
        <li>Hizmet kişisel kullanım içindir; üçüncü kişilerle paylaşılamaz veya ticari amaçla yeniden sunulamaz.</li>
      </ul>
    </section>

    <section id="m5">
      <h2>İfa ve hizmete erişim</h2>
      <p>Ödemenin ilgili ödeme kuruluşu tarafından onaylanmasının ardından hizmetin ifasına <strong>derhal</strong> başlanır ve Alıcı'nın hesabında ilgili modüller aynı anda açılır. Ayrı bir teslimat süreci bulunmamaktadır.</p>
      <p>Ödemenin herhangi bir nedenle gerçekleşmemesi veya iptal edilmesi hâlinde Satıcı'nın hizmeti ifa yükümlülüğü sona erer.</p>
      <p>Hizmet, Alıcı'nın internet erişimi bulunan bir cihaz ve güncel bir web tarayıcısı üzerinden kullanılabilir. Bu teknik gereklilikler Alıcı'nın sorumluluğundadır.</p>
    </section>

    <section id="m6">
      <h2>Abonelik ve otomatik yenileme</h2>
      <p>Üyelik, seçilen dönemin (aylık veya yıllık) sonunda aynı takvim gününde <strong>otomatik olarak yenilenir</strong> ve bedel aynı ödeme yöntemiyle tahsil edilir.</p>
      <p>Alıcı, yenileme tarihinden en az <strong>7 (yedi) gün</strong> önce destek@parena.com.tr adresine yazılı bildirimde bulunarak otomatik yenilemeyi durdurabilir. Bildirimin ardından yeni tahsilat yapılmaz; ödemesi yapılmış dönemin sonuna kadar erişim devam eder.</p>
      <p>Bedelde yapılacak ve mevcut üyeleri etkileyecek her değişiklik, yürürlüğe girmesinden en az <strong>30 (otuz) gün</strong> önce Alıcı'ya e-posta ile bildirilir. Alıcı bu süre içinde üyeliğini cezai şart ödemeksizin sonlandırabilir.</p>
    </section>

    <section id="m7">
      <h2>Cayma hakkı ve istisnası</h2>
      <p>Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesinin birinci fıkrasının (ğ) bendi uyarınca, <strong>elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmelerde cayma hakkı kullanılamaz.</strong></p>
      <p>Bu nedenle Alıcı, ödeme adımında aşağıdaki beyanı açıkça onaylar:</p>
      <div className="note">"Dijital içerik hizmetinin ifasına derhal başlanmasını talep ediyorum. Bu onayımla birlikte 14 günlük cayma hakkımdan feragat ettiğimi kabul ve beyan ederim."</div>
      <p>Söz konusu onay verilmediği sürece ifaya başlanmaz ve ödeme alınmaz. Onayın verilmesiyle birlikte ifa başladığından cayma hakkı kullanılamaz.</p>
      <p>Bu istisna, hizmetin hiç ifa edilmemesi veya ayıplı ifa hâllerinde Alıcı'nın 6502 sayılı Kanun'dan doğan seçimlik haklarını ortadan kaldırmaz.</p>
    </section>

    <section id="m8">
      <h2>Fesih ve iade</h2>
      <p><strong>Alıcı kaynaklı fesih:</strong> Alıcı üyeliğini dilediği zaman sonlandırabilir. Bedeli tahsil edilmiş ve kullanımına açılmış dönem için iade yapılmaz; erişim dönem sonuna kadar sürer.</p>
      <p><strong>Satıcı kaynaklı kesinti:</strong> Satıcı'ya atfedilebilen ve <span className="fill">[X]</span> saatten uzun süren kesintilerde Alıcı, kesinti süresine karşılık gelen bedelin iadesini veya üyelik süresinin eşdeğer sürede uzatılmasını talep edebilir.</p>
      <p><strong>Hizmetin sunulamaması:</strong> Hizmetin ifasının imkânsız hâle gelmesi durumunda Satıcı, Alıcı'yı en geç 3 gün içinde bilgilendirir ve tahsil edilen bedeli bildirim tarihinden itibaren <strong>14 gün</strong> içinde iade eder.</p>
      <p>İadeler, ödemenin yapıldığı yöntemle ve aynı hesaba gerçekleştirilir. Bankaya bağlı yansıma süreleri Satıcı'nın kontrolünde değildir.</p>
    </section>

    <section id="m9">
      <h2>Temerrüt hâli</h2>
      <p>Alıcı'nın kredi kartı ile yaptığı ödemelerde temerrüde düşmesi hâlinde, kart sahibi banka ile arasındaki kredi kartı sözleşmesi çerçevesinde bankaya karşı sorumlu olacağını kabul eder. Bu durumda ilgili banka hukuki yollara başvurabilir ve doğacak masrafları Alıcı'dan talep edebilir.</p>
      <p>Ödemenin herhangi bir nedenle gerçekleşmemesi hâlinde Satıcı, üyelik erişimini askıya alma hakkına sahiptir.</p>
    </section>

    <section id="m10">
      <h2>Şikâyet ve uyuşmazlık çözümü</h2>
      <p>Alıcı, hizmete ilişkin şikâyet ve taleplerini destek@parena.com.tr adresine iletebilir. Talepler en geç <span className="fill">[X]</span> iş günü içinde yanıtlanır.</p>
      <p>İşbu sözleşmeden doğan uyuşmazlıklarda Alıcı; 6502 sayılı Kanun ve ilgili yönetmelikler uyarınca, her yıl Ticaret Bakanlığı tarafından belirlenen parasal sınırlar dâhilinde ikametgâhının veya işlemin yapıldığı yerin <strong>Tüketici Hakem Heyeti</strong>'ne, bu sınırların üzerindeki uyuşmazlıklarda <strong>Tüketici Mahkemeleri</strong>'ne başvurabilir.</p>
      <p>Alıcı ayrıca Ticaret Bakanlığı'nın <strong>Tüketici Bilgi Sistemi (TÜBİS)</strong> üzerinden elektronik başvuruda bulunabilir.</p>
    </section>

    <section id="m11">
      <h2>Delil sözleşmesi</h2>
      <p>Taraflar, işbu sözleşmeden doğabilecek uyuşmazlıklarda Satıcı'nın sistem kayıtlarının, elektronik ödeme kayıtlarının ve e-posta yazışmalarının 6100 sayılı Hukuk Muhakemeleri Kanunu'nun 193. maddesi anlamında <strong>kesin delil</strong> teşkil edeceğini kabul eder. Bu hüküm, tüketici mevzuatının emredici hükümlerini ortadan kaldırmaz.</p>
    </section>

    <section id="m12">
      <h2>Yürürlük</h2>
      <p>On iki maddeden ibaret işbu sözleşme, Alıcı tarafından elektronik ortamda okunup onaylanmak suretiyle kurulmuş ve yürürlüğe girmiştir. Sözleşmenin bir örneği Alıcı'nın e-posta adresine gönderilir.</p>
    </section>

  </article>
</div>

    </LegalLayout>
  );
}
