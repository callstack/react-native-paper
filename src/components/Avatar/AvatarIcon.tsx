import * as React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import color from 'color';
import Icon from '../Icon';
import { withTheme } from '../../core/theming';
import { white } from '../../styles/colors';
import { Theme } from '../../types';
import { IconSource } from './../Icon';

const defaultSize = 64;

type Props = {
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
  theme: Theme;
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
class Avatar extends React.Component<Props> {
  static displayName = 'Avatar.Icon';

  static defaultProps = {
    size: defaultSize,
  };

  render() {
    const { icon, size = defaultSize, style, theme } = this.props;

    const { backgroundColor = theme.colors.primary, ...restStyle } =
      StyleSheet.flatten(style) || {};
    const textColor =
      this.props.color ||
      (color(backgroundColor).isLight() ? 'rgba(0, 0, 0, .54)' : white);

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
      >
        <Icon source={icon} color={textColor} size={size * 0.6} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withTheme(Avatar);
