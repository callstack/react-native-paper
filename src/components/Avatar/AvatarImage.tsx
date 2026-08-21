import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type {
  AccessibilityProps,
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
import { splitAccessibilityProps } from '../../utils/splitAccessibilityProps';

export type AvatarImageSourceProps = {
  size: number;
  style: { width: number; height: number; borderRadius: number };
  onError?: ImageProps['onError'];
} & AccessibilityProps;

export type AvatarImageSource =
  | ImageSourcePropType
  | ((props: AvatarImageSourceProps) => React.ReactNode);

export type Props = ViewProps & {
  /**
   * Image to display for the `Avatar`.
   * It accepts a standard React Native Image `source` prop
   * or a function that returns an image component.
   * Function sources receive `{ size, style, onError }` matching the host avatar.
   * Apply `style` so the image fills the circle, and call `onError` to trigger `fallback`.
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
 * Custom image components should apply the host `style` and `onError`:
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
  size = DEFAULT_SIZE,
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
  const theme = useInternalTheme(themeOverrides);
  const { backgroundColor } = StyleSheet.flatten(style) || {};
  const { background } = resolveAvatarColors({ theme, backgroundColor });
  const { accessibilityProps, rest: viewProps } = splitAccessibilityProps(rest);
  const imageStyle = {
    width: size,
    height: size,
    borderRadius: cornerFull,
  };
  const imageA11y =
    Object.keys(accessibilityProps).length > 0
      ? accessibilityProps
      : { accessible: false as const };
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
      {...viewProps}
      {...(showImage
        ? { accessible: false, importantForAccessibility: 'no' as const }
        : accessibilityProps)}
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
