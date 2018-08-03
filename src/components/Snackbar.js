/* @flow */

import * as React from 'react';
import { StyleSheet, Animated } from 'react-native';

import Text from './Typography/Text';
import ThemedPortal from './Portal/ThemedPortal';
import withTheme from '../core/withTheme';
import { white } from '../styles/colors';
import type { Theme } from '../types';

type Props = {
  /**
   * Whether the Snackbar is currently visible.
   */
  visible: boolean,
  /**
   * Label and press callback for the action button. It should contain the following properties:
   * - `label` - Label of the action button
   * - `onPress` - Callback that is called when action button is pressed.
   */
  action?: {
    label: string,
    onPress: () => mixed,
  },
  /**
   * The duration for which the Snackbar is shown.
   */
  duration?: number,
  /**
   * Callback called when Snackbar is dismissed. The `visible` prop needs to be updated when this is called.
   */
  onDismiss: () => mixed,
  /**
   * Text content of the Snackbar.
   */
  children: React.Node,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

type State = {
  layout: {
    height: number,
    measured: boolean,
  },
  opacity: Animated.Value,
  translateY: Animated.Value,
};

const SNACKBAR_ANIMATION_DURATION = 250;

const DURATION_SHORT = 2500;
const DURATION_LONG = 3500;
const DURATION_INDEFINITE = Infinity;

/**
 * Snackbar provide brief feedback about an operation through a message at the bottom of the screen.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/snackbar.gif" />
 * </div>
 *
 * ## Usage
 * ```js
 * import React from 'react';
 * import { StyleSheet } from 'react-native';
 * import { Snackbar } from 'react-native-paper';
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
 *           raised
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
   * Show the Snackbar for a long duration.
   */
  static DURATION_LONG = DURATION_LONG;

  /**
   * Show the Snackbar for indefinite amount of time.
   */
  static DURATION_INDEFINITE = DURATION_INDEFINITE;

  static defaultProps = {
    duration: DURATION_LONG,
  };

  state = {
    layout: {
      height: 0,
      measured: false,
    },
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(0),
  };

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      this._toggle();
    }
  }

  componentWillUnmount() {
    clearTimeout(this._hideTimeout);
  }

  _hideTimeout: TimeoutID;

  _handleLayout = e => {
    const { height } = e.nativeEvent.layout;
    const { measured } = this.state.layout;

    this.setState({ layout: { height, measured: true } }, () => {
      if (measured) {
        if (!this.props.visible) {
          // If height changed and Snackbar was hidden, adjust the translate to keep it hidden
          this.state.translateY.setValue(height);
        }
      } else {
        // Set the appropriate initial values if height was previously unknown
        this.state.translateY.setValue(height);
        this.state.opacity.setValue(0);

        // Perform the animation only if we're showing
        if (this.props.visible) {
          this._show();
        }
      }
    });
  };

  _toggle = () => {
    if (this.props.visible) {
      this._show();
    } else {
      this._hide();
    }
  };

  _show = () => {
    clearTimeout(this._hideTimeout);

    Animated.parallel([
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: SNACKBAR_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.translateY, {
        toValue: 0,
        duration: SNACKBAR_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const { duration } = this.props;

      if (duration !== DURATION_INDEFINITE) {
        this._hideTimeout = setTimeout(this.props.onDismiss, duration);
      }
    });
  };

  _hide = () => {
    clearTimeout(this._hideTimeout);

    Animated.parallel([
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: SNACKBAR_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.translateY, {
        toValue: this.state.layout.height,
        duration: SNACKBAR_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  };

  render() {
    const { children, action, onDismiss, theme, style } = this.props;
    const { fonts, colors } = theme;

    return (
      <ThemedPortal>
        <Animated.View
          onLayout={this._handleLayout}
          style={[
            styles.wrapper,
            {
              opacity: this.state.layout.measured ? 1 : 0,
              transform: [
                {
                  translateY: this.state.translateY,
                },
              ],
            },
            style,
          ]}
        >
          <Animated.View
            style={[
              styles.container,
              {
                opacity: this.state.opacity.interpolate({
                  inputRange: [0, 0.8, 1],
                  outputRange: [0, 0.2, 1],
                }),
              },
            ]}
          >
            <Text style={[styles.content, { marginRight: action ? 0 : 24 }]}>
              {children}
            </Text>
            {action ? (
              <Text
                style={[
                  styles.button,
                  { color: colors.accent, fontFamily: fonts.medium },
                ]}
                onPress={() => {
                  action.onPress();
                  onDismiss();
                }}
              >
                {action.label.toUpperCase()}
              </Text>
            ) : null}
          </Animated.View>
        </Animated.View>
      </ThemedPortal>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#323232',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    elevation: 6,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    color: white,
    marginLeft: 24,
    marginVertical: 14,
    flexWrap: 'wrap',
    flex: 1,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
});

export default withTheme(Snackbar);
