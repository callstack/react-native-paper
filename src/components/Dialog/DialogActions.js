/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = React.ElementConfig<typeof View> & {
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
 * import { Button, Dialog, Portal } from 'react-native-paper';
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
 *       <Portal>
 *         <Dialog
 *           visible={this.state.visible}
 *           onDismiss={this._hideDialog}>
 *           <Dialog.Actions>
 *             <Button onPress={() => console.log("Cancel")}>Cancel</Button>
 *             <Button onPress={() => console.log("Ok")}>Ok</Button>
 *           </Dialog.Actions>
 *         </Dialog>
 *       </Portal>
 *     );
 *   }
 * }
 * ```
 */
class DialogActions extends React.Component<Props> {
  static displayName = 'Dialog.Actions';

  render() {
    return (
      <View {...this.props} style={[styles.container, this.props.style]}>
        {React.Children.map(
          this.props.children,
          child =>
            React.isValidElement(child)
              ? React.cloneElement(child, {
                  compact: true,
                })
              : child
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 8,
  },
});

export default DialogActions;
