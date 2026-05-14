import { useImperativeHandle, useRef, useState } from 'react';
import { BlurEvent, FocusEvent, I18nManager, TextInput } from 'react-native';

import type {
  TextFieldHookReturn,
  TextFieldProps,
  TextFieldSharedApi,
} from './TextField';
import {
  getAccentColors,
  getFilledTextFieldData,
  getOutlinedTextFieldData,
  getTextFieldAnimation,
} from './utils';
import { useInternalTheme } from '../../core/theming';

export const useTextField = (props: TextFieldProps): TextFieldHookReturn => {
  const {
    ref,
    variant = 'filled',
    theme: themeOverride,
    onFocus,
    onBlur,
  } = props;

  /**
   * Hooks
   */

  const input = useRef<TextInput>(null);

  const theme = useInternalTheme(themeOverride);

  const [isFocused, setIsFocused] = useState<boolean>(false);

  useImperativeHandle(ref, () => input.current as TextInput);

  /**
   * Constants
   */

  const { isRTL } = I18nManager.getConstants();
  const disabled = props.editable === false;
  const isFloating = isFocused || !!props.value;
  const hasError = !!props.error;
  const hasAccessory = isRTL ? !!props.EndAccessory : !!props.StartAccessory;
  const hasPrefix = !!props.prefix && isFloating;
  const hasSuffix = !!props.suffix && isFloating;
  const hasCounter = !!(props.counter && props.maxLength);

  /**
   * Theme tokens
   */

  const { selectionColor, cursorColor } = getAccentColors({
    theme,
    hasError,
  });

  const placeholderTextColor =
    props.placeholderTextColor ?? theme.colors.onSurfaceVariant;

  /**
   * Label animation
   */

  const {
    animatedLabelWrapperStyle,
    animatedLabelTextStyle,
    animatedActiveOutlineStyle,
    animatedContainerStyle,
  } = getTextFieldAnimation({
    variant,
    isFloating,
    isFocused,
    hasAccessory,
  });

  /**
   * Handlers
   */

  const onFocusHandler = (e: FocusEvent) => {
    onFocus?.(e);
    setIsFocused(true);
  };

  const onBlurHandler = (e: BlurEvent) => {
    onBlur?.(e);
    setIsFocused(false);
  };

  const focusInput = () => {
    if (disabled) return;
    input.current?.focus();
  };

  /**
   * Shared API
   */

  const api: TextFieldSharedApi = {
    input,
    theme,
    isFocused,
    disabled,
    hasAccessory,
    hasError,
    hasSuffix,
    animatedLabelWrapperStyle,
    animatedLabelTextStyle,
    animatedActiveOutlineStyle,
  };

  /**
   * Components
   */

  const LeadingAccessory = isRTL ? props.EndAccessory : props.StartAccessory;
  const TrailingAccessory = isRTL ? props.StartAccessory : props.EndAccessory;
  // https://github.com/facebook/react-native/issues/31573
  const placeholder = isFocused ? props.placeholder : ' ';
  const counterText = `${props.value?.length ?? 0}/${props.maxLength}`;

  /**
   * Styles
   */

  const data = {
    hasPrefix,
    hasCounter,
    placeholderTextColor,
    selectionColor,
    cursorColor,
    animatedActiveOutlineStyles: undefined,
    animatedContainerStyle,
    placeholder,
    counterText,
    LeadingAccessory,
    TrailingAccessory,
    onFocusHandler,
    onBlurHandler,
    focusInput,
  };

  if (variant === 'filled') {
    return {
      ...data,
      ...getFilledTextFieldData(api, props),
    };
  }

  return {
    ...data,
    ...getOutlinedTextFieldData(api, props),
  };
};
