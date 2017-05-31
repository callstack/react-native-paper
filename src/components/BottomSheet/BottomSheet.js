/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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

type Props = {
  visible: boolean,
  onRequestClose: Function,
  children?: any,
  style?: any,
};

type State = {
  opacity: Animated.Value,
  position: Animated.Value,
  maximized: Animated.Value,
  rendered: boolean,
  screenHeight: number,
  contentHeight: number,
};

const INITIAL_POSITION = 64;
const SWIPE_DISTANCE_THRESHOLD = 80;

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
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      position: new Animated.Value(INITIAL_POSITION),
      maximized: new Animated.Value(0),
      rendered: props.visible,
      contentHeight: 0,
      screenHeight: 0,
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

  _panResponder: any;

  _handleBack = () => {
    this._hideSheet();
    return true;
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
      Animated.spring(this.state.maximized, {
        toValue: 0,
        bounciness: 0,
      }),
    ]).start();
  };

  _hideSheet = () => {
    BackAndroid.removeEventListener('hardwareBackPress', this._handleBack);
    this.state.position.flattenOffset(0);
    Animated.parallel([
      Animated.spring(this.state.opacity, {
        toValue: 0,
        bounciness: 0,
      }),
      Animated.spring(this.state.position, {
        toValue: this.state.contentHeight,
        bounciness: 0,
      }),
      Animated.spring(this.state.maximized, {
        toValue: 0,
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

  _maximizeSheet = () => {
    Animated.parallel([
      Animated.spring(this.state.maximized, {
        toValue: 1,
        bounciness: 0,
      }),
      Animated.spring(this.state.position, {
        toValue: 0,
        bounciness: 0,
      }),
    ]).start();
  };

  _unMaximizeSheet = () => {
    Animated.parallel([
      Animated.spring(this.state.maximized, {
        toValue: 0,
        bounciness: 0,
      }),
      Animated.spring(this.state.position, {
        toValue: 0,
        bounciness: 0,
      }),
    ]).start();
  };

  _getVisibleHeight = (screenHeight: number, contentHeight: number) => {
    const maxVisibleHeight = screenHeight * (9 / 16);
    return Math.min(maxVisibleHeight, contentHeight);
  };

  _getContentOffset = (screenHeight: number, contentHeight: number) => {
    return screenHeight - this._getVisibleHeight(screenHeight, contentHeight);
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
    if (Math.abs(gestureState.dy) > Math.abs(gestureState.dx)) {
      this.state.position.setValue(gestureState.dy);
    }
  };

  _releaseGesture = (evt, gestureState) => {
    const isMovingDown = gestureState.dy > 0;
    const isFast =
      gestureState.vy > 0.75 ||
      Math.abs(gestureState.dy) > SWIPE_DISTANCE_THRESHOLD;
    this.state.maximized.stopAnimation((maximized: number) => {
      const { screenHeight, contentHeight } = this.state;
      const canMaximize = contentHeight > screenHeight;
      if (isMovingDown) {
        if (maximized) {
          if (isFast) {
            this._unMaximizeSheet();
          }
        } else {
          if (isFast) {
            this._hideSheet();
          } else {
            this._showSheet();
          }
        }
      } else {
        if (canMaximize && !maximized) {
          this._maximizeSheet();
        }
      }
    });
  };

  _handleContentLayout = e => {
    const contentHeight = e.nativeEvent.layout.height;
    this.setState({
      contentHeight,
    });
  };

  _handleScreenLayout = e => {
    const screenHeight = e.nativeEvent.layout.height;
    this.setState({
      screenHeight,
    });
  };

  render() {
    const {
      rendered,
      opacity,
      position,
      maximized,
      contentHeight,
      screenHeight,
    } = this.state;
    if (!rendered) {
      return null;
    }
    const contentOffset = this._getContentOffset(screenHeight, contentHeight);
    const contentTranslate = Animated.diffClamp(
      Animated.add(
        position,
        maximized.interpolate({
          inputRange: [0, 1],
          outputRange: [contentOffset, 0],
        })
      ),
      screenHeight - contentHeight,
      screenHeight
    );
    const contentOpacity = screenHeight && contentHeight ? opacity : 0;
    return (
      <ThemedPortal>
        <View
          onLayout={this._handleScreenLayout}
          style={StyleSheet.absoluteFill}
        >
          <TouchableWithoutFeedback
            style={styles.container}
            onPress={this._hideSheet}
          >
            <Animated.View
              style={[styles.container, styles.overlay, { opacity }]}
            />
          </TouchableWithoutFeedback>
          <Animated.View
            {...this._panResponder.panHandlers}
            onLayout={this._handleContentLayout}
            style={[
              styles.sheet,
              {
                opacity: contentOpacity,
                transform: [{ translateY: contentTranslate }],
              },
            ]}
          >
            <Paper elevation={12} style={this.props.style}>
              {this.props.children}
            </Paper>
          </Animated.View>
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
    top: 0,
    left: 0,
    right: 0,
  },
});
