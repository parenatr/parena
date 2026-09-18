import { env } from "@/config/env";

type CsrfTokenInfo = {
  token: string;
  headerName: string;
  parameterName: string;
};

let cachedToken: CsrfTokenInfo | null = null;
let inflightRequest: Promise<CsrfTokenInfo> | null = null;

async function fetchCsrfToken(): Promise<CsrfTokenInfo> {
  const response = await fetch(`${env.apiBaseUrl}/api/csrf`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`CSRF token alınamadı (status ${response.status})`);
  }

  const data = (await response.json()) as CsrfTokenInfo;
  cachedToken = data;
  return data;
}

/**
 * Bellekte tutulan CSRF token'ı döner; yoksa veya `forceRefresh` ise
 * `/api/csrf`'ten yeniden çeker. Eşzamanlı çağrılar tek bir isteği paylaşır.
 */
export async function getCsrfToken(forceRefresh = false): Promise<CsrfTokenInfo> {
  if (cachedToken && !forceRefresh) return cachedToken;

  if (!inflightRequest || forceRefresh) {
    inflightRequest = fetchCsrfToken().finally(() => {
      inflightRequest = null;
    });
  }

  return inflightRequest;
}

/** Session sonlandığında (401/logout) çağrılır — bir sonraki mutasyon isteği tazeden çeker. */
export function clearCsrfToken(): void {
  cachedToken = null;
}