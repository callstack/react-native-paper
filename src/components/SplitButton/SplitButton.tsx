import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  AccessibilityState,
  ColorValue,
  GestureResponderEvent,
  NativeSyntheticEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  TargetedEvent,
  TextStyle,
  ViewProps,
  ViewStyle,
} from 'react-native';

import Animated, {
  Easing,
  type AnimatedStyle,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  splitButtonFocusRingInset,
  splitButtonFocusRingThickness,
  splitButtonMinInteractiveSize,
  splitButtonStateLayerOpacity,
  type SplitButtonSize,
} from './tokens';
import {
  getSplitButtonColors,
  getSplitButtonHitSlop,
  getSplitButtonLeadingShape,
  getSplitButtonRippleColor,
  getSplitButtonSizeStyle,
  getSplitButtonTrailingShape,
  type SplitButtonMode,
} from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import type { $Omit, ThemeProp } from '../../types';
import hasTouchHandler from '../../utils/hasTouchHandler';
import { isKeyboardFocusEvent } from '../../utils/isKeyboardFocusEvent';
import ActivityIndicator from '../ActivityIndicator';
import { getButtonTouchableRippleStyle } from '../Button/utils';
import Icon, { type IconSource } from '../Icon';
import Surface, { type SurfaceStyle } from '../Surface';
import TouchableRipple, {
  type Props as TouchableRippleProps,
} from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

export type Props = $Omit<ViewProps, 'children' | 'style'> & {
  /**
   * Mode of the split button.
   * - `filled` - high-emphasis split button for important or final actions.
   * - `tonal` - medium-emphasis split button using secondary container colors.
   * - `elevated` - tonal split button with elevation for separation from busy surfaces.
   * - `outlined` - medium-emphasis split button with transparent containers and outline.
   */
  mode?: SplitButtonMode;
  /**
   * Size of the split button.
   * - `extra-small` - the smallest split button size, for the most compact layouts.
   * - `small` - the default split button size.
   * - `medium` - a larger split button size for more prominent actions.
   * - `large` - a larger split button size for high-emphasis actions.
   * - `extra-large` - the largest split button size, for the most prominent actions.
   */
  size?: SplitButtonSize;
  /**
   * Label text for the leading button.
   */
  label: string;
  /**
   * Icon to display before the label in the leading button.
   */
  icon?: IconSource;
  /**
   * Icon to display in the trailing button.
   */
  trailingIcon?: IconSource;
  /**
   * Whether to show a loading indicator in the leading button.
   */
  loading?: boolean;
  /**
   * Whether both buttons are disabled.
   */
  disabled?: boolean;
  /**
   * Custom container color for both buttons.
   */
  buttonColor?: ColorValue;
  /**
   * Custom content color for icons and label.
   */
  textColor?: ColorValue;
  /**
   * Custom ripple color for both buttons.
   */
  rippleColor?: ColorValue;
  /**
   * Function to execute when the leading button is pressed.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute when the trailing button is pressed.
   */
  onTrailingPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute as soon as the leading button is pressed.
   */
  onPressIn?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute when the leading button press is released.
   */
  onPressOut?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute as soon as the trailing button is pressed.
   */
  onTrailingPressIn?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute when the trailing button press is released.
   */
  onTrailingPressOut?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute when the leading button is long pressed.
   */
  onLongPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute when the trailing button is long pressed.
   */
  onTrailingLongPress?: (e: GestureResponderEvent) => void;
  /**
   * The number of milliseconds a user must touch the leading button before executing `onLongPress`.
   */
  delayLongPress?: number;
  /**
   * The number of milliseconds a user must touch the trailing button before executing `onTrailingLongPress`.
   */
  trailingDelayLongPress?: number;
  /**
   * Accessibility label for the leading button. Falls back to `label`.
   */
  accessibilityLabel?: string;
  /**
   * Accessibility label for the trailing button.
   */
  trailingAccessibilityLabel?: string;
  /**
   * Accessibility state for the leading button.
   */
  accessibilityState?: AccessibilityState;
  /**
   * Accessibility state for the trailing button.
   */
  trailingAccessibilityState?: AccessibilityState;
  /**
   * Type of background drawable to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Style for the outer split-button group.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for both button containers.
   */
  buttonStyle?: StyleProp<SurfaceStyle>;
  /**
   * Style for the leading button container.
   */
  leadingButtonStyle?: StyleProp<SurfaceStyle>;
  /**
   * Style for the trailing button container.
   */
  trailingButtonStyle?: StyleProp<SurfaceStyle>;
  /**
   * Style for the leading button content row.
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Style for the label.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Specifies the largest possible scale a label font can reach.
   */
  maxFontSizeMultiplier?: number;
  /**
   * Sets additional distance outside of the leading button in which a press can be detected.
   */
  hitSlop?: TouchableRippleProps['hitSlop'];
  /**
   * Sets additional distance outside of the trailing button in which a press can be detected.
   */
  trailingHitSlop?: TouchableRippleProps['hitSlop'];
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * TestID used for testing purposes.
   */
  testID?: string;
};

