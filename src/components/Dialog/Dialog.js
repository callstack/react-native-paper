/* @flow */

import * as React from 'react';
import { StyleSheet, Platform, Animated } from 'react-native';
import Modal from '../Modal';
import { black, white } from '../../styles/colors';
import Paper from '../Paper';
import DialogActions from './DialogActions';
import DialogTitle from './DialogTitle';
import DialogContent from './DialogContent';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types';

const AnimatedPaper = Animated.createAnimatedComponent(Paper);

type Props = {
  children: React.Node,
  /**
   * Determines whether clicking outside the dialog dismiss it, true by default
   */
  dismissable?: boolean,
  /**
   * Callback that is called when the user dismisses the dialog
   */
  onRequestClose: Function,
  /**
   * Determines Whether the dialog is visible
   */
  visible: boolean,
  theme: Theme,
  style?: any,
};

/**
 * Dialogs inform users about a specific task and may contain critical information, require decisions, or involve multiple tasks.
 *
 * ```js
 * export default class MyComponent extends React.Component {
 *   state = {
 *     visible: false,
 *   };
 *
 *   _showDialog = () => this.setState({ visble: true });
 *   _hideDialog = () => this.setState({ visble: false });
 *
 *   render() {
 *     const { visible } = this.state;
 *     return (
 *       <View>
 *         <Button onPress={this._showDialog}>Show Dialog</Button>
 *         <Dialog
 *            visible={visible}
 *            onRequestClose={this._hideDialog}
 *         >
 *           <Dialog.Title>Alert</Dialog.Title>
 *           <Dialog.Content>
 *             <Paragraph>This is simple dialog</Paragraph>
 *           </Dialog.Content>
 *           <Dialog.Actions>
 *             <Button onPress={this._hideDialog}>Done</Button>
 *           </Dialog.Actions>
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
      onRequestClose,
      visible,
      style,
      theme,
    } = this.props;

    const backgroundColor = theme.colors.paper;

    const childrenArray = React.Children.toArray(children);
    /* $FlowFixMe */
    const title = childrenArray.find(child => child.type === DialogTitle);
    const actionBtnsChildren = childrenArray.filter(
      /* $FlowFixMe */
      child => child && child.type === DialogActions
    );
    const restOfChildren = childrenArray.filter(
      child =>
        /* $FlowFixMe */
        child && child.type !== DialogActions && child.type !== DialogTitle
    );
    let restOfChildrenWithoutTitle = restOfChildren;
    if (!title) {
      let found = false;
      restOfChildrenWithoutTitle = restOfChildren.map(child => {
        if (child.type === DialogContent && !found) {
          found = true;
          /* $FlowFixMe */
          return React.cloneElement(child, {
            style: { paddingTop: 24 },
          });
        } else {
          return child;
        }
      });
    }
    return (
      <Modal
        dismissable={dismissable}
        onRequestClose={onRequestClose}
        visible={visible}
      >
        <AnimatedPaper style={[styles.container, { backgroundColor }, style]}>
          {title}
          {restOfChildrenWithoutTitle}
          {actionBtnsChildren}
        </AnimatedPaper>
      </Modal>
    );
  }
}

Dialog.defaultProps = {
  dismissable: true,
  titleColor: black,
  visible: false,
};

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
