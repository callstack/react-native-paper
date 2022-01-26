import * as React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageProps,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { withTheme } from '../../core/theming';

const defaultSize = 64;

export type AvatarImageSource =
  | ImageSourcePropType
  | ((props: { size: number }) => React.ReactNode);

type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Image to display for the `Avatar`.
   * It accepts a standard React Native Image `source` prop
   * Or a function that returns an `Image`.
   */
  source: AvatarImageSource;
  /**
   * Size of the avatar.
   */
  size?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * Invoked on load error.
   */
  onError?: ImageProps['onError'];
  /**
   * Invoked on mount and on layout changes.
   */
  onLayout?: ImageProps['onLayout'];
  /**
   * Invoked when load completes successfully.
   */
  onLoad?: ImageProps['onLoad'];
  /**
   * Invoked when load either succeeds or fails.
   */
  onLoadEnd?: ImageProps['onLoadEnd'];
  /**
   * Invoked on load start.
   */
  onLoadStart?: ImageProps['onLoadStart'];
  /**
   * Invoked on download progress.
   */
  onProgress?: ImageProps['onProgress'];
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
 * export default MyComponent
 * ```
 */
const AvatarImage = ({
  size = defaultSize,
  source,
  style,
  onError,
  onLayout,
  onLoad,
  onLoadEnd,
  onLoadStart,
  onProgress,
  theme,
  ...rest
}: Props) => {
  const { colors } = theme;

  const { backgroundColor = colors.primary } = StyleSheet.flatten(style) || {};

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
      {typeof source === 'function' && source({ size })}
      {typeof source !== 'function' && (
        <Image
          source={source}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          onError={onError}
          onLayout={onLayout}
          onLoad={onLoad}
          onLoadEnd={onLoadEnd}
          onLoadStart={onLoadStart}
          onProgress={onProgress}
        />
      )}
    </View>
  );
};

AvatarImage.displayName = 'Avatar.Image';

export default withTheme(AvatarImage);
