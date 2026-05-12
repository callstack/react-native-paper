/**
 * Compatibility aliases for v5 API names that were renamed in v6.
 *
 * This file is the single home for every `@deprecated` re-export so that, when
 * the time comes to remove them, deletion is a single `rm src/deprecated.ts`
 * (plus removing the corresponding re-export block from `src/index.tsx`).
 *
 * Do not add anything here that isn't a deprecated alias.
 */

import { DarkTheme } from './theme/schemes/DarkTheme';
import { LightTheme } from './theme/schemes/LightTheme';
import { Palette } from './theme/tokens';
import type { Theme, Elevation, TypescaleKey } from './types';

/**
 * @deprecated Use `LightTheme` instead. Will be removed in a future version.
 */
export const MD3LightTheme = LightTheme;

/**
 * @deprecated Use `DarkTheme` instead. Will be removed in a future version.
 */
export const MD3DarkTheme = DarkTheme;

/**
 * @deprecated Use `Palette` instead. Will be removed in a future version.
 */
export const MD3Colors = Palette;

/**
 * @deprecated Use `TypescaleKey` instead. Will be removed in a future version.
 */
export type MD3TypescaleKey = TypescaleKey;

/**
 * @deprecated Use `Theme` instead. Will be removed in a future version.
 */
export type MD3Theme = Theme;

/**
 * @deprecated Use `Elevation` instead. Will be removed in a future version.
 */
export type MD3Elevation = Elevation;
