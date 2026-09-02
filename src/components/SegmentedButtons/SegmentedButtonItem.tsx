import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import SegmentedButtonContent from './SegmentedButtonContent';
import { FOCUS_RING_OUTSET, SegmentedButtonTokens } from './tokens';
import {
  getSegmentedButtonBorderRadius,
  getSegmentedButtonBorderStyles,
  resolveColors,
} from './utils';
import type { SegmentedButtonPosition } from './utils';
import type { Theme } from '../../types';
import { isKeyboardFocusEvent } from '../../utils/isKeyboardFocusEvent';
import type { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';

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
  previousDisabled?: boolean;
  /**
   * Type of background drawable to display the feedback (Android).
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
   * Label text of the button.
   */
  label?: string;
  /**
   * Button segment.
   */
  segment: SegmentedButtonPosition;
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
  disabled = false,
  previousDisabled = false,
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
  const accessibilityLabel = ariaLabel ?? label;

  const [focused, setFocused] = React.useState(false);
  const showFocusRing = focused && !disabled;

  const colors = resolveColors(theme, {
    checked,
    disabled,
    contentColor: checked ? checkedColor : uncheckedColor,
    dividerDisabled: disabled && previousDisabled,
  });

  const borderRadius = getSegmentedButtonBorderRadius(segment);
  const borderStyles = getSegmentedButtonBorderStyles(segment, colors);

  const height = SegmentedButtonTokens.containerHeight[density];

  return (
    <View
      testID={testID && `${testID}-wrapper`}
      style={[
        styles.wrapper,
        borderRadius,
        { backgroundColor: colors.wrapper },
        style,
      ]}
    >
      <TouchableRipple
        borderless
        onPress={onPress}
        aria-label={accessibilityLabel}
        aria-disabled={disabled}
        aria-checked={checked}
        role={role}
        disabled={disabled}
        focusable={!disabled}
        testID={testID}
        background={background}
        hitSlop={hitSlop}
        rippleColor={theme.colors.stateLayerPressed}
        style={[
          styles.touchable,
          borderRadius,
          borderStyles,
          Platform.select({ web: { outline: 'none' } }),
          { height },
        ]}
        onFocus={(event) => {
          if (!disabled && isKeyboardFocusEvent(event)) {
            setFocused(true);
          }
        }}
        onBlur={() => setFocused(false)}
      >
        <SegmentedButtonContent
          checked={checked}
          iconColor={colors.content.iconColor}
          iconOpacity={colors.content.iconOpacity}
          icon={icon}
          label={label}
          labelColor={colors.content.labelColor}
          labelMaxFontSizeMultiplier={labelMaxFontSizeMultiplier}
          labelOpacity={colors.content.labelOpacity}
          labelStyle={labelStyle}
          showSelectedCheck={showSelectedCheck}
          testID={testID}
          theme={theme}
        />
      </TouchableRipple>
      {showFocusRing ? (
        <View
          pointerEvents="none"
          testID={testID && `${testID}-focus-ring`}
          style={[
            styles.focusRing,
            borderRadius,
            { borderColor: colors.focusIndicator },
          ]}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  touchable: {
    width: '100%',
    justifyContent: 'center',
  },
  focusRing: {
    position: 'absolute',
    top: -FOCUS_RING_OUTSET,
    bottom: -FOCUS_RING_OUTSET,
    left: -FOCUS_RING_OUTSET,
    right: -FOCUS_RING_OUTSET,
    borderWidth: SegmentedButtonTokens.focusIndicatorThickness,
    pointerEvents: 'none',
  },
});

export default SegmentedButtonItem;

export { SegmentedButtonItem as SegmentedButton };
