import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

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
 *   <Card>
 *     <Card.Content>
 *       <Text variant="titleLarge">Card title</Text>
 *       <Text variant="bodyMedium">Card content</Text>
 *     </Card.Content>
 *   </Card>
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
    padding: 16,
  },
});

export default CardContent;
