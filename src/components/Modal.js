/* @flow */

import * as React from 'react';
import {
  Animated,
  View,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
  BackHandler,
} from 'react-native';
import { polyfill } from 'react-lifecycles-compat';
import ThemedPortal from './Portal/ThemedPortal';

type Props = {
  /**
   * Determines whether clicking outside the modal dismiss it.
   */
  dismissable?: boolean,
  /**
   * Callback that is called when the user dismisses the modal.
   */
  onDismiss: () => mixed,
  /**
   * Determines Whether the modal is visible.
   */
  visible: boolean,
  /**
   * Content of the `Modal`.
   */
  children: React.Node,
};

type State = {
  opacity: Animated.Value,
  rendered: boolean,
};

/**
 * The Modal component is a simple way to present content above an enclosing view.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Modal, Text } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     visible: false,
 *   };
 *
 *   _showModal = () => this.setState({ visible: true });
 *   _hideModal = () => this.setState({ visible: false });
 *
 *   render() {
 *     const { visible } = this.state;
 *     return (
 *       <Modal visible={visible} onDismiss={this._hideModal}>
 *         <Text>Example Modal</Text>
 *       </Modal>
 *     );
 *   }
 * }
 * ```
 */

class Modal extends React.Component<Props, State> {
  static defaultProps = {
    dismissable: true,
    visible: false,
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.visible && !prevState.rendered) {
      return {
        rendered: true,
      };
    }

    return null;
  }

  state = {
    opacity: new Animated.Value(this.props.visible ? 1 : 0),
    rendered: this.props.visible,
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this._showModal();
      } else {
        this._hideModal();
      }
    }
  }

  _handleBack = () => {
    if (this.props.dismissable) {
      this._hideModal();
    }
    return true;
  };

  _showModal = () => {
    BackHandler.addEventListener('hardwareBackPress', this._handleBack);
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 280,
      easing: Easing.ease,
    }).start();
  };

  _hideModal = () => {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBack);
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 280,
      easing: Easing.ease,
    }).start(() => {
      if (this.props.visible && this.props.onDismiss) {
        this.props.onDismiss();
      }
      if (this.props.visible) {
        this._showModal();
      } else {
        this.setState({
          rendered: false,
        });
      }
    });
  };

  render() {
    if (!this.state.rendered) return null;

    const { children, dismissable } = this.props;
    return (
      <ThemedPortal>
        <Animated.View
          style={[{ opacity: this.state.opacity }, styles.wrapper]}
        >
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 'rgba(0, 0, 0, .5)' },
            ]}
          />
          {dismissable && (
            <TouchableWithoutFeedback onPress={this._hideModal}>
              <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>
          )}
          <Animated.View style={[{ opacity: this.state.opacity }]}>
            {children}
          </Animated.View>
        </Animated.View>
      </ThemedPortal>
    );
  }
}

polyfill(Modal);

export default Modal;

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
});
