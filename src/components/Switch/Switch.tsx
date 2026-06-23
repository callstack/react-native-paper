import * as React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';

import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { SwitchTokens } from './tokens';
import { getDefaultSwitchColors, resolveSwitchPaint } from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { tokens } from '../../theme/tokens';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { StateOpacityKey, ThemeProp } from '../../types';
import { isKeyboardFocusEvent } from '../../utils/isKeyboardFocusEvent';
import Icon, { type IconSource } from '../Icon';

export type Props = {
  /**
   * Whether the switch is on.
   */
  value?: boolean;
  /**
   * Called with the new value when the user toggles the switch.
   */
  onValueChange?: (value: boolean) => void;
  /**
   * Disables interaction and renders the disabled visual state.
   */
  disabled?: boolean;
  /**
   * Icon shown inside the handle when checked
   */
  checkedIcon?: IconSource;
  /**
   * Icon shown inside the handle when unchecked.
   */
  uncheckedIcon?: IconSource;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  theme?: ThemeProp;
  /**
   * Accessibility label for the switch. This is read by the screen reader when the user focuses the switch.
   */
  'aria-label'?: string;
};

const {
  trackWidth: TRACK_WIDTH,
  trackHeight: TRACK_HEIGHT,
  trackOutlineWidth: TRACK_OUTLINE_WIDTH,
  stateLayerSize: STATE_LAYER_SIZE,
  selectedHandleSize: SELECTED_HANDLE,
  unselectedHandleSize: UNSELECTED_HANDLE,
  iconHandleSize: ICON_HANDLE,
  pressedHandleSize: PRESSED_HANDLE,
  selectedIconSize: SELECTED_ICON,
  unselectedIconSize: UNSELECTED_ICON,
  disabledSelectedHandleOpacity: DISABLED_SELECTED_HANDLE_OPACITY,
  disabledUnselectedHandleOpacity: DISABLED_UNSELECTED_HANDLE_OPACITY,
  disabledSelectedIconOpacity: DISABLED_SELECTED_ICON_OPACITY,
  disabledUnselectedIconOpacity: DISABLED_UNSELECTED_ICON_OPACITY,
  disabledTrackOpacity: DISABLED_TRACK_OPACITY,
} = SwitchTokens;

const { state: stateTokens } = tokens.md.sys;
const stateOpacity = stateTokens.opacity;
const { thickness: FOCUS_THICKNESS, outerOffset: FOCUS_OUTER_OFFSET } =
  stateTokens.focusIndicator;
const FOCUS_RING_INSET = -(FOCUS_OUTER_OFFSET + FOCUS_THICKNESS);
const OVERLAY_TOP = (STATE_LAYER_SIZE - TRACK_HEIGHT) / 2;

// Hold-then-grow: a brief delay before snapping to PRESSED_HANDLE so a quick
// tap doesn't flash the press-grow visual.
const PRESS_GROW_DELAY = 100;

function restingHandleSize(checked: boolean, hasIcon: boolean): number {
  if (hasIcon) return ICON_HANDLE;
  return checked ? SELECTED_HANDLE : UNSELECTED_HANDLE;
}

const HANDLE_PADDING = (TRACK_HEIGHT - SELECTED_HANDLE) / 2;
const UNCHECKED_CENTER = TRACK_HEIGHT / 2;
const CHECKED_CENTER = TRACK_WIDTH - HANDLE_PADDING - SELECTED_HANDLE / 2;

/**
 * Material 3 toggle between two mutually exclusive states (on / off).
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Switch } from 'react-native-paper';
 *
 * const Example = () => {
 *   const [on, setOn] = React.useState(false);
 *   return <Switch value={on} onValueChange={setOn} />;
 * };
 * ```
 *
 * ## Theming
 * Customize by overriding these `theme.colors` roles:
 * - `primary` / `onPrimary`: selected track + icon / selected handle
 * - `primaryContainer`: selected handle on hover, press
 * - `surfaceContainerHighest`: unselected track + icon
 * - `outline`: unselected resting handle, unselected track outline
 * - `onSurfaceVariant`: unselected handle on hover, press
 * - `onSurface`: disabled track, handle, and icon fills
 * - `surface`: disabled selected handle
 * - `secondary`: focus indicator
 */
