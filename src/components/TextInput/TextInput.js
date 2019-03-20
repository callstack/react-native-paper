/* @flow */

import * as React from 'react';
import { TextInput as NativeTextInput } from 'react-native';
import { polyfill } from 'react-lifecycles-compat';

import TextInputOutlined from './TextInputOutlined';
import TextInputFlat from './TextInputFlat';
import { withTheme } from '../../core/theming';
import type { Props, RenderProps } from './types';

type TextInputProps = {|
  ...Props,
  /**
   * Mode of the TextInput.
   * - `flat` - flat input with an underline.
   * - `outlined` - input with an outline.
   *
   * In `outlined` mode, the background color of the label is derived from `colors.background` in theme or the `backgroundColor` style.
   * This component render TextInputOutlined or TextInputFlat based on that props
   */
  mode?: 'flat' | 'outlined',
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

class TextInput extends React.Component<TextInputProps, State> {
  static defaultProps = {
    mode: 'flat',
    disabled: false,
    error: false,
    multiline: false,
    editable: true,
    render: (props: RenderProps) => <NativeTextInput {...props} />,
  };

  render() {
    const {forwardRef,mode, ...rest } = this.props;

    return mode === 'outlined' ? (
      <TextInputOutlined ref={forwardRef} {...rest} />
    ) : (
      <TextInputFlat ref={forwardRef} {...rest} />
    );
  }
}

polyfill(TextInput);

TextInput = withTheme(TextInput);
export default React.forwardRef((props, ref) => {
  return <TextInput {...props} forwardRef={ref} />;
});
