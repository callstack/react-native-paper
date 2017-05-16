/* @flow */

import React, { PropTypes } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  inset?: boolean,
  style?: any,
};

/**
 * A divider is a thin, lightweight rule that groups content in lists and page layouts
 */
const Divider = (props: Props) => {
  const { inset, style } = props;
  return (
    <View {...props} style={[styles.divider, inset && styles.inset, style]} />
  );
};

Divider.propTypes = {
  /**
   *  Whether divider has a left inset
   */
  inset: PropTypes.bool,
  style: View.propTypes.style,
};

const styles = StyleSheet.create({
  divider: {
    backgroundColor: 'rgba(0, 0, 0, .12)',
    height: StyleSheet.hairlineWidth,
  },
  inset: {
    marginLeft: 72,
  },
});

export default Divider;
