import React from 'react';
import {
  Platform,
  Pressable,
  Text,
  TextInput as NativeTextInput,
  View,
} from 'react-native';
import type { TextInputProps as NativeTextInputProps } from 'react-native';
import type {
  AccessibilityProps,
  BlurEvent,
  ColorValue,
  FocusEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import Animated from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';

import { useTextInput } from './hooks';
import { styles } from './styles';
import TextInputErrorIcon from './TextInputErrorIcon';
import type { TextInputAccessoryProps } from './TextInputIcon';
import type { InternalTheme, ThemeProp } from '../../theme/types';

export type TextInputAnimationState = {
  animatedLabelWrapperStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  animatedLabelTextStyle: StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
  animatedActiveOutlineStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
};

export type TextInputAnimationHandlers = {
  runFocusAnimation: (hasText: boolean) => void;
  runBlurAnimation: (hasText: boolean) => void;
  syncFloatToValue: (hasText: boolean) => void;
};

export type TextInputFlags = {
  isRTL: boolean;
  isDisabled: boolean;
  isEditable: boolean | undefined;
  hasError: boolean;
  hasCounter: boolean;
  hasAccessory: boolean;
  isFloating: boolean;
  hasPrefix: boolean;
  hasSuffix: boolean;
};

export type TextInputColors = {
  selectionColor: ColorValue;
  cursorColor: ColorValue;
  placeholderTextColor: ColorValue;
};

export type GetAccessibilityDataReturn = {
  input: AccessibilityProps & {
    'aria-invalid'?: TextInputProps['aria-invalid'];
    'aria-describedby'?: string;
  };
  label: { nativeID: string };
  supportingText: AccessibilityProps & { nativeID: string };
  counter: AccessibilityProps & { nativeID: string };
};

export type GetAccessibilityDataProps = {
  data: TextInputProps;
  id: string;
  inputLength: number;
  hasError: boolean;
  hasCounter: boolean;
  isDisabled: boolean;
};

export type TextInputVariant = 'filled' | 'outlined';

export type TextInputSharedApi = {
  input: React.RefObject<NativeTextInput | null>;
  theme: InternalTheme;
  isFocused: boolean;
  isHovered?: boolean;
  isRTL: boolean;
  isDisabled: boolean;
  hasAccessory: boolean;
  hasError: boolean;
  hasSuffix: boolean;
  animatedLabelWrapperStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  animatedLabelTextStyle: StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
  animatedActiveOutlineStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
};

export type SharedTextInputStyleData = {
  isRTL: boolean;
  animatedLabelTextStyles: StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
  supportingTextStyles: StyleProp<TextStyle>;
  counterStyles: StyleProp<TextStyle>;
  prefixStyles: StyleProp<TextStyle>;
  suffixStyles: StyleProp<TextStyle>;
  leadingAccessoryStyles: StyleProp<ViewStyle>;
  trailingAccessoryStyles: StyleProp<ViewStyle>;
};

export type FilledTextInputHookData = SharedTextInputStyleData & {
  input: React.RefObject<NativeTextInput | null>;
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

export type OutlinedTextInputHookData = SharedTextInputStyleData & {
  input: React.RefObject<NativeTextInput | null>;
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

export type TextInputLayoutData =
  | FilledTextInputHookData
  | OutlinedTextInputHookData;

export type TextInputLayoutState = Omit<
  TextInputLayoutData,
  'input' | 'isDisabled' | 'hasError' | 'hasSuffix'
>;

export type TextInputHookReturn = SharedTextInputStyleData & {
  input: React.RefObject<NativeTextInput | null>;
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
    | ((props: TextInputAccessoryProps) => React.ReactNode)
    | undefined;
  renderTrailingAccessory:
    | ((props: TextInputAccessoryProps) => React.ReactNode)
    | undefined;
  onChangeText: (text: string) => void;
  onFocus: (e: FocusEvent) => void;
  onBlur: (e: BlurEvent) => void;
  focusInput: () => void;
  onHoverIn: () => void;
  onHoverOut: () => void;
};

export type TextInputRenderProps = React.ComponentPropsWithoutRef<
  typeof NativeTextInput
> & {
  ref?: React.RefObject<NativeTextInput | null>;
  'aria-describedby'?: string;
  'aria-invalid'?: TextInputProps['aria-invalid'];
};

export type TextInputHandles = Pick<
  NativeTextInput,
  'focus' | 'clear' | 'blur' | 'isFocused' | 'setNativeProps' | 'setSelection'
>;

export type TextInputProps = NativeTextInputProps & {
  /**
   * Overrides the field's invalid state on web, including grammar or spelling
   * errors. Defaults to the error state or an exceeded character counter.
   */
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
  /**
   * Space-separated IDs of additional descriptions on web. The IDs of rendered
   * supporting text and the character counter are appended automatically.
   * On Android and iOS, provide external descriptions with `accessibilityHint`.
   */
  'aria-describedby'?: string;
  /**
   * Imperative handle exposing a subset of native `TextInput` methods
   * with side-effect handling (e.g. `clear()` syncs internal state and animations).
   */
  ref?: React.Ref<TextInputHandles>;
  /**
   * Determines the visual style of the text input.
   *
   * - `filled` — filled background with an animated underline; higher visual emphasis.
   * - `outlined` — stroke outline only; lower visual emphasis.
   */
  variant?: TextInputVariant;
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
   * Associated with the field through `aria-describedby` on web and included
   * in the native accessibility hint. When `error` is true, it is announced
   * as an alert. It does not become part of the field's accessible name.
   */
  supportingText?: string;
  /**
   * When `true`, displays a character counter below the input on the trailing
   * side, showing `currentLength/maxLength`. Requires `maxLength` to be set.
   * Associated with the field alongside supporting text.
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
   * Can be a custom component or `TextInput.Icon`.
   */
  startAccessory?: (props: TextInputAccessoryProps) => React.ReactNode;
  /**
   * An optional component to render on the end side of the input (trailing in LTR).
   * Can be a custom component or `TextInput.Icon`.
   */
  endAccessory?: (props: TextInputAccessoryProps) => React.ReactNode;
  /**
   * Callback to render a custom input component in place of the native `TextInput`.
   * Receives all props that would be passed to `TextInput`, allowing integration
   * with third-party inputs such as masked inputs.
   */
  render?: (props: TextInputRenderProps) => React.ReactNode;
};

const defaultRenderer = (props: TextInputRenderProps) => (
  <NativeTextInput {...props} />
);

/**
 * A text input lets users enter and edit text. It shows an optional floating label,
 * supports `filled` and `outlined` variants, optional supporting text (including
 * error state), and start/end accessories.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { TextInput } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [text, setText] = React.useState('');
 *
 *   const searchAccessory = (accessoryProps) => (
 *     <TextInput.Icon {...accessoryProps} icon="magnify" />
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
 *     <TextInput
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
function TextInput({
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
  render = defaultRenderer,
  ...rest
}: TextInputProps) {
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
    onChangeText,
    onFocus,
    onBlur,
    onHoverIn,
    onHoverOut,
  } = useTextInput({
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
    ...rest,
  });

  return (
    <Pressable
      onPress={focusInput}
      onHoverIn={Platform.OS === 'web' ? undefined : onHoverIn}
      onHoverOut={Platform.OS === 'web' ? undefined : onHoverOut}
      accessible={false}
      role="none"
    >
      <View
        style={fieldStyles}
        // Nested web Pressables contain hover events; track the whole field.
        onPointerEnter={
          Platform.OS === 'web'
            ? (event) => {
                if (event.nativeEvent.pointerType !== 'touch') onHoverIn();
              }
            : undefined
        }
        onPointerLeave={Platform.OS === 'web' ? onHoverOut : undefined}
      >
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
            <Animated.Text
              {...accessibilityProps.label}
              style={animatedLabelTextStyles}
            >
              {label}
            </Animated.Text>
          </Animated.View>
        )}

        {renderLeadingAccessory
          ? renderLeadingAccessory({
              style: leadingAccessoryStyles,
              error: hasError,
              disabled: isDisabled,
              multiline: !!rest.multiline,
            })
          : null}

        {/* Keep the field visible to native accessibility even before focus. */}
        <View style={containerStyles}>
          {hasPrefix && <Text style={prefixStyles}>{prefix}</Text>}

          {render({
            ref: input,
            selectionColor,
            cursorColor,
            placeholderTextColor,
            ...rest,
            ...accessibilityProps.input,
            editable: isEditable,
            readOnly: disabled ? true : rest.readOnly,
            placeholder,
            style: inputStyles,
            onChangeText,
            onFocus,
            onBlur,
          })}

          {hasSuffix && <Text style={suffixStyles}>{suffix}</Text>}
        </View>

        {renderTrailingAccessory ? (
          renderTrailingAccessory({
            style: trailingAccessoryStyles,
            error: hasError,
            disabled: isDisabled,
            multiline: !!rest.multiline,
          })
        ) : hasError ? (
          <TextInputErrorIcon style={trailingAccessoryStyles} theme={theme} />
        ) : null}
      </View>

      <View style={styles.addendum}>
        {!!supportingText && (
          <Text
            key={hasError ? 'error' : 'supporting'}
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

export default TextInput;
