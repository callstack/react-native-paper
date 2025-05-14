import * as React from 'react';
import {
  StyleSheet,
  StyleProp,
  Image,
  ImageSourcePropType,
  ImageStyle,
} from 'react-native';

export type Props = {
  /**
   * Image source.
   */
  source: ImageSourcePropType;
  /**
   * Variant of the image. The default variant is `image`.
   */
  variant?: 'image' | 'video';
  style?: StyleProp<ImageStyle>;
};

/**
 * A component to show image in a list item.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { List, MD3Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <>
 *     <List.Image variant="image" source={{uri: 'https://www.someurl.com/apple'}} />
 *     <List.Image variant="video" source={require('../../some-apple.png')} />
 *   </>
 * );
 *
 * export default MyComponent;
 * ```
 */
const ListImage = ({ style, source, variant = 'image' }: Props) => {
  const getStyles = () => {
    if (variant === 'video') {
      return [style, styles.videoV3];
    }

    return [style, styles.image];
  };

  return (
    <Image
      style={getStyles()}
      source={source}
      accessibilityIgnoresInvertColors
      testID="list-image"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 56,
    height: 56,
  },
  videoV3: {
    width: 114,
    height: 64,
    marginLeft: 0,
  },
});

ListImage.displayName = 'List.Image';

export default ListImage;
