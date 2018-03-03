/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  /**
   * Content of the `CardActions`.
   */
  children: React.Node,
  /**
   * Should actions be aligned to the right.
   */
  right?: boolean,
  style?: any,
};

/**
 * A component to show a list of actions inside a Card.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Button, Card, CardActions } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Card>
 *     <CardActions>
 *       <Button>Cancel</Button>
 *       <Button>Ok</Button>
 *     </CardActions>
 *   </Card>
 * );
 * ```
 */
class CardActions extends React.Component<Props, void> {
  static defaultProps = {
    right: false,
  };

  render() {
    const styles = StyleSheet.create({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: this.props.right ? 'flex-end' : 'flex-start',
        padding: 4,
      },
    });
    return (
      <View {...this.props} style={[styles.container, this.props.style]}>
        {React.Children.map(
          this.props.children,
          child =>
            typeof child === 'object' && child !== null
              ? /* $FlowFixMe */
                React.cloneElement(child, {
                  /* $FlowFixMe */
                  compact: child.props.compact !== false,
                })
              : child
        )}
      </View>
    );
  }
}

export default CardActions;
