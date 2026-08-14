import type { AnchorHTMLAttributes } from "react";
import { Link, useInRouterContext } from "react-router-dom";

export type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const isExternal = (href: string) =>
  /^(https?:|mailto:|tel:)/.test(href) || href.startsWith("#");

export function AppLink({ href, children, ...rest }: AppLinkProps) {
  const inRouterContext = useInRouterContext();
  if (isExternal(href) || !inRouterContext) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (rest.onClick) {
      rest.onClick(e);
    }
    // Eğer hedef anasayfa ("/") ise, tıklandığında her koşulda en üste kaydır
    if (href === "/" || href === "") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <Link to={href} {...rest} onClick={handleClick}>
      {children}
    </Link>
  );
}
