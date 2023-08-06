import * as React from 'react';
import {
  I18nManager,
  Platform,
  StyleSheet,
  TextInput as NativeTextInput,
  TextStyle,
  View,
} from 'react-native';

import { Underline } from './Addons/Underline';
import { AdornmentSide, AdornmentType, InputMode } from './Adornment/enums';
import TextInputAdornment, {
  TextInputAdornmentProps,
} from './Adornment/TextInputAdornment';
import {
  getAdornmentConfig,
  getAdornmentStyleAdjustmentForNativeInput,
} from './Adornment/TextInputAdornment';
import {
  ADORNMENT_SIZE,
  LABEL_PADDING_TOP_DENSE,
  LABEL_WIGGLE_X_OFFSET,
  MAXIMIZED_LABEL_FONT_SIZE,
  MINIMIZED_LABEL_FONT_SIZE,
  MINIMIZED_LABEL_Y_OFFSET,
  MIN_DENSE_HEIGHT,
  MIN_DENSE_HEIGHT_WL,
} from './constants';
import {
  adjustPaddingFlat,
  calculateFlatAffixTopPosition,
  calculateFlatInputHorizontalPadding,
  calculateInputHeight,
  calculateLabelTopPosition,
  calculatePadding,
  getConstants,
  getFlatInputColors,
  Padding,
} from './helpers';
import InputLabel from './Label/InputLabel';
import type { ChildTextInputProps, RenderProps } from './types';

