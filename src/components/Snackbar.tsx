import * as React from 'react';
import {
  Animated,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import Button from './Button';
import Surface from './Surface';
import Text from './Typography/Text';
import { withTheme } from '../core/theming';
import { Theme } from '../types';

type Props = {
  /**
   * Whether the Snackbar is currently visible.
   */
  visible: boolean;
  /**
   * Label and press callback for the action button. It should contain the following properties:
   * - `label` - Label of the action button
   * - `onPress` - Callback that is called when action button is pressed.
   */
  action?: {
    label: string;
    accessibilityLabel?: string;
    onPress: () => void;
  };
  /**
   * The duration for which the Snackbar is shown.
   */
  duration?: number;
  /**
   * Callback called when Snackbar is dismissed. The `visible` prop needs to be updated when this is called.
   */
  onDismiss: () => void;
  /**
   * Text content of the Snackbar.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: Theme;
};

type State = {
  opacity: Animated.Value;
  hidden: boolean;
};

const DURATION_SHORT = 4000;
const DURATION_MEDIUM = 7000;
const DURATION_LONG = 10000;

/**
 * Snackbars provide brief feedback about an operation through a message at the bottom of the screen.
 * Snackbar by default use onSurface color from theme
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/snackbar.gif" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View, StyleSheet } from 'react-native';
 * import { Button, Snackbar } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     visible: false,
 *   };
 *
 *   render() {
 *     const { visible } = this.state;
 *     return (
 *       <View style={styles.container}>
 *         <Button
 *           onPress={() => this.setState(state => ({ visible: !state.visible }))}
 *         >
 *           {this.state.visible ? 'Hide' : 'Show'}
 *         </Button>
 *         <Snackbar
 *           visible={this.state.visible}
 *           onDismiss={() => this.setState({ visible: false })}
 *           action={{
 *             label: 'Undo',
 *             onPress: () => {
 *               // Do something
 *             },
 *           }}
 *         >
 *           Hey there! I'm a Snackbar.
 *         </Snackbar>
 *       </View>
 *     );
 *   }
 * }
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     flex: 1,
 *     justifyContent: 'space-between',
 *   },
 * });
 * ```
 */
class Snackbar extends React.Component<Props, State> {
  /**
   * Show the Snackbar for a short duration.
   */
  static DURATION_SHORT = DURATION_SHORT;

  /**
   * Show the Snackbar for a medium duration.
   */
  static DURATION_MEDIUM = DURATION_MEDIUM;

  /**
   * Show the Snackbar for a long duration.
   */
  static DURATION_LONG = DURATION_LONG;

  static defaultProps = {
    duration: DURATION_MEDIUM,
  };

  state = {
    opacity: new Animated.Value(0.0),
    hidden: !this.props.visible,
  };

  componentDidMount() {
    if (this.props.visible) {
      this.show();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.visible !== this.props.visible) {
      this.toggle();
    }
  }

  componentWillUnmount() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  private toggle = () => {
    if (this.props.visible) {
      this.show();
    } else {
      this.hide();
    }
  };

  private show = () => {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.setState({
      hidden: false,
    });
    const { scale } = this.props.theme.animation;
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 200 * scale,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        const { duration } = this.props;
        const isInfinity =
          duration === Number.POSITIVE_INFINITY ||
          duration === Number.NEGATIVE_INFINITY;

        if (finished && !isInfinity) {
          this.hideTimeout = setTimeout(this.props.onDismiss, duration);
        }
      }
    });
  };

  private hide = () => {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    const { scale } = this.props.theme.animation;
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 100 * scale,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        this.setState({ hidden: true });
      }
    });
  };

  private hideTimeout?: number;

  render() {
    const { children, visible, action, onDismiss, theme, style } = this.props;
    const { colors, roundness } = theme;

    if (this.state.hidden) {
      return null;
    }

    return (
      <SafeAreaView pointerEvents="box-none" style={styles.wrapper}>
        <Surface
          pointerEvents="box-none"
          accessibilityLiveRegion="polite"
          style={
            [
              styles.container,
              {
                borderRadius: roundness,
                opacity: this.state.opacity,
                transform: [
                  {
                    scale: visible
                      ? this.state.opacity.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.9, 1],
                        })
                      : 1,
                  },
                ],
              },
              { backgroundColor: colors.onSurface },
              style,
            ] as StyleProp<ViewStyle>
          }
        >
          <Text
            style={[
              styles.content,
              { marginRight: action ? 0 : 16, color: colors.surface },
            ]}
          >
            {children}
          </Text>
          {action ? (
            <Button
              accessibilityLabel={action.accessibilityLabel}
              onPress={() => {
                action.onPress();
                onDismiss();
              }}
              style={styles.button}
              color={colors.accent}
              compact
              mode="text"
            >
              {action.label}
            </Button>
          ) : null}
        </Surface>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  container: {
    elevation: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 8,
    borderRadius: 4,
  },
  content: {
    marginLeft: 16,
    marginVertical: 14,
    flexWrap: 'wrap',
    flex: 1,
  },
  button: {
    marginHorizontal: 8,
    marginVertical: 6,
  },
});

export default withTheme(Snackbar);
