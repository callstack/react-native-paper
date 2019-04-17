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
import type { RenderProps, ChildTextInputProps } from './types';
import {
  calculateLabelTopPosition,
  calculateInputHeight,
  calculatePadding,
  adjustPaddingFlat,
} from './helpers';

const AnimatedText = Animated.createAnimatedComponent(Text);

const MINIMIZED_LABEL_Y_OFFSET = -18;
const MAXIMIZED_LABEL_FONT_SIZE = 16;
const MINIMIZED_LABEL_FONT_SIZE = 12;
const LABEL_WIGGLE_X_OFFSET = 4;
const LABEL_PADDING_HORIZONTAL = 12;

const LABEL_PADDING_TOP = 30;
const LABEL_PADDING_TOP_DENSE = 24;
const MIN_HEIGHT = 64;
const MIN_DENSE_HEIGHT_WL = 52;
const MIN_DENSE_HEIGHT = 40;

const INPUT_OFFSET = 8;

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
      editable,
      label,
      error,
      selectionColor,
      underlineColor,
      padding,
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
    const paddingOffset = padding !== 'none' ? styles.paddingOffset : null;

    const { fontSize: fontSizeStyle, height, ...viewStyle } =
      StyleSheet.flatten(style) || {};
    const fontSize = fontSizeStyle || MAXIMIZED_LABEL_FONT_SIZE;

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

    const containerStyle = {
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

    const labelScale = MINIMIZED_LABEL_FONT_SIZE / fontSize;
    const fontScale = MAXIMIZED_LABEL_FONT_SIZE / fontSize;

    const labelWidth = parentState.labelLayout.width;
    const labelHeight = parentState.labelLayout.height;
    const labelHalfWidth = labelWidth / 2;
    const labelHalfHeight = labelHeight / 2;

    const baseLabelTranslateX =
      (I18nManager.isRTL ? 1 : -1) *
      (labelHalfWidth -
        (labelScale * labelWidth) / 2 -
        (fontSize - MINIMIZED_LABEL_FONT_SIZE) * labelScale +
        (!paddingOffset ? (1 - labelScale) * LABEL_PADDING_HORIZONTAL : 0));

    const minInputHeight = dense
      ? (label ? MIN_DENSE_HEIGHT_WL : MIN_DENSE_HEIGHT) -
        LABEL_PADDING_TOP_DENSE
      : MIN_HEIGHT - LABEL_PADDING_TOP;

    const inputHeight = calculateInputHeight(
      labelHeight,
      height,
      minInputHeight
    );

    const topPosition = multiline
      ? calculateLabelTopPosition(
          labelHeight,
          inputHeight,
          height ? 0 : minInputHeight / 2
        )
      : calculateLabelTopPosition(
          labelHeight,
          inputHeight,
          !height ? minInputHeight / 2 : 0
        );

    const flatHeight =
      inputHeight +
      (!height ? (dense ? LABEL_PADDING_TOP_DENSE : LABEL_PADDING_TOP) : 0);

    const isAndroid = Platform.OS === 'android';

    if (height && typeof height !== 'number')
      // eslint-disable-next-line
      console.warn('Currently we support only numbers in height prop');

    const paddingSettings = {
      height: +height || undefined,
      labelHalfHeight,
      multiline,
      dense,
      offset: INPUT_OFFSET,
      topPosition,
      fontSize,
      label,
      scale: fontScale,
      isAndroid,
      styles: dense ? styles.inputFlatDense : styles.inputFlat,
    };

    const pad = calculatePadding(paddingSettings);

    const paddingFlat = adjustPaddingFlat({
      ...paddingSettings,
      pad,
    });

    const baseLabelTranslateY =
      -labelHalfHeight - (topPosition + MINIMIZED_LABEL_Y_OFFSET);

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

        <View
          style={{
            paddingTop: 0,
            paddingBottom: 0,
            minHeight:
              height ||
              (dense
                ? label
                  ? MIN_DENSE_HEIGHT_WL
                  : MIN_DENSE_HEIGHT
                : MIN_HEIGHT),
          }}
        >
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
                  paddingOffset,
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
                  paddingOffset,
                  {
                    color: placeholderColor,
                    opacity: hasActiveOutline
                      ? parentState.labeled
                      : parentState.labelLayout.measured
                        ? 1
                        : 0,
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
              adjustsFontSizeToFit: true,
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
                paddingOffset,
                !multiline || (multiline && height)
                  ? { height: flatHeight }
                  : {},
                paddingFlat,
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
    );
  }
}

export default TextInputFlat;

const styles = StyleSheet.create({
  placeholder: {
    position: 'absolute',
    left: 0,
  },
  underline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
  },
  input: {
    flex: 1,
    margin: 0,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    zIndex: 1,
  },
  inputFlat: {
    paddingTop: 24,
    paddingBottom: 4,
  },
  inputFlatDense: {
    paddingTop: 22,
    paddingBottom: 2,
  },
  paddingOffset: {
    paddingHorizontal: LABEL_PADDING_HORIZONTAL,
  },
});
