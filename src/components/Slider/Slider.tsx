import * as React from 'react';
import {
  type GestureResponderEvent,
  type LayoutChangeEvent,
  Platform,
  StyleSheet,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { SliderTokens } from './tokens';
import {
  clamp,
  getDefaultSliderColors,
  getRatioFromValue,
  getTickMarks,
  getValueFromRatio,
  snapToStep,
} from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { ThemeProp } from '../../theme/types';
import Icon, { type IconSource } from '../Icon';
import Text from '../Typography/Text';

export type Props = {
  /**
   * Current value of the slider (controlled).
   */
  value?: number;
  /**
   * Initial value when uncontrolled. Defaults to `min`.
   */
  defaultValue?: number;
  /**
   * Minimum value of the slider. Defaults to 0.
   */
  min?: number;
  /**
   * Maximum value of the slider. Defaults to 100.
   */
  max?: number;
  /**
   * Step increment for discrete sliders.
   */
  step?: number;
  /**
   * Whether to render stop indicators (tick marks) along the track.
   * Defaults to `true` if `step` is provided, `false` otherwise.
   */
  showTickMarks?: boolean;
  /**
   * Whether this is a centered slider, where the active track originates from the center or custom origin.
   */
  centered?: boolean;
  /**
   * Custom origin value for centered sliders. Defaults to `(min + max) / 2` when `centered` is true.
   */
  origin?: number;
  /**
   * Behavior of the value indicator tooltip.
   * - `'floating'`: appears when interacting (default)
   * - `'visible'`: always visible
   * - `'gone'`: never shown
   */
  labelBehavior?: 'floating' | 'visible' | 'gone';
  /**
   * Function to format the text inside the value indicator.
   */
  formatValueIndicator?: (value: number) => string;
  /**
   * Icon displayed before the slider track.
   */
  startIcon?: IconSource;
  /**
   * Icon displayed after the slider track.
   */
  endIcon?: IconSource;
  /**
   * Callback called when the value changes during dragging.
   */
  onValueChange?: (value: number) => void;
  /**
   * Callback called when interaction begins.
   */
  onSlidingStart?: (value: number) => void;
  /**
   * Callback called when interaction ends.
   */
  onSlidingComplete?: (value: number) => void;
  /**
   * Disables interaction and renders the disabled visual state.
   */
  disabled?: boolean;
  /**
   * Custom height for the track (defaults to 16dp per M3 specs).
   */
  trackHeight?: number;
  /**
   * Custom gap size between thumb and track (defaults to 6dp per M3 specs).
   */
  thumbTrackGapSize?: number;
  /**
   * Custom color for the active track.
   */
  activeColor?: string;
  /**
   * Custom color for the inactive track.
   */
  inactiveColor?: string;
  /**
   * Custom color for the thumb handle.
   */
  thumbColor?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  theme?: ThemeProp;
  /**
   * Accessibility label for the slider.
   */
  'aria-label'?: string;
  accessibilityLabel?: string;
};

const {
  trackHeight: DEFAULT_TRACK_HEIGHT,
  trackCornerRadius: DEFAULT_TRACK_CORNER_RADIUS,
  trackInsideCornerRadius: TRACK_INSIDE_CORNER_RADIUS,
  thumbWidth: DEFAULT_THUMB_WIDTH,
  thumbHeight: DEFAULT_THUMB_HEIGHT,
  thumbCornerRadius: THUMB_CORNER_RADIUS,
  thumbTrackGapSize: DEFAULT_GAP_SIZE,
  stopIndicatorSize: STOP_INDICATOR_SIZE,
  minTouchTargetSize: MIN_TOUCH_TARGET_SIZE,
  stateLayerSize: STATE_LAYER_SIZE,
  valueIndicatorHeight: VALUE_INDICATOR_HEIGHT,
  valueIndicatorMinWidth: VALUE_INDICATOR_MIN_WIDTH,
  valueIndicatorPaddingHorizontal: VALUE_INDICATOR_PADDING_HORIZONTAL,
  valueIndicatorCornerRadius: VALUE_INDICATOR_CORNER_RADIUS,
  valueIndicatorGap: VALUE_INDICATOR_GAP,
  iconSize: DEFAULT_ICON_SIZE,
  iconGap: DEFAULT_ICON_GAP,
  disabledActiveTrackOpacity: DISABLED_ACTIVE_TRACK_OPACITY,
  disabledInactiveTrackOpacity: DISABLED_INACTIVE_TRACK_OPACITY,
  disabledHandleOpacity: DISABLED_HANDLE_OPACITY,
  disabledStopIndicatorOpacity: DISABLED_STOP_INDICATOR_OPACITY,
  disabledIconOpacity: DISABLED_ICON_OPACITY,
} = SliderTokens;

/**
 * Material Design 3 Slider component.
 *
 * Sliders let users make selections from a range of values.
 * Supports continuous, discrete (stops/ticks), centered, and custom origin configurations.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Slider } from 'react-native-paper';
 *
 * const Example = () => {
 *   const [value, setValue] = React.useState(50);
 *   return <Slider value={value} onValueChange={setValue} />;
 * };
 * ```
 */
const Slider = ({
  value: controlledValue,
  defaultValue,
  min = 0,
  max = 100,
  step,
  showTickMarks = step !== undefined,
  centered = false,
  origin: customOrigin,
  labelBehavior = 'floating',
  formatValueIndicator,
  startIcon,
  endIcon,
  onValueChange,
  onSlidingStart,
  onSlidingComplete,
  disabled = false,
  trackHeight = DEFAULT_TRACK_HEIGHT,
  thumbTrackGapSize = DEFAULT_GAP_SIZE,
  activeColor,
  inactiveColor,
  thumbColor,
  style,
  testID,
  theme: themeOverrides,
  'aria-label': ariaLabelProp,
  accessibilityLabel: accessibilityLabelProp,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const reduceMotion = useReduceMotion();
  const { direction } = useLocale();
  const isRTL = direction === 'rtl';

  const defaultSliderColors = React.useMemo(
    () => getDefaultSliderColors(theme),
    [theme]
  );

  const isControlled = controlledValue !== undefined;
  const initialVal = controlledValue ?? defaultValue ?? min;
  const [internalValue, setInternalValue] = React.useState<number>(
    snapToStep(initialVal, min, max, step)
  );

  const currentValue = isControlled
    ? snapToStep(controlledValue, min, max, step)
    : internalValue;

  const [trackWidth, setTrackWidth] = React.useState<number>(0);
  const trackRef = React.useRef<View>(null);
  const trackPageX = React.useRef<number>(0);

  const isInteractingSV = useSharedValue(0);
  const [isFocused, setIsFocused] = React.useState(false);
  const [indicatorWidth, setIndicatorWidth] = React.useState<number>(
    VALUE_INDICATOR_MIN_WIDTH
  );

  const handleIndicatorLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      if (w > 0 && Math.abs(w - indicatorWidth) > 0.5) {
        setIndicatorWidth(w);
      }
    },
    [indicatorWidth]
  );

  const latestCallbacks = React.useRef({
    onValueChange,
    onSlidingStart,
    onSlidingComplete,
    currentValue,
    min,
    max,
    step,
    disabled,
    isRTL,
    isControlled,
  });

  React.useEffect(() => {
    latestCallbacks.current = {
      onValueChange,
      onSlidingStart,
      onSlidingComplete,
      currentValue,
      min,
      max,
      step,
      disabled,
      isRTL,
      isControlled,
    };
  });

  const updateValueFromX = React.useCallback(
    (x: number) => {
      const {
        min: curMin,
        max: curMax,
        step: curStep,
        isRTL: curRTL,
        onValueChange: cbValueChange,
        currentValue: curVal,
        isControlled: curControlled,
      } = latestCallbacks.current;

      const radius = trackHeight / 2 || DEFAULT_TRACK_CORNER_RADIUS;
      const travelWidth = Math.max(0, trackWidth - 2 * radius);
      if (travelWidth <= 0) return;

      let ratio = clamp((x - radius) / travelWidth, 0, 1);
      if (curRTL) {
        ratio = 1 - ratio;
      }

      const nextVal = getValueFromRatio(ratio, curMin, curMax, curStep);
      if (nextVal !== curVal) {
        if (!curControlled) {
          setInternalValue(nextVal);
        }
        cbValueChange?.(nextVal);
      }
    },
    [trackHeight, trackWidth]
  );

  const handleStartShouldSetResponder = React.useCallback(
    () => !disabled,
    [disabled]
  );

  const handleMoveShouldSetResponder = React.useCallback(
    () => !disabled,
    [disabled]
  );

  const handleTerminationRequest = React.useCallback(() => false, []);

  const handleResponderGrant = React.useCallback(
    (evt: GestureResponderEvent) => {
      if (disabled) return false;
      isInteractingSV.value = 1;
      onSlidingStart?.(currentValue);

      const pageX = evt.nativeEvent.pageX;
      const locationX = evt.nativeEvent.locationX;
      trackPageX.current = pageX - locationX;
      updateValueFromX(locationX);

      if (trackRef.current) {
        trackRef.current.measure((_x, _y, _width, _height, measuredPageX) => {
          if (!isNaN(measuredPageX)) {
            trackPageX.current = measuredPageX;
          }
        });
      }
      return true;
    },
    [disabled, isInteractingSV, onSlidingStart, currentValue, updateValueFromX]
  );

  const handleResponderMove = React.useCallback(
    (evt: GestureResponderEvent) => {
      if (disabled) return;
      const localX = evt.nativeEvent.pageX - trackPageX.current;
      updateValueFromX(localX);
    },
    [disabled, updateValueFromX]
  );

  const handleResponderEnd = React.useCallback(() => {
    isInteractingSV.value = 0;
    onSlidingComplete?.(currentValue);
  }, [isInteractingSV, onSlidingComplete, currentValue]);

  const onTrackLayout = React.useCallback((e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    setTrackWidth(width);
    if (trackRef.current) {
      trackRef.current.measure((_x, _y, _width, _height, pageX) => {
        trackPageX.current = pageX;
      });
    }
  }, []);

  const handleAccessibilityAction = React.useCallback(
    (event: { nativeEvent: { actionName: string } }) => {
      if (disabled) return;
      const stepVal = step ?? (max - min) / 100;
      let next = currentValue;
      if (event.nativeEvent.actionName === 'increment') {
        next = currentValue + stepVal;
      } else if (event.nativeEvent.actionName === 'decrement') {
        next = currentValue - stepVal;
      }
      const clamped = snapToStep(next, min, max, step);
      if (clamped !== currentValue) {
        if (!isControlled) {
          setInternalValue(clamped);
        }
        onValueChange?.(clamped);
        onSlidingComplete?.(clamped);
      }
    },
    [
      disabled,
      step,
      max,
      min,
      currentValue,
      isControlled,
      onValueChange,
      onSlidingComplete,
    ]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      const stepVal = step ?? (max - min) / 100;
      let next = currentValue;

      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        next = isRTL ? currentValue - stepVal : currentValue + stepVal;
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        next = isRTL ? currentValue + stepVal : currentValue - stepVal;
        e.preventDefault();
      } else if (e.key === 'Home') {
        next = min;
        e.preventDefault();
      } else if (e.key === 'End') {
        next = max;
        e.preventDefault();
      } else if (e.key === 'PageUp') {
        next = currentValue + stepVal * 10;
        e.preventDefault();
      } else if (e.key === 'PageDown') {
        next = currentValue - stepVal * 10;
        e.preventDefault();
      }

      const clamped = snapToStep(next, min, max, step);
      if (clamped !== currentValue) {
        setInternalValue(clamped);
        onValueChange?.(clamped);
        onSlidingComplete?.(clamped);
      }
    },
    [
      disabled,
      step,
      max,
      min,
      currentValue,
      isRTL,
      onValueChange,
      onSlidingComplete,
    ]
  );

  const trackCornerRadius = trackHeight / 2 || DEFAULT_TRACK_CORNER_RADIUS;
  const travelWidth = Math.max(0, trackWidth - 2 * trackCornerRadius);

  const ratio = getRatioFromValue(currentValue, min, max);
  const visualRatio = isRTL ? 1 - ratio : ratio;
  const thumbCenter = trackCornerRadius + visualRatio * travelWidth;

  const effectiveOrigin = centered
    ? (customOrigin ?? (min + max) / 2)
    : undefined;
  const originRatio =
    effectiveOrigin !== undefined
      ? getRatioFromValue(effectiveOrigin, min, max)
      : 0;
  const visualOriginRatio = isRTL ? 1 - originRatio : originRatio;
  const originCenter = trackCornerRadius + visualOriginRatio * travelWidth;

  const effectiveActiveTrackColor = disabled
    ? defaultSliderColors.disabledActiveTrackColor
    : (activeColor ?? defaultSliderColors.activeTrackColor);

  const effectiveInactiveTrackColor = disabled
    ? defaultSliderColors.disabledInactiveTrackColor
    : (inactiveColor ?? defaultSliderColors.inactiveTrackColor);

  const effectiveThumbColor = disabled
    ? defaultSliderColors.disabledHandleColor
    : (thumbColor ?? defaultSliderColors.handleColor);

  const effectiveIconColor = disabled
    ? defaultSliderColors.disabledIconColor
    : defaultSliderColors.iconColor;

  const animDuration = reduceMotion ? 0 : 150;

  const stateLayerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isInteractingSV.value ? 0.12 : isFocused ? 0.1 : 0, {
      duration: animDuration,
    }),
    transform: [
      {
        scale: withTiming(isInteractingSV.value || isFocused ? 1 : 0.6, {
          duration: animDuration,
        }),
      },
    ],
  }));

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scaleX: withTiming(isInteractingSV.value ? 1.5 : 1, {
          duration: animDuration,
        }),
      },
    ],
  }));

  const valueIndicatorAnimatedStyle = useAnimatedStyle(() => {
    if (labelBehavior === 'visible') {
      return { opacity: 1, transform: [{ scale: 1 }] };
    }
    if (labelBehavior === 'gone') {
      return { opacity: 0, transform: [{ scale: 0 }] };
    }
    const show = isInteractingSV.value === 1 || isFocused;
    return {
      opacity: withTiming(show ? 1 : 0, { duration: animDuration }),
      transform: [
        {
          scale: withTiming(show ? 1 : 0.8, { duration: animDuration }),
        },
      ],
    };
  });

  const gap = thumbTrackGapSize;
  const halfThumb = DEFAULT_THUMB_WIDTH / 2;

  let activeLeft = 0;
  let activeWidth = 0;
  let activeBorderRadius: ViewStyle = {};

  let inactiveLeftWidth = 0;
  let inactiveLeftRadius: ViewStyle = {};

  let inactiveRightLeft = 0;
  let inactiveRightWidth = 0;
  let inactiveRightRadius: ViewStyle = {};

  if (effectiveOrigin !== undefined) {
    if (thumbCenter >= originCenter) {
      activeLeft = originCenter;
      activeWidth = Math.max(0, thumbCenter - originCenter - halfThumb - gap);
      activeBorderRadius = {
        borderRadius: TRACK_INSIDE_CORNER_RADIUS,
      };

      const inactiveLeftEnd =
        thumbCenter - halfThumb - gap < originCenter
          ? Math.max(0, thumbCenter - halfThumb - gap)
          : originCenter;
      inactiveLeftWidth = inactiveLeftEnd;
      inactiveLeftRadius = {
        borderTopLeftRadius: trackCornerRadius,
        borderBottomLeftRadius: trackCornerRadius,
        borderTopRightRadius: TRACK_INSIDE_CORNER_RADIUS,
        borderBottomRightRadius: TRACK_INSIDE_CORNER_RADIUS,
      };

      inactiveRightLeft = thumbCenter + halfThumb + gap;
      inactiveRightWidth = Math.max(0, trackWidth - inactiveRightLeft);
      inactiveRightRadius = {
        borderTopLeftRadius: TRACK_INSIDE_CORNER_RADIUS,
        borderBottomLeftRadius: TRACK_INSIDE_CORNER_RADIUS,
        borderTopRightRadius: trackCornerRadius,
        borderBottomRightRadius: trackCornerRadius,
      };
    } else {
      activeLeft = thumbCenter + halfThumb + gap;
      activeWidth = Math.max(0, originCenter - activeLeft);
      activeBorderRadius = {
        borderRadius: TRACK_INSIDE_CORNER_RADIUS,
      };

      inactiveLeftWidth = Math.max(0, thumbCenter - halfThumb - gap);
      inactiveLeftRadius = {
        borderTopLeftRadius: trackCornerRadius,
        borderBottomLeftRadius: trackCornerRadius,
        borderTopRightRadius: TRACK_INSIDE_CORNER_RADIUS,
        borderBottomRightRadius: TRACK_INSIDE_CORNER_RADIUS,
      };

      const inactiveRightStart =
        thumbCenter + halfThumb + gap > originCenter
          ? thumbCenter + halfThumb + gap
          : originCenter;
      inactiveRightLeft = inactiveRightStart;
      inactiveRightWidth = Math.max(0, trackWidth - inactiveRightLeft);
      inactiveRightRadius = {
        borderTopLeftRadius: TRACK_INSIDE_CORNER_RADIUS,
        borderBottomLeftRadius: TRACK_INSIDE_CORNER_RADIUS,
        borderTopRightRadius: trackCornerRadius,
        borderBottomRightRadius: trackCornerRadius,
      };
    }
  } else {
    if (!isRTL) {
      activeLeft = 0;
      activeWidth = Math.max(0, thumbCenter - halfThumb - gap);
      activeBorderRadius = {
        borderTopLeftRadius: trackCornerRadius,
        borderBottomLeftRadius: trackCornerRadius,
        borderTopRightRadius: TRACK_INSIDE_CORNER_RADIUS,
        borderBottomRightRadius: TRACK_INSIDE_CORNER_RADIUS,
      };

      inactiveRightLeft = thumbCenter + halfThumb + gap;
      inactiveRightWidth = Math.max(0, trackWidth - inactiveRightLeft);
      inactiveRightRadius = {
        borderTopLeftRadius: TRACK_INSIDE_CORNER_RADIUS,
        borderBottomLeftRadius: TRACK_INSIDE_CORNER_RADIUS,
        borderTopRightRadius: trackCornerRadius,
        borderBottomRightRadius: trackCornerRadius,
      };
    } else {
      inactiveLeftWidth = Math.max(0, thumbCenter - halfThumb - gap);
      inactiveLeftRadius = {
        borderTopLeftRadius: trackCornerRadius,
        borderBottomLeftRadius: trackCornerRadius,
        borderTopRightRadius: TRACK_INSIDE_CORNER_RADIUS,
        borderBottomRightRadius: TRACK_INSIDE_CORNER_RADIUS,
      };

      activeLeft = thumbCenter + halfThumb + gap;
      activeWidth = Math.max(0, trackWidth - activeLeft);
      activeBorderRadius = {
        borderTopLeftRadius: TRACK_INSIDE_CORNER_RADIUS,
        borderBottomLeftRadius: TRACK_INSIDE_CORNER_RADIUS,
        borderTopRightRadius: trackCornerRadius,
        borderBottomRightRadius: trackCornerRadius,
      };
    }
  }

  const tickMarks = React.useMemo(
    () => (showTickMarks ? getTickMarks(min, max, step) : []),
    [showTickMarks, min, max, step]
  );

  const formattedLabel = formatValueIndicator
    ? formatValueIndicator(currentValue)
    : String(currentValue);

  const accessibilityLabel =
    ariaLabelProp ?? accessibilityLabelProp ?? 'Slider';

  const inactiveLeftTrackDynamicStyle = {
    height: trackHeight,
    width: inactiveLeftWidth,
    backgroundColor: effectiveInactiveTrackColor,
    ...inactiveLeftRadius,
  };

  const activeTrackDynamicStyle = {
    height: trackHeight,
    left: activeLeft,
    width: activeWidth,
    backgroundColor: effectiveActiveTrackColor,
    ...activeBorderRadius,
  };

  const inactiveRightTrackDynamicStyle = {
    height: trackHeight,
    left: inactiveRightLeft,
    width: inactiveRightWidth,
    backgroundColor: effectiveInactiveTrackColor,
    ...inactiveRightRadius,
  };

  const stateLayerDynamicStyle = {
    left: thumbCenter - STATE_LAYER_SIZE / 2,
    top: (MIN_TOUCH_TARGET_SIZE - STATE_LAYER_SIZE) / 2,
    backgroundColor: defaultSliderColors.stateLayerColor,
  };

  const thumbDynamicStyle = {
    left: thumbCenter - DEFAULT_THUMB_WIDTH / 2,
    top: (MIN_TOUCH_TARGET_SIZE - DEFAULT_THUMB_HEIGHT) / 2,
    backgroundColor: effectiveThumbColor,
  };

  const valueIndicatorAnchorDynamicStyle = {
    left: thumbCenter - indicatorWidth / 2,
  };

  const valueIndicatorDynamicStyle = {
    backgroundColor: defaultSliderColors.valueIndicatorContainerColor,
  };

  const valueIndicatorTextDynamicStyle = {
    color: defaultSliderColors.valueIndicatorTextColor,
  };

  return (
    <View
      style={[
        styles.container,
        Platform.OS === 'web' ? webNoOutline : undefined,
        style,
      ]}
      testID={testID}
      {...(Platform.OS === 'web'
        ? {
            onKeyDown: handleKeyDown,
            tabIndex: disabled ? -1 : 0,
            onFocus: () => setIsFocused(true),
            onBlur: () => setIsFocused(false),
          }
        : {})}
      accessible
      accessibilityRole="adjustable"
      role="slider"
      aria-label={accessibilityLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={currentValue}
      aria-valuetext={formattedLabel}
      aria-disabled={disabled}
      accessibilityActions={[
        { name: 'increment', label: 'increment' },
        { name: 'decrement', label: 'decrement' },
      ]}
      onAccessibilityAction={handleAccessibilityAction}
    >
      {/* Leading Icon */}
      {startIcon ? (
        <View
          style={[
            styles.iconWrap,
            styles.startIconWrap,
            disabled && styles.disabledIcon,
          ]}
        >
          <Icon
            source={startIcon}
            size={DEFAULT_ICON_SIZE}
            color={effectiveIconColor}
            theme={theme}
          />
        </View>
      ) : null}

      {/* Main Track & Thumb Interaction Area */}
      <View
        ref={trackRef}
        collapsable={false}
        style={styles.touchArea}
        onLayout={onTrackLayout}
        onStartShouldSetResponder={handleStartShouldSetResponder}
        onMoveShouldSetResponder={handleMoveShouldSetResponder}
        onStartShouldSetResponderCapture={handleStartShouldSetResponder}
        onMoveShouldSetResponderCapture={handleMoveShouldSetResponder}
        onResponderTerminationRequest={handleTerminationRequest}
        onResponderGrant={handleResponderGrant}
        onResponderMove={handleResponderMove}
        onResponderRelease={handleResponderEnd}
        onResponderTerminate={handleResponderEnd}
      >
        {/* Inactive Left Track */}
        {trackWidth > 0 && inactiveLeftWidth > 0 ? (
          <View
            style={[
              styles.segment,
              styles.inactiveLeftSegment,
              inactiveLeftTrackDynamicStyle,
              disabled && styles.disabledInactiveTrack,
            ]}
          />
        ) : null}

        {/* Active Track Highlight Segment */}
        {trackWidth > 0 && activeWidth > 0 ? (
          <View
            style={[
              styles.segment,
              activeTrackDynamicStyle,
              disabled && styles.disabledActiveTrack,
            ]}
          />
        ) : null}

        {/* Inactive Right Track */}
        {trackWidth > 0 && inactiveRightWidth > 0 ? (
          <View
            style={[
              styles.segment,
              inactiveRightTrackDynamicStyle,
              disabled && styles.disabledInactiveTrack,
            ]}
          />
        ) : null}

        {/* Stop Indicators (Tick Marks) */}
        {trackWidth > 0 && tickMarks.length > 0
          ? tickMarks.map((tickRatio, idx) => {
              const tickVisualRatio = isRTL ? 1 - tickRatio : tickRatio;
              const tickPos = trackCornerRadius + tickVisualRatio * travelWidth;
              const isActiveTick =
                effectiveOrigin !== undefined
                  ? (tickRatio >= originRatio && tickRatio <= ratio) ||
                    (tickRatio <= originRatio && tickRatio >= ratio)
                  : tickRatio <= ratio;

              const distToThumb = Math.abs(tickPos - thumbCenter);
              if (distToThumb < halfThumb + gap) {
                return null;
              }

              const tickColor = isActiveTick
                ? defaultSliderColors.stopIndicatorActiveColor
                : defaultSliderColors.stopIndicatorInactiveColor;

              const tickDynamicStyle = {
                left: tickPos - STOP_INDICATOR_SIZE / 2,
                top: (MIN_TOUCH_TARGET_SIZE - STOP_INDICATOR_SIZE) / 2,
                backgroundColor: disabled
                  ? defaultSliderColors.disabledStopIndicatorColor
                  : tickColor,
              };

              return (
                <View
                  key={idx}
                  style={[
                    styles.tickMark,
                    tickDynamicStyle,
                    disabled && styles.disabledStopIndicator,
                  ]}
                />
              );
            })
          : null}

        {/* State Layer (Ripple circle around thumb) */}
        {trackWidth > 0 ? (
          <Animated.View
            style={[
              styles.stateLayer,
              stateLayerDynamicStyle,
              stateLayerAnimatedStyle,
            ]}
          />
        ) : null}

        {/* Thumb (Handle Bar) */}
        {trackWidth > 0 ? (
          <Animated.View
            style={[
              styles.thumb,
              thumbDynamicStyle,
              thumbAnimatedStyle,
              disabled && styles.disabledHandle,
            ]}
          />
        ) : null}

        {/* Floating Value Indicator (Tooltip) */}
        {trackWidth > 0 && labelBehavior !== 'gone' ? (
          <View
            style={[
              styles.valueIndicatorAnchor,
              valueIndicatorAnchorDynamicStyle,
            ]}
            onLayout={handleIndicatorLayout}
            pointerEvents="none"
          >
            <Animated.View
              style={[
                styles.valueIndicator,
                valueIndicatorDynamicStyle,
                valueIndicatorAnimatedStyle,
              ]}
            >
              <Text
                variant="labelLarge"
                style={[
                  styles.valueIndicatorText,
                  valueIndicatorTextDynamicStyle,
                ]}
              >
                {formattedLabel}
              </Text>
            </Animated.View>
          </View>
        ) : null}
      </View>

      {/* Trailing Icon */}
      {endIcon ? (
        <View
          style={[
            styles.iconWrap,
            styles.endIconWrap,
            disabled && styles.disabledIcon,
          ]}
        >
          <Icon
            source={endIcon}
            size={DEFAULT_ICON_SIZE}
            color={effectiveIconColor}
            theme={theme}
          />
        </View>
      ) : null}
    </View>
  );
};

