import * as React from 'react';
import { StyleSheet } from 'react-native';

import AnimatedText from '../../Typography/AnimatedText';

import { LabelBackgroundProps } from '../types';

const LabelBackground = ({
  parentState,
  labelProps: {
    placeholderStyle,
    topPosition,
    hasActiveOutline,
    label,
    backgroundColor,
  },
  labelStyle,
}: LabelBackgroundProps) =>
  label ? (
    <AnimatedText
      style={[
        placeholderStyle,
        labelStyle,
        {
          top: topPosition + 1,
          transform: [
            ...labelStyle.transform,
            {
              scaleY: parentState.labeled.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 1],
              }),
            },
          ],
        },
        styles.outlinedLabel || {},
        {
          backgroundColor,
          opacity: parentState.labeled.interpolate({
            inputRange: [0, 1],
            outputRange: [hasActiveOutline || parentState.value ? 1 : 0, 0],
          }),
        },
      ]}
      numberOfLines={1}
    >
      {label}
    </AnimatedText>
  ) : null;

export default LabelBackground;

const styles = StyleSheet.create({
  outlinedLabel: {
    position: 'absolute',
    left: 10,
    paddingHorizontal: 4,
    color: 'transparent',
  },
});
