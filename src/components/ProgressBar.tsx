import * as React from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  LayoutChangeEvent,
  I18nManager,
} from 'react-native';
import setColor from 'color';
import { withTheme } from '../core/theming';
import { Theme } from '../types';

type Props = {
  /**
   * Progress value (between 0 and 1).
   */
  progress?: number;
  /**
   * Color of the progress bar. The background color will be calculated based on this but you can change it by passing `backgroundColor` to `style` prop.
   */
  color?: string;
  /**
   * If the progress bar will show indeterminate progress.
   */
  indeterminate?: boolean;
  /**
   * Whether to show the ProgressBar (true, the default) or hide it (false).
   */
  visible?: boolean;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: Theme;
};

type State = {
  width: number;
  fade: Animated.Value;
  timer: Animated.Value;
};

const INDETERMINATE_DURATION = 2000;
const INDETERMINATE_MAX_WIDTH = 0.6;
const { isRTL } = I18nManager;

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
    visible: true,
    progress: 0,
  };

  state = {
    width: 0,
    timer: new Animated.Value(0),
    fade: new Animated.Value(0),
  };

  indeterminateAnimation: Animated.CompositeAnimation | null = null;

  componentDidUpdate(prevProps: Props) {
    const { visible, progress } = this.props;

    if (progress !== prevProps.progress || visible !== prevProps.visible) {
      if (visible) {
        this.startAnimation();
      } else {
        this.stopAnimation();
      }
    }
  }

  private onLayout = (event: LayoutChangeEvent) => {
    const { visible } = this.props;
    const { width: previousWidth } = this.state;

    this.setState({ width: event.nativeEvent.layout.width }, () => {
      // Start animation the very first time when previously the width was unclear
      if (visible && previousWidth === 0) {
        this.startAnimation();
      }
    });
  };

  private startAnimation = () => {
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

      Animated.loop(this.indeterminateAnimation).start();
    } else {
      Animated.timing(timer, {
        duration: 200,
        toValue: progress ? progress : 0,
        useNativeDriver: true,
        isInteraction: false,
      }).start();
    }
  };

  private stopAnimation = () => {
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
  };

  render() {
    const { color, indeterminate, style, theme } = this.props;
    const { fade, timer, width } = this.state;
    const tintColor = color || theme.colors.primary;
    const trackTintColor = setColor(tintColor)
      .alpha(0.38)
      .rgb()
      .string();

    return (
      <View onLayout={this.onLayout}>
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
                              (isRTL ? 1 : -1) * 0.5 * width,
                              (isRTL ? 1 : -1) *
                                0.5 *
                                INDETERMINATE_MAX_WIDTH *
                                width,
                              (isRTL ? -1 : 1) * 0.7 * width,
                            ],
                          }
                        : {
                            inputRange: [0, 1],
                            outputRange: [(isRTL ? 1 : -1) * 0.5 * width, 0],
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
    flex: 1,
  },
});

export default withTheme(ProgressBar);
