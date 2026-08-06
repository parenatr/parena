export type FeatureRow = {
  left: string;
  mid?: string;
  right?: string;
  value?: string;
  tone?: "buy" | "sell" | "neutral" | "warn";
};

export type Feature = {
  id: string;
  title: string;
  body: string;
  reversed: boolean;
  rows: FeatureRow[];
  consensus?: { title: string; buy: number; hold: number; sell: number };
};

export const FEATURES: Feature[] = [
  {
    id: "akis",
    title: "Günlük öneri akışı",
    body: "Kurumların sabah bültenlerindeki AL / TUT / SAT tavsiyeleri ve hedef fiyatlar, yayınlandığı dakikalarda tek tabloda. Her satırın yanında kaynak PDF — söz uçar, arşiv kalır.",
    reversed: false,
    rows: [
      { left: "THYAO", mid: "Ak Yatırım", right: "AL", value: "345 ₺", tone: "buy" },
      { left: "EREGL", mid: "İş Yatırım", right: "TUT", value: "58 ₺", tone: "neutral" },
      { left: "SASA", mid: "Gedik", right: "AL", value: "4,25 ₺", tone: "buy" },
    ],
  },
  {
    id: "isabet",
    title: "Kurum isabet karnesi",
    body: '"Bu hedefi koyan kurum geçmişte ne kadar tutturdu?" Her kurumun önerileri gün sonu kapanışla otomatik kontrol edilir; isabet oranı sicile işlenir. Kimin sözünün ağırlığı olduğunu veri söyler.',
    reversed: true,
    rows: [
      { left: "Ak Yatırım", value: "isabet %85", tone: "buy" },
      { left: "İş Yatırım", value: "isabet %78", tone: "buy" },
      { left: "Tacirler", value: "isabet %61", tone: "warn" },
    ],
  },
  {
    id: "konsensus",
    title: "Konsensüs ve aykırı görüş",
    body: "Bir hisseye kaç kurum AL diyor, ortalama ve medyan hedef ne, son 7 günde görüş nasıl kaydı — ve herkes bir yöndeyken ters düşen kim? Piyasanın ortak aklı tek bakışta.",
    reversed: false,
    consensus: { title: "THYAO · 13 kurum", buy: 69, hold: 23, sell: 8 },
    rows: [
      { left: "Ort. hedef", value: "420,00 ₺" },
      { left: "7G değişim", value: "▲ +2 AL", tone: "buy" },
    ],
  },
  {
    id: "simulator",
    title: "Simülatör",
    body: '"Bakiyemi o gün o kurumun önerilerine yatırsaydım ne olurdu?" Takvimden günü seç, kurumun o günkü gerçek önerilerini gör, para büyüme grafiğini izle. Geçmiş performans geleceğin garantisi değildir — ama iyi bir öğretmendir.',
    reversed: true,
    rows: [
      { left: "Başlangıç", value: "50.000 ₺" },
      { left: "Bitiş bakiyesi", value: "53.050 ₺", tone: "buy" },
      { left: "Getiri", value: "+%6,1", tone: "buy" },
    ],
  },
  {
    id: "ajanda",
    title: "Ajanda + KAP akışı",
    body: "TCMB ve Fed kararları, ABD TÜFE, bilanço ve temettü tarihleri tek takvimde; hisse sayfalarında son KAP bildirimleri tavsiye değişimlerinin yanında. Bağlantıyı sen kur, karar senin olsun.",
    reversed: false,
    rows: [
      { left: "🇹🇷 TCMB faiz kararı", value: "15.07 · 14:00" },
      { left: "🇺🇸 ABD TÜFE", value: "13.07 · 15:30" },
      { left: "TUPRS", value: "Temettü · 16.07" },
    ],
  },
];

export const PROOF_STATS = [
  { n: "68", label: "TAKİP EDİLEN KURUM" },
  { n: "%64", label: "SON 30 GÜN İSABET" },
  { n: "4.216", label: "ARŞİVLENEN RAPOR" },
];

export const PRICE_FEATURES = [
  "Tüm kurumların günlük önerileri + kaynak PDF arşivi",
  "Gün sonu doğrulanmış karne ve kurum isabet sicili",
  "Konsensüs, simülatör, ajanda, KAP akışı",
  "Telegram bildirimleri",
];

export const FAQ_ITEMS = [
  {
    q: "PARENA yatırım tavsiyesi veriyor mu?",
    a: "Hayır. PARENA, aracı kurumların kamuya açık raporlarındaki görüşleri derler, karşılaştırır ve sonuçlarını raporlar; kendi adına hiçbir alım-satım önerisi veya derecelendirme üretmez. Yatırım danışmanlığı, yetkili kuruluşlarla imzalanan sözleşme çerçevesinde sunulur.",
  },
  {
    q: "Nasıl üye olurum?",
    a: "PARENA davetle katılınan bir platformdur. Telegram botumuza yazın; ödemeniz onaylandığında davet kodunuz ve giriş bilgileriniz iletilir.",
  },
  {
    q: "Veriler nereden geliyor?",
    a: "Yalnızca SPK lisanslı aracı kurumların kamuya açık olarak yayınladığı günlük bülten ve araştırma raporlarından. Her önerinin yanında kaynak belgenin bağlantısı bulunur.",
  },
  {
    q: "Hesabımı paylaşabilir miyim?",
    a: "Üyelik kişiseldir ve tek aktif oturumla çalışır — yeni bir cihazdan giriş yapıldığında önceki oturum kapanır. Paylaşım tespitinde üyelik askıya alınır.",
  },
];

export const TELEGRAM_URL = "https://t.me/officialparena_bot";
