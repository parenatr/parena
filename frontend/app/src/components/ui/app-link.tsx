import type { AnchorHTMLAttributes } from "react";
import { Link, useInRouterContext } from "react-router-dom";

export type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const isExternal = (href: string) =>
  /^(https?:|mailto:|tel:)/.test(href) || href.startsWith("#");

export function AppLink({ href, children, ...rest }: AppLinkProps) {
  const inRouterContext = useInRouterContext();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (rest.onClick) {
      rest.onClick(e);
    }
    if (href === "/" || href === "") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Dış bağlantı ise VEYA React Router Context dışında çalışıyorsa normal <a> kullan
  if (isExternal(href) || !inRouterContext) {
    return (
      <a href={href} {...rest} onClick={handleClick}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} {...rest} onClick={handleClick}>
      {children}
    </Link>
  );
}