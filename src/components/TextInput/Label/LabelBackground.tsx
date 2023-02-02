import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';

import { useInternalTheme } from '../../../core/theming';
import AnimatedText from '../../Typography/AnimatedText';
import type { LabelBackgroundProps } from '../types';

const LabelBackground = ({
  parentState,
  labelProps: {
    placeholderStyle,
    baseLabelTranslateX,
    topPosition,
    label,
    backgroundColor,
    roundness,
  },
  labelStyle,
  maxFontSizeMultiplier,
  theme: themeOverrides,
}: LabelBackgroundProps) => {
  const opacity = parentState.labeled.interpolate({
    inputRange: [0, 0.6],
    outputRange: [1, 0],
  });

  const { isV3 } = useInternalTheme(themeOverrides);

  const labelTranslationX = {
    translateX: parentState.labeled.interpolate({
      inputRange: [0, 1],
      outputRange: [-baseLabelTranslateX, 0],
    }),
  };

  const labelTextScaleY = {
    scaleY: parentState.labeled.interpolate({
      inputRange: [0, 1],
      outputRange: [0.2, 1],
    }),
  };

  const labelTextTransform = [...labelStyle.transform, labelTextScaleY];

  const labelTextWidth = isV3
    ? {
        width:
          parentState.labelLayout.width - placeholderStyle.paddingHorizontal,
      }
    : {
        maxWidth:
          parentState.labelLayout.width -
          2 * placeholderStyle.paddingHorizontal,
      };

  const isRounded = roundness > 6;
  const roundedEdgeCover = isRounded ? (
    <Animated.View
      key="labelBackground-view"
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        styles.view,
        {
          backgroundColor,
          maxHeight: Math.max(roundness / 3, 2),
          bottom: Math.max(roundness, 2),
          transform: [labelTranslationX],
          opacity,
        },
      ]}
    />
  ) : null;

  return [
    roundedEdgeCover,
    <AnimatedText
      key="labelBackground-text"
      style={[
        placeholderStyle,
        labelStyle,
        styles.outlinedLabel,
        isV3 && styles.md3OutlinedLabel,
        {
          top: topPosition + 1,
          backgroundColor,
          opacity,
          transform: labelTextTransform,
        },
        labelTextWidth,
      ]}
      numberOfLines={1}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
    >
      {label}
    </AnimatedText>,
  ];
};

export default LabelBackground;

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    top: 6,
    left: 10,
    width: 12,
  },
  // eslint-disable-next-line react-native/no-color-literals
  outlinedLabel: {
    position: 'absolute',
    left: 18,
    paddingHorizontal: 0,
    color: 'transparent',
  },
  md3OutlinedLabel: {
    left: 8,
  },
});
