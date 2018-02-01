/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  /**
   * Content of the `DialogScrollArea`.
   */
  children: React.Node,
  style?: any,
};

/**
 * A component to show a scrollable content in a Dialog.
 *
 * ## Usage
 * ```js
 * export default class MyComponent extends React.Component {
 *   state = {
 *     visible: false,
 *   };
 *
 *   _hideDialog = () => this.setState({ visble: false });
 *
 *   render() {
 *     return (
 *       <Dialog
 *         visible={this.state.visible}
 *         onRequestClose={this._hideDialog}>
 *         <DialogScrollArea>
 *           <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
 *             This is a scrollable area
 *           </ScrollView>
 *         </DialogScrollArea>
 *       </Dialog>
 *     );
 *   }
 * }
 * ```
 */
const DialogScrollArea = ({ children, style }: Props) => (
  <View style={[styles.container, style]}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    borderColor: 'rgba(0, 0, 0, .12)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 24,
  },
});

export default DialogScrollArea;
