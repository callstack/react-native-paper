/* @flow */

import React from 'react';
import { StyleSheet } from 'react-native';
import Title from '../Typography/Title';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types/Theme';

type Props = {
  children: any,
  style?: any,
  theme: Theme,
};

const DialogTitle = ({
  children,
  theme: { colors: { text } },
  style,
}: Props) => (
  <Title style={[styles.text, { color: text }, style]}>{children}</Title>
);

const styles = StyleSheet.create({
  text: {
    marginTop: 22,
    marginBottom: 18,
    marginHorizontal: 24,
  },
});

export default withTheme(DialogTitle);