const TextInputFlat = ({
  disabled = false,
  editable = true,
  label,
  error = false,
  selectionColor: customSelectionColor,
  cursorColor,
  underlineColor,
  underlineStyle,
  activeUnderlineColor,
  textColor,
  dense,
  style,
  theme,
  render = (props: RenderProps) => <NativeTextInput {...props} />,
  multiline = false,
  parentState,
  innerRef,
  onFocus,
  forceFocus,
  onBlur,
  onChangeText,
  onLayoutAnimatedText,
  onLeftAffixLayoutChange,
  onRightAffixLayoutChange,
  left,
  right,
  placeholderTextColor,
  testID = 'text-input-flat',
  contentStyle,
  ...rest
}: ChildTextInputProps) => {
  const isAndroid = Platform.OS === 'android';
  const { colors, isV3, roundness } = theme;
  const font = isV3 ? theme.fonts.bodyLarge : theme.fonts.regular;
  const hasActiveOutline = parentState.focused || error;

  const { LABEL_PADDING_TOP, FLAT_INPUT_OFFSET, MIN_HEIGHT } =
    getConstants(isV3);

  const {
    fontSize: fontSizeStyle,
    lineHeight,
    fontWeight,
    height,
    paddingHorizontal,
    textAlign,
    ...viewStyle
  } = (StyleSheet.flatten(style) || {}) as TextStyle;
  const fontSize = fontSizeStyle || MAXIMIZED_LABEL_FONT_SIZE;

  const isPaddingHorizontalPassed =
    paddingHorizontal !== undefined && typeof paddingHorizontal === 'number';

  const adornmentConfig = getAdornmentConfig({
    left,
    right,
  });

  let { paddingLeft, paddingRight } = calculateFlatInputHorizontalPadding({
    adornmentConfig,
    isV3,
  });

  if (isPaddingHorizontalPassed) {
    paddingLeft = paddingHorizontal as number;
    paddingRight = paddingHorizontal as number;
  }

  const { leftLayout, rightLayout } = parentState;

  const rightAffixWidth = right
    ? rightLayout.width || ADORNMENT_SIZE
    : ADORNMENT_SIZE;

  const leftAffixWidth = left
    ? leftLayout.width || ADORNMENT_SIZE
    : ADORNMENT_SIZE;

  const adornmentStyleAdjustmentForNativeInput =
    getAdornmentStyleAdjustmentForNativeInput({
      adornmentConfig,
      rightAffixWidth,
      leftAffixWidth,
      paddingHorizontal,
      inputOffset: FLAT_INPUT_OFFSET,
      mode: InputMode.Flat,
      isV3,
    });

  const {
    inputTextColor,
    activeColor,
    underlineColorCustom,
    placeholderColor,
    errorColor,
    backgroundColor,
    selectionColor,
  } = getFlatInputColors({
    underlineColor,
    activeUnderlineColor,
    customSelectionColor,
    textColor,
    disabled,
    error,
    theme,
  });

  const containerStyle = {
    backgroundColor,
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
    (I18nManager.getConstants().isRTL ? 1 : -1) *
      (labelHalfWidth - (labelScale * labelWidth) / 2) +
    (1 - labelScale) *
      (I18nManager.getConstants().isRTL ? -1 : 1) *
      paddingLeft;

  const minInputHeight = dense
    ? (label ? MIN_DENSE_HEIGHT_WL : MIN_DENSE_HEIGHT) - LABEL_PADDING_TOP_DENSE
    : MIN_HEIGHT - LABEL_PADDING_TOP;

  const inputHeight = calculateInputHeight(labelHeight, height, minInputHeight);

  const topPosition = calculateLabelTopPosition(
    labelHeight,
    inputHeight,
    multiline && height ? 0 : !height ? minInputHeight / 2 : 0
  );

  if (height && typeof height !== 'number') {
    // eslint-disable-next-line
    console.warn('Currently we support only numbers in height prop');
  }

  const paddingSettings = {
    height: height ? +height : null,
    labelHalfHeight,
    offset: FLAT_INPUT_OFFSET,
    multiline: multiline ? multiline : null,
    dense: dense ? dense : null,
    topPosition,
    fontSize,
    lineHeight,
    label,
    scale: fontScale,
    isAndroid,
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
    ? parentState.labeled
    : parentState.labelLayout.measured
    ? 1
    : 0;

  const minHeight =
    height ||
    (dense ? (label ? MIN_DENSE_HEIGHT_WL : MIN_DENSE_HEIGHT) : MIN_HEIGHT);

  const flatHeight =
    inputHeight +
    (!height ? (dense ? LABEL_PADDING_TOP_DENSE : LABEL_PADDING_TOP) : 0);

  const iconTopPosition = (flatHeight - ADORNMENT_SIZE) / 2;

  const leftAffixTopPosition = leftLayout.height
    ? calculateFlatAffixTopPosition({
        height: flatHeight,
        ...paddingFlat,
        affixHeight: leftLayout.height,
      })
    : null;

  const rightAffixTopPosition = rightLayout.height
    ? calculateFlatAffixTopPosition({
        height: flatHeight,
        ...paddingFlat,
        affixHeight: rightLayout.height,
      })
    : null;

  const labelProps = {
    label,
    onLayoutAnimatedText,
    placeholderOpacity,
    labelError: error,
    placeholderStyle: styles.placeholder,
    baseLabelTranslateY,
    baseLabelTranslateX,
    font,
    fontSize,
    lineHeight,
    fontWeight,
    labelScale,
    wiggleOffsetX: LABEL_WIGGLE_X_OFFSET,
    topPosition,
    paddingLeft: isAndroid
      ? I18nManager.isRTL
        ? paddingRight
        : paddingLeft
      : paddingLeft,
    paddingRight: isAndroid
      ? I18nManager.isRTL
        ? paddingLeft
        : paddingRight
      : paddingRight,
    hasActiveOutline,
    activeColor,
    placeholderColor,
    errorColor,
    roundness,
    maxFontSizeMultiplier: rest.maxFontSizeMultiplier,
    testID,
    contentStyle,
    opacity:
      parentState.value || parentState.focused
        ? parentState.labelLayout.measured
          ? 1
          : 0
        : 1,
  };

  const affixTopPosition = {
    [AdornmentSide.Left]: leftAffixTopPosition,
    [AdornmentSide.Right]: rightAffixTopPosition,
  };
  const onAffixChange = {
    [AdornmentSide.Left]: onLeftAffixLayoutChange,
    [AdornmentSide.Right]: onRightAffixLayoutChange,
  };

  let adornmentProps: TextInputAdornmentProps = {
    paddingHorizontal,
    adornmentConfig,
    forceFocus,
    topPosition: {
      [AdornmentType.Affix]: affixTopPosition,
      [AdornmentType.Icon]: iconTopPosition,
    },
    onAffixChange,
    isTextInputFocused: parentState.focused,
    maxFontSizeMultiplier: rest.maxFontSizeMultiplier,
    disabled,
  };
  if (adornmentConfig.length) {
    adornmentProps = {
      ...adornmentProps,
      left,
      right,
      textStyle: { ...font, fontSize, lineHeight, fontWeight },
      visible: parentState.labeled,
    };
  }

  return (
    <View style={[containerStyle, viewStyle]}>
      <Underline
        style={underlineStyle}
        hasActiveOutline={hasActiveOutline}
        parentState={parentState}
        underlineColorCustom={underlineColorCustom}
        error={error}
        colors={colors}
        activeColor={activeColor}
        theme={theme}
      />
      <View
        style={[
          styles.labelContainer,
          {
            minHeight,
          },
        ]}
      >
        {!isAndroid && multiline && !!label && !disabled && (
          // Workaround for: https://github.com/callstack/react-native-paper/issues/2799
          // Patch for a multiline TextInput with fixed height, which allow to avoid covering input label with its value.
          <View
            testID="patch-container"
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              dense ? styles.densePatchContainer : styles.patchContainer,
              {
                backgroundColor:
                  viewStyle.backgroundColor || containerStyle.backgroundColor,
                left: paddingLeft,
                right: paddingRight,
              },
            ]}
          />
        )}
        {label ? (
          <InputLabel
            labeled={parentState.labeled}
            error={parentState.error}
            focused={parentState.focused}
            wiggle={Boolean(parentState.value && labelProps.labelError)}
            labelLayoutMeasured={parentState.labelLayout.measured}
            labelLayoutWidth={parentState.labelLayout.width}
            {...labelProps}
          />
        ) : null}
        {render?.({
          ...rest,
          ref: innerRef,
          onChangeText,
          placeholder: label ? parentState.placeholder : rest.placeholder,
          editable: !disabled && editable,
          selectionColor,
          cursorColor:
            typeof cursorColor === 'undefined' ? activeColor : cursorColor,
          placeholderTextColor: placeholderTextColor ?? placeholderColor,
          onFocus,
          onBlur,
          underlineColorAndroid: 'transparent',
          multiline,
          style: [
            styles.input,
            !multiline || (multiline && height) ? { height: flatHeight } : {},
            paddingFlat,
            {
              paddingLeft,
              paddingRight,
              ...font,
              fontSize,
              lineHeight,
              fontWeight,
              color: inputTextColor,
              textAlignVertical: multiline ? 'top' : 'center',
              textAlign: textAlign
                ? textAlign
                : I18nManager.getConstants().isRTL
                ? 'right'
                : 'left',
            },
            Platform.OS === 'web' && { outline: 'none' },
            adornmentStyleAdjustmentForNativeInput,
            contentStyle,
          ],
          testID,
        })}
      </View>
      <TextInputAdornment {...adornmentProps} />
    </View>
  );
};

export default TextInputFlat;

const styles = StyleSheet.create({
  placeholder: {
    position: 'absolute',
    left: 0,
  },
  labelContainer: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  input: {
    margin: 0,
  },
  inputFlat: {
    paddingTop: 24,
    paddingBottom: 4,
  },
  inputFlatDense: {
    paddingTop: 22,
    paddingBottom: 2,
  },
  patchContainer: {
    height: 24,
    zIndex: 2,
  },
  densePatchContainer: {
    height: 22,
    zIndex: 2,
  },
});
