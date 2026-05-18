import { Platform, StyleProp, TextStyle, ViewStyle } from 'react-native';

import { AnimatedStyle } from 'react-native-reanimated';

import {
  ACTIVE_INDICATOR_SIZE,
  ACTIVE_LABEL_FONT_SIZE,
  ANIMATION_DURATION_MS,
  FILLED_ACTIVE_LABEL_TOP_POSITION,
  FILLED_LABEL_START_OFFSET_WITH_ACCESSORY,
  FILLED_MULTILINE_PADDING_TOP,
  INACTIVE_INDICATOR_SIZE,
  INACTIVE_LABEL_FONT_SIZE,
  INACTIVE_LABEL_TOP_POSITION,
  INPUT_FONT_SIZE,
  LABEL_START_OFFSET_WITHOUT_ACCESSORY,
  OUTLINED_ACTIVE_LABEL_TOP_POSITION,
  OUTLINED_DISABLED_OUTLINE_OPACITY,
  OUTLINED_LABEL_START_OFFSET_WITH_ACCESSORY,
  OUTLINED_LABEL_TRANSLATE_DISTANCE_WITHOUT_ACCESSORY,
  OUTLINED_LABEL_TRANSLATE_DISTANCE_WITH_ACCESSORY,
  OUTLINED_MULTILINE_PADDING_TOP,
  PREFIX_END_PADDING,
  SUFFIX_START_PADDING,
  TEXT_FIELD_BORDER_RADIUS,
} from './constants';
import { filledStyles, outlinedStyles, styles } from './styles';
import type {
  FilledTextFieldHookData,
  OutlinedTextFieldHookData,
  TextFieldProps,
  TextFieldSharedApi,
  SharedTextFieldStyleData,
} from './TextField';
import type { InternalTheme } from '../../types';

export const getAccentColors = ({
  theme,
  hasError,
}: {
  theme: InternalTheme;
  hasError: boolean;
}) => {
  const color = hasError ? theme.colors.error : theme.colors.primary;

  return {
    selectionColor: color,
    cursorColor: color,
  };
};

export const getLabelColor = ({
  theme,
  hasError,
  isFocused,
  isDisabled,
}: {
  theme: InternalTheme;
  isFocused: boolean;
  hasError: boolean;
  isDisabled: boolean;
}) => {
  const {
    colors: { error, primary, onSurface, onSurfaceVariant },
  } = theme;

  if (hasError) {
    return error;
  }
  if (isDisabled) {
    return onSurface;
  }
  if (isFocused) {
    return primary;
  }
  return onSurfaceVariant;
};

export const getSupportingTextColor = ({
  theme,
  hasError,
  isDisabled,
}: {
  theme: InternalTheme;
  hasError: boolean;
  isDisabled: boolean;
}) => {
  const {
    colors: { error, onSurface, onSurfaceVariant },
  } = theme;

  if (hasError) {
    return error;
  }
  if (isDisabled) {
    return onSurface;
  }
  return onSurfaceVariant;
};

/**
 * Returns the solid background color for the filled field container, or
 * `undefined` when disabled. The disabled tint is rendered
 * as a separate overlay View whose alpha is applied via the `opacity` style;
 * keeping the alpha out of the color string is what makes the component safe
 * to use with `PlatformColor` values on Android.
 */
export const getFieldBackgroundColor = ({
  theme,
  isDisabled,
}: {
  theme: InternalTheme;
  isDisabled: boolean;
}): string | undefined => {
  if (isDisabled) {
    return undefined;
  }

  return theme.colors.surfaceContainerHighest;
};

export const getIconColor = ({
  theme,
  iconColor,
  hasError,
  isDisabled,
}: {
  theme: InternalTheme;
  iconColor?: string;
  hasError: boolean;
  isDisabled: boolean;
}) => {
  if (iconColor) return iconColor;
  if (hasError) return theme.colors.error;
  if (isDisabled) return theme.colors.onSurface;
  return theme.colors.onSurfaceVariant;
};

/**
 * Returns the raw outline color for a filled field. The disabled state's
 * alpha is intentionally NOT baked in here — it is applied via the `opacity`
 * style on the (childless) outline View so the value can be a `PlatformColor`
 * on Android, which the `color` library cannot parse at runtime.
 */
