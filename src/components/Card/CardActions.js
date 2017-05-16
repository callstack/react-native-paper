/* @flow */

import React, { PropTypes, Children } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  children?: any,
  style?: any,
};

const CardActions = (props: Props) => {
  return (
    <View {...props} style={[styles.container, props.style]}>
      {Children.map(props.children, child =>
        React.cloneElement(child, {
          compact: child.props.compact !== false,
        }),
      )}
    </View>
  );
};

CardActions.propTypes = {
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

export default CardActions;
