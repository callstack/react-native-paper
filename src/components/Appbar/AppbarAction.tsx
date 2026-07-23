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

export type Props = Omit<
  React.ComponentPropsWithoutRef<typeof IconButton>,
  'mode' | 'icon' | 'iconColor'
> & {
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
   * Visual mode for the action.
   * - `standard` — default icon button (default)
   * - `filled` — contained (primary) filled trailing action (MD3)
   * - `tonal` — contained-tonal filled trailing action (MD3)
   */
  mode?: 'standard' | 'filled' | 'tonal';
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  ref?: React.Ref<View>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * Action item for a top app bar. Supports standard icon buttons and a single
 * filled / tonal trailing action (`mode="filled"` | `mode="tonal"`).
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { TopAppBar } from 'react-native-paper';
 * import { Platform } from 'react-native';
 *
 * const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
 *
 * const MyComponent = () => (
 *   <TopAppBar.Header>
 *     <TopAppBar.Content title="Title" />
 *     <TopAppBar.Action icon="magnify" onPress={() => {}} />
 *     <TopAppBar.Action icon="plus" mode="filled" onPress={() => {}} />
 *     <TopAppBar.Action icon={MORE_ICON} onPress={() => {}} />
 *   </TopAppBar.Header>
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
  mode = 'standard',
  theme: themeOverrides,
  ref,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { colors } = theme as Theme;

  const isFilled = mode === 'filled' || mode === 'tonal';
  const iconButtonMode =
    mode === 'filled'
      ? 'contained'
      : mode === 'tonal'
        ? 'contained-tonal'
        : undefined;

  const actionIconColor = iconColor
    ? iconColor
    : isFilled
      ? mode === 'filled'
        ? colors.onPrimary
        : colors.onSecondaryContainer
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
      aria-label={ariaLabel}
      mode={iconButtonMode}
      containerColor={
        isFilled
          ? mode === 'filled'
            ? colors.primary
            : colors.secondaryContainer
          : undefined
      }
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
