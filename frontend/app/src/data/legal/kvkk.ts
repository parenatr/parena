import type { LegalDocument } from "./types";

export const KVKK: LegalDocument = {
  title: "KVKK Aydınlatma Metni",

  description: "6698 Sayılı Kişisel Verilerin Korunması Kanunu Kapsamında",

  sections: [
    {
      heading: "Veri Sorumlusu",
      paragraphs: [
        "PARENA Platformu — destek@parena.com.tr · parena.com.tr",
      ],
    },

    {
      heading: "İşlenen Kişisel Veriler",
      table: {
        headers: [
          "Veri",
          "Amaç",
          "Hukuki Dayanak",
        ],
        rows: [
          [
            "Ad-soyad, e-posta",
            "Üyelik oluşturma ve kimlik doğrulama",
            "Sözleşmenin ifası (md.5/2-c)",
          ],
          [
            "Şifre (hash)",
            "Güvenli kimlik doğrulama",
            "Sözleşmenin ifası",
          ],
          [
            "IP adresi, cihaz bilgisi",
            "Güvenlik, hesap paylaşımı tespiti",
            "Meşru menfaat (md.5/2-f)",
          ],
          [
            "Telegram ID",
            "Bildirim gönderimi",
            "Açık rıza (md.5/1)",
          ],
          [
            "Ödeme tarihi, tutarı",
            "Mali kayıt ve üyelik yönetimi",
            "Hukuki yükümlülük (md.5/2-ç)",
          ],
          [
            "Pazarlama tercihi",
            "Ticari ileti gönderimi",
            "Açık rıza (md.5/1)",
          ],
        ],
      },
    },

    {
      heading: "Verilerin Aktarımı",
      paragraphs: [
        "Kişisel verileriniz; teknik altyapı hizmeti kapsamında Netlify Inc. (ABD) sunucularında işlenmektedir. Bu aktarım için açık rızanız alınmaktadır. İleride Türkiye lokasyonlu sunucuya geçiş planlanmaktadır.",
      ],
    },

    {
      heading: "Saklama Süresi",
      paragraphs: [
        "Verileriniz üyelik süresince ve üyelik sona erdikten 3 yıl sonrasına kadar saklanır. Hesap silme talebinde kişisel veriler kalıcı olarak silinir; anonimleştirilmiş istatistiksel veriler saklanmaya devam edebilir.",
      ],
    },

    {
      heading: "Haklarınız (Madde 11)",
      items: [
        "Verilerinizin işlenip işlenmediğini öğrenme",
        "İşlenmişse bilgi talep etme",
        "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
        "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme",
        "Eksik veya yanlış işlenmiş ise düzeltilmesini isteme",
        "Silinmesini veya yok edilmesini isteme",
        "Otomatik sistemler vasıtasıyla aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
        "Kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme",
      ],
    },

    {
      paragraphs: [
        "Başvuru: destek@parena.com.tr adresine yazılı olarak başvurabilirsiniz. Talepler 30 gün içinde yanıtlanır.",
      ],
    },
  ],
};