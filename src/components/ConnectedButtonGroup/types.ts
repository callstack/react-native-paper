import type { KeyboardEvent, Ref } from 'react';
import type {
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import type { ConnectedButtonGroupSize } from './tokens';
import type { ThemeProp } from '../../theme/types';
import type { IconSource } from '../Icon';

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
 * Configuration for a single button rendered inside the group.
 */
export type ConnectedButtonConfig<T extends string = string> = {
  /**
   * Value of the button (required).
   */
  value: T;
  /**
   * Icon to display for the button.
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
   * Accessibility label for the button. Read by the screen reader when the
   * user taps the button.
   */
  'aria-label'?: string;
  /**
   * Custom color for the selected label and icon.
   */
  checkedColor?: string;
  /**
   * Custom color for the unselected label and icon.
   */
  uncheckedColor?: string;
  /**
   * Show an optional check icon to indicate the selected state.
   */
  showSelectedCheck?: boolean;
  /**
   * Type of background drawable to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Callback that is called when the button is pressed, in addition to the
   * group's `onValueChange`.
   */
  onPress?: (event: GestureResponderEvent) => void;
  /**
   * Specifies the largest possible scale a label font can reach.
   */
  labelMaxFontSizeMultiplier?: number;
  /**
   * Pass additional styles for the button container.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the button label.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

/**
 * Props of a single button rendered by the group: everything a
 * `ConnectedButtonConfig` entry carries except `value`, plus the state the group
 * derives for it.
 */
export type ConnectedButtonProps = Omit<ConnectedButtonConfig, 'value'> & {
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
   * Ref to the focusable element of the button.
   */
  ref?: Ref<View>;
  /**
   * Whether the button is a Tab stop.
   */
  tabIndex?: 0 | -1;
  /**
   * Called when a key goes down while the button has focus. Web only.
   */
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  /**
   * @optional
   */
  theme?: ThemeProp;
};
