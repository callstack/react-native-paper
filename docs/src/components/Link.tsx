import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { useSite } from '@rspress/core/dist/runtime/index.js';

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: ReactNode;
  to?: string;
};

const withBase = (href: string, base: string) => {
  if (/^(https?:)?\/\//.test(href) || href.startsWith('#')) {
    return href;
  }

  if (!href.startsWith('/')) {
    return href;
  }

  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${normalizedBase}${href}`;
};

export default function Link({ children, href, to, ...rest }: LinkProps) {
  const { site } = useSite();
  const targetHref = to ?? href ?? '#';

  return (
    <a href={withBase(targetHref, site.base ?? '/')} {...rest}>
      {children}
    </a>
  );
}
