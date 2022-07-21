import * as React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import Icon, { IconSource } from '../Icon';
import { withTheme } from '../../core/theming';
import { white } from '../../styles/colors';
import getContrastingColor from '../../utils/getContrastingColor';

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
  theme: ReactNativePaper.Theme;
};

/**
 * Avatars can be used to represent people in a graphical way.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/avatar-icon.png" />
 *   </figure>
 * </div>
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
const Avatar = ({ icon, size = defaultSize, style, theme, ...rest }: Props) => {
  const { backgroundColor = theme.colors.primary, ...restStyle } =
    StyleSheet.flatten(style) || {};
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

export default withTheme(Avatar);
