import * as React from 'react';
import color from 'color';
import type {
  StyleProp,
  ViewStyle,
  TouchableWithoutFeedback,
} from 'react-native';
import { black } from '../../styles/colors';
import IconButton from '../IconButton';
import type { IconSource } from '../Icon';

export type Props = React.ComponentPropsWithoutRef<typeof IconButton> & {
  /**
   *  Custom color for action icon.
   */
  color?: string;
  /**
   * Name of the icon to show.
   */
  icon: IconSource;
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
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  ref?: React.RefObject<TouchableWithoutFeedback>;
};

/**
 * A component used to display an action item in the appbar.
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/appbar-action-android.png" />
 *       <figcaption>Android</figcaption>
 *   </figure>
 * </div>
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/appbar-action-ios.png" />
 *       <figcaption>iOS</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Appbar } from 'react-native-paper';
 * import { Platform } from 'react-native';
 *
 * const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
 *
 * const MyComponent = () => (
 *     <Appbar.Header>
 *        <Appbar.Content title="Title" subtitle={'Subtitle'} />
 *         <Appbar.Action icon="magnify" onPress={() => {}} />
 *         <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
 *     </Appbar.Header>
 * );
 *
 * export default MyComponent;
 * ```
 */
const AppbarAction = ({
  size = 24,
  color: iconColor = color(black).alpha(0.54).rgb().string(),
  icon,
  disabled,
  onPress,
  accessibilityLabel,
  ...rest
}: Props) => (
  <IconButton
    size={size}
    onPress={onPress}
    color={iconColor}
    icon={icon}
    disabled={disabled}
    accessibilityLabel={accessibilityLabel}
    animated
    {...rest}
  />
);

AppbarAction.displayName = 'Appbar.Action';

export default AppbarAction;

// @component-docs ignore-next-line
export { AppbarAction };
