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
   * Current range values of the slider [start, end] (controlled).
   */
  values?: [number, number];
  /**
   * Initial values when uncontrolled. Defaults to `[min, max]`.
   */
  defaultValues?: [number, number];
  /**
   * Minimum value of the range slider. Defaults to 0.
   */
  min?: number;
  /**
   * Maximum value of the range slider. Defaults to 100.
   */
  max?: number;
  /**
   * Step increment for discrete sliders.
   */
  step?: number;
  /**
   * Minimum separation distance between the two thumbs.
   */
  minSeparation?: number;
  /**
   * Whether to render stop indicators (tick marks) along the track.
   * Defaults to `true` if `step` is provided, `false` otherwise.
   */
  showTickMarks?: boolean;
  /**
   * Behavior of the value indicator tooltips.
   * - `'floating'`: appears when interacting (default)
   * - `'visible'`: always visible
   * - `'gone'`: never shown
   */
  labelBehavior?: 'floating' | 'visible' | 'gone';
  /**
   * Function to format the text inside the value indicators.
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
   * Callback called when the values change during dragging.
   */
  onValueChange?: (values: [number, number]) => void;
  /**
   * Callback called when interaction begins.
   */
  onSlidingStart?: (values: [number, number]) => void;
  /**
   * Callback called when interaction ends.
   */
  onSlidingComplete?: (values: [number, number]) => void;
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
   * Custom color for the active track segment.
   */
  activeColor?: string;
  /**
   * Custom color for the inactive track segments.
   */
  inactiveColor?: string;
  /**
   * Custom color for the thumb handles.
   */
  thumbColor?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  theme?: ThemeProp;
  /**
   * Accessibility label for the start thumb.
   */
  startAccessibilityLabel?: string;
  /**
   * Accessibility label for the end thumb.
   */
  endAccessibilityLabel?: string;
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
 * Material Design 3 Range Slider component.
 *
 * Allows users to select a range between two values with dual handles.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { RangeSlider } from 'react-native-paper';
 *
 * const Example = () => {
 *   const [range, setRange] = React.useState([20, 80]);
 *   return <RangeSlider values={range} onValueChange={setRange} />;
 * };
 * ```
 */
const RangeSlider = ({
  values: controlledValues,
  defaultValues,
  min = 0,
  max = 100,
  step,
  minSeparation = 0,
  showTickMarks = step !== undefined,
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
  startAccessibilityLabel = 'Minimum',
  endAccessibilityLabel = 'Maximum',
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const reduceMotion = useReduceMotion();
  const { direction } = useLocale();
  const isRTL = direction === 'rtl';

  const defaultSliderColors = React.useMemo(
    () => getDefaultSliderColors(theme),
    [theme]
  );

  const isControlled = controlledValues !== undefined;
  const initialRange = defaultValues ?? [min, max];
  const [internalValues, setInternalValues] = React.useState<[number, number]>([
    snapToStep(initialRange[0], min, max, step),
    snapToStep(initialRange[1], min, max, step),
  ]);

  const currentValues: [number, number] = React.useMemo(
    () =>
      isControlled
        ? [
            snapToStep(controlledValues[0], min, max, step),
            snapToStep(controlledValues[1], min, max, step),
          ]
        : internalValues,
    [isControlled, controlledValues, min, max, step, internalValues]
  );

  const [trackWidth, setTrackWidth] = React.useState<number>(0);
  const trackRef = React.useRef<View>(null);
  const trackPageX = React.useRef<number>(0);

  const activeThumbRef = React.useRef<'start' | 'end' | null>(null);
  const isInteractingStartSV = useSharedValue(0);
  const isInteractingEndSV = useSharedValue(0);
  const [isStartFocused, setIsStartFocused] = React.useState(false);
  const [isEndFocused, setIsEndFocused] = React.useState(false);
  const [startIndicatorWidth, setStartIndicatorWidth] = React.useState<number>(
    VALUE_INDICATOR_MIN_WIDTH
  );
  const [endIndicatorWidth, setEndIndicatorWidth] = React.useState<number>(
    VALUE_INDICATOR_MIN_WIDTH
  );

  const handleStartIndicatorLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      if (w > 0 && Math.abs(w - startIndicatorWidth) > 0.5) {
        setStartIndicatorWidth(w);
      }
    },
    [startIndicatorWidth]
  );

  const handleEndIndicatorLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      if (w > 0 && Math.abs(w - endIndicatorWidth) > 0.5) {
        setEndIndicatorWidth(w);
      }
    },
    [endIndicatorWidth]
  );

  const latestCallbacks = React.useRef({
    onValueChange,
    onSlidingStart,
    onSlidingComplete,
    currentValues,
    min,
    max,
    step,
    minSeparation,
    disabled,
    isRTL,
    isControlled,
  });

  React.useEffect(() => {
    latestCallbacks.current = {
      onValueChange,
      onSlidingStart,
      onSlidingComplete,
      currentValues,
      min,
      max,
      step,
      minSeparation,
      disabled,
      isRTL,
      isControlled,
    };
  });

  const updateRangeFromX = React.useCallback(
    (x: number) => {
      const {
        min: curMin,
        max: curMax,
        step: curStep,
        minSeparation: curSeparation,
        isRTL: curRTL,
        onValueChange: cbValueChange,
        currentValues: curVals,
        isControlled: curControlled,
      } = latestCallbacks.current;

      const radius = trackHeight / 2 || DEFAULT_TRACK_CORNER_RADIUS;
      const travelWidth = Math.max(0, trackWidth - 2 * radius);
      if (travelWidth <= 0 || !activeThumbRef.current) return;

      let ratio = clamp((x - radius) / travelWidth, 0, 1);
      if (curRTL) {
        ratio = 1 - ratio;
      }

      const rawVal = getValueFromRatio(ratio, curMin, curMax, curStep);

      let nextVals: [number, number];
      if (activeThumbRef.current === 'start') {
        const clampedStart = clamp(rawVal, curMin, curVals[1] - curSeparation);
        nextVals = [clampedStart, curVals[1]];
      } else {
        const clampedEnd = clamp(rawVal, curVals[0] + curSeparation, curMax);
        nextVals = [curVals[0], clampedEnd];
      }

      if (nextVals[0] !== curVals[0] || nextVals[1] !== curVals[1]) {
        if (!curControlled) {
          setInternalValues(nextVals);
        }
        cbValueChange?.(nextVals);
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
      const {
        currentValues: curVals,
        min: curMin,
        max: curMax,
        isRTL: curRTL,
      } = latestCallbacks.current;

      const pageX = evt.nativeEvent.pageX;
      const locationX = evt.nativeEvent.locationX;
      trackPageX.current = pageX - locationX;

      const radius = trackHeight / 2 || DEFAULT_TRACK_CORNER_RADIUS;
      const travelWidth = Math.max(0, trackWidth - 2 * radius);

      const startR = getRatioFromValue(curVals[0], curMin, curMax);
      const endR = getRatioFromValue(curVals[1], curMin, curMax);

      const startVisualR = curRTL ? 1 - startR : startR;
      const endVisualR = curRTL ? 1 - endR : endR;

      const startX = radius + startVisualR * travelWidth;
      const endX = radius + endVisualR * travelWidth;

      const distToStart = Math.abs(locationX - startX);
      const distToEnd = Math.abs(locationX - endX);

      const thumb = distToStart <= distToEnd ? 'start' : 'end';
      activeThumbRef.current = thumb;

      if (thumb === 'start') {
        isInteractingStartSV.value = 1;
      } else {
        isInteractingEndSV.value = 1;
      }

      latestCallbacks.current.onSlidingStart?.(curVals);
      updateRangeFromX(locationX);

      if (trackRef.current) {
        trackRef.current.measure((_x, _y, _width, _height, measuredPageX) => {
          if (!isNaN(measuredPageX)) {
            trackPageX.current = measuredPageX;
          }
        });
      }

      return true;
    },
    [
      disabled,
      trackHeight,
      trackWidth,
      isInteractingStartSV,
      isInteractingEndSV,
      updateRangeFromX,
    ]
  );

  const handleResponderMove = React.useCallback(
    (evt: GestureResponderEvent) => {
      if (disabled) return;
      const localX = evt.nativeEvent.pageX - trackPageX.current;
      updateRangeFromX(localX);
    },
    [disabled, updateRangeFromX]
  );

  const handleResponderEnd = React.useCallback(() => {
    isInteractingStartSV.value = 0;
    isInteractingEndSV.value = 0;
    activeThumbRef.current = null;
    latestCallbacks.current.onSlidingComplete?.(
      latestCallbacks.current.currentValues
    );
  }, [isInteractingStartSV, isInteractingEndSV]);

  const onTrackLayout = React.useCallback((e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    setTrackWidth(width);
    if (trackRef.current) {
      trackRef.current.measure((_x, _y, _width, _height, pageX) => {
        if (!isNaN(pageX)) {
          trackPageX.current = pageX;
        }
      });
    }
  }, []);

  const handleStartAccessibilityAction = React.useCallback(
    (event: { nativeEvent: { actionName: string } }) => {
      if (disabled) return;
      const stepVal = step ?? (max - min) / 100;
      let next = currentValues[0];
      if (event.nativeEvent.actionName === 'increment') {
        next = currentValues[0] + stepVal;
      } else if (event.nativeEvent.actionName === 'decrement') {
        next = currentValues[0] - stepVal;
      }
      const clamped = clamp(
        snapToStep(next, min, max, step),
        min,
        currentValues[1] - minSeparation
      );
      if (clamped !== currentValues[0]) {
        const nextVals: [number, number] = [clamped, currentValues[1]];
        if (!isControlled) {
          setInternalValues(nextVals);
        }
        onValueChange?.(nextVals);
        onSlidingComplete?.(nextVals);
      }
    },
    [
      disabled,
      step,
      max,
      min,
      currentValues,
      minSeparation,
      isControlled,
      onValueChange,
      onSlidingComplete,
    ]
  );

  const handleEndAccessibilityAction = React.useCallback(
    (event: { nativeEvent: { actionName: string } }) => {
      if (disabled) return;
      const stepVal = step ?? (max - min) / 100;
      let next = currentValues[1];
      if (event.nativeEvent.actionName === 'increment') {
        next = currentValues[1] + stepVal;
      } else if (event.nativeEvent.actionName === 'decrement') {
        next = currentValues[1] - stepVal;
      }
      const clamped = clamp(
        snapToStep(next, min, max, step),
        currentValues[0] + minSeparation,
        max
      );
      if (clamped !== currentValues[1]) {
        const nextVals: [number, number] = [currentValues[0], clamped];
        if (!isControlled) {
          setInternalValues(nextVals);
        }
        onValueChange?.(nextVals);
        onSlidingComplete?.(nextVals);
      }
    },
    [
      disabled,
      step,
      max,
      min,
      currentValues,
      minSeparation,
      isControlled,
      onValueChange,
      onSlidingComplete,
    ]
  );

  const handleStartKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      const stepVal = step ?? (max - min) / 100;
      let next = currentValues[0];
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        next = isRTL ? next - stepVal : next + stepVal;
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        next = isRTL ? next + stepVal : next - stepVal;
        e.preventDefault();
      } else if (e.key === 'Home') {
        next = min;
        e.preventDefault();
      } else if (e.key === 'End') {
        next = currentValues[1] - minSeparation;
        e.preventDefault();
      } else if (e.key === 'PageUp') {
        next = next + stepVal * 10;
        e.preventDefault();
      } else if (e.key === 'PageDown') {
        next = next - stepVal * 10;
        e.preventDefault();
      }
      const clamped = clamp(
        snapToStep(next, min, max, step),
        min,
        currentValues[1] - minSeparation
      );
      if (clamped !== currentValues[0]) {
        const nextVals: [number, number] = [clamped, currentValues[1]];
        setInternalValues(nextVals);
        onValueChange?.(nextVals);
        onSlidingComplete?.(nextVals);
      }
    },
    [
      disabled,
      step,
      max,
      min,
      currentValues,
      isRTL,
      minSeparation,
      onValueChange,
      onSlidingComplete,
    ]
  );

  const handleEndKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      const stepVal = step ?? (max - min) / 100;
      let next = currentValues[1];
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        next = isRTL ? next - stepVal : next + stepVal;
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        next = isRTL ? next + stepVal : next - stepVal;
        e.preventDefault();
      } else if (e.key === 'Home') {
        next = currentValues[0] + minSeparation;
        e.preventDefault();
      } else if (e.key === 'End') {
        next = max;
        e.preventDefault();
      } else if (e.key === 'PageUp') {
        next = next + stepVal * 10;
        e.preventDefault();
      } else if (e.key === 'PageDown') {
        next = next - stepVal * 10;
        e.preventDefault();
      }
      const clamped = clamp(
        snapToStep(next, min, max, step),
        currentValues[0] + minSeparation,
        max
      );
      if (clamped !== currentValues[1]) {
        const nextVals: [number, number] = [currentValues[0], clamped];
        setInternalValues(nextVals);
        onValueChange?.(nextVals);
        onSlidingComplete?.(nextVals);
      }
    },
    [
      disabled,
      step,
      max,
      min,
      currentValues,
      isRTL,
      minSeparation,
      onValueChange,
      onSlidingComplete,
    ]
  );

  const trackCornerRadius = trackHeight / 2 || DEFAULT_TRACK_CORNER_RADIUS;
  const travelWidth = Math.max(0, trackWidth - 2 * trackCornerRadius);

  const startRatio = getRatioFromValue(currentValues[0], min, max);
  const endRatio = getRatioFromValue(currentValues[1], min, max);

  const visualStartRatio = isRTL ? 1 - startRatio : startRatio;
  const visualEndRatio = isRTL ? 1 - endRatio : endRatio;

  const startThumbCenter = trackCornerRadius + visualStartRatio * travelWidth;
  const endThumbCenter = trackCornerRadius + visualEndRatio * travelWidth;

  const gap = thumbTrackGapSize;
  const halfThumb = DEFAULT_THUMB_WIDTH / 2;

  // Active track is between the two thumbs (with gap on each side)
  const leftEdge = Math.min(startThumbCenter, endThumbCenter);
  const rightEdge = Math.max(startThumbCenter, endThumbCenter);

  const activeLeft = leftEdge + halfThumb + gap;
  const activeWidth = Math.max(0, rightEdge - halfThumb - gap - activeLeft);

  // Inactive segments on the left and right
  const inactiveLeftWidth = Math.max(0, leftEdge - halfThumb - gap);
  const inactiveRightLeft = rightEdge + halfThumb + gap;
  const inactiveRightWidth = Math.max(0, trackWidth - inactiveRightLeft);

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

  const startThumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scaleX: withTiming(isInteractingStartSV.value ? 1.5 : 1, {
          duration: animDuration,
        }),
      },
    ],
  }));

  const endThumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scaleX: withTiming(isInteractingEndSV.value ? 1.5 : 1, {
          duration: animDuration,
        }),
      },
    ],
  }));

  const stateLayerStartAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(
      isInteractingStartSV.value ? 0.12 : isStartFocused ? 0.1 : 0,
      {
        duration: animDuration,
      }
    ),
    transform: [
      {
        scale: withTiming(
          isInteractingStartSV.value || isStartFocused ? 1 : 0.6,
          {
            duration: animDuration,
          }
        ),
      },
    ],
  }));

  const stateLayerEndAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(
      isInteractingEndSV.value ? 0.12 : isEndFocused ? 0.1 : 0,
      {
        duration: animDuration,
      }
    ),
    transform: [
      {
        scale: withTiming(isInteractingEndSV.value || isEndFocused ? 1 : 0.6, {
          duration: animDuration,
        }),
      },
    ],
  }));

  const valueIndicatorStartAnimatedStyle = useAnimatedStyle(() => {
    if (labelBehavior === 'visible') {
      return { opacity: 1, transform: [{ scale: 1 }] };
    }
    if (labelBehavior === 'gone') {
      return { opacity: 0, transform: [{ scale: 0 }] };
    }
    const show = isInteractingStartSV.value === 1 || isStartFocused;
    return {
      opacity: withTiming(show ? 1 : 0, { duration: animDuration }),
      transform: [
        {
          scale: withTiming(show ? 1 : 0.8, { duration: animDuration }),
        },
      ],
    };
  });

  const valueIndicatorEndAnimatedStyle = useAnimatedStyle(() => {
    if (labelBehavior === 'visible') {
      return { opacity: 1, transform: [{ scale: 1 }] };
    }
    if (labelBehavior === 'gone') {
      return { opacity: 0, transform: [{ scale: 0 }] };
    }
    const show = isInteractingEndSV.value === 1 || isEndFocused;
    return {
      opacity: withTiming(show ? 1 : 0, { duration: animDuration }),
      transform: [
        {
          scale: withTiming(show ? 1 : 0.8, { duration: animDuration }),
        },
      ],
    };
  });

  const tickMarks = React.useMemo(
    () => (showTickMarks ? getTickMarks(min, max, step) : []),
    [showTickMarks, min, max, step]
  );

  const startFormatted = formatValueIndicator
    ? formatValueIndicator(currentValues[0])
    : String(currentValues[0]);

  const endFormatted = formatValueIndicator
    ? formatValueIndicator(currentValues[1])
    : String(currentValues[1]);

  return (
    <View
      style={[
        styles.container,
        Platform.OS === 'web' ? webNoOutline : undefined,
        style,
      ]}
      testID={testID}
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

      {/* Main Track & Dual Thumbs Area */}
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
              {
                width: inactiveLeftWidth,
                height: trackHeight,
                backgroundColor: effectiveInactiveTrackColor,
                borderTopLeftRadius: trackCornerRadius,
                borderBottomLeftRadius: trackCornerRadius,
                borderTopRightRadius: TRACK_INSIDE_CORNER_RADIUS,
                borderBottomRightRadius: TRACK_INSIDE_CORNER_RADIUS,
              },
              disabled && styles.disabledInactiveTrack,
            ]}
          />
        ) : null}

        {/* Active Middle Track */}
        {trackWidth > 0 && activeWidth > 0 ? (
          <View
            style={[
              styles.segment,
              {
                left: activeLeft,
                width: activeWidth,
                height: trackHeight,
                backgroundColor: effectiveActiveTrackColor,
                borderRadius: TRACK_INSIDE_CORNER_RADIUS,
              },
              disabled && styles.disabledActiveTrack,
            ]}
          />
        ) : null}

        {/* Inactive Right Track */}
        {trackWidth > 0 && inactiveRightWidth > 0 ? (
          <View
            style={[
              styles.segment,
              {
                left: inactiveRightLeft,
                width: inactiveRightWidth,
                height: trackHeight,
                backgroundColor: effectiveInactiveTrackColor,
                borderTopLeftRadius: TRACK_INSIDE_CORNER_RADIUS,
                borderBottomLeftRadius: TRACK_INSIDE_CORNER_RADIUS,
                borderTopRightRadius: trackCornerRadius,
                borderBottomRightRadius: trackCornerRadius,
              },
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
                tickRatio >= startRatio && tickRatio <= endRatio;

              // Don't render ticks inside thumb gaps
              const distToStartThumb = Math.abs(tickPos - startThumbCenter);
              const distToEndThumb = Math.abs(tickPos - endThumbCenter);
              if (
                distToStartThumb < halfThumb + gap ||
                distToEndThumb < halfThumb + gap
              ) {
                return null;
              }

              const tickColor = isActiveTick
                ? defaultSliderColors.stopIndicatorActiveColor
                : defaultSliderColors.stopIndicatorInactiveColor;

              return (
                <View
                  key={idx}
                  style={[
                    styles.tickMark,
                    {
                      left: tickPos - STOP_INDICATOR_SIZE / 2,
                      top: (MIN_TOUCH_TARGET_SIZE - STOP_INDICATOR_SIZE) / 2,
                      backgroundColor: disabled
                        ? defaultSliderColors.disabledStopIndicatorColor
                        : tickColor,
                    },
                    disabled && styles.disabledStopIndicator,
                  ]}
                />
              );
            })
          : null}

        {/* Start State Layer & Thumb */}
        <Animated.View
          style={[
            styles.stateLayer,
            {
              left: startThumbCenter - STATE_LAYER_SIZE / 2,
              top: (MIN_TOUCH_TARGET_SIZE - STATE_LAYER_SIZE) / 2,
              backgroundColor: defaultSliderColors.stateLayerColor,
            },
            stateLayerStartAnimatedStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.thumb,
            {
              left: startThumbCenter - DEFAULT_THUMB_WIDTH / 2,
              top: (MIN_TOUCH_TARGET_SIZE - DEFAULT_THUMB_HEIGHT) / 2,
              backgroundColor: effectiveThumbColor,
            },
            startThumbAnimatedStyle,
            Platform.OS === 'web' ? webNoOutline : undefined,
            disabled && styles.disabledHandle,
          ]}
          accessible
          accessibilityRole="adjustable"
          role="slider"
          aria-label={startAccessibilityLabel}
          aria-valuemin={min}
          aria-valuemax={currentValues[1] - minSeparation}
          aria-valuenow={currentValues[0]}
          aria-valuetext={startFormatted}
          aria-disabled={disabled}
          accessibilityActions={[
            { name: 'increment', label: 'increment' },
            { name: 'decrement', label: 'decrement' },
          ]}
          onAccessibilityAction={handleStartAccessibilityAction}
          {...(Platform.OS === 'web'
            ? {
                focusable: !disabled,
                onFocus: () => setIsStartFocused(true),
                onBlur: () => setIsStartFocused(false),
                onKeyDown: handleStartKeyDown,
                tabIndex: disabled ? -1 : 0,
              }
            : {})}
        />
        {labelBehavior !== 'gone' ? (
          <View
            style={[
              styles.valueIndicatorAnchor,
              { left: startThumbCenter - startIndicatorWidth / 2 },
            ]}
            onLayout={handleStartIndicatorLayout}
            pointerEvents="none"
          >
            <Animated.View
              style={[
                styles.valueIndicator,
                {
                  backgroundColor:
                    defaultSliderColors.valueIndicatorContainerColor,
                },
                valueIndicatorStartAnimatedStyle,
              ]}
            >
              <Text
                variant="labelLarge"
                style={[
                  styles.valueIndicatorText,
                  { color: defaultSliderColors.valueIndicatorTextColor },
                ]}
              >
                {startFormatted}
              </Text>
            </Animated.View>
          </View>
        ) : null}

        {/* End State Layer & Thumb */}
        <Animated.View
          style={[
            styles.stateLayer,
            {
              left: endThumbCenter - STATE_LAYER_SIZE / 2,
              top: (MIN_TOUCH_TARGET_SIZE - STATE_LAYER_SIZE) / 2,
              backgroundColor: defaultSliderColors.stateLayerColor,
            },
            stateLayerEndAnimatedStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.thumb,
            {
              left: endThumbCenter - DEFAULT_THUMB_WIDTH / 2,
              top: (MIN_TOUCH_TARGET_SIZE - DEFAULT_THUMB_HEIGHT) / 2,
              backgroundColor: effectiveThumbColor,
            },
            endThumbAnimatedStyle,
            Platform.OS === 'web' ? webNoOutline : undefined,
            disabled && styles.disabledHandle,
          ]}
          accessible
          accessibilityRole="adjustable"
          role="slider"
          aria-label={endAccessibilityLabel}
          aria-valuemin={currentValues[0] + minSeparation}
          aria-valuemax={max}
          aria-valuenow={currentValues[1]}
          aria-valuetext={endFormatted}
          aria-disabled={disabled}
          accessibilityActions={[
            { name: 'increment', label: 'increment' },
            { name: 'decrement', label: 'decrement' },
          ]}
          onAccessibilityAction={handleEndAccessibilityAction}
          {...(Platform.OS === 'web'
            ? {
                focusable: !disabled,
                onFocus: () => setIsEndFocused(true),
                onBlur: () => setIsEndFocused(false),
                onKeyDown: handleEndKeyDown,
                tabIndex: disabled ? -1 : 0,
              }
            : {})}
        />
        {labelBehavior !== 'gone' ? (
          <View
            style={[
              styles.valueIndicatorAnchor,
              { left: endThumbCenter - endIndicatorWidth / 2 },
            ]}
            onLayout={handleEndIndicatorLayout}
            pointerEvents="none"
          >
            <Animated.View
              style={[
                styles.valueIndicator,
                {
                  backgroundColor:
                    defaultSliderColors.valueIndicatorContainerColor,
                },
                valueIndicatorEndAnimatedStyle,
              ]}
            >
              <Text
                variant="labelLarge"
                style={[
                  styles.valueIndicatorText,
                  { color: defaultSliderColors.valueIndicatorTextColor },
                ]}
              >
                {endFormatted}
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

export default RangeSlider;
