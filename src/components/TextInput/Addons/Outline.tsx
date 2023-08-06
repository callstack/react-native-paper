import * as React from 'react';
import {
  StyleSheet,
  ColorValue,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

type OutlineProps = {
  isV3: boolean;
  activeColor: string;
  backgroundColor: ColorValue;
  hasActiveOutline?: boolean;
  focused?: boolean;
  outlineColor?: string;
  roundness?: number;
  style?: StyleProp<ViewStyle>;
};

export const Outline = ({
  isV3,
  activeColor,
  backgroundColor,
  hasActiveOutline,
  focused,
  outlineColor,
  roundness,
  style,
}: OutlineProps) => (
  <View
    testID="text-input-outline"
    pointerEvents="none"
    style={[
      styles.outline,
      // eslint-disable-next-line react-native/no-inline-styles
      {
        backgroundColor,
        borderRadius: roundness,
        borderWidth: (isV3 ? hasActiveOutline : focused) ? 2 : 1,
        borderColor: hasActiveOutline ? activeColor : outlineColor,
      },
      style,
    ]}
  />
);

const styles = StyleSheet.create({
  outline: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 6,
    bottom: 0,
  },
});
