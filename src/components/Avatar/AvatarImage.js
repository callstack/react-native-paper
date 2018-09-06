/* @flow */

import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';

type Props = {
  /**
   * Image to display for the `Avatar`.
   */
  source: ImageSource,
  /**
   * Size of the avatar.
   */
  size: number,
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
 *     <img class="medium" src="screenshots/avatar-image.png" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Avatar } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Avatar.Image size={24} source={require('../assets/avatar.png')} />
 * );
 * ```
 */
class AvatarImage extends React.Component<Props> {
  static displayName = 'Avatar.Image';

  static defaultProps = {
    size: 64,
  };

  render() {
    const { size, source, style, theme } = this.props;
    const { colors } = theme;

    const { backgroundColor = colors.primary } =
      StyleSheet.flatten(style) || {};

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
        <Image
          source={source}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      </View>
    );
  }
}

export default withTheme(AvatarImage);
