import * as React from 'react';
import { StyleSheet, View, ViewStyle, Image, StyleProp } from 'react-native';
import { withTheme } from '../../core/theming';
import { grey200 } from '../../styles/colors';
import { Theme } from '../../types';

type Props = React.ComponentProps<typeof Image> & {
  /**
   * @internal
   */
  index?: number;
  /**
   * @internal
   */
  total?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * Override default image component. The default Image props are provided.
   * @optional
   */
  ImageComponent?: React.ComponentType<any>;
  /**
   * @optional
   */
  theme: Theme;
};

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
 */
class CardCover extends React.Component<Props> {
  static displayName = 'Card.Cover';

  render() {
    const { index, total, style, theme, ImageComponent, ...rest } = this.props;
    const { roundness } = theme;

    const ImageOverridden = ImageComponent || Image;

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

    return (
      <View style={[styles.container, coverStyle, style]}>
        <ImageOverridden {...rest} style={[styles.image, coverStyle]} />
      </View>
    );
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
    height: undefined,
    width: undefined,
    padding: 16,
    justifyContent: 'flex-end',
    resizeMode: 'cover',
  },
});

export default withTheme(CardCover);

// @component-docs ignore-next-line
export { CardCover };
