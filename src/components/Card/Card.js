/* @flow */

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import Paper from '../Paper';
import CardContent from './CardContent';
import CardCover from './CardCover';
import CardActions from './CardActions';
import { white } from '../../styles/colors';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types/Theme';

const AnimatedPaper = Animated.createAnimatedComponent(Paper);

type DefaultProps = {
  elevation: number,
};

type Props = {
  elevation?: number,
  children?: string,
  onPress?: Function,
  style?: any,
  theme: Theme,
};

type State = {
  elevation: Animated.Value,
};

class Card extends Component<DefaultProps, Props, State> {
  static Cover = CardCover;
  static Content = CardContent;
  static Actions = CardActions;

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
      toValue: 8,
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
    const { children, onPress, style, theme } = this.props;

    const { roundness } = theme;
    const total = Children.count(children);
    const siblings = Children.map(children, child => child.type.displayName);

    return (
      <AnimatedPaper
        elevation={this.state.elevation}
        style={[styles.card, { borderRadius: roundness }, style]}
      >
        <TouchableWithoutFeedback
          delayPressIn={0}
          onPress={onPress}
          onPressIn={onPress ? this._handlePressIn : undefined}
          onPressOut={onPress ? this._handlePressOut : undefined}
          style={styles.container}
        >
          <View style={styles.innerContainer}>
            {Children.map(children, (child, index) =>
              React.cloneElement(child, {
                index,
                total,
                siblings,
              }),
            )}
          </View>
        </TouchableWithoutFeedback>
      </AnimatedPaper>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: white,
    margin: 4,
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flexGrow: 1,
  },
});

export default withTheme(Card);
