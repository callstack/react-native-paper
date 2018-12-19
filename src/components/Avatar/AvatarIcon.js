/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import color from 'color';
import Icon from '../Icon';
import { withTheme } from '../../core/theming';
import { white } from '../../styles/colors';
import type { Theme } from '../../types';
import type { IconSource } from './../Icon';

type Props = {
  /**
   * Icon to display for the `Avatar`.
   */
  icon: IconSource,
  /**
   * Size of the avatar.
   */
  size: number,
  /**
   * Custom color.
   */
  color?: string,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
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
    size: 64,
  };

  render() {
    const { icon, size, style, theme } = this.props;
    const { colors } = theme;

    const { backgroundColor = colors.primary } =
      StyleSheet.flatten(style) || {};
    const textColor =
      this.props.color || color(backgroundColor).light()
        ? white
        : 'rgba(0, 0, 0, .54)';

    return (
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
          },
          style,
        ]}
      >
        <View style={[styles.icon, { height: size }]}>
          <Icon source={icon} color={textColor} size={size * 0.75} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withTheme(Avatar);
