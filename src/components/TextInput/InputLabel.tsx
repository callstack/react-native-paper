
import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import Text from '../Typography/Text';

import { InputLabelProps } from './types';

const AnimatedText = Animated.createAnimatedComponent(Text);

const InputLabel = (props: InputLabelProps) => {
  const { parentState } = props;

  const {
    label,
    error,
    onLayoutAnimatedText,
    hasActiveOutline,
    activeColor,
    placeholderStyle,
    baseLabelTranslateX,
    baseLabelTranslateY,
    font,
    fontSize,
    placeholderOpacity,
    wiggleOffsetX,
    labelScale,
    topPosition,
    paddingOffset,
    placeholderColor,
  } = props.labelProps;

  const labelTranslationX = {
    transform: [
      {
        // Offset label scale since RN doesn't support transform origin
        translateX: parentState.labeled.interpolate({
          inputRange: [0, 1],
          outputRange: [baseLabelTranslateX, 0],
        }),
      },
    ],
  };

  const labelStyle = {
    ...font,
    fontSize,
    transform: [
      {
        // Wiggle the label when there's an error
        translateX: parentState.error.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, parentState.value && error ? wiggleOffsetX : 0, 0],
        }),
      },
      {
        // Move label to top
        translateY: parentState.labeled.interpolate({
          inputRange: [0, 1],
          outputRange: [baseLabelTranslateY, 0],
        }),
      },
      {
        // Make label smaller
        scale: parentState.labeled.interpolate({
          inputRange: [0, 1],
          outputRange: [labelScale, 1],
        }),
      },
    ],
  };

  return label ? (
    // Position colored placeholder and gray placeholder on top of each other and crossfade them
    // This gives the effect of animating the color, but allows us to use native driver
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          opacity:
            // Hide the label in minimized state until we measure it's width
            parentState.value || parentState.focused
              ? parentState.labelLayout.measured
                ? 1
                : 0
              : 1,
        },
        labelTranslationX,
      ]}
    >
      <AnimatedText
        onLayout={onLayoutAnimatedText}
        style={[
          placeholderStyle,
          {
            top: topPosition,
          },
          labelStyle,
          paddingOffset || {},
          {
            color: activeColor,
            opacity: parentState.labeled.interpolate({
              inputRange: [0, 1],
              outputRange: [hasActiveOutline ? 1 : 0, 0],
            }),
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </AnimatedText>
      <AnimatedText
        style={[
          placeholderStyle,
          {
            top: topPosition,
          },
          labelStyle,
          paddingOffset,
          {
            color: placeholderColor,
            opacity: placeholderOpacity,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </AnimatedText>
    </Animated.View>
  ) : null;
};

export default InputLabel;
