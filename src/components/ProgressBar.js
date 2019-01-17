/* @flow */

import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import setColor from 'color';
import { withTheme } from '../core/theming';
import type { Theme } from '../types';

type Props = {|
  /**
   * Progress value (between 0 and 1).
   */
  progress: number,
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
  timer: Animated.Value,
  fade: Animated.Value,
};

const DURATION = 2400;

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
    };
  
    state = {
      timer: new Animated.Value(0),
      progress: new Animated.Value(
        this.props.progress
      ),
      fade: new Animated.Value(
        this.props.animating ? 0 : 1
      ),
    };

    animation = null;

    componentDidMount() {
      const { animating, progress } = this.props;
      const { timer } = this.state;
  
      // Circular animation in loop
      this.rotation = Animated.timing(timer, {
        duration: DURATION,
        easing: Easing.linear,
        // Animated.loop does not work if useNativeDriver is true on web
        useNativeDriver: Platform.OS !== 'web',
        toValue: progress,
      });
  
      if (animating) {
        this.startRotation();
      }
    }

    componentDidUpdate() {
        Animated.timing(fade, {
            duration: 200,
            toValue: 1,
          }).start();
    }

    startAnimation() {
      const { fade, timer } = this.state;
  
      // Show progress bar
      Animated.timing(fade, {
        duration: 200,
        toValue: 1,
      }).start();
  
      // Circular animation in loop
      if (this.rotation) {
        timer.setValue(0);
        // $FlowFixMe
        Animated.loop(this.rotation).start();
      }
    }
  
    stopAnimation() {
      if (this.animation) {
        this.animation.stop();
      }
    }

  render() {
    const { progress, color, style, theme } = this.props;
    const tintColor = color || theme.colors.primary;
    const trackTintColor = setColor(tintColor)
      .alpha(0.38)
      .rgb()
      .string();

    return (
        <Animated.View style={[styles.progressBar, { backgroundColor: trackTintColor, opacity: fade }, style]}>
        <Animated.View style={[styles.indicator, { backgroundColor: tintColor }, style]}>

      </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  progressBar: {
    height: 4,
  },

  indicator: {
    position: 'absolute',
    height: 4,
  },
});

export default withTheme(ProgressBar);
