import * as React from 'react';
import color from 'color';
import type {
  StyleProp,
  ViewStyle,
  TouchableWithoutFeedback,
} from 'react-native';
import { black } from '../../styles/themes/v2/colors';
import IconButton from '../IconButton';
import type { IconSource } from '../Icon';
import { useTheme } from '../../core/theming';

type Props = React.ComponentPropsWithoutRef<typeof IconButton> &
  MD3Props & {
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

type MD3Props = {
  isLeadingIcon?: boolean;
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
  color: iconColor,
  icon,
  disabled,
  onPress,
  accessibilityLabel,
  isLeadingIcon,
  ...rest
}: Props) => {
  const { isV3, md } = useTheme();

  const actionIconColor = iconColor
    ? iconColor
    : isV3
    ? isLeadingIcon
      ? (md('md.sys.color.on-surface') as string)
      : (md('md.sys.color.on-surface-variant') as string)
    : color(black).alpha(0.54).rgb().string();

  return (
    <IconButton
      size={size}
      onPress={onPress}
      color={actionIconColor}
      icon={icon}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      animated
      {...rest}
    />
  );
};

AppbarAction.displayName = 'Appbar.Action';

export default AppbarAction;

// @component-docs ignore-next-line
export { AppbarAction };
