/* @flow */

import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';
import color from 'color';
import { black, white } from '../styles/colors';
import { withTheme } from '../core/theming';
import type { Theme } from '../types';

type Props = {|
  /**
   * Whether the badge is visible
   */
  visible: boolean,
  /**
   * Content of the `Badge`.
   */
  children?: string | number,
  /**
   * Size of the `Badge`.
   */
  size: number,
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
  static defaultProps = {
    visible: true,
    size: 20,
  };

  state = {
    opacity: new Animated.Value(this.props.visible ? 1 : 0),
  };

  componentDidUpdate(prevProps: Props) {
    const { visible } = this.props;

    if (visible !== prevProps.visible) {
      Animated.timing(this.state.opacity, {
        toValue: visible ? 1 : 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }

  render() {
    const { children, size, style, theme } = this.props;
    const { opacity } = this.state;

    const { backgroundColor = theme.colors.notification, ...restStyle } =
      StyleSheet.flatten(style) || {};
    const textColor = color(backgroundColor).light() ? black : white;

    const borderRadius = size / 2;

    return (
      <Animated.Text
        numberOfLines={1}
        style={[
          {
            opacity,
            backgroundColor,
            color: textColor,
            fontSize: size * 0.5,
            fontFamily: theme.fonts.regular,
            lineHeight: size,
            height: size,
            minWidth: size,
            borderRadius,
          },
          styles.container,
          restStyle,
        ]}
      >
        {children}
      </Animated.Text>
    );
  }
}

export default withTheme(Badge);

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
});
