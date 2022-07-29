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

type Props = {
  icon?: IconSource;
  color?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  onPress?: (value?: GestureResponderEvent | string) => void;
  value?: string;
  label?: string;
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
  disabled,
  style,
  icon,
  label,
  onPress,
  segment = 'default',
}: Props) => {
  const checked = status === 'checked';
  const { roundness, isV3 } = theme;
  const { borderColor, textColor, borderWidth } = getButtonColors({
    customButtonColor: undefined,
    customTextColor: undefined,
    theme,
    mode: 'outlined',
    disabled,
    dark: false,
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
          borderLeftWidth: 0,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }
      : { borderRadius: 0 }),
  };

  const rippleColor = color(textColor).alpha(0.12).rgb().string();

  const buttonStyle: ViewStyle = {
    backgroundColor: checked ? theme.colors.secondaryContainer : 'transparent',
    borderColor,
    borderWidth,
    ...segmentBorderRadius,
  };

  const touchableStyle = {
    ...segmentBorderRadius,
  };

  const iconSize = isV3 ? 18 : 16;
  const iconStyle = { marginRight: label ? 5 : 0 };
  let showIcon = icon && !label ? true : checked ? false : true;

  return (
    <View style={[buttonStyle, [styles.button, style]]}>
      <TouchableRipple
        borderless
        delayPressIn={0}
        onPress={() => {
          if (onPress) {
            onPress(value);
          }
        }}
        accessibilityRole="button"
        disabled={disabled}
        rippleColor={rippleColor}
        style={[touchableStyle, style]}
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
