/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes, StyleSheet } from 'react-native';
import shadow from '../styles/shadow';
import withTheme from '../core/withTheme';
import * as Colors from '../styles/colors';
import type { Theme } from '../types/Theme';

type Props = {
  children?: any,
  style?: any,
  theme: Theme,
};

/**
 * Paper is a basic container that can give depth to the page.
 * 
 * Note: Pass *elevation* style, to apply shadow to the component. Defaults to 2.
 */
class Paper extends Component<void, Props, void> {
  static propTypes = {
    children: PropTypes.node,
    theme: PropTypes.object.isRequired,
    style: ViewPropTypes.style,
  };

  render() {
    const { style, theme: { colors: { paper } }, ...restOfProps } = this.props;
    const flattenedStyles = StyleSheet.flatten(style) || {};
    const { elevation = 2 } = flattenedStyles;

    return (
      <View
        {...restOfProps}
        style={[
          styles.paper,
          { backgroundColor: paper },
          shadow(elevation),
          style,
        ]}
      />
    );
  }
}

export default withTheme(Paper);

const styles = StyleSheet.create({
  paper: {
    backgroundColor: Colors.white,
  },
});
