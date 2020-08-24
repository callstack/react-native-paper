import * as React from 'react';
import {
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  StyleSheet,
  StyleProp,
  GestureResponderEvent,
  unstable_createElement,
} from 'react-native';
import color from 'color';
import { withTheme } from '../../core/theming';

type Props = React.ComponentPropsWithRef<typeof TouchableWithoutFeedback> & {
  /**
   * Whether to render the ripple outside the view bounds.
   */
  borderless?: boolean;
  /**
   * Type of background drawabale to display the feedback (Android).
   * https://facebook.github.io/react-native/docs/touchablenativefeedback.html#background
   */
  background?: Object;
  /**
   * Whether to start the ripple at the center (Web).
   */
  centered?: boolean;
  /**
   * Whether to prevent interaction with the touchable.
   */
  disabled?: boolean;
  /**
   * Function to execute on press. If not set, will cause the touchable to be disabled.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: (e: GestureResponderEvent) => void;
  /**
   * Color of the ripple effect (Android >= 5.0 and Web).
   */
  rippleColor?: string;
  /**
   * Color of the underlay for the highlight effect (Android < 5.0 and iOS).
   */
  underlayColor?: string;
  /**
   * Content of the `TouchableRipple`.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

/**
 * A wrapper for views that should respond to touches.
 * Provides a material "ink ripple" interaction effect for supported platforms (>= Android Lollipop).
 * On unsupported platforms, it falls back to a highlight effect.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/touchable-ripple.gif" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Text, TouchableRipple } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <TouchableRipple
 *     onPress={() => console.log('Pressed')}
 *     rippleColor="rgba(0, 0, 0, .32)"
 *   >
 *     <Text>Press anywhere</Text>
 *   </TouchableRipple>
 * );
 *
 * export default MyComponent;
 * ```
 */

const RIPPLE_DURATION = 250;

const ViewWithAnimationEnd = (props) => unstable_createElement('div', props);

function TouchableRipple(props: Props) {
  const {
    style,
    background,
    borderless = false,
    disabled: disabledProp,
    rippleColor,
    underlayColor,
    children,
    theme,
    onPressIn,
    onPressOut,
    centered,
    ...rest
  } = props;
  const { dark, colors } = theme;
  const [rippleArray, setRippleArray] = React.useState<any>([]);
  const calculatedRippleColor = React.useMemo(
    () =>
      rippleColor ||
      color(colors.text)
        .alpha(dark ? 0.32 : 0.2)
        .rgb()
        .string(),
    [rippleColor, colors, dark]
  );

  const handlePressIn = (e: any) => {
    onPressIn?.(e);
    const button = e.currentTarget;
    const dimensions = button.getBoundingClientRect();

    const size = centered
      ? // If ripple is always centered, we don't need to make it too big
        Math.min(dimensions.width, dimensions.height) * 1.25
      : // Otherwise make it twice as big so clicking on one end spreads ripple to other
        Math.max(dimensions.width, dimensions.height) * 2;

    let touchX;
    let touchY;

    if (centered) {
      touchX = dimensions.width / 2;
      touchY = dimensions.height / 2;
    } else {
      const { changedTouches, touches } = e.nativeEvent;
      const touch = touches?.[0] ?? changedTouches?.[0];
      touchX = touch.locationX ?? e.pageX;
      touchY = touch.locationY ?? e.pageY;
    }

    const animationDuration = `${Math.min(size * 1.5, 350)}ms`;

    const newRipple = {
      style: {
        backgroundColor: calculatedRippleColor,
        left: touchX,
        top: touchY,
        width: size,
        height: size,
        animationDuration,
      },
      animationType: 'in',
    };

    setRippleArray([...rippleArray, newRipple]);
  };

  const onAnimationEnd = (ripple: any) => {
    if (ripple.animationType === 'out') {
      setRippleArray((prev) => prev.filter((p) => p !== ripple));
    }
  };

  const handlePressOut = (e: any) => {
    props.onPressOut && props.onPressOut(e);

    setRippleArray((prev) =>
      prev.map((p, i) =>
        i === prev.length - 1 ? { ...p, animationType: 'out' } : p
      )
    );
  };

  const disabled = disabledProp || !props.onPress;

  const rippleContainerStyle = React.useMemo(() => {
    const flattenStyles = StyleSheet.flatten(style);
    return pickRadiusStyles(flattenStyles);
  }, [style]);

  return (
    <TouchableWithoutFeedback
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <View style={[styles.touchable, borderless && styles.borderless, style]}>
        {React.Children.only(children)}
        <View
          style={[
            styles.rippleContainer,
            rippleContainerStyle,
            { overflow: centered ? 'visible' : 'hidden' },
          ]}
          pointerEvents='none'
        >
          {rippleArray.map((ripple, index) => {
            const { animationType, style } = ripple;
            const rippleStyle: any[] =
              animationType === 'in'
                ? [styles.ripple, styles.animatedIn, styles.rippleIn, style]
                : [styles.ripple, styles.animatedOut, styles.rippleOut, style];
            return (
              <ViewWithAnimationEnd
                key={index}
                onAnimationEnd={() => onAnimationEnd(ripple)}
                style={rippleStyle}
              />
            );
          })}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

function pickRadiusStyles({
  borderBottomEndRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  borderBottomStartRadius,
  borderRadius,
  borderTopEndRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderTopStartRadius,
}: ViewStyle) {
  return {
    borderBottomEndRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderBottomStartRadius,
    borderRadius,
    borderTopEndRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderTopStartRadius,
  };
}

const fromRippleStyle = {
  opacity: 0.5,
  transform: [
    { translateY: '-50%' as any },
    { translateX: '-50%' as any },
    { scale: '0.1' as any },
  ],
};

const toRippleStyle = {
  opacity: 1,
  transform: [
    { translateY: '-50%' as any },
    { translateX: '-50%' as any },
    { scale: '1' as any },
  ],
};

const toRippleOutStyle = {
  opacity: 0,
  transform: [
    { translateY: '-50%' as any },
    { translateX: '-50%' as any },
    { scale: '1' as any },
  ],
};

const styles = StyleSheet.create({
  touchable: {
    position: 'relative',
  },
  borderless: {
    overflow: 'hidden',
  },
  rippleContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
  ripple: {
    position: 'absolute',
    //@ts-ignore
    willChange: 'transform, opacity, scale, left, top' as any,
    borderRadius: '50%' as any,
    transformOrigin: 'center',
  },
  animatedIn: {
    //@ts-ignore
    animationDuration: `${RIPPLE_DURATION}ms`,
    animationTimingFunction: 'linear',
  },
  animatedOut: {
    //@ts-ignore
    animationDuration: `${RIPPLE_DURATION}ms`,

    animationTimingFunction: 'linear',
  },

  rippleIn: {
    ...toRippleStyle,
    //@ts-ignore
    animationKeyframes: {
      from: fromRippleStyle,
      to: toRippleStyle,
    },
  },
  rippleOut: {
    ...toRippleOutStyle,
    //@ts-ignore
    animationKeyframes: {
      from: toRippleStyle,
      to: toRippleOutStyle,
    },
  },
});

export default withTheme(TouchableRipple);
