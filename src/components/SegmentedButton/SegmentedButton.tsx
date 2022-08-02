import * as React from 'react';
import {
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  StyleSheet,
  View,
} from 'react-native';
import { withTheme } from '../../core/theming';
import Text from '../Typography/Text';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { IconSource } from '../Icon';
import type { MD3Theme } from '../../types';
import { getButtonColors } from '../Button/utils';
import color from 'color';
import Icon from '../Icon';
import { SegmentedButtonGroupContext } from './SegmentedButtonGroup';

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
  segment?: 'first' | 'last' | 'default';
  density?: 0 | -1 | -2 | -3;
  style?: StyleProp<ViewStyle>;
  theme: MD3Theme;
};

const SegmentedButton = ({
  value,
  status,
  theme,
  accessibilityLabel,
  disabled,
  style,
  multiselect,
  icon,
  label,
  onPress,
  segment = 'default',
}: Props) => {
  const context = React.useContext(SegmentedButtonGroupContext);

  if (!context) {
    throw new Error(
      "<SegmentedButton/> can't be used without <SegmentedButton.Group/> wrapper."
    );
  }

  const checked: boolean | null =
    (context && Array.isArray(context.value)
      ? context.value.includes(value || '')
      : context.value === value) || status === 'checked';

  const { roundness, isV3, dark } = theme;
  const { borderColor, textColor, borderWidth } = getButtonColors({
    customButtonColor: undefined,
    customTextColor: undefined,
    theme,
    mode: 'outlined',
    disabled,
    dark,
  });

  const borderRadius = (isV3 ? 5 : 1) * roundness;
  const segmentBorderRadius = {
    borderRadius,
    ...(segment === 'first'
      ? {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderRightWidth: 0,
        }
      : segment === 'last'
      ? {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }
      : { borderRadius: 0, borderRightWidth: 0 }),
  };
  const rippleColor = color(textColor).alpha(0.12).rgb().string();

  const iconSize = isV3 ? 18 : 16;
  const iconStyle = { marginRight: label ? 5 : checked ? 3 : 0 };

  const buttonStyle: ViewStyle = {
    backgroundColor: checked ? theme.colors.secondaryContainer : 'transparent',
    borderColor,
    borderWidth,
    ...segmentBorderRadius,
  };

  let showIcon = icon && !label ? true : checked ? false : true;

  const handleOnPress = (e?: GestureResponderEvent | string) => {
    if (onPress) {
      onPress(e);
    }
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
        accessibilityRole="button"
        disabled={disabled}
        rippleColor={rippleColor}
        style={[{ ...segmentBorderRadius }, style]}
      >
        <View style={[styles.content]}>
          {checked ? (
            <View style={iconStyle}>
              <Icon source={'check'} size={iconSize} />
            </View>
          ) : null}
          {showIcon ? (
            <View style={iconStyle}>
              <Icon
                source={icon}
                size={iconSize}
                color={disabled ? textColor : undefined}
              />
            </View>
          ) : null}
          <Text
            variant="labelLarge"
            style={[styles.label, disabled && { color: textColor }]}
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
