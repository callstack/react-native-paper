import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';
import { TouchableRipple, withTheme } from 'react-native-paper';

const ExampleListRow = ({ title, theme, onPress }) => (
  <TouchableRipple
    style={[styles.item, { backgroundColor: theme.colors.paper }]}
    onPress={onPress}
  >
    <Text style={[styles.text, { color: theme.colors.text }]}>{title}</Text>
  </TouchableRipple>
);

ExampleListRow.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  theme: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  item: {
    padding: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default withTheme(ExampleListRow);
