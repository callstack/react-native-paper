import * as React from 'react';
import {
  View,
  TextInput as NativeTextInput,
  StyleSheet,
  I18nManager,
  Platform,
  TextStyle,
  ColorValue,
} from 'react-native';

import { AdornmentType, AdornmentSide } from './Adornment/enums';
import TextInputAdornment, {
  getAdornmentConfig,
  getAdornmentStyleAdjustmentForNativeInput,
  TextInputAdornmentProps,
} from './Adornment/TextInputAdornment';
import {
  MAXIMIZED_LABEL_FONT_SIZE,
  MINIMIZED_LABEL_FONT_SIZE,
  LABEL_WIGGLE_X_OFFSET,
  ADORNMENT_SIZE,
  OUTLINE_MINIMIZED_LABEL_Y_OFFSET,
  LABEL_PADDING_TOP,
  MIN_DENSE_HEIGHT_OUTLINED,
  LABEL_PADDING_TOP_DENSE,
} from './constants';
import {
  calculateLabelTopPosition,
  calculateInputHeight,
  calculatePadding,
  adjustPaddingOut,
  Padding,
  interpolatePlaceholder,
  calculateOutlinedIconAndAffixTopPosition,
  getOutlinedInputColors,
  getConstants,
} from './helpers';
import InputLabel from './Label/InputLabel';
import LabelBackground from './Label/LabelBackground';
import type { RenderProps, ChildTextInputProps } from './types';

