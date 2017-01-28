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

const SCREEN_WIDTH = Dimensions.get('window').width;
const FAB_SIZE = 56;
const ICON_SIZE = 24;
const ToolbarDirection = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
};

export type FABToolbarDirection = {
  LEFT: string;
  RIGHT: string
};

type DefaultProps = {
  elevation: number;
}

type Props = {
  direction: string;
}

type State = {
  circleScale: Animated.Value;
  circlePosition: Animated.ValueXY;
  displayActions: bool;
}

class FABToolbar extends Component<DefaultProps, Props, State> {
  static Direction = ToolbarDirection;

  static propTypes = {
    children: PropTypes.node.isRequired,
    elevation: PropTypes.number,
    direction: PropTypes.string,
    style: View.propTypes.style,
  };

  static defaultProps = {
    elevation: 12
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      circlePosition: new Animated.ValueXY(),
      circleScale: new Animated.Value(1),
      displayActions: false
    };
  }

  componentDidMount() {
    this.openToolbar();
  }

  componentWillUnmount() {
    this.closeToolbar();
  }

  componentWillReceiveProps(nextProps) {
    nextProps.open ? this.openToolbar() : this.closeToolbar(nextProps.onClose);
  }

  openToolbar() {
    Animated.stagger(100, [
      this.moveIn(this.props.direction),
      this.scaleUp()
    ]).start(() => this.setState({displayActions: true}));
  }

  closeToolbar(onComplete: () => {}) {
    const self = this;
    this.setState({displayActions: false}, () => {
      Animated.stagger(100, [
        self.scaleDown(),
        self.moveOut(self.props.direction),
      ]).start(onComplete);
    });
  }

  moveIn(direction: FABToolbarDirection) {
    const toValue = direction === ToolbarDirection.RIGHT ? {x: -200, y: 10} : {x: 100, y: 10};
    return Animated.timing(this.state.circlePosition, {
      toValue,
      duration: 200
    });
  }

  moveOut(direction: FABToolbarDirection) {
    const toValue = direction === ToolbarDirection.RIGHT ? {x: -60, y: 0} : {x: 0, y: 0};
    return Animated.timing(this.state.circlePosition, {
      toValue,
      duration: 200
    });
  }

  scaleUp() {
    return Animated.timing(this.state.circleScale, {
      toValue: (SCREEN_WIDTH/FAB_SIZE) * 2,
      duration: 200
    });
  }

  scaleDown() {
    return Animated.timing(this.state.circleScale, {
      toValue: 1,
      duration: 200
    });
  }

  render() {
    const {
      theme,
      elevation,
      direction,
      children
    } = this.props;

    let toolbarStyle = {position: 'absolute', top: 0};
    switch (direction) {
    case ToolbarDirection.LEFT:
      toolbarStyle.left = 0;
      break;
    case ToolbarDirection.RIGHT:
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
            {
              backgroundColor: theme.colors.accent,
              top: this.state.circlePosition.y,
              left: this.state.circlePosition.x,
            },
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
  toolbarContainer: {
    position: 'relative',
    height: FAB_SIZE * 1.3,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden'
  },
  button: {
    position: 'absolute',
    height: FAB_SIZE,
    width: FAB_SIZE,
    borderRadius: FAB_SIZE/2
  }
});

export default withTheme(FABToolbar);
