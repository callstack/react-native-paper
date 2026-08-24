import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  GestureResponderEvent,
  NativeSyntheticEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  TargetedEvent,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { useSharedValue, withSpring } from 'react-native-reanimated';

import SegmentedButtonContent from './SegmentedButtonContent';
import { SegmentedButtonTokens } from './tokens';
import {
  getSegmentedButtonBorderRadius,
  getSegmentedButtonColors,
  getSegmentedButtonHeight,
  getSegmentedButtonOutlineStyle,
} from './utils';
import { tokens } from '../../theme/tokens';
import type { Theme } from '../../types';
import { isKeyboardFocusEvent } from '../../utils/isKeyboardFocusEvent';
import type { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';

const focusIndicatorTokens = tokens.md.sys.state.focusIndicator;
const stateOpacity = tokens.md.sys.state.opacity;
const FOCUS_RING_OUTSET =
  focusIndicatorTokens.thickness + focusIndicatorTokens.outerOffset;

export type Props = {
  /**
   * Whether the segmented button is checked
   */
  checked: boolean;
  /**
   * Accessibility role determined by the segmented button selection variant.
   */
  role: 'radio' | 'checkbox';
  /**
   * Icon to display for the `SegmentedButtonItem`.
   */
  icon?: IconSource;
  /**
   * @supported Available in v5.x with theme version 3
   * Custom color for unchecked Text and Icon.
   */
  uncheckedColor?: string;
  /**
   * @supported Available in v5.x with theme version 3
   * Custom color for checked Text and Icon.
   */
  checkedColor?: string;
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;
  /**
   * Type of background drawabale to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Accessibility label for the `SegmentedButtonItem`. This is read by the screen reader when the user taps the button.
   */
  'aria-label'?: string;
  /**
   * Function to execute on press.
   */
  onPress?: (event: GestureResponderEvent) => void;
  /**
   * Value of button.
   */
  value: string;
  /**
   * Label text of the button.
   */
  label?: string;
  /**
   * Button segment.
   */
  segment?: 'first' | 'last';
  /**
   * Show optional check icon to indicate selected state
   */
  showSelectedCheck?: boolean;
  /**
   * Density is applied to the height, to allow usage in denser UIs.
   */
  density?: 'regular' | 'small' | 'medium' | 'high';
  /**
   * Specifies the largest possible scale a label font can reach.
   */
  labelMaxFontSizeMultiplier?: number;
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
   * Sets additional distance outside of element in which a press can be detected.
   */
  hitSlop?: TouchableRippleProps['hitSlop'];
  /**
   * Resolved theme inherited from the segmented button group.
   */
  theme: Theme;
};

const SegmentedButtonItem = ({
  checked,
  role,
  'aria-label': ariaLabel,
  disabled,
  style,
  labelStyle,
  showSelectedCheck,
  checkedColor,
  uncheckedColor,
  background,
  icon,
  testID,
  label,
  onPress,
  segment,
  density = 'regular',
  theme,
  labelMaxFontSizeMultiplier,
  hitSlop,
}: Props) => {
  const [pressed, setPressed] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const checkmarkScale = useSharedValue(0);

  React.useEffect(() => {
    if (!showSelectedCheck) {
      return;
    }

    checkmarkScale.value = withSpring(checked ? 1 : 0);
  }, [checked, checkmarkScale, showSelectedCheck]);

  const accessibilityLabel = label || ariaLabel;

  const {
    backgroundColor,
    borderColor,
    borderOpacity,
    focusIndicatorColor,
    stateLayerColor,
    textColor,
    textOpacity,
  } = getSegmentedButtonColors({
    checked,
    theme,
    disabled,
    checkedColor,
    uncheckedColor,
  });
  const segmentBorderRadius = getSegmentedButtonBorderRadius({
    theme,
    segment,
  });
  const outlineStyle = getSegmentedButtonOutlineStyle(segment);
  const containerHeight = getSegmentedButtonHeight(density);
  const focusRingVerticalInset =
    (SegmentedButtonTokens.touchTargetHeight - containerHeight) / 2 -
    FOCUS_RING_OUTSET;
  const labelTextStyle: TextStyle = {
    ...theme.fonts.labelLarge,
    color: textColor,
  };
  const touchableStyle = [
    styles.touchable,
    segmentBorderRadius,
    Platform.OS === 'web' ? webNoOutline : undefined,
  ];
  const visualStyle = [
    styles.visual,
    segmentBorderRadius,
    { height: containerHeight, backgroundColor },
  ];
  const outlineContainerStyle = [
    styles.outline,
    segmentBorderRadius,
    outlineStyle,
    { borderColor, opacity: borderOpacity },
  ];
  const focusRingStyle = [
    styles.focusRing,
    segmentBorderRadius,
    {
      top: focusRingVerticalInset,
      bottom: focusRingVerticalInset,
      borderColor: focusIndicatorColor,
    },
  ];

  const shouldShowCheckIcon = Boolean(checked && showSelectedCheck);
  const shouldShowOptionIcon = Boolean(
    icon && (!label || !shouldShowCheckIcon)
  );

  const stateLayerOpacity = disabled
    ? 0
    : pressed
      ? stateOpacity.pressed
      : focused
        ? stateOpacity.focused
        : hovered
          ? stateOpacity.hovered
          : 0;
  const showFocusRing = focused && !disabled;

  const handleFocus = (event: NativeSyntheticEvent<TargetedEvent>) => {
    if (disabled || !isKeyboardFocusEvent(event)) {
      return;
    }

    setFocused(true);
  };

  const handleBlur = () => {
    setPressed(false);
    setFocused(false);
  };

  return (
    <View style={[styles.button, showFocusRing && styles.focusedButton, style]}>
      <TouchableRipple
        borderless
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={accessibilityLabel}
        aria-disabled={disabled}
        aria-checked={checked}
        role={role}
        disabled={disabled}
        focusable={!disabled}
        testID={testID}
        style={touchableStyle}
        background={background}
        rippleColor="transparent"
        underlayColor="transparent"
        hitSlop={hitSlop}
      >
        <View
          testID={testID ? `${testID}-container` : undefined}
          style={visualStyle}
        >
          <View
            pointerEvents="none"
            testID={testID ? `${testID}-state-layer` : undefined}
            style={[
              styles.stateLayer,
              {
                backgroundColor: stateLayerColor,
                opacity: stateLayerOpacity,
              },
            ]}
          />
          <SegmentedButtonContent
            checkmarkScale={checkmarkScale}
            icon={icon}
            label={label}
            labelMaxFontSizeMultiplier={labelMaxFontSizeMultiplier}
            labelStyle={labelStyle}
            labelTextStyle={labelTextStyle}
            shouldShowCheckIcon={shouldShowCheckIcon}
            shouldShowOptionIcon={shouldShowOptionIcon}
            testID={testID}
            textColor={textColor}
            textOpacity={textOpacity}
          />
          <View
            pointerEvents="none"
            testID={testID ? `${testID}-outline` : undefined}
            style={outlineContainerStyle}
          />
        </View>
      </TouchableRipple>
      {showFocusRing ? (
        <View
          pointerEvents="none"
          testID={testID ? `${testID}-focus-ring` : undefined}
          style={focusRingStyle}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minWidth: SegmentedButtonTokens.minimumWidth,
    minHeight: SegmentedButtonTokens.touchTargetHeight,
    justifyContent: 'center',
    overflow: 'visible',
  },
  focusedButton: {
    zIndex: 1,
  },
  touchable: {
    minHeight: SegmentedButtonTokens.touchTargetHeight,
    justifyContent: 'center',
  },
  visual: {
    width: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  stateLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  outline: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
  },
  focusRing: {
    position: 'absolute',
    left: -FOCUS_RING_OUTSET,
    right: -FOCUS_RING_OUTSET,
    borderWidth: focusIndicatorTokens.thickness,
    pointerEvents: 'none',
  },
});

const webNoOutline = { outline: 'none' } as unknown as ViewStyle;

export default SegmentedButtonItem;

export { SegmentedButtonItem as SegmentedButton };
