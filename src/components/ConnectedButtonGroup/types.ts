import type {
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import type { ConnectedButtonGroupSize } from './tokens';
import type { ThemeProp } from '../../types';
import type { IconSource } from '../Icon';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';

/**
 * Position of a button within the connected group. Determines which corners
 * stay pinned to the outer (fully-rounded) radius and which morph.
 */
export const connectedButtonPositions = {
  single: 'single',
  first: 'first',
  middle: 'middle',
  last: 'last',
} as const;

export type ConnectedButtonPosition =
  (typeof connectedButtonPositions)[keyof typeof connectedButtonPositions];

/**
 * Props of a single button rendered by the group. Everything a
 * `ConnectedButtonConfig` entry carries, plus the state the group derives for
 * it (`checked`, `position`, `size`, `multiSelect`).
 *
 * The overlap with `ConnectedButtonConfig` is deliberate: the docs generator
 * only expands the `buttons` API table when the config is an inline object
 * literal in `ConnectedButtonGroup.tsx`.
 */
export type ConnectedButtonProps = {
  /**
   * Whether the button is currently selected.
   */
  checked: boolean;
  /**
   * Whether the parent group allows multiple selections. Controls the
   * accessibility role (checkbox vs radio).
   */
  multiSelect?: boolean;
  /**
   * Position of the button inside the connected group. Controls which corners
   * stay pinned to the group's outer radius and which morph on selection/press.
   */
  position: ConnectedButtonPosition;
  /**
   * Size of the button, matching the parent group.
   */
  size: ConnectedButtonGroupSize;
  /**
   * Icon to display before the label.
   */
  icon?: IconSource;
  /**
   * Label text of the button.
   */
  label?: string;
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;
  /**
   * Show an optional check icon to indicate the selected state. When the
   * button also has a label, the check replaces the leading icon.
   */
  showSelectedCheck?: boolean;
  /**
   * Custom color for the selected label and icon.
   */
  checkedColor?: string;
  /**
   * Custom color for the unselected label and icon.
   */
  uncheckedColor?: string;
  /**
   * Type of background drawable to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Accessibility label. Read by the screen reader when the button is focused.
   */
  'aria-label'?: string;
  /**
   * Function to execute on press.
   */
  onPress?: (event: GestureResponderEvent) => void;
  /**
   * Specifies the largest possible scale a label font can reach.
   */
  labelMaxFontSizeMultiplier?: number;
  /**
   * Sets additional distance outside of the button in which a press can be
   * detected.
   */
  hitSlop?: TouchableRippleProps['hitSlop'];
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the button label.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * testID to be used on tests.
   */
  testID?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
};
