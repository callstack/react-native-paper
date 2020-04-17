import * as React from 'react';
import { Image, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { withTheme } from '../../core/theming';
import { Theme } from '../../types';

const defaultSize = 64;

type Props = React.ComponentProps<typeof Image> & {
  /**
   * Size of the avatar.
   */
  size?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * Override default image component. The default Image props are provided.
   * @optional
   */
  ImageComponent?: React.ComponentType<any>;
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
    size: defaultSize,
  };

  render() {
    const {
      size = defaultSize,
      style,
      theme,
      ImageComponent,
      source,
      ...rest
    } = this.props;
    const { colors } = theme;

    const { backgroundColor = colors.primary } =
      StyleSheet.flatten(style) || {};

    const ImageOverridden = ImageComponent || Image;

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
        <ImageOverridden
          {...rest}
          source={source}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      </View>
    );
  }
}

export default withTheme(AvatarImage);
