import { Image, StyleSheet } from 'react-native';
import type { ImageProps, ImageStyle, StyleProp } from 'react-native';

import { grey200 } from '../../theme/colors';
import type { ThemeProp } from '../../theme/types';

export type Props = Omit<ImageProps, 'style'> & {
  /**
   * Style for the cover image. The default size is full width by 195. Consumer
   * styles are applied after these defaults. Supplying an `aspectRatio`
   * removes the default height so the cover can resize responsively.
   */
  style?: StyleProp<ImageStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * A component to show a cover image inside a Card.
 *
 * Card owns clipping when the cover is used in its `media` slot, so the image
 * follows the Card's default or custom shape without adding another radius.
 * Hide decorative covers from screen readers with `accessible={false}` and
 * `aria-hidden`. For informative covers, provide `accessible`,
 * `accessibilityRole="image"`, and a useful `accessibilityLabel`.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Card } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Card
 *     media={
 *       <Card.Cover
 *         source={{ uri: 'https://picsum.photos/700' }}
 *         style={{ aspectRatio: 16 / 9 }}
 *         accessible
 *         accessibilityRole="image"
 *         accessibilityLabel="Mountain landscape"
 *       />
 *     }
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 *
 * @extends Image props https://reactnative.dev/docs/image#props
 */
const CardCover = ({ style, theme: _theme, ...rest }: Props) => {
  const usesAspectRatio = StyleSheet.flatten(style)?.aspectRatio !== undefined;

  return (
    <Image
      {...rest}
      style={[styles.image, !usesAspectRatio && styles.defaultHeight, style]}
      accessibilityIgnoresInvertColors
    />
  );
};

CardCover.displayName = 'Card.Cover';
const styles = StyleSheet.create({
  image: {
    width: '100%',
    backgroundColor: grey200,
    justifyContent: 'flex-end',
  },
  defaultHeight: {
    height: 195,
  },
});

export default CardCover;

// @component-docs ignore-next-line
export { CardCover };
