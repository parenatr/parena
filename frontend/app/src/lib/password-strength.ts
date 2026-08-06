export const STRENGTH_LABELS = [
  "Parola gücü ölçülüyor",
  "Zayıf",
  "Orta",
  "İyi",
  "Güçlü",
] as const;

/** 0-4 arası parola gücü skoru (tasarım HTML'indeki kuralın birebir karşılığı). */
export function scorePassword(value: string) {
  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[A-ZÇĞİÖŞÜ]/.test(value) && /[a-zçğıöşü]/.test(value)) score++;
  if (/[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value)) score++;
  return Math.min(score, 4);
}
