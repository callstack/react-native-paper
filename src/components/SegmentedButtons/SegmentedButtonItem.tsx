import * as React from 'react';
import {
  Animated,
  ColorValue,
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import color from 'color';
import type { ThemeProp } from 'src/types';

import {
  getSegmentedButtonBorderRadius,
  getSegmentedButtonColors,
  getSegmentedButtonDensityPadding,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import type { IconSource } from '../Icon';
import Icon from '../Icon';
import TouchableRipple, {
  Props as TouchableRippleProps,
} from '../TouchableRipple/TouchableRipple';
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
   * Color of the ripple effect.
   */
  rippleColor?: ColorValue;
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
  accessibilityLabel?: string;
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
  accessibilityLabel,
  disabled,
  style,
  labelStyle,
  showSelectedCheck,
  checkedColor,
  uncheckedColor,
  rippleColor: customRippleColor,
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

  const checkScale = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!showSelectedCheck) {
      return;
    }
    if (checked) {
      Animated.spring(checkScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(checkScale, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [checked, checkScale, showSelectedCheck]);

  const { roundness, isV3 } = theme;
  const { borderColor, textColor, borderWidth, backgroundColor } =
    getSegmentedButtonColors({
      checked,
      theme,
      disabled,
      checkedColor,
      uncheckedColor,
    });

  const borderRadius = (isV3 ? 5 : 1) * roundness;
  const segmentBorderRadius = getSegmentedButtonBorderRadius({
    theme,
    segment,
  });
  const rippleColor =
    customRippleColor || color(textColor).alpha(0.12).rgb().string();

  const showIcon = !icon ? false : label && checked ? !showSelectedCheck : true;
  const showCheckedIcon = checked && showSelectedCheck;

  const iconSize = isV3 ? 18 : 16;
  const iconStyle = {
    marginRight: label ? 5 : showCheckedIcon ? 3 : 0,
    ...(label && {
      transform: [
        {
          scale: checkScale.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
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
    ...(!isV3
      ? {
          textTransform: 'uppercase',
          fontWeight: '500',
        }
      : theme.fonts.labelLarge),
    color: textColor,
  };

  return (
    <View style={[buttonStyle, styles.button, style]}>
      <TouchableRipple
        borderless
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled, checked }}
        accessibilityRole="button"
        disabled={disabled}
        rippleColor={rippleColor}
        testID={testID}
        style={rippleStyle}
        background={background}
        theme={theme}
        hitSlop={hitSlop}
      >
        <View style={[styles.content, { paddingVertical }]}>
          {showCheckedIcon ? (
            <Animated.View
              testID={`${testID}-check-icon`}
              style={[iconStyle, { transform: [{ scale: checkScale }] }]}
            >
              <Icon source={'check'} size={iconSize} color={textColor} />
            </Animated.View>
          ) : null}
          {showIcon ? (
            <Animated.View testID={`${testID}-icon`} style={iconStyle}>
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
