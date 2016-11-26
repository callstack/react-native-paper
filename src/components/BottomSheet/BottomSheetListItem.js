/* @flow */

import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import TouchableRipple from '../TouchableRipple';
import Icon from '../Icon';
import Text from '../Typography/Text';
import { black } from '../../styles/colors';

type Props = {
  icon?: string;
  label: string;
  style?: any;
}

const BottomSheetListItem = (props: Props) => {
  return (
    <TouchableRipple {...props}>
      <View style={styles.container}>
        {props.icon ?
          <Icon
            name={props.icon}
            size={24}
            style={styles.icon}
          /> : null
        }
        <Text style={styles.label}>{props.label}</Text>
      </View>
    </TouchableRipple>
  );
};

BottomSheetListItem.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  style: View.propTypes.style,
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  icon: {
    height: 24,
    width: 24,
    color: black,
    opacity: 0.64,
    marginRight: 32,
  },
  label: {
    fontSize: 16,
    color: black,
  },
});

export default BottomSheetListItem;
