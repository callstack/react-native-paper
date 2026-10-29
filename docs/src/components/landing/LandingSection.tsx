import type { ReactNode } from 'react';

import { withBase } from '@rspress/core/dist/runtime/index.js';

import type { CSSVars } from './cssVars';

export const asset = (path: string) => withBase(`/landing/${path}`);

type Props = {
  children: ReactNode;
  variant: string;
  dark?: boolean;
  innerClassName?: string;
  id?: string;
};

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
