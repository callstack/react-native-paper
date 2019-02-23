/* @flow */

import * as React from 'react';
import { TextInput as NativeTextInput } from 'react-native';
import { polyfill } from 'react-lifecycles-compat';

import TextInputOutlined from './TextInputOutlined';
import TextInputFlat from './TextInputFlat';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';

type RenderProps = {
  ref: any => void,
  onChangeText: string => void,
  placeholder: ?string,
  placeholderTextColor: string,
  editable?: boolean,
  selectionColor: string,
  onFocus: () => mixed,
  onBlur: () => mixed,
  underlineColorAndroid: string,
  style: any,
  multiline?: boolean,
  numberOfLines?: number,
  value?: string,
};

type Props = React.ElementConfig<typeof NativeTextInput> & {|
  /**
   * Mode of the TextInput.
   * - `flat` - flat input with an underline.
   * - `outlined` - input with an outline.
   *
   * In `outlined` mode, the background color of the label is derived from `colors.background` in theme or the `backgroundColor` style.
   * This component render TextInputOutlined or TextInputFlat based on that props
   */
  mode?: 'flat' | 'outlined',
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

type State = {};

/**
 * A component to allow users to input text.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/textinput-flat.focused.png" />
 *     <figcaption>Flat (focused)</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="medium" src="screenshots/textinput-flat.disabled.png" />
 *     <figcaption>Flat (disabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="medium" src="screenshots/textinput-outlined.focused.png" />
 *     <figcaption>Outlined (focused)</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="medium" src="screenshots/textinput-outlined.disabled.png" />
 *     <figcaption>Outlined (disabled)</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { TextInput } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     text: ''
 *   };
 *
 *   render(){
 *     return (
 *       <TextInput
 *         label='Email'
 *         value={this.state.text}
 *         onChangeText={text => this.setState({ text })}
 *       />
 *     );
 *   }
 * }
 * ```
 *
 * @extends TextInput props https://facebook.github.io/react-native/docs/textinput.html#props
 */

class TextInput extends React.Component<Props, State> {
  static defaultProps = {
    mode: 'flat',
    disabled: false,
    error: false,
    multiline: false,
    editable: true,
    render: props => <NativeTextInput {...props} />,
  };

  render() {
    const { mode, ...rest } = this.props;

    return mode === 'outlined' ? (
      <TextInputOutlined {...rest} />
    ) : (
      <TextInputFlat {...rest} />
    );
  }
}

polyfill(TextInput);

export default withTheme(TextInput);
