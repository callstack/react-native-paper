import * as React from 'react';
import {
  Image,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  ImageSourcePropType,
} from 'react-native';
import { withTheme } from '../../core/theming';

const defaultSize = 64;

type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Image to display for the `Avatar`.
   */
  source: ImageSourcePropType;
  /**
   * Size of the avatar.
   */
  size?: number;
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
    const { size = defaultSize, source, style, theme, ...rest } = this.props;
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
        {...rest}
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
