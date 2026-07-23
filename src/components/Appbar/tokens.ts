import type { ColorRole, TypescaleKey } from '../../theme/types';
import type { ShapeToken } from '../../theme/utils/shape';

/**
 * MD3 Top app bar tokens.
 * @see https://m3.material.io/components/app-bars/specs
 *
 * Spec re-check (M3 app bars): small 64dp; medium flexible expanded ~112dp;
 * large flexible expanded ~152dp; container surface → surfaceContainer on scroll;
 * headline titleLarge / headlineSmall / headlineMedium; onSurface / onSurfaceVariant icons.
 */
const sizes = {
  /** Small / center-aligned resting height. */
  smallHeight: 64,
  /** Medium flexible expanded height (baseline medium height). */
  mediumFlexibleHeight: 112,
  /** Large flexible expanded height (baseline large height). */
  largeFlexibleHeight: 152,
  /** Horizontal padding around actions. */
  paddingHorizontal: 4,
  /** Leading content inset after first action. */
  contentStartMargin: 12,
  /** Trailing action icon size. */
  actionIconSize: 24,
  /** Logo / image size in the top row. */
  logoSize: 32,
} as const;

const shapes = {
  container: 'none' as ShapeToken,
} as const;

const typography = {
  small: 'titleLarge' as TypescaleKey,
  mediumFlexible: 'headlineSmall' as TypescaleKey,
  largeFlexible: 'headlineMedium' as TypescaleKey,
  subtitle: 'bodyMedium' as TypescaleKey,
} as const;

const colors = {
  container: 'surface' as ColorRole,
  containerScrolled: 'surfaceContainer' as ColorRole,
  headline: 'onSurface' as ColorRole,
  subtitle: 'onSurfaceVariant' as ColorRole,
  leadingIcon: 'onSurface' as ColorRole,
  trailingIcon: 'onSurfaceVariant' as ColorRole,
} as const;

export const AppbarTokens = {
  sizes,
  shapes,
  typography,
  colors,
};

/**
 * Supported top app bar modes after MD3 modernization.
 * - `small` — 64dp; use `titleAlign` for start/center.
 * - `medium-flexible` — expanded medium flexible layout (+ subtitle / logo).
 * - `large-flexible` — expanded large flexible layout (+ subtitle / logo).
 * - `medium` / `large` — legacy baseline variants (deprecated).
 * - `center-aligned` — legacy alias for `small` + center title (deprecated).
 */
export type TopAppBarMode =
  | 'small'
  | 'medium'
  | 'large'
  | 'center-aligned'
  | 'medium-flexible'
  | 'large-flexible';

export type TitleAlign = 'start' | 'center';
