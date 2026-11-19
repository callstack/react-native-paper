import { defaultElevation } from '../tokens/sys/elevation';
import { expressiveMotion } from '../tokens/sys/motion';
import { defaultShapes } from '../tokens/sys/shape';
import { defaultFonts } from '../tokens/sys/typography';
import type { Theme } from '../types';

type ThemeDefaults = Omit<Theme, 'dark' | 'colors'>;

export const themeDefaults: ThemeDefaults = {
  fonts: defaultFonts,
  shapes: defaultShapes,
  motion: expressiveMotion,
  elevation: defaultElevation,
};
