import { apiRequest } from "@/lib/http/api-client";

import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  SessionUser,
} from "./auth.types";

/**
 * BFF sözleşmesi (Spring Boot tarafında karşılığı olması gereken uçlar).
 * Tek yerde tutulur ki backend isim değiştirdiğinde sadece burası güncellensin.
 */
export const AUTH_ENDPOINTS = {
  login: "/api/auth/login",
  register: "/api/auth/register",
  forgotPassword: "/api/auth/forgot-password",
  resetPassword: "/api/auth/reset-password",
  me: "/api/auth/me",
  logout: "/api/auth/logout",
} as const;

/** Başarılıysa BFF HttpOnly session cookie set eder; gövde beklenmez. */
export const login = (data: LoginRequest) =>
  apiRequest<void>(AUTH_ENDPOINTS.login, { method: "POST", body: data });

export const register = (data: RegisterRequest) =>
  apiRequest<void>(AUTH_ENDPOINTS.register, { method: "POST", body: data });

/** Kullanıcı sızdırmamak için backend her durumda 2xx dönmelidir. */
export const forgotPassword = (data: ForgotPasswordRequest) =>
  apiRequest<void>(AUTH_ENDPOINTS.forgotPassword, { method: "POST", body: data });

/** Token geçersiz/süresi dolmuşsa backend 400 döner. */
export const resetPassword = (data: ResetPasswordRequest) =>
  apiRequest<void>(AUTH_ENDPOINTS.resetPassword, { method: "POST", body: data });

/**
 * Oturum yoksa 401 yerine null döner.
 *
 * Ek koruma: BFF henüz yayında değilken SPA fallback'i (Netlify `/* -> index.html`)
 * 200 + HTML döndürebilir. Gövde geçerli bir kullanıcı nesnesi değilse oturum yok sayılır.
 */
export const fetchSession = async (signal?: AbortSignal) => {
  const payload = await apiRequest<unknown>(AUTH_ENDPOINTS.me, {
    signal,
    allowUnauthorized: true,
  });

  if (!payload || typeof payload !== "object") return null;
  const candidate = payload as Partial<SessionUser>;
  if (typeof candidate.id !== "string" || typeof candidate.email !== "string") return null;

  return { ...candidate, roles: candidate.roles ?? [] } as SessionUser;
};

export const logout = () => apiRequest<void>(AUTH_ENDPOINTS.logout, { method: "POST" });
