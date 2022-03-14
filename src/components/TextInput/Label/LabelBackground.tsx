import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../../core/theming';

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
}: LabelBackgroundProps) => {
  const hasFocus = hasActiveOutline || parentState.value;
  const opacity = parentState.labeled.interpolate({
    inputRange: [0, 1],
    outputRange: [hasFocus ? 1 : 0, 0],
  });

  const { isV3, colors } = useTheme();

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
            isV3 && styles.md3OutlinedLabel,
            {
              top: topPosition + (isV3 ? 0 : 1),
              backgroundColor: isV3 ? colors.surface : backgroundColor,
              opacity,
              transform: isV3
                ? [...labelStyle.transform]
                : [
                    ...labelStyle.transform,
                    {
                      scaleY: parentState.labeled.interpolate({
                        inputRange: [0, 100],
                        outputRange: [0.2, 100],
                      }),
                    },
                  ],
            },
            isV3
              ? {
                  width:
                    parentState.labelLayout.width -
                    placeholderStyle.paddingHorizontal,
                }
              : {
                  maxWidth:
                    parentState.labelLayout.width -
                    2 * placeholderStyle.paddingHorizontal,
                },
          ]}
          numberOfLines={1}
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
  md3OutlinedLabel: {
    left: 8,
  },
});
