import { useEffect } from "react";

export type PageMeta = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
};

function setTag(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * SPA'da sayfa başlığı/meta yönetimi (SSR head yerine).
 * Sadece bir React bileşeninin gövdesinde çağrılmalıdır.
 */
export function useDocumentMeta(meta: PageMeta) {
  useEffect(() => {
    document.title = meta.title;
    setTag('meta[name="description"]', "name", "description", meta.description);
    setTag('meta[property="og:title"]', "property", "og:title", meta.ogTitle);
    setTag(
      'meta[property="og:description"]',
      "property",
      "og:description",
      meta.ogDescription,
    );
    setTag('meta[property="og:type"]', "property", "og:type", "website");
    setTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
  }, [meta]);
}
