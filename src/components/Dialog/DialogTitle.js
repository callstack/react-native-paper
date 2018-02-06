/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import Title from '../Typography/Title';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types';

type Props = {
  /**
   * Title text for the `DialogTitle`.
   */
  children: React.Node,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * A component to show a title in a Dialog.
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
 *         <DialogTitle>This is a title</DialogTitle>
 *         <DialogContent>
 *           <Paragraph>This is simple dialog</Paragraph>
 *         </DialogContent>
 *       </Dialog>
 *     );
 *   }
 * }
 * ```
 */
const DialogTitle = ({
  children,
  theme: { colors: { text } },
  style,
}: Props) => (
  <Title style={[styles.text, { color: text }, style]}>{children}</Title>
);

const styles = StyleSheet.create({
  text: {
    marginTop: 22,
    marginBottom: 18,
    marginHorizontal: 24,
  },
});

export default withTheme(DialogTitle);
