import { defaultShapes } from '../tokens/sys/shape';
import { defaultFonts } from '../tokens/sys/typography';
import type { Theme } from '../types';

type ThemeDefaults = Omit<Theme, 'dark' | 'mode' | 'colors'>;

export const themeDefaults: ThemeDefaults = {
  animation: {
    scale: 1.0,
  },
  fonts: defaultFonts,
  shapes: defaultShapes,
};
