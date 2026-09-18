const CHANNEL_NAME = "parena-auth";
const STORAGE_KEY = "parena:auth:logout-at";

let channel: BroadcastChannel | null = null;
try {
  channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(CHANNEL_NAME) : null;
} catch {
  channel = null;
}

/**
 * Diğer açık `app.parena.com.tr` sekmelerine "oturum kapandı" sinyali yayınlar.
 * `localStorage` birincil kanal (storage event, BroadcastChannel'dan daha
 * evrensel desteklenir — private mode davranışı daha öngörülebilir);
 * `BroadcastChannel` varsa ek/daha hızlı bir kanal olarak kullanılır.
 * Logout'un `form.submit()`'inden (tam sayfa navigasyon) ÖNCE çağrılmalı.
 */
export function broadcastLogout(): void {
  try {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  } catch {
    // localStorage kapalıysa (private mode) sessizce yut — bu sekme zaten
    // form-submit ile ayrılacak, kendi state'i için bir sorun değil.
  }

  try {
    channel?.postMessage("logout");
  } catch {
    // BroadcastChannel desteklenmiyor/kapanmışsa localStorage fallback yeterli.
  }
}

/**
 * Diğer sekmelerde çalışır: logout sinyalini dinler ve `callback`'i tetikler.
 * Cleanup fonksiyonu döner (React `useEffect` ile kullanım için).
 */
export function onRemoteLogout(callback: () => void): () => void {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) callback();
  };
  window.addEventListener("storage", handleStorage);

  const handleMessage = () => callback();
  channel?.addEventListener("message", handleMessage);

  return () => {
    window.removeEventListener("storage", handleStorage);
    channel?.removeEventListener("message", handleMessage);
  };
}
