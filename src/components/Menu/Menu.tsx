import * as React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  I18nManager,
  LayoutRectangle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  ScrollView,
  findNodeHandle,
  NativeEventSubscription,
} from 'react-native';

import { withTheme } from '../../core/theming';
import type { $Omit } from '../../types';
import Portal from '../Portal/Portal';
import Surface from '../Surface';
import MenuItem from './MenuItem';
import { APPROX_STATUSBAR_HEIGHT } from '../../constants';
import { addEventListener } from '../../utils/addEventListener';

type Props = {
  /**
   * Whether the Menu is currently visible.
   */
  visible: boolean;
  /**
   * The anchor to open the menu from. In most cases, it will be a button that opens the menu.
   */
  anchor: React.ReactNode | { x: number; y: number };
  /**
   * Extra margin to add at the top of the menu to account for translucent status bar on Android.
   * If you are using Expo, we assume translucent status bar and set a height for status bar automatically.
   * Pass `0` or a custom value to and customize it.
   * This is automatically handled on iOS.
   */
  statusBarHeight?: number;
  /**
   * Callback called when Menu is dismissed. The `visible` prop needs to be updated when this is called.
   */
  onDismiss: () => void;
  /**
   * Accessibility label for the overlay. This is read by the screen reader when the user taps outside the menu.
   */
  overlayAccessibilityLabel?: string;
  /**
   * Content of the `Menu`.
   */
  children: React.ReactNode;
  /**
   * Style of menu's inner content.
   */
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

type Layout = $Omit<$Omit<LayoutRectangle, 'x'>, 'y'>;

type State = {
  rendered: boolean;
  top: number;
  left: number;
  menuLayout: Layout;
  anchorLayout: Layout;
  opacityAnimation: Animated.Value;
  scaleAnimation: Animated.ValueXY;
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
 * import { Button, Menu, Divider, Provider } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(false);
 *
 *   const openMenu = () => setVisible(true);
 *
 *   const closeMenu = () => setVisible(false);
 *
 *   return (
 *     <Provider>
 *       <View
 *         style={{
 *           paddingTop: 50,
 *           flexDirection: 'row',
 *           justifyContent: 'center',
 *         }}>
 *         <Menu
 *           visible={visible}
 *           onDismiss={closeMenu}
 *           anchor={<Button onPress={openMenu}>Show menu</Button>}>
 *           <Menu.Item onPress={() => {}} title="Item 1" />
 *           <Menu.Item onPress={() => {}} title="Item 2" />
 *           <Divider />
 *           <Menu.Item onPress={() => {}} title="Item 3" />
 *         </Menu>
 *       </View>
 *     </Provider>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
class Menu extends React.Component<Props, State> {
  // @component ./MenuItem.tsx
  static Item = MenuItem;

  static defaultProps = {
    statusBarHeight: APPROX_STATUSBAR_HEIGHT,
    overlayAccessibilityLabel: 'Close menu',
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.visible && !prevState.rendered) {
      return { rendered: true };
    }

    return null;
  }

  state = {
    rendered: this.props.visible,
    top: 0,
    left: 0,
    menuLayout: { width: 0, height: 0 },
    anchorLayout: { width: 0, height: 0 },
    opacityAnimation: new Animated.Value(0),
    scaleAnimation: new Animated.ValueXY({ x: 0, y: 0 }),
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.visible !== this.props.visible) {
      this.updateVisibility();
    }
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  private anchor?: View | null = null;
  private menu?: View | null = null;
  private backHandlerSubscription: NativeEventSubscription | undefined;
  private dimensionsSubscription: NativeEventSubscription | undefined;

  private isCoordinate = (anchor: any): anchor is { x: number; y: number } =>
    !React.isValidElement(anchor) &&
    typeof anchor?.x === 'number' &&
    typeof anchor?.y === 'number';

  private measureMenuLayout = () =>
    new Promise<LayoutRectangle>((resolve) => {
      if (this.menu) {
        this.menu.measureInWindow((x, y, width, height) => {
          resolve({ x, y, width, height });
        });
      }
    });

  private measureAnchorLayout = () =>
    new Promise<LayoutRectangle>((resolve) => {
      const { anchor } = this.props;
      if (this.isCoordinate(anchor)) {
        resolve({ x: anchor.x, y: anchor.y, width: 0, height: 0 });
        return;
      }

      if (this.anchor) {
        this.anchor.measureInWindow((x, y, width, height) => {
          resolve({ x, y, width, height });
        });
      }
    });

  private updateVisibility = async () => {
    // Menu is rendered in Portal, which updates items asynchronously
    // We need to do the same here so that the ref is up-to-date
    await Promise.resolve();

    if (this.props.visible) {
      this.show();
    } else {
      this.hide();
    }
  };

  private isBrowser = () => Platform.OS === 'web' && 'document' in global;

  private focusFirstDOMNode = (el: View | null | undefined) => {
    if (el && this.isBrowser()) {
      // When in the browser, we want to focus the first focusable item on toggle
      // For example, when menu is shown, focus the first item in the menu
      // And when menu is dismissed, send focus back to the button to resume tabbing
      const node: any = findNodeHandle(el);
      const focusableNode = node.querySelector(
        // This is a rough list of selectors that can be focused
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      focusableNode?.focus();
    }
  };

  private handleDismiss = () => {
    if (this.props.visible) {
      this.props.onDismiss();
    }
    return true;
  };

  private handleKeypress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.props.onDismiss();
    }
  };

  private attachListeners = () => {
    this.backHandlerSubscription = addEventListener(
      BackHandler,
      'hardwareBackPress',
      this.handleDismiss
    );
    this.dimensionsSubscription = addEventListener(
      Dimensions,
      'change',
      this.handleDismiss
    );
    this.isBrowser() && document.addEventListener('keyup', this.handleKeypress);
  };

  private removeListeners = () => {
    this.backHandlerSubscription?.remove();
    this.dimensionsSubscription?.remove();
    this.isBrowser() &&
      document.removeEventListener('keyup', this.handleKeypress);
  };

  private show = async () => {
    const windowLayout = Dimensions.get('window');
    const [menuLayout, anchorLayout] = await Promise.all([
      this.measureMenuLayout(),
      this.measureAnchorLayout(),
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
      (!anchorLayout.width && !this.isCoordinate(this.props.anchor)) ||
      (!anchorLayout.height && !this.isCoordinate(this.props.anchor))
    ) {
      requestAnimationFrame(this.show);
      return;
    }

    this.setState(
      () => ({
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
      }),
      () => {
        this.attachListeners();

        const { animation } = this.props.theme;
        Animated.parallel([
          Animated.timing(this.state.scaleAnimation, {
            toValue: { x: menuLayout.width, y: menuLayout.height },
            duration: ANIMATION_DURATION * animation.scale,
            easing: EASING,
            useNativeDriver: true,
          }),
          Animated.timing(this.state.opacityAnimation, {
            toValue: 1,
            duration: ANIMATION_DURATION * animation.scale,
            easing: EASING,
            useNativeDriver: true,
          }),
        ]).start(({ finished }) => {
          if (finished) {
            this.focusFirstDOMNode(this.menu);
          }
        });
      }
    );
  };

  private hide = () => {
    this.removeListeners();

    const { animation } = this.props.theme;
    Animated.timing(this.state.opacityAnimation, {
      toValue: 0,
      duration: ANIMATION_DURATION * animation.scale,
      easing: EASING,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        this.setState({ menuLayout: { width: 0, height: 0 }, rendered: false });
        this.state.scaleAnimation.setValue({ x: 0, y: 0 });
        this.focusFirstDOMNode(this.anchor);
      }
    });
  };

  render() {
    const {
      visible,
      anchor,
      contentStyle,
      style,
      children,
      theme,
      statusBarHeight,
      onDismiss,
      overlayAccessibilityLabel,
    } = this.props;

    const {
      rendered,
      menuLayout,
      anchorLayout,
      opacityAnimation,
      scaleAnimation,
    } = this.state;

    let { left, top } = this.state;

    // I don't know why but on Android measure function is wrong by 24
    const additionalVerticalValue = Platform.select({
      android: statusBarHeight,
      default: 0,
    });

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

    const windowLayout = Dimensions.get('window');

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
      if (left < SCREEN_INDENT) {
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
      if (right > windowLayout.width - SCREEN_INDENT) {
        left = windowLayout.width - SCREEN_INDENT - menuLayout.width;
      }
    }

    // If the menu is larger than available vertical space,
    // calculate the height of scrollable view
    let scrollableMenuHeight = 0;

    // Check if the menu should be scrollable
    if (
      // Check if the menu overflows from bottom side
      top >=
        windowLayout.height -
          menuLayout.height -
          SCREEN_INDENT -
          additionalVerticalValue &&
      // And bottom side of the screen has more space than top side
      top <= windowLayout.height - top
    ) {
      // Scrollable menu should be below the anchor (expands downwards)
      scrollableMenuHeight =
        windowLayout.height - top - SCREEN_INDENT - additionalVerticalValue;
    } else if (
      // Check if the menu overflows from bottom side
      top >=
        windowLayout.height -
          menuLayout.height -
          SCREEN_INDENT -
          additionalVerticalValue &&
      // And top side of the screen has more space than bottom side
      top >= windowLayout.height - top &&
      // And menu overflows from top side
      top <=
        menuLayout.height -
          anchorLayout.height +
          SCREEN_INDENT -
          additionalVerticalValue
    ) {
      // Scrollable menu should be above the anchor (expands upwards)
      scrollableMenuHeight =
        top + anchorLayout.height - SCREEN_INDENT + additionalVerticalValue;
    }

    // Scrollable menu max height
    scrollableMenuHeight =
      scrollableMenuHeight > windowLayout.height - 2 * SCREEN_INDENT
        ? windowLayout.height - 2 * SCREEN_INDENT
        : scrollableMenuHeight;

    // Menu is typically positioned below the element that generates it
    // So first check if it fits below the anchor (expands downwards)
    if (
      // Check if menu fits vertically
      top <=
        windowLayout.height -
          menuLayout.height -
          SCREEN_INDENT -
          additionalVerticalValue ||
      // Or if the menu overflows from bottom side
      (top >=
        windowLayout.height -
          menuLayout.height -
          SCREEN_INDENT -
          additionalVerticalValue &&
        // And bottom side of the screen has more space than top side
        top <= windowLayout.height - top)
    ) {
      positionTransforms.push({
        translateY: scaleAnimation.y.interpolate({
          inputRange: [0, menuLayout.height],
          outputRange: [-((scrollableMenuHeight || menuLayout.height) / 2), 0],
        }),
      });

      // Check if menu position has enough space from top side
      if (top < SCREEN_INDENT) {
        top = SCREEN_INDENT;
      }
    } else {
      positionTransforms.push({
        translateY: scaleAnimation.y.interpolate({
          inputRange: [0, menuLayout.height],
          outputRange: [(scrollableMenuHeight || menuLayout.height) / 2, 0],
        }),
      });

      top += anchorLayout.height - (scrollableMenuHeight || menuLayout.height);

      const bottom =
        top +
        (scrollableMenuHeight || menuLayout.height) +
        additionalVerticalValue;

      // Check if menu position has enough space from bottom side
      if (bottom > windowLayout.height - SCREEN_INDENT) {
        top =
          scrollableMenuHeight === windowLayout.height - 2 * SCREEN_INDENT
            ? -SCREEN_INDENT * 2
            : windowLayout.height -
              menuLayout.height -
              SCREEN_INDENT -
              additionalVerticalValue;
      }
    }

    const shadowMenuContainerStyle = {
      opacity: opacityAnimation,
      transform: scaleTransforms,
      borderRadius: theme.roundness,
      ...(scrollableMenuHeight ? { height: scrollableMenuHeight } : {}),
    };

    const positionStyle = {
      top: this.isCoordinate(anchor) ? top : top + additionalVerticalValue,
      ...(I18nManager.isRTL ? { right: left } : { left }),
    };

    return (
      <View
        ref={(ref) => {
          this.anchor = ref;
        }}
        collapsable={false}
      >
        {this.isCoordinate(anchor) ? null : anchor}
        {rendered ? (
          <Portal>
            <TouchableWithoutFeedback
              accessibilityLabel={overlayAccessibilityLabel}
              accessibilityRole="button"
              onPress={onDismiss}
            >
              <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>
            <View
              ref={(ref) => {
                this.menu = ref;
              }}
              collapsable={false}
              accessibilityViewIsModal={visible}
              style={[styles.wrapper, positionStyle, style]}
              pointerEvents={visible ? 'box-none' : 'none'}
              onAccessibilityEscape={onDismiss}
            >
              <Animated.View style={{ transform: positionTransforms }}>
                <Surface
                  style={
                    [
                      styles.shadowMenuContainer,
                      shadowMenuContainerStyle,
                      contentStyle,
                    ] as StyleProp<ViewStyle>
                  }
                >
                  {(scrollableMenuHeight && (
                    <ScrollView>{children}</ScrollView>
                  )) || <React.Fragment>{children}</React.Fragment>}
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
