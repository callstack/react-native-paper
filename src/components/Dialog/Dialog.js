/* @flow */

import * as React from 'react';
import { StyleSheet, Platform } from 'react-native';
import Modal from '../Modal';
import DialogContent from './DialogContent';
import DialogActions from './DialogActions';
import DialogTitle from './DialogTitle';
import DialogScrollArea from './DialogScrollArea';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';

type Props = {|
  /**
   * Determines whether clicking outside the dialog dismiss it.
   */
  dismissable?: boolean,
  /**
   * Callback that is called when the user dismisses the dialog.
   */
  onDismiss?: () => mixed,
  /**
   * Determines Whether the dialog is visible.
   */
  visible: boolean,
  /**
   * Content of the `Dialog`.
   */
  children: React.Node,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
|};

/**
 * Dialogs inform users about a specific task and may contain critical information, require decisions, or involve multiple tasks.
 * To render the `Dialog` above other components, you'll need to wrap it with the [`Portal`](portal.html) component.
 *
 *  <div class="screenshots">
 *   <img class="medium" src="screenshots/dialog-1.png" />
 *   <img class="medium" src="screenshots/dialog-2.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     visible: false,
 *   };
 *
 *   _showDialog = () => this.setState({ visible: true });
 *
 *   _hideDialog = () => this.setState({ visible: false });
 *
 *   render() {
 *     return (
 *       <View>
 *         <Button onPress={this._showDialog}>Show Dialog</Button>
 *         <Portal>
 *           <Dialog
 *              visible={this.state.visible}
 *              onDismiss={this._hideDialog}>
 *             <Dialog.Title>Alert</Dialog.Title>
 *             <Dialog.Content>
 *               <Paragraph>This is simple dialog</Paragraph>
 *             </Dialog.Content>
 *             <Dialog.Actions>
 *               <Button onPress={this._hideDialog}>Done</Button>
 *             </Dialog.Actions>
 *           </Dialog>
 *         </Portal>
 *       </View>
 *     );
 *   }
 * }
 * ```
 */
class Dialog extends React.Component<Props, void> {
  // @component ./DialogContent.js
  static Content = DialogContent;
  // @component ./DialogActions.js
  static Actions = DialogActions;
  // @component ./DialogTitle.js
  static Title = DialogTitle;
  // @component ./DialogScrollArea.js
  static ScrollArea = DialogScrollArea;

  static defaultProps = {
    dismissable: true,
    visible: false,
  };

  render() {
    const {
      children,
      dismissable,
      onDismiss,
      visible,
      style,
      theme,
    } = this.props;

    return (
      <Modal
        dismissable={dismissable}
        onDismiss={onDismiss}
        visible={visible}
        contentContainerStyle={[
          {
            borderRadius: theme.roundness,
            backgroundColor: theme.colors.surface,
          },
          styles.container,
          style,
        ]}
      >
        {React.Children.toArray(children)
          .filter(child => child != null && typeof child !== 'boolean')
          .map((child, i) => {
            if (
              i === 0 &&
              React.isValidElement(child) &&
              child.type === DialogContent
            ) {
              // Dialog content is the first item, so we add a top padding
              return React.cloneElement(child, {
                style: [{ paddingTop: 24 }, child.props.style],
              });
            }

            return child;
          })}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    /**
     * This prevents the shadow from being clipped on Android since Android
     * doesn't support `overflow: visible`.
     * One downside for this fix is that it will disable clicks on the area
     * of the shadow around the dialog, consequently, if you click around the
     * dialog (44 pixel from the top and bottom) it won't be dismissed.
     */
    marginVertical: Platform.OS === 'android' ? 44 : 0,
    marginHorizontal: 26,
    elevation: 24,
    justifyContent: 'flex-start',
  },
});

export default withTheme(Dialog);
