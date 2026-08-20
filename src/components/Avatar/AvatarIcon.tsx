import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import { resolveAvatarColors } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import Icon from '../Icon';
import type { IconSource } from '../Icon';

const defaultSize = 64;

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
   * Custom color for the icon.
   */
  color?: string;
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
  size = defaultSize,
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
          borderRadius: size / 2,
          backgroundColor: background,
        },
        styles.container,
        restStyle,
      ]}
      {...rest}
    >
      <Icon source={icon} color={textColor} size={size * 0.6} />
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
