/* @flow */

import * as React from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { withTheme } from '../core/theming';
import type { Theme } from '../../types';

type Props = {|
  /**
   * Whether to show the indicator or hide it.
   */
  animating: boolean,
  /**
   * The color of the spinner.
   */
  color?: string,
  /**
   * Size of the indicator.
   */
  size: 'small' | 'large' | number,
  /**
   * Whether the indicator should hide when not animating.
   */
  hidesWhenStopped: boolean,
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
class ActivityIndicator extends React.Component<Props, State> {
  static defaultProps = {
    animating: true,
    size: 'small',
    hidesWhenStopped: true,
  };

  state = {
    timer: new Animated.Value(0),
    fade: new Animated.Value(
      !this.props.animating && this.props.hidesWhenStopped ? 0 : 1
    ),
  };

  rotation = null;

  componentDidMount() {
    const { animating } = this.props;
    const { timer } = this.state;

    // Circular animation in loop
    this.rotation = Animated.timing(timer, {
      duration: DURATION,
      easing: Easing.linear,
      // Animated.loop does not work if useNativeDriver is true on web
      useNativeDriver: Platform.OS !== 'web',
      toValue: 1,
      isInteraction: false,
    });

    if (animating) {
      this._startRotation();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { animating, hidesWhenStopped } = this.props;
    const { fade } = this.state;

    if (animating !== prevProps.animating) {
      if (animating) {
        this._startRotation();
      } else if (hidesWhenStopped) {
        // Hide indicator first and then stop rotation
        Animated.timing(fade, {
          duration: 200,
          toValue: 0,
          useNativeDriver: true,
          isInteraction: false,
        }).start(this._stopRotation.bind(this));
      } else {
        this._stopRotation();
      }
    }
  }

  _startRotation = () => {
    const { fade, timer } = this.state;

    // Show indicator
    Animated.timing(fade, {
      duration: 200,
      toValue: 1,
      isInteraction: false,
      useNativeDriver: true,
    }).start();

    // Circular animation in loop
    if (this.rotation) {
      timer.setValue(0);
      // $FlowFixMe
      Animated.loop(this.rotation).start();
    }
  };

  _stopRotation = () => {
    if (this.rotation) {
      this.rotation.stop();
    }
  };

  render() {
    const { fade, timer } = this.state;
    const {
      animating,
      color: indicatorColor,
      hidesWhenStopped,
      size: indicatorSize,
      style,
      theme,
      ...rest
    } = this.props;
    const color = indicatorColor || theme.colors.primary;
    const size =
      typeof indicatorSize === 'string'
        ? indicatorSize === 'small'
          ? 24
          : 48
        : indicatorSize;

    const frames = (60 * DURATION) / 1000;
    const easing = Easing.bezier(0.4, 0.0, 0.7, 1.0);
    const containerStyle = {
      width: size,
      height: size / 2,
      overflow: 'hidden',
    };

    return (
      <View style={[styles.container, style]} {...rest}>
        <Animated.View style={[{ width: size, height: size, opacity: fade }]}>
          {[0, 1].map(index => {
            // Thanks to https://github.com/n4kz/react-native-indicators for the great work
            const inputRange = Array.from(
              new Array(frames),
              (frame, frameIndex) => frameIndex / (frames - 1)
            );
            const outputRange = Array.from(
              new Array(frames),
              (frame, frameIndex) => {
                let progress = (2 * frameIndex) / (frames - 1);
                const rotation = index ? +(360 - 15) : -(180 - 15);

                if (progress > 1.0) {
                  progress = 2.0 - progress;
                }

                const direction = index ? -1 : +1;

                return `${direction * (180 - 30) * easing(progress) +
                  rotation}deg`;
              }
            );

            const layerStyle = {
              width: size,
              height: size,
              transform: [
                {
                  rotate: timer.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      `${0 + 30 + 15}deg`,
                      `${2 * 360 + 30 + 15}deg`,
                    ],
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
  }
}

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
