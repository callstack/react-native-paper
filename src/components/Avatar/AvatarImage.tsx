import * as React from 'react';
import {
  Image,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  ImageSourcePropType,
  ImageProps,
} from 'react-native';
import { withTheme } from '../../core/theming';
import { Theme } from '../../types';

const defaultSize = 64;

type RenderProps = ImageProps

type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Image to display for the `Avatar`.
   */
  source: ImageSourcePropType;
  /**
   * Size of the avatar.
   */
  size?: number;
  /**
   *
   * Callback to render a custom image component such as `react-native-expo-image-cache`
   * instead of the default `Image` component from `react-native`.
   *
   * Example:
   * ```js
   * <Avatar.Image
   *   source={{ uri: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' }}
   *   render={props =>
   *     <CachedImage
   *       {...props}
   *       uri={props.source.uri}
   *     />
   *   }
   * />
   * ```
   */
  render?: (props: RenderProps) => React.ReactNode;
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
    render: (props: RenderProps) => <Image {...props} />,
  };

  render() {
    const { size = defaultSize, render, source, style, theme, ...rest } = this.props;
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
        {render?.({
          source,
          style: { width: size, height: size, borderRadius: size / 2 },
        )}
      </View>
    );
  }
}

export default withTheme(AvatarImage);
