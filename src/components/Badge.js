/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import color from 'color';
import Text from './Typography/Text';
import { black, white } from '../styles/colors';
import { withTheme } from '../core/theming';
import type { Theme } from '../types';

type Props = {
  /**
   * Value of the `Badge`.
   */
  value: string,
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
   * Custom background color.
   */
  color?: string,
  /**
   * The content to which the `Badge` is attached.
   */
  children: React.Node,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * Badges are small status descriptors for UI elements.
 * A badge consists of a small circle, typically containing a number or other short set of characters, that appears in proximity to another object.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/badge.png" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Badge, Button } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Badge value="3">
 *     <Button mode="outlined" onPress={() => {}}>
 *       Display notifications
 *     </Button>
 *   </Badge>
 * );
 *
 * export default MyComponent;
 * ```
 */
class Badge extends React.Component<Props> {
  static defaultProps = {
    verticalPosition: 'top',
    horizontalPosition: 'right',
    size: 12,
  };

  render() {
    const {
      color: badgeColor,
      children,
      horizontalPosition,
      size,
      style,
      theme,
      value,
      verticalPosition,
    } = this.props;

    const backgroundColor = badgeColor || theme.colors.badge;
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

        <View
          style={[
            styles.badge,
            {
              backgroundColor,
              borderRadius,
              paddingHorizontal,
              // $FlowFixMe
              [verticalPosition]: offset,
              // $FlowFixMe
              [horizontalPosition]: offset,
            },
            style,
          ]}
        >
          <Text style={{ color: textColor }}>{value}</Text>
        </View>
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
