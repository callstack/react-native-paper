import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';

import color from 'color';

import type { PressableProps, PressableStateCallbackType } from './Pressable';
import { Pressable } from './Pressable';
import { getTouchableRippleColors } from './utils';
import { SettingsContext } from '../../core/settings';
import type { Settings } from '../../core/settings';
import { useInternalTheme } from '../../core/theming';
import { tokens } from '../../theme/tokens';
import type { ThemeProp } from '../../types';
import hasTouchHandler from '../../utils/hasTouchHandler';

const { minInteractiveSize } = tokens.md.sys.state;

/**
 * react-native-web removed `hitSlop` in 0.13.0, so web needs a real element the
 * browser can hit-test instead. An absolutely positioned box at least the
 * minimum target size, which is what material-web does, and it costs no layout.
 * @see https://github.com/necolas/react-native-web/releases/tag/0.13.0
 * @see https://github.com/material-components/material-web/blob/main/iconbutton/internal/_shared.scss
 */
const getTouchTargetStyle = (hitSlop: PressableProps['hitSlop']): ViewStyle => {
  // `undefined` means the caller said nothing, so the minimum applies. `null`
  // means "no slop", same as native.
  if (hitSlop === undefined) {
    return styles.touchTarget;
  }
  if (hitSlop === null) {
    return styles.noTouchTarget;
  }

  // A caller hitSlop wins here too, so web matches native instead of ignoring
  // the prop.
  const inset = (value: number | undefined) => -(value ?? 0);

  return typeof hitSlop === 'number'
    ? {
        position: 'absolute',
        top: inset(hitSlop),
        bottom: inset(hitSlop),
        left: inset(hitSlop),
        right: inset(hitSlop),
      }
    : {
        position: 'absolute',
        top: inset(hitSlop.top),
        bottom: inset(hitSlop.bottom),
        left: inset(hitSlop.left),
        right: inset(hitSlop.right),
      };
};

