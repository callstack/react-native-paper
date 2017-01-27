/* @flow */

import React, {
  Component,
  PropTypes
} from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Dimensions
} from 'react-native';
import withTheme from '../../core/withTheme';
import TouchableRipple from '../TouchableRipple';

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
  circleScale: Animated.Value;
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
    elevation: 12
  };

  constructor(props) {
    super(props);
    this.state = {
      circleScale: new Animated.Value(1),
      pressed: false,
      displayToolbarButtons: false
    };
  }

  componentDidMount() {
    this.openToolbar();
  }

  componentWillUnmount() {
    this.closeToolbar();
  }

  openToolbar() {
    Animated.timing(this.state.circleScale, {
      toValue: 20, // Large enough value
      duration: 200
    }).start(() => this.setState({displayActions: true}));
  }

  closeToolbar() {
    // TODO: Animate back to button
    // https://material.io/guidelines/components/buttons-floating-action-button.html
  }

  render() {
    const {
      theme,
      elevation,
      direction,
      children
    } = this.props;

    // let toolbarCircleStyle = mini ? styles.buttonMini : styles.button;
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

    return (
      <View style={styles.toolbarContainer}>
        <View style={toolbarStyle}>
          <Animated.View style={[
              styles.button,
              {backgroundColor: theme.colors.accent},
              {transform: [{scale: this.state.circleScale}]}
          ]}>
          </Animated.View>
        </View>
        {this.state.displayActions ? children : null}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    height: FAB_SIZE,
    width: FAB_SIZE,
    borderRadius: FAB_SIZE/2 // For circular shape
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
    justifyContent: 'center',
    overflow: 'hidden'
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
