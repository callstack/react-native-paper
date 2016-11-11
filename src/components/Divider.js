/* @flow */

import React, {
  PropTypes,
} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import withTheme from '../core/withTheme';
import type { Theme } from '../types/Theme';

type Props = {
  customInset?: number;
  hasInset?: boolean;
  theme: Theme;
}

const Divider = (props: Props) => {
  const { hasInset, customInset, theme } = props;
  return (
    <View
      {...props}
      style={[
        styles.divider,
        { backgroundColor: theme.colors.divider },
        hasInset && { marginLeft: customInset || 72 },
      ]}
    />
  );
};

Divider.propTypes = {
  customInset: PropTypes.number,
  hasInset: PropTypes.bool,
  theme: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
  },
});

export default withTheme(Divider);
