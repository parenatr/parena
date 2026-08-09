import { env } from "@/config/env";
import { apiRequest } from "@/lib/http/api-client";

import type {
  ForgotPasswordRequest,
  RegisterRequest,
  ResetPasswordRequest,
  SessionUser,
} from "./auth.types";

export const AUTH_ENDPOINTS = {
  register: "/api/v1/users/register",
  forgotPassword: "/api/auth/forgot-password",
  resetPassword: "/api/auth/reset-password",
  me: "/api/auth/me",
  logout: "/api/auth/logout", // TODO: BFF'in gerçek logout mekanizması ayrı ele alınacak (aşağıya bakın)
} as const;

/** Keycloak'ın (ileride Keycloakify temalı) login sayfasına tam sayfa yönlendirme URL'i. */
export function getLoginRedirectUrl(): string {
  return `${env.apiBaseUrl}/oauth2/authorization/keycloak`;
}

export const register = (data: RegisterRequest) =>
  apiRequest<void>(AUTH_ENDPOINTS.register, { method: "POST", body: data });

export const forgotPassword = (data: ForgotPasswordRequest) =>
  apiRequest<void>(AUTH_ENDPOINTS.forgotPassword, { method: "POST", body: data });

export const resetPassword = (data: ResetPasswordRequest) =>
  apiRequest<void>(AUTH_ENDPOINTS.resetPassword, { method: "POST", body: data });

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

export const logout = () =>
  apiRequest<{ redirectUrl: string }>(AUTH_ENDPOINTS.logout, { method: "POST" });