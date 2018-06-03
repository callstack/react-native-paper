/* @flow */

import * as React from 'react';
import { StyleSheet, Platform, Animated } from 'react-native';
import Modal from '../Modal';
import { white } from '../../styles/colors';
import Paper from '../Paper';
import DialogActions from './DialogActions';
import DialogTitle from './DialogTitle';
import DialogContent from './DialogContent';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types';

const AnimatedPaper = Animated.createAnimatedComponent(Paper);

type Props = {
  /**
   * Determines whether clicking outside the dialog dismiss it.
   */
  dismissable?: boolean,
  /**
   * Callback that is called when the user dismisses the dialog.
   */
  onDismiss: () => mixed,
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
};

/**
 * Dialogs inform users about a specific task and may contain critical information, require decisions, or involve multiple tasks.
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
 * import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paragraph } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     visible: false,
 *   };
 *
 *   _showDialog = () => this.setState({ visible: true });
 *   _hideDialog = () => this.setState({ visible: false });
 *
 *   render() {
 *     const { visible } = this.state;
 *     return (
 *       <View>
 *         <Button onPress={this._showDialog}>Show Dialog</Button>
 *         <Dialog
 *            visible={visible}
 *            onDismiss={this._hideDialog}
 *         >
 *           <DialogTitle>Alert</DialogTitle>
 *           <DialogContent>
 *             <Paragraph>This is simple dialog</Paragraph>
 *           </DialogContent>
 *           <DialogActions>
 *             <Button onPress={this._hideDialog}>Done</Button>
 *           </DialogActions>
 *         </Dialog>
 *       </View>
 *     );
 *   }
 * }
 * ```
 */
class Dialog extends React.Component<Props, void> {
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

    const backgroundColor = theme.colors.paper;

    const childrenArray = React.Children.toArray(children);
    const title = childrenArray.find(
      child => React.isValidElement(child) && child.type === DialogTitle
    );
    const actionBtnsChildren = childrenArray.filter(
      child => React.isValidElement(child) && child.type === DialogActions
    );
    const restOfChildren = childrenArray.filter(
      child =>
        React.isValidElement(child) &&
        child.type !== DialogActions &&
        child.type !== DialogTitle
    );
    let restOfChildrenWithoutTitle = restOfChildren;
    if (!title) {
      let found = false;
      restOfChildrenWithoutTitle = restOfChildren.map(child => {
        if (
          React.isValidElement(child) &&
          child.type === DialogContent &&
          !found
        ) {
          found = true;
          return React.cloneElement(child, {
            style: { paddingTop: 24 },
          });
        }
        return child;
      });
    }
    return (
      <Modal dismissable={dismissable} onDismiss={onDismiss} visible={visible}>
        <AnimatedPaper style={[styles.container, { backgroundColor }, style]}>
          {title}
          {restOfChildrenWithoutTitle}
          {actionBtnsChildren}
        </AnimatedPaper>
      </Modal>
    );
  }
}

export default withTheme(Dialog);

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
    borderRadius: 2,
    backgroundColor: white,
    elevation: 24,
  },
});
