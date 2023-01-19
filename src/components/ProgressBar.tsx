import * as React from 'react';
import {
  Animated,
  I18nManager,
  LayoutChangeEvent,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import setColor from 'color';

import { useInternalTheme } from '../core/theming';
import type { ThemeProp } from '../types';

export type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Animated value (between 0 and 1). This tells the progress bar to rely on this value to animate it.
   * Note: It should not be used in parallel with the `progress` prop.
   */
  animatedValue?: number;
  /**
   * Progress value (between 0 and 1).
   * Note: It should not be used in parallel with the `animatedValue` prop.
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
  theme?: ThemeProp;
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
 * import { ProgressBar, MD3Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <ProgressBar progress={0.5} color={MD3Colors.error50} />
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
  theme: themeOverrides,
  animatedValue,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { current: timer } = React.useRef<Animated.Value>(
    new Animated.Value(0)
  );
  const { current: fade } = React.useRef<Animated.Value>(new Animated.Value(0));
  const passedAnimatedValue =
    React.useRef<Props['animatedValue']>(animatedValue);
  const [width, setWidth] = React.useState<number>(0);
  const [prevWidth, setPrevWidth] = React.useState<number>(0);

  const indeterminateAnimation =
    React.useRef<Animated.CompositeAnimation | null>(null);

  const { scale } = theme.animation;

  React.useEffect(() => {
    passedAnimatedValue.current = animatedValue;
  });

  const startAnimation = React.useCallback(() => {
    // Show progress bar
    Animated.timing(fade, {
      duration: 200 * scale,
      toValue: 1,
      useNativeDriver: true,
      isInteraction: false,
    }).start();

    /**
     * We shouldn't add @param animatedValue to the
     * deps array, to avoid the unnecessary loop.
     * We can only check if the prop is passed initially,
     * and we do early return.
     */
    const externalAnimation =
      typeof passedAnimatedValue.current !== 'undefined' &&
      passedAnimatedValue.current >= 0;

    if (externalAnimation) {
      return;
    }

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
  }, [fade, scale, indeterminate, timer, progress]);

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
    if (animatedValue && animatedValue >= 0) {
      timer.setValue(animatedValue);
    }
  }, [animatedValue, timer]);

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

  const tintColor = color || theme.colors?.primary;
  const trackTintColor = theme.isV3
    ? theme.colors.surfaceVariant
    : setColor(tintColor).alpha(0.38).rgb().string();

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

export default ProgressBar;
