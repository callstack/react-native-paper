import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import { CardSpacing } from './tokens';

export type Props = ViewProps & {
  /**
   * Items inside the `Card.Content`.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * A component to show content inside a Card.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Card, Text } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Card
 *     content={<Card.Content>
 *       <Text variant="titleLarge">Card title</Text>
 *       <Text variant="bodyMedium">Card content</Text>
 *     </Card.Content>}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 */
const CardContent = ({ style, ...rest }: Props) => (
  <View {...rest} style={[styles.container, style]} />
);

CardContent.displayName = 'Card.Content';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: CardSpacing.horizontalPadding,
    paddingTop: CardSpacing.regionGap,
  },
});

export default CardContent;
