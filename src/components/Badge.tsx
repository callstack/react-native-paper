import * as React from 'react';
import { Animated, StyleSheet, StyleProp, Text, TextStyle } from 'react-native';
import color from 'color';
import { black, white } from '../styles/colors';
import { withTheme } from '../core/theming';
import { Theme } from '../types';

const defaultSize = 20;

type Props = React.ComponentProps<typeof Text> & {
  /**
   * Whether the badge is visible
   */
  visible: boolean;
  /**
   * Content of the `Badge`.
   */
  children?: string | number;
  /**
   * Size of the `Badge`.
   */
  size?: number;
  style?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme: Theme;
};

type State = {
  opacity: Animated.Value;
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
    size: defaultSize,
  };

  state = {
    opacity: new Animated.Value(this.props.visible ? 1 : 0),
  };

  componentDidUpdate(prevProps: Props) {
    const {
      visible,
      theme: {
        animation: { scale },
      },
    } = this.props;

    if (visible !== prevProps.visible) {
      Animated.timing(this.state.opacity, {
        toValue: visible ? 1 : 0,
        duration: 150 * scale,
        useNativeDriver: true,
      }).start();
    }
  }

  render() {
    const { children, size = defaultSize, style, theme } = this.props;
    const { opacity } = this.state;

    const { backgroundColor = theme.colors.notification, ...restStyle } =
      StyleSheet.flatten(style) || {};
    const textColor = color(backgroundColor).isLight() ? black : white;

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
            ...theme.fonts.regular,
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
