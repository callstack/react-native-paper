import {
  Animated,
  I18nManager,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import {
  INPUT_FONT_SIZE,
  isWeb,
  TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL,
} from '../constants';
import {
  $disabledStyle,
  $supportingTextStyle,
  $inputStyle,
  $leadingAccessoryStyle,
  $trailingAccessoryStyle,
} from '../styles';
import type { TextFieldProps, TextFieldSharedApi } from '../TextField';
import { getSupportingTextColor, getLabelColor } from '../utils';
import {
  LABEL_START_OFFSET_WITH_ACCESSORY,
  LABEL_START_OFFSET_WITHOUT_ACCESSORY,
  DISABLED_OUTLINE_OPACITY,
  PLACEHOLDER_TOP_POSITION,
} from './constants';
import {
  $containerStyle,
  $fieldStyle,
  $labelTextStyle,
  $labelWrapperStyle,
  $outlineStyle,
} from './styles';
import { getOutlineColor } from './utils';

export const getOutlinedTextFieldData = (
  api: TextFieldSharedApi,
  props: TextFieldProps
) => {
  const {
    labelProps,
    supportingTextProps,
    style: $inputStyleOverride,
    fieldStyle: $fieldStyleOverride,
    containerStyle: $containerStyleOverride,
    ...textInputProps
  } = props;

  const {
    input,
    theme,
    isFocused,
    disabled,
    hasAccessory,
    hasError,
    $animatedLabelWrapperStyle,
    $animatedLabelTextStyle,
    $animatedPlaceholderStyle,
  } = api;

  // =======================
  // CONSTANTS
  // =======================

  const { isRTL } = I18nManager;

  // =======================
  // THEME TOKENS
  // =======================

  const {
    colors: { background: labelBackgroundColor, onSurface },
  } = theme;

  const labelColor = getLabelColor({
    theme,
    status: props.status,
    isFocused,
    disabled,
  });

  const outlineColor = getOutlineColor({
    theme,
    disabled,
    isFocused,
    hasError,
  });

  const supportingTextColor = getSupportingTextColor({
    theme,
    status: props.status,
    disabled,
  });

  // =======================
  // STYLES
  // =======================

  const $fieldStyles = [$fieldStyle, $fieldStyleOverride];

  /* The outline is a childless absolutely-positioned View, so applying
     `opacity` here is safe and lets us pass `outlineColor` through unchanged
     (including PlatformColor values on Android). */
  const $outlineStyles = [
    $outlineStyle,
    {
      borderWidth: isFocused ? 2 : 1,
      borderColor: outlineColor,
    },
    disabled && { opacity: DISABLED_OUTLINE_OPACITY },
    $fieldStyleOverride,
  ];

  const $containerStyles = [$containerStyle, $containerStyleOverride];

  const $supportingTextStyles: StyleProp<TextStyle> = [
    $supportingTextStyle,
    {
      color: supportingTextColor,
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    disabled && $disabledStyle,
    supportingTextProps?.style,
  ];

  const $animatedLabelWrapperStyles: StyleProp<
    Animated.WithAnimatedObject<ViewStyle> | ViewStyle
  > = [
    $labelWrapperStyle,
    {
      left: hasAccessory
        ? LABEL_START_OFFSET_WITH_ACCESSORY
        : LABEL_START_OFFSET_WITHOUT_ACCESSORY,
      backgroundColor: labelBackgroundColor,
    },
    $animatedLabelWrapperStyle,
  ];

  const $animatedLabelTextStyles: StyleProp<
    Animated.WithAnimatedObject<TextStyle> | TextStyle
  > = [
    $labelTextStyle,
    {
      color: labelColor,
    },
    $animatedLabelTextStyle,
    disabled && $disabledStyle,
    labelProps?.style,
  ];

  const $inputStyles: StyleProp<TextStyle> = [
    $inputStyle,
    {
      color: onSurface,
      fontSize: INPUT_FONT_SIZE,
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    textInputProps.multiline && {
      height: 'auto' as TextStyle['height'],
    },
    isWeb && {
      outlineStyle: 'none' as TextStyle['outlineStyle'],
    },
    disabled && $disabledStyle,
    $inputStyleOverride,
  ];

  const $leadingAccessoryStyles = [
    $leadingAccessoryStyle,
    disabled && $disabledStyle,
  ];

  const $trailingAccessoryStyles = [
    $trailingAccessoryStyle,
    disabled && $disabledStyle,
  ];

  const $animatedPlaceholderStyles: StyleProp<
    Animated.WithAnimatedObject<TextStyle> | TextStyle
  > = [
    $inputStyle,
    {
      position: 'absolute',
      top: PLACEHOLDER_TOP_POSITION,
      left: TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL,
      fontSize: INPUT_FONT_SIZE,
      color:
        textInputProps.placeholderTextColor ?? theme.colors.onSurfaceVariant,
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    disabled && $disabledStyle,
    $animatedPlaceholderStyle,
  ];

  return {
    input,
    disabled,
    hasError,
    $animatedLabelWrapperStyles,
    $animatedLabelTextStyles,
    $animatedPlaceholderStyles,
    $fieldStyles,
    $disabledBackgroundStyles: undefined,
    $outlineStyles,
    $containerStyles,
    $supportingTextStyles,
    $inputStyles,
    $leadingAccessoryStyles,
    $trailingAccessoryStyles,
  };
};
