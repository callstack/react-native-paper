/* @flow */

import React, {
  Component,
  PropTypes
} from 'react';
import {
  Animated,
  View,
  StyleSheet
} from 'react-native';
import withTheme from '../core/withTheme';
import TouchableRipple from './TouchableRipple';

var Dimensions = require('Dimensions');

let SCREEN_HEIGHT = Dimensions.get('window').height;
let SCREEN_WIDTH = Dimensions.get('window').width;
let FAB_SIZE = 56;
let FAB_MINI_SIZE = 40;
let ICON_SIZE = 24;

let FABDirection = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
};

type DefaultProps = {
  elevation: number;
}

type Props = {
  direction: string;
  mini?: string;
  animateIcon?: bool;
  open?: bool;
}

type State = {
  toolbarCircleScale: Animated.Value;
  pressed: bool;
  displayToolbarButtons: bool;
}

class FABToolbar extends Component<DefaultProps, Props, State> {
  static Direction = FABDirection;

  static propTypes = {
    children: PropTypes.node.isRequired,
    elevation: PropTypes.number,
    direction: PropTypes.string,
    style: View.propTypes.style
  };

  static defaultProps = {
    elevation: 2
  };

  constructor(props) {
    super(props);
    this.state = {
      toolbarCircleScale: new Animated.Value(1),
      pressed: false,
      displayToolbarButtons: false
    };
  }

  getToolbarExpandAnim() {
    return Animated.timing(this.state.toolbarCircleScale, {
      toValue: 20, // Large enough value
      duration: 130
    });
  }

  expandToolbar() {
    // TODO: Sequence this after user's animation.
    if (this.props.mini) {
      Animated.sequence([
        Animated.timing(this.state.toolbarCircleScale, {
          toValue: FAB_SIZE/FAB_MINI_SIZE,
          duration: 50
        }),
        this.getToolbarExpandAnim()
      ]).start(
        () => this.setState({displayToolbarButtons: true})
      );
    } else {
      this.getToolbarExpandAnim().start(
        () => this.setState({displayToolbarButtons: true})
      );
    }
  }

  onPress() {
    this.setState({pressed: true}, this.expandToolbar);
  }

  _renderButton() {
    const {
      theme,
      elevation,
      mini
    } = this.props;

    let containerStyle = mini ? styles.containerMini : styles.container;
    let buttonStyle = mini ? styles.buttonMini : styles.button;

    return (
      <View style={[containerStyle, {elevation}]}>
        <TouchableRipple onPress={this.onPress.bind(this)}
          style={[buttonStyle, {backgroundColor: theme.colors.accent}]}>
          <View style={styles.icon}></View>
        </TouchableRipple>
      </View>
    );
  }

  _renderToolbar() {
    const {
      theme,
      elevation,
      direction,
      mini,
      children
    } = this.props;

    let toolbarCircleStyle = mini ? styles.buttonMini : styles.button;
    let toolbarStyle = {position: 'absolute', top: 0};

    switch (direction) {
    case FABDirection.LEFT:
      toolbarStyle.left = 0;
      break;
    case FABDirection.RIGHT:
      toolbarStyle.right = 0;
      break;
    default:
      toolbarStyle.left = 0;
    }

    let content;
    if (this.state.displayToolbarButtons) {
      content = children;
    }

    return (
      <View style={[styles.toolbarContainer, {elevation}]}>
        <View style={toolbarStyle}>
          <Animated.View style={[
              toolbarCircleStyle,
              {backgroundColor: theme.colors.accent},
              {transform: [{scale: this.state.toolbarCircleScale}]}
          ]}>
          </Animated.View>
        </View>
        {content}
      </View>
    );
  }

  render() {
    return this.state.pressed ? this._renderToolbar() : this._renderButton();
  }
}

var styles = StyleSheet.create({
  container: {
    height: FAB_SIZE,
    width: FAB_SIZE,
    borderRadius: FAB_SIZE/2, // For circular shape
  },
  containerMini: {
    height: FAB_MINI_SIZE,
    width: FAB_MINI_SIZE,
    borderRadius: FAB_MINI_SIZE/2
  },
  toolbarContainer: {
    height: FAB_SIZE,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center'
  },
  toolbarCircle: {
    height: FAB_SIZE,
    width: FAB_SIZE,
    borderRadius: FAB_SIZE/2
  },
  button: {
    height: FAB_SIZE,  // TODO: Figure out how to avoid specifying height/width
    width: FAB_SIZE,
    borderRadius: FAB_SIZE/2
  },
  buttonMini: {
    height: FAB_MINI_SIZE,  // TODO: Figure out how to avoid specifying height/width
    width: FAB_MINI_SIZE,
    borderRadius: FAB_MINI_SIZE/2
  },
  icon: {
    height: ICON_SIZE,
    width: ICON_SIZE
  }
});

export default withTheme(FABToolbar);
