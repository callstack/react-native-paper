import type { ViewStyle } from 'react-native';

import { tokens } from '../theme/tokens';

const { thickness, outerOffset } = tokens.md.sys.state.focusIndicator;

export const FOCUS_RING_THICKNESS = thickness;

/** Outer offset plus stroke so the ring's inner edge clears the surface. */
export const FOCUS_RING_INSET = outerOffset + thickness;

// Web-only style; not in StyleSheet because `outline` is outside ViewStyle.
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export const webNoOutline = { outline: 'none' } as unknown as ViewStyle;
