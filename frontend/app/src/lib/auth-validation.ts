const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const isValidEmail = (value: string) => EMAIL_PATTERN.test(normalizeEmail(value));

