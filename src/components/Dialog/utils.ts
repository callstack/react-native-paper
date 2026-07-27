import type {
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import type { IconSource } from '../Icon';

export type DialogChildProps = {
  style?: StyleProp<ViewStyle>;
};

export type DialogActionChildProps = DialogChildProps & {
  compact?: boolean;
  uppercase?: boolean;
};

/**
 * Declarative description of a single action button rendered in the
 * `Dialog.Actions` row when the `actions` prop is used.
 */
export type DialogAction = {
  /**
   * Text displayed inside the action button.
   */
  label: string;
  /**
   * Called when the action button is pressed.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Button mode. Defaults to `'text'`, matching Material Design 3 dialog buttons.
   */
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  /**
   * Icon to display on the button.
   */
  icon?: IconSource;
  /**
   * Whether the button shows a loading indicator.
   */
  loading?: boolean;
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;
  /**
   * Style applied to the button label.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Optional key to stabilize the rendered list of action buttons.
   */
  key?: string | number;
  /**
   * testID used for the action button.
   */
  testID?: string;
};
