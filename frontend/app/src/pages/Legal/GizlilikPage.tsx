import { LegalLayout } from "@/components/legal/LegalLayout";

export const gizlilikPageMeta = {
  title: 'Gizlilik - Parena',
  description: 'PARENA gizlilik politikası: hangi verileri topluyoruz, neden işliyoruz, kimlerle paylaşıyoruz ve haklarınızı nasıl kullanırsınız.',
  ogTitle: 'Gizlilik Politikası | PARENA',
  ogDescription: 'PARENA gizlilik politikası: hangi verileri topluyoruz, neden işliyoruz, kimlerle paylaşıyoruz ve haklarınızı nasıl kullanırsınız.',
};

export default function GizlilikPage() {
  return (
    <LegalLayout>

<div className="wrap head">
  <p className="eyebrow">Yasal</p>
  <h1>Gizlilik Politikası</h1>
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
      <li><a href="#g1">Bu politika neyi kapsar?</a></li>
      <li><a href="#g2">Topladığımız veriler</a></li>
      <li><a href="#g3">Verileri neden işliyoruz?</a></li>
      <li><a href="#g4">Toplamadığımız veriler</a></li>
      <li><a href="#g5">Çerezler ve ölçümleme</a></li>
      <li><a href="#g6">Hizmet sağlayıcılarla paylaşım</a></li>
      <li><a href="#g7">Yurt dışına aktarım</a></li>
      <li><a href="#g8">Saklama süreleri</a></li>
      <li><a href="#g9">Veri güvenliği</a></li>
      <li><a href="#g10">Haklarınız</a></li>
      <li><a href="#g11">18 yaş altı kullanıcılar</a></li>
      <li><a href="#g12">Politikadaki değişiklikler</a></li>
      <li><a href="#g13">İletişim</a></li>
    </ol>
  </nav>

  <article className="doc" id="belge">

    <section id="g1">
      <h2>Bu politika neyi kapsar?</h2>
      <p>Bu Gizlilik Politikası, <span className="fill">[TİCARİ UNVAN]</span> tarafından işletilen parena.com.tr internet sitesi ve bağlı hizmetleri ("Platform") kullanılırken hangi verilerin toplandığını, bu verilerin neden işlendiğini ve kullanıcının bu veriler üzerindeki haklarını açıklar.</p>
      <p>Kişisel verilerin işlenmesine ilişkin hukuki dayanaklar ve ayrıntılı bilgilendirme için <a href="/kvkk">KVKK Aydınlatma Metni</a>'ni; çerez kullanımı için <a href="/cerez">Çerez Politikası</a>'nı inceleyebilirsiniz. Bu üç metin birbirini tamamlar.</p>
      <p>Platform'u kullanarak bu politikada açıklanan uygulamaları okuduğunuzu kabul etmiş olursunuz.</p>
    </section>

    <section id="g2">
      <h2>Topladığımız veriler</h2>
      <p>Yalnızca hizmetin sunulması için gereken veriyi topluyoruz. Toplanan veriler ve kaynakları aşağıdaki gibidir:</p>
      <table>
        <thead><tr><th>Veri kategorisi</th><th>Örnek veriler</th><th>Kaynak</th></tr></thead>
        <tbody>
          <tr><td>Kimlik ve iletişim</td><td>Ad, soyad, e-posta adresi</td><td>Doğrudan sizden (kayıt formu)</td></tr>
          <tr><td>Hesap güvenliği</td><td>Şifrelenmiş parola özeti, oturum kayıtları, IP adresi, cihaz ve tarayıcı bilgisi</td><td>Otomatik (sistem kayıtları)</td></tr>
          <tr><td>Üyelik ve işlem</td><td>Üyelik tipi, başlangıç/yenileme tarihleri, ödeme durumu, fatura kaydı</td><td>Doğrudan sizden ve ödeme kuruluşundan</td></tr>
          <tr><td>Kullanım verileri</td><td>Görüntülenen sayfalar, kullanılan modüller, takip listesine eklenen hisseler</td><td>Otomatik</td></tr>
          <tr><td>Kullanıcı içeriği</td><td>Platform'a elle girdiğiniz portföy bilgileri (hisse kodu, adet, maliyet)</td><td>Doğrudan sizden</td></tr>
          <tr><td>İletişim kayıtları</td><td>Destek talepleri ve yazışmalar</td><td>Doğrudan sizden</td></tr>
          <tr><td>Bildirim tercihleri</td><td>Telegram kullanıcı kimliği, bildirim ayarları, ticari ileti izni</td><td>Doğrudan sizden</td></tr>
        </tbody>
      </table>
    </section>

    <section id="g3">
      <h2>Verileri neden işliyoruz?</h2>
      <ul>
        <li><strong>Hizmeti sunmak:</strong> Hesabınızı oluşturmak, oturumunuzu yönetmek, üyeliğinize karşılık gelen modülleri açmak.</li>
        <li><strong>Portföy hesaplaması yapmak:</strong> Girdiğiniz portföy verileri üzerinden performans ve karne hesaplamak. Bu veriler yalnızca sizin hesabınızda görünür.</li>
        <li><strong>Ödeme ve mali kayıt:</strong> Üyelik bedelini tahsil etmek, fatura düzenlemek ve yasal saklama yükümlülüklerini yerine getirmek.</li>
        <li><strong>Güvenlik:</strong> Hesap paylaşımını, yetkisiz erişimi ve otomatik veri çekme girişimlerini tespit etmek.</li>
        <li><strong>Bildirim göndermek:</strong> Talep ettiğiniz Telegram ve e-posta bildirimlerini iletmek.</li>
        <li><strong>Hizmeti geliştirmek:</strong> Toplulaştırılmış ve kimliksizleştirilmiş kullanım istatistikleriyle hangi modüllerin işe yaradığını anlamak.</li>
        <li><strong>Yasal yükümlülükler:</strong> Mevzuattan doğan bilgi saklama ve yetkili mercilere bilgi verme yükümlülüklerini karşılamak.</li>
      </ul>
    </section>

    <section id="g4">
      <h2>Toplamadığımız veriler</h2>
      <p>Bu bölüm, Platform'un sınırlarını netleştirmek için yazılmıştır.</p>
      <div className="callout">
        <p><strong>Aracı kurum hesabınıza erişmiyoruz.</strong> Platform'un hiçbir aracı kurum hesabına, bakiyenize, gerçek portföyünüze veya emir iletim sistemine erişimi yoktur. API bağlantısı istemez, hesap giriş bilgisi talep etmez.</p>
        <p><strong>Kart bilgilerinizi saklamıyoruz.</strong> Ödeme işlemleri lisanslı ödeme kuruluşu iyzico altyapısında gerçekleşir. Kart numarası, son kullanma tarihi ve güvenlik kodu Platform sunucularına hiçbir aşamada iletilmez ve kaydedilmez.</p>
        <p><strong>Kişisel verinizi satmıyoruz.</strong> Verilerinizi üçüncü kişilere satmıyor, kiralamıyor veya reklam amacıyla paylaşmıyoruz.</p>
      </div>
    </section>

    <section id="g5">
      <h2>Çerezler ve ölçümleme</h2>
      <p>Platform, oturumun sürdürülmesi ve kullanım istatistiklerinin ölçülmesi için çerez ve benzeri teknolojiler kullanır. Zorunlu çerezler dışındaki çerezler yalnızca açık rızanız hâlinde çalıştırılır.</p>
      <p>Kullanılan çerezlerin tam listesi, süreleri ve tercihlerinizi nasıl değiştireceğiniz <a href="/cerez">Çerez Politikası</a>'nda açıklanmıştır.</p>
    </section>

    <section id="g6">
      <h2>Hizmet sağlayıcılarla paylaşım</h2>
      <p>Hizmetin sunulabilmesi için sınırlı sayıda hizmet sağlayıcıyla, yalnızca gerekli veriyle sınırlı olmak üzere çalışıyoruz. Her sağlayıcıyla veri işleme sözleşmesi imzalanır ve verinin yalnızca belirlenen amaçla işlenmesi taahhüt edilir.</p>
      <table>
        <thead><tr><th>Sağlayıcı</th><th>Amaç</th><th>Paylaşılan veri</th></tr></thead>
        <tbody>
          <tr><td>iyzico (Ödeme kuruluşu)</td><td>Ödeme tahsilatı</td><td>Ad, e-posta, işlem tutarı</td></tr>
          <tr><td><span className="fill">[BARINDIRMA SAĞLAYICISI]</span></td><td>Sunucu ve veri tabanı barındırma</td><td>Platform üzerindeki tüm veriler (şifreli)</td></tr>
          <tr><td><span className="fill">[E-POSTA SERVİSİ]</span></td><td>İşlemsel e-posta ve bülten gönderimi</td><td>Ad, e-posta adresi</td></tr>
          <tr><td><span className="fill">[ANALİTİK SAĞLAYICISI]</span></td><td>Kimliksizleştirilmiş kullanım istatistiği</td><td>Sayfa görüntüleme, cihaz türü, kesilmiş IP</td></tr>
          <tr><td>Telegram</td><td>Bildirim iletimi (yalnızca bağlarsanız)</td><td>Telegram kullanıcı kimliği</td></tr>
        </tbody>
      </table>
      <p>Bunların dışında verileriniz yalnızca; yasal bir yükümlülüğün yerine getirilmesi, yetkili kamu kurumlarının usulüne uygun talebi veya bir hakkın tesisi ve korunması amacıyla paylaşılabilir.</p>
    </section>

    <section id="g7">
      <h2>Yurt dışına aktarım</h2>
      <p>Kullanılan bazı hizmet sağlayıcıların sunucuları yurt dışında bulunabilir. Bu durumda kişisel veriler, KVKK'nın 9. maddesi kapsamında; yeterlilik kararı bulunan ülkelere, uygun güvencelerin sağlanması hâlinde (standart sözleşme, bağlayıcı şirket kuralları) veya açık rızanıza dayanılarak aktarılır.</p>
      <p>Yurt dışına aktarım yapılan sağlayıcılar: <span className="fill">[SAĞLAYICI LİSTESİ VE BULUNDUKLARI ÜLKELER]</span></p>
    </section>

    <section id="g8">
      <h2>Saklama süreleri</h2>
      <table>
        <thead><tr><th>Veri</th><th>Saklama süresi</th></tr></thead>
        <tbody>
          <tr><td>Hesap ve profil verileri</td><td>Üyelik süresince; hesap silindikten sonra 30 gün içinde imha edilir</td></tr>
          <tr><td>Portföy kayıtları</td><td>Üyelik süresince; hesap silindiğinde derhal imha edilir</td></tr>
          <tr><td>Ödeme ve fatura kayıtları</td><td>Vergi mevzuatı gereği <strong>10 yıl</strong></td></tr>
          <tr><td>Oturum ve güvenlik kayıtları</td><td><span className="fill">[6 ay – 2 yıl arası, politikanıza göre]</span></td></tr>
          <tr><td>Destek yazışmaları</td><td>Talebin kapanmasından itibaren 3 yıl</td></tr>
          <tr><td>Ticari ileti izin kayıtları</td><td>İznin geri alınmasından itibaren 3 yıl (6563 sayılı Kanun)</td></tr>
        </tbody>
      </table>
      <p>Süre dolduğunda veriler silinir, yok edilir veya geri döndürülemez biçimde anonim hâle getirilir.</p>
    </section>

    <section id="g9">
      <h2>Veri güvenliği</h2>
      <ul>
        <li>Tüm veri trafiği TLS ile şifrelenir.</li>
        <li>Parolalar geri döndürülemez özet (hash) algoritmalarıyla saklanır; düz metin olarak tutulmaz.</li>
        <li>Veri tabanına erişim rol bazlı olarak sınırlandırılır ve erişim kayıtları tutulur.</li>
        <li>Hesap başına tek aktif oturum kuralı uygulanır; olağandışı giriş denemeleri incelemeye alınır.</li>
        <li>Yedekler şifreli olarak saklanır.</li>
      </ul>
      <p>Kişisel verilerin hukuka aykırı olarak erişilmesi hâlinde, KVKK'nın 12. maddesi uyarınca ilgili kişilere ve Kişisel Verileri Koruma Kurulu'na en kısa sürede bildirim yapılır.</p>
    </section>

    <section id="g10">
      <h2>Haklarınız</h2>
      <p>KVKK'nın 11. maddesi kapsamında; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, düzeltme, silme, aktarıldığı üçüncü kişileri öğrenme ve zararın giderilmesini talep etme haklarına sahipsiniz.</p>
      <p>Hakların tam listesi ve başvuru usulü <a href="/kvkk">KVKK Aydınlatma Metni</a>'nde ayrıntılı olarak açıklanmıştır. Başvurularınızı destek@parena.com.tr adresine iletebilirsiniz; talepler en geç 30 gün içinde sonuçlandırılır.</p>
    </section>

    <section id="g11">
      <h2>18 yaş altı kullanıcılar</h2>
      <p>Platform 18 yaşını doldurmuş kişilere yöneliktir ve bilerek 18 yaş altındaki kişilerden veri toplamaz. Böyle bir verinin işlendiğinin tespiti hâlinde ilgili hesap kapatılır ve veriler gecikmeksizin imha edilir.</p>
    </section>

    <section id="g12">
      <h2>Politikadaki değişiklikler</h2>
      <p>Bu politika, hizmetteki veya mevzuattaki değişikliklere bağlı olarak güncellenebilir. Esaslı değişiklikler yürürlüğe girmeden en az 30 gün önce e-posta ile ve Platform üzerinden duyurulur. Güncel sürüm her zaman bu sayfada, yürürlük tarihiyle birlikte yayımlanır.</p>
    </section>

    <section id="g13">
      <h2>İletişim</h2>
      <p>Gizlilik uygulamalarımıza ilişkin her türlü soru ve talebiniz için:</p>
      <table>
        <tbody>
          <tr><th scope="row">Veri sorumlusu</th><td><span className="fill">[TİCARİ UNVAN]</span></td></tr>
          <tr><th scope="row">Adres</th><td><span className="fill">[AÇIK ADRES]</span></td></tr>
          <tr><th scope="row">E-posta</th><td>destek@parena.com.tr</td></tr>
        </tbody>
      </table>
    </section>

  </article>
</div>

    </LegalLayout>
  );
}
