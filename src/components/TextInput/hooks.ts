import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { TextInput as NativeTextInput } from 'react-native';
import type { BlurEvent, FocusEvent } from 'react-native';

import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  ACTIVE_LABEL_FONT_SIZE,
  INACTIVE_LABEL_FONT_SIZE,
  TIMING_CONFIG,
} from './constants';
import type {
  TextInputAnimationState,
  TextInputFlags,
  TextInputAnimationHandlers,
  TextInputHookReturn,
  TextInputLayoutState,
  TextInputProps,
  TextInputVariant,
} from './TextInput';
import {
  getAccentColors,
  getAccessibilityData,
  getFilledTextInputData,
  getOutlinedTextInputData,
  getTextInputAnimationLayout,
} from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import type { InternalTheme } from '../../types';

const useTextInputAnimation = ({
  variant,
  isRTL,
  hasAccessory,
  value,
  defaultValue,
}: {
  variant: TextInputVariant;
  isRTL: boolean;
  hasAccessory: boolean;
  value: string | undefined;
  defaultValue: string | undefined;
}): TextInputAnimationState & TextInputAnimationHandlers => {
  const initialText = value ?? defaultValue ?? '';

  const focusSV = useSharedValue(0);
  const floatSV = useSharedValue(initialText.length > 0 ? 1 : 0);

  const { activeTop, inactiveTop, translateXEnd } = getTextInputAnimationLayout(
    {
      variant,
      hasAccessory,
      isRTL,
    }
  );

  const runFocusAnimation = (hasText: boolean) => {
    focusSV.value = withTiming(1, TIMING_CONFIG);

    if (!hasText) {
      floatSV.value = withTiming(1, TIMING_CONFIG);
    }
  };

  const runBlurAnimation = (hasText: boolean) => {
    focusSV.value = withTiming(0, TIMING_CONFIG);

    floatSV.value = withTiming(hasText ? 1 : 0, TIMING_CONFIG);
  };

  const syncFloatToValue = (hasText: boolean) => {
    floatSV.value = withTiming(hasText ? 1 : 0, TIMING_CONFIG);
  };

  const animatedLabelWrapperStyle = useAnimatedStyle(() => {
    const top = interpolate(floatSV.value, [0, 1], [inactiveTop, activeTop]);

    if (variant === 'filled') {
      return { top };
    }

    return {
      top,
      transform: [
        { translateX: interpolate(floatSV.value, [0, 1], [0, translateXEnd]) },
      ],
    };
  });

  const animatedLabelTextStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(
      floatSV.value,
      [0, 1],
      [INACTIVE_LABEL_FONT_SIZE, ACTIVE_LABEL_FONT_SIZE]
    ),
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: floatSV.value,
  }));

  const animatedActiveOutlineStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: focusSV.value }],
  }));

  return {
    animatedLabelWrapperStyle,
    animatedLabelTextStyle,
    animatedContainerStyle,
    animatedActiveOutlineStyle:
      variant === 'filled' ? animatedActiveOutlineStyle : undefined,
    runFocusAnimation,
    runBlurAnimation,
    syncFloatToValue,
  };
};

const useTextInputInput = (
  props: Pick<
    TextInputProps,
    'value' | 'defaultValue' | 'onChangeText' | 'counter' | 'maxLength'
  >
) => {
  const isControlled = props.value !== undefined;
  const hasCounter = !!(props.counter && props.maxLength);

  const initialText = isControlled ? props.value : props.defaultValue;

  const ref = useRef(initialText ?? '');

  const [hasValue, setHasValue] = useState(!!initialText);
  const [charCount, setCharCount] = useState(initialText?.length ?? 0);

  const inputLength = isControlled
    ? props.value?.length ?? 0
    : hasCounter
    ? charCount
    : hasValue
    ? 1
    : 0;

  const getHasText = () => {
    if (isControlled) {
      return !!props.value;
    }

    return ref.current.length > 0;
  };

  const onChangeText = (text: string) => {
    ref.current = text;

    if (!isControlled) {
      const next = text.length > 0;

      if (hasCounter) {
        setCharCount(text.length);
      }

      if (next !== hasValue) {
        setHasValue(next);
      }
    }

    props.onChangeText?.(text);
  };

  return {
    hasValue: isControlled ? !!props.value : hasValue,
    inputLength,
    getHasText,
    onChangeText,
  };
};

