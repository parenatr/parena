import { env } from "@/config/env";
import { apiRequest } from "@/lib/http/api-client";

import type {
  RegisterRequest,
  SessionUser,
} from "./auth.types";

export const AUTH_ENDPOINTS = {
  register: "/api/v1/users/register",
  me: "/api/auth/me",
  logout: "/api/auth/logout", // TODO: BFF'in gerçek logout mekanizması ayrı ele alınacak
} as const;

/** Keycloak'ın (Keycloakify temalı) login sayfasına tam sayfa yönlendirme URL'i. */
export function getLoginRedirectUrl(): string {
  return `${env.apiBaseUrl}/oauth2/authorization/keycloak`;
}

export const register = (data: RegisterRequest) =>
  apiRequest<void>(AUTH_ENDPOINTS.register, { method: "POST", body: data });

/** Keycloak'ın native "Forgot Password" akışına yönlendirme.
 *  Kullanıcı login sayfasına düşer; oradaki "Şifremi unuttum" linki
 *  Keycloak'un kendi reset-credentials ekranına götürür. */
export function getPasswordResetRedirectUrl(): string {
  return getLoginRedirectUrl();
}

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

export const logout = (): void => {
  // AJAX kullanmıyoruz; tarayıcıyı doğrudan BFF logout endpoint'ine sürüyoruz
  window.location.href = `${env.apiBaseUrl}${AUTH_ENDPOINTS.logout}`;
};