/* @flow */

import * as React from 'react';
import { Animated, TextInput as NativeTextInput, Platform } from 'react-native';
import { polyfill } from 'react-lifecycles-compat';

import TextInputOutlined from './TextInputOutlined';
import TextInputFlat from './TextInputFlat';
import { withTheme } from '../../core/theming';
import type { RenderProps, State } from './types';
import type { Theme } from '../../types';

const BLUR_ANIMATION_DURATION = 180;
const FOCUS_ANIMATION_DURATION = 150;

export type TextInputProps = {|
  ...React.ElementConfig<typeof NativeTextInput>,
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
  onFocus?: (args: any) => mixed,
  /**
   * Callback that is called when the text input is blurred.
   */
  onBlur?: (args: any) => mixed,
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

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      value:
        typeof nextProps.value !== 'undefined'
          ? nextProps.value
          : prevState.value,
    };
  }

  state = {
    labeled: new Animated.Value(this.props.value || this.props.error ? 0 : 1),
    error: new Animated.Value(this.props.error ? 1 : 0),
    focused: false,
    placeholder: this.props.error ? this.props.placeholder : '',
    value: this.props.value,
    labelLayout: {
      measured: false,
      width: 0,
    },
  };

  ref: ?NativeTextInput;

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.focused !== this.state.focused ||
      prevState.value !== this.state.value ||
      prevProps.error !== this.props.error
    ) {
      // The label should be minimized if the text input is focused, or has text
      // In minimized mode, the label moves up and becomes small
      if (this.state.value || this.state.focused || this.props.error) {
        this._minmizeLabel();
      } else {
        this._restoreLabel();
      }
    }

    if (
      prevState.focused !== this.state.focused ||
      prevProps.label !== this.props.label ||
      prevProps.error !== this.props.error
    ) {
      // Show placeholder text only if the input is focused, or has error, or there's no label
      // We don't show placeholder if there's a label because the label acts as placeholder
      // When focused, the label moves up, so we can show a placeholder
      if (this.state.focused || this.props.error || !this.props.label) {
        this._showPlaceholder();
      } else {
        this._hidePlaceholder();
      }
    }

    if (prevProps.error !== this.props.error) {
      // When the input has an error, we wiggle the label and apply error styles
      if (this.props.error) {
        this._showError();
      } else {
        this._hideError();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  _showPlaceholder = () => {
    clearTimeout(this._timer);

    // Set the placeholder in a delay to offset the label animation
    // If we show it immediately, they'll overlap and look ugly
    this._timer = setTimeout(
      () =>
        this.setState({
          placeholder: this.props.placeholder,
        }),
      50
    );
  };

  _hidePlaceholder = () =>
    this.setState({
      placeholder: '',
    });

  _timer: TimeoutID;
  _root: ?NativeTextInput;

  _showError = () => {
    Animated.timing(this.state.error, {
      toValue: 1,
      duration: FOCUS_ANIMATION_DURATION,
      // To prevent this - https://github.com/callstack/react-native-paper/issues/941
      useNativeDriver: Platform.select({
        ios: false,
        default: true,
      }),
    }).start(this._showPlaceholder);
  };

  _hideError = () => {
    Animated.timing(this.state.error, {
      toValue: 0,
      duration: BLUR_ANIMATION_DURATION,
      // To prevent this - https://github.com/callstack/react-native-paper/issues/941
      useNativeDriver: Platform.select({
        ios: false,
        default: true,
      }),
    }).start();
  };

  _restoreLabel = () =>
    Animated.timing(this.state.labeled, {
      toValue: 1,
      duration: FOCUS_ANIMATION_DURATION,
      // To prevent this - https://github.com/callstack/react-native-paper/issues/941
      useNativeDriver: Platform.select({
        ios: false,
        default: true,
      }),
    }).start();

  _minmizeLabel = () =>
    Animated.timing(this.state.labeled, {
      toValue: 0,
      duration: BLUR_ANIMATION_DURATION,
      // To prevent this - https://github.com/callstack/react-native-paper/issues/941
      useNativeDriver: Platform.select({
        ios: false,
        default: true,
      }),
    }).start();

  _handleFocus = (...args) => {
    if (this.props.disabled) {
      return;
    }

    this.setState({ focused: true });

    if (this.props.onFocus) {
      this.props.onFocus(...args);
    }
  };

  _handleBlur = (...args) => {
    if (this.props.disabled) {
      return;
    }

    this.setState({ focused: false });

    if (this.props.onBlur) {
      this.props.onBlur(...args);
    }
  };

  _handleChangeText = (value: string) => {
    if (!this.props.editable) {
      return;
    }

    this.setState({ value });
    this.props.onChangeText && this.props.onChangeText(value);
  };

  _onLayoutAnimatedText = e => {
    this.setState({
      labelLayout: {
        width: e.nativeEvent.layout.width,
        measured: true,
      },
    });
  };

  /**
   * @internal
   */
  setNativeProps(...args) {
    return this._root && this._root.setNativeProps(...args);
  }

  /**
   * Returns `true` if the input is currently focused, `false` otherwise.
   */
  isFocused() {
    return this._root && this._root.isFocused();
  }

  /**
   * Removes all text from the TextInput.
   */
  clear() {
    return this._root && this._root.clear();
  }

  /**
   * Focuses the input.
   */
  focus() {
    return this._root && this._root.focus();
  }

  /**
   * Removes focus from the input.
   */
  blur() {
    return this._root && this._root.blur();
  }

  render() {
    const { mode, ...rest } = this.props;

    return mode === 'outlined' ? (
      <TextInputOutlined
        {...rest}
        parentState={this.state}
        innerRef={ref => {
          this._root = ref;
        }}
        onFocus={this._handleFocus}
        onBlur={this._handleBlur}
        onChangeText={this._handleChangeText}
        onLayoutAnimatedText={this._onLayoutAnimatedText}
      />
    ) : (
      <TextInputFlat
        {...rest}
        parentState={this.state}
        innerRef={ref => {
          this._root = ref;
        }}
        onFocus={this._handleFocus}
        onBlur={this._handleBlur}
        onChangeText={this._handleChangeText}
        onLayoutAnimatedText={this._onLayoutAnimatedText}
      />
    );
  }
}

polyfill(TextInput);

export default withTheme(TextInput);