// Web-only style; not in StyleSheet because `outline` is outside ViewStyle.
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const webNoOutline = { outline: 'none' } as unknown as ViewStyle;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: MIN_TOUCH_TARGET_SIZE,
  },
  touchArea: {
    flex: 1,
    height: MIN_TOUCH_TARGET_SIZE,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  segment: {
    position: 'absolute',
    pointerEvents: 'none',
  },
  inactiveLeftSegment: {
    left: 0,
  },
  thumb: {
    position: 'absolute',
    width: DEFAULT_THUMB_WIDTH,
    height: DEFAULT_THUMB_HEIGHT,
    borderRadius: THUMB_CORNER_RADIUS,
    elevation: 1,
    pointerEvents: 'none',
  },
  stateLayer: {
    position: 'absolute',
    width: STATE_LAYER_SIZE,
    height: STATE_LAYER_SIZE,
    borderRadius: cornerFull,
    pointerEvents: 'none',
  },
  tickMark: {
    position: 'absolute',
    width: STOP_INDICATOR_SIZE,
    height: STOP_INDICATOR_SIZE,
    borderRadius: STOP_INDICATOR_SIZE / 2,
    pointerEvents: 'none',
  },
  valueIndicatorAnchor: {
    position: 'absolute',
    top:
      (MIN_TOUCH_TARGET_SIZE - DEFAULT_THUMB_HEIGHT) / 2 -
      VALUE_INDICATOR_GAP -
      VALUE_INDICATOR_HEIGHT,
    height: VALUE_INDICATOR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueIndicator: {
    flexDirection: 'row',
    height: VALUE_INDICATOR_HEIGHT,
    minWidth: VALUE_INDICATOR_MIN_WIDTH,
    paddingHorizontal: VALUE_INDICATOR_PADDING_HORIZONTAL,
    borderRadius: VALUE_INDICATOR_CORNER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueIndicatorText: {
    fontWeight: '500',
    textAlign: 'center',
    flexShrink: 0,
  },
  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  startIconWrap: {
    marginRight: DEFAULT_ICON_GAP,
  },
  endIconWrap: {
    marginLeft: DEFAULT_ICON_GAP,
  },
  disabledActiveTrack: {
    opacity: DISABLED_ACTIVE_TRACK_OPACITY,
  },
  disabledInactiveTrack: {
    opacity: DISABLED_INACTIVE_TRACK_OPACITY,
  },
  disabledHandle: {
    opacity: DISABLED_HANDLE_OPACITY,
  },
  disabledStopIndicator: {
    opacity: DISABLED_STOP_INDICATOR_OPACITY,
  },
  disabledIcon: {
    opacity: DISABLED_ICON_OPACITY,
  },
});

export default Slider;
