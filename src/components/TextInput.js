/* @flow */

import React, { Component } from 'react';
import {
  View,
  Animated,
  TextInput as NativeTextInput,
  StyleSheet,
} from 'react-native';
import Text from './Typography/Text';
import withTheme from '../core/withTheme';
import type { Theme } from '../types/Theme';

const AnimatedText = Animated.createAnimatedComponent(Text);

type Props = {
  /**
   * If true, user won't be able to interact with the component. The default value is false
   */
  disabled?: boolean,
  /**
   * The text to use for the floating label
   */
  label?: string,
  /**
   * Placeholder for the input
   */
  placeholder?: string,
  /**
   * Callback that is called when the text input's text changes. Changed text is passed as an argument to the callback handler
   */
  onChangeText?: Function,
  /**
   * Underline color of the input
   */
  underlineColor?: string,
  /**
   * Whether the input can have multiple lines
   */
  multiline: boolean,
  /**
   * The number of lines to show in the input (Android only)
   */
  numberOfLines: number,
  /**
   * Callback that is called when the text input is focused
   */
  onFocus?: Function,
  /**
   * Callback that is called when the text input is blurred
   */
  onBlur?: Function,
  /**
   * Value of the text input
   */
  value?: string,
  /**
   * Text that gives context about a field’s input
   */
  helperText?: string,
  /**
   * Represents error state, true represents an invalid input
   */
  hasError?: boolean,
  /**
   * Text to show for error state, visible only when hasError prop is true
   */
  errorText?: string,
  style?: any,
  theme: Theme,
};

type DefaultProps = {
  disabled: boolean,
  hasError: boolean,
};

type State = {
  focused: Animated.Value,
  placeholder: ?string,
};

/**
 * TextInputs allow users to input text.
 *
 * **Usage:**
 * ```
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

class TextInput extends Component<DefaultProps, Props, State> {
  static defaultProps = {
    disabled: false,
    hasError: false,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      focused: new Animated.Value(0),
      placeholder: '',
    };
  }

  state: State;

  componentDidUpdate(prevProps: Props) {
    if (
      (prevProps.value !== this.props.value ||
        prevProps.placeholder !== this.props.placeholder) &&
      this.props.value === ''
    ) {
      this._setPlaceholder();
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

  _timer: any;
  _root: any;
  _setRef = (c: Object) => (this._root = c);

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
      value,
      disabled,
      label,
      underlineColor,
      helperText,
      hasError,
      errorText,
      style,
      theme,
      ...rest
    } = this.props;
    const { colors, fonts } = theme;
    const fontFamily = fonts.regular;
    const primaryColor = colors.primary;

    let inactiveColor = colors.disabled;
    let helperTextColor = colors.helperText;
    let inputTextColor = colors.text,
      labelColor,
      bottomLineColor;

    if (disabled) {
      inputTextColor = labelColor = bottomLineColor = inactiveColor;
    } else if (hasError) {
      helperTextColor = labelColor = bottomLineColor = inactiveColor =
        colors.error;
    } else {
      labelColor = primaryColor;
      bottomLineColor = underlineColor || primaryColor;
    }

    const labelColorAnimation = this.state.focused.interpolate({
      inputRange: [0, 1],
      outputRange: [inactiveColor, labelColor],
    });

    const translateY = value
      ? -22
      : this.state.focused.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -22],
        });
    const fontSize = value
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
          value={value}
          placeholder={this.state.placeholder}
          placeholderTextColor={colors.placeholder}
          editable={!disabled}
          ref={this._setRef}
          selectionColor={labelColor}
          onFocus={this._handleFocus}
          onBlur={this._handleBlur}
          underlineColorAndroid="transparent"
          style={[
            styles.input,
            rest.multiline && styles.multiline,
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
        {helperText &&
          !disabled && (
            <Text style={[styles.helperText, { color: helperTextColor }]}>
              {hasError ? errorText : helperText}
            </Text>
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  placeholder: {
    position: 'absolute',
    left: 0,
    top: 38,
    fontSize: 16,
  },
  input: {
    minHeight: 64,
    paddingTop: 20,
    paddingBottom: 0,
    marginTop: 8,
    marginBottom: -4,
  },
  multiline: {
    paddingTop: 30,
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
  helperText: {
    textAlign: 'left',
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: 12,
  },
});

export default withTheme(TextInput);
