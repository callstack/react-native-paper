/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  children: React.Node,
  style?: any,
};

const DialogScrollArea = ({ children, style }: Props) => (
  <View style={[styles.container, style]}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    borderColor: 'rgba(0, 0, 0, .12)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 24,
  },
});

export default DialogScrollArea;