export const getOutlineColor = ({
  theme,
  hasError,
  isFocused,
  isDisabled,
}: {
  theme: InternalTheme;
  isFocused: boolean;
  hasError: boolean;
  isDisabled: boolean;
}) => {
  const {
    colors: { error, onSurface, primary, outline },
  } = theme;

  if (hasError) {
    return error;
  }
  if (isDisabled) {
    return onSurface;
  }
  if (isFocused) {
    return primary;
  }

  return outline;
};

/**
 * Computes the style arrays that are identical across the filled and outlined
 * variants. Each variant logic function calls this and then only computes its
 * own variant-specific styles on top.
 *
 * Returns `isRTL` as well so callers can use it when building `inputStyles`,
 * which is variant-specific (filled adds `MULTILINE_PADDING_TOP`).
 */
export const getSharedTextFieldStyleData = (
  api: TextFieldSharedApi
): SharedTextFieldStyleData => {
  const {
    theme,
    isDisabled,
    hasError,
    isFocused,
    isRTL,
    animatedLabelTextStyle,
  } = api;

  const labelColor = getLabelColor({ theme, hasError, isFocused, isDisabled });

  const supportingTextColor = getSupportingTextColor({
    theme,
    hasError,
    isDisabled,
  });
  const {
    colors: { onSurfaceVariant },
  } = theme;

  const animatedLabelTextStyles: StyleProp<
    AnimatedStyle<StyleProp<TextStyle>>
  > = [
    styles.input,
    { color: labelColor },
    animatedLabelTextStyle,
    isDisabled && styles.disabled,
  ];

  const supportingTextStyles: StyleProp<TextStyle> = [
    styles.supportingText,
    {
      color: supportingTextColor,
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    isDisabled && styles.disabled,
  ];

  const counterStyles: StyleProp<TextStyle> = [
    styles.counter,
    {
      color: supportingTextColor,
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    isDisabled && styles.disabled,
  ];

  const prefixStyles: StyleProp<TextStyle> = [
    styles.input,
    {
      fontSize: INPUT_FONT_SIZE,
      color: onSurfaceVariant,
      paddingEnd: PREFIX_END_PADDING,
    },
    isDisabled && styles.disabled,
  ];

  const suffixStyles: StyleProp<TextStyle> = [
    styles.input,
    {
      fontSize: INPUT_FONT_SIZE,
      color: onSurfaceVariant,
      paddingStart: SUFFIX_START_PADDING,
    },
    isDisabled && styles.disabled,
  ];

  const leadingAccessoryStyles: StyleProp<ViewStyle> = [
    styles.leadingAccessory,
    isDisabled && styles.disabled,
  ];

  const trailingAccessoryStyles: StyleProp<ViewStyle> = [
    styles.trailingAccessory,
    isDisabled && styles.disabled,
  ];

  return {
    isRTL,
    animatedLabelTextStyles,
    supportingTextStyles,
    counterStyles,
    prefixStyles,
    suffixStyles,
    leadingAccessoryStyles,
    trailingAccessoryStyles,
  };
};

export const getTextFieldAnimation = ({
  variant,
  isFloating,
  isFocused,
  isRTL,
  hasAccessory,
}: {
  variant: 'filled' | 'outlined';
  isFloating: boolean;
  isFocused: boolean;
  isRTL: boolean;
  hasAccessory: boolean;
}): {
  animatedLabelWrapperStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  animatedLabelTextStyle: StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
  animatedContainerStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  animatedActiveOutlineStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
} => {
  const activeTop =
    variant === 'filled'
      ? FILLED_ACTIVE_LABEL_TOP_POSITION
      : OUTLINED_ACTIVE_LABEL_TOP_POSITION;

  const top = isFloating ? activeTop : INACTIVE_LABEL_TOP_POSITION;
  const fontSize = isFloating
    ? ACTIVE_LABEL_FONT_SIZE
    : INACTIVE_LABEL_FONT_SIZE;

  const animatedContainerStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>> =
    {
      opacity: isFloating ? 1 : 0,
      transitionProperty: 'opacity',
      transitionDuration: ANIMATION_DURATION_MS,
    };

  if (variant === 'filled') {
    return {
      animatedLabelWrapperStyle: {
        top,
        transitionProperty: 'top',
        transitionDuration: ANIMATION_DURATION_MS,
      },
      animatedLabelTextStyle: {
        fontSize,
        transitionProperty: 'fontSize',
        transitionDuration: ANIMATION_DURATION_MS,
      },
      animatedActiveOutlineStyle: {
        transform: [{ scaleX: isFocused ? 1 : 0 }],
        transitionProperty: 'transform',
        transitionDuration: ANIMATION_DURATION_MS,
      },
      animatedContainerStyle,
    };
  }

  const distance = hasAccessory
    ? OUTLINED_LABEL_TRANSLATE_DISTANCE_WITH_ACCESSORY
    : OUTLINED_LABEL_TRANSLATE_DISTANCE_WITHOUT_ACCESSORY;
  const translateXEnd = (isRTL ? 1 : -1) * distance;

  return {
    animatedLabelWrapperStyle: {
      top,
      transform: [{ translateX: isFloating ? translateXEnd : 0 }],
      transitionProperty: ['top', 'transform'],
      transitionDuration: ANIMATION_DURATION_MS,
    },
    animatedLabelTextStyle: {
      fontSize,
      transitionProperty: 'fontSize',
      transitionDuration: ANIMATION_DURATION_MS,
    },
    animatedContainerStyle,
  };
};

export const getFilledTextFieldData = (
  api: TextFieldSharedApi,
  props: TextFieldProps
): FilledTextFieldHookData => {
  const { style: inputStyleOverride, ...textInputProps } = props;

  const {
    input,
    theme,
    hasSuffix,
    isDisabled,
    hasAccessory,
    hasError,
    animatedLabelWrapperStyle,
    animatedActiveOutlineStyle,
  } = api;

  /**
   * Theme tokens
   */
  const {
    colors: { onSurface },
  } = theme;

  const outlineColor = getOutlineColor({
    theme,
    hasError,
    isFocused: false,
    isDisabled,
  });

  const activeOutlineColor = getOutlineColor({
    theme,
    hasError,
    isFocused: true,
    isDisabled,
  });

  const fieldBackgroundColor = getFieldBackgroundColor({ theme, isDisabled });

  /**
   * Shared styles
   */

  const shared = getSharedTextFieldStyleData(api);

  /**
   * Variant-specific styles
   */

  const animatedLabelWrapperStyles: StyleProp<
    AnimatedStyle<StyleProp<ViewStyle>>
  > = [
    filledStyles.labelWrapper,
    {
      left: hasAccessory
        ? FILLED_LABEL_START_OFFSET_WITH_ACCESSORY
        : LABEL_START_OFFSET_WITHOUT_ACCESSORY,
    },
    animatedLabelWrapperStyle,
  ];

  const containerStyles: StyleProp<ViewStyle> = [
    filledStyles.container,
    isDisabled && styles.disabled,
  ];

  const fieldStyles: StyleProp<ViewStyle> = [
    styles.field,
    {
      backgroundColor: fieldBackgroundColor,
      borderTopStartRadius: TEXT_FIELD_BORDER_RADIUS,
      borderTopEndRadius: TEXT_FIELD_BORDER_RADIUS,
      overflow: 'hidden',
    },
  ];

  /* Disabled tint (DISABLED_CONTAINER_OPACITY) is rendered as a childless overlay so its
     alpha can be applied via the `opacity` style without leaking onto the label
     and input. The View accepts `PlatformColor` directly. */
  const disabledBackgroundStyles: StyleProp<ViewStyle> | undefined = isDisabled
    ? [
        filledStyles.disabledBackground,
        {
          backgroundColor: onSurface,
        },
      ]
    : undefined;

  const outlineStyles: StyleProp<ViewStyle> = [
    filledStyles.outline,
    {
      height: INACTIVE_INDICATOR_SIZE,
      backgroundColor: outlineColor,
    },
    isDisabled && styles.disabled,
  ];

  const animatedActiveOutlineStyles: StyleProp<
    AnimatedStyle<StyleProp<ViewStyle>>
  > = [
    filledStyles.outline,
    {
      height: ACTIVE_INDICATOR_SIZE,
      backgroundColor: activeOutlineColor,
    },
    isDisabled && styles.disabled,
    animatedActiveOutlineStyle,
  ];

  const inputStyles: StyleProp<TextStyle> = [
    styles.input,
    {
      flex: 1,
      color: onSurface,
      fontSize: INPUT_FONT_SIZE,
      textAlign: hasSuffix === shared.isRTL ? 'left' : 'right',
      writingDirection: shared.isRTL ? 'rtl' : 'ltr',
    },
    textInputProps.multiline && {
      height: 'auto',
      paddingTop: FILLED_MULTILINE_PADDING_TOP,
    },
    //@ts-expect-error - RN’s defs are narrower than CSS and RNW does not ship TS extensions that fix that
    Platform.OS === 'web' && {
      outlineStyle: 'none' as const,
    },
    isDisabled && styles.disabled,
    inputStyleOverride,
  ];

  return {
    input,
    isDisabled,
    hasError,
    hasSuffix,
    animatedLabelWrapperStyles,
    containerStyles,
    fieldStyles,
    disabledBackgroundStyles,
    outlineStyles,
    animatedActiveOutlineStyles,
    inputStyles,
    ...shared,
  };
};

export const getOutlinedTextFieldData = (
  api: TextFieldSharedApi,
  props: TextFieldProps
): OutlinedTextFieldHookData => {
  const { style: inputStyleOverride, ...textInputProps } = props;

  const {
    input,
    theme,
    isFocused,
    isDisabled,
    hasAccessory,
    hasError,
    hasSuffix,
    animatedLabelWrapperStyle,
  } = api;

  /**
   * Theme tokens
   */

  const {
    colors: { background: labelBackgroundColor, onSurface },
  } = theme;

  const outlineColor = getOutlineColor({
    theme,
    isDisabled,
    isFocused,
    hasError,
  });

  /**
   * Shared styles
   */

  const shared = getSharedTextFieldStyleData(api);

  /**
   * Variant-specific styles
   */

  const containerStyles: StyleProp<ViewStyle> = [
    outlinedStyles.container,
    isDisabled && styles.disabled,
  ];

  const fieldStyles: StyleProp<ViewStyle> = [
    styles.field,
    {
      borderRadius: TEXT_FIELD_BORDER_RADIUS,
    },
    textInputProps.multiline && { alignItems: 'flex-start' },
  ];

  /* The outline is a childless absolutely-positioned View, so applying
     `opacity` here is safe and lets us pass `outlineColor` through unchanged
     (including PlatformColor values on Android). */
  const outlineStyles: StyleProp<ViewStyle> = [
    outlinedStyles.outline,
    {
      borderWidth: isFocused ? 2 : 1,
      borderColor: outlineColor,
    },
    isDisabled && { opacity: OUTLINED_DISABLED_OUTLINE_OPACITY },
  ];

  const animatedLabelWrapperStyles: StyleProp<
    AnimatedStyle<StyleProp<ViewStyle>>
  > = [
    outlinedStyles.labelWrapper,
    {
      left: hasAccessory
        ? OUTLINED_LABEL_START_OFFSET_WITH_ACCESSORY
        : LABEL_START_OFFSET_WITHOUT_ACCESSORY,
      backgroundColor: labelBackgroundColor,
    },
    animatedLabelWrapperStyle,
  ];

  const inputStyles: StyleProp<TextStyle> = [
    styles.input,
    {
      flex: 1,
      color: onSurface,
      fontSize: INPUT_FONT_SIZE,
      textAlign: hasSuffix === shared.isRTL ? 'left' : 'right',
      writingDirection: shared.isRTL ? 'rtl' : 'ltr',
    },
    textInputProps.multiline && {
      height: 'auto',
      textAlignVertical: 'top',
      paddingTop: OUTLINED_MULTILINE_PADDING_TOP,
    },
    //@ts-expect-error - RN’s defs are narrower than CSS and RNW does not ship TS extensions that fix that
    Platform.OS === 'web' && {
      outlineStyle: 'none' as const,
    },
    isDisabled && styles.disabled,
    inputStyleOverride,
  ];

  return {
    input,
    isDisabled,
    hasError,
    hasSuffix,
    animatedLabelWrapperStyles,
    containerStyles,
    fieldStyles,
    disabledBackgroundStyles: undefined,
    outlineStyles,
    inputStyles,
    ...shared,
  };
};
