import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  NativeSyntheticEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  TargetedEvent,
  ViewStyle,
} from 'react-native';

import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';

import Content from './Content';
import { Tokens } from './tokens';
import type { Size, Variant } from './tokens';
import { getDimensions, resolveColors } from './utils';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import type { ThemeProp } from '../../theme/types';
import type { ShapeToken } from '../../theme/utils/shape';
import hasTouchHandler from '../../utils/hasTouchHandler';
import { useFocusRing } from '../../utils/useFocusRing';
import type { IconSource } from '../Icon';
import Surface from '../Surface';
import TouchableRipple from '../TouchableRipple/TouchableRipple';

export type ShellProps = {
  /**
   * Icon rendered inside the FAB when no custom `children` are provided.
   */
  icon?: IconSource;
  /**
   * Label rendered next to the icon when no custom `children` are provided.
   * When present, the FAB grows to fit.
   */
  label?: string;
  /**
   * Role-color preset. Defaults to `primaryContainer`.
   */
  variant?: Variant;
  /**
   * Spec size. Defaults to `default`.
   */
  size?: Size;
  /**
   * Container color override. Wins over `variant`.
   */
  containerColor?: ColorValue;
  /**
   * Content color override. Wins over `variant`.
   */
  contentColor?: ColorValue;
  /**
   * Shape override. Defaults to the size-driven shape token.
   */
  shape?: ShapeToken;
  /**
   * Icon size override.
   */
  iconSize?: number;
  /**
   * Leading-padding override.
   */
  leading?: number;
  /**
   * Trailing-padding override.
   */
  trailing?: number;
  /**
   * When `false`, the shell animates out (scale + alpha) and stops accepting
   * touches.
   */
  visible?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute as soon as the touch is released.
   */
  onPressOut?: (e: GestureResponderEvent) => void;
  /**
   * The number of milliseconds a user must touch the element before executing `onLongPress`.
   */
  delayLongPress?: number;
  /**
   * Function to execute when the element receives focus.
   */
  onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  /**
   * Function to execute when the element loses focus.
   */
  onBlur?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  /**
   * Whether the shell can't be pressed. Turns a control off without removing
   * `onPress`, which would render another element and remount the content.
   */
  disabled?: boolean;
  /**
   * Accessibility label. Falls back to `label` if unset.
   */
  'aria-label'?: string;
  /**
   * Indicates whether the element is checked. Accepts `true`, `false`,
   * or `'mixed'` for an indeterminate state.
   */
  'aria-checked'?: boolean | 'mixed';
  /**
   * Indicates whether the element is selected.
   */
  'aria-selected'?: boolean;
  /**
   * Indicates whether the element is currently busy (e.g. loading).
   */
  'aria-busy'?: boolean;
  /**
   * Indicates whether the element's controlled content is expanded.
   */
  'aria-expanded'?: boolean;
  /**
   * Id of the element that describes this one, e.g. a tooltip.
   */
  'aria-describedby'?: string;
  /**
   * Largest scale the label font can reach (auto-built content only).
   */
  labelMaxFontSizeMultiplier?: number;
  /**
   * Animated style merged onto the label wrapper. Used by the Extended FAB
   * to fade the label in and out as the FAB expands and collapses.
   */
  labelAnimatedStyle?: StyleProp<AnimatedStyle<ViewStyle>>;
  /**
   * Type of background drawable to display the feedback (Android).
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Shared value driving the outer's animated width. When omitted, the
   * outer is sized by its content (icon FAB) or the size token
   * (`dimensions.width`).
   */
  widthShared?: SharedValue<number>;
  /**
   * Shared value driving the outer's animated height. When omitted, the
   * outer is sized by its content.
   */
  heightShared?: SharedValue<number>;
  /**
   * Shared value driving the outer's animated borderRadius. The same value
   * is applied to the inner clip so children are clipped to the same shape.
   * When omitted, the static size-driven radius is used.
   */
  borderRadiusShared?: SharedValue<number>;
  /**
   * When `true`, both outer and clip render with `backgroundColor: transparent`
   * so the consumer can paint the surface via the `overlay` slot (used by the
   * morph trigger's cross-faded color planes).
   */
  transparentBackground?: boolean;
  /**
   * Absolutely-positioned content rendered inside the shell, behind the icon
   * and label row. Used by the morphing trigger to cross-fade color planes.
   */
  overlay?: React.ReactNode;
  /**
   * Replaces the default icon + label content. Pass your own `<Content />`
   * when you need custom typescale, label animation, or measurement.
   */
  children?: React.ReactNode;
  /**
   * Outer-positioning style. Visual treatment (size, shape, color) comes from
   * `variant` and `size`.
   */
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
  /**
   * TestID used for testing purposes.
   */
  testID?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
  ref?: React.Ref<React.ComponentRef<typeof View>>;
};

