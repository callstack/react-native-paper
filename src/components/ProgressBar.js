/* @flow */

import * as React from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
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
  width: number,
  timer: Animated.Value,
  progress: Animated.Value,
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
      width: 0,
      timer: new Animated.Value(0),
      fade: new Animated.Value(
        0
      ),
      progress: new Animated.Value(0),
    };

    animation = null;

    componentDidMount() {
      const { timer } = this.state;
  
      // Circular animation in loop
      this.animation = Animated.timing(timer, {
        duration: DURATION,
        easing: Easing.linear,
        // Animated.loop does not work if useNativeDriver is true on web
        useNativeDriver: Platform.OS !== 'web',
        toValue: 1,
      });
    }

    componentDidUpdate() {
      const { animating } = this.props;

      if (animating) {
        this.startAnimation();
      }
    }

    startAnimation() {
      const { fade, timer, progress } = this.state;
  
      Animated.sequence([
        // Show progress bar
        Animated.timing(fade, {
          duration: 1000,
          easing: Easing.ease,
          toValue: 1,
          useNativeDriver: true
        }),

        // Animate progress
        Animated.timing(progress, {
          duration: 200,
          toValue: this.props.progress,
          useNativeDriver: true
        }),
      ]).start()
return
      // Circular animation in loop
      if (this.animation) {
        timer.setValue(0);
        // $FlowFixMe
        Animated.loop(this.animation).start();
      }
    }
  
    stopAnimation() {
      if (this.animation) {
        this.animation.stop();
      }
    }

    _onLayout = (event) => {
      this.setState({ width: event.nativeEvent.layout.width, }, this.startAnimation)
    }

  render() {
    const { color, style, theme } = this.props;
    const { fade, progress, width } = this.state;
    const tintColor = color || theme.colors.primary;
    const trackTintColor = setColor(tintColor)
      .alpha(0.38)
      .rgb()
      .string();

    return (
      <View onLayout={this._onLayout}>
        <Animated.View style={[styles.container, { backgroundColor: tintColor, opacity: fade }, style]}>

      <Animated.View style={[styles.progressBar, {backgroundColor: 'pink', width,
      transform : [{translateX: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [width / -2, 0],
      })}, { scaleX: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0.0001, 1],
      })  }]}]} />
      </Animated.View></View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    overflow: 'hidden'
  },

  progressBar: {

  },
});

export default withTheme(ProgressBar);
