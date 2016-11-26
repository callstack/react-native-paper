/* @flow */

import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Text from '../Typography/Text';
import { black } from '../../styles/colors';

type Props = {
  title?: string;
  children?: any;
  style?: any;
}

const BottomSheetList = (props: Props) => {
  return (
    <View {...props} style={[ styles.container, props.style ]}>
      {typeof props.title === 'string' ?
        <Text style={styles.title}>{props.title}</Text> : null
      }
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
    color: black,
    opacity: 0.5,
    margin: 16,
  },
});

export default BottomSheetList;
