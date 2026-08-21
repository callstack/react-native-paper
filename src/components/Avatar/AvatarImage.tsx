import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type {
  ImageProps,
  ImageSourcePropType,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import {
  DEFAULT_SIZE,
  getAvatarImageSourceKey,
  resolveAvatarColors,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { ThemeProp } from '../../types';

export type AvatarImageSourceProps = {
  size: number;
  style: { width: number; height: number; borderRadius: number };
  onError?: ImageProps['onError'];
  /**
   * Present when the host received an `alt`. Pass it to your image so it is
   * announced by assistive technology.
   */
  alt?: string;
  /**
   * `false` when the host received no `alt`, marking the image as decorative.
   */
  accessible?: boolean;
};

export type AvatarImageSource =
  | ImageSourcePropType
  | ((props: AvatarImageSourceProps) => React.ReactNode);

export type Props = ViewProps & {
  /**
   * Image to display for the `Avatar`.
   * It accepts a standard React Native Image `source` prop
   * or a function that returns an image component.
   * Function sources receive `{ size, style, onError, alt }` matching the host avatar.
   * Apply `style` so the image fills the circle, pass `alt` on for assistive
   * technology, and call `onError` to trigger `fallback`.
   */
  source: AvatarImageSource;
  /**
   * Size of the avatar.
   */
  size?: number;
  /**
   * Text describing the image for assistive technology.
   */
  alt?: string;
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
 *   <Avatar.Image size={24} source={require('../assets/avatar.png')} alt="Jane Doe" />
 * );
 * export default MyComponent
 * ```
 *
 * Pass `alt` to describe the image to assistive technology. Avatars without it
 * are treated as decorative and skipped by screen readers.
 *
 * Show another avatar when the image fails to load:
 * ```js
 * <Avatar.Image
 *   size={64}
 *   source={{ uri: user.avatarUrl }}
 *   alt="Jane Doe"
 *   fallback={({ size }) => <Avatar.Text size={size} label="JD" />}
 * />
 * ```
 *
 * Custom image components should apply the host `style`, `onError` and `alt`:
 * ```js
 * <Avatar.Image
 *   size={64}
 *   alt="Jane Doe"
 *   source={({ style, onError, alt }) => (
 *     <CustomImage source={{ uri }} style={style} onError={onError} alt={alt} />
 *   )}
 *   fallback={({ size }) => <Avatar.Text size={size} label="JD" />}
 * />
 * ```
 */
const AvatarImage = ({
  size = DEFAULT_SIZE,
  source,
  fallback,
  alt,
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
  const imageStyle = {
    width: size,
    height: size,
    borderRadius: cornerFull,
  };
  const imageA11y =
    alt === undefined ? { accessible: false as const } : { alt };
  const sourceKey = getAvatarImageSourceKey(source);
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

  const hostA11y = showImage
    ? { accessible: false, importantForAccessibility: 'no' as const }
    : alt !== undefined
      ? { accessible: true, 'aria-label': alt }
      : {};

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: cornerFull,
          backgroundColor: background,
        },
        styles.container,
        style,
      ]}
      {...hostA11y}
      {...rest}
    >
      {showImage && typeof source === 'function'
        ? source({
            size,
            style: imageStyle,
            onError: handleError,
            ...imageA11y,
          })
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
          {...imageA11y}
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
