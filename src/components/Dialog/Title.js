/* @flow */

import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import PaperTitle from '../Typography/Title';
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
  <PaperTitle style={[styles.text, { color: text }, style]}>
    {children}
  </PaperTitle>
);

const styles = StyleSheet.create({
  text: {
    marginTop: 22,
    marginBottom: 18,
    marginHorizontal: 24,
  },
});

DialogTitle.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  theme: PropTypes.object.isRequired,
};

export default withTheme(DialogTitle);
