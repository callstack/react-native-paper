import * as React from 'react';
import {
  type LayoutChangeEvent,
  Platform,
  StyleSheet,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

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
  const distance = max - min;
  const animDuration = reduceMotion ? 0 : 150;
  const trackCornerRadius = trackHeight / 2 || DEFAULT_TRACK_CORNER_RADIUS;
  const travelWidth = Math.max(0, trackWidth - 2 * trackCornerRadius);
  const trackWidthSV = useSharedValue(0);
  const currentValueSV = useSharedValue(currentValue);
  const offsetSV = useSharedValue(0);
  const lastEmittedValueSV = useSharedValue(currentValue);

  const px = useDerivedValue(() => {
    const travel = Math.max(0, trackWidthSV.value - 2 * trackCornerRadius);
    return distance > 0 ? travel / distance : 0;
  });

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
    isControlled,
  });

  React.useEffect(() => {
    latestCallbacks.current = {
      onValueChange,
      onSlidingStart,
      onSlidingComplete,
      isControlled,
    };
  });

  React.useEffect(() => {
    if (!isInteractingSV.value) {
      currentValueSV.value = currentValue;
    }
  }, [currentValue, currentValueSV, isInteractingSV]);

  const notifySlidingStart = React.useCallback((val: number) => {
    latestCallbacks.current.onSlidingStart?.(val);
  }, []);

  const notifyValueChange = React.useCallback((val: number) => {
    if (!latestCallbacks.current.isControlled) {
      setInternalValue(val);
    }
    latestCallbacks.current.onValueChange?.(val);
  }, []);

  const notifySlidingComplete = React.useCallback((val: number) => {
    latestCallbacks.current.onSlidingComplete?.(val);
  }, []);

  const onTrackLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      const { width } = e.nativeEvent.layout;
      setTrackWidth(width);
      trackWidthSV.value = width;
    },
    [trackWidthSV]
  );

  const panGesture = React.useMemo(() => {
    return Gesture.Pan()
      .enabled(!disabled)
      .activeOffsetX([-10, 10])
      .failOffsetY([-10, 10])
      .onBegin(() => {
        'worklet';
        const travel = Math.max(0, trackWidthSV.value - 2 * trackCornerRadius);
        if (travel <= 0 || distance <= 0) return;

        // Record initial thumb position in pixels
        const initialVal = currentValueSV.value;
        const currentPx = clamp(initialVal - min, 0, distance) * px.value;
        offsetSV.value = currentPx;
      })
      .onStart(() => {
        'worklet';
        isInteractingSV.value = withTiming(1, { duration: animDuration });
        scheduleOnRN(notifySlidingStart, currentValueSV.value);
      })
      .onUpdate((e) => {
        'worklet';
        if (px.value <= 0 || distance <= 0) return;

        const delta = isRTL ? -e.translationX : e.translationX;
        const rawVal = min + (offsetSV.value + delta) / px.value;
        const nextVal = snapToStep(rawVal, min, max, step);

        if (nextVal !== currentValueSV.value) {
          currentValueSV.value = nextVal;

          const threshold = step !== undefined ? 0 : distance / 200;
          if (Math.abs(nextVal - lastEmittedValueSV.value) >= threshold) {
            lastEmittedValueSV.value = nextVal;
            scheduleOnRN(notifyValueChange, nextVal);
          }
        }
      })
      .onFinalize((_, success) => {
        'worklet';
        isInteractingSV.value = withTiming(0, { duration: animDuration });
        if (success) {
          if (currentValueSV.value !== lastEmittedValueSV.value) {
            lastEmittedValueSV.value = currentValueSV.value;
            scheduleOnRN(notifyValueChange, currentValueSV.value);
          }
          scheduleOnRN(notifySlidingComplete, currentValueSV.value);
        }
      });
  }, [
    disabled,
    trackCornerRadius,
    trackWidthSV,
    distance,
    animDuration,
    min,
    max,
    step,
    px,
    isRTL,
    currentValueSV,
    offsetSV,
    lastEmittedValueSV,
    isInteractingSV,
    notifySlidingStart,
    notifyValueChange,
    notifySlidingComplete,
  ]);

  const tapGesture = React.useMemo(() => {
    return Gesture.Tap()
      .enabled(!disabled)
      .maxDistance(5)
      .onEnd((e) => {
        'worklet';
        const travel = Math.max(0, trackWidthSV.value - 2 * trackCornerRadius);
        if (travel <= 0 || distance <= 0) return;

        let ratio = clamp((e.x - trackCornerRadius) / travel, 0, 1);
        if (isRTL) {
          ratio = 1 - ratio;
        }
        const prevVal = currentValueSV.value;
        const nextVal = getValueFromRatio(ratio, min, max, step);
        currentValueSV.value = nextVal;
        lastEmittedValueSV.value = nextVal;
        scheduleOnRN(notifySlidingStart, prevVal);
        scheduleOnRN(notifyValueChange, nextVal);
        scheduleOnRN(notifySlidingComplete, nextVal);
      });
  }, [
    disabled,
    trackCornerRadius,
    trackWidthSV,
    distance,
    isRTL,
    min,
    max,
    step,
    currentValueSV,
    lastEmittedValueSV,
    notifySlidingStart,
    notifyValueChange,
    notifySlidingComplete,
  ]);

  const gesture = React.useMemo(
    () => Gesture.Race(panGesture, tapGesture),
    [panGesture, tapGesture]
  );

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

      if (e.key === 'ArrowRight') {
        next = isRTL ? currentValue - stepVal : currentValue + stepVal;
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        next = isRTL ? currentValue + stepVal : currentValue - stepVal;
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        next = currentValue + stepVal;
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        next = currentValue - stepVal;
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
      isRTL,
      isControlled,
      onValueChange,
      onSlidingComplete,
    ]
  );

  const ratio = getRatioFromValue(currentValue, min, max);
  const thumbCenter = trackCornerRadius + ratio * travelWidth;

  const effectiveOrigin = centered
    ? (customOrigin ?? (min + max) / 2)
    : undefined;
  const originRatio =
    effectiveOrigin !== undefined
      ? getRatioFromValue(effectiveOrigin, min, max)
      : 0;
  const originCenter = trackCornerRadius + originRatio * travelWidth;

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

  const gap = thumbTrackGapSize;
  const halfThumb = DEFAULT_THUMB_WIDTH / 2;

  const stateLayerAnimatedStyle = useAnimatedStyle(() => {
    const val = currentValueSV.value;
    const radius = trackCornerRadius;
    const travel = travelWidth;
    const r =
      travel > 0 && max > min ? clamp((val - min) / (max - min), 0, 1) : 0;
    const center = radius + r * travel;
    return {
      left: center - STATE_LAYER_SIZE / 2,
      opacity:
        isInteractingSV.value * 0.12 +
        (1 - isInteractingSV.value) * (isFocused ? 0.1 : 0),
      transform: [
        {
          scale: 0.6 + 0.4 * (isInteractingSV.value || (isFocused ? 1 : 0)),
        },
      ],
    };
  }, [travelWidth, trackCornerRadius, min, max, isFocused]);

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const val = currentValueSV.value;
    const radius = trackCornerRadius;
    const travel = travelWidth;
    const r =
      travel > 0 && max > min ? clamp((val - min) / (max - min), 0, 1) : 0;
    const center = radius + r * travel;
    return {
      left: center - DEFAULT_THUMB_WIDTH / 2,
      transform: [
        {
          scaleX: 1 + 0.5 * isInteractingSV.value,
        },
      ],
    };
  }, [travelWidth, trackCornerRadius, min, max]);

  const activeTrackAnimatedStyle = useAnimatedStyle(() => {
    const val = currentValueSV.value;
    const radius = trackCornerRadius;
    const travel = travelWidth;
    const r =
      travel > 0 && max > min ? clamp((val - min) / (max - min), 0, 1) : 0;
    const center = radius + r * travel;

    let left = 0;
    let width = 0;

    if (effectiveOrigin !== undefined) {
      const oRatio =
        max > min ? clamp((effectiveOrigin - min) / (max - min), 0, 1) : 0;
      const oCenter = radius + oRatio * travel;

      if (center >= oCenter) {
        left = oCenter;
        width = Math.max(0, center - oCenter - halfThumb - gap);
      } else {
        left = center + halfThumb + gap;
        width = Math.max(0, oCenter - left);
      }
    } else {
      left = 0;
      width = Math.max(0, center - halfThumb - gap);
    }

    return {
      left,
      width,
    };
  }, [
    travelWidth,
    trackCornerRadius,
    min,
    max,
    effectiveOrigin,
    halfThumb,
    gap,
  ]);

  const inactiveLeftTrackAnimatedStyle = useAnimatedStyle(() => {
    const val = currentValueSV.value;
    const radius = trackCornerRadius;
    const travel = travelWidth;
    const r =
      travel > 0 && max > min ? clamp((val - min) / (max - min), 0, 1) : 0;
    const center = radius + r * travel;

    let width = 0;

    if (effectiveOrigin !== undefined) {
      const oRatio =
        max > min ? clamp((effectiveOrigin - min) / (max - min), 0, 1) : 0;
      const oCenter = radius + oRatio * travel;

      if (center >= oCenter) {
        width =
          center - halfThumb - gap < oCenter
            ? Math.max(0, center - halfThumb - gap)
            : oCenter;
      } else {
        width = Math.max(0, center - halfThumb - gap);
      }
    }

    return {
      width,
    };
  }, [
    travelWidth,
    trackCornerRadius,
    min,
    max,
    effectiveOrigin,
    halfThumb,
    gap,
  ]);

  const inactiveRightTrackAnimatedStyle = useAnimatedStyle(() => {
    const val = currentValueSV.value;
    const radius = trackCornerRadius;
    const travel = travelWidth;
    const r =
      travel > 0 && max > min ? clamp((val - min) / (max - min), 0, 1) : 0;
    const center = radius + r * travel;

    let left = 0;
    let width = 0;

    if (effectiveOrigin !== undefined) {
      const oRatio =
        max > min ? clamp((effectiveOrigin - min) / (max - min), 0, 1) : 0;
      const oCenter = radius + oRatio * travel;

      if (center >= oCenter) {
        left = center + halfThumb + gap;
        width = Math.max(0, trackWidth - left);
      } else {
        const start =
          center + halfThumb + gap > oCenter
            ? center + halfThumb + gap
            : oCenter;
        left = start;
        width = Math.max(0, trackWidth - left);
      }
    } else {
      left = center + halfThumb + gap;
      width = Math.max(0, trackWidth - left);
    }

    return {
      left,
      width,
    };
  }, [
    trackWidth,
    travelWidth,
    trackCornerRadius,
    min,
    max,
    effectiveOrigin,
    halfThumb,
    gap,
  ]);

  const valueIndicatorAnchorAnimatedStyle = useAnimatedStyle(() => {
    const val = currentValueSV.value;
    const radius = trackCornerRadius;
    const travel = travelWidth;
    const r =
      travel > 0 && max > min ? clamp((val - min) / (max - min), 0, 1) : 0;
    const center = radius + r * travel;
    return {
      left: center - indicatorWidth / 2,
    };
  }, [travelWidth, trackCornerRadius, min, max, indicatorWidth]);

  const valueIndicatorAnimatedStyle = useAnimatedStyle(() => {
    if (labelBehavior === 'visible') {
      return { opacity: 1, transform: [{ scale: 1 }] };
    }
    if (labelBehavior === 'gone') {
      return { opacity: 0, transform: [{ scale: 0 }] };
    }
    const show = isInteractingSV.value > 0 || isFocused;
    return {
      opacity: withTiming(show ? 1 : 0, { duration: animDuration }),
      transform: [
        {
          scale: withTiming(show ? 1 : 0.8, { duration: animDuration }),
        },
      ],
    };
  });

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
        borderTopStartRadius: trackCornerRadius,
        borderBottomStartRadius: trackCornerRadius,
        borderTopEndRadius: TRACK_INSIDE_CORNER_RADIUS,
        borderBottomEndRadius: TRACK_INSIDE_CORNER_RADIUS,
      };

      inactiveRightLeft = thumbCenter + halfThumb + gap;
      inactiveRightWidth = Math.max(0, trackWidth - inactiveRightLeft);
      inactiveRightRadius = {
        borderTopStartRadius: TRACK_INSIDE_CORNER_RADIUS,
        borderBottomStartRadius: TRACK_INSIDE_CORNER_RADIUS,
        borderTopEndRadius: trackCornerRadius,
        borderBottomEndRadius: trackCornerRadius,
      };
    } else {
      activeLeft = thumbCenter + halfThumb + gap;
      activeWidth = Math.max(0, originCenter - activeLeft);
      activeBorderRadius = {
        borderRadius: TRACK_INSIDE_CORNER_RADIUS,
      };

      inactiveLeftWidth = Math.max(0, thumbCenter - halfThumb - gap);
      inactiveLeftRadius = {
        borderTopStartRadius: trackCornerRadius,
        borderBottomStartRadius: trackCornerRadius,
        borderTopEndRadius: TRACK_INSIDE_CORNER_RADIUS,
        borderBottomEndRadius: TRACK_INSIDE_CORNER_RADIUS,
      };

      const inactiveRightStart =
        thumbCenter + halfThumb + gap > originCenter
          ? thumbCenter + halfThumb + gap
          : originCenter;
      inactiveRightLeft = inactiveRightStart;
      inactiveRightWidth = Math.max(0, trackWidth - inactiveRightLeft);
      inactiveRightRadius = {
        borderTopStartRadius: TRACK_INSIDE_CORNER_RADIUS,
        borderBottomStartRadius: TRACK_INSIDE_CORNER_RADIUS,
        borderTopEndRadius: trackCornerRadius,
        borderBottomEndRadius: trackCornerRadius,
      };
    }
  } else {
    activeLeft = 0;
    activeWidth = Math.max(0, thumbCenter - halfThumb - gap);
    activeBorderRadius = {
      borderTopStartRadius: trackCornerRadius,
      borderBottomStartRadius: trackCornerRadius,
      borderTopEndRadius: TRACK_INSIDE_CORNER_RADIUS,
      borderBottomEndRadius: TRACK_INSIDE_CORNER_RADIUS,
    };

    inactiveRightLeft = thumbCenter + halfThumb + gap;
    inactiveRightWidth = Math.max(0, trackWidth - inactiveRightLeft);
    inactiveRightRadius = {
      borderTopStartRadius: TRACK_INSIDE_CORNER_RADIUS,
      borderBottomStartRadius: TRACK_INSIDE_CORNER_RADIUS,
      borderTopEndRadius: trackCornerRadius,
      borderBottomEndRadius: trackCornerRadius,
    };
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
    top: (MIN_TOUCH_TARGET_SIZE - trackHeight) / 2,
    height: trackHeight,
    width: inactiveLeftWidth,
    backgroundColor: effectiveInactiveTrackColor,
    ...inactiveLeftRadius,
  };

  const activeTrackDynamicStyle = {
    top: (MIN_TOUCH_TARGET_SIZE - trackHeight) / 2,
    height: trackHeight,
    left: activeLeft,
    width: activeWidth,
    backgroundColor: effectiveActiveTrackColor,
    ...activeBorderRadius,
  };

  const inactiveRightTrackDynamicStyle = {
    top: (MIN_TOUCH_TARGET_SIZE - trackHeight) / 2,
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
      <GestureDetector gesture={gesture}>
        <Animated.View
          collapsable={false}
          style={styles.touchArea}
          onLayout={onTrackLayout}
        >
          {/* Inactive Left Track */}
          {trackWidth > 0 ? (
            <Animated.View
              style={[
                styles.segment,
                styles.inactiveLeftSegment,
                inactiveLeftTrackDynamicStyle,
                inactiveLeftTrackAnimatedStyle,
                disabled && styles.disabledInactiveTrack,
              ]}
            />
          ) : null}

          {/* Active Track Highlight Segment */}
          {trackWidth > 0 ? (
            <Animated.View
              style={[
                styles.segment,
                activeTrackDynamicStyle,
                activeTrackAnimatedStyle,
                disabled && styles.disabledActiveTrack,
              ]}
            />
          ) : null}

          {/* Inactive Right Track */}
          {trackWidth > 0 ? (
            <Animated.View
              style={[
                styles.segment,
                inactiveRightTrackDynamicStyle,
                inactiveRightTrackAnimatedStyle,
                disabled && styles.disabledInactiveTrack,
              ]}
            />
          ) : null}

          {/* Stop Indicators (Tick Marks) */}
          {trackWidth > 0 && tickMarks.length > 0
            ? tickMarks.map((tickRatio, idx) => {
                const tickPos = trackCornerRadius + tickRatio * travelWidth;
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
            <Animated.View
              style={[
                styles.valueIndicatorAnchor,
                valueIndicatorAnchorDynamicStyle,
                valueIndicatorAnchorAnimatedStyle,
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
            </Animated.View>
          ) : null}
        </Animated.View>
      </GestureDetector>

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
    top: (MIN_TOUCH_TARGET_SIZE - DEFAULT_TRACK_HEIGHT) / 2,
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
