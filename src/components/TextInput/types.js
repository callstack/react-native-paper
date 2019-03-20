// @flow

import * as React from 'react';
import type { Theme } from '../../types';
import { TextInput as NativeTextInput, Animated } from 'react-native';

export type RenderProps = {
  ref: any => void,
  onChangeText: ?(string) => void,
  placeholder: ?string,
  placeholderTextColor: ?string,
  editable: ?boolean,
  selectionColor: ?string,
  onFocus: ?() => mixed,
  onBlur: ?() => mixed,
  underlineColorAndroid: ?string,
  style: any,
  multiline: ?boolean,
  numberOfLines: ?number,
  value: ?string,
  forwardRef: React.forwardRef,
};

export type Props = {|
  ...React.ElementConfig<typeof NativeTextInput>,
  /**
   * If true, user won't be able to interact with the component.
   */
  disabled?: boolean,
  /**
   * The text to use for the floating label.
   */
  label?: string,
  /**
   * Placeholder for the input.
   */
  placeholder?: string,
  /**
   * Whether to style the TextInput with error style.
   */
  error?: boolean,
  /**
   * Callback that is called when the text input's text changes. Changed text is passed as an argument to the callback handler.
   */
  onChangeText?: Function,
  /**
   * Selection color of the input
   */
  selectionColor?: string,
  /**
   * Underline color of the input.
   */
  underlineColor?: string,
  /**
   * Whether the input can have multiple lines.
   */
  multiline?: boolean,
  /**
   * The number of lines to show in the input (Android only).
   */
  numberOfLines?: number,
  /**
   * Callback that is called when the text input is focused.
   */
  onFocus?: () => mixed,
  /**
   * Callback that is called when the text input is blurred.
   */
  onBlur?: () => mixed,
  /**
   *
   * Callback to render a custom input component such as `react-native-text-input-mask`
   * instead of the default `TextInput` component from `react-native`.
   *
   * Example:
   * ```js
   * <TextInput
   *   label="Phone number"
   *   render={props =>
   *     <TextInputMask
   *       {...props}
   *       mask="+[00] [000] [000] [000]"
   *     />
   *   }
   * />
   * ```
   */
  render: (props: RenderProps) => React.Node,
  /**
   * Value of the text input.
   */
  value?: string,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
|};

export type State = {
  labeled: Animated.Value,
  error: Animated.Value,
  focused: boolean,
  placeholder: ?string,
  value: ?string,
  labelLayout: {
    measured: boolean,
    width: number,
  },
};
