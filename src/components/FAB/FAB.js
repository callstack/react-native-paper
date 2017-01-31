/* @flow */

import React, {
  Component,
  PropTypes,
} from 'react';
import {
  View,
  StyleSheet,
  Animated
} from 'react-native';
import Paper from '../Paper';
import withTheme from '../../core/withTheme';
import TouchableRipple from '../TouchableRipple';
import FABToolbar from './FABToolbar';
import type { Theme } from '../../types/Theme';

/**
 * Size constants according to:
 * https://material.io/guidelines/components/buttons-floating-action-button.html
 */
const FAB_SIZE = 56, ICON_SIZE = 24;
const AnimatedPaper = Animated.createAnimatedComponent(Paper);

type DefaultProps = {
  elevation: number;
};

type Props = {
  children?: string | Array<string>;
  style?: any;
  elevation?: number;
  theme: Theme;
  buttonIcon?: any;
  onPress: () => void;
};

type State = {
  pressed: bool;
  buttonScale: Animated.Value;
  elevation: Animated.Value;
}

/**
 * Floating Action Button (FAB) is a circled icon which typically floats
 * above the UI. On press, it can either:
 *
 * 1. Invoke an Action.
 * 2. Present user with a horizontal full-width strip of Actions.
 * 3. Fling a set of related Actions in the form of circular buttons.
 *
 * https://material.io/guidelines/components/buttons-floating-action-button.html
 */
class FAB extends Component<DefaultProps, Props, State> {
  static Toolbar = FABToolbar;

  static propTypes = {
    theme: PropTypes.object.isRequired,
    /**
     * Action buttons in the case of FAB Toolbar/Speed dial.
     */
    children: PropTypes.element,
    elevation: PropTypes.number,
    style: View.propTypes.style,
    onPress: PropTypes.func,
    buttonIcon: PropTypes.element,
  };

  static defaultProps = {
    elevation: 6
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      pressed: false,
      buttonScale: new Animated.Value(0),
      elevation: new Animated.Value(6),
    };
  }

  componentDidMount() {
    /**
     * The button needs to expand from 0x to 1x scale. On Android, scale of 0 is
     * taken as 1. Hence, it first loads fully at 1x scale and THEN, animates from
     * 0x to 1x (https://github.com/facebook/react-native#6278).
     */
    this.expandButton();
  }

  componentWillUnmount = () => this.shrinkButton();

  scaleButton(toValue, onComplete) {
    Animated.timing(this.state.buttonScale, {
      toValue,
      duration: 100
    }).start(onComplete);
  }

  expandButton = () => this.scaleButton(1);

  shrinkButton = () => this.scaleButton(0);

  _handlePressIn = () => {
    Animated.timing(this.state.elevation, {
      toValue: 12,
      duration: 200,
    }).start();
  };

  _handlePressOut = () => {
    Animated.timing(this.state.elevation, {
      toValue: 6,
      duration: 150,
    }).start();
  };

  onPress() {
    this.setState({pressed: true});
    return this.props.onPress && this.props.onPress();
  }

  _renderButton() {
    const {
      theme,
      style
    } = this.props;

    return (
        <View style={[styles.container, style]}>
          <AnimatedPaper
            elevation={this.state.elevation}
            style={[
              styles.buttonContainer,
              {transform: [{scale: this.state.buttonScale}]}
            ]}
          >
            <TouchableRipple
              onPress={this.onPress.bind(this)}
              style={[styles.button, {backgroundColor: theme.colors.accent}]}
              onPressIn={this._handlePressIn}
              onPressOut={this._handlePressOut}
            >
              <View>{this.props.buttonIcon}</View>
            </TouchableRipple>
          </AnimatedPaper>
        </View>
    );
  }

  _renderContent() {
    if (this.props.children) {
      /**
       * We're cloning the children (guaranteed to be only child) to pass
       * some additional props.
       */
     return this.props.children && React.cloneElement(this.props.children, {
        icon: this.props.buttonIcon,
        /** When child (toolbar/speed dial/sheet) receives props.open=false,
         *  it will do closing animations, which upon finishing will
         *  call onClose being passed here.
         *
         *  This allows FAB to wait till all animations are complete before
         *  rendering back the button.
         */
        onClose: () => this.setState({pressed: false})
      });
    }
    return this._renderButton();
  }

  render() {
    return this.state.pressed ? this._renderContent() : this._renderButton();
  }
}

var styles = StyleSheet.create({
  container: {
    height: FAB_SIZE * 1.3,
    width: FAB_SIZE,
  },
  buttonContainer: {
    height: FAB_SIZE,
    width: FAB_SIZE,
    borderRadius: FAB_SIZE/2 // For circular shape
  },
  button: {
    height: FAB_SIZE,
    width: FAB_SIZE,
    borderRadius: FAB_SIZE/2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    height: ICON_SIZE,
    width: ICON_SIZE,
  }
});

export default withTheme(FAB);
