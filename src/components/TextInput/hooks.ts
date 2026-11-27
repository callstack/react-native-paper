import {
  useEffect,
  useImperativeHandle,
  useId,
  useRef,
  useState,
  type ComponentRef,
  type RefObject,
} from 'react';
import {
  AccessibilityInfo,
  Platform,
  TextInput as NativeTextInput,
  useWindowDimensions,
} from 'react-native';
import type { BlurEvent, FocusEvent } from 'react-native';

import {
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import {
  ACTIVE_LABEL_FONT_SIZE,
  ERROR_ANNOUNCEMENT_DELAY_MS,
  getTextInputMetrics,
  INACTIVE_LABEL_FONT_SIZE,
  TIMING_CONFIG,
} from './constants';
import type { TextInputMetrics } from './constants';
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
import { tokens } from '../../theme/tokens';
import type { InternalTheme } from '../../theme/types';

const useTextInputAnimation = ({
  variant,
  metrics,
  isRTL,
  isDisabled,
  hasAccessory,
  hasEndAccessory,
  value,
  defaultValue,
}: {
  variant: TextInputVariant;
  metrics: TextInputMetrics;
  isRTL: boolean;
  isDisabled: boolean;
  hasAccessory: boolean;
  hasEndAccessory: boolean;
  value: string | undefined;
  defaultValue: string | undefined;
}): TextInputAnimationState & TextInputAnimationHandlers => {
  const initialText = value ?? defaultValue ?? '';

  const focusSV = useSharedValue(0);
  const floatSV = useSharedValue(initialText.length > 0 ? 1 : 0);
  const [isLabelFloated, setIsLabelFloated] = useState(initialText.length > 0);

  // Track when the label has fully left its resting place, whichever animation
  // moved it, so the placeholder does not show under the resting label.
  useAnimatedReaction(
    () => floatSV.value === 1,
    (floated, previous) => {
      if (previous !== null && floated !== previous) {
        scheduleOnRN(setIsLabelFloated, floated);
      }
    }
  );

  const {
    activeTop,
    inactiveTop,
    translateXEnd,
    activeEnd,
    inactiveEnd,
    endKey,
  } = getTextInputAnimationLayout({
    variant,
    metrics,
    hasAccessory,
    hasEndAccessory,
    isRTL,
  });

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
    const end = interpolate(floatSV.value, [0, 1], [inactiveEnd, activeEnd]);

    if (variant === 'filled') {
      return { top, [endKey]: end };
    }

    return {
      top,
      [endKey]: end,
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

  // The resting label covers the prefix and suffix, so they fade in as it
  // floats. This opacity replaces the static one, so it carries the disabled
  // dim of the prefix and suffix styles too.
  const affixOpacity = isDisabled ? tokens.md.sys.state.opacity.disabled : 1;
  const animatedAffixStyle = useAnimatedStyle(() => ({
    opacity: floatSV.value * affixOpacity,
  }));

  const animatedActiveOutlineStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: focusSV.value }],
  }));

  return {
    animatedLabelWrapperStyle,
    animatedLabelTextStyle,
    animatedAffixStyle,
    animatedActiveOutlineStyle:
      variant === 'filled' ? animatedActiveOutlineStyle : undefined,
    isLabelFloated,
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
    ? (props.value?.length ?? 0)
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
  input: RefObject<ComponentRef<typeof NativeTextInput> | null>,
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
  metrics,
  flags,
  isFocused,
  isHovered,
  animation,
}: {
  variant: TextInputVariant;
  props: TextInputProps;
  input: RefObject<ComponentRef<typeof NativeTextInput> | null>;
  theme: InternalTheme;
  metrics: TextInputMetrics;
  flags: TextInputFlags;
  isFocused: boolean;
  isHovered: boolean;
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
          metrics,
          isFocused,
          isHovered,
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
          metrics,
          isFocused,
          isHovered,
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

  const input = useRef<ComponentRef<typeof NativeTextInput>>(null);
  const id = useId();
  const [isHovered, setIsHovered] = useState(false);
  const init = useRef(false);

  const theme = useInternalTheme(themeOverride);

  const { direction } = useLocale();

  // Read the text size on every render, so a change while the app runs
  // resizes the field.
  const { fontScale } = useWindowDimensions();
  const metrics = getTextInputMetrics(fontScale);

  const isControlled = props.value !== undefined;
  const isRTL = direction === 'rtl';
  const hasAccessory = !!props.startAccessory;

  const { hasValue, inputLength, getHasText, onChangeText } =
    useTextInputInput(props);

  const animation = useTextInputAnimation({
    variant,
    metrics,
    isRTL,
    isDisabled: !!props.disabled,
    hasAccessory,
    // The error icon takes the end accessory's place when there is none.
    hasEndAccessory: !!props.endAccessory || !!props.error,
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
    metrics,
    flags,
    isFocused,
    isHovered,
    animation,
  });

  // With a label, show the placeholder only once the label has floated away
  // from it.
  const isPlaceholderShown =
    !props.label || hasValue || (isFocused && animation.isLabelFloated);

  const accessibilityProps = getAccessibilityData({
    id,
    hasError: flags.hasError,
    hasCounter: flags.hasCounter,
    hasPrefix: flags.hasPrefix,
    hasSuffix: flags.hasSuffix,
    isDisabled: flags.isDisabled,
    isPlaceholderShown,
    data: props,
    inputLength,
  });

  // On native, the error is read from the input's hint and its text node is
  // hidden, so a live region would not announce it. Announce changed errors
  // instead, but not errors present on mount, so a screen that opens with
  // several invalid fields does not queue an announcement for each of them.
  // Wait until the error has stayed the same for ERROR_ANNOUNCEMENT_DELAY_MS,
  // so a message that changes on every keystroke is announced once it stops
  // changing, not once per change.
  // Queue them so that fields becoming invalid together do not cut each other
  // off on iOS.
  const errorMessage = flags.hasError ? props.supportingText : undefined;
  const announcedErrorMessage = useRef(errorMessage);
  useEffect(() => {
    if (
      Platform.OS === 'web' ||
      errorMessage === announcedErrorMessage.current
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      announcedErrorMessage.current = errorMessage;

      if (errorMessage) {
        AccessibilityInfo.announceForAccessibilityWithOptions(errorMessage, {
          queue: true,
        });
      }
    }, ERROR_ANNOUNCEMENT_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [errorMessage]);

  const counterText = `${inputLength}/${props.maxLength}`;

  const renderLeadingAccessory = props.startAccessory;
  const renderTrailingAccessory = props.endAccessory;

  // The hidden placeholder is empty: a blank is read as the field's text
  // (TalkBack says "Space, edit box" instead of the label, iOS reports it as
  // the value). Only iOS multiline fields keep a space, which keeps their
  // placeholder updating: https://github.com/facebook/react-native/issues/31573
  const hiddenPlaceholder = Platform.OS === 'ios' && props.multiline ? ' ' : '';
  const placeholder = isPlaceholderShown
    ? props.placeholder
    : hiddenPlaceholder;

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
    // Without a label nothing covers the prefix and suffix.
    animatedAffixStyle: props.label ? animation.animatedAffixStyle : undefined,
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
    onHoverIn: () => setIsHovered(true),
    onHoverOut: () => setIsHovered(false),
  };
};
