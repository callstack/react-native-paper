/* @flow */

import React, {
  PureComponent,
  PropTypes,
  Children,
} from 'react';
import {
  Animated,
  View,
  Easing,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  BackAndroid,
  ScrollView,
} from 'react-native';
import ThemedPortal from './Portal/ThemedPortal';
import { black, white } from '../styles/colors';
import Paper from './Paper';
import Title from './Typography/Title';
import Card from './Card';

const AnimatedPaper = Animated.createAnimatedComponent(Paper);

type Props = {
  children?: any;
  dismissable?: boolean;
  onRequestClose?: Function;
  title?: string;
  titleColor?: string;
  style?: any;
  visible?: boolean;
}

type DefaultProps = {
  dismissable: boolean;
  titleColor: string;
};

type State = {
  opacity: Animated.Value;
  rendered: boolean;
}

const {
    width: deviceWidth,
    height: deviceHeight,
} = Dimensions.get('window');

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
 *            title='Alert'
 *         >
 *           <Paragraph>This is simple dialog</Paragraph>
 *           <Card.Actions>
 *             <Button onPress={this._hideDialog}>Done</Button>
 *           </Card.Actions>
 *         </Dialog>
 *       </View>
 *     );
 *   }
 * }
 * ```
 */

export default class Dialog extends PureComponent<DefaultProps, Props, State> {

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
    /**
     * The title of the dialog
     */
    title: PropTypes.string,
    /**
     * The color of the title
     */
    titleColor: PropTypes.string,
    style: PropTypes.object,
    /**
     * Determines Whether the dialog is visible
     */
    visible: PropTypes.bool,
  };

  static defaultProps = {
    dismissable: true,
    titleColor: black,
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(props.visible ? 1 : 0),
      rendered: props.visible,
    };
  }

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
  }

  _showDialog = () => {
    BackAndroid.addEventListener('hardwareBackPress', this._handleBack);
    Animated.timing(
      this.state.opacity,
      {
        toValue: 1,
        duration: 300,
        easing: Easing.easing,
      }
    ).start();
  }

  _hideDialog = () => {
    BackAndroid.removeEventListener('hardwareBackPress', this._handleBack);
    Animated.timing(
      this.state.opacity,
      {
        toValue: 0,
        duration: 300,
        easing: Easing.easing,
      }
    ).start(() => {
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

    const {
      children,
      dismissable,
      title,
      titleColor,
      style,
    } = this.props;
    const childrenArray = Children.toArray(children);
    const actionBtnsChildren = childrenArray.filter(child => child.type === Card.Actions);
    const restOfChildren = childrenArray.filter(child => child.type !== Card.Actions);

    return (
      <ThemedPortal>
        <Animated.View
          style={[ { opacity: this.state.opacity }, styles.wrapper ]}
        >
          <View style={[ StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, .5)' } ]}/>
          {dismissable && <TouchableWithoutFeedback onPress={this._hideDialog}>
              <View style={StyleSheet.absoluteFill}/>
          </TouchableWithoutFeedback>}
          <AnimatedPaper elevation={24} style={[ { opacity: this.state.opacity }, styles.container, style ]}>
              {title && <Title style={[ styles.title, { color: titleColor } ]}>{title}</Title>}
              <ScrollView style={styles.scrollViewContainer}>
                <View>
                  {restOfChildren}
                </View>
              </ScrollView>
              <View>{actionBtnsChildren}</View>
          </AnimatedPaper>
        </Animated.View>
      </ThemedPortal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 96,
    maxHeight: deviceHeight / 2,
    width: deviceWidth - 52,
    borderRadius: 2,
    backgroundColor: white,
  },
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    marginBottom: 20,
    marginTop: 24,
    marginHorizontal: 24,
    lineHeight: 24,
  },
});
