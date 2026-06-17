import { useEffect, useMemo } from 'react';

import {
  usePage,
  useVersion,
  withBase,
} from '@rspress/core/dist/runtime/index.js';

const legacyVersions = [
  { label: '4.x', href: '/4.0/' },
  { label: '3.x', href: '/3.0/' },
  { label: '2.x', href: '/2.0/' },
  { label: '1.x', href: '/1.0/' },
];

const VERSION_MENU_SELECTORS = [
  '.rp-nav__others > .rp-nav-menu__item',
  '.rp-nav-hamburger__md__hover-group > .rp-nav-menu__item',
].join(', ');

type VersionLink = {
  active: boolean;
  external?: boolean;
  href: string;
  label: string;
};

const isVersionMenu = (item: Element) => {
  const label = item
    .querySelector(':scope > .rp-nav-menu__item__container')
    ?.textContent?.trim();
  const menu = item.querySelector(':scope > .rp-hover-group');

  return Boolean(menu && label && /^(5\.x|6\.x)$/.test(label));
};

const readMenuSignature = (menu: HTMLUListElement) =>
  Array.from(menu.children)
    .map((child) => {
      const anchor = child.querySelector('a');
      const active = child.classList.contains('rp-hover-group__item--active');

      return `${anchor?.textContent ?? ''}:${
        anchor?.getAttribute('href') ?? ''
      }:${active}`;
    })
    .join('|');

const createVersionItem = (link: VersionLink) => {
  const item = document.createElement('li');
  item.className = link.active
    ? 'rp-hover-group__item rp-hover-group__item--active'
    : 'rp-hover-group__item';
  item.dataset.depth = '0';
  item.style.paddingLeft = '8px';

  const anchor = document.createElement('a');
  anchor.className = 'rp-hover-group__item__link rp-link';
  anchor.href = link.href;
  anchor.setAttribute('aria-label', link.label);
  if (link.external) {
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
  }

  const label = document.createElement('span');
  label.textContent = link.label;
  anchor.append(label);

  if (link.external) {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    icon.setAttribute('width', '14');
    icon.setAttribute('height', '14');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '2');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');
    icon.setAttribute('aria-hidden', 'true');
    icon.style.marginLeft = '6px';
    icon.style.flexShrink = '0';

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M14 3h7v7m0-7L10 14m-4-7H3v14h14v-3');
    icon.append(path);
    anchor.append(icon);
  }

  anchor.style.display = 'inline-flex';
  anchor.style.alignItems = 'center';
  anchor.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (link.external) {
      window.open(link.href, '_blank', 'noopener,noreferrer');
      return;
    }

    window.location.assign(link.href);
  });

  item.append(anchor);

  return item;
};

export default function PaperVersionSelector() {
  const { page } = usePage();
  const version = useVersion() ?? '5.x';

  const links = useMemo(() => {
    const routePath = page.routePath ?? '/';
    const stableRoute = routePath.startsWith('/6.x/')
      ? routePath.replace(/^\/6\.x/, '')
      : routePath;
    const nextRoute = routePath.startsWith('/6.x/')
      ? routePath
      : routePath === '/'
      ? '/6.x/'
      : `/6.x${routePath}`;

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
    if (typeof document === 'undefined') {
      return undefined;
    }

    const expectedSignature = links
      .map((link) => `${link.label}:${link.href}:${link.active}`)
      .join('|');

    const applyLegacyLinks = () => {
      for (const item of Array.from(
        document.querySelectorAll(VERSION_MENU_SELECTORS)
      )) {
        if (!isVersionMenu(item)) {
          continue;
        }

        const label = item.querySelector(
          ':scope > .rp-nav-menu__item__container'
        );
        const menu = item.querySelector(':scope > .rp-hover-group');

        if (
          !(label instanceof HTMLElement) ||
          !(menu instanceof HTMLUListElement)
        ) {
          continue;
        }

        const currentLabel = version === '6.x' ? '6.x' : '5.x';
        const textNode = Array.from(label.childNodes).find(
          (node) => node.nodeType === Node.TEXT_NODE
        );

        if (textNode && textNode.textContent?.trim() !== currentLabel) {
          textNode.textContent = currentLabel;
        }

        if (readMenuSignature(menu) === expectedSignature) {
          continue;
        }

        menu.replaceChildren(...links.map(createVersionItem));
      }
    };

    let frame = window.requestAnimationFrame(applyLegacyLinks);
    const observer = new MutationObserver(() => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(applyLegacyLinks);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [links, version]);

  return null;
}
