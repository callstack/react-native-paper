/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Badge from './Badge';

type Props = {|
  /**
   * Value of the `Badge`.
   */
  value?: string | number,
  /**
   * Size of the `Badge`.
   */
  size?: number,
  /**
   * Vertical position of `Badge`.
   */
  verticalPosition?: 'top' | 'bottom',
  /**
   * Horizontal position of `Badge`.
   */
  horizontalPosition?: 'left' | 'right',
  /**
   * The content to which the `Badge` is attached.
   */
  children: React.Node,
  style?: any,
|};

/**
 * BadgeWrapper can be used to wrap an existing UI elements and position the Badge automatically.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/badge-wrapper.png" />
 *     <figcaption>Button with badge wrapper</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Badge, Button } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Badge.Wrapper value={3}>
 *     <Button mode="outlined" onPress={() => {}}>
 *       Display notifications
 *     </Button>
 *   </Badge.Wrapper>
 * );
 *
 * export default MyComponent;
 * ```
 */
class BadgeWrapper extends React.Component<Props> {
  static displayName = 'Badge.Wrapper';

  static defaultProps = {
    verticalPosition: 'top',
    horizontalPosition: 'right',
    size: 12,
  };

  render() {
    const {
      children,
      horizontalPosition,
      size,
      style,
      value,
      verticalPosition,
    } = this.props;

    // $FlowFixMe
    const offset = size / -2;

    return (
      <View>
        <View>{children}</View>

        <Badge
          size={size}
          style={[
            styles.badge,
            {
              // $FlowFixMe
              [verticalPosition]: offset,
              // $FlowFixMe
              [horizontalPosition]: offset,
            },
            style,
          ]}
        >
          {value}
        </Badge>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
  },
});

export default BadgeWrapper;
