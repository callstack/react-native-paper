import type { ReactNode } from 'react';

import type { CSSVars } from './cssVars';

const PRIMARY = 'rgba(33, 0, 93, 1)';
const WHITE = '#ffffff';
const GREY = '#d8d8d8';
const NEAR_BLACK = '#414757';

const variants: Record<'dark' | 'light', CSSVars> = {
  dark: {
    '--b1qn7xxj-0': PRIMARY,
    '--b1qn7xxj-1': WHITE,
    '--b1qn7xxj-2': WHITE,
    '--b1qn7xxj-3': WHITE,
    '--b1qn7xxj-4': PRIMARY,
    '--b1qn7xxj-5': PRIMARY,
  },
  light: {
    '--b1qn7xxj-0': WHITE,
    '--b1qn7xxj-1': GREY,
    '--b1qn7xxj-2': NEAR_BLACK,
    '--b1qn7xxj-3': GREY,
    '--b1qn7xxj-4': GREY,
    '--b1qn7xxj-5': NEAR_BLACK,
  },
};

type Props = {
  children: ReactNode;
  href: string;
  dark?: boolean;
  external?: boolean;
};

export default function LandingButton({
  children,
  href,
  dark,
  external,
}: Props) {
  return (
    <a
      className="b1qn7xxj"
      href={href}
      rel={external ? 'noopener noreferrer' : undefined}
      style={variants[dark ? 'dark' : 'light']}
      target={external ? '_blank' : undefined}
    >
      {children}
    </a>
  );
}
