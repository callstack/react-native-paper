import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import PaperTitle from '../Typography/Title';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types/Theme';

type Props = {
  children: any,
  color?: string,
  theme: Theme,
};

const Title = ({ children, theme: { colors: { text } }, color }: Props) => (
  <PaperTitle style={[styles.text, { color: color || text, margin: 0 }]}>
    {children}
  </PaperTitle>
);

const styles = StyleSheet.create({
  text: {
    /**
     * I subtracted 2 from these values because Text component has 
     * 2 pixels margin vertically by default
     */
    margin: 0,
    paddingTop: 22,
    paddingBottom: 18,
    paddingHorizontal: 24,
  },
});

Title.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  theme: PropTypes.object.isRequired,
};

export default withTheme(Title);
