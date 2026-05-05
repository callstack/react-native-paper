import type { $DeepPartial } from '@callstack/react-theme-provider';

import type { ThemeColors } from './color';
import type { ThemeShapes } from './shape';
import type { ThemeState } from './state';
import type { Typescale } from './typography';

type Mode = 'adaptive' | 'exact';

export type ThemeBase = {
  dark: boolean;
  mode?: Mode;
  /** @deprecated Use `theme.shapes.*` instead. Will be removed in a future version. */
  roundness: number;
  animation: {
    scale: number;
    defaultAnimationDuration?: number;
  };
};

export type Theme = ThemeBase & {
  colors: ThemeColors;
  fonts: Typescale;
  state: ThemeState;
  shapes: ThemeShapes;
};

export type InternalTheme = Theme;

export type ThemeProp = $DeepPartial<InternalTheme>;
