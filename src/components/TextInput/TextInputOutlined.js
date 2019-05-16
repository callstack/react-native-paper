/* @flow */

import * as React from 'react';
import {
  View,
  Animated,
  TextInput as NativeTextInput,
  StyleSheet,
  I18nManager,
  Platform,
} from 'react-native';
import color from 'color';
import Text from '../Typography/Text';
import type { ChildTextInputProps, RenderProps } from './types';
import {
  calculateLabelTopPosition,
  calculateInputHeight,
  calculatePadding,
  adjustPaddingOut,
} from './helpers';

const AnimatedText = Animated.createAnimatedComponent(Text);

const OUTLINE_MINIMIZED_LABEL_Y_OFFSET = -6;
const MAXIMIZED_LABEL_FONT_SIZE = 16;
const MINIMIZED_LABEL_FONT_SIZE = 12;
const LABEL_WIGGLE_X_OFFSET = 4;
const LABEL_PADDING_HORIZONTAL = 12;

const LABEL_PADDING_TOP = 8;
const MIN_HEIGHT = 64;
const MIN_DENSE_HEIGHT = 48;

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
      editable,
      label,
      error,
      selectionColor,
      underlineColor,
      dense,
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
    const font = fonts.regular;
    const hasActiveOutline = parentState.focused || error;
    const { backgroundColor = colors.background } =
      StyleSheet.flatten(style) || {};

    const { fontSize: fontSizeStyle, height, ...viewStyle } =
      StyleSheet.flatten(style) || {};
    const fontSize = fontSizeStyle || MAXIMIZED_LABEL_FONT_SIZE;

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

    const labelWidth = parentState.labelLayout.width;
    const labelHeight = parentState.labelLayout.height;
    const labelHalfWidth = labelWidth / 2;
    const labelHalfHeight = labelHeight / 2;

    const labelScale = MINIMIZED_LABEL_FONT_SIZE / fontSize;
    const fontScale = MAXIMIZED_LABEL_FONT_SIZE / fontSize;

    const baseLabelTranslateX =
      (I18nManager.isRTL ? 1 : -1) *
      (labelHalfWidth -
        (labelScale * labelWidth) / 2 -
        (fontSize - MINIMIZED_LABEL_FONT_SIZE) * labelScale);

    const minInputHeight =
      (dense ? MIN_DENSE_HEIGHT : MIN_HEIGHT) - LABEL_PADDING_TOP;

    const inputHeight = calculateInputHeight(
      labelHeight,
      height,
      minInputHeight
    );

    const topPosition =
      multiline && height
        ? calculateLabelTopPosition(labelHeight, inputHeight, LABEL_PADDING_TOP) // 18
        : calculateLabelTopPosition(
            labelHeight,
            inputHeight,
            LABEL_PADDING_TOP
          );

    if (height && typeof height !== 'number')
      // eslint-disable-next-line
      console.warn('Currently we support only numbers in height prop');

    const paddingSettings = {
      height: +height || undefined,
      labelHalfHeight,
      offset: LABEL_PADDING_TOP,
      multiline,
      dense,
      topPosition,
      fontSize,
      label,
      scale: fontScale,
      isAndroid: Platform.OS === 'android',
      styles: dense ? styles.inputOutlinedDense : styles.inputOutlined,
    };

    const pad = calculatePadding(paddingSettings);

    const paddingOut = adjustPaddingOut({ ...paddingSettings, pad });

    const baseLabelTranslateY =
      -labelHalfHeight - (topPosition + OUTLINE_MINIMIZED_LABEL_Y_OFFSET);

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

    return (
      <View style={[containerStyle, viewStyle]}>
        {/* 
          Render the outline separately from the container
          This is so that the label can overlap the outline
          Otherwise the border will cut off the label on Android 
          */}
        <View>
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
          <View
            style={{
              paddingTop: LABEL_PADDING_TOP,
              paddingBottom: 0,
              minHeight: height || (dense ? MIN_DENSE_HEIGHT : MIN_HEIGHT),
            }}
          >
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
                    ...font,
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
                    styles.placeholder,
                    {
                      top: topPosition,
                    },
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
                    {
                      top: topPosition,
                    },
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
              </Animated.View>
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
                editable: !disabled && editable,
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
                  !multiline || (multiline && height)
                    ? { height: inputHeight }
                    : {},
                  paddingOut,
                  {
                    fontSize,
                    color: inputTextColor,
                    ...font,
                    textAlignVertical: multiline && height ? 'top' : 'center',
                  },
                ],
              }: RenderProps)
            )}
          </View>
        </View>
      </View>
    );
  }
}

export default TextInputOutlined;

const styles = StyleSheet.create({
  placeholder: {
    position: 'absolute',
    left: 0,
    paddingHorizontal: LABEL_PADDING_HORIZONTAL,
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
    margin: 0,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    zIndex: 1,
  },
  inputOutlined: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  inputOutlinedDense: {
    paddingTop: 4,
    paddingBottom: 4,
  },
});
