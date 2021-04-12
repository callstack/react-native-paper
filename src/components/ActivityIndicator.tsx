import * as React from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { withTheme } from '../core/theming';

type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Whether to show the indicator or hide it.
   */
  animating?: boolean;
  /**
   * The color of the spinner.
   */
  color?: string;
  /**
   * Size of the indicator.
   */
  size?: 'small' | 'large' | number;
  /**
   * Whether the indicator should hide when not animating.
   */
  hidesWhenStopped?: boolean;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

const DURATION = 2400;

/**
 * Activity indicator is used to present progress of some activity in the app.
 * It can be used as a drop-in for the ActivityIndicator shipped with React Native.
 *
 * <div class="screenshots">
 *   <img src="screenshots/activity-indicator.gif" style="width: 100px;" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { ActivityIndicator, Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <ActivityIndicator animating={true} color={Colors.red800} />
 * );
 *
 * export default MyComponent;
 * ```
 */
const ActivityIndicator = ({
  animating = true,
  color: indicatorColor,
  hidesWhenStopped = true,
  size: indicatorSize = 'small',
  style,
  theme,
  ...rest
}: Props) => {
  const { current: timer } = React.useRef<Animated.Value>(
    new Animated.Value(0)
  );
  const { current: fade } = React.useRef<Animated.Value>(
    new Animated.Value(!animating && hidesWhenStopped ? 0 : 1)
  );

  const rotation = React.useRef<Animated.CompositeAnimation | undefined>(
    undefined
  );

  const {
    animation: { scale },
  } = theme;

  const startRotation = React.useCallback(() => {
    // Show indicator
    Animated.timing(fade, {
      duration: 200 * scale,
      toValue: 1,
      isInteraction: false,
      useNativeDriver: true,
    }).start();

    // Circular animation in loop
    if (rotation.current) {
      timer.setValue(0);
      // $FlowFixMe
      Animated.loop(rotation.current).start();
    }
  }, [scale, fade, timer]);

  const stopRotation = () => {
    if (rotation.current) {
      rotation.current.stop();
    }
  };

  React.useEffect(() => {
    if (rotation.current === undefined) {
      // Circular animation in loop
      rotation.current = Animated.timing(timer, {
        duration: DURATION,
        easing: Easing.linear,
        // Animated.loop does not work if useNativeDriver is true on web
        useNativeDriver: Platform.OS !== 'web',
        toValue: 1,
        isInteraction: false,
      });
    }

    if (animating) {
      startRotation();
    } else if (hidesWhenStopped) {
      // Hide indicator first and then stop rotation
      Animated.timing(fade, {
        duration: 200 * scale,
        toValue: 0,
        useNativeDriver: true,
        isInteraction: false,
      }).start(stopRotation);
    } else {
      stopRotation();
    }
  }, [animating, fade, hidesWhenStopped, startRotation, scale, timer]);

  const color = indicatorColor || theme.colors.primary;
  const size =
    typeof indicatorSize === 'string'
      ? indicatorSize === 'small'
        ? 24
        : 48
      : indicatorSize
      ? indicatorSize
      : 24;

  const frames = (60 * DURATION) / 1000;
  const easing = Easing.bezier(0.4, 0.0, 0.7, 1.0);
  const containerStyle = {
    width: size,
    height: size / 2,
    overflow: 'hidden' as const,
  };

  return (
    <View
      style={[styles.container, style]}
      {...rest}
      accessible
      accessibilityRole="progressbar"
    >
      <Animated.View
        style={[{ width: size, height: size, opacity: fade }]}
        collapsable={false}
      >
        {[0, 1].map((index) => {
          // Thanks to https://github.com/n4kz/react-native-indicators for the great work
          const inputRange = Array.from(
            new Array(frames),
            (_, frameIndex) => frameIndex / (frames - 1)
          );
          const outputRange = Array.from(new Array(frames), (_, frameIndex) => {
            let progress = (2 * frameIndex) / (frames - 1);
            const rotation = index ? +(360 - 15) : -(180 - 15);

            if (progress > 1.0) {
              progress = 2.0 - progress;
            }

            const direction = index ? -1 : +1;

            return `${direction * (180 - 30) * easing(progress) + rotation}deg`;
          });

          const layerStyle = {
            width: size,
            height: size,
            transform: [
              {
                rotate: timer.interpolate({
                  inputRange: [0, 1],
                  outputRange: [`${0 + 30 + 15}deg`, `${2 * 360 + 30 + 15}deg`],
                }),
              },
            ],
          };

          const viewportStyle = {
            width: size,
            height: size,
            transform: [
              {
                translateY: index ? -size / 2 : 0,
              },
              {
                rotate: timer.interpolate({ inputRange, outputRange }),
              },
            ],
          };

          const offsetStyle = index ? { top: size / 2 } : null;

          const lineStyle = {
            width: size,
            height: size,
            borderColor: color,
            borderWidth: size / 10,
            borderRadius: size / 2,
          };

          return (
            <Animated.View key={index} style={[styles.layer]}>
              <Animated.View style={layerStyle}>
                <Animated.View
                  style={[containerStyle, offsetStyle]}
                  collapsable={false}
                >
                  <Animated.View style={viewportStyle}>
                    <Animated.View style={containerStyle} collapsable={false}>
                      <Animated.View style={lineStyle} />
                    </Animated.View>
                  </Animated.View>
                </Animated.View>
              </Animated.View>
            </Animated.View>
          );
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  layer: {
    ...StyleSheet.absoluteFillObject,

    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withTheme(ActivityIndicator);
