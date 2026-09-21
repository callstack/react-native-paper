import type { ReactNode } from 'react';

import { withBase } from '@rspress/core/dist/runtime/index.js';

/** Resolves a `docs/public/landing` asset against the configured base path. */
export const asset = (path: string) => withBase(`/landing/${path}`);

type Props = {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  id?: string;
};

export default function LandingSection({
  children,
  className,
  dark,
  id,
}: Props) {
  return (
    <section
      className={[
        'landing-section',
        dark ? 'landing-section--dark' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      id={id}
    >
      <div className="landing-section__inner">{children}</div>
    </section>
  );
}
