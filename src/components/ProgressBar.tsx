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

type Props = React.ComponentPropsWithRef<typeof View> & {
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
  theme: ReactNativePaper.Theme;
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
const ProgressBar = ({
  color,
  indeterminate,
  style,
  progress = 0,
  visible = true,
  theme,
  ...rest
}: Props) => {
  const { current: timer } = React.useRef<Animated.Value>(
    new Animated.Value(0)
  );
  const { current: fade } = React.useRef<Animated.Value>(new Animated.Value(0));
  const [width, setWidth] = React.useState<number>(0);
  const [prevWidth, setPrevWidth] = React.useState<number>(0);

  const indeterminateAnimation =
    React.useRef<Animated.CompositeAnimation | null>(null);

  const { scale } = theme.animation;

  const startAnimation = React.useCallback(() => {
    // Show progress bar
    Animated.timing(fade, {
      duration: 200 * scale,
      toValue: 1,
      useNativeDriver: true,
      isInteraction: false,
    }).start();

    // Animate progress bar
    if (indeterminate) {
      if (!indeterminateAnimation.current) {
        indeterminateAnimation.current = Animated.timing(timer, {
          duration: INDETERMINATE_DURATION,
          toValue: 1,
          // Animated.loop does not work if useNativeDriver is true on web
          useNativeDriver: Platform.OS !== 'web',
          isInteraction: false,
        });
      }

      // Reset timer to the beginning
      timer.setValue(0);

      Animated.loop(indeterminateAnimation.current).start();
    } else {
      Animated.timing(timer, {
        duration: 200 * scale,
        toValue: progress ? progress : 0,
        useNativeDriver: true,
        isInteraction: false,
      }).start();
    }
  }, [scale, timer, progress, indeterminate, fade]);

  const stopAnimation = React.useCallback(() => {
    // Stop indeterminate animation
    if (indeterminateAnimation.current) {
      indeterminateAnimation.current.stop();
    }

    Animated.timing(fade, {
      duration: 200 * scale,
      toValue: 0,
      useNativeDriver: true,
      isInteraction: false,
    }).start();
  }, [fade, scale]);

  React.useEffect(() => {
    if (visible) startAnimation();
    else stopAnimation();
  }, [visible, startAnimation, stopAnimation]);

  React.useEffect(() => {
    // Start animation the very first time when previously the width was unclear
    if (visible && prevWidth === 0) {
      startAnimation();
    }
  }, [prevWidth, startAnimation, visible]);

  const onLayout = (event: LayoutChangeEvent) => {
    setPrevWidth(width);
    setWidth(event.nativeEvent.layout.width);
  };

  const tintColor = color || theme.colors.primary;
  const trackTintColor = setColor(tintColor).alpha(0.38).rgb().string();

  return (
    <View
      onLayout={onLayout}
      {...rest}
      accessible
      accessibilityRole="progressbar"
      accessibilityState={{ busy: visible }}
      accessibilityValue={
        indeterminate ? {} : { min: 0, max: 100, now: progress * 100 }
      }
    >
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: trackTintColor, opacity: fade },
          style,
        ]}
      >
        {width ? (
          <Animated.View
            style={[
              styles.progressBar,
              {
                width,
                backgroundColor: tintColor,
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
        ) : null}
      </Animated.View>
    </View>
  );
};

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