/**
 * Internal shell used by every FAB-flavored component (regular, Extended,
 * morphing menu trigger). Owns the outer container, ripple, clip, and the
 * visibility animation (scale + alpha). Consumers that need to
 * animate the outer's width/height/borderRadius pass shared values; the
 * static size-driven defaults are used otherwise.
 *
 * Not exported from the package.
 */
const Shell = ({
  icon,
  label,
  variant = 'primaryContainer',
  size = 'default',
  containerColor,
  contentColor,
  shape,
  iconSize,
  leading,
  trailing,
  visible = true,
  onPress,
  onLongPress,
  onPressOut,
  delayLongPress,
  onFocus,
  onBlur,
  disabled,
  'aria-label': ariaLabel = label,
  'aria-checked': ariaChecked,
  'aria-selected': ariaSelected,
  'aria-busy': ariaBusy,
  'aria-expanded': ariaExpanded,
  'aria-describedby': ariaDescribedBy,
  labelMaxFontSizeMultiplier,
  labelAnimatedStyle,
  background,
  widthShared,
  heightShared,
  borderRadiusShared,
  transparentBackground = false,
  overlay,
  children,
  style,
  testID,
  theme: themeOverrides,
  ref,
}: ShellProps) => {
  const theme = useInternalTheme(themeOverrides);
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const touchableRef = React.useRef<React.ComponentRef<typeof View>>(null);
  const previousFocusedElement = React.useRef<HTMLElement | null>(null);
  const hoveredRef = React.useRef(false);
  const pressingRef = React.useRef(false);

  const hasHandler = hasTouchHandler({ onPress, onLongPress, onPressOut });

  const resolvedElevation =
    visible && hasHandler
      ? pressed
        ? Tokens.stateElevation.pressed
        : hovered
          ? Tokens.stateElevation.hover
          : Tokens.stateElevation.enabled
      : Tokens.stateElevation.enabled;

  const dimensions = React.useMemo(
    () => getDimensions({ theme, size, shape, iconSize, leading, trailing }),
    [theme, size, shape, iconSize, leading, trailing]
  );

  const colors = React.useMemo(
    () => resolveColors({ theme, variant, containerColor, contentColor }),
    [theme, variant, containerColor, contentColor]
  );

  const reduceMotion = useReduceMotion();

  const scale = useSharedValue(visible ? 1 : 0);
  const alpha = useSharedValue(visible ? 1 : 0);

  React.useEffect(() => {
    const target = visible ? 1 : 0;

    if (reduceMotion) {
      scale.value = target;
      alpha.value = target;
      return;
    }

    scale.value = withSpring(target, {
      ...toRawSpring(theme.motion.spring.fast.spatial),
      reduceMotion: ReduceMotion.Never,
    });

    alpha.value = withSpring(target, {
      ...toRawSpring(theme.motion.spring.fast.effects),
      reduceMotion: ReduceMotion.Never,
    });
  }, [visible, theme, reduceMotion, scale, alpha]);

  // Fallback shared values track the static size-driven dimensions. Consumers
  // that don't supply their own animated shared values get these. Keeping
  // everything as a shared value means there's exactly one animated style
  // per view: no static-vs-animated merge surprises.
  const fallbackWidth = useSharedValue(dimensions.width);
  const fallbackHeight = useSharedValue(dimensions.height);
  const fallbackBorderRadius = useSharedValue(dimensions.borderRadius);

  React.useEffect(() => {
    fallbackWidth.value = dimensions.width;
    fallbackHeight.value = dimensions.height;
    fallbackBorderRadius.value = dimensions.borderRadius;
  }, [
    dimensions.width,
    dimensions.height,
    dimensions.borderRadius,
    fallbackWidth,
    fallbackHeight,
    fallbackBorderRadius,
  ]);

  const width = widthShared ?? fallbackWidth;
  const height = heightShared ?? fallbackHeight;
  const borderRadius = borderRadiusShared ?? fallbackBorderRadius;
  const containerBg = transparentBackground ? 'transparent' : colors.container;

  const outerStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
      opacity: alpha.value,
      width: width.value,
      height: height.value,
    }),
    [width, height]
  );

  const clipStyle = useAnimatedStyle(
    () => ({
      borderRadius: borderRadius.value,
      backgroundColor: containerBg,
    }),
    [borderRadius, containerBg]
  );

  // `scope: 'within'`: the ring is drawn on the clip view below, not the
  // inner `TouchableRipple` that actually receives focus. On web the shared
  // stylesheet hides the browser's own outline there, so only the clip view's
  // ring shows, or only the outline in a browser without `:has()`.
  //
  // Off when `disabled` or without a touch handler: the inner TouchableRipple
  // is then a plain View, and a focused one unmounts without a blur reaching
  // the hook. The public FAB has no `disabled`, so dropping the handlers is how
  // an app turns it off. Also off while hidden, which clears the focus state on
  // native when the FAB hides while focused.
  const { target: focusTarget, ring: focusRing } = useFocusRing(
    disabled || !hasHandler || !visible,
    theme.colors.secondary,
    'outward',
    'within'
  );

  React.useEffect(() => {
    if (!visible) {
      if (Platform.OS === 'web') {
        const target: unknown = touchableRef.current;
        if (
          target instanceof HTMLElement &&
          target === document.activeElement
        ) {
          const previous = previousFocusedElement.current;
          // Only restore keyboard focus. A mouse click or tap also focuses the
          // FAB, and moving focus back could jump into an earlier text field.
          if (
            target.matches(':focus-visible') &&
            previous?.isConnected &&
            !previous.closest('[aria-hidden="true"], [inert]')
          ) {
            previous.focus({ preventScroll: true });
          }
          // Blur when focus didn't move back, e.g. after a mouse click or when
          // the previous element is gone or can't take focus.
          if (target === document.activeElement) target.blur();
        }
      }
      hoveredRef.current = false;
      pressingRef.current = false;
      setHovered(false);
      setPressed(false);
    }
  }, [visible]);

  React.useEffect(() => {
    if (!hasHandler) {
      hoveredRef.current = false;
      pressingRef.current = false;
      setHovered(false);
      setPressed(false);
    }
  }, [hasHandler]);

  // The pressed elevation matches the resting one, so a press only shows on a
  // hovered FAB, and `pressed` is set only then. iOS and Android send no hover
  // events by default, so a tap there doesn't re-render the FAB itself. The
  // refs hold the pointer state between events: a quick click on web runs both
  // press handlers before a render, and a press can start before the hover.
  const handleHoverIn = () => {
    hoveredRef.current = true;
    setHovered(true);
    if (pressingRef.current) setPressed(true);
  };

  const handleHoverOut = () => {
    hoveredRef.current = false;
    setHovered(false);
    setPressed(false);
  };

  const handlePressIn = () => {
    pressingRef.current = true;
    if (hoveredRef.current) setPressed(true);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    pressingRef.current = false;
    if (hoveredRef.current) setPressed(false);
    onPressOut?.(event);
  };

  // Without a handler the touchable drops the button role, and on web that
  // renders role="presentation", which can't carry a name. A labelled
  // icon-only FAB that does nothing is an image there, named by its label.
  const isWebImage =
    Platform.OS === 'web' &&
    !hasHandler &&
    !disabled &&
    label === undefined &&
    children === undefined &&
    ariaLabel !== undefined &&
    ariaChecked === undefined;

  return (
    <Surface
      ref={ref}
      aria-hidden={visible ? undefined : true}
      backgroundColor={containerBg}
      borderRadius={borderRadius}
      style={[
        style,
        styles.container,
        outerStyle,
        visible ? styles.pointerEventsAuto : styles.pointerEventsNone,
      ]}
      elevation={resolvedElevation}
      theme={theme}
    >
      <Animated.View
        style={[styles.clip, clipStyle, ...focusRing.style]}
        {...focusRing.dataSetProps}
      >
        {overlay}
        <TouchableRipple
          ref={Platform.OS === 'web' ? touchableRef : undefined}
          borderless
          background={background}
          focusRing="none"
          onPress={visible ? onPress : undefined}
          onLongPress={visible ? onLongPress : undefined}
          delayLongPress={delayLongPress}
          disabled={disabled}
          accessible={visible ? undefined : false}
          focusable={visible ? undefined : false}
          tabIndex={visible ? undefined : -1}
          // Only with a touch handler: a FAB without one is a plain View that
          // takes no focus, and the press handlers alone would make it a
          // control. They also keep a hidden FAB's touchable mounted without
          // `onPress` or `onLongPress`, so the effect above still finds the
          // focused element.
          onHoverIn={hasHandler ? handleHoverIn : undefined}
          onHoverOut={hasHandler ? handleHoverOut : undefined}
          onPressIn={hasHandler ? handlePressIn : undefined}
          onPressOut={hasHandler ? handlePressOut : undefined}
          onFocus={
            hasHandler
              ? (event) => {
                  if (Platform.OS === 'web') {
                    const previous =
                      'relatedTarget' in event.nativeEvent
                        ? event.nativeEvent.relatedTarget
                        : null;
                    previousFocusedElement.current =
                      previous instanceof HTMLElement ? previous : null;
                  }
                  focusTarget.onFocus?.(event);
                  onFocus?.(event);
                }
              : undefined
          }
          onBlur={
            onBlur
              ? (event) => {
                  focusTarget.onBlur?.();
                  onBlur(event);
                }
              : focusTarget.onBlur
          }
          aria-label={ariaLabel}
          role={isWebImage ? 'img' : 'button'}
          aria-checked={ariaChecked}
          aria-selected={ariaSelected}
          aria-busy={ariaBusy}
          aria-expanded={ariaExpanded}
          aria-describedby={ariaDescribedBy}
          testID={testID}
          style={[children ? styles.fill : null, ...focusTarget.style]}
        >
          {children ?? (
            <Content
              icon={icon}
              label={label}
              contentColor={colors.content}
              height={dimensions.height}
              iconSize={dimensions.iconSize}
              leading={dimensions.leading}
              trailing={dimensions.trailing}
              iconLabelGap={dimensions.iconLabelGap}
              labelTypescale={dimensions.labelTypescale}
              labelMaxFontSizeMultiplier={labelMaxFontSizeMultiplier}
              labelAnimatedStyle={labelAnimatedStyle}
              labelNumberOfLines={labelAnimatedStyle ? 1 : undefined}
              labelEllipsisMode={labelAnimatedStyle ? 'clip' : undefined}
            />
          )}
        </TouchableRipple>
      </Animated.View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    transformOrigin: 'center',
  },
  clip: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
  },
  pointerEventsAuto: {
    pointerEvents: 'auto',
  },
  pointerEventsNone: {
    pointerEvents: 'none',
  },
});

export default Shell;
