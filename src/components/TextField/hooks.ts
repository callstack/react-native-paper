import {
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { BlurEvent, FocusEvent, TextInput } from 'react-native';

import type {
  GetAccessibilityDataReturn,
  TextFieldAnimationState,
  TextFieldColors,
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
  getLayoutState,
  getOutlinedTextFieldData,
  getTextFieldAnimation,
} from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import type { InternalTheme } from '../../types';

const useTextFieldRef = (ref: TextFieldProps['ref']) => {
  const input = useRef<TextInput>(null);

  useImperativeHandle(ref, () => input.current as TextInput);

  return input;
};

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

const useTextFieldColors = (
  theme: InternalTheme,
  hasError: boolean,
  placeholderTextColor: TextFieldProps['placeholderTextColor']
): TextFieldColors =>
  useMemo(
    () => ({
      ...getAccentColors({ theme, hasError }),
      placeholderTextColor:
        placeholderTextColor ?? theme.colors.onSurfaceVariant,
    }),
    [theme, hasError, placeholderTextColor]
  );

const useTextFieldAnimation = ({
  variant,
  isFloating,
  isFocused,
  isRTL,
  hasAccessory,
}: {
  variant: TextFieldVariant;
  isFloating: boolean;
  isFocused: boolean;
  isRTL: boolean;
  hasAccessory: boolean;
}): TextFieldAnimationState =>
  useMemo(
    () =>
      getTextFieldAnimation({
        variant,
        isFloating,
        isFocused,
        isRTL,
        hasAccessory,
      }),
    [variant, isFloating, isFocused, isRTL, hasAccessory]
  );

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
    () =>
      getLayoutState(
        variant === 'filled'
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
            )
      ),
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

const useTextFieldAccessibility = (
  props: TextFieldProps,
  value: TextFieldProps['value'],
  flags: Pick<TextFieldFlags, 'hasError' | 'hasCounter' | 'isDisabled'>
): GetAccessibilityDataReturn => {
  const { hasError, hasCounter, isDisabled } = flags;

  const { label, supportingText, placeholder, maxLength } = props;

  return useMemo(
    () =>
      getAccessibilityData({
        hasError,
        hasCounter,
        isDisabled,
        data: { ...props, value },
      }),
    // `props` is omitted — fields read by `getAccessibilityData` are listed explicitly.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see comment
    [
      value,
      label,
      supportingText,
      placeholder,
      maxLength,
      hasError,
      hasCounter,
      isDisabled,
    ]
  );
};

const useTextFieldCounter = (
  value: TextFieldProps['value'],
  maxLength: TextFieldProps['maxLength']
) => useMemo(() => `${value?.length ?? 0}/${maxLength}`, [value, maxLength]);

export const useTextField = (props: TextFieldProps): TextFieldHookReturn => {
  const { ref, variant = 'filled', theme: themeOverride } = props;

  const input = useTextFieldRef(ref);

  const theme = useInternalTheme(themeOverride);

  const { value, onChangeText } = useTextFieldValue(props);

  const { isFocused, onFocus, onBlur, focusInput } = useTextFieldFocus(
    props,
    input,
    !!props.disabled
  );

  const flags = useTextFieldFlags(props, isFocused, value);

  const { selectionColor, cursorColor, placeholderTextColor } =
    useTextFieldColors(theme, flags.hasError, props.placeholderTextColor);

  const animation = useTextFieldAnimation({
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

  const accessibilityProps = useTextFieldAccessibility(props, value, flags);

  const counterText = useTextFieldCounter(value, props.maxLength);

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
