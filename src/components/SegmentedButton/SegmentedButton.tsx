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

type Props = {
  icon?: IconSource;
  color?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  onPress?: (value?: GestureResponderEvent | string) => void;
  value?: string;
  label?: string;
  multiselect?: boolean;
  status?: 'checked' | 'unchecked';
  segment?: 'first' | 'last';
  showSelectedCheck?: boolean;
  density?: 0 | -1 | -2 | -3;
  style?: StyleProp<ViewStyle>;
  theme: Theme;
};

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
  label,
  onPress,
  segment,
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

  const handleOnPress = (e?: GestureResponderEvent | string) => {
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
        style={rippleStyle}
      >
        <View style={[styles.content]}>
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
    marginVertical: 9,
    marginHorizontal: 16,
  },
});

export default withTheme(SegmentedButton);

// @component-docs ignore-next-line
const SegmentedButtonWithTheme = withTheme(SegmentedButton);
// @component-docs ignore-next-line
export { SegmentedButtonWithTheme as SegmentedButton };
