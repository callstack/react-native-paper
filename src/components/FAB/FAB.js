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
  children?: any;
  style?: any;
  elevation?: number;
  buttonIcon?: any;
  onPress: () => {};
};

type State = {
  pressed: bool;
  buttonScale: Animated.Value;
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
    elevation: 12
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      pressed: false,
      buttonScale: new Animated.Value(0),
    };
  }

  componentDidMount() {
    // Note: On Android, the button loads at scale 1 first and THEN, animates
    // to scale 1. This is because of a bug:
    // https://github.com/facebook/react-native/issues/6278
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

  onPress() {
    this.setState({pressed: true});
    return this.props.onPress && this.props.onPress();
  }

  _renderIcon(source: string) {
    if (source) {
      return <View><Image style={styles.icon} source={require(source)} /></View>
    }
    return <View style={styles.icon}></View>;
  }

  _renderButton() {
    const {
      theme,
      elevation,
      style
    } = this.props;

    return (
        <View style={[styles.container, style]}>
          <AnimatedPaper
            elevation={elevation}
            style={[
              styles.buttonContainer,
              {transform: [{scale: this.state.buttonScale}]}
            ]}
          >
            <TouchableRipple onPress={this.onPress.bind(this)}
              style={[styles.button, {backgroundColor: theme.colors.accent}]}>
              <View>{this.props.buttonIcon}</View>
            </TouchableRipple>
          </AnimatedPaper>
        </View>
    );
  }

  _renderContent() {
    if (this.props.children) {
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
    // If user doesn't supply any child, FAB is simply a button.
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
