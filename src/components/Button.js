/* @flow */

import color from 'color';
import React, {
  Component,
  PropTypes,
} from 'react';
import {
  Animated,
  View,
  StyleSheet,
} from 'react-native';
import Paper from './Paper';
import Text from './Typography/Text';
import TouchableRipple from './TouchableRipple';
import { black, white } from '../styles/colors';
import withTheme from '../core/withTheme';
import type { Theme } from '../types/Theme';

const AnimatedPaper = Animated.createAnimatedComponent(Paper);

type DefaultProps = {
  raised: boolean;
  primary: boolean;
  roundness: number;
}

type Props = {
  raised?: boolean;
  primary?: boolean;
  dark?: boolean;
  roundness?: number;
  children?: string;
  onPress?: Function;
  style?: any;
  theme: Theme;
}

type State = {
  elevation: Animated.Value;
}

class Button extends Component<DefaultProps, Props, State> {
  static propTypes = {
    raised: PropTypes.bool,
    primary: PropTypes.bool,
    dark: PropTypes.bool,
    roundness: PropTypes.number,
    children: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    style: View.propTypes.style,
    theme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    raised: false,
    primary: false,
    roundness: 2,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      elevation: new Animated.Value(props.raised ? 2 : 0),
    };
  }

  state: State;

  _handlePressIn = () => {
    if (this.props.raised) {
      Animated.timing(this.state.elevation, {
        toValue: 6,
        duration: 200,
      }).start();
    }
  };

  _handlePressOut = () => {
    if (this.props.raised) {
      Animated.timing(this.state.elevation, {
        toValue: 2,
        duration: 200,
      }).start();
    }
  };

  render() {
    const {
      primary,
      dark,
      roundness,
      children,
      onPress,
      style,
      theme,
    } = this.props;
    const { colors } = theme;
    const backgroundColor = primary ? colors.primary : white;
    const fontFamily = theme.fonts.medium;
    const isDark = typeof dark === 'boolean' ? dark : !color(backgroundColor).light();
    const textColor = isDark ? white : black;
    const rippleColor = color(textColor).alpha(0.32).rgbaString();
    const buttonStyle = { backgroundColor, borderRadius: roundness };
    const touchableStyle = { borderRadius: roundness };

    return (
      <AnimatedPaper elevation={this.state.elevation} style={[ styles.button, buttonStyle, style ]}>
        <TouchableRipple
          borderless
          delayPressIn={0}
          onPress={onPress}
          onPressIn={this._handlePressIn}
          onPressOut={this._handlePressOut}
          rippleColor={rippleColor}
          style={touchableStyle}
        >
          <Text style={[ styles.label, { fontFamily, color: textColor } ]}>
            {children ? children.toUpperCase() : ''}
          </Text>
        </TouchableRipple>
      </AnimatedPaper>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    margin: 8,
    minWidth: 88,
  },
  label: {
    textAlign: 'center',
    marginVertical: 9,
    marginHorizontal: 16,
  },
});

export default withTheme(Button);
