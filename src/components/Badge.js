/* @flow */

import * as React from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import color from 'color';
import Text from './Typography/Text';
import { black, white } from '../styles/colors';
import { withTheme } from '../core/theming';
import type { Theme } from '../types';

type Props = {|
  /**
   * Value of the `Badge`.
   */
  value?: string | number,
  /**
   * Vertical position of `Badge`.
   */
  verticalPosition?: 'top' | 'bottom',
  /**
   * Horizontal position of `Badge`.
   */
  horizontalPosition?: 'left' | 'right',
  /**
   * Size of the `Badge`.
   */
  size?: number,
  /**
   * The content to which the `Badge` is attached.
   */
  children: React.Node,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
|};

type State = {
  opacity: Animated.Value,
};

/**
 * Badges are small status descriptors for UI elements.
 * A badge consists of a small circle, typically containing a number or other short set of characters, that appears in proximity to another object.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/badge.png" />
 *     <figcaption>Button with badge</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Badge, Button } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Badge value={3}>
 *     <Button mode="outlined" onPress={() => {}}>
 *       Display notifications
 *     </Button>
 *   </Badge>
 * );
 *
 * export default MyComponent;
 * ```
 */
class Badge extends React.Component<Props, State> {
  static defaultProps = {
    verticalPosition: 'top',
    horizontalPosition: 'right',
    size: 12,
  };

  state = {
    opacity: new Animated.Value(this.props.value ? 1 : 0),
  };

  componentDidUpdate(prevProps: Props) {
    const { value } = this.props;

    if (value !== prevProps.value) {
      Animated.timing(this.state.opacity, {
        toValue: value ? 1 : 0,
        duration: 150,
      }).start();
    }
  }

  render() {
    const {
      children,
      horizontalPosition,
      size,
      style,
      theme,
      value,
      verticalPosition,
    } = this.props;
    const { opacity } = this.state;

    const { backgroundColor = theme.colors.badge, ...restStyle } =
      StyleSheet.flatten(style) || {};
    const textColor = color(backgroundColor).dark() ? white : black;

    // $FlowFixMe
    const borderRadius = size / 2;
    // $FlowFixMe
    const paddingHorizontal = size / 2;
    // $FlowFixMe
    const offset = size / -2;

    return (
      <View>
        <View>{children}</View>

        <Animated.View
          style={[
            styles.badge,
            {
              opacity,
              backgroundColor,
              borderRadius,
              paddingHorizontal,
              // $FlowFixMe
              [verticalPosition]: offset,
              // $FlowFixMe
              [horizontalPosition]: offset,
            },
            restStyle,
          ]}
        >
          <Text style={{ color: textColor }}>{value}</Text>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
  },
});

export default withTheme(Badge);
