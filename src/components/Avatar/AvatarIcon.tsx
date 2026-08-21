import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import { DEFAULT_SIZE, ICON_SIZE_RATIO, resolveAvatarColors } from './utils';
import { useInternalTheme } from '../../core/theming';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { ThemeProp } from '../../types';
import Icon from '../Icon';
import type { IconSource } from '../Icon';

export type Props = ViewProps & {
  /**
   * Icon to display for the `Avatar`.
   */
  icon: IconSource;
  /**
   * Size of the avatar.
   */
  size?: number;
  /**
   * Custom color for the icon. Takes precedence over the automatic contrast
   * color below.
   */
  color?: string;
  /**
   * Style for the icon container. A custom `backgroundColor` is
   * automatically paired with a contrasting icon color when `color` is not
   * set: string values use a luminance heuristic, while opaque/dynamic
   * values (`PlatformColor` / `DynamicColorIOS`) are paired with a theme
   * role's `on-` color, falling back to `onSurface`.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * Avatars can be used to represent people in a graphical way.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Avatar } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Avatar.Icon size={24} icon="folder" />
 * );
 * ```
 */
const Avatar = ({
  icon,
  size = DEFAULT_SIZE,
  style,
  theme: themeOverrides,
  color: customColor,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { backgroundColor, ...restStyle } = StyleSheet.flatten(style) || {};
  const { background, textColor } = resolveAvatarColors({
    theme,
    backgroundColor,
    color: customColor,
  });

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: cornerFull,
          backgroundColor: background,
        },
        styles.container,
        restStyle,
      ]}
      {...rest}
    >
      <Icon source={icon} color={textColor} size={size * ICON_SIZE_RATIO} />
    </View>
  );
};

Avatar.displayName = 'Avatar.Icon';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Avatar;
