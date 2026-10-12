import type { ReactNode } from 'react';

import type { CSSVars } from './cssVars';

const PRIMARY = 'rgba(33, 0, 93, 1)';
const WHITE = '#ffffff';
const GREY = '#d8d8d8';
const NEAR_BLACK = '#414757';

/** components/Button.js — `b1qn7xxj` reads six custom properties. */
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
      href={href}
      rel={external ? 'noopener noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      <button
        className="b1qn7xxj"
        style={variants[dark ? 'dark' : 'light']}
        type="button"
      >
        {children}
      </button>
    </a>
  );
}
