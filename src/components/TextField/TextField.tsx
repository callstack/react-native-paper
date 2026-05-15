import React, { ComponentType } from 'react';
import {
  BlurEvent,
  ColorValue,
  FocusEvent,
  Pressable,
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import Animated, { AnimatedStyle } from 'react-native-reanimated';

import { useTextField } from './hooks';
import { styles } from './styles';
import TextFieldErrorIcon from './TextFieldErrorIcon';
import type { InternalTheme, ThemeProp } from '../../types';

export type TextFieldVariant = 'filled' | 'outlined';

export type TextFieldAccessoryProps = {
  style: StyleProp<ViewStyle>;
  multiline: boolean;
  disabled: boolean;
  error: boolean;
};

export type TextFieldSharedApi = {
  input: React.RefObject<TextInput | null>;
  theme: InternalTheme;
  isFocused: boolean;
  disabled: boolean;
  hasAccessory: boolean;
  hasError: boolean;
  hasSuffix: boolean;
  animatedLabelWrapperStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  animatedLabelTextStyle: StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
  animatedActiveOutlineStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
};

export type SharedTextFieldStyleData = {
  isRTL: boolean;
  animatedLabelTextStyles: StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
  supportingTextStyles: StyleProp<TextStyle>;
  counterStyles: StyleProp<TextStyle>;
  prefixStyles: StyleProp<TextStyle>;
  suffixStyles: StyleProp<TextStyle>;
  leadingAccessoryStyles: StyleProp<ViewStyle>;
  trailingAccessoryStyles: StyleProp<ViewStyle>;
};

export type FilledTextFieldHookData = SharedTextFieldStyleData & {
  input: React.RefObject<TextInput | null>;
  disabled: boolean;
  hasError: boolean;
  hasSuffix: boolean;
  animatedLabelWrapperStyles: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  containerStyles: StyleProp<ViewStyle>;
  fieldStyles: StyleProp<ViewStyle>;
  disabledBackgroundStyles: StyleProp<ViewStyle> | undefined;
  outlineStyles: StyleProp<ViewStyle>;
  animatedActiveOutlineStyles: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  inputStyles: StyleProp<TextStyle>;
};

export type OutlinedTextFieldHookData = SharedTextFieldStyleData & {
  input: React.RefObject<TextInput | null>;
  disabled: boolean;
  hasError: boolean;
  hasSuffix: boolean;
  animatedLabelWrapperStyles: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  containerStyles: StyleProp<ViewStyle>;
  fieldStyles: StyleProp<ViewStyle>;
  disabledBackgroundStyles: undefined;
  outlineStyles: StyleProp<ViewStyle>;
  inputStyles: StyleProp<TextStyle>;
};

export type TextFieldHookReturn = SharedTextFieldStyleData & {
  input: React.RefObject<TextInput | null>;
  disabled: boolean;
  hasPrefix: boolean;
  hasCounter: boolean;
  hasSuffix: boolean;
  hasError: boolean;
  placeholderTextColor: ColorValue;
  selectionColor: ColorValue;
  cursorColor: ColorValue;
  animatedActiveOutlineStyles:
    | StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>
    | undefined;
  animatedContainerStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  animatedLabelWrapperStyles: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  containerStyles: StyleProp<ViewStyle>;
  fieldStyles: StyleProp<ViewStyle>;
  disabledBackgroundStyles: StyleProp<ViewStyle> | undefined;
  outlineStyles: StyleProp<ViewStyle>;
  inputStyles: StyleProp<TextStyle>;
  placeholder: string | undefined;
  counterText: string;
  LeadingAccessory: ComponentType<TextFieldAccessoryProps> | undefined;
  TrailingAccessory: ComponentType<TextFieldAccessoryProps> | undefined;
  onFocusHandler: (e: FocusEvent) => void;
  onBlurHandler: (e: BlurEvent) => void;
  focusInput: () => void;
};

export type TextFieldProps = TextInputProps & {
  /**
   * Ref forwarded to the underlying TextInput.
   */
  ref?: React.Ref<TextInput>;
  /**
   * - `filled` text fields are often used in dialogs and short forms where their style draws more attention.
   * - `outlined` text fields are often used in long forms where their reduced emphasis helps simplify the layout.
   */
  variant?: TextFieldVariant;
  /**
   * When `true`, the field uses error styling and validation semantics (`aria-invalid`).
   */
  error?: boolean;
  /**
   * The label text to display above the input.
   */
  label?: string;
  /**
   * Pass any additional props directly to the label Text component.
   */
  labelProps?: TextProps;
  /**
   * Supporting text to display below the input (Material Design 3). When
   * `error` is `true`, this text is styled as an error message.
   */
  supportingText?: string;
  /**
   * Pass any additional props directly to the supporting text `Text` component.
   */
  supportingTextProps?: TextProps;
  /**
   * When `true`, displays a character counter below the input on the trailing
   * side, showing `currentLength/maxLength`. Requires `maxLength` to be set.
   */
  counter?: boolean;
  /**
   * Pass any additional props directly to the counter `Text` component.
   */
  counterProps?: TextProps;
  /**
   * A short text string displayed at the start of the input (e.g. `"$"`).
   */
  prefix?: string;
  /**
   * Pass any additional props directly to the prefix `Text` component.
   */
  prefixProps?: TextProps;
  /**
   * A short text string displayed at the end of the input (e.g. `"/100"`).
   */
  suffix?: string;
  /**
   * Pass any additional props directly to the suffix `Text` component.
   */
  suffixProps?: TextProps;
  /**
   * Style overrides for the pressable root element.
   */
  pressableStyle?: StyleProp<ViewStyle>;
  /**
   * Style overrides for the field container (the bordered row that includes
   * StartAccessory, input content, and EndAccessory).
   */
  fieldStyle?: StyleProp<ViewStyle>;
  /**
   * Style overrides for the input content wrapper (the area containing
   * the label and TextInput, excluding accessories).
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Style overrides for the indicator layer (the purely visual border or line
   * that shows state, not the interactive input).
   * - `filled` — applied to both the always-visible bottom edge and the
   *   animated bar that expands on focus.
   * - `outlined` — applied to the rounded border around the field for both states.
   */
  outlineStyle?: StyleProp<ViewStyle>;
  theme?: ThemeProp;
  /**
   * An optional component to render on the start side of the input (leading in LTR).
   * Can be a custom component or `TextField.Icon`.
   */
  StartAccessory?: ComponentType<TextFieldAccessoryProps>;
  /**
   * An optional component to render on the end side of the input (trailing in LTR).
   * Can be a custom component or `TextField.Icon`.
   */
  EndAccessory?: ComponentType<TextFieldAccessoryProps>;
};

/**
 * A text field lets users enter and edit text. It shows an optional floating label,
 * supports `filled` and `outlined` variants, optional supporting text (including
 * error state), and start/end accessories.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { TextField } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [text, setText] = React.useState('');
 *
 *   const SearchIcon = (props) => (
 *     <TextField.Icon {...props} icon="magnify" />
 *   );
 *
 *   const ClearAccessory = ({ style, disabled }) => (
 *     <Pressable
 *       style={style}
 *       disabled={disabled}
 *       onPress={() => setText('')}
 *       accessibilityRole="button"
 *       accessibilityLabel="Clear text"
 *     >
 *       <Icon source="close" size={24} />
 *     </Pressable>
 *   );
 *
 *   return (
 *     <TextField
 *       label="Search"
 *       value={text}
 *       onChangeText={setText}
 *       StartAccessory={SearchIcon}
 *       EndAccessory={ClearAccessory}
 *     />
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 *
 * @extends TextInput props https://reactnative.dev/docs/textinput#props
 */
function TextField(props: TextFieldProps) {
  /* eslint-disable @typescript-eslint/no-unused-vars -- peel TextField-only props before TextInput spread */
  const {
    ref,
    error,
    label,
    supportingText,
    supportingTextProps,
    labelProps,
    variant,
    pressableStyle: pressableStyleOverride,
    fieldStyle,
    containerStyle,
    outlineStyle,
    theme,
    StartAccessory,
    EndAccessory,
    prefix,
    prefixProps,
    suffix,
    suffixProps,
    counter,
    counterProps,
    ...textInputProps
  } = props;

  const {
    input,
    disabled,
    hasPrefix,
    hasSuffix,
    hasCounter,
    hasError,
    leadingAccessoryStyles,
    trailingAccessoryStyles,
    fieldStyles,
    disabledBackgroundStyles,
    outlineStyles,
    animatedActiveOutlineStyles,
    animatedLabelWrapperStyles,
    animatedLabelTextStyles,
    animatedContainerStyle,
    containerStyles,
    inputStyles,
    prefixStyles,
    suffixStyles,
    supportingTextStyles,
    counterStyles,
    placeholderTextColor,
    selectionColor,
    cursorColor,
    placeholder,
    counterText,
    LeadingAccessory,
    TrailingAccessory,
    focusInput,
    onFocusHandler,
    onBlurHandler,
  } = useTextField(props);

  return (
    <Pressable
      style={pressableStyleOverride}
      onPress={focusInput}
      accessible={false}
      role="none"
    >
      <View style={fieldStyles}>
        {/* Disabled tint overlay — filled variant only. A childless
          absolutely-positioned View whose translucent fill is applied via the
          `opacity` style, so it never affects label/input rendering and works
          with PlatformColor on Android. */}
        {!!disabledBackgroundStyles && (
          <View pointerEvents="none" style={disabledBackgroundStyles} />
        )}

        {/* Inactive indicator — always-visible 1px bottom border (filled) or
          full border (outlined); height and color reflect error/disabled state
          but do not change on focus */}
        <View pointerEvents="none" style={outlineStyles} />

        {/* Active indicator — filled variant only; 2px bar that expands from
          the center outward via scaleX (0 → 1) on focus and collapses on blur */}
        {!!animatedActiveOutlineStyles && (
          <Animated.View
            pointerEvents="none"
            style={animatedActiveOutlineStyles}
          />
        )}

        {!!label && (
          <Animated.View
            aria-hidden
            pointerEvents="none"
            style={animatedLabelWrapperStyles}
          >
            <Animated.Text {...labelProps} style={animatedLabelTextStyles}>
              {label}
            </Animated.Text>
          </Animated.View>
        )}

        {!!LeadingAccessory && (
          <LeadingAccessory
            style={leadingAccessoryStyles}
            error={hasError}
            disabled={disabled}
            multiline={!!textInputProps.multiline}
          />
        )}

        <Animated.View style={[containerStyles, animatedContainerStyle]}>
          {hasPrefix && (
            <Text aria-hidden {...prefixProps} style={prefixStyles}>
              {prefix}
            </Text>
          )}

          <TextInput
            aria-label={label}
            aria-disabled={disabled}
            aria-invalid={hasError}
            ref={input}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            selectionColor={selectionColor}
            cursorColor={cursorColor}
            placeholderTextColor={placeholderTextColor}
            {...textInputProps}
            placeholder={placeholder}
            style={inputStyles}
          />

          {hasSuffix && (
            <Text aria-hidden {...suffixProps} style={suffixStyles}>
              {suffix}
            </Text>
          )}
        </Animated.View>

        {TrailingAccessory ? (
          <TrailingAccessory
            style={trailingAccessoryStyles}
            error={hasError}
            disabled={disabled}
            multiline={!!textInputProps.multiline}
          />
        ) : hasError ? (
          <TextFieldErrorIcon style={trailingAccessoryStyles} theme={theme} />
        ) : null}
      </View>

      <View style={styles.addendum}>
        {!!supportingText && (
          <Text
            aria-live={hasError ? 'assertive' : 'polite'}
            {...supportingTextProps}
            style={supportingTextStyles}
          >
            {supportingText}
          </Text>
        )}

        {hasCounter && (
          <Text aria-live="polite" {...counterProps} style={counterStyles}>
            {counterText}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export default TextField;
