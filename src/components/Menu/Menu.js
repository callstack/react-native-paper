/* @flow */

import * as React from 'react';
import {
  StyleSheet,
  Animated,
  View,
  Easing,
  Dimensions,
  TouchableWithoutFeedback,
  I18nManager,
  BackHandler,
  Platform,
} from 'react-native';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';
import Portal from '../Portal/Portal';
import Surface from '../Surface';
import MenuItem from './MenuItem';

type Props = {
  /**
   * Whether the Menu is currently visible.
   */
  visible: boolean,
  /**
   * The anchor to open the menu from. In most cases, it will be a button that opens the manu.
   */
  anchor: React.Node,
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

type State = {
  top: number,
  left: number,
  menuLayout: { height: number, width: number },
  anchorLayout: { height: number, width: number },
  opacityAnimation: Animated.Value,
  scaleAnimation: Animated.ValueXY,
};

// Minimum padding between the edge of the screen and the menu
const SCREEN_INDENT = 8;
// From https://material.io/design/motion/speed.html#duration
const ANIMATION_DURATION = 250;
// From the 'Standard easing' section of https://material.io/design/motion/speed.html#easing
const EASING = Easing.bezier(0.4, 0, 0.2, 1);

/**
 * Menus display a list of choices on temporary elevated surfaces. Their placement varies based on the element that opens them.
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
 *           anchor={
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
class Menu extends React.Component<Props, State> {
  // @component ./MenuItem.js
  static Item = MenuItem;

  state = {
    top: 0,
    left: 0,
    menuLayout: { width: 0, height: 0 },
    anchorLayout: { width: 0, height: 0 },
    opacityAnimation: new Animated.Value(0),
    scaleAnimation: new Animated.ValueXY({ x: 0, y: 0 }),
  };

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      this._updateVisibility();
    }
  }

  _anchor: ?View;
  _menu: ?View;

  _measureMenuLayout = () =>
    new Promise(resolve => {
      if (this._menu) {
        this._menu.measureInWindow((x, y, width, height) => {
          resolve({ x, y, width, height });
        });
      }
    });

  _measureAnchorLayout = () =>
    new Promise(resolve => {
      if (this._anchor) {
        this._anchor.measureInWindow((x, y, width, height) => {
          resolve({ x, y, width, height });
        });
      }
    });

  _updateVisibility = () => {
    if (this.props.visible) {
      this._show();
    } else {
      this._hide();
    }
  };

  _show = async () => {
    BackHandler.addEventListener('hardwareBackPress', this.props.onDismiss);

    const [menuLayout, anchorLayout] = await Promise.all([
      this._measureMenuLayout(),
      this._measureAnchorLayout(),
    ]);

    // When visible is true for first render
    // native views can be still not rendered and
    // measureMenuLayout/measureAnchorLayout functions
    // return wrong values e.g { x:0, y: 0, width: 0, height: 0 }
    // so we have to wait until views are ready
    // and rerun this function to show menu
    if (
      !menuLayout.width ||
      !menuLayout.height ||
      !anchorLayout.width ||
      !anchorLayout.height ||
      !anchorLayout.x ||
      !anchorLayout.y
    ) {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.props.onDismiss
      );
      setTimeout(() => {
        this._show();
      }, ANIMATION_DURATION);
      return;
    }

    this.setState(
      {
        left: anchorLayout.x,
        top: anchorLayout.y,
        anchorLayout: {
          height: anchorLayout.height,
          width: anchorLayout.width,
        },
        menuLayout: {
          width: menuLayout.width,
          height: menuLayout.height,
        },
      },
      () => {
        Animated.parallel([
          Animated.timing(this.state.scaleAnimation, {
            toValue: { x: menuLayout.width, y: menuLayout.height },
            duration: ANIMATION_DURATION,
            easing: EASING,
            useNativeDriver: true,
          }),
          Animated.timing(this.state.opacityAnimation, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            easing: EASING,
            useNativeDriver: true,
          }),
        ]).start();
      }
    );
  };

  _hide = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.props.onDismiss);

    Animated.timing(this.state.opacityAnimation, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      easing: EASING,
      useNativeDriver: true,
    }).start(finished => {
      if (finished) {
        this.state.scaleAnimation.setValue({ x: 0, y: 0 });
      }
    });
  };

  render() {
    const { visible, anchor, style, children, theme, onDismiss } = this.props;

    const {
      menuLayout,
      anchorLayout,
      opacityAnimation,
      scaleAnimation,
    } = this.state;

    let { left, top } = this.state;

    const scaleTransforms = [
      {
        scaleX: scaleAnimation.x.interpolate({
          inputRange: [0, menuLayout.width],
          outputRange: [0, 1],
        }),
      },
      {
        scaleY: scaleAnimation.y.interpolate({
          inputRange: [0, menuLayout.height],
          outputRange: [0, 1],
        }),
      },
    ];

    // We need to translate menu while animating scale to imitate transform origin for scale animation
    const positionTransforms = [];

    const { width: screenWidth, height: screenHeight } = Dimensions.get(
      'screen'
    );

    // Check if menu fits horizontally and if not align it to right.
    if (left <= screenWidth - menuLayout.width - SCREEN_INDENT) {
      positionTransforms.push({
        translateX: scaleAnimation.x.interpolate({
          inputRange: [0, menuLayout.width],
          outputRange: [-(menuLayout.width / 2), 0],
        }),
      });
    } else {
      positionTransforms.push({
        translateX: scaleAnimation.x.interpolate({
          inputRange: [0, menuLayout.width],
          outputRange: [menuLayout.width / 2, 0],
        }),
      });

      left =
        Math.min(screenWidth - SCREEN_INDENT, left + anchorLayout.width) -
        menuLayout.width;
    }

    // Check if menu fits vertically and if not align it to bottom.
    if (top <= screenHeight - menuLayout.height - SCREEN_INDENT) {
      positionTransforms.push({
        translateY: scaleAnimation.y.interpolate({
          inputRange: [0, menuLayout.height],
          outputRange: [-(menuLayout.height / 2), 0],
        }),
      });
    } else {
      positionTransforms.push({
        translateY: scaleAnimation.y.interpolate({
          inputRange: [0, menuLayout.height],
          outputRange: [menuLayout.height / 2, 0],
        }),
      });

      top =
        Math.min(screenHeight - SCREEN_INDENT, top + anchorLayout.height) -
        menuLayout.height;
    }

    const shadowMenuContainerStyle = {
      opacity: opacityAnimation,
      transform: scaleTransforms,
      borderRadius: theme.roundness,
    };

    const positionStyle = {
      // Don't know why position is wrong by 24 on Android
      top: Platform.select({ default: top, android: top + 24 }),
      ...(I18nManager.isRTL ? { right: left } : { left }),
    };

    return (
      <View
        ref={ref => {
          this._anchor = ref;
        }}
        collapsable={false}
      >
        {anchor}
        <Portal>
          {visible ? (
            <TouchableWithoutFeedback onPress={onDismiss}>
              <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>
          ) : null}
          <View
            ref={ref => {
              // This hack is needed to properly show menu
              // when visible is `true` initially
              // because in componentDidMount _menu ref is undefined
              // because it's rendered in portal
              if (!this._menu) {
                this._menu = ref;
                if (visible) {
                  this._show();
                }
              }
            }}
            collapsable={false}
            pointerEvents={visible ? 'auto' : 'none'}
            style={[styles.wrapper, positionStyle]}
          >
            <Animated.View style={{ transform: positionTransforms }}>
              <Surface
                style={[
                  styles.shadowMenuContainer,
                  shadowMenuContainerStyle,
                  style,
                ]}
              >
                {children}
              </Surface>
            </Animated.View>
          </View>
        </Portal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
  },
  shadowMenuContainer: {
    opacity: 0,
    paddingVertical: 8,
    elevation: 8,
  },
});

export default withTheme(Menu);
