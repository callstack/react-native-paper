/* @flow */

import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

type Props = {
  children?: any,
  style?: any,
};

const DialogActions = (props: Props) => {
  return (
    <View {...props} style={[styles.container, props.style]}>
      {Children.map(props.children, child =>
        React.cloneElement(child, {
          compact: true,
        })
      )}
    </View>
  );
};

DialogActions.propTypes = {
  children: PropTypes.node.isRequired,
  style: View.propTypes.style,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 4,
  },
});

export default DialogActions;
