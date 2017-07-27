import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  children?: any,
  style?: any,
};

const Content = ({ children, style }: Props) =>
  <View style={[styles.container, style]}>
    {children}
  </View>;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
});

export default Content;
