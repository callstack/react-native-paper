import * as React from 'react';
import type { ColorValue, StyleProp, View, ViewStyle } from 'react-native';

import type { AnimatedStyle } from 'react-native-reanimated';

import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';
import type { IconSource } from '../Icon';
import IconButton from '../IconButton/IconButton';
import type { Props as IconButtonProps } from '../IconButton/IconButton';

export type Props = React.PropsWithoutRef<IconButtonProps> & {
  /**
   *  Custom color for action icon.
   */
  color?: ColorValue;
  /**
   * Name of the icon to show.
   */
  icon: IconSource;
  /**
   * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  'aria-label'?: string;
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
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
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
  color: iconColor,
  icon,
  disabled,
  onPress,
  'aria-label': ariaLabel,
  isLeading,
  theme: themeOverrides,
  ref,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { colors } = theme;

  const actionIconColor = iconColor
    ? iconColor
    : isLeading
      ? colors.onSurface
      : colors.onSurfaceVariant;

  return (
    <IconButton
      onPress={onPress}
      iconColor={actionIconColor}
      icon={icon}
      disabled={disabled}
      aria-label={ariaLabel}
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
