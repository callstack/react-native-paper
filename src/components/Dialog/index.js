/* @flow */

import React, { PureComponent, Children } from 'react';
import {
  Animated,
  View,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
  BackAndroid,
} from 'react-native';
import PropTypes from 'prop-types';
import ThemedPortal from '../Portal/ThemedPortal';
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

type DefaultProps = {
  dismissable: boolean,
  visible: boolean,
};

type State = {
  opacity: Animated.Value,
  rendered: boolean,
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

export default class Dialog extends PureComponent<DefaultProps, Props, State> {
  static Actions = Actions;
  static Title = Title;
  static Content = Content;
  static ScrollArea = ScrollArea;

  static propTypes = {
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

  static defaultProps = {
    dismissable: true,
    titleColor: black,
    visible: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(props.visible ? 1 : 0),
      rendered: props.visible,
    };
  }

  state: State;

  componentWillReceiveProps({ visible }: Props) {
    if (this.props.visible !== visible) {
      if (visible) {
        this.setState({
          rendered: true,
        });
      }
    }
  }

  componentDidUpdate({ visible }: Props) {
    if (visible !== this.props.visible) {
      if (this.props.visible) {
        this._showDialog();
      } else {
        this._hideDialog();
      }
    }
  }

  _handleBack = () => {
    if (this.props.dismissable) {
      this._hideDialog();
    }
    return true;
  };

  _showDialog = () => {
    BackAndroid.addEventListener('hardwareBackPress', this._handleBack);
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 300,
      easing: Easing.easing,
    }).start();
  };

  _hideDialog = () => {
    BackAndroid.removeEventListener('hardwareBackPress', this._handleBack);
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 300,
      easing: Easing.easing,
    }).start(() => {
      if (this.props.visible && this.props.onRequestClose) {
        this.props.onRequestClose();
      }
      global.requestAnimationFrame(() => {
        if (this.props.visible) {
          this._showDialog();
        } else {
          this.setState({
            rendered: false,
          });
        }
      });
    });
  };

  render() {
    if (!this.state.rendered) return null;

    const { children, dismissable, style } = this.props;
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
          {dismissable &&
            <TouchableWithoutFeedback onPress={this._hideDialog}>
              <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>}
          <AnimatedPaper
            elevation={24}
            style={[{ opacity: this.state.opacity }, styles.container, style]}
          >
            <View style={styles.contentArea}>
              {title}
              {restOfChildrenWithoutTitle}
            </View>
            {actionBtnsChildren}
          </AnimatedPaper>
        </Animated.View>
      </ThemedPortal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 26,
    borderRadius: 2,
    backgroundColor: white,
  },
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
});
