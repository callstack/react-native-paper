/* @flow */

import React, { Children } from 'react';
import { Animated, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import { black, white } from '../../styles/colors';
import Paper from '../Paper';
import Actions from './Actions';
import Title from './Title';
import Content from './Content';
import ScrollArea from './ScrollArea';

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
  const title = childrenArray.find(child => child.type === Title);
  const actionBtnsChildren = childrenArray.filter(
    child => child.type === Actions
  );
  const restOfChildren = childrenArray.filter(
    child => child.type !== Actions && child.type !== Title
  );
  let restOfChildrenWithoutTitle = restOfChildren;
  if (!title) {
    restOfChildrenWithoutTitle = restOfChildren.map(child => {
      if (child.type === Content) {
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

Dialog.Actions = Actions;
Dialog.Title = Title;
Dialog.Content = Content;
Dialog.ScrollArea = ScrollArea;

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
     * This is a fix for Android because overflow: visible isn't supported.
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
