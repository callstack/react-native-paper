/* @flow */

import * as React from 'react';
import color from 'color';
import { Animated, StyleSheet } from 'react-native';
import Text from './Typography/Text';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';

const AnimatedText = Animated.createAnimatedComponent(Text);

type Props = {
  /**
   * Type of the helper text.
   */
  type: 'error' | 'info',
  /**
   * Whether to display the helper text.
   */
  visible?: boolean,
  /**
   * Text content of the HelperText.
   */
  children: React.Node,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

type State = {
  shown: Animated.Value,
  textHeight: number,
};

/**
 * Helper text is used in conjuction with input elements to provide additional hints for the user.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/helper-text.gif" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { HelperText, TextInput } from 'react-native-paper';
 *
 * class MyComponent extends React.Component {
 *   state = {
 *     text: ''
 *   };
 *
 *   render(){
 *     return (
 *       <View>
 *         <TextInput
 *           label="Email"
 *           value={this.state.text}
 *           onChangeText={text => this.setState({ text })}
 *         />
 *         <HelperText
 *           type="error"
 *           visible={!this.state.text.includes('@')}
 *         >
 *           Email address is invalid!
 *         </HelperText>
 *       </View>
 *     );
 *   }
 * }
 * ```
 */
class HelperText extends React.PureComponent<Props, State> {
  static defaultProps = {
    type: 'info',
    visible: true,
  };

  state = {
    shown: new Animated.Value(this.props.visible ? 1 : 0),
    textHeight: 0,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this._animateFocus();
      } else {
        this._animateBlur();
      }
    }
  }

  _animateFocus = () => {
    Animated.timing(this.state.shown, {
      toValue: 1,
      duration: 150,
    }).start();
  };

  _animateBlur = () => {
    Animated.timing(this.state.shown, {
      toValue: 0,
      duration: 180,
    }).start();
  };

  _handleTextLayout = e =>
    this.setState({
      textHeight: e.nativeEvent.layout.height,
    });

  render() {
    const { style, type, visible, theme } = this.props;
    const { colors, dark } = theme;

    const textColor =
      this.props.type === 'error'
        ? colors.error
        : color(colors.text)
            .alpha(dark ? 0.7 : 0.54)
            .rgb()
            .string();

    return (
      <AnimatedText
        onLayout={this._handleTextLayout}
        style={[
          styles.text,
          {
            color: textColor,
            opacity: this.state.shown,
            transform:
              visible && type === 'error'
                ? [
                    {
                      translateY: this.state.shown.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-this.state.textHeight, 0],
                      }),
                    },
                  ]
                : [],
          },
          style,
        ]}
      >
        {this.props.children}
      </AnimatedText>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    paddingVertical: 4,
  },
});

export default withTheme(HelperText);
