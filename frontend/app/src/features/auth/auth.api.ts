import { apiRequest } from "@/lib/http/api-client";

import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
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

/** Oturum yoksa 401 yerine null döner. */
export const fetchSession = (signal?: AbortSignal) =>
  apiRequest<SessionUser | null>(AUTH_ENDPOINTS.me, {
    signal,
    allowUnauthorized: true,
  });

export const logout = () => apiRequest<void>(AUTH_ENDPOINTS.logout, { method: "POST" });
