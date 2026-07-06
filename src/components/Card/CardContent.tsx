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
 * Content uses uniform vertical padding and does not depend on neighboring
 * card sections.
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
});

export default CardContent;
