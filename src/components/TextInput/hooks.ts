import { useImperativeHandle, useRef, useState, type RefObject } from 'react';
import { TextInput as NativeTextInput } from 'react-native';
import type { BlurEvent, FocusEvent } from 'react-native';

import { ACTIVE_LABEL_FONT_SIZE, INACTIVE_LABEL_FONT_SIZE } from './constants';
import type {
  TextInputAnimationState,
  TextInputFlags,
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
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { getTransition } from '../../theme/tokens/sys/motion';
import type { InternalTheme } from '../../theme/types';

// The label float (top/translateX/fontSize/opacity) and the outlined active
// border (scaleX) are both driven by a single boolean state transition
// (focus/blur, or text appearing/disappearing) — not a continuous or
// interruptible drag — so each ends up a plain discrete CSS transition
// between two fixed values per property, with no shared progress value
// needed. That keeps this on the CSS tier per the motion decision rule.
const useTextInputAnimation = ({
  variant,
  isRTL,
  hasAccessory,
  isFloating,
  isFocused,
  theme,
  reduceMotion,
}: {
  variant: TextInputVariant;
  isRTL: boolean;
  hasAccessory: boolean;
  isFloating: boolean;
  isFocused: boolean;
  theme: InternalTheme;
  reduceMotion: boolean;
}): TextInputAnimationState => {
  const { activeTop, inactiveTop, translateXEnd } = getTextInputAnimationLayout(
    {
      variant,
      hasAccessory,
      isRTL,
    }
  );

  const top = isFloating ? activeTop : inactiveTop;

  const animatedLabelWrapperStyle: TextInputAnimationState['animatedLabelWrapperStyle'] =
    variant === 'filled'
      ? {
          top,
          ...getTransition(theme, 'top', 'short3', 'standard', reduceMotion),
        }
      : {
          top,
          transform: [{ translateX: isFloating ? translateXEnd : 0 }],
          ...getTransition(
            theme,
            ['top', 'transform'],
            'short3',
            'standard',
            reduceMotion
          ),
        };

  const animatedLabelTextStyle: TextInputAnimationState['animatedLabelTextStyle'] =
    {
      fontSize: isFloating ? ACTIVE_LABEL_FONT_SIZE : INACTIVE_LABEL_FONT_SIZE,
      ...getTransition(theme, 'fontSize', 'short3', 'standard', reduceMotion),
    };

  const animatedContainerStyle: TextInputAnimationState['animatedContainerStyle'] =
    {
      opacity: isFloating ? 1 : 0,
      ...getTransition(theme, 'opacity', 'short3', 'standard', reduceMotion),
    };

  const animatedActiveOutlineStyle: TextInputAnimationState['animatedActiveOutlineStyle'] =
    variant === 'filled'
      ? {
          transform: [{ scaleX: isFocused ? 1 : 0 }],
          ...getTransition(
            theme,
            'transform',
            'short3',
            'standard',
            reduceMotion
          ),
        }
      : undefined;

  return {
    animatedLabelWrapperStyle,
    animatedLabelTextStyle,
    animatedContainerStyle,
    animatedActiveOutlineStyle,
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

  const [hasValue, setHasValue] = useState(!!initialText);
  const [charCount, setCharCount] = useState(initialText?.length ?? 0);

  const inputLength = isControlled
    ? (props.value?.length ?? 0)
    : hasCounter
      ? charCount
      : hasValue
        ? 1
        : 0;

  const onChangeText = (text: string) => {
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
    onChangeText,
  };
};

const useTextInputFocus = (
  props: Pick<TextInputProps, 'onFocus' | 'onBlur'>,
  input: RefObject<NativeTextInput | null>,
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

  const theme = useInternalTheme(themeOverride);
  const reduceMotion = useReduceMotion();

  const { direction } = useLocale();

  const isRTL = direction === 'rtl';
  const hasAccessory = isRTL ? !!props.endAccessory : !!props.startAccessory;

  const { hasValue, inputLength, onChangeText } = useTextInputInput(props);

  const { isFocused, onFocus, onBlur, focusInput } = useTextInputFocus(
    props,
    input,
    !!props.disabled
  );

  const flags = useTextInputFlags(
    props,
    isFocused,
    hasValue,
    isRTL,
    hasAccessory
  );

  // `isFloating` is derived every render from `isFocused`/`hasValue` (itself
  // reconciled with a controlled `value` by `useTextInputInput`), so the
  // label float and active-border animations below stay in sync with
  // programmatic value changes with no extra effect needed.
  const animation = useTextInputAnimation({
    variant,
    isRTL,
    hasAccessory,
    isFloating: flags.isFloating,
    isFocused,
    theme,
    reduceMotion,
  });

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (flags.isDisabled) return;

      input.current?.focus();
    },
    clear: () => {
      input.current?.clear();

      onChangeText('');
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
