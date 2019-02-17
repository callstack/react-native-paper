/* @flow */

import * as React from 'react';
import {
  StyleSheet,
  Animated,
  View,
  Easing,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  I18nManager,
  BackHandler,
} from 'react-native';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';
import Surface from '../Surface';
import MenuItem from './MenuItem';

type Props = {
  /**
   * Whether the Menu is currently visible.
   */
  visible: boolean,
  /**
   * The button to trigger the menu.
   */
  button: React.Node,
  /**
   * Callback called when Menu is dismissed. The `visible` prop needs to be updated when this is called.
   */
  onDismiss: () => mixed,
  /**
   * Content of the `Menu`.
   */
  children: React.Node,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * Menus display a list of choices on temporary surfaces. Their placement varies based on the element that opens them.
 *
 *  <div class="screenshots">
 *   <img class="medium" src="screenshots/menu-1.png" />
 *   <img class="medium" src="screenshots/menu-2.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Button, Paragraph, Menu, Divider } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     visible: false,
 *   };
 *
 *   _openMenu = () => this.setState({ visible: true });
 *
 *   _closeMenu = () => this.setState({ visible: false });
 *
 *   render() {
 *     return (
 *       <View>
 *         <Menu
 *           visible={this.state.visible}
 *           onDismiss={this._closeMenu}
 *           button={
 *             <Button onPress={this._openMenu}>Show menu</Button>
 *           }
 *         >
 *           <Menu.Item onPress={() => {}} title="Item 1" />
 *           <Menu.Item onPress={() => {}} title="Item 2" />
 *           <Divider />
 *           <Menu.Item onPress={() => {}} title="Item 3" />
 *         </Menu>
 *       </View>
 *     );
 *   }
 * }
 * ```
 */

type State = {
  top: number,
  left: number,
  menuWidth: number,
  menuHeight: number,
  buttonWidth: number,
  buttonHeight: number,
  opacityAnimation: Animated.Value,
  menuSizeAnimation: Animated.ValueXY,
  menuState: 'hidden' | 'animating' | 'shown',
};

const ANIMATION_DURATION = 300;
const EASING = Easing.bezier(0.4, 0, 0.2, 1);
const SCREEN_INDENT = 8;

class Menu extends React.Component<Props, State> {
  // @component ./MenuItem.js
  static Item = MenuItem;

  state = {
    menuState: 'hidden',
    top: 0,
    left: 0,
    menuWidth: 0,
    menuHeight: 0,
    buttonWidth: 0,
    buttonHeight: 0,
    opacityAnimation: new Animated.Value(0),
    menuSizeAnimation: new Animated.ValueXY({ x: 0, y: 0 }),
  };

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      this._toggle();
    }
  }

  _container: any;

  _setContainerRef = ref => {
    this._container = ref;
  };

  // Start menu animation
  _onMenuLayout = e => {
    if (this.state.menuState === 'animating') {
      return;
    }

    const { width, height } = e.nativeEvent.layout;

    this.setState(
      {
        menuState: 'animating',
        menuWidth: width,
        menuHeight: height,
      },
      () => {
        Animated.parallel([
          Animated.timing(this.state.menuSizeAnimation, {
            toValue: { x: width, y: height },
            duration: ANIMATION_DURATION,
            easing: EASING,
          }),
          Animated.timing(this.state.opacityAnimation, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            easing: EASING,
          }),
        ]).start();
      }
    );
  };

  // Save button width and height for menu layout
  _onButtonLayout = e => {
    const { width, height } = e.nativeEvent.layout;
    this.setState({ buttonWidth: width, buttonHeight: height });
  };

  _toggle = () => {
    if (this.props.visible) {
      this._show();
    } else {
      this._hide();
    }
  };

  _show = () => {
    BackHandler.addEventListener('hardwareBackPress', this._hide);
    this._container.measureInWindow((x, y) => {
      const top = Math.max(SCREEN_INDENT, y);
      const left = Math.max(SCREEN_INDENT, x);
      this.setState({ menuState: 'shown', top, left });
    });
  };

  _hide = () => {
    BackHandler.removeEventListener('hardwareBackPress', this._hide);
    Animated.timing(this.state.opacityAnimation, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      easing: EASING,
    }).start(() => {
      if (this.props.visible && this.props.onDismiss) {
        this.props.onDismiss();
      }
      if (this.props.visible) {
        this._show();
      } else {
        this.setState({
          menuState: 'hidden',
          menuSizeAnimation: new Animated.ValueXY({ x: 0, y: 0 }),
          opacityAnimation: new Animated.Value(0),
        });
      }
    });
  };

  render() {
    const { visible, button, style, children, theme } = this.props;

    const {
      menuState,
      menuWidth,
      menuHeight,
      buttonWidth,
      buttonHeight,
      opacityAnimation,
      menuSizeAnimation,
    } = this.state;

    const menuSize = {
      width: menuSizeAnimation.x,
      height: menuSizeAnimation.y,
    };

    // Adjust position of menu
    let { left, top } = this.state;
    const transforms = [];

    const dimensions = Dimensions.get('screen');

    // Flip by X axis if menu hits right screen border
    if (left > dimensions.width - menuWidth - SCREEN_INDENT) {
      transforms.push({
        translateX: Animated.multiply(menuSizeAnimation.x, -1),
      });

      left = Math.min(dimensions.width - SCREEN_INDENT, left + buttonWidth);
    }

    // Flip by Y axis if menu hits bottom screen border
    if (top > dimensions.height - menuHeight - SCREEN_INDENT) {
      transforms.push({
        translateY: Animated.multiply(menuSizeAnimation.y, -1),
      });

      top = Math.min(dimensions.height - SCREEN_INDENT, top + buttonHeight);
    }

    // RTL support
    const leftOrRight = I18nManager.isRTL ? { right: left } : { left };

    const shadowMenuContainerStyle = {
      opacity: opacityAnimation,
      transform: transforms,
      borderRadius: theme.roundness,
      ...leftOrRight,
      top,
    };

    const animationStarted = menuState === 'animating';
    const modalVisible = menuState === 'shown' || animationStarted || visible;

    return (
      <View ref={this._setContainerRef} collapsable={false}>
        <View onLayout={this._onButtonLayout}>{button}</View>

        <Modal visible={modalVisible} onRequestClose={this._hide} transparent>
          <TouchableWithoutFeedback onPress={this._hide}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <Surface
            onLayout={this._onMenuLayout}
            style={[
              styles.shadowMenuContainer,
              shadowMenuContainerStyle,
              style,
            ]}
          >
            <Animated.View
              style={[styles.menuContainer, animationStarted && menuSize]}
            >
              {children}
            </Animated.View>
          </Surface>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  shadowMenuContainer: {
    position: 'absolute',
    opacity: 0,
    paddingTop: 8,
    elevation: 8,
  },
  menuContainer: {
    overflow: 'hidden',
  },
});

export default withTheme(Menu);
