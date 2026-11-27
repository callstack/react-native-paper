import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import type { StyleProp, ImageSourcePropType, ImageStyle } from 'react-native';

import { ListItemContext } from './ListItemContext';
import { ListTokens } from './tokens';
import { ListRowContext } from './utils';
import type { ThemeProp } from '../../theme/types';

export type Props = {
  source: ImageSourcePropType;
  variant?: 'image' | 'video';
  style?: StyleProp<ImageStyle>;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
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
  testID,
  theme: _theme,
}: Props) => {
  const { verticalPadding } = React.useContext(ListRowContext);
  // The `leading` slot adds the leading space around the image, but a video
  // thumbnail sits flush with the row's start edge
  const inLeadingSlot = React.useContext(ListItemContext)?.slot === 'leading';

  const getStyles = () => {
    if (variant === 'video') {
      return [
        style,
        styles.video,
        {
          marginVertical: ListTokens.threeLineVerticalPadding - verticalPadding,
        },
        inLeadingSlot && styles.videoInLeadingSlot,
      ];
    }

    return [style, styles.image];
  };

  return (
    <Image
      style={getStyles()}
      source={source}
      testID={testID}
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
    width: 114,
    height: 64,
    marginLeft: 0,
  },
  videoInLeadingSlot: {
    marginLeft: -ListTokens.leadingSpace,
  },
});

ListImage.displayName = 'List.Image';

export default ListImage;
