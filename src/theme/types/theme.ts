import type { $DeepPartial } from '@callstack/react-theme-provider';

import type { ThemeColors } from './color';
import type { Typescale } from './typography';

type Mode = 'adaptive' | 'exact';

export type ThemeBase = {
  dark: boolean;
  mode?: Mode;
  roundness: number;
  animation: {
    scale: number;
    defaultAnimationDuration?: number;
  };
};

export type Theme = ThemeBase & {
  colors: ThemeColors;
  fonts: Typescale;
};

export type InternalTheme = Theme;

export type ThemeProp = $DeepPartial<InternalTheme>;