/**
 * Split buttons let people trigger a primary action from the leading button
 * and open or trigger a contextual action from the trailing button.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { SplitButton } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <SplitButton
 *     mode="filled"
 *     icon="send"
 *     label="Send"
 *     trailingAccessibilityLabel="Show send options"
 *     onPress={() => console.log('Send')}
 *     onTrailingPress={() => console.log('Show options')}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 */
const SplitButton = ({
  mode = 'filled',
  size = 'small',
  label,
  icon,
  trailingIcon = 'chevron-down',
  loading,
  disabled,
  buttonColor: customButtonColor,
  textColor: customTextColor,
  rippleColor: customRippleColor,
  onPress,
  onTrailingPress,
  onPressIn,
  onPressOut,
  onTrailingPressIn,
  onTrailingPressOut,
  onLongPress,
  onTrailingLongPress,
  delayLongPress,
  trailingDelayLongPress,
  accessibilityLabel = label,
  trailingAccessibilityLabel = 'Show options',
  accessibilityState,
  trailingAccessibilityState,
  background,
  style,
  buttonStyle,
  leadingButtonStyle,
  trailingButtonStyle,
  contentStyle,
  labelStyle,
  maxFontSizeMultiplier,
  hitSlop,
  trailingHitSlop,
  theme: themeOverrides,
  testID,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { direction } = useLocale();
  // Used below to work around two unrelated web-only corner-radius bugs by
  // substituting an explicit, direction-aware Left/Right pair for a logical
  // Start/End one - see the comments at each of their use sites. Native is
  // unaffected by either and keeps the original logical properties, since
  // mixing physical names into it breaks native's own border radius
  // resolution.
  const isRTL = direction === 'rtl';
  const isWeb = Platform.OS === 'web';
  const sizeStyle = React.useMemo(
    () => getSplitButtonSizeStyle({ size, theme }),
    [size, theme]
  );
  const isTrailingExpanded = trailingAccessibilityState?.expanded === true;
  const trailingIconRotation = useSharedValue(isTrailingExpanded ? 1 : 0);
  const trailingInnerRadiusProgress = useSharedValue(
    isTrailingExpanded ? 1 : 0
  );
  // Standalone `Animated.View` rings, driven by keyboard focus directly,
  // until `TouchableRipple` grows native focus ring support to move onto.
  const leadingFocusedSV = useSharedValue(false);
  const trailingFocusedSV = useSharedValue(false);
  const onLeadingFocus = React.useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      if (isKeyboardFocusEvent(e)) {
        leadingFocusedSV.value = true;
      }
    },
    [leadingFocusedSV]
  );
  const onLeadingBlur = React.useCallback(() => {
    leadingFocusedSV.value = false;
  }, [leadingFocusedSV]);
  const onTrailingFocus = React.useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      if (isKeyboardFocusEvent(e)) {
        trailingFocusedSV.value = true;
      }
    },
    [trailingFocusedSV]
  );
  const onTrailingBlur = React.useCallback(() => {
    trailingFocusedSV.value = false;
  }, [trailingFocusedSV]);
  // Resolved for both states up front, so the container crossfade below
  // always has both endpoints on hand to animate between.
  const { enabled: enabledColors, disabled: disabledColors } = React.useMemo(
    () =>
      getSplitButtonColors({ theme, mode, customButtonColor, customTextColor }),
    [theme, mode, customButtonColor, customTextColor]
  );
  const colors = disabled ? disabledColors : enabledColors;
  const { color: customLabelColor, fontSize: customLabelSize } =
    StyleSheet.flatten(labelStyle) || {};
  const contentColor =
    typeof customLabelColor === 'string'
      ? customLabelColor
      : colors.contentColor;
  const rippleColor = React.useMemo(
    () =>
      getSplitButtonRippleColor({
        contentColor,
        customRippleColor,
      }),
    [contentColor, customRippleColor]
  );
  const leadingShape = React.useMemo(
    () =>
      getSplitButtonLeadingShape({
        containerRadius: sizeStyle.containerRadius,
        innerRadius: sizeStyle.innerRadius,
      }),
    [sizeStyle.containerRadius, sizeStyle.innerRadius]
  );
  // `Surface` has a web-only bug: passing it a logical `Start`/`End` corner
  // prop (its other 11 corner-prop names all resolving to `undefined`)
  // silently drops the corner's bottom half from the DOM. Passing the
  // physical `Left`/`Right` name instead avoids it, so `Surface` gets these
  // (direction-aware) instead of spreading `leadingShape` directly - native
  // is unaffected and keeps the original logical shape.
  const leadingSurfaceCornerProps = !isWeb
    ? leadingShape
    : isRTL
      ? {
          borderTopRightRadius: sizeStyle.containerRadius,
          borderBottomRightRadius: sizeStyle.containerRadius,
          borderTopLeftRadius: sizeStyle.innerRadius,
          borderBottomLeftRadius: sizeStyle.innerRadius,
        }
      : {
          borderTopLeftRadius: sizeStyle.containerRadius,
          borderBottomLeftRadius: sizeStyle.containerRadius,
          borderTopRightRadius: sizeStyle.innerRadius,
          borderBottomRightRadius: sizeStyle.innerRadius,
        };
  const trailingShape = React.useMemo(
    () =>
      getSplitButtonTrailingShape({
        containerRadius: sizeStyle.containerRadius,
        innerRadius: sizeStyle.innerRadius,
      }),
    [sizeStyle.containerRadius, sizeStyle.innerRadius]
  );
  const pressTimingConfig = React.useMemo(
    () => ({
      duration: theme.motion.duration.short4,
      easing: Easing.bezier(...theme.motion.easing.standard),
    }),
    [theme.motion.duration.short4, theme.motion.easing.standard]
  );
  // Passed to both containers below as their `transitionDuration`
  // explicitly, so their elevation/shadow transitions and this container
  // crossfade always share one duration instead of two independently-
  // computed values that could drift apart.
  const disabledTimingConfig = React.useMemo(
    () => ({
      duration: theme.motion.duration.short3 * theme.animation.scale,
      easing: Easing.bezier(...theme.motion.easing.standard),
    }),
    [
      theme.motion.duration.short3,
      theme.motion.easing.standard,
      theme.animation.scale,
    ]
  );
  const disabledProgress = useSharedValue(disabled ? 1 : 0);
  React.useEffect(() => {
    disabledProgress.value = withTiming(disabled ? 1 : 0, disabledTimingConfig);
  }, [disabled, disabledTimingConfig, disabledProgress]);
  // Neither `enabledColors.containerColor` nor `disabledColors.containerColor`
  // is ever itself animated (each stays fixed on its own layer below) -
  // only their opacity crossfades. That sidesteps Reanimated's inability to
  // interpolate a Material You `PlatformColor`/`DynamicColorIOS` value.
  const enabledContainerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: enabledColors.containerOpacity * (1 - disabledProgress.value),
  }));
  const dimContainerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: disabledProgress.value * disabledColors.containerOpacity,
  }));
  // Interpolated between `trailingShape`'s own Start radius (resting) and
  // its End radius (expanded), so the Start corner always lands exactly on
  // the same radius already driving the segment's static End corners.
  // `trailingShape`'s corner properties are typed loosely (`ViewStyle`), so
  // narrow to the `sizeStyle` values that `getSplitButtonTrailingShape`
  // always assigns them from, rather than asserting the type.
  const trailingRestingRadius =
    typeof trailingShape.borderTopStartRadius === 'number'
      ? trailingShape.borderTopStartRadius
      : sizeStyle.innerRadius;
  const trailingExpandedRadius =
    typeof trailingShape.borderTopEndRadius === 'number'
      ? trailingShape.borderTopEndRadius
      : sizeStyle.containerRadius;
  // Shared between the trailing segment's own start-corner props (for its
  // elevation shadow) and the inner clip view's animated style below, so
  // both always land on the same radius.
  const trailingStartRadius = useDerivedValue(
    () =>
      trailingRestingRadius +
      trailingInnerRadiusProgress.value *
        (trailingExpandedRadius - trailingRestingRadius)
  );
  // Same `Surface` web bug as `leadingSurfaceCornerProps` above - both the
  // segment's static (End/outer) and animated (Start/inner) corners need
  // the physical name on web to reach `Surface` correctly.
  const trailingSurfaceEndCornerProps = !isWeb
    ? trailingShape
    : isRTL
      ? {
          borderTopLeftRadius: sizeStyle.containerRadius,
          borderBottomLeftRadius: sizeStyle.containerRadius,
        }
      : {
          borderTopRightRadius: sizeStyle.containerRadius,
          borderBottomRightRadius: sizeStyle.containerRadius,
        };
  const trailingStartCornerProps = !isWeb
    ? {
        borderTopStartRadius: trailingStartRadius,
        borderBottomStartRadius: trailingStartRadius,
      }
    : isRTL
      ? {
          borderTopRightRadius: trailingStartRadius,
          borderBottomRightRadius: trailingStartRadius,
        }
      : {
          borderTopLeftRadius: trailingStartRadius,
          borderBottomLeftRadius: trailingStartRadius,
        };
  // Separate (worklet-freeze, not the `Surface` bug above) reason for the
  // same physical-on-web treatment: this drives the inner clip `Animated.View`
  // below directly, not `Surface`, but Reanimated's web engine doesn't
  // resolve a worklet-driven logical corner property at all past its first
  // render.
  const trailingAnimatedShapeStyle = useAnimatedStyle(() => {
    if (!isWeb) {
      return {
        borderTopStartRadius: trailingStartRadius.value,
        borderBottomStartRadius: trailingStartRadius.value,
      };
    }
    return isRTL
      ? {
          borderTopRightRadius: trailingStartRadius.value,
          borderBottomRightRadius: trailingStartRadius.value,
        }
      : {
          borderTopLeftRadius: trailingStartRadius.value,
          borderBottomLeftRadius: trailingStartRadius.value,
        };
  });
  const trailingIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${trailingIconRotation.value * 180}deg` }],
  }));
  // Per the M3 spec, the trailing button's color doesn't change when
  // selected (expanded) — only a state layer is applied on top of it. Fades
  // out via `disabledProgress` (rather than snapping on the raw `disabled`
  // boolean) so it stays in sync with the container crossfade above.
  const trailingStateLayerAnimatedStyle = useAnimatedStyle(() => ({
    opacity:
      (1 - disabledProgress.value) *
      trailingInnerRadiusProgress.value *
      splitButtonStateLayerOpacity,
  }));
  // Corners grow outward by the same inset as the ring itself, so it traces
  // each segment's shape rather than sitting flush with its edge.
  const leadingFocusRingShape = React.useMemo(
    () =>
      getSplitButtonLeadingShape({
        containerRadius: sizeStyle.containerRadius + splitButtonFocusRingInset,
        innerRadius: sizeStyle.innerRadius + splitButtonFocusRingInset,
      }),
    [sizeStyle.containerRadius, sizeStyle.innerRadius]
  );
  const trailingFocusRingShape = React.useMemo(
    () =>
      getSplitButtonTrailingShape({
        containerRadius: sizeStyle.containerRadius + splitButtonFocusRingInset,
        // The start corners are overridden by `trailingFocusRingAnimatedStyle`
        // below, so this value is never actually rendered.
        innerRadius: sizeStyle.innerRadius + splitButtonFocusRingInset,
      }),
    [sizeStyle.containerRadius, sizeStyle.innerRadius]
  );
  const leadingFocusRingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: leadingFocusedSV.value ? 1 : 0,
  }));
  const trailingFocusRingAnimatedStyle = useAnimatedStyle(() => {
    const cornerRadius = trailingStartRadius.value + splitButtonFocusRingInset;
    if (!isWeb) {
      return {
        opacity: trailingFocusedSV.value ? 1 : 0,
        borderTopStartRadius: cornerRadius,
        borderBottomStartRadius: cornerRadius,
      };
    }
    return {
      opacity: trailingFocusedSV.value ? 1 : 0,
      ...(isRTL
        ? {
            borderTopRightRadius: cornerRadius,
            borderBottomRightRadius: cornerRadius,
          }
        : {
            borderTopLeftRadius: cornerRadius,
            borderBottomLeftRadius: cornerRadius,
          }),
    };
  });
  const leadingHitSlop = React.useMemo(
    () => getSplitButtonHitSlop({ size, hitSlop }),
    [size, hitSlop]
  );
  const resolvedTrailingHitSlop = React.useMemo(
    () => getSplitButtonHitSlop({ size, hitSlop: trailingHitSlop }),
    [size, trailingHitSlop]
  );

  const labelTextStyle: TextStyle = {
    color: colors.contentColor,
  };
  const disabledState = { disabled: true };
  const leadingAccessibilityState = disabled
    ? { ...accessibilityState, ...disabledState }
    : accessibilityState;
  const trailingAccessibilityStateWithDisabled = disabled
    ? { ...trailingAccessibilityState, ...disabledState }
    : trailingAccessibilityState;
  const leadingHasTouchHandler = hasTouchHandler({
    onPress,
    onPressIn,
    onPressOut,
    onLongPress,
  });
  const trailingHasTouchHandler = hasTouchHandler({
    onPress: onTrailingPress,
    onPressIn: onTrailingPressIn,
    onPressOut: onTrailingPressOut,
    onLongPress: onTrailingLongPress,
  });
  React.useEffect(() => {
    const progress = isTrailingExpanded ? 1 : 0;

    trailingIconRotation.value = withTiming(progress, pressTimingConfig);
    trailingInnerRadiusProgress.value = withTiming(progress, pressTimingConfig);
  }, [
    isTrailingExpanded,
    pressTimingConfig,
    trailingIconRotation,
    trailingInnerRadiusProgress,
  ]);

  const commonButtonStyle: ViewStyle = {
    height: sizeStyle.containerHeight,
    borderColor: colors.borderColor,
    borderWidth: colors.borderWidth,
  };
  const getTestID = (suffix: string) =>
    testID ? `${testID}-${suffix}` : undefined;

  return (
    <View
      {...rest}
      testID={getTestID('container')}
      style={[
        styles.group,
        {
          columnGap: sizeStyle.betweenSpace,
          height: sizeStyle.containerHeight,
        },
        style,
      ]}
    >
      <Surface
        testID={getTestID('leading-container')}
        {...leadingSurfaceCornerProps}
        elevation={colors.elevation}
        transitionDuration={disabledTimingConfig.duration}
        backgroundColor="transparent"
        style={[
          styles.leading,
          commonButtonStyle,
          buttonStyle,
          leadingButtonStyle,
        ]}
      >
        <ButtonBackground
          testID={getTestID('leading-background')}
          backgroundColor={enabledColors.containerColor}
          animatedStyle={enabledContainerAnimatedStyle}
          borderRadiusStyle={leadingShape}
        />
        <ButtonBackground
          testID={getTestID('leading-disabled-background')}
          backgroundColor={disabledColors.containerColor}
          animatedStyle={dimContainerAnimatedStyle}
          borderRadiusStyle={leadingShape}
        />
        <TouchableRipple
          borderless
          disabled={disabled}
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={leadingHasTouchHandler ? onPressIn : undefined}
          onPressOut={leadingHasTouchHandler ? onPressOut : undefined}
          onFocus={onLeadingFocus}
          onBlur={onLeadingBlur}
          delayLongPress={delayLongPress}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          accessibilityState={leadingAccessibilityState}
          background={background}
          hitSlop={leadingHitSlop}
          rippleColor={rippleColor}
          style={[
            styles.ripple,
            getButtonTouchableRippleStyle(leadingShape, colors.borderWidth),
            Platform.OS === 'web' ? webNoOutline : null,
          ]}
          testID={getTestID('leading')}
          theme={theme}
        >
          <View
            style={[
              styles.leadingContent,
              {
                height: sizeStyle.containerHeight,
                paddingStart: sizeStyle.leadingButtonLeadingSpace,
                paddingEnd: sizeStyle.leadingButtonTrailingSpace,
                opacity: colors.contentOpacity,
              },
              contentStyle,
            ]}
          >
            {icon && !loading ? (
              <Icon
                source={icon}
                size={customLabelSize ?? sizeStyle.leadingIconSize}
                color={contentColor}
              />
            ) : null}
            {loading ? (
              <ActivityIndicator
                size={customLabelSize ?? sizeStyle.leadingIconSize}
                color={contentColor}
              />
            ) : null}
            <Text
              variant={sizeStyle.labelVariant}
              selectable={false}
              numberOfLines={1}
              ellipsizeMode="tail"
              maxFontSizeMultiplier={maxFontSizeMultiplier}
              style={[
                styles.label,
                icon || loading
                  ? { marginStart: sizeStyle.iconLabelGap }
                  : null,
                labelTextStyle,
                labelStyle,
              ]}
              testID={getTestID('label')}
            >
              {label}
            </Text>
          </View>
        </TouchableRipple>
        <Animated.View
          testID={getTestID('leading-focus-ring')}
          style={[
            styles.focusRing,
            leadingFocusRingShape,
            { borderColor: theme.colors.secondary },
            leadingFocusRingAnimatedStyle,
          ]}
        />
      </Surface>

      <Surface
        testID={getTestID('trailing-container')}
        {...trailingSurfaceEndCornerProps}
        {...trailingStartCornerProps}
        elevation={colors.elevation}
        transitionDuration={disabledTimingConfig.duration}
        backgroundColor="transparent"
        style={[
          styles.trailing,
          commonButtonStyle,
          buttonStyle,
          trailingButtonStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.trailingClip,
            { height: sizeStyle.containerHeight },
            trailingShape,
            trailingAnimatedShapeStyle,
          ]}
        >
          <ButtonBackground
            testID={getTestID('trailing-background')}
            backgroundColor={enabledColors.containerColor}
            animatedStyle={enabledContainerAnimatedStyle}
            borderRadiusStyle={trailingShape}
          />
          <ButtonBackground
            testID={getTestID('trailing-disabled-background')}
            backgroundColor={disabledColors.containerColor}
            animatedStyle={dimContainerAnimatedStyle}
            borderRadiusStyle={trailingShape}
          />
          <Animated.View
            testID={getTestID('trailing-state-layer')}
            style={[
              StyleSheet.absoluteFill,
              styles.noPointerEvents,
              { backgroundColor: contentColor },
              trailingStateLayerAnimatedStyle,
            ]}
          />
          <TouchableRipple
            borderless
            disabled={disabled}
            onPress={onTrailingPress}
            onLongPress={onTrailingLongPress}
            onPressIn={trailingHasTouchHandler ? onTrailingPressIn : undefined}
            onPressOut={
              trailingHasTouchHandler ? onTrailingPressOut : undefined
            }
            onFocus={onTrailingFocus}
            onBlur={onTrailingBlur}
            delayLongPress={trailingDelayLongPress}
            accessibilityLabel={trailingAccessibilityLabel}
            accessibilityRole="button"
            accessibilityState={trailingAccessibilityStateWithDisabled}
            background={background}
            hitSlop={resolvedTrailingHitSlop}
            rippleColor={rippleColor}
            style={[styles.ripple, Platform.OS === 'web' ? webNoOutline : null]}
            testID={getTestID('trailing')}
            theme={theme}
          >
            <View
              style={[
                styles.trailingContent,
                {
                  height: sizeStyle.containerHeight,
                  paddingStart: sizeStyle.trailingButtonLeadingSpace,
                  paddingEnd: sizeStyle.trailingButtonTrailingSpace,
                  opacity: colors.contentOpacity,
                },
              ]}
            >
              <Animated.View style={trailingIconAnimatedStyle}>
                <Icon
                  source={trailingIcon}
                  size={sizeStyle.trailingIconSize}
                  color={contentColor}
                />
              </Animated.View>
            </View>
          </TouchableRipple>
        </Animated.View>
        {/* Sibling of `trailingClip` (not a child) so the ring isn't clipped
            to the segment's shape - it needs to extend past it. */}
        <Animated.View
          testID={getTestID('trailing-focus-ring')}
          style={[
            styles.focusRing,
            trailingFocusRingShape,
            { borderColor: theme.colors.secondary },
            trailingFocusRingAnimatedStyle,
          ]}
        />
      </Surface>
    </View>
  );
};

// Both the enabled and disabled-dim container colors are always rendered as
// two stacked, statically-colored layers, crossfading only via `animatedStyle`'s
// `opacity` - never interpolating `backgroundColor` itself. See the comment
// above `disabledProgress`.
const ButtonBackground = ({
  testID,
  backgroundColor,
  animatedStyle,
  borderRadiusStyle,
}: {
  testID?: string;
  backgroundColor: ColorValue;
  animatedStyle: AnimatedStyle<{ opacity: number }>;
  borderRadiusStyle: ViewStyle;
}) => {
  return (
    <Animated.View
      testID={testID}
      style={[
        StyleSheet.absoluteFill,
        styles.noPointerEvents,
        borderRadiusStyle,
        { backgroundColor },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
  },
  leading: {
    minWidth: splitButtonMinInteractiveSize,
    flexShrink: 1,
    borderStyle: 'solid',
    // Its focus ring overflows rightward into the (narrow) gap toward the
    // trailing segment; without this, the trailing segment - painted after
    // it in document order - covers that overflow.
    zIndex: 1,
  },
  trailing: {
    minWidth: splitButtonMinInteractiveSize,
    borderStyle: 'solid',
  },
  // Clips the ripple and background to the trailing segment's current
  // (possibly animated) shape, since `TouchableRipple`'s own clip is static
  // and would let the ripple show past the segment once its corners morph.
  trailingClip: {
    overflow: 'hidden',
  },
  ripple: {
    height: '100%',
  },
  leadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flexShrink: 1,
  },
  trailingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusRing: {
    position: 'absolute',
    top: -splitButtonFocusRingInset,
    left: -splitButtonFocusRingInset,
    right: -splitButtonFocusRingInset,
    bottom: -splitButtonFocusRingInset,
    borderWidth: splitButtonFocusRingThickness,
    pointerEvents: 'none',
  },
  noPointerEvents: {
    pointerEvents: 'none',
  },
});

// Web-only style; not in StyleSheet because `outline` is outside ViewStyle.
// Suppresses the browser's own focus outline in favor of the custom ring
// above.
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const webNoOutline = { outline: 'none' } as unknown as ViewStyle;

export default SplitButton;
