import type { AnchorHTMLAttributes } from "react";
import { Link } from "react-router-dom";

/**
 * Uygulama içi bağlantı sarmalayıcısı.
 * Tasarım HTML'lerindeki `href` sözdizimi korunur; router'a özel API tek dosyada tutulur.
 */
export type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const isExternal = (href: string) =>
  /^(https?:|mailto:|tel:)/.test(href) || href.startsWith("#");

export function AppLink({ href, children, ...rest }: AppLinkProps) {
  if (isExternal(href)) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} {...rest}>
      {children}
    </Link>
  );
}
