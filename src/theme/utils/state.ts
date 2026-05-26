import { tokens } from '../tokens';
import type { ColorRole, StateLayer, StateOpacityKey, Theme } from '../types';

const stateOpacity = tokens.md.sys.state.opacity;

/**
 * Resolve a `{ color, opacity }` state-layer for a color role + interaction
 * state. Reads `theme.colors[role]` live, so it stays correct under deeply-merged theme overrides.
 *
 * @example
 *   const stateLayer = getStateLayer(theme, 'primary', 'hovered');
 *   // { color: theme.colors.primary, opacity: 0.08 }
 */
export function getStateLayer(
  theme: Theme,
  role: ColorRole,
  state: StateOpacityKey
): StateLayer {
  return {
    color: theme.colors[role],
    opacity: stateOpacity[state],
  };
}
