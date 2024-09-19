import * as React from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  PixelRatio,
} from 'react-native';

import setColor from 'color';

import { useInternalTheme } from '../core/theming';
import type { ThemeProp } from '../types';

export type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Progress value (between 0 and 1).
   */
  progress?: number;
  /**
   * Whether to animate the circular progress bar or not.
   */
  animating?: boolean;
  /**
   * The color of the circular progress bar.
   */
  color?: string;
  /**
   * Size of the circular progress bar.
   */
  size?: 'small' | 'large' | number;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * Circular progress bar is an indicator used to present progress of some activity in the app.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { CircularProgressBar, MD2Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <CircularProgressBar progress={0.75} />
 * );
 *
 * export default MyComponent;
 * ```
 */
const CircularProgressBar = ({
  progress = 0,
  animating = true,
  color: indicatorColor,
  size: indicatorSize = 'small',
  style,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  // Progress must be between 0 and 1
  if (progress < 0) progress = 0;
  if (progress > 1) progress = 1;

  const { current: timer } = React.useRef<Animated.Value>(
    new Animated.Value(0)
  );

  const prevProgressValue = React.useRef<number>(0);

  const { scale } = theme.animation;

  React.useEffect(() => {
    timer.setValue(0);
    Animated.timing(timer, {
      duration: 200 * scale,
      toValue: 1,
      useNativeDriver: true,
      isInteraction: false,
    }).start();
  }, [progress, scale, timer]);

  React.useEffect(() => {
    prevProgressValue.current = progress;
  }, [progress]);

  const color = indicatorColor || theme.colors?.primary;
  const tintColor = theme.isV3
    ? theme.colors.surfaceVariant
    : setColor(color).alpha(0.38).rgb().string();

  let size =
    typeof indicatorSize === 'string'
      ? indicatorSize === 'small'
        ? 24
        : 48
      : indicatorSize
      ? indicatorSize
      : 24;
  // Calculate the actual size of the circular progress bar to prevent a bug with clipping containers
  const halfSize = PixelRatio.roundToNearestPixel(size / 2);
  size = halfSize * 2;

  const layerStyle = {
    width: size,
    height: size,
  };

  const containerStyle = {
    width: halfSize,
    height: size,
    overflow: 'hidden' as const,
  };

  const backgroundStyle = {
    borderColor: tintColor,
    borderWidth: size / 10,
    borderRadius: size / 2,
  };

  const progressInDegrees = Math.ceil(progress * 360);
  const leftRotation = progressInDegrees > 180 ? 180 : progressInDegrees;
  const rightRotation = progressInDegrees > 180 ? progressInDegrees - 180 : 0;

  const prevProgressInDegrees = Math.ceil(prevProgressValue.current * 360);
  const prevLeftRotation =
    prevProgressInDegrees > 180 ? 180 : prevProgressInDegrees;
  const prevRightRotation =
    prevProgressInDegrees > 180 ? prevProgressInDegrees - 180 : 0;

  const addProgress = progressInDegrees > prevProgressInDegrees;
  const noProgress = progressInDegrees - prevProgressInDegrees === 0;
  const progressLteFiftyPercent = progressInDegrees <= 180;
  const prevProgressGteFiftyPercent = prevProgressInDegrees >= 180;

  let middle = 0;

  if (
    noProgress ||
    (addProgress && prevProgressGteFiftyPercent) ||
    (!addProgress && !prevProgressGteFiftyPercent)
  ) {
    middle = 0;
  } else if (
    (addProgress && progressLteFiftyPercent) ||
    (!addProgress && !progressLteFiftyPercent)
  ) {
    middle = 1;
  } else if (addProgress) {
    middle =
      (180 - prevProgressInDegrees) /
      (progressInDegrees - prevProgressInDegrees);
  } else {
    middle =
      (prevProgressInDegrees - 180) /
      (prevProgressInDegrees - progressInDegrees);
  }

  return (
    <View
      style={[styles.container, style]}
      {...rest}
      accessible
      accessibilityRole="progressbar"
      accessibilityState={{ busy: animating }}
    >
      <Animated.View
        style={[{ width: size, height: size }]}
        collapsable={false}
      >
        <Animated.View style={[backgroundStyle, layerStyle]} />
        {[0, 1].map((index) => {
          const offsetStyle = index
            ? {
                transform: [
                  {
                    rotate: `180deg`,
                  },
                ],
              }
            : null;

          const rotationStyle = animating
            ? {
                transform: [
                  {
                    rotate: timer.interpolate({
                      inputRange: addProgress
                        ? index
                          ? [0, middle, middle]
                          : [middle, middle, 1]
                        : index
                        ? [middle, middle, 1]
                        : [0, middle, middle],
                      outputRange: index
                        ? [
                            `${prevLeftRotation + 180}deg`,
                            `${
                              (addProgress ? leftRotation : prevLeftRotation) +
                              180
                            }deg`,
                            `${leftRotation + 180}deg`,
                          ]
                        : [
                            `${prevRightRotation + 180}deg`,
                            `${
                              (addProgress
                                ? prevRightRotation
                                : rightRotation) + 180
                            }deg`,
                            `${rightRotation + 180}deg`,
                          ],
                    }),
                  },
                ],
              }
            : {
                transform: [
                  {
                    rotate: index
                      ? `${leftRotation - 180}deg`
                      : `${rightRotation - 180}deg`,
                  },
                ],
              };

          const lineStyle = {
            width: size,
            height: size,
            borderColor: color,
            borderWidth: size / 10,
            borderRadius: size / 2,
          };

          return (
            <Animated.View key={index} style={[styles.layer, offsetStyle]}>
              <Animated.View style={[layerStyle]}>
                <Animated.View style={[containerStyle]} collapsable={false}>
                  <Animated.View style={[layerStyle, rotationStyle]}>
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

export default CircularProgressBar;
