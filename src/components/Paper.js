/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import * as Colors from '../styles/colors';
import shadow from '../styles/shadow';

type Props = {
  children?: any,
  style?: any,
};

/**
 * Paper is a basic container that can give depth to the page.
 * 
 * Note: Pass *elevation* style, to apply shadow to the component. Defaults to 2.
 */
export default class Paper extends Component<void, Props, void> {
  static propTypes = {
    children: PropTypes.node,
    style: ViewPropTypes.style,
  };

  render() {
    const { style, ...restOfProps } = this.props;
    const flattenedStyles = StyleSheet.flatten(style) || {};
    const { elevation = 2 } = flattenedStyles;

    return (
      <View {...restOfProps} style={[styles.paper, shadow(elevation), style]} />
    );
  }
}

const styles = StyleSheet.create({
  paper: {
    backgroundColor: Colors.white,
  },
});
