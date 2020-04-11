import * as React from 'react';
import {
  I18nManager,
  Platform,
  StyleSheet,
  TextInput as NativeTextInput,
  TextStyle,
  View,
} from 'react-native';
import {
  LABEL_PADDING_HORIZONTAL,
  LABEL_WIGGLE_X_OFFSET,
  MAXIMIZED_LABEL_FONT_SIZE,
  MINIMIZED_LABEL_FONT_SIZE,
} from './constants';
import {
  adjustPaddingFlat,
  calculateInputHeight,
  calculateLabelTopPosition,
  calculatePadding,
  interpolatePlaceholder,
  Padding,
} from './helpers';
import InputLabel from './Label/InputLabel';
import { ChildTextInputProps, RenderProps } from './types';

const MINIMIZED_LABEL_Y_OFFSET = -15;

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
      forewordTheme,
      disabled,
      editable,
      label,
      error,
      selectionColor,
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

    const {
      fontSize: fontSizeStyle,
      fontWeight,
      height,
      paddingHorizontal,
      ...viewStyle
    } = (StyleSheet.flatten(style) || {}) as TextStyle;
    const fontSize = fontSizeStyle || MAXIMIZED_LABEL_FONT_SIZE;
    const paddingOffset = (paddingHorizontal !== undefined &&
    typeof paddingHorizontal === 'number'
      ? { paddingHorizontal }
      : StyleSheet.flatten(styles.paddingOffset)) as {
      paddingHorizontal: number;
    };

    let inputTextColor,
      activeColor,
      labelColor,
      placeholderColor,
      errorColor,
      containerStyle;

    if (disabled) {
      inputTextColor = activeColor = '#999';
      placeholderColor = colors.disabled;
      labelColor = '#bbb';

      containerStyle = {
        backgroundColor: '#e5e5e5',
        borderRadius: 10,
      };
    } else {
      inputTextColor = colors.text;
      activeColor = error ? colors.error : colors.primary;
      placeholderColor = colors.placeholder;
      errorColor = colors.error;
      labelColor = '#777';

      containerStyle = {
        backgroundColor: forewordTheme === 'light' ? '#fff' : '#f3f3f3',
        borderRadius: 10,
      };
    }

    const labelScale = MINIMIZED_LABEL_FONT_SIZE / fontSize;
    const fontScale = MAXIMIZED_LABEL_FONT_SIZE / fontSize;

    const labelWidth = parentState.labelLayout.width;
    const labelHeight = parentState.labelLayout.height;
    const labelHalfWidth = labelWidth / 2;
    const labelHalfHeight = labelHeight / 2;

    const baseLabelTranslateX =
      (I18nManager.isRTL ? 1 : -1) *
        (labelHalfWidth - (labelScale * labelWidth) / 2) +
      (1 - labelScale) * paddingOffset.paddingHorizontal;

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
      height: height ? +height : null,
      labelHalfHeight,
      offset: INPUT_OFFSET,
      multiline: multiline ? multiline : null,
      dense: dense ? dense : null,
      topPosition,
      fontSize,
      label,
      scale: fontScale,
      isAndroid: Platform.OS === 'android',
      styles: StyleSheet.flatten(
        dense ? styles.inputFlatDense : styles.inputFlat
      ) as Padding,
    };

    const pad = calculatePadding(paddingSettings);

    const paddingFlat = adjustPaddingFlat({
      ...paddingSettings,
      pad,
    });

    const baseLabelTranslateY =
      -labelHalfHeight - (topPosition + MINIMIZED_LABEL_Y_OFFSET);

    const placeholderOpacity = hasActiveOutline
      ? interpolatePlaceholder(parentState.labeled, hasActiveOutline)
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
      fontWeight,
      labelScale,
      wiggleOffsetX: LABEL_WIGGLE_X_OFFSET,
      topPosition,
      paddingOffset,
      hasActiveOutline,
      activeColor,
      placeholderColor: labelColor,
      errorColor,
    };

    const minHeight =
      height ||
      (dense ? (label ? MIN_DENSE_HEIGHT_WL : MIN_DENSE_HEIGHT) : MIN_HEIGHT);

    const flatHeight =
      inputHeight +
      (!height ? (dense ? LABEL_PADDING_TOP_DENSE : LABEL_PADDING_TOP) : 0);

    return (
      <View style={[containerStyle, viewStyle]}>
        <View
          style={{
            paddingTop: 0,
            paddingBottom: 0,
            minHeight,
          }}
        >
          <InputLabel parentState={parentState} labelProps={labelProps} />

          {render?.({
            ...rest,
            ref: innerRef,
            onChangeText,
            // @ts-ignore
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
              !multiline || (multiline && height) ? { height: flatHeight } : {},
              paddingFlat,
              {
                ...font,
                fontSize,
                fontWeight,
                color: inputTextColor,
                textAlignVertical: multiline ? 'top' : 'center',
              },
            ],
          })}
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
  input: {
    flexGrow: 1,
    margin: 0,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    zIndex: 1,
  },
  inputFlat: {
    paddingTop: 24,
    paddingBottom: 4,
  },
  inputFlatDense: {
    paddingTop: 19,
    paddingBottom: 2,
  },
  paddingOffset: {
    paddingHorizontal: LABEL_PADDING_HORIZONTAL,
  },
});
