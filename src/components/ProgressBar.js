/* @flow */

import * as React from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import setColor from 'color';
import { withTheme } from '../core/theming';
import type { Theme } from '../types';

type Props = {|
  /**
   * Progress value (between 0 and 1).
   */
  progress?: number,
  /**
   * Color of the progress bar.
   */
  color?: string,
  /**
   * If the progress bar will show indeterminate progress.
   */
  indeterminate?: boolean,
  /**
   * Whether to show the ProgressBar (true, the default) or hide it (false).
   */
  animating?: boolean,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
|};

type State = {
  width: number,
  fade: Animated.Value,
  timer: Animated.Value,
};

const INDETERMINATE_DURATION = 2000;
const INDETERMINATE_MAX_WIDTH = 0.6;

/**
 * Progress bar is an indicator used to present progress of some activity in the app.
 *
 * <div class="screenshots">
 *   <img src="screenshots/progress-bar.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { ProgressBar, Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <ProgressBar progress={0.5} color={Colors.red800} />
 * );
 *
 * export default MyComponent;
 * ```
 */
class ProgressBar extends React.Component<Props, State> {
  static defaultProps = {
    animating: true,
    progress: 0,
  };

  state = {
    width: 0,
    timer: new Animated.Value(0),
    fade: new Animated.Value(0),
  };

  indeterminateAnimation = null;

  componentDidUpdate() {
    const { animating } = this.props;

    if (animating) {
      this._startAnimation();
    } else {
      this._stopAnimation();
    }
  }

  _onLayout = event => {
    const { animating } = this.props;

    this.setState({ width: event.nativeEvent.layout.width }, () => {
      if (animating) {
        this._startAnimation();
      }
    });
  };

  _startAnimation() {
    const { indeterminate, progress } = this.props;
    const { fade, timer } = this.state;

    // Show progress bar
    Animated.timing(fade, {
      duration: 200,
      toValue: 1,
      useNativeDriver: true,
      isInteraction: false,
    }).start();

    // Animate progress bar
    if (indeterminate) {
      if (!this.indeterminateAnimation) {
        this.indeterminateAnimation = Animated.timing(timer, {
          duration: INDETERMINATE_DURATION,
          toValue: 1,
          // Animated.loop does not work if useNativeDriver is true on web
          useNativeDriver: Platform.OS !== 'web',
          isInteraction: false,
        });
      }

      // Reset timer to the beginning
      timer.setValue(0);

      // $FlowFixMe
      Animated.loop(this.indeterminateAnimation).start();
    } else {
      Animated.timing(timer, {
        duration: 200,
        // $FlowFixMe
        toValue: progress,
        useNativeDriver: true,
        isInteraction: false,
      }).start();
    }
  }

  _stopAnimation() {
    const { fade } = this.state;

    // Stop indeterminate animation
    if (this.indeterminateAnimation) {
      this.indeterminateAnimation.stop();
    }

    Animated.timing(fade, {
      duration: 200,
      toValue: 0,
      useNativeDriver: true,
      isInteraction: false,
    }).start();
  }

  render() {
    const { color, indeterminate, style, theme } = this.props;
    const { fade, timer, width } = this.state;
    const tintColor = color || theme.colors.primary;
    const trackTintColor = setColor(tintColor)
      .alpha(0.38)
      .rgb()
      .string();

    return (
      <View onLayout={this._onLayout}>
        <Animated.View
          style={[
            styles.container,
            { backgroundColor: trackTintColor, opacity: fade },
            style,
          ]}
        >
          <Animated.View
            style={[
              styles.progressBar,
              {
                backgroundColor: tintColor,
                width,
                transform: [
                  {
                    translateX: timer.interpolate(
                      indeterminate
                        ? {
                            inputRange: [0, 0.5, 1],
                            outputRange: [
                              -0.5 * width,
                              -0.5 * INDETERMINATE_MAX_WIDTH * width,
                              0.7 * width,
                            ],
                          }
                        : {
                            inputRange: [0, 1],
                            outputRange: [-0.5 * width, 0],
                          }
                    ),
                  },
                  {
                    // Workaround for workaround for https://github.com/facebook/react-native/issues/6278
                    scaleX: timer.interpolate(
                      indeterminate
                        ? {
                            inputRange: [0, 0.5, 1],
                            outputRange: [
                              0.0001,
                              INDETERMINATE_MAX_WIDTH,
                              0.0001,
                            ],
                          }
                        : {
                            inputRange: [0, 1],
                            outputRange: [0.0001, 1],
                          }
                    ),
                  },
                ],
              },
            ]}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 4,
    overflow: 'hidden',
  },

  progressBar: {
    height: 4,
  },
});

export default withTheme(ProgressBar);
