import { LegalLayout } from "@/components/legal/LegalLayout";

export const kvkkPageMeta = {
  title: 'KVKK Aydınlatma Metni | PARENA',
  description: '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında PARENA aydınlatma metni: işlenen veriler, amaçlar, hukuki sebepler ve haklarınız.',
  ogTitle: 'KVKK Aydınlatma Metni | PARENA',
  ogDescription: '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında PARENA aydınlatma metni: işlenen veriler, amaçlar, hukuki sebepler ve haklarınız.',
};

export default function KvkkPage() {
  return (
    <LegalLayout>

<div className="wrap head">
  <p className="eyebrow">Yasal</p>
  <h1>KVKK Aydınlatma Metni</h1>
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
      <li><a href="#k1">Veri sorumlusunun kimliği</a></li>
      <li><a href="#k2">İşlenen kişisel veri kategorileri</a></li>
      <li><a href="#k3">İşleme amaçları</a></li>
      <li><a href="#k4">İşlemenin hukuki sebepleri</a></li>
      <li><a href="#k5">Toplama yöntemi</a></li>
      <li><a href="#k6">Kimlere ve hangi amaçla aktarılabilir?</a></li>
      <li><a href="#k7">Yurt dışına aktarım</a></li>
      <li><a href="#k8">Saklama ve imha</a></li>
      <li><a href="#k9">İlgili kişinin hakları</a></li>
      <li><a href="#k10">Başvuru usulü</a></li>
      <li><a href="#k11">Metindeki değişiklikler</a></li>
    </ol>
  </nav>

  <article className="doc" id="belge">

    <section id="k1">
      <h2>Veri sorumlusunun kimliği</h2>
      <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca kişisel verileriniz, veri sorumlusu sıfatıyla aşağıda bilgileri yer alan şirket tarafından işlenmektedir.</p>
      <table>
        <tbody>
          <tr><th scope="row">Veri sorumlusu</th><td><span className="fill">[TİCARİ UNVAN]</span></td></tr>
          <tr><th scope="row">Adres</th><td><span className="fill">[AÇIK ADRES, İLÇE/İL]</span></td></tr>
          <tr><th scope="row">MERSİS no</th><td><span className="fill">[MERSİS NUMARASI]</span></td></tr>
          <tr><th scope="row">VERBİS kaydı</th><td><span className="fill">[VARSA KAYIT NUMARASI / "kayıt yükümlülüğü bulunmamaktadır"]</span></td></tr>
          <tr><th scope="row">E-posta</th><td>destek@parena.com.tr</td></tr>
        </tbody>
      </table>
      <div className="note">VERBİS kayıt yükümlülüğü, yıllık çalışan sayısı ve mali bilanço eşiklerine bağlıdır. Eşikleri aşıyorsanız kayıt zorunludur; bu alan boş bırakılmamalıdır.</div>
    </section>

    <section id="k2">
      <h2>İşlenen kişisel veri kategorileri</h2>
      <table>
        <thead><tr><th>Kategori</th><th>İşlenen veriler</th></tr></thead>
        <tbody>
          <tr><td>Kimlik</td><td>Ad, soyad</td></tr>
          <tr><td>İletişim</td><td>E-posta adresi, varsa Telegram kullanıcı kimliği</td></tr>
          <tr><td>İşlem güvenliği</td><td>IP adresi, cihaz ve tarayıcı bilgisi, oturum kayıtları, parola özeti, giriş denemeleri</td></tr>
          <tr><td>Müşteri işlem</td><td>Üyelik tipi, üyelik başlangıç ve yenileme tarihleri, sipariş ve fatura kayıtları</td></tr>
          <tr><td>Finans</td><td>Ödeme tutarı, ödeme durumu, işlem referans numarası (kart bilgisi işlenmez)</td></tr>
          <tr><td>Kullanıcı içeriği</td><td>Platform'a elle girilen portföy bilgileri, takip listeleri, bildirim tercihleri</td></tr>
          <tr><td>Pazarlama</td><td>Ticari elektronik ileti izni ve izin geçmişi</td></tr>
        </tbody>
      </table>
      <p>Platform, KVKK'nın 6. maddesinde tanımlanan <strong>özel nitelikli kişisel verileri</strong> (sağlık, din, biyometrik veri vb.) işlememektedir. Bu tür verileri Platform'a girmemeniz gerekir.</p>
    </section>

    <section id="k3">
      <h2>İşleme amaçları</h2>
      <ul>
        <li>Üyelik kaydının oluşturulması ve hesabın yönetilmesi</li>
        <li>Üyelik tipine göre hizmet erişiminin sağlanması</li>
        <li>Girilen portföy verileri üzerinden performans ve karne hesaplaması yapılması</li>
        <li>Üyelik bedelinin tahsili, faturalandırma ve mali kayıtların tutulması</li>
        <li>Hesap güvenliğinin sağlanması, yetkisiz erişim ve hesap paylaşımının tespiti</li>
        <li>Talep edilen bildirimlerin iletilmesi</li>
        <li>Destek taleplerinin karşılanması</li>
        <li>Hizmetin geliştirilmesine yönelik istatistiksel analizlerin yapılması</li>
        <li>Açık rıza bulunması hâlinde ticari elektronik ileti gönderilmesi</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi ve yetkili mercilerin taleplerinin karşılanması</li>
      </ul>
    </section>

    <section id="k4">
      <h2>İşlemenin hukuki sebepleri</h2>
      <p>Kişisel verileriniz, KVKK'nın 5. maddesinde sayılan aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:</p>
      <table>
        <thead><tr><th>Hukuki sebep</th><th>Kapsadığı işleme</th></tr></thead>
        <tbody>
          <tr><td>md. 5/2-(c) — Sözleşmenin kurulması veya ifası için gerekli olması</td><td>Hesap oluşturma, üyelik yönetimi, hizmet sunumu, portföy hesaplaması, ödeme tahsilatı</td></tr>
          <tr><td>md. 5/2-(ç) — Hukuki yükümlülüğün yerine getirilmesi</td><td>Fatura düzenleme, vergi ve ticaret mevzuatı kapsamında kayıt saklama</td></tr>
          <tr><td>md. 5/2-(e) — Hakkın tesisi, kullanılması veya korunması</td><td>Uyuşmazlık hâlinde delil olarak işlem kayıtlarının saklanması</td></tr>
          <tr><td>md. 5/2-(f) — Meşru menfaat</td><td>Hesap güvenliği, kötüye kullanım tespiti, hizmet iyileştirme amaçlı istatistiksel analiz</td></tr>
          <tr><td>md. 5/1 — Açık rıza</td><td>Ticari elektronik ileti gönderimi, zorunlu olmayan çerezler, gerekli hâllerde yurt dışına aktarım</td></tr>
        </tbody>
      </table>
      <p>Açık rızaya dayalı işlemeler için rızanızı dilediğiniz zaman geri alabilirsiniz. Rızanın geri alınması, geri alma anına kadar yapılmış işlemelerin hukuka uygunluğunu etkilemez.</p>
    </section>

    <section id="k5">
      <h2>Toplama yöntemi</h2>
      <p>Kişisel verileriniz; Platform üzerindeki kayıt ve giriş formları, portföy giriş ekranları, destek e-postaları, ödeme adımında ödeme kuruluşundan dönen işlem bilgileri ve otomatik sistem kayıtları (log) aracılığıyla, tamamen veya kısmen otomatik yollarla elektronik ortamda toplanmaktadır.</p>
    </section>

    <section id="k6">
      <h2>Kimlere ve hangi amaçla aktarılabilir?</h2>
      <p>Kişisel verileriniz, KVKK'nın 8. maddesi kapsamında ve yalnızca aktarımın gerekli olduğu ölçüde aşağıdaki taraflarla paylaşılabilir:</p>
      <table>
        <thead><tr><th>Alıcı grubu</th><th>Aktarım amacı</th></tr></thead>
        <tbody>
          <tr><td>Ödeme kuruluşu (iyzico)</td><td>Ödeme işleminin gerçekleştirilmesi</td></tr>
          <tr><td>Barındırma ve altyapı sağlayıcıları</td><td>Sunucu, veri tabanı ve yedekleme hizmeti</td></tr>
          <tr><td>E-posta ve bildirim servis sağlayıcıları</td><td>İşlemsel bildirim ve izinli ileti gönderimi</td></tr>
          <tr><td>Analitik hizmet sağlayıcıları</td><td>Kimliksizleştirilmiş kullanım istatistiği</td></tr>
          <tr><td>Mali müşavir, denetçi ve hukuk danışmanları</td><td>Mali kayıtların tutulması ve hukuki süreçlerin yürütülmesi</td></tr>
          <tr><td>Yetkili kamu kurum ve kuruluşları</td><td>Mevzuattan doğan bilgi ve belge talepleri</td></tr>
        </tbody>
      </table>
      <p>Kişisel verileriniz pazarlama amacıyla üçüncü kişilere satılmaz, kiralanmaz veya devredilmez.</p>
    </section>

    <section id="k7">
      <h2>Yurt dışına aktarım</h2>
      <p>Bazı hizmet sağlayıcıların sunucuları yurt dışında bulunabilmektedir. Bu hâlde aktarım, KVKK'nın 9. maddesi uyarınca; yeterlilik kararı bulunan ülkelere, uygun güvencelerin (standart sözleşme, bağlayıcı şirket kuralları) sağlanması hâlinde veya açık rızanıza dayanılarak gerçekleştirilir.</p>
      <p>Aktarım yapılan sağlayıcılar ve ülkeler: <span className="fill">[SAĞLAYICI VE ÜLKE LİSTESİ]</span></p>
    </section>

    <section id="k8">
      <h2>Saklama ve imha</h2>
      <p>Kişisel verileriniz, işlendikleri amaç için gerekli olan süre ve ilgili mevzuatta öngörülen asgari süreler boyunca saklanır. Süre sonunda veriler; silinir, yok edilir veya geri döndürülemez şekilde anonim hâle getirilir.</p>
      <table>
        <thead><tr><th>Veri</th><th>Saklama süresi</th></tr></thead>
        <tbody>
          <tr><td>Hesap ve profil verileri</td><td>Üyelik süresince ve hesap silme talebinden itibaren 30 gün</td></tr>
          <tr><td>Portföy kayıtları</td><td>Üyelik süresince; hesap silindiğinde derhal</td></tr>
          <tr><td>Fatura ve mali kayıtlar</td><td>10 yıl (Vergi Usul Kanunu ve Türk Ticaret Kanunu)</td></tr>
          <tr><td>İşlem güvenliği kayıtları</td><td><span className="fill">[6 ay – 2 yıl]</span></td></tr>
          <tr><td>Ticari ileti izin kayıtları</td><td>İznin geri alınmasından itibaren 3 yıl (6563 sayılı Kanun)</td></tr>
        </tbody>
      </table>
    </section>

    <section id="k9">
      <h2>İlgili kişinin hakları</h2>
      <p>KVKK'nın 11. maddesi uyarınca veri sorumlusuna başvurarak aşağıdaki haklarınızı kullanabilirsiniz:</p>
      <ul>
        <li>Kişisel verinizin işlenip işlenmediğini öğrenme</li>
        <li>İşlenmişse buna ilişkin bilgi talep etme</li>
        <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
        <li>Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme</li>
        <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
        <li>KVKK'nın 7. maddesindeki şartlar çerçevesinde verilerin silinmesini veya yok edilmesini isteme</li>
        <li>Düzeltme, silme ve yok etme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
        <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonuç ortaya çıkmasına itiraz etme</li>
        <li>Verilerin kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
      </ul>
    </section>

    <section id="k10">
      <h2>Başvuru usulü</h2>
      <p>Haklarınıza ilişkin taleplerinizi, "Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ" uyarınca aşağıdaki yollarla iletebilirsiniz:</p>
      <ul>
        <li>Sistemimizde kayıtlı e-posta adresinizden <strong>destek@parena.com.tr</strong> adresine e-posta göndererek</li>
        <li>Islak imzalı dilekçeyle <span className="fill">[AÇIK ADRES]</span> adresine şahsen veya noter aracılığıyla</li>
        <li>Kayıtlı elektronik posta (KEP) adresiniz üzerinden <span className="fill">[KEP ADRESİ — varsa]</span> adresine</li>
      </ul>
      <p>Başvurunuzda ad-soyad, imza (yazılı başvurularda), T.C. kimlik numarası, tebligata esas adres, varsa e-posta ve telefon ile talep konusunun açıkça belirtilmesi gerekir.</p>
      <p>Talepleriniz, niteliğine göre en kısa sürede ve <strong>en geç 30 gün</strong> içinde ücretsiz olarak sonuçlandırılır. İşlemin ayrıca bir maliyet gerektirmesi hâlinde Kurul tarafından belirlenen tarifedeki ücret alınabilir.</p>
      <p>Başvurunuzun reddedilmesi, verilen cevabı yetersiz bulmanız veya süresinde cevap verilmemesi hâlinde; cevabı öğrendiğiniz tarihten itibaren 30 gün ve her hâlde başvuru tarihinden itibaren 60 gün içinde <strong>Kişisel Verileri Koruma Kurulu</strong>'na şikâyette bulunabilirsiniz.</p>
    </section>

    <section id="k11">
      <h2>Metindeki değişiklikler</h2>
      <p>Bu aydınlatma metni, mevzuattaki veya işleme faaliyetlerimizdeki değişikliklere bağlı olarak güncellenebilir. Güncel sürüm her zaman bu sayfada, yürürlük tarihiyle birlikte yayımlanır.</p>
    </section>

  </article>
</div>

    </LegalLayout>
  );
}
