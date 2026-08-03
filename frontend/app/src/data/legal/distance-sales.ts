import type { LegalDocument } from "./types";

export const DISTANCE_SALES: LegalDocument = {
  title: "Mesafeli Satış Sözleşmesi",

  description: "Son güncelleme: Temmuz 2026",

  sections: [
    {
      heading: "Satıcı Bilgileri",
      items: [
        "Platform Adı: PARENA",
        "İletişim: destek@parena.com.tr",
        "Web sitesi: parena.com.tr",
      ],
    },

    {
      heading: "Alıcı",
      paragraphs: [
        'Üyelik kaydını tamamlayan kişi ("Alıcı").',
      ],
    },

    {
      heading: "Sözleşme Konusu",
      paragraphs: [
        "İşbu sözleşme, PARENA'nın sunduğu dijital abonelik hizmetinin mesafeli olarak satışına ilişkin koşulları düzenlemektedir.",
      ],
    },

    {
      heading: "Hizmet Bedeli",
      items: [
        "Kurucu Üyelik: 149 TL / ay",
        "Standart Üyelik: 249 TL / ay",
        "Ödeme yöntemi: Platform'un belirteceği banka / ödeme kanalı",
      ],
    },

    {
      heading: "Teslimat",
      paragraphs: [
        "Hizmet, ödemenin doğrulanması ve davet kodunun iletilmesinin ardından dijital ortamda derhal sunulmaya başlanır.",
      ],
    },

    {
      heading: "Cayma Hakkı ve İstisnası",
      paragraphs: [
        "Alıcı, siparişi tamamlarken aşağıdaki beyanı açıkça onaylamıştır.",
      ],
      highlight:
        '"Dijital içerik hizmetinin ifasına derhal başlanmasını talep ettiğimi, bu onayımla birlikte 14 günlük cayma hakkımdan feragat ettiğimi kabul ediyorum."',
    },

    {
      paragraphs: [
        "Bu beyan nedeniyle cayma hakkı kullanılamaz (Mesafeli Sözleşmeler Yönetmeliği md.15/1-ğ).",
      ],
    },

    {
      heading: "Uyuşmazlık",
      paragraphs: [
        "Şikayetler destek@parena.com.tr adresine iletilir. Çözüme kavuşturulamazsa yasal tutara kadar Tüketici Hakem Heyetleri, üzerinde ise Tüketici Mahkemeleri yetkilidir.",
      ],
    },
  ],
};