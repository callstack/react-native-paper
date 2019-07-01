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
import type { RenderProps, ChildTextInputProps } from './types';

const AnimatedText = Animated.createAnimatedComponent(Text);

const MINIMIZED_LABEL_Y_OFFSET = -12;
const MAXIMIZED_LABEL_FONT_SIZE = 16;
const MINIMIZED_LABEL_FONT_SIZE = 12;
const LABEL_WIGGLE_X_OFFSET = 4;
const LABEL_PADDING_HORIZONTAL = 12;
const RANDOM_VALUE_TO_CENTER_LABEL = 4; // Don't know why 4, but it works

class TextInputFlat extends React.Component<ChildTextInputProps, {}> {
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
      transparent,
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

    let inputTextColor, activeColor, underlineColorCustom, placeholderColor;

    if (disabled) {
      inputTextColor = activeColor = color(colors.text)
        .alpha(0.54)
        .rgb()
        .string();
      placeholderColor = colors.disabled;
      underlineColorCustom = 'transparent';
    } else {
      inputTextColor = colors.text;
      activeColor = error ? colors.error : colors.primary;
      placeholderColor = colors.placeholder;
      underlineColorCustom = underlineColor || colors.disabled;
    }

    let containerStyle = {};
    let labelHorizontalPadding = 0;
    if (transparent) {
      containerStyle = {
        backgroundColor: 'transparent',
      };
      labelHorizontalPadding = RANDOM_VALUE_TO_CENTER_LABEL;
    } else {
      containerStyle = {
        backgroundColor: theme.dark
          ? color(colors.background)
              .lighten(0.24)
              .rgb()
              .string()
          : color(colors.background)
              .darken(0.06)
              .rgb()
              .string(),
        borderTopLeftRadius: theme.roundness,
        borderTopRightRadius: theme.roundness,
      };
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
            outputRange: [MINIMIZED_LABEL_Y_OFFSET, 0],
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
                  RANDOM_VALUE_TO_CENTER_LABEL -
                  labelHorizontalPadding
                : baseLabelTranslateX -
                  labelHalfWidth / LABEL_PADDING_HORIZONTAL +
                  RANDOM_VALUE_TO_CENTER_LABEL -
                  labelHorizontalPadding,
              0,
            ],
          }),
        },
      ],
    };

    return (
      <View style={[containerStyle, style]}>
        <Animated.View
          style={[
            styles.underline,
            {
              backgroundColor: error
                ? colors.error
                : parentState.focused
                  ? activeColor
                  : underlineColorCustom,
              // Underlines is thinner when input is not focused
              transform: [{ scaleY: parentState.focused ? 1 : 0.5 }],
            },
          ]}
        />

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
                {
                  paddingHorizontal: transparent ? 0 : LABEL_PADDING_HORIZONTAL,
                },
                styles.placeholderFlat,
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
                  paddingHorizontal: transparent ? 0 : LABEL_PADDING_HORIZONTAL,
                },
                styles.placeholderFlat,
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
              this.props.label
                ? styles.inputFlatWithLabel
                : styles.inputFlatWithoutLabel,
              {
                paddingHorizontal: transparent
                  ? 0
                  : styles.input.paddingHorizontal,
              },
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

export default TextInputFlat;

const styles = StyleSheet.create({
  placeholder: {
    position: 'absolute',
    left: 0,
    fontSize: 16,
    paddingHorizontal: LABEL_PADDING_HORIZONTAL,
  },
  placeholderFlat: {
    top: 19,
  },
  underline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
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
  inputFlatWithLabel: {
    paddingTop: 24,
    paddingBottom: 6,
  },
  inputFlatWithoutLabel: {
    paddingVertical: 15,
  },
});