const useTextInputFocus = (
  props: Pick<TextInputProps, 'onFocus' | 'onBlur'>,
  input: RefObject<NativeTextInput | null>,
  isDisabled: boolean,
  { runFocusAnimation, runBlurAnimation }: TextInputAnimationHandlers,
  getHasText: () => boolean
) => {
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = (e: FocusEvent) => {
    props.onFocus?.(e);

    setIsFocused(true);

    runFocusAnimation(getHasText());
  };

  const onBlur = (e: BlurEvent) => {
    props.onBlur?.(e);

    setIsFocused(false);

    runBlurAnimation(getHasText());
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

const useTextInputFlags = (
  props: TextInputProps,
  isFocused: boolean,
  hasValue: boolean,
  isRTL: boolean,
  hasAccessory: boolean
): TextInputFlags => {
  const isFloating = isFocused || hasValue;

  return {
    isRTL,
    isFloating,
    isDisabled: !!props.disabled,
    isEditable: props.disabled ? false : props.editable,
    hasError: !!props.error,
    hasCounter: !!(props.counter && props.maxLength),
    hasAccessory,
    hasPrefix: !!props.prefix && isFloating,
    hasSuffix: !!props.suffix && isFloating,
  };
};

const useTextInputLayout = ({
  variant,
  props,
  input,
  theme,
  flags,
  isFocused,
  animation,
}: {
  variant: TextInputVariant;
  props: TextInputProps;
  input: RefObject<NativeTextInput | null>;
  theme: InternalTheme;
  flags: TextInputFlags;
  isFocused: boolean;
  animation: TextInputAnimationState;
}): TextInputLayoutState => {
  const { isRTL, isDisabled, hasError, hasAccessory, hasSuffix } = flags;

  const {
    animatedLabelWrapperStyle,
    animatedLabelTextStyle,
    animatedActiveOutlineStyle,
  } = animation;

  const {
    input: _input,
    isDisabled: _isDisabled,
    hasError: _hasError,
    hasSuffix: _hasSuffix,
    ...layout
  } = variant === 'filled'
    ? getFilledTextInputData(
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
    : getOutlinedTextInputData(
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
};

export const useTextInput = (props: TextInputProps): TextInputHookReturn => {
  const { ref, variant = 'filled', theme: themeOverride } = props;

  const input = useRef<NativeTextInput>(null);
  const init = useRef(false);

  const theme = useInternalTheme(themeOverride);

  const { direction } = useLocale();

  const isControlled = props.value !== undefined;
  const isRTL = direction === 'rtl';
  const hasAccessory = isRTL ? !!props.endAccessory : !!props.startAccessory;

  const { hasValue, inputLength, getHasText, onChangeText } =
    useTextInputInput(props);

  const animation = useTextInputAnimation({
    variant,
    isRTL,
    hasAccessory,
    value: props.value,
    defaultValue: props.defaultValue,
  });

  const { isFocused, onFocus, onBlur, focusInput } = useTextInputFocus(
    props,
    input,
    !!props.disabled,
    animation,
    getHasText
  );

  const flags = useTextInputFlags(
    props,
    isFocused,
    hasValue,
    isRTL,
    hasAccessory
  );

  /**
   * Edge case: a controlled `value` can change programmatically.
   * Reconcile the float animation with the new text here.
   * While focused the label is always floated, so we skip to avoid fighting the
   * focus animation, and depend only on `value` to avoid re-running on
   * focus/blur transitions (those are already handled by their own handlers)
   */
  useEffect(() => {
    if (!init.current) {
      init.current = true;
      return;
    }

    if (isControlled && !isFocused) {
      animation.syncFloatToValue(!!props.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- [props.value] is the only dep that should act as a trigger
  }, [props.value]);

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (flags.isDisabled) return;

      input.current?.focus();
    },
    clear: () => {
      input.current?.clear();

      onChangeText('');

      if (!input.current?.isFocused()) {
        animation.runBlurAnimation(false);
      }
    },
    blur: () => input.current?.blur(),
    isFocused: () => input.current?.isFocused() || false,
    setNativeProps: (args: Object) => input.current?.setNativeProps(args),
    setSelection: (start: number, end: number) =>
      input.current?.setSelection(start, end),
  }));

  const { selectionColor, cursorColor } = getAccentColors({
    theme,
    hasError: flags.hasError,
  });

  const placeholderTextColor =
    props.placeholderTextColor ?? theme.colors.onSurfaceVariant;

  const layout = useTextInputLayout({
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
    data: props,
    inputLength,
  });

  const counterText = `${inputLength}/${props.maxLength}`;

  const renderLeadingAccessory = flags.isRTL
    ? props.endAccessory
    : props.startAccessory;
  const renderTrailingAccessory = flags.isRTL
    ? props.startAccessory
    : props.endAccessory;

  // https://github.com/facebook/react-native/issues/31573
  const placeholder =
    isFocused || !props.label || hasValue ? props.placeholder : ' ';

  return {
    input,
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
