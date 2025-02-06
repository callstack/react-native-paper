import React from 'react';
import {
  Animated,
  ColorValue,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import AnimatedText from '../../Typography/AnimatedText';
import { getConstants } from '../helpers';
import type { InputLabelProps } from '../types';

const InputLabel = (props: InputLabelProps) => {
  const {
    labeled,
    wiggle,
    error,
    focused,
    opacity,
    labelLayoutWidth,
    labelLayoutHeight,
    labelBackground,
    label,
    labelError,
    onLayoutAnimatedText,
    onLabelTextLayout,
    hasActiveOutline,
    activeColor,
    placeholderStyle,
    baseLabelTranslateX,
    baseLabelTranslateY,
    font,
    fontSize,
    lineHeight,
    fontWeight,
    placeholderOpacity,
    wiggleOffsetX,
    labelScale,
    topPosition,
    paddingLeft,
    paddingRight,
    backgroundColor,
    roundness,
    placeholderColor,
    errorColor,
    labelTranslationXOffset,
    maxFontSizeMultiplier,
    testID,
    isV3,
    inputContainerLayout,
    scaledLabel,
  } = props;

  const { INPUT_PADDING_HORIZONTAL } = getConstants(isV3);
  const { width } = useWindowDimensions();

  const paddingOffset =
    paddingLeft && paddingRight ? { paddingLeft, paddingRight } : {};

  const labelTranslationX = {
    transform: [
      {
        // Offset label scale since RN doesn't support transform origin
        translateX: labeled.interpolate({
          inputRange: [0, 1],
          outputRange: [baseLabelTranslateX, labelTranslationXOffset || 0],
        }),
      },
    ],
  };

  const labelStyle = {
    ...font,
    fontSize,
    lineHeight,
    fontWeight,
    opacity: labeled.interpolate({
      inputRange: [0, 1],
      outputRange: [hasActiveOutline ? 1 : 0, 0],
    }),
    transform: [
      {
        // Wiggle the label when there's an error
        translateX: wiggle
          ? error.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, wiggleOffsetX, 0],
            })
          : 0,
      },
      {
        // Move label to top
        translateY:
          baseLabelTranslateY !== 0
            ? labeled.interpolate({
                inputRange: [0, 1],
                outputRange: [baseLabelTranslateY, 0],
              })
            : 0,
      },
      {
        // Make label smaller
        scale:
          labelScale !== 0
            ? labeled.interpolate({
                inputRange: [0, 1],
                outputRange: [labelScale, 1],
              })
            : labeled,
      },
    ],
  };

  const labelWidth =
    (inputContainerLayout.width + INPUT_PADDING_HORIZONTAL / 2) /
    (scaledLabel ? labelScale : 1);

  const commonStyles = [
    placeholderStyle,
    {
      top: topPosition,
    },
    {
      maxWidth: labelWidth,
    },
    labelStyle,
    paddingOffset || {},
  ];

  const textColor = (
    labelError && errorColor ? errorColor : placeholderColor
  ) as ColorValue;

  return (
    // Position colored placeholder and gray placeholder on top of each other and crossfade them
    // This gives the effect of animating the color, but allows us to use native driver
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, styles.overflow, styles.labelContainer]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          Platform.OS !== 'web' && { width },
          { opacity },
          labelTranslationX,
        ]}
      >
        <View
          style={{
            width: labelWidth,
          }}
        >
          {labelBackground?.({
            labeled,
            labelLayoutWidth,
            labelLayoutHeight,
            labelStyle,
            placeholderStyle,
            baseLabelTranslateX,
            topPosition,
            label,
            backgroundColor,
            roundness,
            maxFontSizeMultiplier: maxFontSizeMultiplier,
            testID,
          })}
          <AnimatedText
            variant="bodySmall"
            onLayout={onLayoutAnimatedText}
            onTextLayout={onLabelTextLayout}
            style={[
              commonStyles,
              {
                color: activeColor,
              },
            ]}
            numberOfLines={1}
            maxFontSizeMultiplier={maxFontSizeMultiplier}
            testID={`${testID}-label-active`}
          >
            {label}
          </AnimatedText>
          <AnimatedText
            variant={focused ? 'bodyLarge' : 'bodySmall'}
            style={[
              commonStyles,
              {
                color: textColor,
                opacity: placeholderOpacity,
              },
            ]}
            numberOfLines={1}
            maxFontSizeMultiplier={maxFontSizeMultiplier}
            testID={`${testID}-label-inactive`}
          >
            {label}
          </AnimatedText>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overflow: {
    overflow: 'hidden',
  },
  labelContainer: {
    zIndex: 3,
  },
});

export default React.memo(InputLabel);
