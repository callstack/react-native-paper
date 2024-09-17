import * as React from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import setColor from 'color';

import { useInternalTheme } from '../core/theming';
import type { ThemeProp } from '../types';

export type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Progress value (between 0 and 1).
   */
  progress?: number;
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
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * Circular progress bar is an indicator used to present progress of some activity in the app.
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

  const { scale } = theme.animation;

  Animated.timing(timer, {
    duration: 200 * scale,
    toValue: 1,
    useNativeDriver: true,
    isInteraction: false,
  }).start();

  const color = indicatorColor || theme.colors?.primary;
  const tintColor = theme.isV3
    ? theme.colors.surfaceVariant
    : setColor(color).alpha(0.38).rgb().string();

  const size =
    typeof indicatorSize === 'string'
      ? indicatorSize === 'small'
        ? 24
        : 48
      : indicatorSize
      ? indicatorSize
      : 24;

  const layerStyle = {
    width: size,
    height: size,
  };

  const backgroundStyle = {
    borderColor: tintColor,
    borderWidth: size / 10,
    borderRadius: size / 2,
  };

  const progressInDegrees = progress * 360;
  // Rotation of the left half of the circle
  const leftRotation = progressInDegrees > 180 ? 180 : progressInDegrees;
  // Rotation the right half of the circle
  const rightRotation = progressInDegrees > 180 ? progressInDegrees - 180 : 0;

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
          const fixWidth =
            progress > 0.5 ? (index ? size / 2 : size / 2 + 1) : size / 2;

          const containerStyle = {
            width: fixWidth,
            height: size,
            overflow: 'hidden' as const,
          };

          const offsetStyle = index
            ? {
                left: size / 2,
                transform: [
                  {
                    rotate: `180deg`,
                  },
                ],
              }
            : null;

          const middle = Math.floor(180 / progressInDegrees);

          const rotationStyle = animating
            ? {
                transform: [
                  {
                    rotate: timer.interpolate({
                      inputRange:
                        progressInDegrees > 180
                          ? index
                            ? [0, middle, middle]
                            : [middle, middle, 1]
                          : index
                          ? [0, 1, 1]
                          : [0, 0, 1],
                      outputRange: index
                        ? [
                            `180deg`,
                            `${leftRotation + 180}deg`,
                            `${leftRotation + 180}deg`,
                          ]
                        : [`180deg`, `180deg`, `${rightRotation + 180}deg`],
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
            borderWidth: progress === 0 ? 0 : size / 10, // Prevents clipping when progress is 0
            borderRadius: size / 2,
          };

          return (
            <Animated.View key={index} style={[styles.layer]}>
              <Animated.View style={layerStyle}>
                <Animated.View
                  style={[containerStyle, offsetStyle]}
                  collapsable={false}
                >
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
