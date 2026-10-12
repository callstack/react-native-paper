import type { ReactNode } from 'react';

import { withBase } from '@rspress/core/dist/runtime/index.js';

import type { CSSVars } from './cssVars';

/** Resolves a `docs/public/landing` asset against the configured base path. */
export const asset = (path: string) => withBase(`/landing/${path}`);

/** An absolute URL to a page of this docs site, for links opened via Linking. */
export const docsHref = (path: string) =>
  typeof window === 'undefined'
    ? withBase(`/${path}`)
    : new URL(withBase(`/${path}`), window.location.origin).toString();

type Props = {
  children: ReactNode;
  /** The original's per-section linaria class, e.g. `wwffi0l` for the hero. */
  variant: string;
  dark?: boolean;
  /** Extra class on the inner 940px container. */
  innerClassName?: string;
  id?: string;
};

/**
 * layout/Section.js in the source. `sq6c5at` carries the padding and reads its
 * colours from two custom properties; `l1qehd68` / `d1pafg9o` supply the light
 * and dark dot patterns.
 */
export default function LandingSection({
  children,
  variant,
  dark,
  innerClassName,
  id,
}: Props) {
  const colours: CSSVars = {
    '--sq6c5at-0': dark ? 'rgba(33, 0, 93, 1)' : '#ffffff',
    '--sq6c5at-1': dark ? '#ffffff' : '#000000',
  };

  return (
    <section
      className={`${dark ? 'd1pafg9o' : 'l1qehd68'} ${variant} sq6c5at`}
      id={id}
      style={colours}
    >
      <div
        className={innerClassName ? `${innerClassName} s1o99i3g` : 's1o99i3g'}
      >
        {children}
      </div>
    </section>
  );
}
