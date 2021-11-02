import * as React from 'react';
import {
  Animated,
  TextInput as NativeTextInput,
  LayoutChangeEvent,
  StyleProp,
  TextStyle,
} from 'react-native';
import TextInputOutlined from './TextInputOutlined';
import TextInputFlat from './TextInputFlat';
import TextInputIcon from './Adornment/TextInputIcon';
import TextInputAffix from './Adornment/TextInputAffix';
import { withTheme } from '../../core/theming';
import type { RenderProps, State } from './types';
import type { $Omit } from '../../types';

const BLUR_ANIMATION_DURATION = 180;
const FOCUS_ANIMATION_DURATION = 150;

export type TextInputProps = React.ComponentPropsWithRef<
  typeof NativeTextInput
> & {
  /**
   * Mode of the TextInput.
   * - `flat` - flat input with an underline.
   * - `outlined` - input with an outline.
   *
   * In `outlined` mode, the background color of the label is derived from `colors.background` in theme or the `backgroundColor` style.
   * This component render TextInputOutlined or TextInputFlat based on that props
   */
  mode?: 'flat' | 'outlined';
  left?: React.ReactNode;
  right?: React.ReactNode;
  /**
   * If true, user won't be able to interact with the component.
   */
  disabled?: boolean;
  /**
   * The text to use for the floating label.
   */
  label?: string;
  /**
   * Placeholder for the input.
   */
  placeholder?: string;
  /**
   * Whether to style the TextInput with error style.
   */
  error?: boolean;
  /**
   * Callback that is called when the text input's text changes. Changed text is passed as an argument to the callback handler.
   */
  onChangeText?: Function;
  /**
   * Selection color of the input
   */
  selectionColor?: string;
  /**
   * Inactive underline color of the input.
   */
  underlineColor?: string;
  /**
   * Active underline color of the input.
   */
  activeUnderlineColor?: string;
  /**
   * Inactive outline color of the input.
   */
  outlineColor?: string;
  /**
   * Active outline color of the input.
   */
  activeOutlineColor?: string;
  /**
   * Sets min height with densed layout. For `TextInput` in `flat` mode
   * height is `64dp` or in dense layout - `52dp` with label or `40dp` without label.
   * For `TextInput` in `outlined` mode
   * height is `56dp` or in dense layout - `40dp` regardless of label.
   * When you apply `height` prop in style the `dense` prop affects only `paddingVertical` inside `TextInput`
   */
  dense?: boolean;
  /**
   * Whether the input can have multiple lines.
   */
  multiline?: boolean;
  /**
   * The number of lines to show in the input (Android only).
   */
  numberOfLines?: number;
  /**
   * Callback that is called when the text input is focused.
   */
  onFocus?: (args: any) => void;
  /**
   * Callback that is called when the text input is blurred.
   */
  onBlur?: (args: any) => void;
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
  render?: (props: RenderProps) => React.ReactNode;
  /**
   * Value of the text input.
   */
  value?: string;
  /**
   * Pass `fontSize` prop to modify the font size inside `TextInput`.
   * Pass `height` prop to set `TextInput` height. When `height` is passed,
   * `dense` prop will affect only input's `paddingVertical`.
   * Pass `paddingHorizontal` to modify horizontal padding.
   * This can be used to get MD Guidelines v1 TextInput look.
   */
  style?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

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
 * const MyComponent = () => {
 *   const [text, setText] = React.useState('');
 *
 *   return (
 *     <TextInput
 *       label="Email"
 *       value={text}
 *       onChangeText={text => setText(text)}
 *     />
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 *
 * @extends TextInput props https://reactnative.dev/docs/textinput#props
 */

class TextInput extends React.Component<TextInputProps, State> {
  // @component ./Adornment/TextInputIcon.tsx
  static Icon = TextInputIcon;

  // @component ./Adornment/TextInputAffix.tsx
  static Affix = TextInputAffix;

  static defaultProps: Partial<TextInputProps> = {
    mode: 'flat',
    dense: false,
    disabled: false,
    error: false,
    multiline: false,
    editable: true,
    render: (props: RenderProps) => <NativeTextInput {...props} />,
  };

  static getDerivedStateFromProps(nextProps: TextInputProps, prevState: State) {
    return {
      value:
        typeof nextProps.value !== 'undefined'
          ? nextProps.value
          : prevState.value,
    };
  }
  validInputValue =
    this.props.value !== undefined ? this.props.value : this.props.defaultValue;

  state = {
    labeled: new Animated.Value(this.validInputValue ? 0 : 1),
    error: new Animated.Value(this.props.error ? 1 : 0),
    focused: false,
    placeholder: '',
    value: this.validInputValue,
    labelLayout: {
      measured: false,
      width: 0,
      height: 0,
    },
    leftLayout: {
      width: null,
      height: null,
    },
    rightLayout: {
      width: null,
      height: null,
    },
  };

  ref: NativeTextInput | undefined | null;

  componentDidUpdate(prevProps: TextInputProps, prevState: State) {
    const isFocusChanged = prevState.focused !== this.state.focused;
    const isValueChanged = prevState.value !== this.state.value;
    const isLabelLayoutChanged =
      prevState.labelLayout !== this.state.labelLayout;
    const isLabelChanged = prevProps.label !== this.props.label;
    const isErrorChanged = prevProps.error !== this.props.error;

    if (
      isFocusChanged ||
      isValueChanged ||
      // workaround for animated regression for react native > 0.61
      // https://github.com/callstack/react-native-paper/pull/1440
      isLabelLayoutChanged
    ) {
      // The label should be minimized if the text input is focused, or has text
      // In minimized mode, the label moves up and becomes small
      if (this.state.value || this.state.focused) {
        this.minimizeLabel();
      } else {
        this.restoreLabel();
      }
    }

    if (isFocusChanged || isLabelChanged) {
      // Show placeholder text only if the input is focused, or there's no label
      // We don't show placeholder if there's a label because the label acts as placeholder
      // When focused, the label moves up, so we can show a placeholder
      if (this.state.focused || !this.props.label) {
        this.showPlaceholder();
      } else {
        this.hidePlaceholder();
      }
    }

    if (isErrorChanged) {
      // When the input has an error, we wiggle the label and apply error styles
      if (this.props.error) {
        this.showError();
      } else {
        this.hideError();
      }
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  private showPlaceholder = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    // Set the placeholder in a delay to offset the label animation
    // If we show it immediately, they'll overlap and look ugly
    this.timer = (setTimeout(
      () =>
        this.setState({
          placeholder: this.props.placeholder,
        }),
      50
    ) as unknown) as NodeJS.Timeout;
  };

  private hidePlaceholder = () =>
    this.setState({
      placeholder: '',
    });

  private timer?: NodeJS.Timeout;
  private root: NativeTextInput | undefined | null;

  private showError = () => {
    const { scale } = this.props.theme.animation;
    Animated.timing(this.state.error, {
      toValue: 1,
      duration: FOCUS_ANIMATION_DURATION * scale,
      useNativeDriver: true,
    }).start();
  };

  private hideError = () => {
    const { scale } = this.props.theme.animation;
    Animated.timing(this.state.error, {
      toValue: 0,
      duration: BLUR_ANIMATION_DURATION * scale,
      useNativeDriver: true,
    }).start();
  };

  private restoreLabel = () => {
    const { scale } = this.props.theme.animation;
    Animated.timing(this.state.labeled, {
      toValue: 1,
      duration: FOCUS_ANIMATION_DURATION * scale,
      useNativeDriver: true,
    }).start();
  };

  private minimizeLabel = () => {
    const { scale } = this.props.theme.animation;
    Animated.timing(this.state.labeled, {
      toValue: 0,
      duration: BLUR_ANIMATION_DURATION * scale,
      useNativeDriver: true,
    }).start();
  };

  private onLeftAffixLayoutChange = (event: LayoutChangeEvent) => {
    this.setState({
      leftLayout: {
        height: event.nativeEvent.layout.height,
        width: event.nativeEvent.layout.width,
      },
    });
  };

  private onRightAffixLayoutChange = (event: LayoutChangeEvent) => {
    this.setState({
      rightLayout: {
        width: event.nativeEvent.layout.width,
        height: event.nativeEvent.layout.height,
      },
    });
  };

  private handleFocus = (args: any) => {
    if (this.props.disabled || !this.props.editable) {
      return;
    }

    this.setState({ focused: true });

    if (this.props.onFocus) {
      this.props.onFocus(args);
    }
  };

  private handleBlur = (args: Object) => {
    if (!this.props.editable) {
      return;
    }

    this.setState({ focused: false });

    if (this.props.onBlur) {
      this.props.onBlur(args);
    }
  };

  private handleChangeText = (value: string) => {
    if (!this.props.editable) {
      return;
    }

    this.setState({ value });
    this.props.onChangeText && this.props.onChangeText(value);
  };

  private handleLayoutAnimatedText = (e: LayoutChangeEvent) => {
    this.setState({
      labelLayout: {
        width: e.nativeEvent.layout.width,
        height: e.nativeEvent.layout.height,
        measured: true,
      },
    });
  };

  forceFocus = () => {
    return this.root?.focus();
  };

  /**
   * @internal
   */
  setNativeProps(args: Object) {
    return this.root && this.root.setNativeProps(args);
  }

  /**
   * Returns `true` if the input is currently focused, `false` otherwise.
   */
  isFocused() {
    return this.root && this.root.isFocused();
  }

  /**
   * Removes all text from the TextInput.
   */
  clear() {
    return this.root && this.root.clear();
  }

  /**
   * Focuses the input.
   */
  focus() {
    return this.root && this.root.focus();
  }

  /**
   * Removes focus from the input.
   */
  blur() {
    return this.root && this.root.blur();
  }
  render() {
    const { mode, ...rest } = this.props as $Omit<TextInputProps, 'ref'>;

    return mode === 'outlined' ? (
      <TextInputOutlined
        {...rest}
        value={this.state.value}
        parentState={this.state}
        innerRef={(ref) => {
          this.root = ref;
        }}
        onFocus={this.handleFocus}
        forceFocus={this.forceFocus}
        onBlur={this.handleBlur}
        onChangeText={this.handleChangeText}
        onLayoutAnimatedText={this.handleLayoutAnimatedText}
        onLeftAffixLayoutChange={this.onLeftAffixLayoutChange}
        onRightAffixLayoutChange={this.onRightAffixLayoutChange}
      />
    ) : (
      <TextInputFlat
        {...rest}
        value={this.state.value}
        parentState={this.state}
        innerRef={(ref) => {
          this.root = ref;
        }}
        onFocus={this.handleFocus}
        forceFocus={this.forceFocus}
        onBlur={this.handleBlur}
        onChangeText={this.handleChangeText}
        onLayoutAnimatedText={this.handleLayoutAnimatedText}
        onLeftAffixLayoutChange={this.onLeftAffixLayoutChange}
        onRightAffixLayoutChange={this.onRightAffixLayoutChange}
      />
    );
  }
}

export default withTheme(TextInput);
