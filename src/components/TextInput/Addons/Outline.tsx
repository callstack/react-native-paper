import * as React from 'react';
import {
  StyleSheet,
  ColorValue,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import { TextInputLabelProp } from '../types';

type OutlineProps = {
  activeColor: string;
  backgroundColor: ColorValue;
  hasActiveOutline?: boolean;
  outlineColor?: string;
  roundness?: number;
  label?: TextInputLabelProp;
  style?: StyleProp<ViewStyle>;
};

export const Outline = ({
  label,
  activeColor,
  backgroundColor,
  hasActiveOutline,
  outlineColor,
  roundness,
  style,
}: OutlineProps) => (
  <View
    testID="text-input-outline"
    pointerEvents="none"
    style={[
      styles.outline,
      !label && styles.noLabelOutline,
      // eslint-disable-next-line react-native/no-inline-styles
      {
        backgroundColor,
        borderRadius: roundness,
        borderWidth: hasActiveOutline ? 2 : 1,
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
  noLabelOutline: {
    top: 0,
  },
});
