/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  children: React.Node,
  style?: any,
};

const DialogActions = (props: Props) => {
  return (
    <View {...props} style={[styles.container, props.style]}>
      {React.Children.map(
        props.children,
        child =>
          typeof child === 'object' && child !== null
            ? /* $FlowFixMe */
              React.cloneElement(child, {
                compact: true,
              })
            : child
      )}
    </View>
  );
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
