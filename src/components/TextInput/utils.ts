import { Platform } from 'react-native';
import type { ColorValue, StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { AnimatedStyle } from 'react-native-reanimated';

import {
  ACTIVE_INDICATOR_SIZE,
  FILLED_ACTIVE_LABEL_TOP_POSITION,
  FILLED_INACTIVE_LABEL_TOP_POSITION,
  FILLED_LABEL_START_OFFSET_WITH_ACCESSORY,
  FILLED_MULTILINE_PADDING_TOP,
  INACTIVE_INDICATOR_SIZE,
  INPUT_FONT_SIZE,
  LABEL_START_OFFSET_WITHOUT_ACCESSORY,
  OUTLINED_ACTIVE_LABEL_TOP_POSITION,
  OUTLINED_DISABLED_OUTLINE_OPACITY,
  OUTLINED_INACTIVE_LABEL_TOP_POSITION,
  OUTLINED_LABEL_START_OFFSET_WITH_ACCESSORY,
  OUTLINED_LABEL_TRANSLATE_DISTANCE_WITHOUT_ACCESSORY,
  OUTLINED_LABEL_TRANSLATE_DISTANCE_WITH_ACCESSORY,
  OUTLINED_MULTILINE_PADDING_TOP,
  PREFIX_END_PADDING,
  SUFFIX_START_PADDING,
  TEXT_INPUT_BORDER_RADIUS,
  FILLED_PADDING_BOTTOM,
} from './constants';
import { filledStyles, outlinedStyles, styles } from './styles';
import type {
  FilledTextInputHookData,
  OutlinedTextInputHookData,
  TextInputProps,
  TextInputSharedApi,
  TextInputVariant,
  SharedTextInputStyleData,
  GetAccessibilityDataProps,
  GetAccessibilityDataReturn,
} from './TextInput';
import type { InternalTheme } from '../../theme/types';

export const getTextInputAnimationLayout = ({
  variant,
  hasAccessory,
  isRTL,
}: {
  variant: TextInputVariant;
  hasAccessory: boolean;
  isRTL: boolean;
}) => {
  const activeTop =
    variant === 'filled'
      ? FILLED_ACTIVE_LABEL_TOP_POSITION
      : OUTLINED_ACTIVE_LABEL_TOP_POSITION;

  const inactiveTop =
    variant === 'filled'
      ? FILLED_INACTIVE_LABEL_TOP_POSITION
      : OUTLINED_INACTIVE_LABEL_TOP_POSITION;

  const distance = hasAccessory
    ? OUTLINED_LABEL_TRANSLATE_DISTANCE_WITH_ACCESSORY
    : OUTLINED_LABEL_TRANSLATE_DISTANCE_WITHOUT_ACCESSORY;

  const translateXEnd = (isRTL ? 1 : -1) * distance;

  return { activeTop, inactiveTop, translateXEnd };
};

export const getAccentColors = ({
  theme,
  hasError,
}: {
  theme: InternalTheme;
  hasError: boolean;
}): { selectionColor: ColorValue; cursorColor: ColorValue } => {
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
}): ColorValue => {
  const {
    colors: { error, primary, onSurface, onSurfaceVariant },
  } = theme;

  if (isDisabled) {
    return onSurface;
  }
  if (hasError) {
    return error;
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
}): ColorValue => {
  const {
    colors: { error, onSurface, onSurfaceVariant },
  } = theme;

  if (isDisabled) {
    return onSurface;
  }
  if (hasError) {
    return error;
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
}): ColorValue | undefined => {
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
  iconColor?: ColorValue;
  hasError: boolean;
  isDisabled: boolean;
}): ColorValue => {
  // Disabled first, as in IconButton: a TextInput.Icon with a handler renders a
  // disabled IconButton, so any other order splits the icons of one field
  if (isDisabled) return theme.colors.onSurface;
  if (iconColor) return iconColor;
  if (hasError) return theme.colors.error;
  return theme.colors.onSurfaceVariant;
};