const Switch = ({
  value,
  disabled,
  onValueChange,
  checkedIcon,
  uncheckedIcon,
  style,
  testID,
  theme: themeOverrides,
  'aria-label': ariaLabel,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const reduceMotion = useReduceMotion();
  const { direction } = useLocale();
  const xSign = direction === 'ltr' ? 1 : -1;

  const checked = !!value;
  const isDisabled = !!disabled;
  const isEnabled = !isDisabled;
  const iconSource = checked ? checkedIcon : uncheckedIcon;
  const hasIcon = iconSource !== undefined;

  const anchorStyle: ViewStyle =
    Platform.OS === 'web' && direction === 'rtl' ? { right: 0 } : { left: 0 };

  const pressedSV = useSharedValue(0);
  const hoveredSV = useSharedValue(0);
  const focusedSV = useSharedValue(0);
  const checkedSV = useSharedValue(checked ? 1 : 0);
  const hasIconSV = useSharedValue(hasIcon ? 1 : 0);
  const isDisabledSV = useSharedValue(isDisabled ? 1 : 0);

  React.useEffect(() => {
    checkedSV.value = checked ? 1 : 0;
    hasIconSV.value = hasIcon ? 1 : 0;
    isDisabledSV.value = isDisabled ? 1 : 0;
  }, [checked, hasIcon, isDisabled, checkedSV, hasIconSV, isDisabledSV]);

  const colors = React.useMemo(() => getDefaultSwitchColors(theme), [theme]);

  const reanimatedReduceMotion = reduceMotion
    ? ReduceMotion.Always
    : ReduceMotion.Never;

  const springConfig = React.useMemo(
    () => ({
      ...toRawSpring(theme.motion.spring.fast.spatial),
      reduceMotion: reanimatedReduceMotion,
    }),
    [theme.motion.spring.fast.spatial, reanimatedReduceMotion]
  );
  const stateLayerRiseConfig = React.useMemo(
    () => ({
      duration: theme.motion.duration.medium3,
      easing: Easing.bezier(...theme.motion.easing.standard),
      reduceMotion: reanimatedReduceMotion,
    }),
    [
      theme.motion.duration.medium3,
      theme.motion.easing.standard,
      reanimatedReduceMotion,
    ]
  );
  const stateLayerPulseFallConfig = React.useMemo(
    () => ({
      duration: theme.motion.duration.medium3,
      easing: Easing.bezier(...theme.motion.easing.standardAccelerate),
      reduceMotion: reanimatedReduceMotion,
    }),
    [
      theme.motion.duration.medium3,
      theme.motion.easing.standardAccelerate,
      reanimatedReduceMotion,
    ]
  );

  const handleSize = useSharedValue(restingHandleSize(checked, hasIcon));
  const handleCenter = useSharedValue(
    checked ? CHECKED_CENTER : UNCHECKED_CENTER
  );
  const stateLayerAlpha = useSharedValue(0);

  useAnimatedReaction(
    () => checkedSV.value,
    (c, prev) => {
      if (c === prev) return;
      handleCenter.value = withSpring(
        c === 1 ? CHECKED_CENTER : UNCHECKED_CENTER,
        springConfig
      );
    },
    [springConfig]
  );

  useAnimatedReaction(
    () => ({
      p: pressedSV.value,
      c: checkedSV.value,
      hi: hasIconSV.value,
    }),
    ({ p, c, hi }) => {
      const restingSize =
        hi === 1 ? ICON_HANDLE : c === 1 ? SELECTED_HANDLE : UNSELECTED_HANDLE;
      if (p === 1) {
        handleSize.value = withDelay(
          PRESS_GROW_DELAY,
          withTiming(PRESSED_HANDLE, { duration: 0 })
        );
      } else {
        handleSize.value = withSpring(restingSize, springConfig);
      }
    },
    [springConfig]
  );

  useAnimatedReaction(
    (): StateOpacityKey | null => {
      if (pressedSV.value === 1) return 'pressed';
      if (focusedSV.value === 1) return 'focused';
      if (hoveredSV.value === 1) return 'hovered';
      return null;
    },
    (current, prev) => {
      if (current === prev) return;
      const wasPressed = prev === 'pressed';
      const target =
        current === 'pressed'
          ? stateOpacity.pressed
          : current === 'hovered'
            ? stateOpacity.hovered
            : 0;
      if (wasPressed && current !== 'pressed') {
        // On release: rise to peak, then fall to the next state.
        stateLayerAlpha.value = withSequence(
          withTiming(stateOpacity.pressed, stateLayerRiseConfig),
          withTiming(target, stateLayerPulseFallConfig)
        );
      } else if (current === null) {
        stateLayerAlpha.value = 0;
      } else {
        stateLayerAlpha.value = withTiming(target, stateLayerRiseConfig);
      }
    },
    [stateLayerRiseConfig, stateLayerPulseFallConfig]
  );

  const handleColorSV = useDerivedValue(() => {
    const isCheckedNow = checkedSV.value === 1;
    if (isDisabledSV.value === 1) {
      return isCheckedNow
        ? colors.disabledCheckedHandleColor
        : colors.disabledUncheckedHandleColor;
    }
    if (pressedSV.value === 1) {
      return isCheckedNow
        ? colors.checkedPressedHandleColor
        : colors.uncheckedPressedHandleColor;
    }
    if (hoveredSV.value === 1) {
      return isCheckedNow
        ? colors.checkedHoverHandleColor
        : colors.uncheckedHoverHandleColor;
    }
    return isCheckedNow
      ? colors.checkedHandleColor
      : colors.uncheckedHandleColor;
  }, [colors]);

  const handleAnimatedStyle = useAnimatedStyle(() => ({
    width: handleSize.value,
    height: handleSize.value,
    top: (STATE_LAYER_SIZE - handleSize.value) / 2,
    transform: [
      { translateX: xSign * (handleCenter.value - handleSize.value / 2) },
    ],
  }));

  const handleFillAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: handleColorSV.value,
  }));

  const stateLayerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: stateLayerAlpha.value,
    transform: [
      { translateX: xSign * (handleCenter.value - STATE_LAYER_SIZE / 2) },
    ],
  }));

  // Icon translateX follows the handle's center.
  // Vertical position is fixed so the icon never moves vertically
  // as the spring oscillates around its target.
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: xSign * (handleCenter.value - SELECTED_ICON / 2) },
    ],
  }));

  const focusRingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: focusedSV.value,
  }));

  const paint = resolveSwitchPaint(colors, isEnabled, checked);
  const stateLayerColor = checked
    ? colors.checkedStateLayerColor
    : colors.uncheckedStateLayerColor;
  const showOutline = paint.border !== 'transparent';
  const handleOpacity = isDisabled
    ? checked
      ? DISABLED_SELECTED_HANDLE_OPACITY
      : DISABLED_UNSELECTED_HANDLE_OPACITY
    : 1;
  const iconOpacity = isDisabled
    ? checked
      ? DISABLED_SELECTED_ICON_OPACITY
      : DISABLED_UNSELECTED_ICON_OPACITY
    : 1;
  const trackOpacityValue = isDisabled ? DISABLED_TRACK_OPACITY : 1;
  const iconSize = checked ? SELECTED_ICON : UNSELECTED_ICON;

  return (
    <View style={[styles.wrapper, style]}>
      <Pressable
        disabled={disabled}
        onPress={() => onValueChange?.(!checked)}
        onPressIn={() => {
          pressedSV.value = 1;
        }}
        onPressOut={() => {
          pressedSV.value = 0;
        }}
        onHoverIn={() => {
          hoveredSV.value = 1;
        }}
        onHoverOut={() => {
          hoveredSV.value = 0;
        }}
        onFocus={(e) => {
          if (!isKeyboardFocusEvent(e)) return;
          focusedSV.value = 1;
        }}
        onBlur={() => {
          focusedSV.value = 0;
        }}
        android_ripple={{ color: 'transparent' }}
        role="switch"
        aria-disabled={isDisabled}
        aria-checked={checked}
        aria-label={ariaLabel}
        testID={testID}
        style={[
          styles.touchable,
          Platform.OS === 'web' ? webNoOutline : undefined,
        ]}
      >
        <View
          style={[
            styles.track,
            { backgroundColor: paint.track, opacity: trackOpacityValue },
          ]}
        >
          {showOutline ? (
            <View style={[styles.outline, { borderColor: paint.border }]} />
          ) : null}
        </View>
      </Pressable>

      <Animated.View
        style={[
          styles.stateLayer,
          anchorStyle,
          { backgroundColor: stateLayerColor },
          stateLayerAnimatedStyle,
        ]}
      />

      <Animated.View style={[styles.handle, anchorStyle, handleAnimatedStyle]}>
        {/* Disabled-only: opaque `surface` backdrop. The tinted fill above
            composites over it, reproducing the native math avoiding the PlatformColor alpha limitation. */}
        {isDisabled ? (
          <View
            style={[
              styles.handleFill,
              { backgroundColor: theme.colors.surface },
            ]}
          />
        ) : null}
        <Animated.View
          style={[
            styles.handleFill,
            { opacity: handleOpacity },
            handleFillAnimatedStyle,
          ]}
        />
      </Animated.View>
      {iconSource ? (
        <Animated.View
          style={[styles.iconWrap, anchorStyle, iconAnimatedStyle]}
        >
          {/* The same icon twice; one tinted fill on top of the other,
          reproducing the native math avoiding the PlatformColor alpha limitation. */}
          {isDisabled ? (
            <View style={styles.absoluteFill}>
              <Icon
                source={iconSource}
                size={iconSize}
                color={theme.colors.surface}
                theme={theme}
              />
            </View>
          ) : null}
          <View style={[styles.absoluteFill, { opacity: iconOpacity }]}>
            <Icon
              source={iconSource}
              size={iconSize}
              color={paint.icon}
              theme={theme}
            />
          </View>
        </Animated.View>
      ) : null}

      <Animated.View
        style={[
          styles.focusRing,
          {
            borderColor: colors.focusIndicatorColor,
            borderWidth: FOCUS_THICKNESS,
            top: OVERLAY_TOP + FOCUS_RING_INSET,
            left: FOCUS_RING_INSET,
            right: FOCUS_RING_INSET,
            bottom: OVERLAY_TOP + FOCUS_RING_INSET,
            borderRadius: cornerFull,
          },
          focusRingAnimatedStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: TRACK_WIDTH,
    height: STATE_LAYER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  touchable: {
    width: TRACK_WIDTH,
    height: STATE_LAYER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: cornerFull,
    overflow: 'visible',
  },
  outline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: TRACK_OUTLINE_WIDTH,
    borderRadius: cornerFull,
    pointerEvents: 'none',
  },
  stateLayer: {
    position: 'absolute',
    top: 0,
    width: STATE_LAYER_SIZE,
    height: STATE_LAYER_SIZE,
    borderRadius: cornerFull,
    pointerEvents: 'none',
  },
  handle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  handleFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: cornerFull,
  },
  iconWrap: {
    position: 'absolute',
    top: (STATE_LAYER_SIZE - SELECTED_ICON) / 2,
    width: SELECTED_ICON,
    height: SELECTED_ICON,
    pointerEvents: 'none',
  },
  focusRing: {
    position: 'absolute',
    pointerEvents: 'none',
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

// Web-only style; not in StyleSheet because `outline` is outside ViewStyle.
const webNoOutline = { outline: 'none' } as unknown as ViewStyle;

export default Switch;
