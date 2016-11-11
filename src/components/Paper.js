/* @flow */

import React, {
  Component,
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

export default class Paper extends Component<void, Props, void> {
  static propTypes = {
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

