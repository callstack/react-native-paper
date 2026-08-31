import { cornerFull, cornerNone } from '../tokens/sys/shape';
import type { Theme, ThemeShapeCorners } from '../types';

/**
 * Token name accepted anywhere a corner radius is specified. `'none'` and
 * `'full'` resolve to the `cornerNone` / `cornerFull` constants; named
 * tokens key into `theme.shapes.corner`.
 */
export type ShapeToken = keyof ThemeShapeCorners | 'none' | 'full';

/**
 * Resolve a `ShapeToken` to a numeric corner radius.
 */
export function resolveCornerRadius(theme: Theme, token: ShapeToken): number {
  if (token === 'full') {
    return cornerFull;
  }
  if (token === 'none') {
    return cornerNone;
  }
  return theme.shapes.corner[token];
}
