import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useInternalTheme } from '../../core/theming';
import { Colors } from '../../styles/themes/tokens';
import type { ThemeProp } from '../../types';
import getContrastingColor from '../../utils/getContrastingColor';
import Icon, { IconSource } from '../Icon';

const defaultSize = 64;

export type Props = React.ComponentPropsWithRef<typeof View> & {
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
  ...rest
}: Props) => {
  const {
    colors: { primary },
  } = useInternalTheme(themeOverrides);
  const { backgroundColor = primary, ...restStyle } =
    StyleSheet.flatten(style) || {};
  const textColor =
    rest.color ??
    getContrastingColor(
      backgroundColor,
      Colors.primary100,
      'rgba(0, 0, 0, .54)'
    );

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
