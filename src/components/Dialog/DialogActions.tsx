import * as React from 'react';
import { StyleSheet, StyleProp, View, ViewStyle } from 'react-native';

type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Content of the `DialogActions`.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * A component to show a list of actions in a Dialog.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/dialog-actions.png" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Button, Dialog, Portal } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(false);
 *
 *   const hideDialog = () => setVisible(false);
 *
 *   return (
 *     <Portal>
 *       <Dialog visible={visible} onDismiss={hideDialog}>
 *         <Dialog.Actions>
 *           <Button onPress={() => console.log('Cancel')}>Cancel</Button>
 *           <Button onPress={() => console.log('Ok')}>Ok</Button>
 *         </Dialog.Actions>
 *       </Dialog>
 *     </Portal>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
class DialogActions extends React.Component<Props> {
  static displayName = 'Dialog.Actions';

  render() {
    return (
      <View {...this.props} style={[styles.container, this.props.style]}>
        {React.Children.map(this.props.children, child =>
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
