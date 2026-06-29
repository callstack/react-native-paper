import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type {
  ImageProps,
  ImageSourcePropType,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { DEFAULT_SIZE, resolveAvatarColors } from './utils';
import { useInternalTheme } from '../../core/theming';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { ThemeProp } from '../../types';

export type AvatarImageSource =
  | ImageSourcePropType
  | ((props: { size: number }) => React.ReactNode);

export type Props = ViewProps & {
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
  theme?: ThemeProp;
};

/**
 * Avatars can be used to represent people in a graphical way.
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
  size = DEFAULT_SIZE,
  source,
  style,
  onError,
  onLayout,
  onLoad,
  onLoadEnd,
  onLoadStart,
  onProgress,
  theme: themeOverrides,
  testID,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { backgroundColor } = StyleSheet.flatten(style) || {};
  const { background } = resolveAvatarColors({ theme, backgroundColor });

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: cornerFull,
          backgroundColor: background,
        },
        style,
      ]}
      {...rest}
    >
      {typeof source === 'function' && source({ size })}
      {typeof source !== 'function' && (
        <Image
          testID={testID}
          source={source}
          style={{ width: size, height: size, borderRadius: cornerFull }}
          onError={onError}
          onLayout={onLayout}
          onLoad={onLoad}
          onLoadEnd={onLoadEnd}
          onLoadStart={onLoadStart}
          onProgress={onProgress}
          accessibilityIgnoresInvertColors
        />
      )}
    </View>
  );
};

AvatarImage.displayName = 'Avatar.Image';

export default AvatarImage;
