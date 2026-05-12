import type { $DeepPartial } from '@callstack/react-theme-provider';

import type { ThemeColors } from './color';
import type { ThemeElevation } from './elevation';
import type { MotionConfig } from './motion';
import type { ThemeShapes } from './shape';
import type { Typescale } from './typography';

export type Theme = {
  dark: boolean;
  animation: {
    scale: number;
  };
  colors: ThemeColors;
  fonts: Typescale;
  shapes: ThemeShapes;
  motion: MotionConfig;
  elevation: ThemeElevation;
};

export type InternalTheme = Theme;

export type ThemeProp = $DeepPartial<InternalTheme>;
