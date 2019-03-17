/* @flow */

import * as React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { withTheme } from '../../core/theming';
import { grey200 } from '../../styles/colors';
import FastImage from 'react-native-fast-image';
import type { Theme } from '../../types';

type Props = React.ElementConfig<typeof Image> & {|
  /**
   * @internal
   */
  index?: number,
  /**
   * @internal
   */
  total?: number,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
|};

/**
 * A component to show a cover image inside a Card.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Card } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Card>
 *     <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
 *   </Card>
 * );
 *
 * export default MyComponent;
 * ```
 *
 * @extends Image props https://facebook.github.io/react-native/docs/image.html#props
 *
 * ## Usage with FastImage library
 * Make sure that you have ```react-native-fast-image``` library installed and linked
 * https://github.com/DylanVann/react-native-fast-image#usage
 *
 * ```js
 * import * as React from 'react';
 * import { Card } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Card>
 *     <Card.Cover fastImage source={{ uri: 'https://picsum.photos/700' }} />
 *   </Card>
 * );
 *
 * export default MyComponent;
 * ```
 */
class CardCover extends React.Component<Props> {
  static displayName = 'Card.Cover';

  render() {
    const { index, total, style, theme, fastImage, ...rest } = this.props;
    const { roundness } = theme;

    let coverStyle;

    if (index === 0) {
      if (total === 1) {
        coverStyle = {
          borderRadius: roundness,
        };
      } else {
        coverStyle = {
          borderTopLeftRadius: roundness,
          borderTopRightRadius: roundness,
        };
      }
    } else if (typeof total === 'number' && index === total - 1) {
      coverStyle = {
        borderBottomLeftRadius: roundness,
      };
    }
    if (fastImage) {
      console.log('FASTIMAGE');
      return (
        <View style={[styles.container, coverStyle, style]}>
          <FastImage {...rest} style={[styles.fastImage, coverStyle]} />
        </View>
      );
    } else {
      console.log('IMAGE');
      return (
        <View style={[styles.container, coverStyle, style]}>
          <Image {...rest} style={[styles.image, coverStyle]} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    height: 195,
    backgroundColor: grey200,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    height: null,
    width: null,
    padding: 16,
    justifyContent: 'flex-end',
    resizeMode: 'cover',
  },
  fastImage: {
    flex: 1,
    height: null,
    width: null,
    padding: 16,
    justifyContent: 'flex-end',
  },
});

export default withTheme(CardCover);
