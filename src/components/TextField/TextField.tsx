import React from 'react';
import {
  AccessibilityProps,
  BlurEvent,
  ColorValue,
  FocusEvent,
  Pressable,
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import Animated, { AnimatedStyle } from 'react-native-reanimated';

import { useTextField } from './hooks';
import { styles } from './styles';
import TextFieldErrorIcon from './TextFieldErrorIcon';
import type { InternalTheme, ThemeProp } from '../../types';

export type GetAccessibilityDataReturn = {
  input: AccessibilityProps;
  supportingText: AccessibilityProps;
  counter: AccessibilityProps;
};

export type GetAccessibilityDataProps = {
  data: TextFieldProps;
  hasError: boolean;
  hasCounter: boolean;
  isDisabled: boolean;
};

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
  isRTL: boolean;
  isDisabled: boolean;
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
  isDisabled: boolean;
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
  isDisabled: boolean;
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
  isDisabled: boolean;
  isEditable: boolean | undefined;
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
  accessibilityProps: GetAccessibilityDataReturn;
  renderLeadingAccessory:
    | ((props: TextFieldAccessoryProps) => React.ReactNode)
    | undefined;
  renderTrailingAccessory:
    | ((props: TextFieldAccessoryProps) => React.ReactNode)
    | undefined;
  onFocusHandler: (e: FocusEvent) => void;
  onBlurHandler: (e: BlurEvent) => void;
  focusInput: () => void;
};

export type TextFieldRenderProps = React.ComponentPropsWithRef<
  typeof TextInput
>;

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
   * When `true`, the field uses error styling and replaces the trailing accessory
   * with an error indicator when no `endAccessory` is provided.
   */
  error?: boolean;
  /**
   * The label text to display above the input.
   */
  label?: string;
  /**
   * Supporting text to display below the input (Material Design 3).
   */
  supportingText?: string;
  /**
   * When `true`, displays a character counter below the input on the trailing
   * side, showing `currentLength/maxLength`. Requires `maxLength` to be set.
   */
  counter?: boolean;
  /**
   * This is separate from `editable={false}`, which makes the text read-only while the
   * input can still be focused and text selected.
   */
  disabled?: boolean;
  /**
   * A short text string displayed at the start of the input (e.g. `"$"`).
   */
  prefix?: string;
  /**
   * A short text string displayed at the end of the input (e.g. `"/100"`).
   */
  suffix?: string;
  theme?: ThemeProp;
  /**
   * An optional component to render on the start side of the input (leading in LTR).
   * Can be a custom component or `TextField.Icon`.
   */
  startAccessory?: (props: TextFieldAccessoryProps) => React.ReactNode;
  /**
   * An optional component to render on the end side of the input (trailing in LTR).
   * Can be a custom component or `TextField.Icon`.
   */
  endAccessory?: (props: TextFieldAccessoryProps) => React.ReactNode;
  /**
   * Callback to render a custom input component in place of the native `TextInput`.
   * Receives all props that would be passed to `TextInput`, allowing integration
   * with third-party inputs such as masked inputs.
   */
  render?: (props: TextFieldRenderProps) => React.ReactNode;
};

const DefaultRenderer = (props: TextFieldRenderProps) => (
  <TextInput {...props} />
);

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
 *   const searchAccessory = (accessoryProps) => (
 *     <TextField.Icon {...accessoryProps} icon="magnify" />
 *   );
 *
 *   const clearAccessory = ({ style, disabled }) => (
 *     <Pressable
 *       style={style}
 *       disabled={disabled}
 *       onPress={() => setText('')}
 *       role="button"
 *       aria-label="Clear text"
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
 *       startAccessory={searchAccessory}
 *       endAccessory={clearAccessory}
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
    variant,
    theme,
    prefix,
    suffix,
    counter,
    disabled,
    startAccessory,
    endAccessory,
    render = DefaultRenderer,
    ...textInputProps
  } = props;

  const {
    input,
    isDisabled,
    isEditable,
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
    accessibilityProps,
    renderLeadingAccessory,
    renderTrailingAccessory,
    focusInput,
    onFocusHandler,
    onBlurHandler,
  } = useTextField(props);

  return (
    <Pressable onPress={focusInput} accessible={false} role="none">
      <View style={fieldStyles}>
        {/* Disabled tint overlay — filled variant only. A childless
          absolutely-positioned View whose translucent fill is applied via the
          `opacity` style, so it never affects label/input rendering and works
          with PlatformColor on Android. */}
        {!!disabledBackgroundStyles && (
          <View style={disabledBackgroundStyles} />
        )}

        {/* Inactive indicator — always-visible 1px bottom border (filled) or
          full border (outlined); height and color reflect error/disabled state
          but do not change on focus */}
        <View style={outlineStyles} />

        {/* Active indicator — filled variant only; 2px bar that expands from
          the center outward via scaleX (0 → 1) on focus and collapses on blur */}
        {!!animatedActiveOutlineStyles && (
          <Animated.View style={animatedActiveOutlineStyles} />
        )}

        {!!label && (
          <Animated.View aria-hidden style={animatedLabelWrapperStyles}>
            <Animated.Text style={animatedLabelTextStyles}>
              {label}
            </Animated.Text>
          </Animated.View>
        )}

        {renderLeadingAccessory
          ? renderLeadingAccessory({
              style: leadingAccessoryStyles,
              error: hasError,
              disabled: isDisabled,
              multiline: !!textInputProps.multiline,
            })
          : null}

        <Animated.View style={[containerStyles, animatedContainerStyle]}>
          {hasPrefix && <Text style={prefixStyles}>{prefix}</Text>}

          {render({
            ref: input,
            selectionColor,
            cursorColor,
            placeholderTextColor,
            ...accessibilityProps.input,
            onFocus: onFocusHandler,
            onBlur: onBlurHandler,
            ...textInputProps,
            editable: isEditable,
            placeholder,
            style: inputStyles,
          })}

          {hasSuffix && <Text style={suffixStyles}>{suffix}</Text>}
        </Animated.View>

        {renderTrailingAccessory ? (
          renderTrailingAccessory({
            style: trailingAccessoryStyles,
            error: hasError,
            disabled: isDisabled,
            multiline: !!textInputProps.multiline,
          })
        ) : hasError ? (
          <TextFieldErrorIcon style={trailingAccessoryStyles} theme={theme} />
        ) : null}
      </View>

      <View style={styles.addendum}>
        {!!supportingText && (
          <Text
            {...accessibilityProps.supportingText}
            style={supportingTextStyles}
          >
            {supportingText}
          </Text>
        )}

        {hasCounter && (
          <Text {...accessibilityProps.counter} style={counterStyles}>
            {counterText}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export default TextField;
