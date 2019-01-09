/* @flow */

import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';
import color from 'color';
import Text from '../Typography/Text';
import BadgeWrapper from './BadgeWrapper';
import { black, white } from '../../styles/colors';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';

type Props = {|
  /**
   * Value of the `Badge`.
   */
  children?: string | number,
  /**
   * Size of the `Badge`.
   */
  size?: number,
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
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Badge } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Badge>3</Badge>
 * );
 *
 * export default MyComponent;
 * ```
 */
class Badge extends React.Component<Props, State> {
  // @component ./BadgeWrapper.js
  static Wrapper = BadgeWrapper;

  static defaultProps = {
    size: 12,
  };

  state = {
    opacity: new Animated.Value(this.props.children ? 1 : 0),
  };

  componentDidUpdate(prevProps: Props) {
    const { children } = this.props;

    if (children !== prevProps.children) {
      Animated.timing(this.state.opacity, {
        toValue: children ? 1 : 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }

  render() {
    const { children, size, style, theme } = this.props;
    const { opacity } = this.state;

    const { backgroundColor = theme.colors.badge, ...restStyle } =
      StyleSheet.flatten(style) || {};
    const textColor = color(backgroundColor).dark() ? white : black;

    // $FlowFixMe
    const borderRadius = size / 2;
    // $FlowFixMe
    const paddingHorizontal = size / 2;

    return (
      <Animated.View
        style={[
          {
            opacity,
            backgroundColor,
            borderRadius,
            paddingHorizontal,
          },
          restStyle,
        ]}
      >
        <Text style={{ color: textColor }}>{children}</Text>
      </Animated.View>
    );
  }
}

export default withTheme(Badge);
