import * as React from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  Animated,
  Easing,
} from 'react-native';
import { grey300 } from '../../styles/colors';

type Props = {
  radius: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Skeleton-circle can be used to show loading in geometrically.
 *
 * <div class="screenshots">
 * <figure>
 *     <img class="small" src="screenshots/skeleton_circle.gif" />
 *     <figcaption>Android/iOS</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="small" src="screenshots/skeleton.png" />
 *     <figcaption>Android/iOS</figcaption>
 * </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Skeleton } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Skeleton.Circle radius={50} />
 * );
 * ```
 */

class SkeletonCircle extends React.Component<Props> {
  static displayName = 'Skeleton.Circle';
  static defaultProps = {
    color: grey300,
  };

  state = {
    anim: new Animated.Value(0.2),
  };

  componentDidMount() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.anim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(this.state.anim, {
          toValue: 0.2,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
        }),
      ])
    ).start();
  }

  render() {
    const { radius, color, style } = this.props;

    return (
      <Animated.View
        style={{
          ...styles.container,
          ...StyleSheet.flatten(style),
          height: radius * 2,
          width: radius * 2,
          borderRadius: radius * 2,
          backgroundColor: color,
          opacity: this.state.anim,
        }}
      ></Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
  },
});

export default SkeletonCircle;
