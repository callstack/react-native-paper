import * as React from 'react';
import {
  PanResponder,
  StyleSheet,
  View,
  type ColorValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  BETWEEN_HANDLE_SPACE,
  DISABLED_CONTENT_OPACITY,
  DISABLED_INACTIVE_OPACITY,
  INNER_CORNER_RADIUS,
  SIZE_SPECS,
  STOP_SIZE,
  VALUE_INDICATOR_BOTTOM_SPACE,
  VALUE_INDICATOR_SIZE,
  SliderTokens,
  type SliderSize,
} from './tokens';
import {
  fractionToValue,
  nearestHandle,
  positionToFraction,
  stopFractions,
  valueToFraction,
} from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { ThemeProp } from '../../types';
import useLayout from '../../utils/useLayout';
import Icon, { type IconSource } from '../Icon';
import Text from '../Typography/Text';

type BaseProps = {
  min?: number;
  max?: number;
  step?: number;
  size?: SliderSize;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  icon?: IconSource;
  showStops?: boolean;
  showValueIndicator?: boolean;
  valueIndicatorLabel?: (v: number) => string;
  color?: ColorValue;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  theme?: ThemeProp;
  accessibilityLabel?: string;
};

type StandardProps = BaseProps & {
  variant?: 'standard';
  value: number;
  onValueChange?: (v: number) => void;
  onSlidingStart?: (v: number) => void;
  onSlidingComplete?: (v: number) => void;
};

type CenteredProps = BaseProps & {
  variant: 'centered';
  value: number;
  onValueChange?: (v: number) => void;
  onSlidingStart?: (v: number) => void;
  onSlidingComplete?: (v: number) => void;
};

type RangeProps = BaseProps & {
  variant: 'range';
  value: [number, number];
  onValueChange?: (v: [number, number]) => void;
  onSlidingStart?: (v: [number, number]) => void;
  onSlidingComplete?: (v: [number, number]) => void;
};

export type Props = StandardProps | CenteredProps | RangeProps;

