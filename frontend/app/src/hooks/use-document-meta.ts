import { useEffect } from "react";

type Meta = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
};

function setTag(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Sayfa başlığı ve meta etiketlerini SPA'da elle yönetir. */
export function useDocumentMeta({ title, description, ogTitle, ogDescription }: Meta) {
  useEffect(() => {
    document.title = title;
    setTag("name", "description", description);
    setTag("property", "og:title", ogTitle ?? title);
    setTag("property", "og:description", ogDescription ?? description);
    setTag("property", "og:type", "website");
    setTag("name", "twitter:card", "summary_large_image");
  }, [title, description, ogTitle, ogDescription]);
}
