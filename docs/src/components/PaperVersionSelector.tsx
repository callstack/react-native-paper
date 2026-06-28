import { useEffect, useMemo, useRef } from 'react';

import {
  usePage,
  useVersion,
  withBase,
} from '@rspress/core/dist/runtime/index.js';

import { getNextRoute, getStableRoute } from '../utils/versionRoutes';

const legacyVersions = [
  { label: '4.x', href: '/4.0/' },
  { label: '3.x', href: '/3.0/' },
  { label: '2.x', href: '/2.0/' },
  { label: '1.x', href: '/1.0/' },
];

type VersionLink = {
  active: boolean;
  external?: boolean;
  href: string;
  label: string;
};

export default function PaperVersionSelector() {
  const { page } = usePage();
  const version = useVersion() || '5.x';
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const links = useMemo<VersionLink[]>(() => {
    const routePath = page.routePath ?? '/';
    const stableRoute = getStableRoute(routePath);
    const nextRoute = getNextRoute(routePath);

    const primaryLink =
      version === '6.x'
        ? { active: true, href: withBase(nextRoute), label: '6.x' }
        : { active: true, href: withBase(stableRoute), label: '5.x' };
    const secondaryLink =
      version === '6.x'
        ? { active: false, href: withBase(stableRoute), label: '5.x' }
        : { active: false, href: withBase(nextRoute), label: '6.x' };

    return [
      primaryLink,
      secondaryLink,
      ...legacyVersions.map((item) => ({
        active: false,
        external: true,
        href: withBase(item.href),
        label: item.label,
      })),
    ];
  }, [page.routePath, version]);

  useEffect(() => {
    detailsRef.current?.removeAttribute('open');
  }, [page.routePath]);

  return (
    <details className="paper-version-selector" ref={detailsRef}>
      <summary>
        {version}
        <span aria-hidden="true"> ↓</span>
      </summary>
      <div className="paper-version-selector-menu">
        {links.map((link) => (
          <a
            key={`${link.label}:${link.href}`}
            className={[
              'paper-version-selector-link',
              link.active ? 'active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            href={link.href}
            rel={link.external ? 'noopener noreferrer' : undefined}
            target={link.external ? '_blank' : undefined}
            onClick={() => detailsRef.current?.removeAttribute('open')}
          >
            <span>{link.label}</span>
            {link.external ? (
              <svg
                aria-hidden="true"
                fill="none"
                height="14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="14"
              >
                <path d="M14 3h7v7m0-7L10 14m-4-7H3v14h14v-3" />
              </svg>
            ) : null}
          </a>
        ))}
      </div>
    </details>
  );
}
