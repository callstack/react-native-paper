import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { ImageProps, StyleProp, ViewStyle } from 'react-native';

import { CardContext } from './CardContext';
import { getCardCoverStyle } from './utils';
import { useInternalTheme } from '../../core/theming';
import { grey200 } from '../../theme/colors';
import type { ThemeProp } from '../../theme/types';

export type Props = Omit<ImageProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
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
 * @extends Image props https://reactnative.dev/docs/image#props
 */
const CardCover = ({ style, theme: themeOverrides, ...rest }: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const cardContext = React.useContext(CardContext);

  const coverStyle = getCardCoverStyle({
    theme,
  });

  const cardMarginStyle = cardContext
    ? cardContext.direction === 'horizontal'
      ? {
          marginTop: -cardContext.padding,
          marginLeft: -cardContext.padding,
          marginBottom: -cardContext.padding,
        }
      : {
          marginTop: -cardContext.padding,
          marginLeft: -cardContext.padding,
          marginRight: -cardContext.padding,
        }
    : null;

  // The container clips the image with `overflow: 'hidden'`,
  // so any border radius passed in `style` is applied to the image as well
  return (
    <View style={[styles.container, cardMarginStyle, coverStyle, style]}>
      <Image
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        {...rest}
        style={styles.image}
      />
    </View>
  );
};

CardCover.displayName = 'Card.Cover';

const styles = StyleSheet.create({
  container: {
    height: 194,
    backgroundColor: grey200,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    height: 'auto',
    width: 'auto',
    justifyContent: 'flex-end',
  },
});

export default CardCover;

// @component-docs ignore-next-line
export { CardCover };
