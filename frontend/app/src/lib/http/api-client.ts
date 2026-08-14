import { env } from "@/config/env";

import { ApiError } from "./api-error";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  /** 401 alındığında hata fırlatmak yerine null dönmek için (örn. /me). */
  allowUnauthorized?: boolean;
};

type ProblemDetail = {
  message?: string;
  error?: string;
  detail?: string;
  code?: string;
  errors?: Record<string, string>;
  fieldErrors?: Record<string, string>;
};

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("json")) return await response.text();

  try {
    return await response.json();
  } catch {
    return null;
  }
}

function getCsrfTokenFromCookie(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * BFF (Backend-for-Frontend) istemcisi.
 *
 * - `credentials: "include"` → oturum HttpOnly cookie ile taşınır,
 *   token hiçbir zaman JavaScript tarafında tutulmaz.
 * - `X-Requested-With` → BFF'in tarayıcı isteğini ayırt edip 302 yerine
 *   401 dönebilmesi için (Spring Security standart pratiği).
 */
export async function apiRequest<TResponse>(
  path: string,
  { method = "GET", body, signal, allowUnauthorized }: RequestOptions = {},
): Promise<TResponse> {
  let response: Response;

  try {
    const csrfToken = getCsrfTokenFromCookie();

    response = await fetch(`${env.apiBaseUrl}${path}`, {
      method,
      credentials: "include",
      signal,
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(method !== "GET" && csrfToken
          ? { "X-XSRF-TOKEN": csrfToken }
          : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") {
      throw cause;
    }

    throw new ApiError({
      status: 0,
      message: "Sunucuya ulaşılamadı",
    });
  }

  const payload = await parseBody(response);

  if (!response.ok) {
    if (response.status === 401 && allowUnauthorized) {
      return null as TResponse;
    }

    const problem = (
      typeof payload === "object" && payload ? payload : {}
    ) as ProblemDetail;

    throw new ApiError({
      status: response.status,
      message: problem.message ?? problem.detail ?? problem.error ?? "",
      code: problem.code,
      fieldErrors: problem.fieldErrors ?? problem.errors,
    });
  }

  /**
   * BFF yayında değilken hosting SPA fallback'i 200 + index.html döndürebilir.
   * Bunu "başarı" saymak sahte oturum/sahte login'e yol açar; açıkça hata verilir.
   */
  if (
    typeof payload === "string" &&
    payload.trimStart().startsWith("<")
  ) {
    throw new ApiError({
      status: 502,
      message: "API sunucusuna ulaşılamadı",
      code: "API_NOT_REACHABLE",
    });
  }

  return payload as TResponse;
}