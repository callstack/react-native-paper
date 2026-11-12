import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { ColorValue, StyleProp, View, ViewStyle } from 'react-native';

import type { AnimatedStyle } from 'react-native-reanimated';

import { useAppbarContext, useAppbarItem } from './AppbarContext';
import { getAppbarColor } from './utils';
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
  /**
   * @supported Available in v6.x
   *
   * Visual variant of the action.
   * - `standard` - Icon without a container.
   * - `filled` - Icon in a container with the primary color.
   * - `tonal` - Icon in a container with the secondary container color.
   */
  variant?: 'standard' | 'filled' | 'tonal';
  /**
   * @supported Available in v6.x
   *
   * Width of the container of a `filled` or `tonal` action. It has no effect on a `standard` action.
   * - `default` - Square container.
   * - `wide` - Wide container.
   */
  width?: 'default' | 'wide';
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
  ref?: React.Ref<React.ComponentRef<typeof View>>;
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
 *      <Appbar.Content title="Title" />
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
  'aria-label': ariaLabel,
  isLeading,
  variant = 'standard',
  width = 'default',
  mode,
  selected,
  style,
  theme: themeOverrides,
  ref,
  ...rest
}: Props) => {
  const appbar = useAppbarContext();
  const theme = useInternalTheme(themeOverrides ?? appbar?.theme);
  const { colors } = theme;

  useAppbarItem(appbar, isLeading ? 'leading' : 'trailing');

  const isStandard = variant === 'standard';

  // The icon of a filled or tonal action takes the color of its container
  const actionIconColor = isStandard
    ? (getAppbarColor({ color: iconColor, isDark: appbar?.dark ?? false }) ??
      (isLeading ? colors.onSurface : colors.onSurfaceVariant))
    : iconColor;

  return (
    <IconButton
      size={size}
      onPress={onPress}
      iconColor={actionIconColor}
      icon={icon}
      disabled={disabled}
      aria-label={ariaLabel}
      mode={
        variant === 'filled'
          ? 'contained'
          : variant === 'tonal'
            ? 'contained-tonal'
            : mode
      }
      selected={isStandard ? selected : true}
      style={[!isStandard && width === 'wide' && styles.wide, style]}
      animated
      ref={ref}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  wide: {
    width: 56,
  },
});

AppbarAction.displayName = 'Appbar.Action';

export default AppbarAction;

// @component-docs ignore-next-line
export { AppbarAction };
