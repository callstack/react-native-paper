import * as React from 'react';
import {
  Pressable,
  View,
  StyleSheet,
  GestureResponderEvent,
  ColorValue,
} from 'react-native';
import color from 'color';
import { withTheme } from '../../core/theming';
import type { RippleType } from './Ripple';
import Ripple, { RippleStatus } from './Ripple';
import {
  getInteractionChildren,
  getInteractionStyle,
  InteractionChildrenType,
  InteractionState,
  InteractionStyleType,
  useRadiusStyles,
} from './utils';

type Props = React.ComponentPropsWithRef<typeof Pressable> & {
  /**
   * Whether to render the ripple outside the view bounds.
   */
  borderless?: boolean;
  /**
   * Type of background drawable to display the feedback (Android).
   * https://reactnative.dev/docs/touchablenativefeedback.html#background
   */
  background?: Object;
  /**
   * Whether to start the ripple at the center (Web).
   */
  centered?: boolean;
  /**
   * Whether to prevent interaction with the touchable.
   */
  disabled?: boolean | null;
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
  rippleColor?: ColorValue;
  /**
   * Color of the underlay for the highlight effect (Android < 5.0 and iOS).
   */
  underlayColor?: ColorValue;
  /**
   * Content of the `TouchableRipple`.
   */
  children: InteractionChildrenType;
  style?: InteractionStyleType;
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
 *     <Text selectable={false}>Press anywhere</Text>
 *   </TouchableRipple>
 * );
 *
 * const MyComponentWithHover = () => (
 *   <TouchableRipple
 *     onPress={() => console.log('Pressed')}
 *     rippleColor="rgba(0, 0, 0, .32)"
 *     style={({ pressed, focused, hovered }) => [
 *       styles.normal,
 *       pressed && styles.pressed,
 *       focused && styles.focused,
 *       hovered && styles.hovered,
 *     ]}
 *   >
 *     {({ pressed, focused, hovered }) => (
 *       <Text>
 *         State:
 *         {[pressed && 'pressed', focused && 'focused', hovered && 'hovered']
 *           .filter((n) => n)
 *           .join(',')}
 *       </Text>
 *     )}
 *   </TouchableRipple>
 * );
 *
 * export default MyComponent;
 * ```
 *
 * @extends Pressable props https://reactnative.dev/docs/pressable#props
 */

function TouchableRipple({
  style,
  background: _background,
  borderless = false,
  disabled: disabledProp,
  rippleColor,
  underlayColor: _underlayColor,
  children,
  centered,
  theme,
  ...rest
}: Props) {
  const calculatedRippleColor =
    rippleColor ||
    color(theme.colors.text)
      .alpha(theme.dark ? 0.32 : 0.2)
      .rgb()
      .string();
  const [rippleArray, setRippleArray] = React.useState<RippleType[]>([]);

  const handlePressIn = (e: GestureResponderEvent) => {
    rest.onPressIn?.(e);
    const button = e.currentTarget;

    const dimensions = (button as any).getBoundingClientRect();

    let touchX;
    let touchY;

    const { changedTouches, touches } = e.nativeEvent;
    const touch = touches?.[0] ?? changedTouches?.[0];
    // If centered or it was pressed using keyboard - enter or space
    if (centered || !touch) {
      touchX = dimensions.width / 2;
      touchY = dimensions.height / 2;
    } else {
      touchX = touch.locationX ?? (e as any).pageX;
      touchY = touch.locationY ?? (e as any).pageY;
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
        height: size,
      },
      animationDuration: Math.min(size * 1.5, 350),
      status: RippleStatus.Pressed,
    };

    setRippleArray([...rippleArray, newRipple]);
  };

  const onRemove = (ripple: RippleType) => {
    setRippleArray((prev) => prev.filter((p) => p !== ripple));
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    rest.onPressOut?.(e);

    setRippleArray((prev) =>
      prev.map((p, i) =>
        i === prev.length - 1 ? { ...p, status: RippleStatus.NotPressed } : p
      )
    );
  };

  const disabled = disabledProp || !rest.onPress;
  const rippleContainerStyle = useRadiusStyles(style);
  return (
    <Pressable
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={(interactionState: InteractionState) => [
        styles.touchable,
        borderless && styles.overflowHidden,
        getInteractionStyle(interactionState, style),
      ]}
    >
      {(interactionState: InteractionState) => (
        <>
          {React.Children.only(
            getInteractionChildren(interactionState, children)
          )}
          <View
            style={[
              StyleSheet.absoluteFill,
              rippleContainerStyle,
              centered ? styles.overflowVisible : styles.overflowHidden,
            ]}
            pointerEvents="none"
          >
            {rippleArray.map((ripple, index) => (
              <Ripple key={index} ripple={ripple} onRemove={onRemove} />
            ))}
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchable: {
    position: 'relative',
  },
  overflowVisible: {
    overflow: 'visible',
  },
  overflowHidden: {
    overflow: 'hidden',
  },
});

/**
 * Whether ripple effect is supported.
 */
TouchableRipple.supported = true;

export default withTheme(TouchableRipple);
