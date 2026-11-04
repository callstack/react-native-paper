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
  const distance = max - min;
  const animDuration = reduceMotion ? 0 : 150;
  const trackCornerRadius = trackHeight / 2 || DEFAULT_TRACK_CORNER_RADIUS;
  const travelWidth = Math.max(0, trackWidth - 2 * trackCornerRadius);
  const trackWidthSV = useSharedValue(0);
  const startValueSV = useSharedValue(currentValues[0]);
  const endValueSV = useSharedValue(currentValues[1]);
  const offsetSV = useSharedValue({ start: 0, end: 0 });
  const activeThumbSV = useSharedValue<{ start: boolean; end: boolean }>({
    start: false,
    end: false,
  });
  const lastEmittedValuesSV = useSharedValue<[number, number]>([
    currentValues[0],
    currentValues[1],
  ]);

  const px = useDerivedValue(() => {
    const travel = Math.max(0, trackWidthSV.value - 2 * trackCornerRadius);
    return distance > 0 ? travel / distance : 0;
  });

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
    if (!activeThumbSV.value.start && !activeThumbSV.value.end) {
      startValueSV.value = currentValues[0];
      endValueSV.value = currentValues[1];
    }
  }, [currentValues, startValueSV, endValueSV, activeThumbSV]);

  const notifySlidingStart = React.useCallback((vals: [number, number]) => {
    latestCallbacks.current.onSlidingStart?.(vals);
  }, []);

  const notifyValueChange = React.useCallback((vals: [number, number]) => {
    if (!latestCallbacks.current.isControlled) {
      setInternalValues(vals);
    }
    latestCallbacks.current.onValueChange?.(vals);
  }, []);

  const notifySlidingComplete = React.useCallback((vals: [number, number]) => {
    latestCallbacks.current.onSlidingComplete?.(vals);
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
      .onBegin((e) => {
        'worklet';
        const travel = Math.max(0, trackWidthSV.value - 2 * trackCornerRadius);
        if (travel <= 0 || distance <= 0) return;

        const curStart = startValueSV.value;
        const curEnd = endValueSV.value;

        // Record initial positions
        const startPx = clamp(curStart - min, 0, distance) * px.value;
        const endPx = clamp(curEnd - min, 0, distance) * px.value;
        offsetSV.value = { start: startPx, end: endPx };

        const startX = trackCornerRadius + (isRTL ? travel - startPx : startPx);
        const endX = trackCornerRadius + (isRTL ? travel - endPx : endPx);

        const distToStart = Math.abs(e.x - startX);
        const distToEnd = Math.abs(e.x - endX);
        const isStart =
          distToStart === distToEnd
            ? isRTL
              ? e.x > startX
              : e.x < startX
            : distToStart < distToEnd;

        activeThumbSV.value = {
          start: isStart,
          end: !isStart,
        };
      })
      .onStart(() => {
        'worklet';
        if (activeThumbSV.value.start) {
          isInteractingStartSV.value = withTiming(1, {
            duration: animDuration,
          });
        } else if (activeThumbSV.value.end) {
          isInteractingEndSV.value = withTiming(1, { duration: animDuration });
        }

        scheduleOnRN(notifySlidingStart, [
          startValueSV.value,
          endValueSV.value,
        ]);
      })
      .onUpdate((e) => {
        'worklet';
        if (px.value <= 0 || distance <= 0) return;

        let start: number | undefined;
        let end: number | undefined;
        const delta = isRTL ? -e.translationX : e.translationX;

        if (activeThumbSV.value.start) {
          const rawVal = min + (offsetSV.value.start + delta) / px.value;
          start = clamp(
            snapToStep(rawVal, min, max, step),
            min,
            endValueSV.value - minSeparation
          );
        }

        if (activeThumbSV.value.end) {
          const rawVal = min + (offsetSV.value.end + delta) / px.value;
          end = clamp(
            snapToStep(rawVal, min, max, step),
            startValueSV.value + minSeparation,
            max
          );
        }

        const nextStart = start ?? startValueSV.value;
        const nextEnd = end ?? endValueSV.value;

        if (nextStart !== startValueSV.value || nextEnd !== endValueSV.value) {
          startValueSV.value = nextStart;
          endValueSV.value = nextEnd;

          const threshold = step !== undefined ? 0 : distance / 200;
          if (
            Math.abs(nextStart - lastEmittedValuesSV.value[0]) >= threshold ||
            Math.abs(nextEnd - lastEmittedValuesSV.value[1]) >= threshold
          ) {
            lastEmittedValuesSV.value = [nextStart, nextEnd];
            scheduleOnRN(notifyValueChange, [nextStart, nextEnd]);
          }
        }
      })
      .onFinalize((_, success) => {
        'worklet';
        activeThumbSV.value = { start: false, end: false };
        isInteractingStartSV.value = withTiming(0, { duration: animDuration });
        isInteractingEndSV.value = withTiming(0, { duration: animDuration });

        if (success) {
          const finalValues: [number, number] = [
            startValueSV.value,
            endValueSV.value,
          ];
          if (
            finalValues[0] !== lastEmittedValuesSV.value[0] ||
            finalValues[1] !== lastEmittedValuesSV.value[1]
          ) {
            lastEmittedValuesSV.value = finalValues;
            scheduleOnRN(notifyValueChange, finalValues);
          }
          scheduleOnRN(notifySlidingComplete, finalValues);
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
    minSeparation,
    px,
    isRTL,
    startValueSV,
    endValueSV,
    activeThumbSV,
    offsetSV,
    lastEmittedValuesSV,
    isInteractingStartSV,
    isInteractingEndSV,
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
        if (isRTL) ratio = 1 - ratio;
        const tapVal = getValueFromRatio(ratio, min, max, step);

        const curStart = startValueSV.value;
        const curEnd = endValueSV.value;

        const distToStart = Math.abs(tapVal - curStart);
        const distToEnd = Math.abs(tapVal - curEnd);

        let nextStart = curStart;
        let nextEnd = curEnd;

        if (distToStart <= distToEnd) {
          nextStart = clamp(tapVal, min, curEnd - minSeparation);
        } else {
          nextEnd = clamp(tapVal, curStart + minSeparation, max);
        }

        const prevValues: [number, number] = [
          startValueSV.value,
          endValueSV.value,
        ];
        startValueSV.value = nextStart;
        endValueSV.value = nextEnd;
        lastEmittedValuesSV.value = [nextStart, nextEnd];
        scheduleOnRN(notifySlidingStart, prevValues);
        scheduleOnRN(notifyValueChange, [nextStart, nextEnd]);
        scheduleOnRN(notifySlidingComplete, [nextStart, nextEnd]);
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
    minSeparation,
    startValueSV,
    endValueSV,
    lastEmittedValuesSV,
    notifySlidingStart,
    notifyValueChange,
    notifySlidingComplete,
  ]);

  const gesture = React.useMemo(
    () => Gesture.Race(panGesture, tapGesture),
    [panGesture, tapGesture]
  );

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
      if (e.key === 'ArrowRight') {
        next = isRTL ? next - stepVal : next + stepVal;
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        next = isRTL ? next + stepVal : next - stepVal;
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        next = next + stepVal;
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        next = next - stepVal;
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
      isRTL,
      minSeparation,
      isControlled,
      onValueChange,
      onSlidingComplete,
    ]
  );

  const handleEndKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      const stepVal = step ?? (max - min) / 100;
      let next = currentValues[1];
      if (e.key === 'ArrowRight') {
        next = isRTL ? next - stepVal : next + stepVal;
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        next = isRTL ? next + stepVal : next - stepVal;
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        next = next + stepVal;
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        next = next - stepVal;
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
      isRTL,
      minSeparation,
      isControlled,
      onValueChange,
      onSlidingComplete,
    ]
  );

  const startRatio = getRatioFromValue(currentValues[0], min, max);
  const endRatio = getRatioFromValue(currentValues[1], min, max);

  const startThumbCenter = trackCornerRadius + startRatio * travelWidth;
  const endThumbCenter = trackCornerRadius + endRatio * travelWidth;

  const gap = thumbTrackGapSize;
  const halfThumb = DEFAULT_THUMB_WIDTH / 2;

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

  const startThumbAnimatedStyle = useAnimatedStyle(() => {
    const val = startValueSV.value;
    const radius = trackCornerRadius;
    const travel = travelWidth;
    const r =
      travel > 0 && max > min ? clamp((val - min) / (max - min), 0, 1) : 0;
    const center = radius + r * travel;
    return {
      left: center - DEFAULT_THUMB_WIDTH / 2,
      transform: [
        {
          scaleX: 1 + 0.5 * isInteractingStartSV.value,
        },
      ],
    };
  }, [travelWidth, trackCornerRadius, min, max]);

  const endThumbAnimatedStyle = useAnimatedStyle(() => {
    const val = endValueSV.value;
    const radius = trackCornerRadius;
    const travel = travelWidth;
    const r =
      travel > 0 && max > min ? clamp((val - min) / (max - min), 0, 1) : 0;
    const center = radius + r * travel;
    return {
      left: center - DEFAULT_THUMB_WIDTH / 2,
      transform: [
        {
          scaleX: 1 + 0.5 * isInteractingEndSV.value,
        },
      ],
    };
  }, [travelWidth, trackCornerRadius, min, max]);

  const stateLayerStartAnimatedStyle = useAnimatedStyle(() => {
    const val = startValueSV.value;
    const radius = trackCornerRadius;
    const travel = travelWidth;
    const r =
      travel > 0 && max > min ? clamp((val - min) / (max - min), 0, 1) : 0;
    const center = radius + r * travel;
    return {
      left: center - STATE_LAYER_SIZE / 2,
      opacity:
        isInteractingStartSV.value * 0.12 +
        (1 - isInteractingStartSV.value) * (isStartFocused ? 0.1 : 0),
      transform: [
        {
          scale:
            0.6 +
            0.4 * (isInteractingStartSV.value || (isStartFocused ? 1 : 0)),
        },
      ],
    };
  }, [travelWidth, trackCornerRadius, min, max, isStartFocused]);

  const stateLayerEndAnimatedStyle = useAnimatedStyle(() => {
    const val = endValueSV.value;
    const radius = trackCornerRadius;
    const travel = travelWidth;
    const r =
      travel > 0 && max > min ? clamp((val - min) / (max - min), 0, 1) : 0;
    const center = radius + r * travel;
    return {
      left: center - STATE_LAYER_SIZE / 2,
      opacity:
        isInteractingEndSV.value * 0.12 +
        (1 - isInteractingEndSV.value) * (isEndFocused ? 0.1 : 0),
      transform: [
        {
          scale:
            0.6 + 0.4 * (isInteractingEndSV.value || (isEndFocused ? 1 : 0)),
        },
      ],
    };
  }, [travelWidth, trackCornerRadius, min, max, isEndFocused]);

  const inactiveLeftTrackAnimatedStyle = useAnimatedStyle(() => {
    const sVal = startValueSV.value;
    const radius = trackCornerRadius;
    const travel = travelWidth;
    const sR =
      travel > 0 && max > min ? clamp((sVal - min) / (max - min), 0, 1) : 0;
    const sCenter = radius + sR * travel;
    return {
      width: Math.max(0, sCenter - halfThumb - gap),
    };
  }, [travelWidth, trackCornerRadius, min, max, halfThumb, gap]);

  const activeMiddleTrackAnimatedStyle = useAnimatedStyle(() => {
    const sVal = startValueSV.value;
    const eVal = endValueSV.value;
    const radius = trackCornerRadius;
    const travel = travelWidth;
    const sR =
      travel > 0 && max > min ? clamp((sVal - min) / (max - min), 0, 1) : 0;
    const eR =
      travel > 0 && max > min ? clamp((eVal - min) / (max - min), 0, 1) : 0;
    const sCenter = radius + sR * travel;
    const eCenter = radius + eR * travel;
    const left = sCenter + halfThumb + gap;
    return {
      left,
      width: Math.max(0, eCenter - halfThumb - gap - left),
    };
  }, [travelWidth, trackCornerRadius, min, max, halfThumb, gap]);

  const inactiveRightTrackAnimatedStyle = useAnimatedStyle(() => {
    const eVal = endValueSV.value;
    const radius = trackCornerRadius;
    const travel = travelWidth;
    const eR =
      travel > 0 && max > min ? clamp((eVal - min) / (max - min), 0, 1) : 0;
    const eCenter = radius + eR * travel;
    const left = eCenter + halfThumb + gap;
    return {
      left,
      width: Math.max(0, trackWidth - left),
    };
  }, [trackWidth, travelWidth, trackCornerRadius, min, max, halfThumb, gap]);

  const startValueIndicatorAnchorAnimatedStyle = useAnimatedStyle(() => {
    const val = startValueSV.value;
    const radius = trackCornerRadius;
    const travel = travelWidth;
    const r =
      travel > 0 && max > min ? clamp((val - min) / (max - min), 0, 1) : 0;
    const center = radius + r * travel;
    return {
      left: center - startIndicatorWidth / 2,
    };
  }, [travelWidth, trackCornerRadius, min, max, startIndicatorWidth]);

  const endValueIndicatorAnchorAnimatedStyle = useAnimatedStyle(() => {
    const val = endValueSV.value;
    const radius = trackCornerRadius;
    const travel = travelWidth;
    const r =
      travel > 0 && max > min ? clamp((val - min) / (max - min), 0, 1) : 0;
    const center = radius + r * travel;
    return {
      left: center - endIndicatorWidth / 2,
    };
  }, [travelWidth, trackCornerRadius, min, max, endIndicatorWidth]);

  const valueIndicatorStartAnimatedStyle = useAnimatedStyle(() => {
    if (labelBehavior === 'visible') {
      return { opacity: 1, transform: [{ scale: 1 }] };
    }
    if (labelBehavior === 'gone') {
      return { opacity: 0, transform: [{ scale: 0 }] };
    }
    const show = isInteractingStartSV.value > 0 || isStartFocused;
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
    const show = isInteractingEndSV.value > 0 || isEndFocused;
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
                {
                  top: (MIN_TOUCH_TARGET_SIZE - trackHeight) / 2,
                  height: trackHeight,
                  backgroundColor: effectiveInactiveTrackColor,
                  borderTopStartRadius: trackCornerRadius,
                  borderBottomStartRadius: trackCornerRadius,
                  borderTopEndRadius: TRACK_INSIDE_CORNER_RADIUS,
                  borderBottomEndRadius: TRACK_INSIDE_CORNER_RADIUS,
                },
                inactiveLeftTrackAnimatedStyle,
                disabled && styles.disabledInactiveTrack,
              ]}
            />
          ) : null}

          {/* Active Middle Track */}
          {trackWidth > 0 ? (
            <Animated.View
              style={[
                styles.segment,
                {
                  top: (MIN_TOUCH_TARGET_SIZE - trackHeight) / 2,
                  height: trackHeight,
                  backgroundColor: effectiveActiveTrackColor,
                  borderRadius: TRACK_INSIDE_CORNER_RADIUS,
                },
                activeMiddleTrackAnimatedStyle,
                disabled && styles.disabledActiveTrack,
              ]}
            />
          ) : null}

          {/* Inactive Right Track */}
          {trackWidth > 0 ? (
            <Animated.View
              style={[
                styles.segment,
                {
                  top: (MIN_TOUCH_TARGET_SIZE - trackHeight) / 2,
                  height: trackHeight,
                  backgroundColor: effectiveInactiveTrackColor,
                  borderTopStartRadius: TRACK_INSIDE_CORNER_RADIUS,
                  borderBottomStartRadius: TRACK_INSIDE_CORNER_RADIUS,
                  borderTopEndRadius: trackCornerRadius,
                  borderBottomEndRadius: trackCornerRadius,
                },
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
            <Animated.View
              style={[
                styles.valueIndicatorAnchor,
                { left: startThumbCenter - startIndicatorWidth / 2 },
                startValueIndicatorAnchorAnimatedStyle,
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
            </Animated.View>
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
            <Animated.View
              style={[
                styles.valueIndicatorAnchor,
                { left: endThumbCenter - endIndicatorWidth / 2 },
                endValueIndicatorAnchorAnimatedStyle,
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

export default RangeSlider;
