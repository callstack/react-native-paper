import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  NativeSyntheticEvent,
  StyleProp,
  TargetedEvent,
  ViewStyle,
} from 'react-native';

import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { CheckboxTokens } from './tokens';
import { getSelectionVisualState } from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { tokens } from '../../theme/tokens';
import type { $RemoveChildren, ThemeProp } from '../../types';
import { isKeyboardFocusEvent } from '../../utils/isKeyboardFocusEvent';
import TouchableRipple from '../TouchableRipple/TouchableRipple';

export type Props = $RemoveChildren<typeof TouchableRipple> & {
  /**
   * Status of checkbox.
   */
  status: 'checked' | 'unchecked' | 'indeterminate';
  /**
   * Whether checkbox is disabled.
   */
  disabled?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Custom color for unchecked checkbox.
   */
  uncheckedColor?: ColorValue;
  /**
   * Custom color for checkbox.
   */
  color?: ColorValue;
  /**
   * Whether the checkbox is in an error state. When true, the outline
   * (unchecked) and container (selected) use `theme.colors.error`.
   * `disabled` and explicit `color`/`uncheckedColor` overrides take
   * precedence.
   */
  error?: boolean;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * testID to be used on tests.
   */
  testID?: string;
  /**
   * Custom style to override the default tap target. Passed through to
   * the underlying `TouchableRipple`.
   */
  style?: StyleProp<ViewStyle>;
};

// Spec dimensions (https://m3.material.io/components/checkbox/specs).
const {
  containerSize: CONTAINER_SIZE,
  containerRadius: CONTAINER_RADIUS,
  outlineWidth: OUTLINE_WIDTH,
  stateLayerSize: STATE_LAYER_SIZE,
} = CheckboxTokens;

const FOCUS_THICKNESS = tokens.md.sys.state.focusIndicator.thickness;
// Focus indicator is a circular ring at the 40dp state-layer boundary.
// We don't apply `focusIndicator.outerOffset` here because the surrounding
// `TouchableRipple borderless` clips overflow to the tap-target shape,
// so a ring drawn outside the 40dp circle would be cropped.
const FOCUS_RING_SIZE = STATE_LAYER_SIZE;
const FOCUS_RING_RADIUS = STATE_LAYER_SIZE / 2;

/**
 * Checkboxes allow the selection of multiple options from a set.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Checkbox } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [checked, setChecked] = React.useState(false);
 *
 *   return (
 *     <Checkbox
 *       status={checked ? 'checked' : 'unchecked'}
 *       onPress={() => {
 *         setChecked(!checked);
 *       }}
 *     />
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const Checkbox = ({
  status,
  theme: themeOverrides,
  disabled,
  onPress,
  testID,
  error,
  color,
  uncheckedColor,
  style,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const reduceMotion = useReduceMotion();
  const { direction } = useLocale();
  // Web (react-native-web) doesn't auto-mirror layout, so flip the mask
  // anchor manually for RTL. Native handles it via `I18nManager`.
  const flipMaskForWebRTL = Platform.OS === 'web' && direction === 'rtl';
  const [focused, setFocused] = React.useState(false);

  const selected = status === 'checked' || status === 'indeterminate';

  const reanimatedReduceMotion = reduceMotion
    ? ReduceMotion.Always
    : ReduceMotion.Never;

  const fillTimingConfig = React.useMemo(
    () => ({
      duration: theme.motion.duration.short2,
      easing: Easing.bezier(...theme.motion.easing.standard),
      reduceMotion: reanimatedReduceMotion,
    }),
    [
      theme.motion.duration.short2,
      theme.motion.easing.standard,
      reanimatedReduceMotion,
    ]
  );
  const checkTimingConfig = React.useMemo(
    () => ({
      duration: theme.motion.duration.short3,
      easing: Easing.bezier(...theme.motion.easing.standard),
      reduceMotion: reanimatedReduceMotion,
    }),
    [
      theme.motion.duration.short3,
      theme.motion.easing.standard,
      reanimatedReduceMotion,
    ]
  );

  // 0 = unselected (outline only), 1 = selected (filled + drawn icon).
  const fillProgress = useSharedValue(selected ? 1 : 0);
  const checkProgress = useSharedValue(selected ? 1 : 0);
  const firstRender = React.useRef(true);

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const target = selected ? 1 : 0;
    fillProgress.value = withTiming(target, fillTimingConfig);
    checkProgress.value = withTiming(target, checkTimingConfig);
  }, [
    selected,
    fillProgress,
    checkProgress,
    fillTimingConfig,
    checkTimingConfig,
  ]);

  // Visual state (colors + opacity) for the static layers. `hovered` /
  // `pressed` aren't tracked here — `TouchableRipple` owns the press ripple
  // and hover overlay.
  const visual = getSelectionVisualState({
    theme,
    selected,
    disabled,
    error,
    customColor: color,
    customUncheckedColor: uncheckedColor,
  });

  // Outline fades out as fill fades in (and vice versa).
  const outlineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - fillProgress.value,
  }));

  const fillAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fillProgress.value,
  }));

  const maskAnimatedStyle = useAnimatedStyle(() => ({
    width: checkProgress.value * CONTAINER_SIZE,
    opacity: checkProgress.value,
  }));

  // Remember the last drawn glyph so the reveal-mask can finish collapsing
  // when `selected` flips back to false. Computed via the "derive state
  // during render" pattern (https://react.dev/reference/react/useState#storing-information-from-previous-renders)
  // so we don't mutate a ref during render.
  const [lastGlyph, setLastGlyph] = React.useState<'check' | 'indeterminate'>(
    status === 'indeterminate' ? 'indeterminate' : 'check'
  );
  const nextGlyph: 'check' | 'indeterminate' =
    status === 'checked'
      ? 'check'
      : status === 'indeterminate'
      ? 'indeterminate'
      : lastGlyph;
  if (nextGlyph !== lastGlyph) {
    setLastGlyph(nextGlyph);
  }
  const showIndeterminate = nextGlyph === 'indeterminate';

  const handleFocus = React.useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      if (disabled) return;
      if (!isKeyboardFocusEvent(e)) return;
      setFocused(true);
    },
    [disabled]
  );

  const handleBlur = React.useCallback(() => {
    setFocused(false);
  }, []);

  // When `accessible={false}` is passed (typically by `CheckboxItem`, which
  // owns the a11y tree for the wrapped row), suppress our own a11y role
  // and state so the same logical control doesn't expose two `checked`
  // states to assistive tech.
  const accessibilityProps =
    rest.accessible === false
      ? {}
      : {
          accessibilityRole: 'checkbox' as const,
          accessibilityState: {
            disabled: !!disabled,
            checked: (status === 'indeterminate'
              ? 'mixed'
              : status === 'checked') as boolean | 'mixed',
          },
          accessibilityLiveRegion: 'polite' as const,
        };

  return (
    <TouchableRipple
      {...rest}
      borderless
      centered
      onPress={onPress}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      {...accessibilityProps}
      testID={testID}
      style={[
        styles.tapTarget,
        Platform.OS === 'web' ? webNoOutline : undefined,
        style,
      ]}
    >
      <View pointerEvents="none" style={styles.tapTargetInner}>
        {focused && !disabled ? (
          <View
            pointerEvents="none"
            style={[styles.focusRing, { borderColor: theme.colors.secondary }]}
          />
        ) : null}
        <View style={[styles.container, { opacity: visual.containerOpacity }]}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.outline,
              { borderColor: visual.outlineColor },
              outlineAnimatedStyle,
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.fill,
              { backgroundColor: visual.containerColor },
              fillAnimatedStyle,
            ]}
          />
          {showIndeterminate ? (
            <Animated.View
              style={[
                flipMaskForWebRTL
                  ? styles.checkmarkMaskWebRTL
                  : styles.checkmarkMask,
                maskAnimatedStyle,
              ]}
            >
              <View style={styles.checkmarkContent}>
                <View
                  style={[styles.dash, { backgroundColor: visual.iconColor }]}
                />
              </View>
            </Animated.View>
          ) : (
            <Checkmark
              color={visual.iconColor}
              maskAnimatedStyle={maskAnimatedStyle}
              flipMaskForWebRTL={flipMaskForWebRTL}
              isRTL={direction === 'rtl'}
              autoSwapsBorders={Platform.OS !== 'web'}
            />
          )}
        </View>
      </View>
    </TouchableRipple>
  );
};

/**
 * Reveal-mask checkmark: an L-shape (borderLeftWidth + borderBottomWidth
 * rotated -45deg) inside a directional-anchored View whose width animates
 * 0 → CONTAINER_SIZE so the stroke "draws in" along the writing direction.
 */
