/**
 * PARENA merkezi fiyatlandırma ve kontenjan yapılandırması.
 * Tekil doğruluk kaynağı (Single Source of Truth).
 */
export const PRICING_CONFIG = {
  founder: {
    monthlyPrice: 149,
    yearlyPrice: 1490,
    standardMonthlyPrice: 249,
    maxFounders: 150,
    takenFounders: 112,
    monthlyPriceLabel: "149 ₺/ay",
    yearlyPriceLabel: "1.490 ₺/yıl",
    standardMonthlyPriceLabel: "249 ₺/ay",
  },
  free: {
    price: 0,
    priceLabel: "0 ₺/ay",
  },
} as const;

export const FOUNDER_QUOTA_LEFT =
  PRICING_CONFIG.founder.maxFounders - PRICING_CONFIG.founder.takenFounders;
