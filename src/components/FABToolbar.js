/* @flow */

import React, {
  Component,
  PropTypes
} from 'react';
import {
  Animated,
  View,
  Text,
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
  elevation: Animated.Value;
  pressed: bool;
}

class FABToolbar extends Component<DefaultProps, Props, State> {
  static propTypes = {
    elevation: PropTypes.number,
    children: PropTypes.node.isRequired,
    direction: PropTypes.string,
    style: View.propTypes.style
  };

  static defaultProps = {
    elevation: 2
  };

  constructor(props) {
    super(props);
    console.log(Dimensions.get('window'));
    this.state = {
      elevation: new Animated.Value(props.elevation),
      toolbarCircleScale: new Animated.Value(1),
      pressed: false,
      displayToolbarButtons: false
    };
  }

  onPress() {
    let self = this;
    this.setState({pressed: true}, () => {
      // TODO: Sequence this after user's animation.
      Animated.timing(self.state.toolbarCircleScale, {
        toValue: 20,
        duration: 180
      }).start(() => self.setState({displayToolbarButtons: true}));
    });
  }

  _renderButton() {
    let containerStyle = this.props.mini ? styles.containerMini : styles.container;
    return (
        <View style={containerStyle}>
          <TouchableRipple style={styles.button} onPress={this.onPress.bind(this)}>
            <View style={styles.icon}>
            </View>
          </TouchableRipple>
        </View>
    );
  }

  _renderToolbar() {
    var toolbarCircleStyle = {
      transform: [
        {scale: this.state.toolbarCircleScale}
      ]
    };

    let content;
    if (this.state.displayToolbarButtons) {
      content = this.props.children;
    }

    return (
      <View style={styles.toolbarContainer}>
        <View style={{position: 'absolute'}}>
          <Animated.View style={[styles.toolbarCircle, toolbarCircleStyle]}>
          </Animated.View>
        </View>
        {content}
      </View>
    );
  }

  render() {
    const {
      children,
      theme,
      animateIcon
    } = this.props;

    return this.state.pressed ? this._renderToolbar() : this._renderButton();
  }
}

var styles = StyleSheet.create({
  container: {
    elevation: 2,
    height: FAB_SIZE,
    width: FAB_SIZE,
    borderRadius: FAB_SIZE, // For circular shape
  },
  containerMini: {
    elevation: 2,
    height: FAB_MINI_SIZE,
    width: FAB_MINI_SIZE,
    borderRadius: FAB_MINI_SIZE
  },
  toolbarContainer: {
    height: FAB_SIZE,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center'
  },
  toolbarCircle: {
    backgroundColor: 'red',
    height: FAB_SIZE,
    width: FAB_SIZE,
    borderRadius: FAB_SIZE
  },
  button: {
    height: FAB_SIZE,  // TODO: Figure out how to avoid specifying height/width
    width: FAB_SIZE,
    borderRadius: FAB_SIZE,
    backgroundColor: 'red'
  },
  buttonMini: {
    height: FAB_MINI_SIZE,  // TODO: Figure out how to avoid specifying height/width
    width: FAB_MINI_SIZE,
    borderRadius: FAB_MINI_SIZE,
    backgroundColor: 'red'
  },
  icon: {
    height: ICON_SIZE,
    width: ICON_SIZE
  }
});

export default withTheme(FABToolbar);
