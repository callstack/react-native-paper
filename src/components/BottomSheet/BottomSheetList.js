/* @flow */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Text from '../Typography/Text';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types/Theme';

type Props = {
  title?: string,
  children?: any,
  style?: any,
  theme: Theme,
};

const BottomSheetList = (props: Props) => {
  const { text } = props.theme.colors;
  return (
    <View {...props} style={[styles.container, props.style]}>
      {typeof props.title === 'string'
        ? <Text style={[styles.title, { color: text }]}>
            {props.title}
          </Text>
        : null}
      {props.children}
    </View>
  );
};

BottomSheetList.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  style: View.propTypes.style,
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  title: {
    fontSize: 16,
    opacity: 0.5,
    margin: 16,
  },
});

export default withTheme(BottomSheetList);
