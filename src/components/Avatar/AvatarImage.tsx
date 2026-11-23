import * as React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  ImageProps,
  ImageSourcePropType,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import {
  DEFAULT_SIZE,
  getAvatarImageSourceKey,
  getLabelledAvatarProps,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { ThemeProp } from '../../theme/types';

export type AvatarImageSourceProps = {
  size: number;
  style: { width: number; height: number; borderRadius: number };
  onError?: ImageProps['onError'];
  /**
   * Present when the host received a description through `alt`, `aria-label`
   * or `accessibilityLabel`, except on Android, where `aria-label` alone is
   * announced. Pass it to your image so it is announced by assistive
   * technology.
   */
  alt?: string;
  /**
   * Mirrors `alt`. `react-native-web` fills the rendered `<img alt>` from
   * `aria-label` only, so pass both to your image.
   */
  'aria-label'?: string;
  /**
   * `false` when the host received no description, marking the image as
   * decorative.
   */
  accessible?: boolean;
};

export type AvatarImageSource =
  | ImageSourcePropType
  | ((props: AvatarImageSourceProps) => React.ReactNode);

export type Props = Omit<ViewProps, 'style'> & {
  /**
   * Image to display for the `Avatar`.
   * It accepts a standard React Native Image `source` prop
   * or a function that returns an image component.
   * Function sources receive `{ size, style, onError, alt, 'aria-label',
   * accessible }` matching the host avatar. Apply `style` so the image fills
   * the circle, forward the accessibility props for assistive technology, and
   * call `onError` to trigger `fallback`.
   */
  source: AvatarImageSource;
  /**
   * Identity of the image that a function `source` renders, for example the
   * user id. When it changes, a failed function source loads again instead of
   * keeping `fallback`. Without it, `fallback` stays after a function source
   * fails. Other sources do not use it, because their `uri` or module id
   * identifies them.
   */
  sourceKey?: string | number;
  /**
   * Size of the avatar.
   */
  size?: number;
  /**
   * Background color of the avatar.
   */
  backgroundColor?: ColorValue;
  /**
   * Style for the image container.
   *
   * Background color should be specified via the `backgroundColor` prop instead.
   */
  style?: StyleProp<Omit<ViewStyle, 'backgroundColor'>>;
  /**
   * Text describing the image for assistive technology. `aria-label` and
   * `accessibilityLabel` are treated the same way.
   * Leave it out when the name is already shown next to the avatar, such as
   * a `List.Item` title, or screen readers read the name twice.
   */
  alt?: string;
  /**
   * Content shown when the image fails to load.
   * Receives host `size` so custom content can match the avatar.
   */
  fallback?: (props: { size: number }) => React.ReactNode;
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
 * Pass `alt` to describe the image to assistive technology — `aria-label` and
 * `accessibilityLabel` work the same way. Avatars without a description are
 * treated as decorative and skipped by screen readers, so leave `alt` out when
 * the name is already shown next to the avatar.
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
 * Custom image components should apply the host `style`, `onError` and the
 * accessibility props:
 * ```js
 * <Avatar.Image
 *   size={64}
 *   alt="Jane Doe"
 *   source={({ size, style, onError, ...a11y }) => (
 *     <CustomImage source={{ uri }} style={style} onError={onError} {...a11y} />
 *   )}
 *   fallback={({ size }) => <Avatar.Text size={size} label="JD" />}
 * />
 * ```
 */
const AvatarImage = ({
  size = DEFAULT_SIZE,
  source,
  sourceKey: sourceKeyProp,
  fallback,
  alt,
  'aria-label': ariaLabel,
  accessibilityLabel,
  style,
  onError,
  onLayout,
  onLoad,
  onLoadEnd,
  onLoadStart,
  onProgress,
  backgroundColor: customBackgroundColor,
  theme: themeOverrides,
  testID,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const imageStyle = {
    width: size,
    height: size,
    borderRadius: cornerFull,
  };
  const description = alt ?? ariaLabel ?? accessibilityLabel;
  // `Image` makes `alt` an accessibility element, which on Android is a second
  // TalkBack stop inside a pressable parent. Android reads `aria-label` alone.
  const imageA11y =
    description === undefined
      ? { accessible: false as const }
      : Platform.OS === 'android'
        ? { 'aria-label': description }
        : { alt: description, 'aria-label': description };
  const sourceKey = getAvatarImageSourceKey(source, sourceKeyProp);
  const [failedSource, setFailedSource] = React.useState<{ key: unknown }>();
  const hasError =
    failedSource !== undefined && Object.is(failedSource.key, sourceKey);

  const handleError: ImageProps['onError'] = (event) => {
    setFailedSource({ key: sourceKey });
    onError?.(event);
  };

  const showImage = !(hasError && fallback !== undefined);

  const hostA11y = showImage
    ? { accessible: false, importantForAccessibility: 'no' as const }
    : description !== undefined
      ? {
          'aria-label': description,
          ...getLabelledAvatarProps(rest.accessibilityRole),
        }
      : {};

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: cornerFull,
        },
        styles.container,
        style,
        {
          backgroundColor:
            customBackgroundColor ?? theme.colors.primaryContainer,
        },
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
      {!showImage ? (
        <View aria-hidden={description !== undefined}>
          {fallback({ size })}
        </View>
      ) : null}
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
