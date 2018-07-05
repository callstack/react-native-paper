/* @flow */

import * as React from 'react';
import {
  View,
  Animated,
  TextInput as NativeTextInput,
  StyleSheet,
} from 'react-native';
import { polyfill } from 'react-lifecycles-compat';
import Text from './Typography/Text';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';

const AnimatedText = Animated.createAnimatedComponent(Text);

const MINIMIZED_LABEL_Y_OFFSET = -12;
const OUTLINE_MINIMIZED_LABEL_Y_OFFSET = -29;
const MAXIMIZED_LABEL_FONT_SIZE = 16;
const MINIMIZED_LABEL_FONT_SIZE = 12;
const LABEL_WIGGLE_X_OFFSET = 4;
const FOCUS_ANIMATION_DURATION = 150;
const BLUR_ANIMATION_DURATION = 180;

type Props = {
  /**
   * Mode of the TextInput.
   * - `flat` - flat input without outline.
   * - `outlined` - input with an outline.
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
   * Underline color of the input.
   */
  underlineColor?: string,
  /**
   * Background color to be used for outlined TextInput. Uses theme's background by default.
   */
  outlinedBackgroundColor?: string,
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
  focused: boolean,
  placeholder: ?string,
  value: ?string,
  maxLabelWidth: number,
};

type LayoutEvent = {
  nativeEvent: {
    layout: {
      x: number,
      y: number,
      width: number,
      height: number,
    },
  },
};

/**
 * A component to allow users to input text.
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
    mode: 'flat',
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
    focused: false,
    placeholder: '',
    value: this.props.value,
    maxLabelWidth: 0,
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
    }

    if (prevProps.error !== this.props.error) {
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

  _getBottomLineStyle = (color: string, animatedValue: *) => ({
    backgroundColor: color,
    transform: [{ scaleX: animatedValue }],
    opacity: animatedValue.interpolate({
      inputRange: [0, 0.1, 1],
      outputRange: [0, 1, 1],
    }),
  });

  _setMaxLabelWidth = (event: LayoutEvent) => {
    this.setState({
      maxLabelWidth: event.nativeEvent.layout.width,
    });
  };

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

  /**
  TODO
  - flat - check if background can be calculated out of current theme
  - leading icon
  - trailing icon
   */

  render() {
    const {
      mode,
      disabled,
      label,
      error,
      underlineColor,
      outlinedBackgroundColor,
      style,
      theme,
      ...rest
    } = this.props;

    const { colors, fonts } = theme;
    const fontFamily = fonts.regular;
    const {
      primary: primaryColor,
      disabled: inactiveColor,
      error: errorColor,
    } = colors;

    let inputTextColor, labelColor, bottomLineColor, containerStyle;

    if (!disabled) {
      inputTextColor = colors.text;
      labelColor = (error && errorColor) || primaryColor;
      bottomLineColor = underlineColor || primaryColor;
    } else {
      inputTextColor = labelColor = bottomLineColor = inactiveColor;
    }

    if (mode === 'flat') {
      containerStyle = {
        backgroundColor: '#D7D7D7',
        borderTopLeftRadius: theme.roundness,
        borderTopRightRadius: theme.roundness,
      };
    } else {
      containerStyle = {
        borderRadius: theme.roundness,
        borderWidth: this.state.focused
          ? StyleSheet.hairlineWidth * 4
          : StyleSheet.hairlineWidth,
        borderColor: this.state.focused ? labelColor : underlineColor,
        padding: this.state.focused ? 0 : 1.5,
      };
    }

    const labelColorAnimation = this.state.labeled.interpolate({
      inputRange: [0, 1],
      outputRange: [labelColor, inactiveColor],
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
      outputRange: [
        mode === 'flat'
          ? MINIMIZED_LABEL_Y_OFFSET
          : OUTLINE_MINIMIZED_LABEL_Y_OFFSET,
        0,
      ],
    });

    const outlinedLabelWidth = this.state.labeled.interpolate({
      inputRange: [0, 1],
      outputRange: [this.state.maxLabelWidth - 10, 0],
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

    const outlinedLabelStyle = {
      color: outlinedBackgroundColor || colors.background,
      backgroundColor: outlinedBackgroundColor || colors.background,
      fontFamily,
      fontSize: MINIMIZED_LABEL_FONT_SIZE,
      width: outlinedLabelWidth,
    };

    return (
      <View style={[containerStyle, style]}>
        {mode === 'outlined' ? (
          <AnimatedText
            pointerEvents="none"
            style={[styles.outlinedLabel, outlinedLabelStyle]}
            numberOfLines={1}
          >
            {label}
          </AnimatedText>
        ) : null}
        <AnimatedText
          pointerEvents="none"
          style={[styles.placeholder, labelStyle]}
          onLayout={event => {
            this._setMaxLabelWidth(event);
          }}
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
            mode === 'outlined' ? styles.inputOutlined : null,
            {
              color: inputTextColor,
              fontFamily,
            },
          ]}
        />
        {mode === 'flat' ? (
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
                this._getBottomLineStyle(
                  bottomLineColor,
                  this.state.labeled.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                  })
                ),
              ]}
            />
            <Animated.View
              style={[
                styles.bottomLine,
                styles.focusLine,
                this._getBottomLineStyle(
                  errorColor,
                  // $FlowFixMe$
                  Animated.multiply(this.state.labeled, this.state.error)
                ),
              ]}
            />
          </View>
        ) : null}
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
    top: 20,
    fontSize: 16,
    paddingHorizontal: 12,
  },
  outlinedLabel: {
    position: 'absolute',
    top: -10,
    left: 4,
  },
  input: {
    paddingBottom: 0,
    paddingHorizontal: 12,
    marginTop: 6,
    fontSize: 16,
  },
  inputOutlined: {
    top: -5,
  },
  inputWithLabel: {
    paddingTop: 10,
    minHeight: 50,
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
    marginBottom: -1,
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
