/* @flow */

import React, {
  Component,
  PropTypes,
} from 'react';
import {
  View,
  StyleSheet,
  Dimensions
} from 'react-native';
import FABToolbar from './FABToolbar';
import withTheme from '../../core/withTheme';
import TouchableRipple from '../TouchableRipple';

let SCREEN_HEIGHT = Dimensions.get('window').height;
let SCREEN_WIDTH = Dimensions.get('window').width;
let FAB_SIZE = 56;
let FAB_MINI_SIZE = 40;
let ICON_SIZE = 24;

type DefaultProps = {
  elevation: number;
};

type Props = {
  children?: any;
  direction: string;
};

type State = {
  
};

class FAB extends Component<DefaultProps, Props, void> {
  static Toolbar = FABToolbar;

  static propTypes = {
    children: PropTypes.node,
    direction: PropTypes.string,
    style: View.propTypes.style,
    theme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    elevation: 12
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      pressed: false
    };
  }

  onPress() {
    this.setState({pressed: true});
  }

  _renderButton() {
    const {
      theme,
      elevation,
      mini
    } = this.props;

    // let containerStyle = mini ? styles.containerMini : styles.container;
    // let buttonStyle = mini ? styles.buttonMini : styles.button;

    return (
      <View style={[styles.container, {elevation}]}>
        <TouchableRipple onPress={this.onPress.bind(this)}
          style={[styles.button, {backgroundColor: theme.colors.accent}]}>
          <View style={styles.icon}></View>
        </TouchableRipple>
      </View>
    );
  }

  _renderContent() {
    if (this.props.children) {
      return <View>{React.Children.only(this.props.children)}</View>;
    }
    // TODO: Do button onPress
    return this._renderButton();
  }

  render() {
    if (this.state.pressed) {
      return this._renderContent();
    } else {
      return this._renderButton();
    }
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

export default withTheme(FAB);
