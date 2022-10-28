import * as React from 'react';
import {
  StyleSheet,
  StyleProp,
  Image,
  ImageSourcePropType,
  ImageStyle,
} from 'react-native';

import { withInternalTheme } from '../../core/theming';
import type { InternalTheme } from '../../types';

export type Props = {
  source: ImageSourcePropType;
  variant?: 'image' | 'video';
  style?: StyleProp<ImageStyle>;
  /**
   * @optional
   */
  theme: InternalTheme;
};

/**
 * A component to show image in a list item.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/list-image.png" />
 *   </figure>
 * </div>
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
  return (
    <Image
      style={[style, variant === 'image' ? styles.image : styles.video]}
      source={source}
      accessibilityIgnoresInvertColors
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 56,
    height: 56,
  },
  video: {
    width: 111,
    height: 64,
    marginLeft: 0,
  },
});

ListImage.displayName = 'List.Image';

export default withInternalTheme(ListImage);