/**
 * Material 3 slider for selecting a value from a range.
 * Supports standard, centered, and range variants.
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
const Slider = (props: Props) => {
  const {
    min = 0,
    max = 100,
    step = 0,
    size = 's',
    orientation = 'horizontal',
    disabled = false,
    icon,
    showStops = false,
    showValueIndicator = false,
    valueIndicatorLabel,
    color,
    style,
    testID,
    theme: themeOverrides,
    accessibilityLabel,
  } = props;

  const variant = props.variant ?? 'standard';
  const isRange = variant === 'range';

  const theme = useInternalTheme(themeOverrides);
  const reduceMotion = useReduceMotion();
  const { direction } = useLocale();
  const isRTL = direction === 'rtl';
  const isVertical = orientation === 'vertical';

  const spec = SIZE_SPECS[size];

  const colors = React.useMemo(() => {
    const t = SliderTokens.colors;
    const c = theme.colors;
    return {
      activeTrack: color ?? c[t.activeTrack],
      inactiveTrack: c[t.inactiveTrack],
      handle: color ?? c[t.handle],
      stopOnActive: c[t.stopOnActive],
      stopOnInactive: c[t.stopOnInactive],
      valueIndicatorBg: c[t.valueIndicatorBg],
      valueIndicatorText: c[t.valueIndicatorText],
      disabledContent: c[t.disabledContent],
    };
  }, [theme, color]);

  const reanimatedReduceMotion = reduceMotion
    ? ReduceMotion.Always
    : ReduceMotion.Never;

  const timingConfig = React.useMemo(
    () => ({ duration: 100, reduceMotion: reanimatedReduceMotion }),
    [reanimatedReduceMotion]
  );

  const initialEndValue = isRange
    ? (props as RangeProps).value[1]
    : (props as StandardProps | CenteredProps).value;
  const initialStartValue = isRange ? (props as RangeProps).value[0] : min;

  const [endValue, setEndValue] = React.useState(initialEndValue);
  const [startValue, setStartValue] = React.useState(initialStartValue);
  const [indicatorDisplayValue, setIndicatorDisplayValue] =
    React.useState(initialEndValue);

  React.useEffect(() => {
    if (isRange) {
      const [s, e] = (props as RangeProps).value;
      setStartValue(s);
      setEndValue(e);
    } else {
      const v = (props as StandardProps | CenteredProps).value;
      setEndValue(v);
    }
  }, [props, isRange]);

  const [layout, onLayout] = useLayout();
  const trackLength = isVertical ? layout.height : layout.width;

  // Extra space above the track for the value indicator bubble (horizontal only)
  const verticalOffset =
    showValueIndicator && !isVertical
      ? VALUE_INDICATOR_SIZE + VALUE_INDICATOR_BOTTOM_SPACE
      : 0;

  const trackLengthSV = useSharedValue(0);
  const endFractionSV = useSharedValue(valueToFraction(endValue, min, max));
  const startFractionSV = useSharedValue(valueToFraction(startValue, min, max));
  const endHandleWidthSV = useSharedValue(spec.handleWidth);
  const startHandleWidthSV = useSharedValue(spec.handleWidth);
  const valueIndicatorAlphaSV = useSharedValue(0);

  React.useEffect(() => {
    trackLengthSV.value = trackLength;
  }, [trackLength, trackLengthSV]);

  React.useEffect(() => {
    if (!isRange) {
      endFractionSV.value = valueToFraction(endValue, min, max);
    }
  }, [endValue, min, max, isRange, endFractionSV]);

  React.useEffect(() => {
    if (isRange) {
      startFractionSV.value = valueToFraction(startValue, min, max);
      endFractionSV.value = valueToFraction(endValue, min, max);
    }
  }, [startValue, endValue, min, max, isRange, startFractionSV, endFractionSV]);

  // gap = half handle width + between-handle space
  const trackHandleOffset = spec.handleWidth / 2 + BETWEEN_HANDLE_SPACE;

  // Active track: gaps on handle sides, 2dp inner corners
  const activeTrackAnimStyle = useAnimatedStyle(() => {
    const vf = endFractionSV.value;
    const sf = startFractionSV.value;
    const len = trackLengthSV.value;
    const gap = trackHandleOffset;

    if (isVertical) {
      let bottom: number;
      let height: number;

      if (variant === 'range') {
        const lo = Math.min(sf, vf);
        const hi = Math.max(sf, vf);
        bottom = lo * len + gap;
        height = Math.max(0, (hi - lo) * len - 2 * gap);
      } else if (variant === 'centered') {
        if (vf >= 0.5) {
          bottom = 0.5 * len;
          height = Math.max(0, (vf - 0.5) * len - gap);
        } else {
          bottom = vf * len + gap;
          height = Math.max(0, (0.5 - vf) * len - gap);
        }
      } else {
        bottom = 0;
        height = Math.max(0, vf * len - gap);
      }

      return {
        bottom,
        height,
        top: undefined,
        left: 0,
        right: 0,
        width: undefined,
      };
    }

    let left: number;
    let width: number;

    if (variant === 'range') {
      const lo = Math.min(sf, vf);
      const hi = Math.max(sf, vf);
      left = lo * len + gap;
      width = Math.max(0, (hi - lo) * len - 2 * gap);
    } else if (variant === 'centered') {
      if (vf >= 0.5) {
        left = 0.5 * len;
        width = Math.max(0, (vf - 0.5) * len - gap);
      } else {
        left = vf * len + gap;
        width = Math.max(0, (0.5 - vf) * len - gap);
      }
    } else {
      left = 0;
      width = Math.max(0, vf * len - gap);
    }

    return {
      left,
      width,
      top: 0,
      bottom: 0,
      right: undefined,
      height: undefined,
    };
  });

  // Right inactive track: from (handle + gap) to track end, 2dp inner left corners
  const rightInactiveAnimStyle = useAnimatedStyle(() => {
    const vf = endFractionSV.value;
    const sf = startFractionSV.value;
    const len = trackLengthSV.value;
    const gap = trackHandleOffset;

    if (isVertical) {
      let height: number;
      if (variant === 'range') {
        const hi = Math.max(sf, vf);
        height = Math.max(0, (1 - hi) * len - gap);
      } else if (variant === 'centered') {
        height =
          vf >= 0.5
            ? Math.max(0, (1 - vf) * len - gap)
            : Math.max(0, 0.5 * len);
      } else {
        height = Math.max(0, (1 - vf) * len - gap);
      }
      return {
        top: 0,
        height,
        bottom: undefined,
        left: 0,
        right: 0,
        width: undefined,
      };
    }

    let left: number;
    let width: number;
    if (variant === 'range') {
      const hi = Math.max(sf, vf);
      left = hi * len + gap;
      width = Math.max(0, (1 - hi) * len - gap);
    } else if (variant === 'centered') {
      if (vf >= 0.5) {
        left = vf * len + gap;
        width = Math.max(0, (1 - vf) * len - gap);
      } else {
        left = 0.5 * len;
        width = Math.max(0, 0.5 * len);
      }
    } else {
      left = vf * len + gap;
      width = Math.max(0, (1 - vf) * len - gap);
    }
    return {
      left,
      width,
      top: 0,
      bottom: 0,
      right: undefined,
      height: undefined,
    };
  });

  // Left inactive track: from track start to (handle - gap), 2dp inner right corners
  // Only needed for centered and range variants.
  const leftInactiveAnimStyle = useAnimatedStyle(() => {
    if (variant === 'standard') {
      return { width: 0 };
    }

    const vf = endFractionSV.value;
    const sf = startFractionSV.value;
    const len = trackLengthSV.value;
    const gap = trackHandleOffset;

    if (isVertical) {
      let height: number;
      if (variant === 'range') {
        const lo = Math.min(sf, vf);
        height = Math.max(0, lo * len - gap);
      } else {
        // centered
        height =
          vf >= 0.5 ? Math.max(0, 0.5 * len) : Math.max(0, vf * len - gap);
      }
      return {
        bottom: 0,
        height,
        top: undefined,
        left: 0,
        right: 0,
        width: undefined,
      };
    }

    let width: number;
    if (variant === 'range') {
      const lo = Math.min(sf, vf);
      width = Math.max(0, lo * len - gap);
    } else {
      // centered
      width = vf >= 0.5 ? Math.max(0, 0.5 * len) : Math.max(0, vf * len - gap);
    }
    return {
      left: 0,
      width,
      top: 0,
      bottom: 0,
      right: undefined,
      height: undefined,
    };
  });

  // End handle animated position along the track axis
  const endHandleAnimStyle = useAnimatedStyle(() => {
    const len = trackLengthSV.value;
    const w = endHandleWidthSV.value;
    if (isVertical) {
      const pos = (1 - endFractionSV.value) * len;
      return { top: pos - w / 2, height: w };
    }
    const pos = endFractionSV.value * len;
    return { left: pos - w / 2, width: w };
  });

  // Start handle animated position along the track axis
  const startHandleAnimStyle = useAnimatedStyle(() => {
    const len = trackLengthSV.value;
    const w = startHandleWidthSV.value;
    if (isVertical) {
      const pos = (1 - startFractionSV.value) * len;
      return { top: pos - w / 2, height: w };
    }
    const pos = startFractionSV.value * len;
    return { left: pos - w / 2, width: w };
  });

  // Value indicator animated style
  const valueIndicatorAnimStyle = useAnimatedStyle(() => {
    const len = trackLengthSV.value;
    if (isVertical) {
      const pos = (1 - endFractionSV.value) * len;
      return {
        opacity: valueIndicatorAlphaSV.value,
        top: pos - VALUE_INDICATOR_SIZE / 2,
        left: -(VALUE_INDICATOR_SIZE + VALUE_INDICATOR_BOTTOM_SPACE),
        right: undefined,
        bottom: undefined,
        transform: [],
      };
    }
    return {
      opacity: valueIndicatorAlphaSV.value,
      transform: [
        { translateX: endFractionSV.value * len - VALUE_INDICATOR_SIZE / 2 },
      ],
    };
  });

  // Gesture handling
  const valuesRef = React.useRef({
    min,
    max,
    step,
    trackLength,
    endValue,
    startValue,
    variant,
    isRTL,
    isVertical,
  });
  valuesRef.current = {
    min,
    max,
    step,
    trackLength,
    endValue,
    startValue,
    variant,
    isRTL,
    isVertical,
  };

  const grantTouchRef = React.useRef(0);
  const activeHandleRef = React.useRef<'start' | 'end'>('end');

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,

      onPanResponderGrant: (evt) => {
        const {
          min: mn,
          max: mx,
          isVertical: iv,
          isRTL: rtl,
          trackLength: tl,
          startValue: sv,
          endValue: ev,
          variant: vt,
        } = valuesRef.current;
        const touchPx = iv
          ? evt.nativeEvent.locationY
          : evt.nativeEvent.locationX;
        grantTouchRef.current = touchPx;

        if (vt === 'range') {
          const f = positionToFraction(touchPx, tl, rtl, iv);
          activeHandleRef.current = nearestHandle(
            f,
            valueToFraction(sv, mn, mx),
            valueToFraction(ev, mn, mx)
          );
        } else {
          activeHandleRef.current = 'end';
        }

        if (activeHandleRef.current === 'start') {
          startHandleWidthSV.value = withTiming(
            spec.handlePressWidth,
            timingConfig
          );
        } else {
          endHandleWidthSV.value = withTiming(
            spec.handlePressWidth,
            timingConfig
          );
        }

        if (showValueIndicator) {
          valueIndicatorAlphaSV.value = withTiming(1, timingConfig);
        }

        if (props.onSlidingStart) {
          if (isRange) {
            (props as RangeProps).onSlidingStart?.([sv, ev]);
          } else {
            (props as StandardProps | CenteredProps).onSlidingStart?.(ev);
          }
        }
      },

      onPanResponderMove: (_, gestureState) => {
        const {
          min: mn,
          max: mx,
          step: st,
          trackLength: tl,
          startValue: sv,
          endValue: ev,
          variant: vt,
          isVertical: iv,
          isRTL: rtl,
        } = valuesRef.current;

        const delta = iv ? gestureState.dy : gestureState.dx;
        const touchPx = grantTouchRef.current + delta;
        const fraction = positionToFraction(touchPx, tl, rtl, iv);
        const snapped = fractionToValue(fraction, mn, mx, st);
        // Snap the visual handle position for discrete mode
        const displayFraction =
          st > 0 ? valueToFraction(snapped, mn, mx) : fraction;

        if (vt === 'range') {
          if (activeHandleRef.current === 'start') {
            const clamped = Math.min(snapped, ev);
            startFractionSV.value = valueToFraction(clamped, mn, mx);
            setStartValue(clamped);
            setIndicatorDisplayValue(clamped);
            (props as RangeProps).onValueChange?.([clamped, ev]);
          } else {
            const clamped = Math.max(snapped, sv);
            endFractionSV.value = valueToFraction(clamped, mn, mx);
            setEndValue(clamped);
            setIndicatorDisplayValue(clamped);
            (props as RangeProps).onValueChange?.([sv, clamped]);
          }
        } else {
          endFractionSV.value = displayFraction;
          setEndValue(snapped);
          setIndicatorDisplayValue(snapped);
          (props as StandardProps | CenteredProps).onValueChange?.(snapped);
        }
      },

      onPanResponderRelease: () => {
        const { endValue: ev, startValue: sv } = valuesRef.current;

        if (activeHandleRef.current === 'start') {
          startHandleWidthSV.value = withTiming(spec.handleWidth, timingConfig);
        } else {
          endHandleWidthSV.value = withTiming(spec.handleWidth, timingConfig);
        }

        if (showValueIndicator) {
          valueIndicatorAlphaSV.value = withTiming(0, timingConfig);
        }

        if (props.onSlidingComplete) {
          if (isRange) {
            (props as RangeProps).onSlidingComplete?.([sv, ev]);
          } else {
            (props as StandardProps | CenteredProps).onSlidingComplete?.(ev);
          }
        }
      },

      onPanResponderTerminate: () => {
        if (activeHandleRef.current === 'start') {
          startHandleWidthSV.value = withTiming(spec.handleWidth, timingConfig);
        } else {
          endHandleWidthSV.value = withTiming(spec.handleWidth, timingConfig);
        }
        if (showValueIndicator) {
          valueIndicatorAlphaSV.value = withTiming(0, timingConfig);
        }
      },
    })
  ).current;

  // Accessibility
  const handleAccessibilityIncrement = () => {
    if (disabled) return;
    const increment = step > 0 ? step : (max - min) / 100;
    const next = Math.min(endValue + increment, max);
    setEndValue(next);
    endFractionSV.value = valueToFraction(next, min, max);
    if (!isRange) {
      (props as StandardProps | CenteredProps).onValueChange?.(next);
    }
  };

  const handleAccessibilityDecrement = () => {
    if (disabled) return;
    const decrement = step > 0 ? step : (max - min) / 100;
    const next = Math.max(endValue - decrement, min);
    setEndValue(next);
    endFractionSV.value = valueToFraction(next, min, max);
    if (!isRange) {
      (props as StandardProps | CenteredProps).onValueChange?.(next);
    }
  };

  // End stops are always visible at the track's min/max positions.
  // Intermediate step tick marks are only shown when showStops && step > 0,
  // and skip fractions 0 and 1 since those are covered by the end stops.
  const endStopFractions: number[] = trackLength > 0 ? [0, 1] : [];
  const stepTickFractions: number[] =
    showStops && step > 0 && trackLength > 0
      ? stopFractions(min, max, step).filter((f) => f > 0.001 && f < 0.999)
      : [];
  const allStopFractions = [...endStopFractions, ...stepTickFractions];

  // Active segment bounds for stop color determination
  const endFraction = valueToFraction(endValue, min, max);
  const startFraction = isRange ? valueToFraction(startValue, min, max) : 0;
  const activeLead =
    variant === 'centered'
      ? Math.min(0.5, endFraction)
      : variant === 'range'
      ? Math.min(startFraction, endFraction)
      : 0;
  const activeTrail =
    variant === 'centered'
      ? Math.max(0.5, endFraction)
      : variant === 'range'
      ? Math.max(startFraction, endFraction)
      : endFraction;

  const indicatorText = valueIndicatorLabel
    ? valueIndicatorLabel(indicatorDisplayValue)
    : String(Math.round(indicatorDisplayValue));

  const contentOpacity = disabled ? DISABLED_CONTENT_OPACITY : 1;
  const inactiveOpacity = disabled ? DISABLED_INACTIVE_OPACITY : 1;

  // Track container: positioned within the handle area, offset for indicator zone
  const trackContainerStyle: ViewStyle = isVertical
    ? {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: (spec.handleHeight - spec.trackThickness) / 2,
        width: spec.trackThickness,
      }
    : {
        position: 'absolute',
        left: 0,
        right: 0,
        top: verticalOffset + (spec.handleHeight - spec.trackThickness) / 2,
        height: spec.trackThickness,
      };

  // Corner radii for each track segment
  // Outer corners use the size spec radii; inner corners (facing the handle gap) use 2dp.
  const leftInactiveCorners: ViewStyle = isVertical
    ? {
        borderBottomLeftRadius: spec.activeLeadingRadius,
        borderBottomRightRadius: spec.activeLeadingRadius,
        borderTopLeftRadius: INNER_CORNER_RADIUS,
        borderTopRightRadius: INNER_CORNER_RADIUS,
      }
    : {
        borderTopLeftRadius: spec.activeLeadingRadius,
        borderBottomLeftRadius: spec.activeLeadingRadius,
        borderTopRightRadius: INNER_CORNER_RADIUS,
        borderBottomRightRadius: INNER_CORNER_RADIUS,
      };

  const rightInactiveCorners: ViewStyle = isVertical
    ? {
        borderBottomLeftRadius: INNER_CORNER_RADIUS,
        borderBottomRightRadius: INNER_CORNER_RADIUS,
        borderTopLeftRadius: spec.inactiveTrailingRadius,
        borderTopRightRadius: spec.inactiveTrailingRadius,
      }
    : {
        borderTopLeftRadius: INNER_CORNER_RADIUS,
        borderBottomLeftRadius: INNER_CORNER_RADIUS,
        borderTopRightRadius: spec.inactiveTrailingRadius,
        borderBottomRightRadius: spec.inactiveTrailingRadius,
      };

  // Active track: leading outer corner uses size spec (standard only), all others 2dp inner
  const activeTrackCorners: ViewStyle = isVertical
    ? {
        borderBottomLeftRadius:
          variant === 'standard'
            ? spec.activeLeadingRadius
            : INNER_CORNER_RADIUS,
        borderBottomRightRadius:
          variant === 'standard'
            ? spec.activeLeadingRadius
            : INNER_CORNER_RADIUS,
        borderTopLeftRadius: INNER_CORNER_RADIUS,
        borderTopRightRadius: INNER_CORNER_RADIUS,
      }
    : {
        borderTopLeftRadius:
          variant === 'standard'
            ? spec.activeLeadingRadius
            : INNER_CORNER_RADIUS,
        borderBottomLeftRadius:
          variant === 'standard'
            ? spec.activeLeadingRadius
            : INNER_CORNER_RADIUS,
        borderTopRightRadius: INNER_CORNER_RADIUS,
        borderBottomRightRadius: INNER_CORNER_RADIUS,
      };

  // Outer wrapper: extends for indicator space above the track (horizontal only)
  const outerStyle: ViewStyle = isVertical
    ? { width: spec.handleHeight, overflow: 'visible' }
    : { height: spec.handleHeight + verticalOffset, overflow: 'visible' };

  // Static handle positioning perpendicular to the track axis
  const endHandleStaticStyle: ViewStyle = isVertical
    ? { position: 'absolute', left: 0, right: 0 }
    : { position: 'absolute', top: verticalOffset, bottom: 0 };

  const startHandleStaticStyle: ViewStyle = isVertical
    ? { position: 'absolute', left: 0, right: 0 }
    : { position: 'absolute', top: verticalOffset, bottom: 0 };

  // Icon: center it at the leading corner's inscribed-square focal point
  const iconLeadingOffset = Math.max(
    0,
    spec.activeLeadingRadius - spec.iconSize / 2
  );

  const inactiveColor = disabled
    ? colors.disabledContent
    : colors.inactiveTrack;
  const activeColor = disabled ? colors.disabledContent : colors.activeTrack;

  return (
    <View style={[outerStyle, style]} testID={testID}>
      {/* Gesture and accessibility wrapper */}
      <View
        {...panResponder.panHandlers}
        style={StyleSheet.absoluteFill}
        accessibilityRole="adjustable"
        accessibilityValue={{ min, max, now: Math.round(endValue) }}
        accessibilityActions={[
          { name: 'increment', label: 'increment' },
          { name: 'decrement', label: 'decrement' },
        ]}
        onAccessibilityAction={(evt) => {
          if (evt.nativeEvent.actionName === 'increment') {
            handleAccessibilityIncrement();
          } else if (evt.nativeEvent.actionName === 'decrement') {
            handleAccessibilityDecrement();
          }
        }}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
      />

      {/* Track container */}
      <View
        style={trackContainerStyle}
        onLayout={onLayout}
        pointerEvents="none"
      >
        {/* Left inactive track segment (centered/range only) */}
        {variant !== 'standard' && (
          <Animated.View
            style={[
              styles.trackSegment,
              leftInactiveCorners,
              leftInactiveAnimStyle,
              { backgroundColor: inactiveColor, opacity: inactiveOpacity },
            ]}
          />
        )}

        {/* Right inactive track segment */}
        <Animated.View
          style={[
            styles.trackSegment,
            rightInactiveCorners,
            rightInactiveAnimStyle,
            { backgroundColor: inactiveColor, opacity: inactiveOpacity },
          ]}
        />

        {/* Active track segment */}
        <Animated.View
          style={[
            styles.trackSegment,
            activeTrackCorners,
            activeTrackAnimStyle,
            { backgroundColor: activeColor, opacity: contentOpacity },
          ]}
        />

        {/* Stop indicators: always-on end stops + optional intermediate step ticks */}
        {allStopFractions.map((f) => {
          const isActive = f >= activeLead && f <= activeTrail;
          // Stops are centered at the corner arc center:
          //   f=0 -> spec.activeLeadingRadius from leading edge
          //   f=1 -> spec.inactiveTrailingRadius from trailing edge
          //   intermediate -> lerp between the two
          const innerStart = spec.activeLeadingRadius;
          const innerEnd = trackLength - spec.inactiveTrailingRadius;
          if (innerEnd <= innerStart) return null;
          const pixelCenter = innerStart + f * (innerEnd - innerStart);
          const dotStyle: ViewStyle = isVertical
            ? {
                position: 'absolute',
                left: (spec.trackThickness - STOP_SIZE) / 2,
                bottom: pixelCenter - STOP_SIZE / 2,
              }
            : {
                position: 'absolute',
                top: (spec.trackThickness - STOP_SIZE) / 2,
                left: pixelCenter - STOP_SIZE / 2,
              };
          return (
            <View
              key={f}
              style={[
                styles.stopDot,
                dotStyle,
                {
                  backgroundColor: disabled
                    ? colors.disabledContent
                    : isActive
                    ? colors.stopOnActive
                    : colors.stopOnInactive,
                  opacity: contentOpacity,
                },
              ]}
            />
          );
        })}

        {/* Inset icon: positioned at the leading corner's focal point */}
        {spec.iconSize > 0 && icon != null && !disabled && (
          <View
            style={[
              styles.iconWrapper,
              isVertical
                ? {
                    left: (spec.trackThickness - spec.iconSize) / 2,
                    bottom: activeLead * (trackLength || 0) + iconLeadingOffset,
                  }
                : {
                    top: (spec.trackThickness - spec.iconSize) / 2,
                    left: activeLead * (trackLength || 0) + iconLeadingOffset,
                  },
            ]}
            pointerEvents="none"
          >
            <Icon
              source={icon}
              size={spec.iconSize}
              color={colors.stopOnActive}
            />
          </View>
        )}
      </View>

      {/* End handle */}
      <Animated.View
        style={[
          styles.handle,
          endHandleStaticStyle,
          endHandleAnimStyle,
          {
            backgroundColor: disabled ? colors.disabledContent : colors.handle,
            opacity: contentOpacity,
          },
        ]}
        pointerEvents="none"
      />

      {/* Start handle (range only) */}
      {isRange && (
        <Animated.View
          style={[
            styles.handle,
            startHandleStaticStyle,
            startHandleAnimStyle,
            {
              backgroundColor: disabled
                ? colors.disabledContent
                : colors.handle,
              opacity: contentOpacity,
            },
          ]}
          pointerEvents="none"
        />
      )}

      {/* Value indicator bubble */}
      {showValueIndicator && (
        <Animated.View
          style={[
            styles.valueIndicator,
            valueIndicatorAnimStyle,
            { backgroundColor: colors.valueIndicatorBg },
          ]}
          pointerEvents="none"
        >
          <Text
            variant="labelLarge"
            style={{ color: colors.valueIndicatorText }}
          >
            {indicatorText}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  trackSegment: {
    position: 'absolute',
  },
  handle: {
    borderRadius: cornerFull,
  },
  stopDot: {
    width: STOP_SIZE,
    height: STOP_SIZE,
    borderRadius: STOP_SIZE / 2,
  },
  iconWrapper: {
    position: 'absolute',
  },
  valueIndicator: {
    position: 'absolute',
    top: 0,
    width: VALUE_INDICATOR_SIZE,
    height: VALUE_INDICATOR_SIZE,
    borderRadius: cornerFull,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Slider;
