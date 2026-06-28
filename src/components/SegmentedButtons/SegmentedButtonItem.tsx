import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type {
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import Animated from 'react-native-reanimated';

import {
  getSegmentedButtonBorderRadius,
  getSegmentedButtonColors,
  getSegmentedButtonDensityPadding,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import type { IconSource } from '../Icon';
import Icon from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

export type Props = {
  /**
   * Whether the segmented button is checked
   */
  checked: boolean;
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
   * @optional
   */
  theme?: ThemeProp;
};

const SegmentedButtonItem = ({
  checked,
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
  theme: themeOverrides,
  labelMaxFontSizeMultiplier,
  hitSlop,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const { borderColor, textColor, textOpacity, borderWidth, backgroundColor } =
    getSegmentedButtonColors({
      checked,
      theme,
      disabled,
      checkedColor,
      uncheckedColor,
    });

  const borderRadius = theme.shapes.corner.largeIncreased;
  const segmentBorderRadius = getSegmentedButtonBorderRadius({
    theme,
    segment,
  });
  const showIcon = !icon ? false : label && checked ? !showSelectedCheck : true;
  const showCheckedIcon = checked && showSelectedCheck;

  const iconSize = 18;
  const iconTransitionStyle: React.ComponentProps<
    typeof Animated.View
  >['style'] = {
    transitionDuration: 150 * theme.animation.scale,
    transitionProperty: 'transform',
  };
  const iconStyle = {
    marginRight: label ? 5 : showCheckedIcon ? 3 : 0,
    ...(label && {
      transform: [
        {
          scale: checked && showSelectedCheck ? 0 : 1,
        },
      ],
    }),
  };

  const buttonStyle: ViewStyle = {
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius,
    ...segmentBorderRadius,
  };
  const paddingVertical = getSegmentedButtonDensityPadding({ density });
  const rippleStyle: ViewStyle = {
    borderRadius,
    ...segmentBorderRadius,
  };
  const labelTextStyle: TextStyle = {
    ...theme.fonts.labelLarge,
    color: textColor,
  };

  return (
    <View style={[buttonStyle, styles.button, style]}>
      <TouchableRipple
        borderless
        onPress={onPress}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        aria-checked={checked}
        role="button"
        disabled={disabled}
        testID={testID}
        style={rippleStyle}
        background={background}
        theme={theme}
        hitSlop={hitSlop}
      >
        <View
          style={[styles.content, { paddingVertical, opacity: textOpacity }]}
        >
          {showCheckedIcon ? (
            <Animated.View
              testID={`${testID}-check-icon`}
              style={[
                iconStyle,
                iconTransitionStyle,
                { transform: [{ scale: checked ? 1 : 0 }] },
              ]}
            >
              <Icon source={'check'} size={iconSize} color={textColor} />
            </Animated.View>
          ) : null}
          {showIcon ? (
            <Animated.View
              testID={`${testID}-icon`}
              style={[iconStyle, iconTransitionStyle]}
            >
              <Icon source={icon} size={iconSize} color={textColor} />
            </Animated.View>
          ) : null}
          <Text
            variant="labelLarge"
            style={[styles.label, labelTextStyle, labelStyle]}
            selectable={false}
            numberOfLines={1}
            maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
            testID={`${testID}-label`}
          >
            {label}
          </Text>
        </View>
      </TouchableRipple>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minWidth: 76,
    borderStyle: 'solid',
  },
  label: {
    textAlign: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
});

export default SegmentedButtonItem;

export { SegmentedButtonItem as SegmentedButton };
