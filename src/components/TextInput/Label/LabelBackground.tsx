import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';

import AnimatedText from '../../Typography/AnimatedText';

import type { LabelBackgroundProps } from '../types';

const LabelBackground = ({
  parentState,
  labelProps: {
    placeholderStyle,
    baseLabelTranslateX,
    topPosition,
    hasActiveOutline,
    label,
    backgroundColor,
    roundness,
  },
  labelStyle,
  maxFontSizeMultiplier,
}: LabelBackgroundProps) => {
  const hasFocus = hasActiveOutline || parentState.value;
  const opacity = parentState.labeled.interpolate({
    inputRange: [0, 1],
    outputRange: [hasFocus ? 1 : 0, 0],
  });

  const labelTranslationX = {
    transform: [
      {
        translateX: parentState.labeled.interpolate({
          inputRange: [0, 1],
          outputRange: [-baseLabelTranslateX, 0],
        }),
      },
    ],
  };

  return label
    ? [
        <Animated.View
          key="labelBackground-view"
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.view,
            {
              backgroundColor,
              maxHeight: Math.max(roundness / 3, 2),
              opacity,
              bottom: Math.max(roundness, 2),
            },
            labelTranslationX,
          ]}
        />,
        <AnimatedText
          key="labelBackground-text"
          style={[
            placeholderStyle,
            labelStyle,
            styles.outlinedLabel,
            {
              top: topPosition + 1,
              backgroundColor,
              opacity,
              transform: [
                ...labelStyle.transform,
                {
                  scaleY: parentState.labeled.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 1],
                  }),
                },
              ],
              maxWidth:
                parentState.labelLayout.width -
                2 * placeholderStyle.paddingHorizontal,
            },
          ]}
          numberOfLines={1}
          maxFontSizeMultiplier={maxFontSizeMultiplier}
        >
          {label}
        </AnimatedText>,
      ]
    : null;
};

export default LabelBackground;

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    top: 6,
    left: 10,
    width: 12,
  },
  outlinedLabel: {
    position: 'absolute',
    left: 18,
    paddingHorizontal: 0,
    color: 'transparent',
  },
});
