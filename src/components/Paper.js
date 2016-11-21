/* @flow */

import React, {
  PureComponent,
  PropTypes,
} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import * as Colors from '../styles/colors';
import shadow from '../styles/shadow';

type Props = {
  elevation: number;
  children?: any;
  style?: any;
}

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

  render() {
    const { children, elevation } = this.props;

    return (
      <View {...this.props} style={[ styles.paper, elevation && shadow(elevation), this.props.style ]}>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  paper: {
    backgroundColor: Colors.white,
  },
});

