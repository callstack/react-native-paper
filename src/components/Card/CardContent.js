/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = React.ElementConfig<typeof View> & {
  /**
   * Items inside the `Card.Content`.
   */
  children: React.Node,
  /**
   * @internal
   */
  index?: number,
  /**
   * @internal
   */
  total?: number,
  /**
   * @internal
   */
  siblings?: Array<string>,
  style?: any,
};

/**
 * A component to show content inside a Card.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Card, Title, Paragraph } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Card>
 *     <Card.Content>
 *       <Title>Card title</Title>
 *       <Paragraph>Card content</Paragraph>
 *     </Card.Content>
 *   </Card>
 * );
 *
 * export default MyComponent;
 * ```
 */
class CardContent extends React.Component<Props> {
  static displayName = 'Card.Content';

  render() {
    const { index, total, siblings, style, ...rest } = this.props;
    const cover = 'withTheme(CardCover)';

    let contentStyle, prev, next;

    if (typeof index === 'number' && siblings) {
      prev = siblings[index - 1];
      next = siblings[index + 1];
    }

    if ((prev === cover && next === cover) || total === 1) {
      contentStyle = styles.only;
    } else if (index === 0) {
      if (next === cover) {
        contentStyle = styles.only;
      } else {
        contentStyle = styles.first;
      }
    } else if (typeof total === 'number' && index === total - 1) {
      if (prev === cover) {
        contentStyle = styles.only;
      } else {
        contentStyle = styles.last;
      }
    } else if (prev === cover) {
      contentStyle = styles.first;
    } else if (next === cover) {
      contentStyle = styles.last;
    }

    return <View {...rest} style={[styles.container, contentStyle, style]} />;
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  first: {
    paddingTop: 16,
  },
  last: {
    paddingBottom: 16,
  },
  only: {
    paddingVertical: 16,
  },
});

export default CardContent;
