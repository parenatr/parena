import type { LegalDocument } from "./types";

export const TERMS: LegalDocument = {
  title: "Kullanım Şartları ve Üyelik Sözleşmesi",

  description: "Son güncelleme: Temmuz 2026",

  sections: [
    {
      heading: "Taraflar",
      paragraphs: [
        'Bu sözleşme, parena.com.tr adresinde faaliyet gösteren PARENA platformu ("Platform") ile üyelik kaydını tamamlayan kullanıcı ("Üye") arasında akdedilmiştir.',
      ],
    },

    {
      heading: "Hizmetin Kapsamı",
      paragraphs: [
        "PARENA; Sermaye Piyasası Kurulu (SPK) lisanslı aracı kurumların kamuya açık günlük bültenlerindeki hisse senedi önerilerini derleyen, karşılaştıran ve olgusal sonuçlarını sunan bir bilgi aggregasyon platformudur.",
        "Platform hiçbir koşulda yatırım tavsiyesi, portföy yönetimi veya finansal danışmanlık hizmeti sunmaz. Sunulan içerikler yalnızca bilgilendirme amaçlıdır; yatırım kararlarının sorumluluğu tamamen Üye'ye aittir.",
      ],
    },

    {
      heading: "Üyelik Koşulları",
      items: [
        "Üyelik yalnızca davet kodu ile gerçekleşir.",
        "Üyelik kişiseldir; başkasına devredilemez, paylaşılamaz.",
        "Bir hesapta yalnızca tek aktif oturum bulunabilir.",
        "Bir Telegram hesabı yalnızca bir üyeliğe bağlanabilir.",
        '24 saat içinde farklı cihaz/IP\'den 3\'ten fazla giriş denemesi hesabı "incelemede" durumuna alır.',
      ],
    },

    {
      heading: "Ücretlendirme",
      items: [
        "Kurucu Üyelik: 149 TL / ay (ilk 150 üye)",
        "Standart Üyelik: 249 TL / ay",
        "İş Birliği Üyeliği: Ücretsiz (Platform'un yazılı onayıyla)",
        "Ödeme alınmadan üyelik aktifleştirilmez.",
        "Kurucu Üyelik fiyatı üyelik süresince değiştirilemez.",
      ],
    },

    {
      heading: "Hizmet Kesintisi ve Fesih",
      items: [
        "Platform bakım, teknik sorun veya mücbir sebep hallerinde hizmeti geçici olarak askıya alabilir.",
        "Üyelik koşullarını ihlal eden hesaplar bildirim yapılmaksızın askıya alınabilir veya sonlandırılabilir.",
        "Üye, üyeliğini istediği zaman destek@parena.com.tr adresine yazarak sonlandırabilir; kalan dönem için ücret iadesi yapılmaz.",
      ],
    },

    {
      heading: "Sorumluluk Sınırı",
      paragraphs: [
        "Platform, sunulan bilgilerin doğruluğu, güncelliği veya eksiksizliği konusunda garanti vermez. Yatırım kararlarından doğan her türlü zarar Üye'nin sorumluluğundadır.",
      ],
    },

    {
      heading: "Uygulanacak Hukuk",
      paragraphs: [
        "Bu sözleşmeye Türkiye Cumhuriyeti hukuku uygulanır. Uyuşmazlıklarda Tüketici Hakem Heyetleri ve Türkiye Mahkemeleri yetkilidir.",
      ],
    },
  ],
};