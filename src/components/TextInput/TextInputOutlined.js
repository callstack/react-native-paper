/* @flow */

import * as React from 'react';
import {
  View,
  Animated,
  TextInput as NativeTextInput,
  StyleSheet,
  I18nManager,
} from 'react-native';
import color from 'color';
import Text from '../Typography/Text';
import type { ChildTextInputProps, RenderProps } from './types';

const AnimatedText = Animated.createAnimatedComponent(Text);

const OUTLINE_MINIMIZED_LABEL_Y_OFFSET = -29;
const MAXIMIZED_LABEL_FONT_SIZE = 16;
const MINIMIZED_LABEL_FONT_SIZE = 12;
const LABEL_WIGGLE_X_OFFSET = 4;
const LABEL_PADDING_HORIZONTAL = 12;
const RANDOM_VALUE_TO_CENTER_LABEL = 4; // Don't know why 4, but it works

class TextInputOutlined extends React.Component<ChildTextInputProps, {}> {
  static defaultProps = {
    disabled: false,
    error: false,
    multiline: false,
    editable: true,
    render: (props: RenderProps) => <NativeTextInput {...props} />,
  };

  render() {
    const {
      disabled,
      label,
      error,
      selectionColor,
      underlineColor,
      style,
      theme,
      render,
      multiline,
      parentState,
      innerRef,
      onFocus,
      onBlur,
      onChangeText,
      onLayoutAnimatedText,
      ...rest
    } = this.props;

    const { colors, fonts } = theme;
    const fontFamily = fonts.regular;
    const hasActiveOutline = parentState.focused || error;
    const { backgroundColor = colors.background } =
      StyleSheet.flatten(style) || {};

    let inputTextColor,
      activeColor,
      outlineColor,
      placeholderColor,
      containerStyle;

    if (disabled) {
      inputTextColor = activeColor = color(colors.text)
        .alpha(0.54)
        .rgb()
        .string();
      placeholderColor = outlineColor = colors.disabled;
    } else {
      inputTextColor = colors.text;
      activeColor = error ? colors.error : colors.primary;
      placeholderColor = outlineColor = colors.placeholder;
    }

    const labelHalfWidth = parentState.labelLayout.width / 2;
    const baseLabelTranslateX =
      (I18nManager.isRTL ? 1 : -1) *
      (1 - MINIMIZED_LABEL_FONT_SIZE / MAXIMIZED_LABEL_FONT_SIZE) *
      labelHalfWidth;

    const labelStyle = {
      fontFamily,
      fontSize: MAXIMIZED_LABEL_FONT_SIZE,
      transform: [
        {
          // Wiggle the label when there's an error
          translateX: parentState.error.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [
              0,
              parentState.value && error ? LABEL_WIGGLE_X_OFFSET : 0,
              0,
            ],
          }),
        },
        {
          // Move label to top
          translateY: parentState.labeled.interpolate({
            inputRange: [0, 1],
            outputRange: [OUTLINE_MINIMIZED_LABEL_Y_OFFSET, 0],
          }),
        },
        {
          // Make label smaller
          scale: parentState.labeled.interpolate({
            inputRange: [0, 1],
            outputRange: [
              MINIMIZED_LABEL_FONT_SIZE / MAXIMIZED_LABEL_FONT_SIZE,
              1,
            ],
          }),
        },
        {
          // Offset label scale since RN doesn't support transform origin
          translateX: parentState.labeled.interpolate({
            inputRange: [0, 1],
            outputRange: [
              baseLabelTranslateX > 0
                ? baseLabelTranslateX +
                  labelHalfWidth / LABEL_PADDING_HORIZONTAL -
                  RANDOM_VALUE_TO_CENTER_LABEL
                : baseLabelTranslateX -
                  labelHalfWidth / LABEL_PADDING_HORIZONTAL +
                  RANDOM_VALUE_TO_CENTER_LABEL,
              0,
            ],
          }),
        },
      ],
    };

    return (
      <View style={[containerStyle, style]}>
        {/* 
          Render the outline separately from the container
          This is so that the label can overlap the outline
          Otherwise the border will cut off the label on Android 
          */}
        <View
          pointerEvents="none"
          style={[
            styles.outline,
            {
              borderRadius: theme.roundness,
              borderWidth: hasActiveOutline ? 2 : 1,
              borderColor: hasActiveOutline ? activeColor : outlineColor,
            },
          ]}
        />

        {label ? (
          // The input label stays on top of the outline
          // The background of the label covers the outline so it looks cut off
          // To achieve the effect, we position the actual label with a background on top of it
          // We set the color of the text to transparent so only the background is visible
          <AnimatedText
            pointerEvents="none"
            style={[
              styles.outlinedLabelBackground,
              {
                backgroundColor,
                fontFamily,
                fontSize: MINIMIZED_LABEL_FONT_SIZE,
                // Hide the background when scale will be 0
                // There's a bug in RN which makes scale: 0 act weird
                opacity: parentState.labeled.interpolate({
                  inputRange: [0, 0.9, 1],
                  outputRange: [1, 1, 0],
                }),
                transform: [
                  {
                    // Animate the scale when label is moved up
                    scaleX: parentState.labeled.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0],
                    }),
                  },
                ],
              },
            ]}
            numberOfLines={1}
          >
            {label}
          </AnimatedText>
        ) : null}

        {label ? (
          // Position colored placeholder and gray placeholder on top of each other and crossfade them
          // This gives the effect of animating the color, but allows us to use native driver
          <View
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
            ]}
          >
            <AnimatedText
              onLayout={onLayoutAnimatedText}
              style={[
                styles.placeholder,
                styles.placeholderOutlined,
                labelStyle,
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
                styles.placeholder,
                styles.placeholderOutlined,
                labelStyle,
                {
                  color: placeholderColor,
                  opacity: hasActiveOutline ? parentState.labeled : 1,
                },
              ]}
              numberOfLines={1}
            >
              {label}
            </AnimatedText>
          </View>
        ) : null}

        {render(
          ({
            ...rest,
            ref: innerRef,
            onChangeText,
            placeholder: label
              ? parentState.placeholder
              : this.props.placeholder,
            placeholderTextColor: placeholderColor,
            editable: !disabled,
            selectionColor:
              typeof selectionColor === 'undefined'
                ? activeColor
                : selectionColor,
            onFocus,
            onBlur,
            underlineColorAndroid: 'transparent',
            multiline,
            style: [
              styles.input,
              styles.inputOutlined,
              {
                color: inputTextColor,
                fontFamily,
                textAlignVertical: multiline ? 'top' : 'center',
              },
            ],
          }: RenderProps)
        )}
      </View>
    );
  }
}

export default TextInputOutlined;

const styles = StyleSheet.create({
  placeholder: {
    position: 'absolute',
    left: 0,
    fontSize: 16,
    paddingHorizontal: LABEL_PADDING_HORIZONTAL,
  },
  placeholderOutlined: {
    top: 25,
  },
  outline: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 6,
    bottom: 0,
  },
  outlinedLabelBackground: {
    position: 'absolute',
    top: 0,
    left: 8,
    paddingHorizontal: 4,
    color: 'transparent',
  },
  input: {
    flexGrow: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    margin: 0,
    minHeight: 58,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    zIndex: 1,
  },
  inputOutlined: {
    paddingTop: 20,
    paddingBottom: 16,
    minHeight: 64,
  },
});
