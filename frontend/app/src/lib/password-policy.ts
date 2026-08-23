export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_STRONG_LENGTH = 12; // strength meter bonus eşiği

export type PasswordRuleId =
    | "length"
    | "upper"
    | "lower"
    | "digit"
    | "special"
    | "notUsername";

const UPPER_RE = /[A-ZÇĞİÖŞÜ]/;
const LOWER_RE = /[a-zçğıöşü]/;
const DIGIT_RE = /[0-9]/;
// Türkçe harfleri özel karakter SAYMIYOR — Keycloak'un Unicode-farkında
// specialChars policy'siyle tutarlı olması için.
const SPECIAL_RE = /[^A-Za-z0-9ÇĞİÖŞÜçğıöşü]/;

/** Realm'deki passwordPolicy string'inin birebir client-side karşılığı.
 *  `username` parametresine burada normalize edilmiş email geçilmeli
 *  (username = email olduğu için). */
export function getPasswordRuleError(
    password: string,
    username?: string
): string | undefined {
    if (password.length < PASSWORD_MIN_LENGTH) {
        return `Parola en az ${PASSWORD_MIN_LENGTH} karakter olmalı.`;
    }
    if (!UPPER_RE.test(password)) return "Parola en az 1 büyük harf içermeli.";
    if (!LOWER_RE.test(password)) return "Parola en az 1 küçük harf içermeli.";
    if (!DIGIT_RE.test(password)) return "Parola en az 1 rakam içermeli.";
    if (!SPECIAL_RE.test(password)) return "Parola en az 1 özel karakter içermeli.";
    if (username && password.toLowerCase() === username.toLowerCase()) {
        return "Parola, e-posta adresinle aynı olamaz.";
    }
    return undefined;
}

export function scorePasswordStrength(password: string): number {
    let score = 0;
    if (password.length >= PASSWORD_MIN_LENGTH) score++;
    if (password.length >= PASSWORD_STRONG_LENGTH) score++;
    if (UPPER_RE.test(password) && LOWER_RE.test(password)) score++;
    if (DIGIT_RE.test(password) && SPECIAL_RE.test(password)) score++;
    return Math.min(score, 4);
}

export const STRENGTH_LABELS = [
    "Parola gücü ölçülüyor",
    "Zayıf",
    "Orta",
    "İyi",
    "Güçlü",
] as const;