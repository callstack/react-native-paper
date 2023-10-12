import * as React from 'react';
import type {
  StyleProp,
  ViewStyle,
  View,
  Animated,
  ColorValue,
} from 'react-native';

import color from 'color';
import type { ThemeProp } from 'src/types';

import { useInternalTheme } from '../../core/theming';
import { black } from '../../styles/themes/v2/colors';
import { forwardRef } from '../../utils/forwardRef';
import type { IconSource } from '../Icon';
import IconButton from '../IconButton/IconButton';

export type Props = React.ComponentPropsWithoutRef<typeof IconButton> & {
  /**
   *  Custom color for action icon.
   */
  color?: string;
  /**
   * Color of the ripple effect.
   */
  rippleColor?: ColorValue;
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
  /**
   * @supported Available in v5.x with theme version 3
   *
   * Whether it's the leading button.
   */
  isLeading?: boolean;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  ref?: React.RefObject<View>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * A component used to display an action item in the appbar.
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
const AppbarAction = forwardRef<View, Props>(
  (
    {
      size = 24,
      color: iconColor,
      icon,
      disabled,
      onPress,
      accessibilityLabel,
      isLeading,
      theme: themeOverrides,
      rippleColor,
      ...rest
    }: Props,
    ref
  ) => {
    const theme = useInternalTheme(themeOverrides);

    const actionIconColor = iconColor
      ? iconColor
      : theme.isV3
      ? isLeading
        ? theme.colors.onSurface
        : theme.colors.onSurfaceVariant
      : color(black).alpha(0.54).rgb().string();

    return (
      <IconButton
        size={size}
        onPress={onPress}
        iconColor={actionIconColor}
        icon={icon}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        animated
        ref={ref}
        rippleColor={rippleColor}
        {...rest}
      />
    );
  }
);

AppbarAction.displayName = 'Appbar.Action';

export default AppbarAction;

// @component-docs ignore-next-line
export { AppbarAction };
