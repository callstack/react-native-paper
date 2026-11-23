import { StyleSheet, View } from 'react-native';
import type { ColorValue, StyleProp, ViewProps, ViewStyle } from 'react-native';

import { DEFAULT_SIZE } from './utils';
import { useInternalTheme } from '../../core/theming';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { ThemeProp } from '../../theme/types';
import Icon from '../Icon';
import type { IconSource } from '../Icon';

export type Props = Omit<ViewProps, 'style'> & {
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
  color?: ColorValue;
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
  size = DEFAULT_SIZE,
  style,
  backgroundColor: customBackgroundColor,
  theme: themeOverrides,
  color: customColor,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: cornerFull,
        },
        styles.container,
        style,
        {
          backgroundColor:
            customBackgroundColor ?? theme.colors.primaryContainer,
        },
      ]}
      {...rest}
    >
      <Icon
        source={icon}
        color={customColor ?? theme.colors.onPrimaryContainer}
        size={size * 0.6}
      />
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
