import * as React from "react";
import {
  Pressable,
  View,
  ViewStyle,
  StyleSheet,
  StyleProp,
  GestureResponderEvent,
  //@ts-ignore
  unstable_createElement
} from "react-native";

import color from "color";

type InteractionState = {
  hovered?: boolean;
  focused?: boolean;
  pressed: boolean;
};

type StyleType =
  | StyleProp<ViewStyle>
  | ((interactionState: InteractionState) => StyleProp<ViewStyle>);

type ChildrenType =
  | React.ReactNode
  | ((interactionState: InteractionState) => React.ReactNode);

type Props = React.ComponentPropsWithRef<typeof Pressable> & {
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
  children: ChildrenType;
  style?: StyleType;
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
const colors = {
  text: "#000"
};
const dark = false;

function getStyle(interactionState: InteractionState, s: StyleType) {
  return typeof s === "function" ? s(interactionState) : s;
}

function getChildren(interactionState: InteractionState, c: ChildrenType) {
  return typeof c === "function" ? c(interactionState) : c;
}

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
    theme,
    ...rest
  } = props;

  const calculatedRippleColor = React.useMemo(
    () =>
      rippleColor ||
      color(colors.text)
        .alpha(dark ? 0.32 : 0.2)
        .rgb()
        .string(),
    [rippleColor]
  );
  const [rippleArray, setRippleArray] = React.useState<RippleType[]>([]);
  const handlePressIn = (e: any) => {
    onPressIn?.(e);
    const button = e.currentTarget;
    const dimensions = button.getBoundingClientRect();

    let touchX;
    let touchY;

    const { changedTouches, touches } = e.nativeEvent;
    const touch = touches?.[0] ?? changedTouches?.[0];
    // If centered or it was pressed using keyboard - enter or space
    if (centered || !touch) {
      touchX = dimensions.width / 2;
      touchY = dimensions.height / 2;
    } else {
      touchX = touch.locationX ?? e.pageX;
      touchY = touch.locationY ?? e.pageY;
    }

    const size = centered
      ? // If ripple is always centered, we don't need to make it too big
        Math.min(dimensions.width, dimensions.height) * 1.25
      : // Otherwise make it twice as big so clicking on one end spreads ripple to other
        Math.max(dimensions.width, dimensions.height) * 2;

    const newRipple: RippleType = {
      style: {
        backgroundColor: calculatedRippleColor,
        left: touchX,
        top: touchY,
        width: size,
        height: size
      },
      animationDuration: Math.min(size * 1.5, 350),
      status: RippleStatus.Pressed
    };

    setRippleArray([...rippleArray, newRipple]);
  };

  const onRemove = (ripple: RippleType) => {
    setRippleArray((prev) => prev.filter((p) => p !== ripple));
  };

  const handlePressOut = (e: any) => {
    props.onPressOut && props.onPressOut(e);

    setRippleArray((prev) =>
      prev.map((p, i) =>
        i === prev.length - 1 ? { ...p, status: RippleStatus.NotPressed } : p
      )
    );
  };

  const disabled = disabledProp || !props.onPress;

  const rippleContainerStyle = React.useMemo(() => {
    const flattenStyles = StyleSheet.flatten(
      getStyle({ pressed: false }, style)
    );
    return pickRadiusStyles(flattenStyles);
  }, [style]);

  return (
    <Pressable
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      {(interactionState) => (
        <View
          style={[
            styles.touchable,
            borderless && styles.borderless,
            getStyle(interactionState, style)
          ]}
        >
          {React.Children.only(getChildren(interactionState, children))}
          <View
            style={[
              styles.rippleContainer,
              rippleContainerStyle,
              { overflow: centered ? "visible" : "hidden" }
            ]}
            pointerEvents="none"
          >
            {rippleArray.map((ripple, index) => (
              <Ripple key={index} ripple={ripple} onRemove={onRemove} />
            ))}
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchable: {
    position: "relative"
  },
  borderless: {
    overflow: "hidden"
  },
  rippleContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: "hidden"
  }
});

type RippleStatusType = "pressed" | "not_pressed";
const RippleStatus: { [key: string]: RippleStatusType } = {
  Pressed: "pressed",
  NotPressed: "not_pressed"
};

type RippleType = {
  style: {
    backgroundColor: string;
    left: number;
    top: number;
    width: number;
    height: number;
  };
  animationDuration: number;
  status: RippleStatusType;
};

const Div = (props) => unstable_createElement("div", props);
function Ripple({
  onRemove,
  ripple,
  ripple: { status, animationDuration, style }
}: {
  ripple: RippleType;
  onRemove: (ripple: RippleType) => any;
}) {
  const onAnimationEnd = () => {
    if (status === RippleStatus.NotPressed) {
      onRemove(ripple);
    }
  };

  return (
    <Div
      style={[
        rippleStyles.container,
        status === RippleStatus.Pressed ? rippleStyles.show : rippleStyles.hide
      ]}
    >
      <Div
        onAnimationEnd={onAnimationEnd}
        style={[
          rippleStyles.ripple,
          rippleStyles.animated,
          rippleStyles.rippleIn,
          style,
          {
            animationDuration: `${animationDuration}ms`
          }
        ]}
      />
    </Div>
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
  borderTopStartRadius
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
    borderTopStartRadius
  };
}

const fromRippleStyle = {
  transform: [
    { translateY: "-50%" as any },
    { translateX: "-50%" as any },
    { scale: "0.1" as any }
  ]
};

const toRippleStyle = {
  transform: [
    { translateY: "-50%" as any },
    { translateX: "-50%" as any },
    { scale: "1" as any }
  ]
};

const toRippleOutStyle = {
  transform: [
    { translateY: "-50%" as any },
    { translateX: "-50%" as any },
    { scale: "1" as any }
  ]
};

const rippleStyles = StyleSheet.create({
  ripple: {
    position: "absolute",
    //@ts-ignore
    willChange: "transform" as any,
    borderRadius: "50%" as any,
    transformOrigin: "center"
  },
  animated: {
    //@ts-ignore
    animationDuration: `${RIPPLE_DURATION}ms`,
    animationTimingFunction: "linear"
  },

  rippleIn: {
    ...toRippleStyle,
    //@ts-ignore
    animationKeyframes: {
      "0%": fromRippleStyle,
      "100%": toRippleStyle
    }
  },
  rippleOut: {
    ...toRippleOutStyle,
    //@ts-ignore
    animationKeyframes: {
      "0%": toRippleStyle,
      "100%": toRippleOutStyle
    }
  },
  container: {
    //@ts-ignore
    transitionDuration: `250ms`,
    willChange: "opacity" as any,
    transitionProperty: "opacity",
    transitionTimingFunction: "linear"
  },
  show: {
    opacity: 0.5
  },
  hide: {
    opacity: 0
  }
});

/**
 * Whether ripple effect is supported.
 */
TouchableRipple.supported = true;

export default withTheme(TouchableRipple);
