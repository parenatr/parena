import { env } from "@/config/env";
import { apiRequest, publicApiRequest } from "@/lib/http/api-client";
import { getCsrfToken } from "@/lib/http/csrf";

import { broadcastLogout } from "./auth-broadcast";
import type {
  RegisterRequest,
  SessionUser,
} from "./auth.types";

export const AUTH_ENDPOINTS = {
  register: "/api/v1/users/register",
  me: "/api/auth/me",
  logout: "/api/auth/logout",
} as const;

export function getLoginRedirectUrl(): string {
  return `${env.apiBaseUrl}/oauth2/authorization/keycloak`;
}

export const register = (data: RegisterRequest) =>
  publicApiRequest<void>(AUTH_ENDPOINTS.register, { method: "POST", body: data });

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

/**
 * Tam sayfa form-submit ile logout: RP-initiated logout, Keycloak'a redirect
 * zinciri gerektirdiği için `fetch` ile değil, native form submission ile
 * tetiklenir. CSRF token'ı bellekteki store'dan alınır (cookie'den DEĞİL).
 */
export const logout = async (): Promise<void> => {
  const csrf = await getCsrfToken();
  broadcastLogout();

  const form = document.createElement("form");
  form.method = "POST";
  form.action = `${env.apiBaseUrl}${AUTH_ENDPOINTS.logout}`;
  form.style.display = "none";

  const csrfInput = document.createElement("input");
  csrfInput.type = "hidden";
  csrfInput.name = csrf.parameterName;
  csrfInput.value = csrf.token;

  form.appendChild(csrfInput);
  document.body.appendChild(form);
  form.submit();
};