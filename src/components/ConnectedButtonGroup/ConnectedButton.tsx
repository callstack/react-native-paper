import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type {
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { ConnectedButtonGroupSize } from './tokens';
import {
  getConnectedButtonColors,
  getConnectedButtonHitSlop,
  getConnectedButtonRippleColor,
  getConnectedButtonSizeStyle,
  type ConnectedButtonPosition,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import Icon, { type IconSource } from '../Icon';
import TouchableRipple, {
  type Props as TouchableRippleProps,
} from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

export type Props = {
  /**
   * Whether the button is currently selected.
   */
  checked: boolean;
  /**
   * Position of the button inside the connected group. Controls which corners
   * stay pinned to the group's outer radius and which morph on selection/press.
   */
  position: ConnectedButtonPosition;
  /**
   * Size of the button, matching the parent group.
   */
  size: ConnectedButtonGroupSize;
  /**
   * Icon to display before the label.
   */
  icon?: IconSource;
  /**
   * Label text of the button.
   */
  label?: string;
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;
  /**
   * Show an optional check icon in place of the leading icon to indicate the
   * selected state.
   */
  showSelectedCheck?: boolean;
  /**
   * Custom color for the selected label and icon.
   */
  checkedColor?: string;
  /**
   * Custom color for the unselected label and icon.
   */
  uncheckedColor?: string;
  /**
   * Custom ripple color.
   */
  rippleColor?: string;
  /**
   * Type of background drawable to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Accessibility label. Read by the screen reader when the button is focused.
   */
  'aria-label'?: string;
  /**
   * Function to execute on press.
   */
  onPress?: (event: GestureResponderEvent) => void;
  /**
   * Specifies the largest possible scale a label font can reach.
   */
  labelMaxFontSizeMultiplier?: number;
  /**
   * Sets additional distance outside of the button in which a press can be
   * detected.
   */
  hitSlop?: TouchableRippleProps['hitSlop'];
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the button label.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * testID to be used on tests.
   */
  testID?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * A single button within a {@link ConnectedButtonGroup}. Not exported on its
 * own — render it through the group's `buttons` prop.
 */
const ConnectedButton = ({
  checked,
  position,
  size,
  icon,
  label,
  disabled,
  showSelectedCheck,
  checkedColor,
  uncheckedColor,
  rippleColor: customRippleColor,
  background,
  'aria-label': ariaLabel,
  onPress,
  labelMaxFontSizeMultiplier,
  hitSlop,
  style,
  labelStyle,
  testID,
  theme: themeOverrides,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const sizeStyle = React.useMemo(
    () => getConnectedButtonSizeStyle({ size, theme }),
    [size, theme]
  );
  const colors = React.useMemo(
    () =>
      getConnectedButtonColors({
        theme,
        selected: checked,
        disabled,
        checkedColor,
        uncheckedColor,
      }),
    [theme, checked, disabled, checkedColor, uncheckedColor]
  );
  const rippleColor = React.useMemo(
    () =>
      getConnectedButtonRippleColor({
        contentColor: colors.contentColor,
        customRippleColor,
      }),
    [colors.contentColor, customRippleColor]
  );
  const resolvedHitSlop = React.useMemo(
    () => getConnectedButtonHitSlop({ size, hitSlop }),
    [size, hitSlop]
  );

  const { outerRadius, innerRadius, pressedRadius } = sizeStyle;
  const restRadius = checked ? outerRadius : innerRadius;
  const cornerRadius = useSharedValue(restRadius);

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

  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    // The shared value is already initialised to the resting radius, so skip
    // the mount render and only animate subsequent selection / size changes.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    cornerRadius.value = withTiming(restRadius, releaseTimingConfig);
  }, [restRadius, cornerRadius, releaseTimingConfig]);

  const handlePressIn = React.useCallback(() => {
    if (!checked) {
      cornerRadius.value = withTiming(pressedRadius, pressTimingConfig);
    }
  }, [checked, cornerRadius, pressedRadius, pressTimingConfig]);
  const handlePressOut = React.useCallback(() => {
    if (!checked) {
      cornerRadius.value = withTiming(innerRadius, releaseTimingConfig);
    }
  }, [checked, cornerRadius, innerRadius, releaseTimingConfig]);

  // The "outer" side keeps the group's fully-rounded radius; the "inner" side
  // (the connected edge) morphs between the resting, pressed and selected radii.
  const animateStart = position === 'last' || position === 'middle';
  const animateEnd = position === 'first' || position === 'middle';

  const animatedShapeStyle = useAnimatedStyle(() => {
    const morph = cornerRadius.value;
    const startRadius = animateStart ? morph : outerRadius;
    const endRadius = animateEnd ? morph : outerRadius;
    return {
      borderTopStartRadius: startRadius,
      borderBottomStartRadius: startRadius,
      borderTopEndRadius: endRadius,
      borderBottomEndRadius: endRadius,
    };
  }, [animateStart, animateEnd, outerRadius]);

  const showCheck = checked && showSelectedCheck;
  const showIcon = Boolean(icon) && !showCheck;
  const iconGap = label ? { marginEnd: sizeStyle.iconLabelGap } : null;

  const getTestID = (suffix: string) =>
    testID ? `${testID}-${suffix}` : undefined;

  return (
    <Animated.View
      testID={getTestID('container')}
      style={[
        styles.container,
        {
          height: sizeStyle.containerHeight,
          minWidth: sizeStyle.minWidth,
          backgroundColor: colors.containerColor,
        },
        animatedShapeStyle,
        style,
      ]}
    >
      <TouchableRipple
        borderless
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        rippleColor={rippleColor}
        background={background}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        aria-checked={checked}
        role="button"
        hitSlop={resolvedHitSlop}
        style={styles.ripple}
        theme={theme}
        testID={testID}
      >
        <View
          style={[
            styles.content,
            {
              height: sizeStyle.containerHeight,
              paddingStart: sizeStyle.leadingSpace,
              paddingEnd: sizeStyle.trailingSpace,
              opacity: colors.contentOpacity,
            },
          ]}
        >
          {showCheck ? (
            <View testID={getTestID('check-icon')} style={iconGap}>
              <Icon
                source="check"
                size={sizeStyle.iconSize}
                color={colors.contentColor}
              />
            </View>
          ) : null}
          {showIcon ? (
            <View testID={getTestID('icon')} style={iconGap}>
              <Icon
                source={icon}
                size={sizeStyle.iconSize}
                color={colors.contentColor}
              />
            </View>
          ) : null}
          {label ? (
            <Text
              variant={sizeStyle.labelVariant}
              selectable={false}
              numberOfLines={1}
              ellipsizeMode="tail"
              maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
              style={[styles.label, { color: colors.contentColor }, labelStyle]}
              testID={getTestID('label')}
            >
              {label}
            </Text>
          ) : null}
        </View>
      </TouchableRipple>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  ripple: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flexShrink: 1,
    textAlign: 'center',
  },
});

export default ConnectedButton;