export type Props = PressableProps & {
  /**
   * Whether to render the ripple outside the view bounds.
   *
   * On web the ripple is bounded by its own container, so this no longer clips
   * the touchable's content. The touchable cannot clip without clipping the
   * touch target, so children needing a rounded shape carry the radius
   * themselves.
   */
  borderless?: boolean;
  /**
   * Type of background drawabale to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
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
   * Function to execute immediately when a touch is engaged, before `onPressOut` and `onPress`.
   */
  onPressIn?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute when a touch is released.
   */
  onPressOut?: (e: GestureResponderEvent) => void;
  /**
   * Color of the ripple effect (Android >= 5.0 and Web).
   */
  rippleColor?: ColorValue;
  /**
   * Color of the underlay for the highlight effect (Android < 5.0 and iOS).
   */
  underlayColor?: string;
  /**
   * Content of the `TouchableRipple`.
   */
  children:
    | ((state: PressableStateCallbackType) => React.ReactNode)
    | React.ReactNode;
  style?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
    | undefined;
  ref?: React.Ref<View>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * A wrapper for views that should respond to touches.
 * Provides a material "ink ripple" interaction effect for supported platforms (>= Android Lollipop).
 * On unsupported platforms, it falls back to a highlight effect.
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
 *
 * @extends Pressable props https://reactnative.dev/docs/Pressable#props
 */
const TouchableRipple = ({
  style,
  background: _background,
  // consumed so it does not reach the DOM; the ripple container clips regardless
  borderless: _borderless = false,
  disabled: disabledProp,
  rippleColor,
  underlayColor: _underlayColor,
  children,
  theme: themeOverrides,
  hitSlop,
  ref,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { calculatedRippleColor } = getTouchableRippleColors({
    theme,
    rippleColor,
  });
  // Web-only style. PlatformColor doesn't exist on web, so the calculated
  // ripple color is effectively always a string here.
  const hoverColor =
    typeof calculatedRippleColor === 'string'
      ? color(calculatedRippleColor).fade(0.5).rgb().string()
      : calculatedRippleColor;
  const { rippleEffectEnabled } = React.useContext<Settings>(SettingsContext);

  const { onPress, onLongPress, onPressIn, onPressOut } = rest;

  const handlePressIn = React.useCallback(
    (e: any) => {
      onPressIn?.(e);

      if (rippleEffectEnabled) {
        const { centered } = rest;

        const button = e.currentTarget;
        const style = window.getComputedStyle(button);
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

        // Get the size of the button to determine how big the ripple should be
        const size = centered
          ? // If ripple is always centered, we don't need to make it too big
            Math.min(dimensions.width, dimensions.height) * 1.5
          : // Otherwise make it twice as big so clicking on one end spreads ripple to other
            Math.max(dimensions.width, dimensions.height) * 2;

        // Create a container for our ripple effect so we don't need to change the parent's style
        const container = document.createElement('span');

        container.setAttribute('data-paper-ripple', '');

        Object.assign(container.style, {
          position: 'absolute',
          pointerEvents: 'none',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          borderTopLeftRadius: style.borderTopLeftRadius,
          borderTopRightRadius: style.borderTopRightRadius,
          borderBottomRightRadius: style.borderBottomRightRadius,
          borderBottomLeftRadius: style.borderBottomLeftRadius,
          // The touchable cannot clip, it would clip the touch target too, so
          // the ripple is contained here. This container is inset to the
          // touchable and copies its radii, so it clips to the same shape.
          //
          // Always, not `centered ? 'visible' : 'hidden'` as before. A ripple
          // that escaped used to be caught by whichever ancestor clipped, and
          // those ancestors have to stop. ToggleButton hit this: it passes
          // `borderless={false}` to IconButton, which spreads it over its own,
          // so the Surface was holding the ripple in.
          overflow: 'hidden',
        });

        // Create span to show the ripple effect
        const ripple = document.createElement('span');

        Object.assign(ripple.style, {
          position: 'absolute',
          pointerEvents: 'none',
          backgroundColor: calculatedRippleColor,
          borderRadius: '50%',

          /* Transition configuration */
          transitionProperty: 'transform opacity',
          transitionDuration: `${Math.min(size * 1.5, 350)}ms`,
          transitionTimingFunction: 'linear',
          transformOrigin: 'center',

          /* We'll animate these properties */
          transform: 'translate3d(-50%, -50%, 0) scale3d(0.1, 0.1, 0.1)',
          opacity: '0.5',

          // Position the ripple where cursor was
          left: `${touchX}px`,
          top: `${touchY}px`,
          width: `${size}px`,
          height: `${size}px`,
        });

        // Finally, append it to DOM
        container.appendChild(ripple);
        button.appendChild(container);

        // rAF runs in the same frame as the event handler
        // Use double rAF to ensure the transition class is added in next frame
        // This will make sure that the transition animation is triggered
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            Object.assign(ripple.style, {
              transform: 'translate3d(-50%, -50%, 0) scale3d(1, 1, 1)',
              opacity: '1',
            });
          });
        });
      }
    },
    [onPressIn, rest, rippleEffectEnabled, calculatedRippleColor]
  );

  const handlePressOut = React.useCallback(
    (e: any) => {
      onPressOut?.(e);

      if (rippleEffectEnabled) {
        const containers: NodeListOf<HTMLElement> =
          e.currentTarget.querySelectorAll('[data-paper-ripple]');

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            containers.forEach((container) => {
              const ripple = container.firstElementChild;
              if (!(ripple instanceof HTMLSpanElement)) {
                return;
              }

              Object.assign(ripple.style, {
                transitionDuration: '250ms',
                opacity: 0,
              });

              // Finally remove the span after the transition
              setTimeout(() => {
                const { parentNode } = container;

                if (parentNode) {
                  parentNode.removeChild(container);
                }
              }, 500);
            });
          });
        });
      }
    },
    [onPressOut, rippleEffectEnabled]
  );

  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });

  const disabled = disabledProp || !hasPassedTouchHandler;

  return (
    <Pressable
      {...rest}
      ref={ref}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={(state) => [
        styles.touchable,
        // focused state is not ready yet: https://github.com/necolas/react-native-web/issues/1849
        // state.focused && { backgroundColor: ___ },
        state.hovered && { backgroundColor: hoverColor },
        disabled && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      {(state) => (
        <>
          {/* Before the children, not after. It hit-tests, so as the last
              sibling it covers anything interactive inside the touchable and
              takes its presses, e.g. a pressable List.Item with a control in
              `right`. Ahead of them it still covers the area outside the
              touchable, where there is nothing else to hit.
              Nothing that cannot be pressed gets a target, same as native. */}
          {!disabled && (
            <View
              aria-hidden
              style={getTouchTargetStyle(hitSlop)}
              testID="touchable-ripple-touch-target"
            />
          )}
          {React.Children.only(
            typeof children === 'function' ? children(state) : children
          )}
        </>
      )}
    </Pressable>
  );
};

/**
 * Whether ripple effect is supported.
 */
TouchableRipple.supported = true;

const styles = StyleSheet.create({
  touchable: {
    position: 'relative',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: '150ms background-color',
    }),
  },
  disabled: {
    ...(Platform.OS === 'web' && {
      cursor: 'auto',
    }),
  },
  noTouchTarget: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  touchTarget: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    // max(minInteractiveSize, 100%), same as MD3 web's .touch
    width: '100%',
    height: '100%',
    minWidth: minInteractiveSize,
    minHeight: minInteractiveSize,
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
  },
});

export default TouchableRipple;
