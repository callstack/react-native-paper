import * as React from 'react';
import {
  StyleSheet,
  StyleProp,
  Image,
  ImageSourcePropType,
  ImageStyle,
} from 'react-native';

import type { ThemeProp } from '../../types';

export type Props = {
  source: ImageSourcePropType;
  variant?: 'image' | 'video';
  style?: StyleProp<ImageStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * A component to show image in a list item.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { List, Palette } from 'react-native-paper';
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
const ListImage = ({
  style,
  source,
  variant = 'image',
  theme: _theme,
}: Props) => {
  const getStyles = () => {
    if (variant === 'video') {
      return [style, styles.video];
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
  video: {
    width: 114,
    height: 64,
    marginLeft: 0,
  },
});

ListImage.displayName = 'List.Image';

export default ListImage;
