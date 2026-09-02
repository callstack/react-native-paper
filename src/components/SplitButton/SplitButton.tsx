import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type {
  AccessibilityState,
  ColorValue,
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  TextStyle,
  ViewProps,
  ViewStyle,
} from 'react-native';

import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
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
import { useInternalTheme } from '../../core/theming';
import type { $Omit, ThemeProp } from '../../types';
import hasTouchHandler from '../../utils/hasTouchHandler';
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
  const sizeStyle = React.useMemo(
    () => getSplitButtonSizeStyle({ size, theme }),
    [size, theme]
  );
  const isTrailingExpanded = trailingAccessibilityState?.expanded === true;
  const trailingIconRotation = useSharedValue(isTrailingExpanded ? 1 : 0);
  const trailingInnerRadiusProgress = useSharedValue(
    isTrailingExpanded ? 1 : 0
  );
  const colors = React.useMemo(
    () =>
      getSplitButtonColors({
        theme,
        mode,
        disabled,
        customButtonColor,
        customTextColor,
      }),
    [theme, mode, disabled, customButtonColor, customTextColor]
  );
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
  // Shared between the trailing `Surface`'s own start-corner props (for its
  // elevation shadow) and the inner clip view's animated style below, so
  // both always land on the same radius.
  const trailingStartRadius = useDerivedValue(
    () =>
      trailingRestingRadius +
      trailingInnerRadiusProgress.value *
        (trailingExpandedRadius - trailingRestingRadius)
  );
  const trailingAnimatedShapeStyle = useAnimatedStyle(() => ({
    borderTopStartRadius: trailingStartRadius.value,
    borderBottomStartRadius: trailingStartRadius.value,
  }));
  const trailingIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${trailingIconRotation.value * 180}deg` }],
  }));
  // Per the M3 spec, the trailing button's color doesn't change when
  // selected (expanded) — only a state layer is applied on top of it.
  const trailingStateLayerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: disabled
      ? 0
      : trailingInnerRadiusProgress.value * splitButtonStateLayerOpacity,
  }));
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

  // Both `Surface`s below always get a constant `'transparent'`
  // `backgroundColor` rather than switching to `colors.containerColor`
  // once `containerOpacity` reaches 1: `colors.containerColor` may be a
  // Material You `PlatformColor`, and flipping `Surface`'s `backgroundColor`
  // between that and a plain string across renders (e.g. toggling
  // `disabled`) crashes Reanimated's CSS-transition engine. The real
  // (possibly platform) color is always painted via the plain, non-animated
  // `ButtonBackground` view instead.
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
        {...leadingShape}
        elevation={colors.elevation}
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
          backgroundColor={colors.containerColor}
          opacity={colors.containerOpacity}
          borderRadiusStyle={leadingShape}
        />
        <TouchableRipple
          borderless
          disabled={disabled}
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={leadingHasTouchHandler ? onPressIn : undefined}
          onPressOut={leadingHasTouchHandler ? onPressOut : undefined}
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
      </Surface>

      <Surface
        testID={getTestID('trailing-container')}
        {...trailingShape}
        borderTopStartRadius={trailingStartRadius}
        borderBottomStartRadius={trailingStartRadius}
        elevation={colors.elevation}
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
            backgroundColor={colors.containerColor}
            opacity={colors.containerOpacity}
            borderRadiusStyle={trailingShape}
          />
          <Animated.View
            testID={getTestID('trailing-state-layer')}
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
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
            delayLongPress={trailingDelayLongPress}
            accessibilityLabel={trailingAccessibilityLabel}
            accessibilityRole="button"
            accessibilityState={trailingAccessibilityStateWithDisabled}
            background={background}
            hitSlop={resolvedTrailingHitSlop}
            rippleColor={rippleColor}
            style={styles.ripple}
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
      </Surface>
    </View>
  );
};

// Always rendered (rather than skipped once `opacity` reaches 1) since the
// `Surface`s above never get the real, possibly-`PlatformColor` value as
// their own `backgroundColor` — see the comment above `commonButtonStyle`.
const ButtonBackground = ({
  testID,
  backgroundColor,
  opacity,
  borderRadiusStyle,
}: {
  testID?: string;
  backgroundColor: ColorValue;
  opacity: number;
  borderRadiusStyle: ViewStyle;
}) => {
  return (
    <View
      testID={testID}
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        borderRadiusStyle,
        { backgroundColor, opacity },
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
});

export default SplitButton;
