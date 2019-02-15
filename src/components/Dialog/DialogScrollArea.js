/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  /**
   * Content of the `DialogScrollArea`.
   */
  children:
    | React.Node
    | ((scrollViewProps: {
        contentContainerStyle: any,
      }) => React.Node),
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
 * import { Dialog, Portal } from 'react-native-paper';
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
 *           <Dialog.ScrollArea>
 *             {(scrollViewProps) =>
 *               <ScrollView {...scrollViewProps}>
 *                 This is a scrollable area
 *               </ScrollView>
 *             }
 *           </Dialog.ScrollArea>
 *         </Dialog>
 *       </Portal>
 *     );
 *   }
 * }
 * ```
 */
class DialogScrollArea extends React.Component<Props> {
  static displayName = 'Dialog.ScrollArea';

  render() {
    const { children } = this.props;

    return (
      <View {...this.props} style={[styles.container, this.props.style]}>
        {typeof children === 'function' ? (
          children({
            contentContainerStyle: styles.contentContainer,
          })
        ) : (
          <View style={styles.contentContainer}>{children}</View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderColor: 'rgba(0, 0, 0, .12)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexGrow: 1,
    flexShrink: 1,
  },

  contentContainer: {
    paddingHorizontal: 24,
  },
});

export default DialogScrollArea;
