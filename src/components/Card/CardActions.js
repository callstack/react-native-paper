/* @flow */

import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

type Props = {
  style?: any;
}

const CardActions = (props: Props) => {
  return <View {...props} style={[ styles.container, props.style ]} />;
};

CardActions.propTypes = {
  style: View.propTypes.style,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default CardActions;
