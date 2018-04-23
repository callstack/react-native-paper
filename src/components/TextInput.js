/* @flow */

import * as React from 'react';
import {
  View,
  Animated,
  TextInput as NativeTextInput,
  StyleSheet,
} from 'react-native';
import Text from './Typography/Text';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';

const AnimatedText = Animated.createAnimatedComponent(Text);

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
   * Callback that is called when the text input's text changes. Changed text is passed as an argument to the callback handler.
   */
  onChangeText?: Function,
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
  onFocus?: Function,
  /**
   * Callback that is called when the text input is blurred.
   */
  onBlur?: Function,
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
  focused: Animated.Value,
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
    multiline: false,
  };

  state = {
    focused: new Animated.Value(0),
    placeholder: '',
    value: this.props.value,
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.value !== this.state.value ||
      prevProps.placeholder !== this.props.placeholder
    ) {
      if (this.state.value) {
        this._removePlaceholder();
      } else {
        this._setPlaceholder();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  _setPlaceholder = () => {
    clearTimeout(this._timer);

    this._timer = setTimeout(
      () =>
        this.setState({
          placeholder: this.props.placeholder,
        }),
      50
    );
  };

  _removePlaceholder = () =>
    this.setState({
      placeholder: '',
    });

  _timer: TimeoutID;

  _root: NativeTextInput;

  _animateFocus = () => {
    Animated.timing(this.state.focused, {
      toValue: 1,
      duration: 150,
    }).start(this._setPlaceholder);
  };

  _animateBlur = () => {
    this._removePlaceholder();

    Animated.timing(this.state.focused, {
      toValue: 0,
      duration: 180,
    }).start();
  };

  _handleFocus = (...args) => {
    this._animateFocus();

    if (this.props.onFocus) {
      this.props.onFocus(...args);
    }
  };

  _handleBlur = (...args) => {
    this._animateBlur();

    if (this.props.onBlur) {
      this.props.onBlur(...args);
    }
  };

  _handleChangeText = (value: string) => {
    this.setState({ value });
    this.props.onChangeText && this.props.onChangeText(value);
  };

  setNativeProps(...args) {
    return this._root.setNativeProps(...args);
  }

  isFocused(...args) {
    return this._root.isFocused(...args);
  }

  clear(...args) {
    return this._root.clear(...args);
  }

  focus(...args) {
    return this._root.focus(...args);
  }

  blur(...args) {
    return this._root.blur(...args);
  }

  render() {
    const {
      disabled,
      label,
      underlineColor,
      style,
      theme,
      ...rest
    } = this.props;

    const { colors, fonts } = theme;
    const fontFamily = fonts.regular;
    const primaryColor = colors.primary;
    const inactiveColor = colors.disabled;

    let inputTextColor, labelColor, bottomLineColor;

    if (!disabled) {
      inputTextColor = colors.text;
      labelColor = primaryColor;
      bottomLineColor = underlineColor || primaryColor;
    } else {
      inputTextColor = labelColor = bottomLineColor = inactiveColor;
    }

    const labelColorAnimation = this.state.focused.interpolate({
      inputRange: [0, 1],
      outputRange: [inactiveColor, labelColor],
    });

    const translateY = this.state.value
      ? -22
      : this.state.focused.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -22],
        });
    const fontSize = this.state.value
      ? 12
      : this.state.focused.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 12],
        });

    const labelStyle = {
      color: labelColorAnimation,
      fontFamily,
      fontSize,
      transform: [
        {
          translateY,
        },
      ],
    };

    const bottomLineStyle = {
      backgroundColor: bottomLineColor,
      transform: [{ scaleX: this.state.focused }],
      opacity: this.state.focused.interpolate({
        inputRange: [0, 0.1, 1],
        outputRange: [0, 1, 1],
      }),
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
          selectionColor={labelColor}
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
            style={[styles.bottomLine, { backgroundColor: inactiveColor }]}
          />
          <Animated.View
            style={[styles.bottomLine, styles.focusLine, bottomLineStyle]}
          />
        </View>
      </View>
    );
  }
}

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
