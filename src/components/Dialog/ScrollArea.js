import React from 'react';
import { View, StyleSheet } from 'react-native';
import { grey400 } from '../../styles/colors';

type Props = {
  children?: any,
  style?: any,
};

const ScrollArea = ({ children, style }: Props) => (
  <View style={[styles.container, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderColor: grey400,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 24,
  },
});

export default ScrollArea;
