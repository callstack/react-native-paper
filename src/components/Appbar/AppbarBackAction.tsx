import * as React from 'react';
import type {
  Animated,
  ColorValue,
  GestureResponderEvent,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import type { $Omit } from './../../types';
import AppbarAction from './AppbarAction';
import AppbarBackIcon from './AppbarBackIcon';

export type Props = $Omit<
  React.ComponentPropsWithoutRef<typeof AppbarAction>,
  'icon'
> & {
  /**
   *  Custom color for back icon.
   */
  color?: ColorValue;
  /**
   * Optional icon size.
   */
  size?: number;
  /**
   * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  accessibilityLabel?: string;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  ref?: React.Ref<View>;
};

/**
 * A component used to display a back button in the appbar.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Appbar } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Appbar.Header>
 *     <Appbar.BackAction onPress={() => {}} />
 *   </Appbar.Header>
 * );
 *
 * export default MyComponent;
 * ```
 */
const AppbarBackAction = ({
  accessibilityLabel = 'Back',
  ref,
  ...rest
}: Props) => (
  <AppbarAction
    accessibilityLabel={accessibilityLabel}
    {...rest}
    icon={AppbarBackIcon}
    isLeading
    ref={ref}
  />
);

AppbarBackAction.displayName = 'Appbar.BackAction';

export default AppbarBackAction;

// @component-docs ignore-next-line
export { AppbarBackAction };
