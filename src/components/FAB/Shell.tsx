import * as React from 'react';
import {
  AccessibilityState,
  ColorValue,
  GestureResponderEvent,
  Platform,
  PressableAndroidRippleConfig,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import Reanimated, {
  AnimatedStyle,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

import Content from './Content';
import {
  Size,
  Tokens,
  Variant,
  FOCUS_RING_INSET,
  FOCUS_RING_THICKNESS,
  webNoOutline,
} from './tokens';
import { useFocusRing } from './useFocusRing';
import { useVisibility } from './useVisibility';
import { getDimensions, resolveColors } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ShapeToken } from '../../theme/utils/shape';
import type { Elevation, ThemeProp } from '../../types';
import { forwardRef } from '../../utils/forwardRef';
import type { IconSource } from '../Icon';
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
   * Role-color preset. Defaults to `tonalPrimary`.
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
   * Resting elevation level. Defaults to the FAB's enabled-state elevation.
   * Pass `0` to disable the shadow entirely.
   */
  elevation?: Elevation;
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
  accessibilityLabel?: string;
  /**
   * Accessibility state forwarded to the underlying button.
   */
  accessibilityState?: AccessibilityState;
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
  style?: StyleProp<ViewStyle>;
  /**
   * TestID used for testing purposes.
   */
  testID?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
  ref?: React.RefObject<View>;
};

/**
 * Internal shell used by every FAB-flavored component (regular, Extended,
 * morphing menu trigger). Owns the outer container, ripple, clip, and the
 * visibility animation (scale + alpha + shadow). Consumers that need to
 * animate the outer's width/height/borderRadius pass shared values; the
 * static size-driven defaults are used otherwise.
 *
 * Not exported from the package.
 */
const Shell = forwardRef<View, ShellProps>(
  (
    {
      icon,
      label,
      variant = 'tonalPrimary',
      size = 'default',
      containerColor,
      contentColor,
      shape,
      iconSize,
      leading,
      trailing,
      elevation = Tokens.stateElevation.enabled,
      visible = true,
      onPress,
      accessibilityLabel = label,
      accessibilityState,
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
      testID = 'fab-shell',
      theme: themeOverrides,
    },
    ref
  ) => {
    const theme = useInternalTheme(themeOverrides);

    const dimensions = React.useMemo(
      () => getDimensions({ theme, size, shape, iconSize, leading, trailing }),
      [theme, size, shape, iconSize, leading, trailing]
    );

    const colors = React.useMemo(
      () => resolveColors({ theme, variant, containerColor, contentColor }),
      [theme, variant, containerColor, contentColor]
    );

    const { scale, alpha, shadowStyle } = useVisibility({
      visible,
      theme,
      elevation,
    });

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
    const containerBg = transparentBackground
      ? 'transparent'
      : colors.container;

    const outerStyle = useAnimatedStyle(
      () => ({
        transform: [{ scale: scale.value }],
        opacity: alpha.value,
        width: width.value,
        height: height.value,
        borderRadius: borderRadius.value,
        backgroundColor: containerBg,
      }),
      [width, height, borderRadius, containerBg]
    );

    const clipStyle = useAnimatedStyle(
      () => ({
        borderRadius: borderRadius.value,
        backgroundColor: containerBg,
      }),
      [borderRadius, containerBg]
    );

    const { focusedSV, onFocus, onBlur } = useFocusRing();
    const focusRingStyle = useAnimatedStyle(
      () => ({
        opacity: focusedSV.value ? 1 : 0,
        borderRadius: borderRadius.value + FOCUS_RING_INSET,
      }),
      [borderRadius]
    );

    return (
      <Reanimated.View
        ref={ref}
        style={[
          style,
          styles.container,
          outerStyle,
          shadowStyle,
          visible ? styles.pointerEventsAuto : styles.pointerEventsNone,
        ]}
        testID={`${testID}-container`}
      >
        <Reanimated.View style={[styles.clip, clipStyle]}>
          {overlay}
          <TouchableRipple
            borderless
            background={background}
            onPress={onPress}
            onFocus={onFocus}
            onBlur={onBlur}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            accessibilityState={accessibilityState}
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
                testID={testID}
              />
            )}
          </TouchableRipple>
        </Reanimated.View>
        <Reanimated.View
          style={[
            styles.focusRing,
            { borderColor: theme.colors.secondary },
            focusRingStyle,
          ]}
        />
      </Reanimated.View>
    );
  }
);

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
