/* @flow */

import React, {
  PropTypes,
  PureComponent,
} from 'react';
import {
  Animated,
  BackAndroid,
  PanResponder,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Paper from '../Paper';
import ThemedPortal from '../Portal/ThemedPortal';
import BottomSheetList from './BottomSheetList';
import BottomSheetListItem from './BottomSheetListItem';

const AnimatedPaper = Animated.createAnimatedComponent(Paper);

type Props = {
  visible: boolean;
  onRequestClose: Function;
  children?: any;
  style?: any;
}

type State = {
  opacity: Animated.Value;
  position: Animated.Value;
  rendered: boolean;
}

const INITIAL_POSITION = 64;

/**
 * Bottom sheets slide up from the bottom of the screen to reveal more content
 *
 * **Usage:**
 * ```
 * export default class MyComponent extends Component {
 *   state = {
 *     visible: false,
 *   };
 *
 *   _showSheet = () => this.setState({ visble: true });
 *   _hideSheet = () => this.setState({ visble: false });
 *
 *   render() {
 *     return (
 *       <View>
 *         <Button onPress={this._showSheet}>Show</Button>
 *         <BottomSheet visible={this.state.visible} onRequestClose={this._hideSheet}>
 *           <BottomSheet.List title='Create'>
 *             <BottomSheet.ListItem image={require('./icons/docs.png')} label='Document' />
 *             <BottomSheet.ListItem icon='folder' label='Folder' />
 *           </BottomSheet.List>
 *         </BottomSheet>
 *       </View>
 *     );
 *   }
 * }
 * ```
 */
export default class BottomSheet extends PureComponent<void, Props, State> {

  static List = BottomSheetList;
  static ListItem = BottomSheetListItem;

  static propTypes = {
    /**
     * Whether bottom sheet is visible
     */
    visible: PropTypes.bool.isRequired,
    /**
     * Callback is called when the user dismisses the bottom sheet
     */
    onRequestClose: PropTypes.func.isRequired,
    /**
     * Content of the bottom sheet
     */
    children: PropTypes.node.isRequired,
    style: Paper.propTypes.style,
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      position: new Animated.Value(INITIAL_POSITION),
      rendered: props.visible,
    };
  }

  state: State;

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this._canMove,
      onMoveShouldSetPanResponderCapture: this._canMove,
      onPanResponderGrant: this._startGesture,
      onPanResponderMove: this._respondToGesture,
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: this._releaseGesture,
      onPanResponderTerminate: this._releaseGesture,
    });
  }

  componentDidMount() {
    if (this.props.visible) {
      this._showSheet();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.visible !== nextProps.visible) {
      if (nextProps.visible) {
        this.setState({
          rendered: true,
        });
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this._showSheet();
      } else {
        this._hideSheet();
      }
    }
  }

  _height: 0;
  _panResponder: any;

  _handleBack = () => {
    this._hideSheet();
    return true;
  };

  _animateSheet = (opacity: number, position: number, cb) => {
    this.state.position.stopAnimation(value => {
      this.state.position.flattenOffset();
      this.state.position.setValue(value);
      Animated.parallel([
        Animated.timing(this.state.opacity, {
          toValue: opacity,
          duration: 250,
        }),
        Animated.timing(this.state.position, {
          toValue: position,
          duration: 200,
        }),
      ]).start(cb);
    });
  };

  _showSheet = () => {
    BackAndroid.addEventListener('hardwareBackPress', this._handleBack);
    this.state.position.flattenOffset(0);
    Animated.parallel([
      Animated.spring(this.state.opacity, {
        toValue: 1,
        bounciness: 0,
      }),
      Animated.spring(this.state.position, {
        toValue: 0,
        bounciness: 0,
      }),
    ]).start();
  };

  _hideSheet = () => {
    BackAndroid.removeEventListener('hardwareBackPress', this._handleBack);
    this.state.position.flattenOffset();
    Animated.parallel([
      Animated.spring(this.state.opacity, {
        toValue: 0,
        bounciness: 0,
      }),
      Animated.spring(this.state.position, {
        toValue: this._height,
        bounciness: 0,
      }),
    ]).start(() => {
      this.state.position.setValue(INITIAL_POSITION);
      if (this.props.visible) {
        this.props.onRequestClose();
      }
      global.requestAnimationFrame(() => {
        if (this.props.visible) {
          this._showSheet();
        } else {
          this.setState({
            rendered: false,
          });
        }
      });
    });
  };

  _canMove = (evt, gestureState) => {
    return (
      Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
      Math.abs(gestureState.vy) > Math.abs(gestureState.vx)
    );
  };

  _startGesture = () => {
    this.state.position.stopAnimation((value: number) => {
      this.state.position.setOffset(value);
      this.state.position.setValue(0);
    });
  };

  _respondToGesture = (evt, gestureState) => {
    if (gestureState.dy >= 0) {
      this.state.position.setValue(gestureState.dy);
    }
  };

  _releaseGesture = (evt, gestureState) => {
    if ((gestureState.dy > 0 && gestureState.vy > 0.75) || gestureState.dy > (this._height - INITIAL_POSITION)) {
      this._hideSheet();
    } else {
      this._showSheet();
    }
  };

  _handleLayout = (e) => {
    this._height = e.nativeEvent.layout.height;
  };

  render() {
    if (!this.state.rendered) {
      return null;
    }
    const { opacity } = this.state;
    return (
      <ThemedPortal>
        <View style={StyleSheet.absoluteFill}>
          <TouchableWithoutFeedback style={styles.container} onPress={this._hideSheet}>
            <Animated.View style={[ styles.container, styles.overlay, { opacity } ]} />
          </TouchableWithoutFeedback>
            <AnimatedPaper
              {...this._panResponder.panHandlers}
              onLayout={this._handleLayout}
              elevation={12}
              style={[
                styles.sheet,
                { opacity, transform: [ { translateY: this.state.position } ] },
                this.props.style,
              ]}
            >
              {this.props.children}
            </AnimatedPaper>
        </View>
      </ThemedPortal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, .2)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

