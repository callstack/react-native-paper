import type { StyleProp, ViewStyle } from 'react-native';

import type { ThemeProp } from '../../types';

export type SliderProps = {
  /** Current value of the slider (controlled). */
  value: number;
  /** Minimum value. @default 0 */
  min?: number;
  /** Maximum value. @default 1 */
  max?: number;
  /** Step size. When set, the value snaps to multiples of `step` from `min`. */
  step?: number;
  /** Called with the new value whenever the user drags or taps the track. */
  onValueChange?: (value: number) => void;
  /** Whether the slider is disabled (no interaction, dimmed thumb). */
  disabled?: boolean;
  /** Color of the active track (left of the thumb). Defaults to theme primary. */
  color?: string;
  /** Color of the inactive track. Defaults to a translucent track. */
  trackColor?: string;
  /** Color of the thumb. Defaults to the active color. */
  thumbColor?: string;
  /** Style applied to the container. */
  style?: StyleProp<ViewStyle>;
  /** @optional */
  theme?: ThemeProp;
  /** TestID for testing. */
  testID?: string;
};
