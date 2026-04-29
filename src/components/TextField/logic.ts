import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  BlurEvent,
  FocusEvent,
  I18nManager,
  TextInput,
  TextStyle,
  ViewStyle,
} from 'react-native';

import {
  ACTIVE_LABEL_FONT_SIZE,
  ANIMATION_DURATION_MS,
  INACTIVE_LABEL_FONT_SIZE,
  INACTIVE_LABEL_TOP_POSITION,
} from './constants';
import { ACTIVE_LABEL_TOP_POSITION as FILLED_ACTIVE_LABEL_TOP } from './filled/constants';
import { getFilledTextFieldData } from './filled/logic';
import {
  LABEL_TRANSLATE_X_WITHOUT_ACCESSORY,
  LABEL_TRANSLATE_X_WITH_ACCESSORY,
  ACTIVE_LABEL_TOP_POSITION as OUTLINED_ACTIVE_LABEL_TOP,
} from './outlined/constants';
import { getOutlinedTextFieldData } from './outlined/logic';
import { $pressableStyle } from './styles';
import type { TextFieldProps, TextFieldSharedApi } from './TextField';
import { getAccentColors } from './utils';
import { useInternalTheme } from '../../core/theming';

export const useTextField = (props: TextFieldProps) => {
  const {
    ref,
    variant = 'filled',
    pressableStyle: $pressableStyleOverride,
    theme: themeOverride,
    onFocus,
    onBlur,
  } = props;

  // =======================
  // HOOKS
  // =======================

  const input = useRef<TextInput>(null);

  const theme = useInternalTheme(themeOverride);

  const [isFocused, setIsFocused] = useState<boolean>(false);

  useImperativeHandle(ref, () => input.current as TextInput);

  // =======================
  // CONSTANTS
  // =======================

  const { isRTL } = I18nManager;
  const disabled = props.editable === false || props.status === 'disabled';
  const isFloating = isFocused || !!props.value;
  const hasAccessory = isRTL ? !!props.EndAccessory : !!props.StartAccessory;
  const hasError = props.status === 'error';
  const hasPrefix = !!props.prefix && isFloating;
  const hasSuffix = !!props.suffix && isFloating;

  // =======================
  // THEME TOKENS
  // =======================

  const { selectionColor: $selectionColor, cursorColor: $cursorColor } =
    getAccentColors({ theme, hasError });

  const $placeholderTextColor =
    props.placeholderTextColor ?? theme.colors.onSurfaceVariant;

  // =======================
  // LABEL ANIMATION
  // =======================

  const {
    $animatedLabelWrapperStyle,
    $animatedLabelTextStyle,
    $animatedActiveOutlineStyle,
  } = useTextFieldAnimation({
    variant,
    isFloating,
    isFocused,
    hasAccessory,
  });

  // =======================
  // HANDLERS
  // =======================

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

  // =======================
  // SHARED API
  // =======================

  const api: TextFieldSharedApi = {
    input,
    theme,
    isFocused,
    disabled,
    hasAccessory,
    hasError,
    hasSuffix,
    $animatedLabelWrapperStyle,
    $animatedLabelTextStyle,
    $animatedActiveOutlineStyle,
  };

  // =======================
  // COMPONENTS
  // =======================

  const LeadingAccessory = isRTL ? props.EndAccessory : props.StartAccessory;
  const TrailingAccessory = isRTL ? props.StartAccessory : props.EndAccessory;
  // https://github.com/facebook/react-native/issues/31573
  const placeholder = isFocused ? props.placeholder : ' ';

  // =======================
  // STYLES
  // =======================

  const $pressableStyles = [$pressableStyle, $pressableStyleOverride];

  const data = {
    hasPrefix,
    $pressableStyles,
    $placeholderTextColor,
    $selectionColor,
    $cursorColor,
    $animatedActiveOutlineStyles: undefined,
    placeholder,
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

const useTextFieldAnimation = ({
  variant,
  isFloating,
  isFocused,
  hasAccessory,
}: {
  variant: 'filled' | 'outlined';
  isFloating: boolean;
  isFocused: boolean;
  hasAccessory: boolean;
}): {
  $animatedLabelWrapperStyle: Animated.WithAnimatedObject<ViewStyle>;
  $animatedLabelTextStyle: Animated.WithAnimatedObject<TextStyle>;
  $animatedActiveOutlineStyle?: Animated.WithAnimatedObject<ViewStyle>;
} => {
  const focusProgress = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  const floatingProgress = useRef(
    new Animated.Value(isFloating ? 1 : 0)
  ).current;

  useEffect(() => {
    Animated.timing(focusProgress, {
      toValue: isFocused ? 1 : 0,
      duration: ANIMATION_DURATION_MS,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  useEffect(() => {
    Animated.timing(floatingProgress, {
      toValue: isFloating ? 1 : 0,
      duration: ANIMATION_DURATION_MS,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFloating]);

  return useMemo(() => {
    const activeTop =
      variant === 'filled'
        ? FILLED_ACTIVE_LABEL_TOP
        : OUTLINED_ACTIVE_LABEL_TOP;

    const fontSize = floatingProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [INACTIVE_LABEL_FONT_SIZE, ACTIVE_LABEL_FONT_SIZE],
    });

    const top = floatingProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [INACTIVE_LABEL_TOP_POSITION, activeTop],
    });

    if (variant === 'filled') {
      const scaleX = focusProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      });

      return {
        $animatedLabelWrapperStyle: { top },
        $animatedLabelTextStyle: { fontSize },
        $animatedActiveOutlineStyle: {
          transform: [{ scaleX }],
        },
      };
    }

    const translateXEnd = hasAccessory
      ? LABEL_TRANSLATE_X_WITH_ACCESSORY
      : LABEL_TRANSLATE_X_WITHOUT_ACCESSORY;

    return {
      $animatedLabelWrapperStyle: {
        top,
        transform: [
          {
            translateX: floatingProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, translateXEnd],
            }),
          },
        ],
      },
      $animatedLabelTextStyle: { fontSize },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, hasAccessory]);
};
