/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  /**
   * Content of the `DialogContent`.
   */
  children: React.Node,
  style?: any,
};

/**
 * A component to show content in a Dialog.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Dialog, DialogContent, Paragraph } from 'react-native-paper';
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
 *         <DialogContent>
 *           <Paragraph>This is simple dialog</Paragraph>
 *         </DialogContent>
 *       </Dialog>
 *     );
 *   }
 * }
 * ```
 */
const DialogContent = ({ children, style }: Props) => (
  <View style={[styles.container, style]}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
});

export default DialogContent;
