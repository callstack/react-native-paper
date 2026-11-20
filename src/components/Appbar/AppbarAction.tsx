import * as React from 'react';
import type { ColorValue, StyleProp, View, ViewStyle } from 'react-native';

import type { AnimatedStyle } from 'react-native-reanimated';

import { useAppbarContext, useAppbarTheme } from './AppbarContext';
import { getAppbarColor } from './utils';
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
   * Whether it's the leading button: it takes the `onSurface` icon color instead of `onSurfaceVariant`.
   * It does not reorder the action, the parts are laid out in the order they are rendered.
   */
  isLeading?: boolean;
  /**
   * @supported Available in v6.x
   *
   * Visual variant of the action.
   * - `standard` - Icon without a container.
   * - `filled` - Icon in a container with the primary color.
   * - `tonal` - Icon in a container with the secondary container color.
   *
   * The `filled` and `tonal` variants set the `mode` of the icon button, so its `mode` prop is ignored.
   * Without `selected` they show the primary or the secondary container color. `selected` makes the action a
   * toggle, with the selected and unselected colors of the icon button.
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
  const theme = useAppbarTheme(themeOverrides);
  const { colors } = theme;

  const isStandard = variant === 'standard';

  // The icon of a filled or tonal action takes the color of its container
  const actionIconColor = isStandard
    ? (getAppbarColor({ color: iconColor, isDark: appbar?.dark ?? false }) ??
      (isLeading ? colors.onSurface : colors.onSurfaceVariant))
    : iconColor;

  // `filled` and `tonal` are also modes of the icon button, so `variant` takes
  // over `mode`. `selected` goes through as it is: without it the action is no
  // toggle and has the default container color.
  const iconButtonMode = isStandard ? mode : variant;

  return (
    <IconButton
      onPress={onPress}
      iconColor={actionIconColor}
      icon={icon}
      disabled={disabled}
      aria-label={ariaLabel}
      mode={iconButtonMode}
      selected={selected}
      width={isStandard ? undefined : width}
      style={style}
      animated
      theme={theme}
      ref={ref}
      {...rest}
    />
  );
};

AppbarAction.displayName = 'Appbar.Action';

export default AppbarAction;

// @component-docs ignore-next-line
export { AppbarAction };