const TextInputOutlined = ({
  disabled = false,
  editable = true,
  label,
  error = false,
  selectionColor,
  underlineColor: _underlineColor,
  outlineColor: customOutlineColor,
  activeOutlineColor,
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
  testID = 'text-input-outlined',
  ...rest
}: ChildTextInputProps) => {
  const adornmentConfig = getAdornmentConfig({ left, right });

  const { colors, isV3, roundness } = theme;
  const font = isV3 ? theme.fonts.bodyLarge : theme.fonts.regular;
  const hasActiveOutline = parentState.focused || error;

  const { INPUT_PADDING_HORIZONTAL, MIN_HEIGHT, ADORNMENT_OFFSET } =
    getConstants(isV3);

  const {
    fontSize: fontSizeStyle,
    fontWeight,
    lineHeight,
    height,
    backgroundColor = colors?.background,
    textAlign,
    ...viewStyle
  } = (StyleSheet.flatten(style) || {}) as TextStyle;
  const fontSize = fontSizeStyle || MAXIMIZED_LABEL_FONT_SIZE;

  const {
    inputTextColor,
    activeColor,
    outlineColor,
    placeholderColor,
    errorColor,
  } = getOutlinedInputColors({
    activeOutlineColor,
    customOutlineColor,
    textColor,
    disabled,
    error,
    theme,
  });

  const labelScale = MINIMIZED_LABEL_FONT_SIZE / fontSize;
  const fontScale = MAXIMIZED_LABEL_FONT_SIZE / fontSize;

  const labelWidth = parentState.labelLayout.width;
  const labelHeight = parentState.labelLayout.height;
  const labelHalfWidth = labelWidth / 2;
  const labelHalfHeight = labelHeight / 2;

  const baseLabelTranslateX =
    (I18nManager.getConstants().isRTL ? 1 : -1) *
    (labelHalfWidth -
      (labelScale * labelWidth) / 2 -
      (fontSize - MINIMIZED_LABEL_FONT_SIZE) * labelScale);

  let labelTranslationXOffset = 0;
  const isAdornmentLeftIcon = adornmentConfig.some(
    ({ side, type }) =>
      side === AdornmentSide.Left && type === AdornmentType.Icon
  );
  if (isAdornmentLeftIcon) {
    labelTranslationXOffset =
      (I18nManager.getConstants().isRTL ? -1 : 1) *
      (ADORNMENT_SIZE + ADORNMENT_OFFSET - (isV3 ? 0 : 8));
  }

  const minInputHeight =
    (dense ? MIN_DENSE_HEIGHT_OUTLINED : MIN_HEIGHT) - LABEL_PADDING_TOP;

  const inputHeight = calculateInputHeight(labelHeight, height, minInputHeight);

  const topPosition = calculateLabelTopPosition(
    labelHeight,
    inputHeight,
    LABEL_PADDING_TOP
  );

  if (height && typeof height !== 'number') {
    // eslint-disable-next-line
    console.warn('Currently we support only numbers in height prop');
  }

  const paddingSettings = {
    height: height ? +height : null,
    labelHalfHeight,
    offset: LABEL_PADDING_TOP,
    multiline: multiline ? multiline : null,
    dense: dense ? dense : null,
    topPosition,
    fontSize,
    lineHeight,
    label,
    scale: fontScale,
    isAndroid: Platform.OS === 'android',
    styles: StyleSheet.flatten(
      dense ? styles.inputOutlinedDense : styles.inputOutlined
    ) as Padding,
  };

  const pad = calculatePadding(paddingSettings);

  const paddingOut = adjustPaddingOut({ ...paddingSettings, pad });

  const baseLabelTranslateY =
    -labelHalfHeight - (topPosition + OUTLINE_MINIMIZED_LABEL_Y_OFFSET);

  const placeholderOpacity = hasActiveOutline
    ? interpolatePlaceholder(parentState.labeled, hasActiveOutline)
    : parentState.labelLayout.measured
    ? 1
    : 0;

  const placeholderStyle = {
    position: 'absolute',
    left: 0,
    paddingHorizontal: INPUT_PADDING_HORIZONTAL,
  };

  const labelProps = {
    label,
    onLayoutAnimatedText,
    placeholderOpacity,
    error,
    placeholderStyle,
    baseLabelTranslateY,
    baseLabelTranslateX,
    font,
    fontSize,
    lineHeight,
    fontWeight,
    labelScale,
    wiggleOffsetX: LABEL_WIGGLE_X_OFFSET,
    topPosition,
    hasActiveOutline,
    activeColor,
    placeholderColor,
    backgroundColor: backgroundColor as ColorValue,
    errorColor,
    labelTranslationXOffset,
    roundness,
    maxFontSizeMultiplier: rest.maxFontSizeMultiplier,
    testID,
  };

  const minHeight = (height ||
    (dense ? MIN_DENSE_HEIGHT_OUTLINED : MIN_HEIGHT)) as number;

  const outlinedHeight =
    inputHeight +
    (!height ? (dense ? LABEL_PADDING_TOP_DENSE / 2 : LABEL_PADDING_TOP) : 0);

  const { leftLayout, rightLayout } = parentState;

  const leftAffixTopPosition = calculateOutlinedIconAndAffixTopPosition({
    height: outlinedHeight,
    affixHeight: leftLayout.height || 0,
    labelYOffset: -OUTLINE_MINIMIZED_LABEL_Y_OFFSET,
  });

  const rightAffixTopPosition = calculateOutlinedIconAndAffixTopPosition({
    height: outlinedHeight,
    affixHeight: rightLayout.height || 0,
    labelYOffset: -OUTLINE_MINIMIZED_LABEL_Y_OFFSET,
  });
  const iconTopPosition = calculateOutlinedIconAndAffixTopPosition({
    height: outlinedHeight,
    affixHeight: ADORNMENT_SIZE,
    labelYOffset: -OUTLINE_MINIMIZED_LABEL_Y_OFFSET,
  });

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
      mode: 'outlined',
      isV3,
    });
  const affixTopPosition = {
    [AdornmentSide.Left]: leftAffixTopPosition,
    [AdornmentSide.Right]: rightAffixTopPosition,
  };
  const onAffixChange = {
    [AdornmentSide.Left]: onLeftAffixLayoutChange,
    [AdornmentSide.Right]: onRightAffixLayoutChange,
  };

  let adornmentProps: TextInputAdornmentProps = {
    adornmentConfig,
    forceFocus,
    topPosition: {
      [AdornmentType.Icon]: iconTopPosition,
      [AdornmentType.Affix]: affixTopPosition,
    },
    onAffixChange,
    isTextInputFocused: parentState.focused,
    maxFontSizeMultiplier: rest.maxFontSizeMultiplier,
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
    <View style={viewStyle}>
      {/*
          Render the outline separately from the container
          This is so that the label can overlap the outline
          Otherwise the border will cut off the label on Android
          */}
      <Outline
        isV3={isV3}
        roundness={roundness}
        hasActiveOutline={hasActiveOutline}
        focused={parentState.focused}
        activeColor={activeColor}
        outlineColor={outlineColor}
        backgroundColor={backgroundColor}
      />
      <View>
        <View
          style={[
            styles.labelContainer,
            {
              paddingTop: LABEL_PADDING_TOP,
              minHeight,
            },
          ]}
        >
          <InputLabel
            parentState={parentState}
            labelProps={labelProps}
            labelBackground={LabelBackground}
            maxFontSizeMultiplier={rest.maxFontSizeMultiplier}
          />
          {render?.({
            testID,
            ...rest,
            ref: innerRef,
            onChangeText,
            placeholder: label ? parentState.placeholder : rest.placeholder,
            placeholderTextColor: placeholderTextColor || placeholderColor,
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
                paddingHorizontal: INPUT_PADDING_HORIZONTAL,
              },
              Platform.OS === 'web' && { outline: 'none' },
              adornmentStyleAdjustmentForNativeInput,
            ],
          } as RenderProps)}
        </View>
        <TextInputAdornment {...adornmentProps} />
      </View>
    </View>
  );
};

export default TextInputOutlined;

type OutlineProps = {
  isV3: boolean;
  activeColor: string;
  backgroundColor: ColorValue;
  hasActiveOutline?: boolean;
  focused?: boolean;
  outlineColor?: string;
  roundness?: number;
};

const Outline = ({
  isV3,
  activeColor,
  backgroundColor,
  hasActiveOutline,
  focused,
  outlineColor,
  roundness,
}: OutlineProps) => (
  <View
    testID="text-input-outline"
    pointerEvents="none"
    style={[
      styles.outline,
      // eslint-disable-next-line react-native/no-inline-styles
      {
        backgroundColor,
        borderRadius: roundness,
        borderWidth: (isV3 ? hasActiveOutline : focused) ? 2 : 1,
        borderColor: hasActiveOutline ? activeColor : outlineColor,
      },
    ]}
  />
);

const styles = StyleSheet.create({
  outline: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 6,
    bottom: 0,
  },
  labelContainer: {
    paddingBottom: 0,
  },
  input: {
    flexGrow: 1,
    margin: 0,
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
