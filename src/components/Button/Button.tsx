import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  Role,
  StyleProp,
  TextStyle,
  ViewProps,
  ViewStyle,
} from 'react-native';

import Reanimated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {
  getButtonColors,
  getButtonPressedRadius,
  getButtonRippleColor,
  getButtonShapeRadius,
  getButtonSizeStyle,
  getButtonTransitionDuration,
  getEffectiveButtonShape,
} from './utils';
import type { ButtonMode, ButtonShape, ButtonSize } from './utils';
import { getDefaultDirection, useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import type { ThemeProp } from '../../types';
import hasTouchHandler from '../../utils/hasTouchHandler';
import ActivityIndicator from '../ActivityIndicator';
import Icon from '../Icon';
import type { IconSource } from '../Icon';
import Surface from '../Surface';
import type { SurfaceStyle } from '../Surface';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

// Elevation levels (MD3) used by the `elevated` mode: level 1 at rest,
// level 2 while pressed.
const initialElevation = 1;
const activeElevation = 2;
// Minimum accessible touch target (dp). Extra-small/small buttons are shorter
// than this and get expanded via hitSlop.
const MIN_TOUCH_TARGET = 48;

export type Props = Omit<ViewProps, 'style'> & {
  /**
   * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis. Defaults to `filled`.
   * - `filled` - button with a background color, used for the most important action, has the most visual impact and high emphasis. (default)
   * - `tonal` - button with a secondary background color, an alternative middle ground between filled and outlined buttons.
   * - `elevated` - button with a background color and elevation, used when absolutely necessary e.g. button requires visual separation from a patterned background.
   * - `outlined` - button with an outline without background, typically used for important, but not primary action – represents medium emphasis.
   * - `text` - flat button without background or outline, used for the lowest priority actions, especially when presenting multiple options.
   */
  mode?: 'text' | 'outlined' | 'filled' | 'elevated' | 'tonal';
  /**
   * Whether the color is a dark color. A dark button will render light text and vice-versa. Only applicable for the `filled`, `tonal` and `elevated` modes.
   */
  dark?: boolean;
  /**
   * Size of the button (Material Design 3 expressive). Defaults to `small`.
   *
   * The size controls the minimum height, horizontal padding, icon size, the
   * gap between icon and label, and the label typescale.
   */
  size?: ButtonSize;
  /**
   * Shape variant of the button (Material Design 3 expressive). Defaults to
   * `round`. `'round'` uses the full-pill corner radius; `'square'` uses a
   * smaller per-size corner radius.
   */
  shape?: ButtonShape;
  /**
   * Whether the container animates its corner radius. Defaults to `true`.
   *
   * When `true` the corner springs to the pressed shape while the button is
   * pressed, and animates between the two shapes as `selected` changes. When
   * `false` the shape still changes, it just snaps instead of animating, and
   * there is no press morph at all.
   *
   * The press morph is skipped when the OS reduce-motion setting is on.
   */
  animateShape?: boolean;
  /**
   * Turns the button into a Material Design 3 expressive toggle and sets its
   * state. Leave it **undefined** for a plain button — a toggle that is merely
   * unselected is a different state, and MD3 gives the two different colours.
   *
   * When defined:
   *
   * - The button takes its container and label colours from the toggle set for
   *   its `mode`, which differ between `false` and `true`. `text` is the one
   *   exception: MD3 defines no text toggle, so it keeps its plain colours.
   * - When `true` the `shape` is flipped: `'round'` renders square and vice
   *   versa, and an `outlined` button drops its outline.
   * - `aria-selected` is set so screen readers announce the toggle state.
   */
  selected?: boolean;
  /**
   * Custom button's background color.
   */
  buttonColor?: ColorValue;
  /**
   * Custom button's text color.
   */
  textColor?: ColorValue;
  /**
   * Whether to show a loading indicator.
   */
  loading?: boolean;
  /**
   * Icon to display for the `Button`.
   */
  icon?: IconSource;
  /**
   * Position of the `icon` relative to the label. Defaults to `'leading'`.
   */
  iconPosition?: 'leading' | 'trailing';
  /**
   * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * Label text of the button.
   */
  children: React.ReactNode;
  /**
   * Type of background drawabale to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Color of the ripple effect / state layer. Defaults to the label color at
   * the pressed-state opacity.
   */
  rippleColor?: ColorValue;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  'aria-label'?: string;
  /**
   * Accessibility hint for the button. This is read by the screen reader when the user taps the button.
   */
  accessibilityHint?: string;
  /**
   * Accessibility role for the button. The "button" role is set by default.
   */
  role?: Role;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute as soon as the touchable element is pressed and invoked even before onPress.
   */
  onPressIn?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute as soon as the touch is released even before onPress.
   */
  onPressOut?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: (e: GestureResponderEvent) => void;
  /**
   * The number of milliseconds a user must touch the element before executing `onLongPress`.
   */
  delayLongPress?: number;
  /**
   * Style of button's inner content.
   * Use this prop to apply custom height and width or to set a custom padding.
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Specifies the largest possible scale a text font can reach.
   */
  maxFontSizeMultiplier?: number;
  /**
   * Sets additional distance outside of element in which a press can be detected.
   */
  hitSlop?: TouchableRippleProps['hitSlop'];
  style?: StyleProp<SurfaceStyle>;
  /**
   * Style for the button text.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * Reference for the touchable
   */
  touchableRef?: React.RefObject<View>;
  ref?: React.Ref<View>;
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

/**
 * A button is component that the user can press to trigger an action.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Button } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Button icon="camera" mode="filled" onPress={() => console.log('Pressed')}>
 *     Press me
 *   </Button>
 * );
 *
 * export default MyComponent;
 * ```
 */
const Button = ({
  disabled,
  mode = 'filled',
  size = 'small',
  shape = 'round',
  animateShape: animateShapeProp = true,
  selected,
  dark,
  loading,
  icon,
  iconPosition,
  buttonColor: customButtonColor,
  textColor: customLabelColor,
  children,
  'aria-label': ariaLabel,
  accessibilityHint,
  role = 'button',
  hitSlop,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  delayLongPress,
  style,
  theme: themeOverrides,
  contentStyle,
  labelStyle,
  testID = 'button',
  accessible,
  background,
  rippleColor: customRippleColor,
  maxFontSizeMultiplier,
  touchableRef,
  ref,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { direction } = useLocale();
  const isMode = (modeToCompare: ButtonMode) => mode === modeToCompare;

  const requestedTrailingIcon = iconPosition === 'trailing';
  const shouldFlipForRTL = direction !== getDefaultDirection();
  const isTrailingIcon = shouldFlipForRTL
    ? !requestedTrailingIcon
    : requestedTrailingIcon;

  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onPressIn,
    onPressOut,
    onLongPress,
  });

  const reduceMotion = useReduceMotion();
  const reanimatedReduceMotion = reduceMotion
    ? ReduceMotion.Always
    : ReduceMotion.Never;

  const isElevationEntitled = !disabled && isMode('elevated');

  // Level 1 at rest, level 2 while pressed. `Surface` animates the change, so
  // a `disabled` / `mode` change moves the shadow on the next render too.
  const [pressed, setPressed] = React.useState(false);
  const elevation = isElevationEntitled
    ? pressed
      ? activeElevation
      : initialElevation
    : 0;

  // When the button is `selected`, flip the requested shape so the
  // unselected/selected pair contrasts visually (round ↔ square).
  const effectiveShape = getEffectiveButtonShape(shape, selected);
  const sizeStyle = React.useMemo(() => getButtonSizeStyle(size), [size]);

  // Shape morph: animate the corner on press (→ the pressed shape token) and on
  // the `selected`/shape toggle.
  const animateShape = animateShapeProp;
  // A press morph under reduce-motion would pop instantly rather than animate,
  // so skip it; a `selected` change still snaps to the new shape.
  const morphOnPress = animateShape && !reduceMotion;
  // `round` resolves to the `cornerFull` sentinel, so use the real pill radius
  // (half the container height) instead: it keeps the spring bounded and lets
  // the ripple clip match the container exactly.
  const restingRadius =
    effectiveShape === 'round'
      ? sizeStyle.minHeight / 2
      : getButtonShapeRadius({ size, shape, theme, selected });
  const pressedRadius = getButtonPressedRadius({ size, theme });
  const animatedRadius = useSharedValue(restingRadius);
  const restingRadiusRef = React.useRef(restingRadius);
  const isRadiusMountedRef = React.useRef(false);

  // The morph stays imperative: a press can interrupt it mid-flight, which a
  // duration-based transition can't express.
  const radiusSpringConfig = React.useMemo(
    () => ({
      ...toRawSpring(theme.motion.spring.fast.spatial),
      reduceMotion: reanimatedReduceMotion,
    }),
    [theme.motion.spring.fast.spatial, reanimatedReduceMotion]
  );

  const springRadiusTo = React.useCallback(
    (toValue: number) => {
      animatedRadius.value = withSpring(toValue, radiusSpringConfig);
    },
    [animatedRadius, radiusSpringConfig]
  );

  const handlePressIn = React.useCallback(
    (e: GestureResponderEvent) => {
      onPressIn?.(e);
      if (morphOnPress) {
        springRadiusTo(pressedRadius);
      }
      if (isElevationEntitled) {
        setPressed(true);
      }
    },
    [
      onPressIn,
      morphOnPress,
      springRadiusTo,
      pressedRadius,
      isElevationEntitled,
    ]
  );

  const handlePressOut = React.useCallback(
    (e: GestureResponderEvent) => {
      onPressOut?.(e);
      if (morphOnPress) {
        springRadiusTo(restingRadiusRef.current);
      }
      if (isElevationEntitled) {
        setPressed(false);
      }
    },
    [onPressOut, morphOnPress, springRadiusTo, isElevationEntitled]
  );

  // Snap on mount; animate when a toggle/shape change moves the resting radius.
  React.useEffect(() => {
    restingRadiusRef.current = restingRadius;
    if (!isRadiusMountedRef.current) {
      isRadiusMountedRef.current = true;
      return;
    }
    if (animateShape) {
      springRadiusTo(restingRadius);
    } else {
      animatedRadius.value = restingRadius;
    }
  }, [restingRadius, animateShape, animatedRadius, springRadiusTo]);

  const {
    backgroundColor,
    borderColor,
    labelColor,
    labelOpacity,
    borderWidth,
    backgroundOpacity,
  } = React.useMemo(
    () =>
      getButtonColors({
        customButtonColor,
        customLabelColor,
        theme,
        mode,
        size,
        disabled,
        dark,
        selected,
      }),
    [
      customButtonColor,
      customLabelColor,
      theme,
      mode,
      size,
      disabled,
      dark,
      selected,
    ]
  );

  const rippleColor = React.useMemo(
    () => getButtonRippleColor({ labelColor, customRippleColor }),
    [labelColor, customRippleColor]
  );

  const containerColor =
    backgroundOpacity < 1 ? 'transparent' : backgroundColor;

  // Snap rather than cross-fade when a transparent container is involved — see
  // `getButtonTransitionDuration`.
  const previousContainerColorRef = React.useRef(containerColor);
  React.useEffect(() => {
    previousContainerColorRef.current = containerColor;
  }, [containerColor]);

  const surfaceTransitionDuration = getButtonTransitionDuration({
    theme,
    pressed,
    containerColor,
    previousContainerColor: previousContainerColorRef.current,
  });

  // The clip carries the same animated radius as the `Surface`, so the ripple
  // and the disabled overlay follow the morph.
  //
  // TODO: revisit the focus ring's placement once #5084 lands.
  // https://github.com/callstack/react-native-paper/pull/5084 adds MD3 keyboard
  // focus indicators to every `TouchableRipple` consumer, so Button gets one
  // with no code here. Deliberately not implemented locally: a second ring here
  // would double up with it. The catch is placement — that PR defaults to
  // `focusRing="outward"` and warns an outward ring is trimmed by "any clipping
  // ancestor sized to its content", which is exactly this view. Button will
  // likely need `focusRing="inward"`, or the ring on the outer view.
  const clipStyle = useAnimatedStyle(
    () => ({ borderRadius: animatedRadius.value }),
    [animatedRadius]
  );

  const outlineStyle = React.useMemo(
    () => ({ backgroundColor: containerColor, borderColor, borderWidth }),
    [containerColor, borderColor, borderWidth]
  );

  const { color: labelStyleColor } = React.useMemo(
    () => StyleSheet.flatten(labelStyle) || {},
    [labelStyle]
  );

  // Extra-small/small buttons are shorter than the 48dp minimum accessible
  // touch target, so expand the press area with hitSlop without changing the
  // visual size. A user-supplied `hitSlop` wins on the axes it sets.
  const hitSlopWithMinTarget = React.useMemo(() => {
    const verticalSlop = Math.max(
      0,
      (MIN_TOUCH_TARGET - sizeStyle.minHeight) / 2
    );
    if (verticalSlop === 0) {
      return hitSlop;
    }
    if (hitSlop == null) {
      return { top: verticalSlop, bottom: verticalSlop };
    }
    // A numeric hitSlop is an explicit uniform override — respect it as-is.
    if (typeof hitSlop === 'number') {
      return hitSlop;
    }
    return {
      ...hitSlop,
      top: hitSlop.top ?? verticalSlop,
      bottom: hitSlop.bottom ?? verticalSlop,
    };
  }, [hitSlop, sizeStyle]);

  const contentBoxStyle = React.useMemo(
    () => ({
      minHeight: sizeStyle.minHeight - borderWidth * 2,
      paddingStart: sizeStyle.paddingStart - borderWidth,
      paddingEnd: sizeStyle.paddingEnd - borderWidth,
      gap: sizeStyle.iconGap,
    }),
    [sizeStyle, borderWidth]
  );

  const labelTypeStyle = React.useMemo(
    () => ({
      color: labelColor,
      ...theme.fonts[sizeStyle.labelVariant],
    }),
    [labelColor, theme, sizeStyle]
  );

  return (
    <Surface
      {...rest}
      ref={ref}
      testID={`${testID}-container-outer-layer`}
      backgroundColor={containerColor}
      borderRadius={animatedRadius}
      elevation={elevation}
      transitionDuration={surfaceTransitionDuration}
      style={[styles.button, style]}
    >
      <Reanimated.View
        testID={`${testID}-container`}
        style={[styles.clip, outlineStyle, clipStyle]}
      >
        {backgroundOpacity < 1 && (
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor, opacity: backgroundOpacity },
            ]}
          />
        )}
        <TouchableRipple
          borderless
          background={background}
          rippleColor={rippleColor}
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={hasPassedTouchHandler ? handlePressIn : undefined}
          onPressOut={hasPassedTouchHandler ? handlePressOut : undefined}
          delayLongPress={delayLongPress}
          aria-label={ariaLabel}
          accessibilityHint={accessibilityHint}
          role={role}
          aria-disabled={disabled}
          aria-selected={selected}
          accessible={accessible}
          hitSlop={hitSlopWithMinTarget}
          disabled={disabled}
          testID={testID}
          theme={theme}
          ref={touchableRef}
        >
          <View
            testID={`${testID}-content`}
            style={[
              styles.content,
              isTrailingIcon && styles.contentReverse,
              contentBoxStyle,
              { opacity: labelOpacity },
              contentStyle,
            ]}
          >
            {icon && loading !== true ? (
              <View testID={`${testID}-icon-container`}>
                <Icon
                  source={icon}
                  size={sizeStyle.iconSize}
                  color={
                    typeof labelStyleColor === 'string'
                      ? labelStyleColor
                      : labelColor
                  }
                />
              </View>
            ) : null}
            {loading ? (
              <ActivityIndicator
                size={sizeStyle.iconSize}
                color={
                  typeof labelStyleColor === 'string'
                    ? labelStyleColor
                    : labelColor
                }
              />
            ) : null}
            <Text
              variant={sizeStyle.labelVariant}
              selectable={false}
              numberOfLines={1}
              testID={`${testID}-text`}
              style={[styles.label, labelTypeStyle, labelStyle]}
              maxFontSizeMultiplier={maxFontSizeMultiplier}
            >
              {children}
            </Text>
          </View>
        </TouchableRipple>
      </Reanimated.View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 64,
  },
  clip: {
    borderStyle: 'solid',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentReverse: {
    flexDirection: 'row-reverse',
  },
  label: {
    textAlign: 'center',
  },
});

export default Button;
