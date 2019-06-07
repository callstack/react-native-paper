
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
import InputLabel from './InputLabel';
import { RenderProps, ChildTextInputProps } from './types';

import {
  MAXIMIZED_LABEL_FONT_SIZE,
  MINIMIZED_LABEL_FONT_SIZE,
  LABEL_WIGGLE_X_OFFSET,
  LABEL_PADDING_HORIZONTAL,
} from './constants';

import {
  calculateLabelTopPosition,
  calculateInputHeight,
  calculatePadding,
  adjustPaddingFlat,
} from './helpers';

const MINIMIZED_LABEL_Y_OFFSET = -18;

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

    const topPosition = calculateLabelTopPosition(
      labelHeight,
      inputHeight,
      multiline && height ? 0 : !height ? minInputHeight / 2 : 0
    );

    if (height && typeof height !== 'number')
      // eslint-disable-next-line
      console.warn('Currently we support only numbers in height prop');

    const paddingSettings = {
      height: +height || undefined,
      labelHalfHeight,
      offset: INPUT_OFFSET,
      multiline,
      dense,
      topPosition,
      fontSize,
      label,
      scale: fontScale,
      isAndroid: Platform.OS === 'android',
      styles: dense ? styles.inputFlatDense : styles.inputFlat,
    };

    const pad = calculatePadding(paddingSettings);

    const paddingFlat = adjustPaddingFlat({
      ...paddingSettings,
      pad,
    });

    const baseLabelTranslateY =
      -labelHalfHeight - (topPosition + MINIMIZED_LABEL_Y_OFFSET);

    const placeholderOpacity = hasActiveOutline
      ? parentState.labeled
      : parentState.labelLayout.measured
        ? 1
        : 0;

    const labelProps = {
      label,
      onLayoutAnimatedText,
      placeholderOpacity,
      error,
      placeholderStyle: styles.placeholder,
      baseLabelTranslateY,
      baseLabelTranslateX,
      font,
      fontSize,
      labelScale,
      wiggleOffsetX: LABEL_WIGGLE_X_OFFSET,
      topPosition,
      paddingOffset,
      hasActiveOutline,
      activeColor,
      placeholderColor,
    };

    const minHeight =
      height ||
      (dense ? (label ? MIN_DENSE_HEIGHT_WL : MIN_DENSE_HEIGHT) : MIN_HEIGHT);

    const flatHeight =
      inputHeight +
      (!height ? (dense ? LABEL_PADDING_TOP_DENSE : LABEL_PADDING_TOP) : 0);

    return (
      <View style={[containerStyle, viewStyle]}>
        <Underline
          parentState={parentState}
          underlineColorCustom={underlineColorCustom}
          error={error}
          colors={colors}
          activeColor={activeColor}
        />
        <View
          style={{
            paddingTop: 0,
            paddingBottom: 0,
            minHeight,
          }}
        >
          <InputLabel parentState={parentState} labelProps={labelProps} />

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

const Underline = ({
  parentState,
  error,
  colors,
  activeColor,
  underlineColorCustom,
}) => {
  let backgroundColor = parentState.focused
    ? activeColor
    : underlineColorCustom;
  if (error) backgroundColor = colors.error;
  return (
    <Animated.View
      style={[
        styles.underline,
        {
          backgroundColor,
          // Underlines is thinner when input is not focused
          transform: [{ scaleY: parentState.focused ? 1 : 0.5 }],
        },
      ]}
    />
  );
};

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
