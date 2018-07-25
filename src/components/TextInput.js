/* @flow */

import * as React from 'react';
import {
  View,
  Animated,
  TextInput as NativeTextInput,
  StyleSheet,
} from 'react-native';
import { polyfill } from 'react-lifecycles-compat';
import color from 'color';
import Text from './Typography/Text';
import withTheme from '../core/withTheme';
import { black, white } from '../styles/colors';
import type { Theme } from '../types';

const AnimatedText = Animated.createAnimatedComponent(Text);

const MINIMIZED_LABEL_Y_OFFSET = -22;
const MAXIMIZED_LABEL_FONT_SIZE = 16;
const MINIMIZED_LABEL_FONT_SIZE = 12;
const LABEL_WIGGLE_X_OFFSET = 4;
const FOCUS_ANIMATION_DURATION = 150;
const BLUR_ANIMATION_DURATION = 180;

type Props = {
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
   * Underline color of the input.
   */
  underlineColor?: string,
  /**
   * Color for the text selection background. Defaults to the theme's primary color.
   */
  selectionColor?: string,
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
   * Value of the text input.
   */
  value?: string,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

type State = {
  labeled: Animated.Value,
  error: Animated.Value,
  color: Animated.Value,
  underline: Animated.Value,
  focused: boolean,
  placeholder: ?string,
  value: ?string,
};

/**
 * TextInputs allow users to input text.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/textinput.unfocused.png" />
 *     <figcaption>Unfocused</span>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/textinput.focused.png" />
 *     <figcaption>Focused</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { TextInput } from 'react-native-paper';
 *
 * class MyComponent extends React.Component {
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
 *
 */

class TextInput extends React.Component<Props, State> {
  static defaultProps = {
    disabled: false,
    error: false,
    multiline: false,
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
    labeled: new Animated.Value(this.props.value ? 0 : 1),
    error: new Animated.Value(this.props.error ? 1 : 0),
    underline: new Animated.Value(0),
    color: new Animated.Value(0),
    focused: false,
    placeholder: '',
    value: this.props.value,
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.value !== this.state.value ||
      prevState.focused !== this.state.focused ||
      prevProps.placeholder !== this.props.placeholder
    ) {
      if (this.state.value || this.state.focused) {
        this._minmizeLabel();
      } else {
        this._restoreLabel();
      }

      if (this.state.value || !this.state.focused) {
        this._hidePlaceholder();
      } else {
        this._handleShowPlaceholder();
      }

      if (this.state.focused) {
        this._showUnderline();
      } else {
        this._hideUnderline();
      }
    }

    if (prevProps.error !== this.props.error) {
      if (this.props.error) {
        this._showError();
      } else {
        this._hideError();
      }
    }

    if (
      prevProps.error !== this.props.error ||
      prevState.focused !== this.state.focused
    ) {
      if (this.props.error || this.state.focused) {
        this._showColor();
      } else {
        this._hideColor();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  _handleShowPlaceholder = () => {
    clearTimeout(this._timer);

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

  _root: NativeTextInput;

  _showError = () => {
    Animated.timing(this.state.error, {
      toValue: 1,
      duration: FOCUS_ANIMATION_DURATION,
    }).start(this._handleShowPlaceholder);
  };

  _hideError = () => {
    Animated.timing(this.state.error, {
      toValue: 0,
      duration: BLUR_ANIMATION_DURATION,
    }).start();
  };

  _restoreLabel = () =>
    Animated.timing(this.state.labeled, {
      toValue: 1,
      duration: FOCUS_ANIMATION_DURATION,
    }).start();

  _minmizeLabel = () =>
    Animated.timing(this.state.labeled, {
      toValue: 0,
      duration: BLUR_ANIMATION_DURATION,
    }).start();

  _showUnderline = () =>
    Animated.timing(this.state.underline, {
      toValue: 1,
      duration: FOCUS_ANIMATION_DURATION,
    }).start();

  _hideUnderline = () =>
    Animated.timing(this.state.underline, {
      toValue: 0,
      duration: BLUR_ANIMATION_DURATION,
    }).start();

  _showColor = () => {
    Animated.timing(this.state.color, {
      toValue: 1,
      duration: FOCUS_ANIMATION_DURATION,
    }).start();
  };

  _hideColor = () => {
    Animated.timing(this.state.color, {
      toValue: 0,
      duration: BLUR_ANIMATION_DURATION,
    }).start();
  };

  _handleFocus = (...args) => {
    this.setState({ focused: true });

    if (this.props.onFocus) {
      this.props.onFocus(...args);
    }
  };

  _handleBlur = (...args) => {
    this.setState({ focused: false });

    if (this.props.onBlur) {
      this.props.onBlur(...args);
    }
  };

  _handleChangeText = (value: string) => {
    this.setState({ value });
    this.props.onChangeText && this.props.onChangeText(value);
  };

  _getBottomLineStyle = (backgroundColor: string, animatedValue: *) => ({
    backgroundColor,
    transform: [{ scaleX: animatedValue }],
    opacity: animatedValue.interpolate({
      inputRange: [0, 0.1, 1],
      outputRange: [0, 1, 1],
    }),
  });

  /**
   * @internal
   */
  setNativeProps(...args) {
    return this._root.setNativeProps(...args);
  }

  /**
   * Returns `true` if the input is currently focused, `false` otherwise.
   */
  isFocused() {
    return this._root.isFocused();
  }

  /**
   * Removes all text from the TextInput.
   */
  clear() {
    return this._root.clear();
  }

  /**
   * Focuses the input.
   */
  focus() {
    return this._root.focus();
  }

  /**
   * Removes focus from the input.
   */
  blur() {
    return this._root.blur();
  }

  render() {
    const {
      disabled,
      label,
      error,
      selectionColor,
      underlineColor,
      style,
      theme,
      ...rest
    } = this.props;

    const { colors, dark, fonts } = theme;
    const fontFamily = fonts.regular;
    const {
      primary: primaryColor,
      disabled: disabledColor,
      error: errorColor,
    } = colors;

    let inputTextColor, labelColor, bottomLineColor, inactiveColor;

    if (!disabled) {
      inputTextColor = colors.text;
      labelColor = (error && errorColor) || primaryColor;
      bottomLineColor = underlineColor || primaryColor;
      inactiveColor = color(dark ? white : black)
        .alpha(0.54)
        .rgb()
        .string();
    } else {
      inputTextColor = labelColor = bottomLineColor = inactiveColor = disabledColor;
    }

    const labelColorAnimation = this.state.color.interpolate({
      inputRange: [0, 1],
      outputRange: [inactiveColor, labelColor],
    });

    // Wiggle when error appears and label is minimized
    const labelTranslateX =
      this.state.value && error
        ? this.state.error.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, LABEL_WIGGLE_X_OFFSET, 0],
          })
        : 0;

    // Move label to top if value is set
    const labelTranslateY = this.state.labeled.interpolate({
      inputRange: [0, 1],
      outputRange: [MINIMIZED_LABEL_Y_OFFSET, 0],
    });

    const labelFontSize = this.state.labeled.interpolate({
      inputRange: [0, 1],
      outputRange: [MINIMIZED_LABEL_FONT_SIZE, MAXIMIZED_LABEL_FONT_SIZE],
    });

    const labelStyle = {
      color: labelColorAnimation,
      fontFamily,
      fontSize: labelFontSize,
      transform: [
        { translateX: labelTranslateX },
        { translateY: labelTranslateY },
      ],
    };

    return (
      <View style={style}>
        <AnimatedText
          pointerEvents="none"
          style={[styles.placeholder, labelStyle]}
        >
          {label}
        </AnimatedText>
        <NativeTextInput
          {...rest}
          ref={c => {
            this._root = c;
          }}
          onChangeText={this._handleChangeText}
          placeholder={label ? this.state.placeholder : this.props.placeholder}
          placeholderTextColor={colors.placeholder}
          editable={!disabled}
          selectionColor={selectionColor || colors.primary}
          onFocus={this._handleFocus}
          onBlur={this._handleBlur}
          underlineColorAndroid="transparent"
          style={[
            styles.input,
            label ? styles.inputWithLabel : styles.inputWithoutLabel,
            rest.multiline
              ? label
                ? styles.multilineWithLabel
                : styles.multilineWithoutLabel
              : null,
            {
              color: inputTextColor,
              fontFamily,
            },
          ]}
        />
        <View pointerEvents="none" style={styles.bottomLineContainer}>
          <View
            style={[
              styles.bottomLine,
              { backgroundColor: error ? errorColor : inactiveColor },
            ]}
          />
          <Animated.View
            style={[
              styles.bottomLine,
              styles.focusLine,
              this._getBottomLineStyle(bottomLineColor, this.state.underline),
            ]}
          />
          <Animated.View
            style={[
              styles.bottomLine,
              styles.focusLine,
              this._getBottomLineStyle(
                errorColor,
                // $FlowFixMe
                Animated.multiply(this.state.underline, this.state.error)
              ),
            ]}
          />
        </View>
      </View>
    );
  }
}

polyfill(TextInput);

export default withTheme(TextInput);

const styles = StyleSheet.create({
  placeholder: {
    position: 'absolute',
    left: 0,
    top: 40,
    fontSize: 16,
  },
  input: {
    paddingBottom: 0,
    marginTop: 8,
    marginBottom: -4,
    fontSize: 16,
  },
  inputWithLabel: {
    paddingTop: 20,
    minHeight: 64,
  },
  inputWithoutLabel: {
    paddingTop: 0,
    minHeight: 44,
  },
  multilineWithLabel: {
    paddingTop: 30,
    paddingBottom: 10,
  },
  multilineWithoutLabel: {
    paddingVertical: 10,
  },
  bottomLineContainer: {
    marginBottom: 4,
    height: StyleSheet.hairlineWidth * 4,
  },
  bottomLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: StyleSheet.hairlineWidth,
  },
  focusLine: {
    height: StyleSheet.hairlineWidth * 4,
  },
});
