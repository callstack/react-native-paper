/* @flow */

import * as React from 'react';
import { Animated, View, Platform, StyleSheet } from 'react-native';
import color from 'color';
import TouchableRipple from './TouchableRipple';
import withTheme from '../core/withTheme';
import { RadioGroupContext } from './RadioGroup';
import type { Theme } from '../types';

type Props = {
  /**
   * Value of the radio button
   */
  value: string,
  /**
   * Whether radio is checked.
   */
  checked?: boolean,
  /**
   * Whether radio is disabled.
   */
  disabled?: boolean,
  /**
   * Function to execute on press.
   */
  onPress?: Function,
  /**
   * Custom color for radio.
   */
  color?: string,
  /**
   * @optional
   */
  theme: Theme,
};

type State = {
  borderAnim: Animated.Value,
  radioAnim: Animated.Value,
};

const BORDER_WIDTH = 2;

/**
 * Radio buttons allow the selection a single option from a set
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/radio-enabled.android.png" />
 *     <figcaption>Android (enabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/radio-disabled.android.png" />
 *     <figcaption>Android (disabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/radio-enabled.ios.png" />
 *     <figcaption>iOS (enabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/radio-disabled.ios.png" />
 *     <figcaption>iOS (disabled)</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { RadioButton } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     checked: 'firstOption',
 *   };
 *
 *   render() {
 *     const { checked } = this.state;
 *     return (
 *       <View>
 *         <RadioButton
 *           value="firstOption"
 *           checked={checked === 'firstOption'}
 *           onPress={() => { this.setState({ checked: 'firstOption' }); }}
 *         />
 *         <RadioButton
 *           value="secondOption"
 *           checked={checked === 'secondOption'}
 *           onPress={() => { this.setState({ checked: 'secondOption' }); }}
 *         />
 *       </View>
 *     );
 *   }
 * }
 * ```
 */
class RadioButton extends React.Component<Props, State> {
  state = {
    borderAnim: new Animated.Value(BORDER_WIDTH),
    radioAnim: new Animated.Value(1),
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.props.checked) {
      if (Platform.OS === 'android') {
        if (nextProps.checked) {
          this.state.radioAnim.setValue(1.2);
          Animated.timing(this.state.radioAnim, {
            toValue: 1,
            duration: 150,
          }).start();
        } else {
          this.state.borderAnim.setValue(10);
          Animated.timing(this.state.borderAnim, {
            toValue: BORDER_WIDTH,
            duration: 150,
          }).start();
        }
      }
    }
  }

  render() {
    return (
      <RadioGroupContext.Consumer>
        {context => {
          const { disabled, onPress, theme, ...rest } = this.props;
          const checkedColor = this.props.color || theme.colors.accent;
          const uncheckedColor = theme.dark
            ? 'rgba(255, 255, 255, .7)'
            : 'rgba(0, 0, 0, .54)';

          let rippleColor, radioColor;

          const { passed, value, onValueChange } = context;

          const checked = passed
            ? value === this.props.value
            : this.props.checked;

          if (disabled) {
            rippleColor = 'rgba(0, 0, 0, .16)';
            radioColor = theme.colors.disabled;
          } else {
            rippleColor = color(checkedColor)
              .fade(0.32)
              .rgb()
              .string();
            radioColor = checked ? checkedColor : uncheckedColor;
          }

          return (
            <TouchableRipple
              {...rest}
              borderless
              rippleColor={rippleColor}
              onPress={
                disabled
                  ? undefined
                  : passed ? () => onValueChange(this.props.value) : onPress
              }
              style={styles.container}
            >
              <Animated.View
                style={[
                  styles.radio,
                  {
                    borderColor: radioColor,
                    borderWidth: this.state.borderAnim,
                  },
                ]}
              >
                {checked ? (
                  <View
                    style={[StyleSheet.absoluteFill, styles.radioContainer]}
                  >
                    <Animated.View
                      style={[
                        styles.dot,
                        {
                          backgroundColor: radioColor,
                          transform: [{ scale: this.state.radioAnim }],
                        },
                      ]}
                    />
                  </View>
                ) : null}
              </Animated.View>
            </TouchableRipple>
          );
        }}
      </RadioGroupContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
  },
  radioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    margin: 8,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
});

export default withTheme(RadioButton);
