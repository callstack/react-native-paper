/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Animated } from 'react-native';
import * as Colors from '../styles/colors';
import shadow from '../styles/shadow';

type Props = {
  elevation: number,
  children?: any,
  style?: any,
};

/**
 * Paper is a basic container that can give depth to the page
 */
export default class Paper extends PureComponent<void, Props, void> {
  static propTypes = {
    /**
     * Elevation for the paper
     */
    elevation: PropTypes.number.isRequired,
    children: PropTypes.node,
    style: View.propTypes.style,
  };

  static Animated = null;

  render() {
    const { children, elevation } = this.props;

    return (
      <View
        {...this.props}
        style={[styles.paper, elevation && shadow(elevation), this.props.style]}
      >
        {children}
      </View>
    );
  }
}

Paper.Animated = Animated.createAnimatedComponent(Paper);

const styles = StyleSheet.create({
  paper: {
    backgroundColor: Colors.white,
  },
});
