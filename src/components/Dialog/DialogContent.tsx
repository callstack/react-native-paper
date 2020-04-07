import * as React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';

type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Content of the `DialogContent`.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * A component to show content in a Dialog.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Paragraph, Dialog, Portal } from 'react-native-paper';
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
 *           <Dialog.Content>
 *             <Paragraph>This is simple dialog</Paragraph>
 *           </Dialog.Content>
 *         </Dialog>
 *       </Portal>
 *     );
 *   }
 * }
 * ```
 */
class DialogContent extends React.Component<Props> {
  static displayName = 'Dialog.Content';

  render() {
    return (
      <View {...this.props} style={[styles.container, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
});

export default DialogContent;
