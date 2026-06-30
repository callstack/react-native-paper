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
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { splitButtonElevation, type SplitButtonSize } from './tokens';
import {
  getSplitButtonColors,
  getSplitButtonHitSlop,
  getSplitButtonLeadingShape,
  getSplitButtonRippleColor,
  getSplitButtonSizeStyle,
  getSplitButtonTrailingShape,
  normalizeSplitButtonMode,
  type SplitButtonMode,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import type { $Omit, ThemeProp } from '../../types';
import hasTouchHandler from '../../utils/hasTouchHandler';
import ActivityIndicator from '../ActivityIndicator';
import { getButtonTouchableRippleStyle } from '../Button/utils';
import Icon, { type IconSource } from '../Icon';
import Surface from '../Surface';
import TouchableRipple, {
  type Props as TouchableRippleProps,
} from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

const AnimatedSurface = Animated.createAnimatedComponent(Surface);

export type Props = $Omit<
  ViewProps,
  'children' | 'style' | 'onPress' | 'onPressIn' | 'onPressOut'
> & {
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
  buttonStyle?: StyleProp<ViewStyle>;
  /**
   * Style for the leading button container.
   */
  leadingButtonStyle?: StyleProp<ViewStyle>;
  /**
   * Style for the trailing button container.
   */
  trailingButtonStyle?: StyleProp<ViewStyle>;
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
  trailingIcon = 'menu-down',
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
  const normalizedMode = normalizeSplitButtonMode(mode);
  const sizeStyle = React.useMemo(
    () => getSplitButtonSizeStyle({ size, theme }),
    [size, theme]
  );
  const leadingInnerRadius = useSharedValue(sizeStyle.innerRadius);
  const trailingInnerRadius = useSharedValue(sizeStyle.innerRadius);
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
  const rippleColor = React.useMemo(
    () =>
      getSplitButtonRippleColor({
        contentColor: colors.contentColor,
        customRippleColor,
      }),
    [colors.contentColor, customRippleColor]
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
  const releaseTimingConfig = React.useMemo(
    () => ({
      duration: theme.motion.duration.short3,
      easing: Easing.bezier(...theme.motion.easing.standard),
    }),
    [theme.motion.duration.short3, theme.motion.easing.standard]
  );
  const leadingAnimatedShapeStyle = useAnimatedStyle(
    () => ({
      borderTopStartRadius: sizeStyle.containerRadius,
      borderBottomStartRadius: sizeStyle.containerRadius,
      borderTopEndRadius: leadingInnerRadius.value,
      borderBottomEndRadius: leadingInnerRadius.value,
    }),
    [sizeStyle.containerRadius]
  );
  const trailingAnimatedShapeStyle = useAnimatedStyle(
    () => ({
      borderTopStartRadius: trailingInnerRadius.value,
      borderBottomStartRadius: trailingInnerRadius.value,
      borderTopEndRadius: sizeStyle.containerRadius,
      borderBottomEndRadius: sizeStyle.containerRadius,
    }),
    [sizeStyle.containerRadius]
  );
  const leadingHitSlop = React.useMemo(
    () => getSplitButtonHitSlop({ size, hitSlop }),
    [size, hitSlop]
  );
  const resolvedTrailingHitSlop = React.useMemo(
    () => getSplitButtonHitSlop({ size, hitSlop: trailingHitSlop }),
    [size, trailingHitSlop]
  );

  const { color: customLabelColor, fontSize: customLabelSize } =
    StyleSheet.flatten(labelStyle) || {};
  const contentColor =
    typeof customLabelColor === 'string'
      ? customLabelColor
      : colors.contentColor;
  const labelTextStyle: TextStyle = {
    color: colors.contentColor,
    ...theme.fonts[sizeStyle.labelVariant],
  };
  const disabledState = { disabled: true };
  const leadingAccessibilityState = disabled
    ? { ...accessibilityState, ...disabledState }
    : accessibilityState;
  const trailingAccessibilityStateWithDisabled = disabled
    ? { ...trailingAccessibilityState, ...disabledState }
    : trailingAccessibilityState;
  const isElevationEntitled = !disabled && normalizedMode === 'elevated';
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
  const handleLeadingPressIn = React.useCallback(
    (e: GestureResponderEvent) => {
      onPressIn?.(e);
      leadingInnerRadius.value = withTiming(
        sizeStyle.innerPressedRadius,
        pressTimingConfig
      );
      trailingInnerRadius.value = withTiming(
        sizeStyle.innerRadius,
        releaseTimingConfig
      );
    },
    [
      leadingInnerRadius,
      onPressIn,
      pressTimingConfig,
      releaseTimingConfig,
      sizeStyle.innerPressedRadius,
      sizeStyle.innerRadius,
      trailingInnerRadius,
    ]
  );
  const handleLeadingPressOut = React.useCallback(
    (e: GestureResponderEvent) => {
      onPressOut?.(e);
      leadingInnerRadius.value = withTiming(
        sizeStyle.innerRadius,
        releaseTimingConfig
      );
    },
    [leadingInnerRadius, onPressOut, releaseTimingConfig, sizeStyle.innerRadius]
  );
  const handleTrailingPressIn = React.useCallback(
    (e: GestureResponderEvent) => {
      onTrailingPressIn?.(e);
      trailingInnerRadius.value = withTiming(
        sizeStyle.innerPressedRadius,
        pressTimingConfig
      );
      leadingInnerRadius.value = withTiming(
        sizeStyle.innerRadius,
        releaseTimingConfig
      );
    },
    [
      leadingInnerRadius,
      onTrailingPressIn,
      pressTimingConfig,
      releaseTimingConfig,
      sizeStyle.innerPressedRadius,
      sizeStyle.innerRadius,
      trailingInnerRadius,
    ]
  );
  const handleTrailingPressOut = React.useCallback(
    (e: GestureResponderEvent) => {
      onTrailingPressOut?.(e);
      trailingInnerRadius.value = withTiming(
        sizeStyle.innerRadius,
        releaseTimingConfig
      );
    },
    [
      onTrailingPressOut,
      releaseTimingConfig,
      sizeStyle.innerRadius,
      trailingInnerRadius,
    ]
  );
  React.useEffect(() => {
    leadingInnerRadius.value = sizeStyle.innerRadius;
    trailingInnerRadius.value = sizeStyle.innerRadius;
  }, [leadingInnerRadius, sizeStyle.innerRadius, trailingInnerRadius]);

  const commonButtonStyle: ViewStyle = {
    height: sizeStyle.containerHeight,
    backgroundColor:
      colors.containerOpacity < 1 ? 'transparent' : colors.containerColor,
    borderColor: colors.borderColor,
    borderWidth: colors.borderWidth,
  };
  const elevation = isElevationEntitled
    ? splitButtonElevation.enabled
    : splitButtonElevation.disabled;
  const getTestID = (suffix: string) =>
    testID ? `${testID}-${suffix}` : undefined;

  return (
    <Animated.View
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
      <AnimatedSurface
        testID={getTestID('leading-container')}
        elevation={elevation}
        style={[
          styles.leading,
          commonButtonStyle,
          leadingShape,
          leadingAnimatedShapeStyle,
          buttonStyle,
          leadingButtonStyle,
        ]}
        container
      >
        <ButtonBackground
          backgroundColor={colors.containerColor}
          opacity={colors.containerOpacity}
          borderRadiusStyle={leadingShape}
        />
        <TouchableRipple
          borderless
          disabled={disabled}
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={leadingHasTouchHandler ? handleLeadingPressIn : undefined}
          onPressOut={
            leadingHasTouchHandler ? handleLeadingPressOut : undefined
          }
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
                  ? { marginStart: sizeStyle.leadingIconSize / 3 }
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
      </AnimatedSurface>

      <AnimatedSurface
        testID={getTestID('trailing-container')}
        elevation={elevation}
        style={[
          styles.trailing,
          commonButtonStyle,
          trailingShape,
          trailingAnimatedShapeStyle,
          buttonStyle,
          trailingButtonStyle,
        ]}
        container
      >
        <ButtonBackground
          backgroundColor={colors.containerColor}
          opacity={colors.containerOpacity}
          borderRadiusStyle={trailingShape}
        />
        <TouchableRipple
          borderless
          disabled={disabled}
          onPress={onTrailingPress}
          onLongPress={onTrailingLongPress}
          onPressIn={
            trailingHasTouchHandler ? handleTrailingPressIn : undefined
          }
          onPressOut={
            trailingHasTouchHandler ? handleTrailingPressOut : undefined
          }
          delayLongPress={trailingDelayLongPress}
          accessibilityLabel={trailingAccessibilityLabel}
          accessibilityRole="button"
          accessibilityState={trailingAccessibilityStateWithDisabled}
          background={background}
          hitSlop={resolvedTrailingHitSlop}
          rippleColor={rippleColor}
          style={[
            styles.ripple,
            getButtonTouchableRippleStyle(trailingShape, colors.borderWidth),
          ]}
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
            <Icon
              source={trailingIcon}
              size={sizeStyle.trailingIconSize}
              color={contentColor}
            />
          </View>
        </TouchableRipple>
      </AnimatedSurface>
    </Animated.View>
  );
};

const ButtonBackground = ({
  backgroundColor,
  opacity,
  borderRadiusStyle,
}: {
  backgroundColor: ColorValue;
  opacity: number;
  borderRadiusStyle: ViewStyle;
}) => {
  if (opacity >= 1) {
    return null;
  }

  return (
    <View
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
    minWidth: 48,
    flexShrink: 1,
    borderStyle: 'solid',
  },
  trailing: {
    minWidth: 48,
    borderStyle: 'solid',
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

// @component-docs ignore-next-line
export { SplitButton };
