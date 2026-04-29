import {
  Animated,
  I18nManager,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import {
  ACTIVE_INDICATOR_SIZE,
  INACTIVE_INDICATOR_SIZE,
  INPUT_FONT_SIZE,
  isWeb,
} from '../constants';
import {
  $disabledStyle,
  $inputStyle,
  $leadingAccessoryStyle,
  $supportingTextStyle,
  $trailingAccessoryStyle,
} from '../styles';
import type { TextFieldProps, TextFieldSharedApi } from '../TextField';
import {
  getFieldBackgroundColor,
  getLabelColor,
  getSupportingTextColor,
} from '../utils';
import {
  LABEL_START_OFFSET_WITH_ACCESSORY,
  LABEL_START_OFFSET_WITHOUT_ACCESSORY,
  MULTILINE_PADDING_TOP,
} from './constants';
import {
  $containerStyle,
  $fieldStyle,
  $labelTextStyle,
  $labelWrapperStyle,
  $disabledBackgroundStyle,
  $outlineStyle,
} from './styles';
import { getOutlineColor } from './utils';

export const getFilledTextFieldData = (
  api: TextFieldSharedApi,
  props: TextFieldProps
) => {
  const {
    labelProps,
    supportingTextProps,
    style: $inputStyleOverride,
    fieldStyle: $fieldStyleOverride,
    containerStyle: $containerStyleOverride,
    prefixProps,
    suffixProps,
    ...textInputProps
  } = props;

  const {
    input,
    theme,
    isFocused,
    hasSuffix,
    disabled,
    hasAccessory,
    hasError,
    $animatedLabelWrapperStyle,
    $animatedLabelTextStyle,
    $animatedActiveOutlineStyle,
  } = api;

  // =======================
  // CONSTANTS
  // =======================

  const { isRTL } = I18nManager;

  // =======================
  // THEME TOKENS
  // =======================

  const {
    colors: { onSurface },
  } = theme;

  const labelColor = getLabelColor({
    theme,
    status: props.status,
    isFocused,
    disabled,
  });

  const outlineColor = getOutlineColor({
    theme,
    status: props.status,
    isFocused: false,
    disabled,
  });

  const activeOutlineColor = getOutlineColor({
    theme,
    status: props.status,
    isFocused: true,
    disabled,
  });

  const fieldBackgroundColor = getFieldBackgroundColor({ theme, disabled });

  const supportingTextColor = getSupportingTextColor({
    theme,
    status: props.status,
    disabled,
  });

  // =======================
  // STYLES
  // =======================

  const $animatedLabelWrapperStyles: StyleProp<
    Animated.WithAnimatedObject<ViewStyle> | ViewStyle
  > = [
    $labelWrapperStyle,
    {
      left: hasAccessory
        ? LABEL_START_OFFSET_WITH_ACCESSORY
        : LABEL_START_OFFSET_WITHOUT_ACCESSORY,
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

  const $fieldStyles = [
    $fieldStyle,
    {
      backgroundColor: fieldBackgroundColor,
    },
    $fieldStyleOverride,
  ];

  /* Disabled tint (DISABLED_CONTAINER_OPACITY) is rendered as a childless overlay so its
     alpha can be applied via the `opacity` style without leaking onto the label
     and input. The View accepts `PlatformColor` directly. */
  const $disabledBackgroundStyles: StyleProp<ViewStyle> = disabled
    ? [
        $disabledBackgroundStyle,
        {
          backgroundColor: onSurface,
        },
      ]
    : undefined;

  const $outlineStyles = [
    $outlineStyle,
    {
      height: INACTIVE_INDICATOR_SIZE,
      backgroundColor: outlineColor,
    },
    disabled && $disabledStyle,
  ];

  const $animatedActiveOutlineStyles: StyleProp<
    Animated.WithAnimatedObject<ViewStyle> | ViewStyle
  > = [
    $outlineStyle,
    {
      height: ACTIVE_INDICATOR_SIZE,
      backgroundColor: activeOutlineColor,
    },
    disabled && $disabledStyle,
    $animatedActiveOutlineStyle,
  ];

  const $containerStyles: StyleProp<ViewStyle> = [
    $containerStyle,
    textInputProps.multiline && { alignItems: 'flex-start' },
    $containerStyleOverride,
  ];

  const $supportingTextStyles: StyleProp<TextStyle> = [
    $supportingTextStyle,
    {
      color: supportingTextColor,
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    disabled && $disabledStyle,
    supportingTextProps?.style,
  ];

  const $inputStyles: StyleProp<TextStyle> = [
    $inputStyle,
    {
      flex: 1,
      color: onSurface,
      fontSize: INPUT_FONT_SIZE,
      textAlign: hasSuffix === isRTL ? 'left' : 'right',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    textInputProps.multiline && {
      height: 'auto' as TextStyle['height'],
      paddingTop: MULTILINE_PADDING_TOP,
    },
    isWeb && {
      outlineStyle: 'none' as TextStyle['outlineStyle'],
    },
    disabled && $disabledStyle,
    $inputStyleOverride,
  ];

  const $prefixStyles: StyleProp<TextStyle> = [
    $inputStyle,
    {
      fontSize: INPUT_FONT_SIZE,
      color: onSurface,
    },
    disabled && $disabledStyle,
    prefixProps?.style,
  ];

  const $suffixStyles: StyleProp<TextStyle> = [
    $inputStyle,
    {
      fontSize: INPUT_FONT_SIZE,
      color: onSurface,
    },
    disabled && $disabledStyle,
    suffixProps?.style,
  ];

  const $leadingAccessoryStyles = [
    $leadingAccessoryStyle,
    disabled && $disabledStyle,
  ];

  const $trailingAccessoryStyles = [
    $trailingAccessoryStyle,
    disabled && $disabledStyle,
  ];

  return {
    input,
    disabled,
    hasError,
    hasSuffix,
    $animatedLabelWrapperStyles,
    $animatedLabelTextStyles,
    $fieldStyles,
    $disabledBackgroundStyles,
    $outlineStyles,
    $animatedActiveOutlineStyles,
    $containerStyles,
    $supportingTextStyles,
    $inputStyles,
    $prefixStyles,
    $suffixStyles,
    $leadingAccessoryStyles,
    $trailingAccessoryStyles,
  };
};
