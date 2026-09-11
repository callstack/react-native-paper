import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  ViewStyle,
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';

import Content from './Content';
import {
  Tokens,
  FOCUS_RING_INSET,
  FOCUS_RING_THICKNESS,
  webNoOutline,
} from './tokens';
import type { Size, Variant } from './tokens';
import { useFocusRing } from './useFocusRing';
import { getDimensions, resolveColors } from './utils';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import type { ThemeProp } from '../../theme/types';
import type { ShapeToken } from '../../theme/utils/shape';
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
  ref?: React.Ref<View>;
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
  'aria-label': ariaLabel = label,
  'aria-checked': ariaChecked,
  'aria-selected': ariaSelected,
  'aria-busy': ariaBusy,
  'aria-expanded': ariaExpanded,
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
  const touchableRef = React.useRef<View>(null);
  const previousFocusedElement = React.useRef<HTMLElement | null>(null);

  const resolvedElevation =
    visible && onPress
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

    scale.value = withSpring(
      target,
      toRawSpring(theme.motion.spring.fast.spatial)
    );

    alpha.value = withSpring(
      target,
      toRawSpring(theme.motion.spring.fast.effects)
    );
  }, [visible, theme, reduceMotion, scale, alpha]);

  // Fallback shared values track the static size-driven dimensions. Consumers
  // that don't supply their own animated shared values get these. Keeping
  // everything as a shared value means there's exactly one animated style
  // per view — no static-vs-animated merge surprises.
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

  const { focusedSV, onFocus, onBlur } = useFocusRing();

  React.useEffect(() => {
    if (!visible) {
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const target: unknown = touchableRef.current;
        if (
          target instanceof HTMLElement &&
          target === document.activeElement
        ) {
          if (previousFocusedElement.current?.isConnected) {
            previousFocusedElement.current.focus({ preventScroll: true });
          }
          // The previous element may have been removed or become unfocusable.
          if (target === document.activeElement) target.blur();
        }
      }
      setHovered(false);
      setPressed(false);
      onBlur();
    }
  }, [visible, onBlur]);

  React.useEffect(() => {
    if (!onPress) {
      setHovered(false);
      setPressed(false);
    }
  }, [onPress]);

  const focusRingStyle = useAnimatedStyle(
    () => ({
      opacity: focusedSV.value ? 1 : 0,
      borderRadius: borderRadius.value + FOCUS_RING_INSET,
    }),
    [borderRadius]
  );

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
      <Animated.View style={[styles.clip, clipStyle]}>
        {overlay}
        <TouchableRipple
          ref={Platform.OS === 'web' ? touchableRef : undefined}
          borderless
          background={background}
          onPress={visible ? onPress : undefined}
          disabled={!onPress}
          accessible={visible}
          focusable={visible && !!onPress}
          tabIndex={visible ? undefined : -1}
          onHoverIn={() => setHovered(true)}
          onHoverOut={() => setHovered(false)}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onFocus={(event) => {
            if (Platform.OS === 'web') {
              const previous =
                'relatedTarget' in event.nativeEvent
                  ? event.nativeEvent.relatedTarget
                  : null;
              previousFocusedElement.current =
                previous instanceof HTMLElement ? previous : null;
            }
            onFocus();
          }}
          onBlur={onBlur}
          aria-label={ariaLabel}
          role="button"
          aria-checked={ariaChecked}
          aria-selected={ariaSelected}
          aria-busy={ariaBusy}
          aria-expanded={ariaExpanded}
          testID={testID}
          style={[
            children ? styles.fill : null,
            Platform.OS === 'web' ? webNoOutline : null,
          ]}
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
      <Animated.View
        style={[
          styles.focusRing,
          { borderColor: theme.colors.secondary },
          focusRingStyle,
        ]}
      />
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
  focusRing: {
    position: 'absolute',
    top: -FOCUS_RING_INSET,
    left: -FOCUS_RING_INSET,
    right: -FOCUS_RING_INSET,
    bottom: -FOCUS_RING_INSET,
    borderWidth: FOCUS_RING_THICKNESS,
    pointerEvents: 'none',
  },
});

export default Shell;
