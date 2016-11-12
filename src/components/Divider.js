/* @flow */

import React, {
  PropTypes,
} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

type Props = {
  inset?: boolean;
  style?: any;
}

const Divider = (props: Props) => {
  const { inset = false, style = null } = props;
  return (
    <View
      {...props}
      style={[
        styles.divider,
        { backgroundColor: 'rgba(0, 0, 0, .12)' },
        inset && { marginLeft: 72 },
        style,
      ]}
    />
  );
};

Divider.propTypes = {
  inset: PropTypes.bool,
  style: View.propTypes.style,
};

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});

export default Divider;
