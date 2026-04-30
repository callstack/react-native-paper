import React, { ComponentType } from 'react';
import {
  Animated,
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

import { useTextField } from './logic';
import type { InternalTheme, ThemeProp } from '../../types';

export type TextFieldVariant = 'filled' | 'outlined';

export interface TextFieldAccessoryProps {
  style: StyleProp<ViewStyle>;
  status?: 'error' | 'disabled';
  multiline: boolean;
  editable: boolean;
}

export type TextFieldSharedApi = {
  input: React.RefObject<TextInput | null>;
  theme: InternalTheme;
  isFocused: boolean;
  disabled: boolean;
  hasAccessory: boolean;
  hasError: boolean;
  hasSuffix: boolean;
  $animatedLabelWrapperStyle: Animated.WithAnimatedObject<ViewStyle>;
  $animatedLabelTextStyle: Animated.WithAnimatedObject<TextStyle>;
  $animatedActiveOutlineStyle?: Animated.WithAnimatedObject<ViewStyle>;
};

export interface TextFieldProps extends TextInputProps {
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
   * A style modifier for different input states.
   */
  status?: 'error' | 'disabled';
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
   * `status` is `error`, this text is styled as an error message.
   */
  supportingText?: string;
  /**
   * Pass any additional props directly to the supporting text `Text` component.
   */
  supportingTextProps?: TextProps;
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
}

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
 *   const ClearAccessory = ({ style, editable }) => (
 *     <Pressable
 *       style={style}
 *       disabled={!editable}
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
    status,
    label,
    supportingText,
    supportingTextProps,
    labelProps,
    variant,
    pressableStyle,
    fieldStyle,
    containerStyle,
    theme,
    StartAccessory,
    EndAccessory,
    prefix,
    prefixProps,
    suffix,
    suffixProps,
    ...textInputProps
  } = props;

  const {
    input,
    disabled,
    hasPrefix,
    hasSuffix,
    hasError,
    $pressableStyles,
    $leadingAccessoryStyles,
    $trailingAccessoryStyles,
    $fieldStyles,
    $disabledBackgroundStyles,
    $outlineStyles,
    $animatedActiveOutlineStyles,
    $animatedLabelWrapperStyles,
    $animatedLabelTextStyles,
    $containerStyles,
    $inputStyles,
    $prefixStyles,
    $suffixStyles,
    $supportingTextStyles,
    $placeholderTextColor,
    $selectionColor,
    $cursorColor,
    placeholder,
    LeadingAccessory,
    TrailingAccessory,
    focusInput,
    onFocusHandler,
    onBlurHandler,
  } = useTextField(props);

  return (
    <Pressable
      style={$pressableStyles}
      onPress={focusInput}
      accessible={false}
      role="none"
    >
      <View style={$fieldStyles}>
        {/* Disabled tint overlay — filled variant only. A childless
          absolutely-positioned View whose translucent fill is applied via the
          `opacity` style, so it never affects label/input rendering and works
          with PlatformColor on Android. */}
        {!!$disabledBackgroundStyles && (
          <View pointerEvents="none" style={$disabledBackgroundStyles} />
        )}

        {/* Inactive indicator — always-visible 1px bottom border (filled) or
          full border (outlined); height and color reflect error/disabled state
          but do not change on focus */}
        <View pointerEvents="none" style={$outlineStyles} />

        {/* Active indicator — filled variant only; 2px bar that expands from
          the center outward via scaleX (0 → 1) on focus and collapses on blur */}
        {!!$animatedActiveOutlineStyles && (
          <Animated.View
            pointerEvents="none"
            style={$animatedActiveOutlineStyles}
          />
        )}

        {!!label && (
          <Animated.View
            aria-hidden
            pointerEvents="none"
            style={$animatedLabelWrapperStyles}
          >
            <Animated.Text {...labelProps} style={$animatedLabelTextStyles}>
              {label}
            </Animated.Text>
          </Animated.View>
        )}

        {!!LeadingAccessory && (
          <LeadingAccessory
            style={$leadingAccessoryStyles}
            status={status}
            editable={!disabled}
            multiline={!!textInputProps.multiline}
          />
        )}

        <View style={$containerStyles}>
          {hasPrefix && (
            <Text aria-hidden {...prefixProps} style={$prefixStyles}>
              {prefix}
            </Text>
          )}

          <TextInput
            aria-label={label}
            aria-disabled={disabled}
            aria-invalid={hasError}
            ref={input}
            editable={!disabled}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            selectionColor={$selectionColor}
            cursorColor={$cursorColor}
            {...textInputProps}
            placeholder={placeholder}
            placeholderTextColor={$placeholderTextColor}
            style={$inputStyles}
          />

          {hasSuffix && (
            <Text aria-hidden {...suffixProps} style={$suffixStyles}>
              {suffix}
            </Text>
          )}
        </View>

        {!!TrailingAccessory && (
          <TrailingAccessory
            style={$trailingAccessoryStyles}
            status={status}
            editable={!disabled}
            multiline={!!textInputProps.multiline}
          />
        )}
      </View>

      {!!supportingText && (
        <Text
          aria-live={hasError ? 'assertive' : 'polite'}
          {...supportingTextProps}
          style={$supportingTextStyles}
        >
          {supportingText}
        </Text>
      )}
    </Pressable>
  );
}

export default TextField;
