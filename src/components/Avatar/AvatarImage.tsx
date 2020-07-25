import * as React from 'react';

import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import AvatarText from './AvatarText';
import { Theme } from '../../types';
import { withTheme } from '../../core/theming';

const defaultSize = 64;

type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Image to display for the `Avatar`.
   */
  source: ImageSourcePropType;
  /**
   * Alternative text to avatar.
   */
  accessibilityLabel?: string;
  /**
   * Boolean to indicate erros with the image
   */
  onError?: boolean;
  /**
   * Boolean to indicate the image is loading
   */
  onLoad?: boolean;
  /**
   * Size of the avatar.
   */
  size?: number;
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
 *   <Avatar.Image size={24} accessibilityLabel="avatar" source={require('../assets/avatar.png')} />
 * );
 * ```
 */
class AvatarImage extends React.Component<Props> {
  static displayName = 'Avatar.Image';

  static defaultProps = {
    size: defaultSize,
    accessibilityLabel: '',
    onError: false,
    onLoad: false,
  };

  render() {
    const {
      accessibilityLabel = '',
      onError,
      onLoad,
      size = defaultSize,
      source,
      style,
      theme,
      ...rest
    } = this.props;
    const { colors } = theme;

    const { backgroundColor = colors.primary } =
      StyleSheet.flatten(style) || {};

    return onLoad || onError ? (
      <AvatarText size={size} label={accessibilityLabel} />
    ) : (
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