/**
 * Resolve the filled indicator or outlined border color. Disabled opacity is
 * applied by the outline View so native PlatformColor values stay intact.
 */
export const getOutlineColor = ({
  theme,
  hasError,
  isFocused,
  isDisabled,
  isHovered = false,
  variant = 'outlined',
}: {
  theme: InternalTheme;
  isFocused: boolean;
  hasError: boolean;
  isDisabled: boolean;
  isHovered?: boolean;
  variant?: TextInputVariant;
}): ColorValue => {
  const { colors } = theme;

  if (isDisabled) return colors.onSurface;
  if (hasError) {
    return isHovered && !isFocused ? colors.onErrorContainer : colors.error;
  }
  if (isFocused) return colors.primary;
  if (isHovered) return colors.onSurface;
  return variant === 'filled' ? colors.onSurfaceVariant : colors.outline;
};

/**
 * Computes the style arrays that are identical across the filled and outlined
 * variants. Each variant logic function calls this and then only computes its
 * own variant-specific styles on top.
 *
 * Returns `isRTL` as well so callers can use it when building `inputStyles`,
 * which is variant-specific (filled adds `MULTILINE_PADDING_TOP`).
 */
export const getSharedTextInputStyleData = (
  api: TextInputSharedApi
): SharedTextInputStyleData => {
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

export const getFilledTextInputData = (
  api: TextInputSharedApi,
  props: TextInputProps
): FilledTextInputHookData => {
  const { style: inputStyleOverride, ...textInputProps } = props;

  const {
    input,
    theme,
    hasSuffix,
    isDisabled,
    hasAccessory,
    hasError,
    isHovered,
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
    variant: 'filled',
    isHovered,
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

  const shared = getSharedTextInputStyleData(api);

  /**
   * Variant-specific styles
   */

  const filledLabelOffset = hasAccessory
    ? FILLED_LABEL_START_OFFSET_WITH_ACCESSORY
    : LABEL_START_OFFSET_WITHOUT_ACCESSORY;

  const animatedLabelWrapperStyles: StyleProp<
    AnimatedStyle<StyleProp<ViewStyle>>
  > = [
    filledStyles.labelWrapper,
    Platform.OS === 'web' && shared.isRTL
      ? { right: filledLabelOffset }
      : { start: filledLabelOffset },
    animatedLabelWrapperStyle,
  ];

  const containerStyles = filledStyles.container;

  const fieldStyles: StyleProp<ViewStyle> = [
    styles.field,
    {
      paddingBottom: FILLED_PADDING_BOTTOM,
      backgroundColor: fieldBackgroundColor,
      borderTopStartRadius: TEXT_INPUT_BORDER_RADIUS,
      borderTopEndRadius: TEXT_INPUT_BORDER_RADIUS,
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

export const getOutlinedTextInputData = (
  api: TextInputSharedApi,
  props: TextInputProps
): OutlinedTextInputHookData => {
  const { style: inputStyleOverride, ...textInputProps } = props;

  const {
    input,
    theme,
    isFocused,
    isDisabled,
    hasAccessory,
    hasError,
    hasSuffix,
    isHovered,
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
    isHovered,
  });

  /**
   * Shared styles
   */

  const shared = getSharedTextInputStyleData(api);

  /**
   * Variant-specific styles
   */

  const containerStyles = outlinedStyles.container;

  const fieldStyles: StyleProp<ViewStyle> = [
    styles.field,
    {
      borderRadius: TEXT_INPUT_BORDER_RADIUS,
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

  const outlinedLabelOffset = hasAccessory
    ? OUTLINED_LABEL_START_OFFSET_WITH_ACCESSORY
    : LABEL_START_OFFSET_WITHOUT_ACCESSORY;

  const animatedLabelWrapperStyles: StyleProp<
    AnimatedStyle<StyleProp<ViewStyle>>
  > = [
    outlinedStyles.labelWrapper,
    {
      ...(Platform.OS === 'web' && shared.isRTL
        ? { right: outlinedLabelOffset }
        : { start: outlinedLabelOffset }),
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

export const getAccessibilityData = ({
  data,
  id,
  hasError,
  hasCounter,
  hasPrefix,
  hasSuffix,
  isDisabled,
  isPlaceholderShown,
  inputLength,
}: GetAccessibilityDataProps): GetAccessibilityDataReturn => {
  const { label, supportingText, maxLength, prefix, suffix, ...props } = data;
  const isCounterExceeded =
    hasCounter && maxLength != null && inputLength > maxLength;
  const counterAccessibilityLabel = hasCounter
    ? isCounterExceeded
      ? `Character limit exceeded ${inputLength} of ${maxLength}`
      : `Characters entered ${inputLength} of ${maxLength}`
    : undefined;

  // A labelled field blanks its placeholder until the label floats away, so
  // assistive technology moving to the empty field would not hear it.
  const placeholderDescription =
    label && inputLength === 0 ? props.placeholder : undefined;

  // Generated IDs only link the label and descriptions on web.
  const labelId = Platform.OS === 'web' ? `${id}-label` : undefined;
  // The input exposes its own placeholder once it shows it, so only describe
  // the field with it before then. Otherwise it is read twice.
  const placeholderId =
    Platform.OS === 'web' && placeholderDescription && !isPlaceholderShown
      ? `${id}-placeholder`
      : undefined;
  const prefixId =
    Platform.OS === 'web' && hasPrefix ? `${id}-prefix` : undefined;
  const suffixId =
    Platform.OS === 'web' && hasSuffix ? `${id}-suffix` : undefined;
  const supportingTextId =
    Platform.OS === 'web' && supportingText
      ? `${id}-supporting-text`
      : undefined;
  const counterId =
    Platform.OS === 'web' && hasCounter ? `${id}-counter` : undefined;
  const describedBy =
    [
      props['aria-describedby'],
      placeholderId,
      prefixId,
      suffixId,
      supportingTextId,
      counterId,
    ]
      .filter(Boolean)
      .join(' ') || undefined;
  const explicitLabel = props['aria-label'] ?? props.accessibilityLabel;
  const labelledBy =
    props['aria-labelledby'] ??
    (label && explicitLabel == null && !props.accessibilityLabelledBy
      ? labelId
      : undefined);

  // React Native 0.88 does not implement described-by relationships on native.
  // Expose the same description as a hint without changing the field's name.
  const hint =
    Platform.OS === 'web'
      ? props.accessibilityHint
      : [
          props.accessibilityHint,
          placeholderDescription,
          prefix?.trim(),
          suffix?.trim(),
          supportingText,
          counterAccessibilityLabel,
        ]
          .filter(Boolean)
          .join(', ') || undefined;

  return {
    input: {
      'aria-label': explicitLabel ?? label ?? props.placeholder,
      'aria-labelledby': labelledBy,
      'aria-describedby': describedBy,
      'aria-disabled': isDisabled || (props['aria-disabled'] ?? false),
      'aria-invalid': props['aria-invalid'] ?? (hasError || isCounterExceeded),
      accessibilityHint: hint,
    },
    label: { nativeID: labelId },
    placeholder: { nativeID: placeholderId, 'aria-hidden': true },
    // The prefix and suffix describe the value, so they are read with the
    // field instead of as separate text next to it.
    prefix: { nativeID: prefixId, 'aria-hidden': true },
    suffix: { nativeID: suffixId, 'aria-hidden': true },
    // On native, the hint above already contains these texts. Hide their nodes
    // so they are not read twice or merged into the field wrapper's label.
    supportingText: {
      nativeID: supportingTextId,
      'aria-hidden': Platform.OS !== 'web',
      role:
        Platform.OS === 'web' && hasError && supportingText
          ? 'alert'
          : undefined,
    },
    counter: {
      nativeID: counterId,
      'aria-hidden': Platform.OS !== 'web',
      'aria-label': counterAccessibilityLabel,
      'aria-live': Platform.OS === 'web' ? 'polite' : undefined,
    },
  };
};
