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
  findNodeHandle,
} from 'react-native';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';
import Portal from '../Portal/Portal';
import Surface from '../Surface';
import MenuItem from './MenuItem';
import { APPROX_STATUSBAR_HEIGHT } from '../../constants';

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
   * Extra margin to add at the top of the menu to account for translucent status bar on Android.
   * If you are using Expo, we assume translucent status bar and set a height for status bar automatically.
   * Pass `0` or a custom value to and customize it.
   * This is automatically handled on iOS.
   */
  statusBarHeight: number,
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

type State = {|
  rendered: boolean,
  top: number,
  left: number,
  windowLayout: {| height: number, width: number |},
  menuLayout: {| height: number, width: number |},
  anchorLayout: {| height: number, width: number |},
  opacityAnimation: Animated.Value,
  scaleAnimation: Animated.ValueXY,
|};

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
 * import { Button, Paragraph, Menu, Divider, Provider } from 'react-native-paper';
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
 *       <Provider>
 *         <View
 *           style={{
 *             paddingTop: 50,
 *             flexDirection: 'row',
 *             justifyContent: 'center'
 *           }}>
 *           <Menu
 *             visible={this.state.visible}
 *             onDismiss={this._closeMenu}
 *             anchor={
 *               <Button onPress={this._openMenu}>Show menu</Button>
 *             }
 *           >
 *             <Menu.Item onPress={() => {}} title="Item 1" />
 *             <Menu.Item onPress={() => {}} title="Item 2" />
 *             <Divider />
 *             <Menu.Item onPress={() => {}} title="Item 3" />
 *           </Menu>
 *         </View>
 *       </Provider>
 *     );
 *   }
 * }
 * ```
 */
class Menu extends React.Component<Props, State> {
  // @component ./MenuItem.js
  static Item = MenuItem;

  static defaultProps = {
    statusBarHeight: APPROX_STATUSBAR_HEIGHT,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.visible && !prevState.rendered) {
      return { rendered: true };
    }

    return null;
  }

  state = {
    rendered: this.props.visible,
    top: 0,
    left: 0,
    windowLayout: { width: 0, height: 0 },
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

  componentWillUnmount() {
    this._removeListeners();
  }

  _anchor: View | null = null;
  _menu: View | null = null;

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

  _updateVisibility = async () => {
    // Menu is rendered in Portal, which updates items asynchronously
    // We need to do the same here so that the ref is up-to-date
    await Promise.resolve();

    if (this.props.visible) {
      this._show();
    } else {
      this._hide();
    }
  };

  _isBrowser = () => 'document' in global;

  _focusFirstDOMNode = (el: View | null) => {
    if (el && this._isBrowser()) {
      // When in the browser, we want to focus the first focusable item on toggle
      // For example, when menu is shown, focus the first item in the menu
      // And when menu is dismissed, send focus back to the button to resume tabbing
      const node: any = findNodeHandle(el);
      const focusableNode = node.querySelector(
        // This is a rough list of selectors that can be focused
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      focusableNode && focusableNode.focus();
    }
  };

  _handleDismiss = () => {
    if (this.props.visible) {
      this.props.onDismiss();
    }
    return true;
  };

  _handleKeypress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.props.onDismiss();
    }
  };

  _attachListeners = () => {
    BackHandler.addEventListener('hardwareBackPress', this._handleDismiss);
    Dimensions.addEventListener('change', this._handleDismiss);

    this._isBrowser() &&
      document.addEventListener('keyup', this._handleKeypress);
  };

  _removeListeners = () => {
    BackHandler.removeEventListener('hardwareBackPress', this._handleDismiss);
    Dimensions.removeEventListener('change', this._handleDismiss);

    this._isBrowser() &&
      document.removeEventListener('keyup', this._handleKeypress);
  };

  _show = async () => {
    const windowLayout = Dimensions.get('window');
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
      !windowLayout.width ||
      !windowLayout.height ||
      !menuLayout.width ||
      !menuLayout.height ||
      !anchorLayout.width ||
      !anchorLayout.height
    ) {
      setTimeout(this._show, ANIMATION_DURATION);
      return;
    }

    this.setState(
      {
        left: anchorLayout.x,
        top: anchorLayout.y,
        windowLayout: {
          height: windowLayout.height,
          width: windowLayout.width,
        },
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
        this._attachListeners();

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
        ]).start(({ finished }) => {
          if (finished) {
            this._focusFirstDOMNode(this._menu);
          }
        });
      }
    );
  };

  _hide = () => {
    this._removeListeners();

    Animated.timing(this.state.opacityAnimation, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      easing: EASING,
      useNativeDriver: true,
    }).start(finished => {
      if (finished) {
        this._focusFirstDOMNode(this._anchor);

        this.state.scaleAnimation.setValue({ x: 0, y: 0 });
        this.setState({ rendered: false });
      }
    });
  };

  render() {
    const {
      visible,
      anchor,
      style,
      children,
      theme,
      statusBarHeight,
      onDismiss,
    } = this.props;

    const {
      rendered,
      windowLayout,
      menuLayout,
      anchorLayout,
      opacityAnimation,
      scaleAnimation,
    } = this.state;

    // I don't know why but on Android measure function is wrong by 24
    const additionalVerticalValue = Platform.select({
      android: statusBarHeight,
      default: 0,
    });

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

    // Check if menu fits horizontally and if not align it to right.
    if (left <= windowLayout.width - menuLayout.width - SCREEN_INDENT) {
      positionTransforms.push({
        translateX: scaleAnimation.x.interpolate({
          inputRange: [0, menuLayout.width],
          outputRange: [-(menuLayout.width / 2), 0],
        }),
      });

      // Check if menu position has enough space from left side
      if (left >= 0 && left < SCREEN_INDENT) {
        left = SCREEN_INDENT;
      }
    } else {
      positionTransforms.push({
        translateX: scaleAnimation.x.interpolate({
          inputRange: [0, menuLayout.width],
          outputRange: [menuLayout.width / 2, 0],
        }),
      });

      left += anchorLayout.width - menuLayout.width;

      const right = left + menuLayout.width;
      // Check if menu position has enough space from right side
      if (
        right <= windowLayout.width &&
        right > windowLayout.width - SCREEN_INDENT
      ) {
        left = windowLayout.width - SCREEN_INDENT - menuLayout.width;
      }
    }

    // Check if menu fits vertically and if not align it to bottom.
    if (top <= windowLayout.height - menuLayout.height - SCREEN_INDENT) {
      positionTransforms.push({
        translateY: scaleAnimation.y.interpolate({
          inputRange: [0, menuLayout.height],
          outputRange: [-(menuLayout.height / 2), 0],
        }),
      });

      // Check if menu position has enough space from top side
      if (top >= 0 && top < SCREEN_INDENT) {
        top = SCREEN_INDENT;
      }
    } else {
      positionTransforms.push({
        translateY: scaleAnimation.y.interpolate({
          inputRange: [0, menuLayout.height],
          outputRange: [menuLayout.height / 2, 0],
        }),
      });

      top += anchorLayout.height - menuLayout.height;

      const bottom = top + menuLayout.height + additionalVerticalValue;
      // Check if menu position has enough space from bottom side
      if (
        bottom <= windowLayout.height &&
        bottom > windowLayout.height - SCREEN_INDENT
      ) {
        top =
          windowLayout.height -
          SCREEN_INDENT -
          menuLayout.height -
          additionalVerticalValue;
      }
    }

    const shadowMenuContainerStyle = {
      opacity: opacityAnimation,
      transform: scaleTransforms,
      borderRadius: theme.roundness,
    };

    const positionStyle = {
      top: top + additionalVerticalValue,
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
        {rendered ? (
          <Portal>
            <TouchableWithoutFeedback onPress={onDismiss}>
              <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>
            <View
              ref={ref => {
                this._menu = ref;
              }}
              collapsable={false}
              accessibilityViewIsModal={visible}
              style={[styles.wrapper, positionStyle, style]}
            >
              <Animated.View style={{ transform: positionTransforms }}>
                <Surface
                  style={[styles.shadowMenuContainer, shadowMenuContainerStyle]}
                >
                  {children}
                </Surface>
              </Animated.View>
            </View>
          </Portal>
        ) : null}
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
