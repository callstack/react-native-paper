import * as React from 'react';
import type {
  Animated,
  ColorValue,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { Theme, ThemeProp } from '../../types';
import type { IconSource } from '../Icon';
import IconButton from '../IconButton/IconButton';

export type Props = React.ComponentPropsWithoutRef<typeof IconButton> & {
  /**
   *  Custom color for action icon.
   */
  color?: ColorValue;
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
   * Whether it's the leading button. Note: If `Appbar.BackAction` is present, it will be rendered before any `isLeading` icons.
   */
  isLeading?: boolean;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  ref?: React.Ref<View>;
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
 *   <Appbar.Header>
 *      <Appbar.Content title="Title" subtitle={'Subtitle'} />
 *       <Appbar.Action icon="magnify" onPress={() => {}} />
 *       <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
 *   </Appbar.Header>
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
  isLeading,
  theme: themeOverrides,
  ref,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { colors } = theme as Theme;

  const actionIconColor = iconColor
    ? iconColor
    : isLeading
    ? colors.onSurface
    : colors.onSurfaceVariant;

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
      {...rest}
    />
  );
};

AppbarAction.displayName = 'Appbar.Action';

export default AppbarAction;

// @component-docs ignore-next-line
export { AppbarAction };
