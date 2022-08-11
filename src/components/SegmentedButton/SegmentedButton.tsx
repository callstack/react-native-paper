import * as React from 'react';
import {
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  StyleSheet,
  View,
  TextStyle,
  Animated,
} from 'react-native';
import { withTheme } from '../../core/theming';
import Text from '../Typography/Text';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { IconSource } from '../Icon';
import type { Theme } from '../../types';
import color from 'color';
import Icon from '../Icon';
import { SegmentedButtonGroupContext } from './SegmentedButtonGroup';
import {
  getSegmentedButtonBorderRadius,
  getSegmentedButtonColors,
} from './utils';

const DEFAULT_PADDING = 9;

export type Props = {
  /**
   * Icon to display for the `SegmentedButton`.
   */
  icon?: IconSource;
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;
  /**
   * Accessibility label for the `SegmentedButton`. This is read by the screen reader when the user taps the button.
   */
  accessibilityLabel?: string;
  /**
   * Function to execute on press.
   */
  onPress?: (event?: GestureResponderEvent) => void;
  /**
   * Value of button.
   */
  value?: string;
  /**
   * Label text of the button.
   */
  label?: string;
  /**
   * Support multiple selected options.
   */
  multiselect?: boolean;
  /**
   * Status of button.
   */
  status?: 'checked' | 'unchecked';
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
  density?: 0 | -1 | -2 | -3;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: Theme;
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

/**
 * Segmented buttons can be used to select options, switch views or sort elements.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/segmented-button.png" />
 * </div>
 */
const SegmentedButton = ({
  value,
  status,
  theme,
  accessibilityLabel,
  disabled,
  style,
  multiselect,
  showSelectedCheck,
  icon,
  testID,
  label,
  onPress,
  segment,
  density = 0,
}: Props) => {
  const context = React.useContext(SegmentedButtonGroupContext);

  if (!context) {
    throw new Error(
      "<SegmentedButton/> can't be used without <SegmentedButton.Group/> wrapper."
    );
  }

  const checkScale = React.useRef(new Animated.Value(0)).current;

  const checked =
    (context && Array.isArray(context.value)
      ? context.value.includes(value || '')
      : context.value === value) || status === 'checked';

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
    });

  const borderRadius = (isV3 ? 5 : 1) * roundness;
  const segmentBorderRadius = getSegmentedButtonBorderRadius({
    theme,
    segment,
  });
  const rippleColor = color(textColor).alpha(0.12).rgb().string();

  const iconSize = isV3 ? 18 : 16;
  const iconStyle = {
    marginRight: label ? 5 : checked && showSelectedCheck ? 3 : 0,
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
  const paddingVertical = density
    ? DEFAULT_PADDING + density * 2
    : DEFAULT_PADDING;

  const rippleStyle: ViewStyle = {
    borderRadius,
    ...segmentBorderRadius,
  };
  const showIcon = icon && !label ? true : checked ? !showSelectedCheck : true;
  const textStyle: TextStyle = {
    ...(!isV3 && {
      textTransform: 'uppercase',
      fontWeight: '500',
    }),
    color: textColor,
  };

  const handleOnPress = (e?: GestureResponderEvent) => {
    onPress?.(e);

    if (!value) {
      return;
    }

    if (multiselect && Array.isArray(context.value)) {
      context.onValueChange(
        checked
          ? [...context.value.filter((val) => value !== val)]
          : [...context.value, value]
      );
    } else {
      context.onValueChange(!checked ? value : null);
    }
  };

  return (
    <View style={[buttonStyle, [styles.button, style]]}>
      <TouchableRipple
        borderless
        delayPressIn={0}
        onPress={handleOnPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled, checked }}
        accessibilityRole="button"
        disabled={disabled}
        rippleColor={rippleColor}
        testID={testID}
        style={rippleStyle}
      >
        <View style={[styles.content, { paddingVertical }]}>
          {checked && showSelectedCheck ? (
            <Animated.View
              style={[iconStyle, { transform: [{ scale: checkScale }] }]}
            >
              <Icon source={'check'} size={iconSize} />
            </Animated.View>
          ) : null}
          {showIcon ? (
            <Animated.View style={iconStyle}>
              <Icon
                source={icon}
                size={iconSize}
                color={disabled ? textColor : undefined}
              />
            </Animated.View>
          ) : null}
          <Text
            variant="labelLarge"
            style={[styles.label, textStyle]}
            selectable={false}
            numberOfLines={1}
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
    minWidth: 64,
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

export default withTheme(SegmentedButton);

// @component-docs ignore-next-line
const SegmentedButtonWithTheme = withTheme(SegmentedButton);
// @component-docs ignore-next-line
export { SegmentedButtonWithTheme as SegmentedButton };
