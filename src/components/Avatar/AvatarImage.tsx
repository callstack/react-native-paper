import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type {
  ImageProps,
  ImageSourcePropType,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import { splitAccessibilityProps } from '../../utils/splitAccessibilityProps';

const defaultSize = 64;

export type AvatarImageSource =
  | ImageSourcePropType
  | ((props: {
      size: number;
      style: { width: number; height: number; borderRadius: number };
      onError?: ImageProps['onError'];
    }) => React.ReactNode);

export type Props = ViewProps & {
  /**
   * Image to display for the `Avatar`.
   * It accepts a standard React Native Image `source` prop
   * or a function that returns an image component.
   * Function sources receive `{ size, style, onError }` matching the host avatar.
   * Apply `style` so the image fills the circle, and `onError` to trigger `fallback`.
   * Spread `size` from hosts such as `Card.Title` `left`.
   */
  source: AvatarImageSource;
  /**
   * Size of the avatar.
   */
  size?: number;
  /**
   * Content shown when the image fails to load.
   * Receives host `size` so custom content can match the avatar.
   */
  fallback?: (props: { size: number }) => React.ReactNode;
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
 *
 * Show another avatar when the image fails to load:
 * ```js
 * <Avatar.Image
 *   size={64}
 *   source={{ uri: user.avatarUrl }}
 *   fallback={({ size }) => <Avatar.Text size={size} label="JD" />}
 * />
 * ```
 *
 * Custom image components should apply the host `style`:
 * ```js
 * <Avatar.Image
 *   size={64}
 *   source={({ style, onError }) => (
 *     <CustomImage source={{ uri }} style={style} onError={onError} />
 *   )}
 *   fallback={({ size }) => <Avatar.Text size={size} label="JD" />}
 * />
 * ```
 */
const AvatarImage = ({
  size = defaultSize,
  source,
  fallback,
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
  const { colors } = useInternalTheme(themeOverrides);
  const { backgroundColor = colors?.primary } = StyleSheet.flatten(style) || {};
  const { accessibilityProps, rest: viewProps } = splitAccessibilityProps(rest);
  const imageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };
  const sourceKey =
    source &&
    typeof source === 'object' &&
    !Array.isArray(source) &&
    'uri' in source
      ? source.uri
      : source;
  const previousSourceKey = React.useRef(sourceKey);
  const [hasError, setHasError] = React.useState(false);

  if (!Object.is(previousSourceKey.current, sourceKey)) {
    previousSourceKey.current = sourceKey;
    if (hasError) {
      setHasError(false);
    }
  }

  const handleError: ImageProps['onError'] = (event) => {
    setHasError(true);
    onError?.(event);
  };

  const showImage = !(hasError && fallback !== undefined);

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
        style,
      ]}
      {...viewProps}
      {...(showImage
        ? { importantForAccessibility: 'no' as const }
        : accessibilityProps)}
    >
      {showImage && typeof source === 'function'
        ? source({ size, style: imageStyle, onError: handleError })
        : null}
      {showImage && typeof source !== 'function' ? (
        <Image
          testID={testID}
          source={source}
          style={imageStyle}
          onError={handleError}
          onLayout={onLayout}
          onLoad={onLoad}
          onLoadEnd={onLoadEnd}
          onLoadStart={onLoadStart}
          onProgress={onProgress}
          accessibilityIgnoresInvertColors
          {...accessibilityProps}
        />
      ) : null}
      {!showImage ? fallback({ size }) : null}
    </View>
  );
};

AvatarImage.displayName = 'Avatar.Image';

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default AvatarImage;
