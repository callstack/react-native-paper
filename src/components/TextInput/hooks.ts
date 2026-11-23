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
} from 'react-native';
import type { BlurEvent, FocusEvent } from 'react-native';

import { cubicBezier } from 'react-native-reanimated';

import {
  ACTIVE_LABEL_FONT_SIZE,
  ERROR_ANNOUNCEMENT_DELAY_MS,
  INACTIVE_LABEL_FONT_SIZE,
} from './constants';
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
import { tokens } from '../../theme/tokens';
import { getTransition } from '../../theme/tokens/sys/motion';
import type { InternalTheme } from '../../theme/types';

// Each of these follows a single boolean state (focus/blur, or text
// appearing/disappearing), so CSS transitions are enough here.
const useTextInputAnimation = ({
  variant,
  isRTL,
  isDisabled,
  hasAccessory,
  isFloating,
  isFocused,
  theme,
  reduceMotion,
}: {
  variant: TextInputVariant;
  isRTL: boolean;
  isDisabled: boolean;
  hasAccessory: boolean;
  isFloating: boolean;
  isFocused: boolean;
  theme: InternalTheme;
  reduceMotion: boolean;
}): TextInputAnimationState => {
  const [isLabelFloated, setIsLabelFloated] = useState(isFloating);

  // Track when the label has fully left its resting place, so the placeholder
  // does not show under the resting label. CSS transitions report no end, so
  // wait out the float transition's duration.
  const floatDuration = reduceMotion ? 0 : theme.motion.duration.short3;
  useEffect(() => {
    if (!isFloating) {
      setIsLabelFloated(false);
      return;
    }

    const timeout = setTimeout(() => setIsLabelFloated(true), floatDuration);

    return () => clearTimeout(timeout);
  }, [isFloating, floatDuration]);

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

  // The resting label covers the prefix and suffix, so they fade in as it
  // floats. They mount at that moment, and a CSS transition doesn't run on
  // mount, so the fade is a CSS animation. Affixes shown from the first
  // render, before the label ever rested, don't fade in. This opacity replaces
  // the static one, so it carries the disabled dim of the affix styles too.
  const [hasLabelRested, setHasLabelRested] = useState(!isFloating);
  if (!isFloating && !hasLabelRested) {
    setHasLabelRested(true);
  }

  const affixOpacity = isDisabled ? tokens.md.sys.state.opacity.disabled : 1;
  const animatedAffixStyle: TextInputAnimationState['animatedAffixStyle'] = {
    opacity: affixOpacity,
    ...(hasLabelRested && {
      animationName: { from: { opacity: 0 } },
      animationDuration: reduceMotion ? 0 : theme.motion.duration.short3,
      animationTimingFunction: cubicBezier(...theme.motion.easing.standard),
    }),
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
    animatedAffixStyle,
    animatedActiveOutlineStyle,
    isLabelFloated,
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
  input: RefObject<ComponentRef<typeof NativeTextInput> | null>,
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
  isHovered,
  animation,
}: {
  variant: TextInputVariant;
  props: TextInputProps;
  input: RefObject<ComponentRef<typeof NativeTextInput> | null>;
  theme: InternalTheme;
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

  const theme = useInternalTheme(themeOverride);
  const reduceMotion = useReduceMotion();

  const { direction } = useLocale();

  const isRTL = direction === 'rtl';
  const hasAccessory = !!props.startAccessory;

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

  const animation = useTextInputAnimation({
    variant,
    isRTL,
    isDisabled: !!props.disabled,
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

  // A space keeps the iOS multiline placeholder updating:
  // https://github.com/facebook/react-native/issues/31573
  const placeholder = isPlaceholderShown ? props.placeholder : ' ';

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