const Checkmark = ({
  color,
  maskAnimatedStyle,
  flipMaskForWebRTL,
  isRTL,
  autoSwapsBorders,
}: {
  color: ColorValue;
  maskAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  flipMaskForWebRTL: boolean;
  isRTL: boolean;
  // True on platforms whose layout engine auto-swaps `borderLeftWidth`
  // ↔ `borderRightWidth` in RTL (Android, iOS); false on web (RNW).
  autoSwapsBorders: boolean;
}) => {
  return (
    <Animated.View
      style={[
        flipMaskForWebRTL ? styles.checkmarkMaskWebRTL : styles.checkmarkMask,
        maskAnimatedStyle,
      ]}
    >
      <View style={styles.checkmarkContent}>
        <View
          style={[
            styles.checkmarkGlyph,
            { borderColor: color },
            // On platforms that auto-swap borders in RTL, pre-swap them
            // here so the swap brings them back to the LTR orientation.
            isRTL && autoSwapsBorders ? styles.checkmarkGlyphRTL : null,
          ]}
        />
      </View>
    </Animated.View>
  );
};

// Web-only style; not in StyleSheet because `outline` is outside ViewStyle.
const webNoOutline = { outline: 'none' } as unknown as ViewStyle;

const styles = StyleSheet.create({
  tapTarget: {
    width: STATE_LAYER_SIZE,
    height: STATE_LAYER_SIZE,
    borderRadius: STATE_LAYER_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapTargetInner: {
    width: STATE_LAYER_SIZE,
    height: STATE_LAYER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusRing: {
    position: 'absolute',
    width: FOCUS_RING_SIZE,
    height: FOCUS_RING_SIZE,
    borderRadius: FOCUS_RING_RADIUS,
    borderWidth: FOCUS_THICKNESS,
  },
  container: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    borderRadius: CONTAINER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: CONTAINER_RADIUS,
  },
  outline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: OUTLINE_WIDTH,
    borderRadius: CONTAINER_RADIUS,
  },
  dash: {
    width: 10,
    height: 2,
    borderRadius: 1,
  },
  checkmarkMask: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: CONTAINER_SIZE,
    overflow: 'hidden',
  },
  checkmarkMaskWebRTL: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: CONTAINER_SIZE,
    overflow: 'hidden',
  },
  checkmarkContent: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkGlyph: {
    width: 11,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '-45deg' }, { translateY: -1 }, { translateX: 1 }],
  },
  checkmarkGlyphRTL: {
    borderLeftWidth: 0,
    borderRightWidth: 2,
  },
});

export default Checkbox;

// @component-docs ignore-next-line
const CheckboxWithTheme = Checkbox;
// @component-docs ignore-next-line
export { CheckboxWithTheme as Checkbox };
