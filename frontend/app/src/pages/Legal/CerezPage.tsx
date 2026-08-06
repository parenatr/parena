import { LegalLayout } from "@/components/legal/LegalLayout";

export const cerezPageMeta = {
  title: 'Çerez Politikası | PARENA',
  description: 'PARENA çerez politikası: kullanılan çerez türleri, süreleri, üçüncü taraf çerezleri ve tercihlerinizi nasıl yöneteceğiniz.',
  ogTitle: 'Çerez Politikası | PARENA',
  ogDescription: 'PARENA çerez politikası: kullanılan çerez türleri, süreleri, üçüncü taraf çerezleri ve tercihlerinizi nasıl yöneteceğiniz.',
};

export default function CerezPage() {
  return (
    <LegalLayout>

<div className="wrap head">
  <p className="eyebrow">Yasal</p>
  <h1>Çerez Politikası</h1>
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
      <li><a href="#c1">Çerez nedir?</a></li>
      <li><a href="#c2">Neden çerez kullanıyoruz?</a></li>
      <li><a href="#c3">Kullandığımız çerez türleri</a></li>
      <li><a href="#c4">Çerez listesi</a></li>
      <li><a href="#c5">Üçüncü taraf çerezleri</a></li>
      <li><a href="#c6">Çerez tercihlerinizi yönetme</a></li>
      <li><a href="#c7">Tarayıcı ayarları</a></li>
      <li><a href="#c8">Hukuki dayanak</a></li>
      <li><a href="#c9">Politikadaki değişiklikler</a></li>
    </ol>
  </nav>

  <article className="doc" id="belge">

    <section id="c1">
      <h2>Çerez nedir?</h2>
      <p>Çerez (cookie), bir internet sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyasıdır. Çerezler; oturumunuzun açık kalmasını, tercihlerinizin hatırlanmasını ve sitenin nasıl kullanıldığının ölçülmesini sağlar.</p>
      <p>Bu politikada "çerez" ifadesi; yerel depolama (localStorage), oturum depolama (sessionStorage) ve piksel etiketleri gibi benzer işlevli teknolojileri de kapsar.</p>
    </section>

    <section id="c2">
      <h2>Neden çerez kullanıyoruz?</h2>
      <ul>
        <li>Giriş yaptıktan sonra oturumunuzun açık kalmasını sağlamak</li>
        <li>Hesap başına tek aktif oturum kuralını uygulamak ve güvenliği korumak</li>
        <li>Tema, dil ve bildirim gibi tercihlerinizi hatırlamak</li>
        <li>Hangi modüllerin kullanıldığını ölçerek hizmeti geliştirmek</li>
        <li>Açık rızanız hâlinde, pazarlama çalışmalarının etkisini ölçmek</li>
      </ul>
      <div className="callout">
        <p><strong>Portföy verileriniz çerezlerde tutulmaz.</strong> Platform'a girdiğiniz portföy bilgileri hesabınıza bağlı olarak sunucu tarafında saklanır; reklam veya profilleme amacıyla üçüncü taraflarla paylaşılmaz.</p>
      </div>
    </section>

    <section id="c3">
      <h2>Kullandığımız çerez türleri</h2>
      <table>
        <thead><tr><th>Tür</th><th>İşlevi</th><th>Rıza gerekir mi?</th></tr></thead>
        <tbody>
          <tr><td><strong>Zorunlu çerezler</strong></td><td>Oturum yönetimi, güvenlik, yük dengeleme. Bunlar olmadan Platform çalışmaz.</td><td>Hayır — hizmetin ifası için gereklidir</td></tr>
          <tr><td><strong>Tercih çerezleri</strong></td><td>Tema, dil, kapatılan bildirimler gibi kullanıcı tercihlerini hatırlar.</td><td>Evet</td></tr>
          <tr><td><strong>Analitik çerezler</strong></td><td>Ziyaret sayısı, sayfa görüntüleme ve modül kullanımını kimliksizleştirilmiş biçimde ölçer.</td><td>Evet</td></tr>
          <tr><td><strong>Pazarlama çerezleri</strong></td><td>Reklam kampanyalarının dönüşüm ölçümü ve yeniden hedefleme.</td><td>Evet</td></tr>
        </tbody>
      </table>
      <p>Zorunlu çerezler dışındaki tüm çerezler, yalnızca ilk ziyarette gösterilen çerez tercih panelinden onay vermeniz hâlinde çalıştırılır. Onay vermemeniz hâlinde Platform'un temel işlevleri kullanılmaya devam edilebilir.</p>
    </section>

    <section id="c4">
      <h2>Çerez listesi</h2>
      <div className="note">Aşağıdaki tablo, kullandığınız analitik ve pazarlama araçlarına göre doldurulmalıdır. Yürürlükteki uygulamada bulunmayan bir çerezi listelemek, listelememek kadar sakıncalıdır.</div>
      <table>
        <thead><tr><th>Çerez adı</th><th>Tür</th><th>Amaç</th><th>Süre</th></tr></thead>
        <tbody>
          <tr><td><span className="fill">[oturum_cerezi_adi]</span></td><td>Zorunlu</td><td>Oturumun sürdürülmesi</td><td>Oturum boyunca</td></tr>
          <tr><td><span className="fill">[guvenlik_cerezi_adi]</span></td><td>Zorunlu</td><td>CSRF koruması</td><td>Oturum boyunca</td></tr>
          <tr><td>parena_cerez_izni</td><td>Zorunlu</td><td>Çerez tercihlerinizin saklanması</td><td>12 ay</td></tr>
          <tr><td><span className="fill">[tercih_cerezi_adi]</span></td><td>Tercih</td><td>Tema ve arayüz tercihleri</td><td>12 ay</td></tr>
          <tr><td><span className="fill">[_ga / benzeri]</span></td><td>Analitik</td><td>Ziyaretçi ayrımı ve kullanım ölçümü</td><td><span className="fill">[süre]</span></td></tr>
          <tr><td><span className="fill">[_fbp / benzeri]</span></td><td>Pazarlama</td><td>Kampanya dönüşüm ölçümü</td><td><span className="fill">[süre]</span></td></tr>
        </tbody>
      </table>
    </section>

    <section id="c5">
      <h2>Üçüncü taraf çerezleri</h2>
      <p>Analitik ve pazarlama çerezleri, aşağıdaki üçüncü taraf hizmet sağlayıcılar tarafından yerleştirilebilir. Bu sağlayıcıların kendi gizlilik politikaları geçerlidir:</p>
      <ul>
        <li><span className="fill">[ANALİTİK SAĞLAYICISI — gizlilik politikası bağlantısı]</span></li>
        <li><span className="fill">[REKLAM PLATFORMU — gizlilik politikası bağlantısı]</span></li>
        <li>iyzico — ödeme adımında güvenlik ve dolandırıcılık önleme amaçlı çerezler</li>
      </ul>
      <p>Bu çerezler yalnızca açık rızanız hâlinde çalıştırılır ve rızanızı geri aldığınızda devre dışı bırakılır.</p>
    </section>

    <section id="c6">
      <h2>Çerez tercihlerinizi yönetme</h2>
      <p>Çerez tercihlerinizi dilediğiniz zaman değiştirebilirsiniz:</p>
      <ul>
        <li>Sayfanın alt kısmındaki <strong>"Çerez tercihleri"</strong> bağlantısından tercih panelini yeniden açabilirsiniz.</li>
        <li>Panelde her çerez kategorisini ayrı ayrı açıp kapatabilirsiniz.</li>
        <li>Rızanızı geri almanız, geri alma anına kadar toplanmış verilerin hukuka uygunluğunu etkilemez.</li>
      </ul>
      <p>Zorunlu çerezler, hizmetin sunulabilmesi için gerekli olduklarından devre dışı bırakılamaz.</p>
      <p style={{ marginTop: '18px' }}>
        <button type="button" id="cerezTercih" style={{ fontFamily: 'inherit', fontSize: '14px', fontWeight: '650', padding: '12px 22px', borderRadius: '11px', border: '1.5px solid var(--navy)', background: 'var(--navy)', color: '#fff', cursor: 'pointer' }}>
          Çerez tercihlerimi değiştir
        </button>
      </p>
      <p id="cerezYok" style={{ display: 'none', fontSize: '13px', color: 'var(--muted)', marginTop: '10px' }}>
        Çerez tercih paneli bu sayfada bulunamadı. Tercihlerini tarayıcı ayarlarından da yönetebilirsin.
      </p>
    </section>

    <section id="c7">
      <h2>Tarayıcı ayarları</h2>
      <p>Çerezleri tarayıcınızın ayarlarından da yönetebilir, silebilir veya tümüyle engelleyebilirsiniz. İlgili ayarlar genellikle "Gizlilik ve güvenlik" başlığı altında yer alır (Chrome, Safari, Firefox, Edge ve diğer tarayıcılarda).</p>
      <p>Tüm çerezleri engellemeniz hâlinde oturum açma dâhil bazı temel işlevler çalışmayabilir.</p>
    </section>

    <section id="c8">
      <h2>Hukuki dayanak</h2>
      <p>Zorunlu çerezler, KVKK'nın 5/2-(c) maddesi (sözleşmenin ifası) ve 5/2-(f) maddesi (meşru menfaat) kapsamında; tercih, analitik ve pazarlama çerezleri ise KVKK'nın 5/1 maddesi uyarınca <strong>açık rızanıza</strong> dayanılarak işlenmektedir.</p>
      <p>Çerezler aracılığıyla işlenen kişisel verilere ilişkin ayrıntılı bilgilendirme için <a href="/kvkk">KVKK Aydınlatma Metni</a>'ni, genel gizlilik uygulamalarımız için <a href="/gizlilik">Gizlilik Politikası</a>'nı inceleyebilirsiniz.</p>
    </section>

    <section id="c9">
      <h2>Politikadaki değişiklikler</h2>
      <p>Kullanılan çerezlerin değişmesi hâlinde bu politika güncellenir ve gerekirse çerez tercih paneli yeniden gösterilerek rızanız tazelenir. Güncel sürüm her zaman bu sayfada, yürürlük tarihiyle birlikte yayımlanır.</p>
    </section>

  </article>
</div>

    </LegalLayout>
  );
}
