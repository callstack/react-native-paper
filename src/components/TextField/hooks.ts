import {
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { BlurEvent, FocusEvent, TextInput } from 'react-native';

import type {
  TextFieldAnimationState,
  TextFieldFlags,
  TextFieldHookReturn,
  TextFieldLayoutState,
  TextFieldProps,
  TextFieldVariant,
} from './TextField';
import {
  getAccentColors,
  getAccessibilityData,
  getFilledTextFieldData,
  getOutlinedTextFieldData,
  getTextFieldAnimation,
} from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import type { InternalTheme } from '../../types';

const useTextFieldValue = (
  props: Pick<TextFieldProps, 'value' | 'defaultValue' | 'onChangeText'>
) => {
  const isControlled = props.value !== undefined;

  const [uncontrolledValue, setUncontrolledValue] = useState(
    isControlled ? props.value : props.defaultValue
  );

  const value = isControlled ? props.value : uncontrolledValue;

  const onChangeText = (text: string) => {
    if (!isControlled) {
      setUncontrolledValue(text);
    }

    props.onChangeText?.(text);
  };

  return { value, onChangeText };
};

const useTextFieldFocus = (
  props: Pick<TextFieldProps, 'onFocus' | 'onBlur'>,
  input: RefObject<TextInput | null>,
  isDisabled: boolean
) => {
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = (e: FocusEvent) => {
    props.onFocus?.(e);
    setIsFocused(true);
  };

  const onBlur = (e: BlurEvent) => {
    props.onBlur?.(e);
    setIsFocused(false);
  };

  const focusInput = () => {
    if (isDisabled) return;
    input.current?.focus();
  };

  return {
    isFocused,
    onFocus,
    onBlur,
    focusInput,
  };
};

const useTextFieldFlags = (
  props: TextFieldProps,
  isFocused: boolean,
  value: TextFieldProps['value']
): TextFieldFlags => {
  const { direction } = useLocale();

  const isRTL = direction === 'rtl';
  const isFloating = isFocused || !!value;

  return {
    isRTL,
    isFloating,
    isDisabled: !!props.disabled,
    isEditable: props.disabled ? false : props.editable,
    hasError: !!props.error,
    hasCounter: !!(props.counter && props.maxLength),
    hasAccessory: isRTL ? !!props.endAccessory : !!props.startAccessory,
    hasPrefix: !!props.prefix && isFloating,
    hasSuffix: !!props.suffix && isFloating,
  };
};

const useTextFieldLayout = ({
  variant,
  props,
  input,
  theme,
  flags,
  isFocused,
  animation,
}: {
  variant: TextFieldVariant;
  props: TextFieldProps;
  input: RefObject<TextInput | null>;
  theme: InternalTheme;
  flags: TextFieldFlags;
  isFocused: boolean;
  animation: TextFieldAnimationState;
}): TextFieldLayoutState => {
  const { isRTL, isDisabled, hasError, hasAccessory, hasSuffix, isFloating } =
    flags;

  const { multiline } = props;

  const {
    animatedLabelWrapperStyle,
    animatedLabelTextStyle,
    animatedActiveOutlineStyle,
  } = animation;

  return useMemo(
    () => {
      const {
        input: _input,
        isDisabled: _isDisabled,
        hasError: _hasError,
        hasSuffix: _hasSuffix,
        ...layout
      } = variant === 'filled'
        ? getFilledTextFieldData(
            {
              input,
              theme,
              isFocused,
              isRTL,
              isDisabled,
              hasAccessory,
              hasError,
              hasSuffix,
              animatedLabelWrapperStyle,
              animatedLabelTextStyle,
              animatedActiveOutlineStyle,
            },
            props
          )
        : getOutlinedTextFieldData(
            {
              input,
              theme,
              isFocused,
              isRTL,
              isDisabled,
              hasAccessory,
              hasError,
              hasSuffix,
              animatedLabelWrapperStyle,
              animatedLabelTextStyle,
              animatedActiveOutlineStyle,
            },
            props
          );

      void _input;
      void _isDisabled;
      void _hasError;
      void _hasSuffix;

      return layout;
    },
    /**
     * `input` is a stable ref. `props` is omitted — only `multiline` affects layout.
     * `style` is omitted — assumed stable; dynamic `style` changes won't invalidate layout.
     * `isFloating` + `isFocused` cover all animation inputs (replacing individual style objects).
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see comment
    [
      variant,
      theme,
      isFocused,
      isFloating,
      isRTL,
      isDisabled,
      hasAccessory,
      hasError,
      hasSuffix,
      multiline,
    ]
  );
};

export const useTextField = (props: TextFieldProps): TextFieldHookReturn => {
  const { ref, variant = 'filled', theme: themeOverride } = props;

  const input = useRef<TextInput>(null);

  const theme = useInternalTheme(themeOverride);

  const { value, onChangeText } = useTextFieldValue(props);

  const { isFocused, onFocus, onBlur, focusInput } = useTextFieldFocus(
    props,
    input,
    !!props.disabled
  );

  const flags = useTextFieldFlags(props, isFocused, value);

  useImperativeHandle(ref, () => input.current as TextInput);

  const { selectionColor, cursorColor } = getAccentColors({
    theme,
    hasError: flags.hasError,
  });

  const placeholderTextColor =
    props.placeholderTextColor ?? theme.colors.onSurfaceVariant;

  const animation = getTextFieldAnimation({
    variant,
    isFloating: flags.isFloating,
    isFocused,
    isRTL: flags.isRTL,
    hasAccessory: flags.hasAccessory,
  });

  const layout = useTextFieldLayout({
    variant,
    props,
    input,
    theme,
    flags,
    isFocused,
    animation,
  });

  const accessibilityProps = getAccessibilityData({
    hasError: flags.hasError,
    hasCounter: flags.hasCounter,
    isDisabled: flags.isDisabled,
    data: { ...props, value },
  });

  const counterText = `${value?.length ?? 0}/${props.maxLength}`;

  const renderLeadingAccessory = flags.isRTL
    ? props.endAccessory
    : props.startAccessory;
  const renderTrailingAccessory = flags.isRTL
    ? props.startAccessory
    : props.endAccessory;

  // https://github.com/facebook/react-native/issues/31573
  const placeholder = isFocused ? props.placeholder : ' ';

  return {
    input,
    value,
    isDisabled: flags.isDisabled,
    isEditable: flags.isEditable,
    hasPrefix: flags.hasPrefix,
    hasCounter: flags.hasCounter,
    hasSuffix: flags.hasSuffix,
    hasError: flags.hasError,
    placeholderTextColor,
    selectionColor,
    cursorColor,
    animatedActiveOutlineStyles: undefined,
    animatedContainerStyle: animation.animatedContainerStyle,
    placeholder,
    counterText,
    accessibilityProps,
    ...layout,
    renderLeadingAccessory,
    renderTrailingAccessory,
    onChangeText,
    onFocus,
    onBlur,
    focusInput,
  };
};
