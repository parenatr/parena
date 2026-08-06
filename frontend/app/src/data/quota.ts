/** Kurucu üyelik kontenjanı — BFF hazır olduğunda tek noktadan beslenecek. */
export const FOUNDER_QUOTA = {
  taken: 112,
  total: 150,
} as const;

export const FOUNDER_QUOTA_LEFT = FOUNDER_QUOTA.total - FOUNDER_QUOTA.taken;

export const FOUNDER_PRICE = "149 ₺/ay";
