/** BFF'ten dönen hataların tek tipli gösterimi. */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fieldErrors?: Record<string, string>;

  constructor(params: {
    status: number;
    message: string;
    code?: string;
    fieldErrors?: Record<string, string>;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.status = params.status;
    this.code = params.code;
    this.fieldErrors = params.fieldErrors;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isNetworkError() {
    return this.status === 0;
  }
}

/** Kullanıcıya gösterilecek kısa Türkçe mesaj. */
export function toUserMessage(error: unknown, fallback = "Bir hata oluştu") {
  if (error instanceof ApiError) {
    if (error.isNetworkError) return "Sunucuya ulaşılamadı";
    if (error.message) return error.message;
    if (error.status === 401) return "E-posta veya şifre hatalı";
    if (error.status === 409) return "Bu e-posta zaten kayıtlı";
    if (error.status === 429) return "Çok fazla deneme, biraz bekle";
    if (error.status >= 500) return "Sunucu hatası, tekrar dene";
  }
  return fallback;
}
