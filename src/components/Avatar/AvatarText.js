/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import color from 'color';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';
import { white } from '../../styles/colors';
import type { Theme } from '../../types';

type Props = {
  /**
   * Text of the `Avatar`.
   */
  label?: string,
  /**
   * Size of the avatar.
   */
  size: number,
  /**
   * Custom color.
   */
  color?: string,
  /**
   * Custom background color.
   */
  backgroundColor?: string,
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
 *     <img class="medium" src="screenshots/avatar-text.png" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Avatar } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Avatar.Text size={24} label="JD" />
 * );
 * ```
 */
class AvatarText extends React.Component<Props> {
  static displayName = 'Avatar.Text';

  static defaultProps = {
    label: '',
    size: 64,
  };

  render() {
    const { label, size, style, theme } = this.props;
    const { colors } = theme;

    const backgroundColor = this.props.backgroundColor || colors.primary;
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
        <Text
          style={[
            styles.text,
            {
              color: textColor,
              fontSize: size * 0.5,
              height: size,
              lineHeight: size,
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});

export default withTheme(AvatarText);
