/**
 * Ortam değişkenleri tek noktadan okunur.
 * Netlify'da: Site settings → Environment variables → VITE_API_BASE_URL
 * Örn: https://api.parena.com  (BFF sunucusunun kökü)
 *
 * Boş bırakılırsa istekler aynı origin'e (relative) gider; bu da Netlify
 * proxy/redirect ile BFF'e yönlendirme yapıldığı senaryoyu destekler.
 */
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export const env = {
  /** Sonunda "/" olmayacak şekilde normalize edilmiş BFF kök adresi. */
  apiBaseUrl: rawBaseUrl.replace(/\/+$/, ""),
  isProduction: import.meta.env.PROD,
} as const;
