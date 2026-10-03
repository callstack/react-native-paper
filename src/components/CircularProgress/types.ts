import type { StyleProp, ViewStyle } from 'react-native';

import type { ThemeProp } from '../../types';

/**
 * Material 3 determinate circular progress indicator.
 */
export type CircularProgressProps = {
  /** Progress from 0 to 1 (clamped). 0 is empty, 1 is a full circle. */
  progress: number;
  /** Diameter of the indicator in pixels. @default 48 */
  size?: number;
  /** Stroke thickness in pixels. @default 4 */
  thickness?: number;
  /** Color of the progress arc. Defaults to the theme primary color. */
  color?: string;
  /** Color of the background track. Defaults to a transparent track. */
  trackColor?: string;
  /** Style applied to the container. */
  style?: StyleProp<ViewStyle>;
  /** @optional */
  theme?: ThemeProp;
  /** TestID for testing. */
  testID?: string;
};
