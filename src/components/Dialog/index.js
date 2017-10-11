/* @flow */

import React, { Children } from 'react';
import { StyleSheet, Platform, Animated } from 'react-native';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import { black, white } from '../../styles/colors';
import Paper from '../Paper';
import DialogActions from './Actions';
import DialogTitle from './Title';
import DialogContent from './Content';
import DialogScrollArea from './ScrollArea';

const AnimatedPaper = Animated.createAnimatedComponent(Paper);

type Props = {
  children?: any,
  dismissable?: boolean,
  onRequestClose?: Function,
  style?: any,
  visible: boolean,
};

/**
 * Dialogs inform users about a specific task and may contain critical information, require decisions, or involve multiple tasks.
 *
 * ```
 * export default class MyComponent extends Component {
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

const Dialog = (props: Props) => {
  const { children, dismissable, onRequestClose, visible, style } = props;
  const childrenArray = Children.toArray(children);
  const title = childrenArray.find(child => child.type === DialogTitle);
  const actionBtnsChildren = childrenArray.filter(
    child => child.type === DialogActions
  );
  const restOfChildren = childrenArray.filter(
    child => child.type !== DialogActions && child.type !== DialogTitle
  );
  let restOfChildrenWithoutTitle = restOfChildren;
  if (!title) {
    let found = false;
    restOfChildrenWithoutTitle = restOfChildren.map(child => {
      if (child.type === DialogContent && !found) {
        found = true;
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
      <AnimatedPaper style={[styles.container, style]} elevation={24}>
        {title}
        {restOfChildrenWithoutTitle}
        {actionBtnsChildren}
      </AnimatedPaper>
    </Modal>
  );
};

Dialog.Actions = DialogActions;
Dialog.Title = DialogTitle;
Dialog.Content = DialogContent;
Dialog.ScrollArea = DialogScrollArea;

Dialog.propTypes = {
  children: PropTypes.node.isRequired,
  /**
   * Determines whether clicking outside the dialog dismiss it, true by default
   */
  dismissable: PropTypes.bool,
  /**
   * Callback that is called when the user dismisses the dialog
   */
  onRequestClose: PropTypes.func.isRequired,
  style: PropTypes.object,
  /**
   * Determines Whether the dialog is visible
   */
  visible: PropTypes.bool,
};

Dialog.defaultProps = {
  dismissable: true,
  titleColor: black,
  visible: false,
};

export default Dialog;

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
  },
});
