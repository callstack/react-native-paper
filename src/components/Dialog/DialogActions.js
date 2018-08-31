/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  /**
   * Content of the `DialogActions`.
   */
  children: React.Node,
  style?: any,
};

/**
 * A component to show a list of actions in a Dialog.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Button, Dialog, DialogActions } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     visible: false,
 *   };
 *
 *   _hideDialog = () => this.setState({ visible: false });
 *
 *   render() {
 *     return (
 *       <Dialog
 *         visible={this.state.visible}
 *         onDismiss={this._hideDialog}>
 *         <DialogActions>
 *           <Button onPress={() => console.log("Cancel")}>Cancel</Button>
 *           <Button onPress={() => console.log("Ok")}>Ok</Button>
 *         </DialogActions>
 *       </Dialog>
 *     );
 *   }
 * }
 * ```
 */
const DialogActions = (props: Props) => (
  <View {...props} style={[styles.container, props.style]}>
    {React.Children.map(
      props.children,
      child =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              compact: true,
            })
          : child
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 4,
  },
});

export default DialogActions;
