import { StyleSheet, View } from 'react-native';
import type { ColorValue, StyleProp, ViewProps, ViewStyle } from 'react-native';

import { useInternalTheme } from '../../core/theming';
import { white } from '../../theme/colors';
import type { ThemeProp } from '../../theme/types';
import getContrastingColor from '../../utils/getContrastingColor';
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
  /**
   * Background color of the avatar.
   */
  backgroundColor?: ColorValue;
  /**
   * Style for the icon container.
   *
   * Background color should be specified via the `backgroundColor` prop instead.
   */
  style?: StyleProp<Omit<ViewStyle, 'backgroundColor'>>;
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
  backgroundColor: customBackgroundColor,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const backgroundColor = customBackgroundColor ?? theme.colors.primary;
  const textColor =
    rest.color ??
    getContrastingColor(backgroundColor, white, 'rgba(0, 0, 0, .54)');

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
        styles.container,
        style,
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
