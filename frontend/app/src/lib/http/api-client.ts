import { env } from "@/config/env";

import { ApiError } from "./api-error";
import { clearCsrfToken, getCsrfToken } from "./csrf";

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

async function handleResponse<TResponse>(
  response: Response,
  allowUnauthorized?: boolean,
): Promise<TResponse> {
  const payload = await parseBody(response);

  if (!response.ok) {
    if (response.status === 401) {
      clearCsrfToken();
      if (allowUnauthorized) return null as TResponse;
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

async function doFetch(
  path: string,
  method: RequestOptions["method"],
  body: unknown,
  signal: AbortSignal | undefined,
  csrfHeader?: { name: string; value: string },
): Promise<Response> {
  return fetch(`${env.apiBaseUrl}${path}`, {
    method,
    credentials: "include",
    signal,
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(csrfHeader ? { [csrfHeader.name]: csrfHeader.value } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

/**
 * BFF (Backend-for-Frontend) istemcisi — oturum gerektiren (credential'lı) uçlar için.
 *
 * - `credentials: "include"` → oturum HttpOnly cookie ile taşınır,
 *   token hiçbir zaman JavaScript tarafında tutulmaz.
 * - Mutasyon (GET dışı) isteklerinde CSRF token, bellekteki store'dan alınıp
 *   backend'in bildirdiği header adıyla eklenir. Token cookie'den DEĞİL,
 *   `/api/csrf` endpoint'inden (WebSession-backed) okunur — bkz. `csrf.ts`.
 * - İlk CSRF denemesi 403 ile başarısız olursa (örn. session yenilendi,
 *   token stale kaldı) token zorla yenilenip istek BİR KEZ tekrar denenir.
 *
 * Cookie/CSRF taşımayan public uçlar (register vb.) için `publicApiRequest`
 * kullanılmalı — backend tarafında bu uçların CORS kaynağı credential'sız ve
 * dar kapsamlı tanımlı, bu istemciyle çağrılırlarsa preflight reddedilir.
 */
export async function apiRequest<TResponse>(
  path: string,
  { method = "GET", body, signal, allowUnauthorized }: RequestOptions = {},
): Promise<TResponse> {
  const isMutating = method !== "GET";
  let response: Response;

  try {
    let csrfHeader: { name: string; value: string } | undefined;
    if (isMutating) {
      const csrf = await getCsrfToken();
      csrfHeader = { name: csrf.headerName, value: csrf.token };
    }

    response = await doFetch(path, method, body, signal, csrfHeader);

    if (isMutating && response.status === 403) {
      const refreshed = await getCsrfToken(true);
      response = await doFetch(path, method, body, signal, {
        name: refreshed.headerName,
        value: refreshed.token,
      });
    }
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") {
      throw cause;
    }

    throw new ApiError({
      status: 0,
      message: "Sunucuya ulaşılamadı",
    });
  }

  return handleResponse<TResponse>(response, allowUnauthorized);
}

/**
 * BFF istemcisi — oturum/cookie/CSRF taşımayan public uçlar için (register vb.).
 *
 * Kimliksiz bir kullanıcının çalınacak bir session'ı yoktur; bu yüzden
 * `credentials` ve `X-Requested-With` bilinçli olarak gönderilmez. Backend
 * tarafında bu uçların CORS kaynağı da aynı şekilde credential'sız ve dar
 * kapsamlı tanımlıdır (bkz. SecurityConfig#registerCorsConfigurationSource).
 */
export async function publicApiRequest<TResponse>(
  path: string,
  { method = "GET", body, signal }: RequestOptions = {},
): Promise<TResponse> {
  let response: Response;

  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
      method,
      signal,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
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

  return handleResponse<TResponse>(response);
}