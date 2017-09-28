/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes } from 'react-native';
import shadow from '../styles/shadow';
import withTheme from '../core/withTheme';
import type { Theme } from '../types/Theme';

type Props = {
  elevation: number,
  children?: any,
  style?: any,
  theme: Theme,
};

/**
 * Paper is a basic container that can give depth to the page
 */
class Paper extends PureComponent<void, Props, void> {
  static propTypes = {
    /**
     * Elevation for the paper
     */
    elevation: PropTypes.number.isRequired,
    children: PropTypes.node,
    theme: PropTypes.object.isRequired,
    style: ViewPropTypes.style,
  };

  render() {
    const { children, elevation, theme: { colors: { paper } } } = this.props;

    return (
      <View
        {...this.props}
        style={[
          elevation && shadow(elevation),
          { backgroundColor: paper },
          this.props.style,
        ]}
      >
        {children}
      </View>
    );
  }
}

export default withTheme(Paper);
