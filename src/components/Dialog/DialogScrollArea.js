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
 * A component to show a scrollable content in a Dialog. The component only provides appropriate styling.
 * For the scrollable content you can use `ScrollView`, `FlatList` etc. depending on your requirement.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { ScrollView } from 'react-native';
 * import { Dialog, DialogScrollArea } from 'react-native-paper';
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
