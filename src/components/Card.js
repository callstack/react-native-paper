/* @flow */

import React, {
  Component,
  PropTypes,
} from 'react';
import {
  Animated,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import Paper from './Paper';
import { white } from '../styles/colors';
import withTheme from '../core/withTheme';
import type { Theme } from '../types/Theme';

const AnimatedPaper = Animated.createAnimatedComponent(Paper);

type DefaultProps = {
  elevation: number;
}

type Props = {
  elevation?: number;
  children?: string;
  onPress?: Function;
  style?: any;
  theme: Theme;
}

type State = {
  elevation: Animated.Value;
}

class Card extends Component<DefaultProps, Props, State> {
  static propTypes = {
    elevation: PropTypes.number,
    children: PropTypes.node.isRequired,
    onPress: PropTypes.func,
    style: View.propTypes.style,
    theme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    elevation: 2,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      elevation: new Animated.Value(props.elevation),
    };
  }

  state: State;

  _handlePressIn = () => {
    Animated.timing(this.state.elevation, {
      toValue: 6,
      duration: 200,
    }).start();
  };

  _handlePressOut = () => {
    Animated.timing(this.state.elevation, {
      toValue: this.props.elevation,
      duration: 150,
    }).start();
  };

  render() {
    const {
      children,
      onPress,
      style,
    } = this.props;

    return (
      <AnimatedPaper elevation={this.state.elevation} style={[ styles.card, style ]}>
        <TouchableWithoutFeedback
          delayPressIn={0}
          onPress={onPress}
          onPressIn={onPress ? this._handlePressIn : undefined}
          onPressOut={onPress ? this._handlePressOut : undefined}
          style={styles.container}
        >
          <View style={styles.container}>
            {children}
          </View>
        </TouchableWithoutFeedback>
      </AnimatedPaper>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: white,
    borderRadius: 2,
    margin: 8,
  },
  container: {
    flex: 1,
  },
});

export default withTheme(Card);
