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
} from 'react-native';

import { withTheme } from '../../core/theming';
import type { $Omit } from '../../types';
import Portal from '../Portal/Portal';
import Surface from '../Surface';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import MenuItem, { MenuItem as _MenuItem } from './MenuItem';
import { APPROX_STATUSBAR_HEIGHT } from '../../constants';

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
const Menu = ({
  visible,
  anchor: anchorProp,
  contentStyle,
  style,
  children,
  theme,
  statusBarHeight = APPROX_STATUSBAR_HEIGHT,
  onDismiss,
  overlayAccessibilityLabel = 'Close menu',
}: Props) => {
  const [rendered, setRendered] = React.useState<boolean>(visible);
  const [top, setTop] = React.useState<number>(0);
  const [left, setLeft] = React.useState<number>(0);
  const [menuLayout, setMenuLayout] = React.useState<Layout>({
    width: 0,
    height: 0,
  });
  const [anchorLayout, setAnchorLayout] = React.useState<Layout>({
    width: 0,
    height: 0,
  });
  const { current: opacityAnimation } = React.useRef<Animated.Value>(
    new Animated.Value(0)
  );
  const { current: scaleAnimation } = React.useRef<Animated.ValueXY>(
    new Animated.ValueXY({ x: 0, y: 0 })
  );

  const {
    animation: { scale },
  } = theme;

  const focusFirstDOMNode = React.useCallback((el: View | null | undefined) => {
    if (el && isBrowser()) {
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
  }, []);

  const handleDismiss = React.useCallback(() => {
    if (visible) {
      onDismiss();
    }
    return true;
  }, [onDismiss, visible]);

  const handleKeypress = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    },
    [onDismiss]
  );

  const removeListeners = React.useCallback(() => {
    BackHandler.removeEventListener('hardwareBackPress', handleDismiss);
    Dimensions.removeEventListener('change', handleDismiss);

    isBrowser() && document.removeEventListener('keyup', handleKeypress);
  }, [handleDismiss, handleKeypress]);

  const isAnchorCoord = React.useCallback(
    () => !React.isValidElement(anchorProp),
    [anchorProp]
  );

  const measureAnchorLayout = React.useCallback(
    () =>
      new Promise<LayoutRectangle>((resolve) => {
        if (isAnchorCoord()) {
          resolve({
            // @ts-ignore
            x: anchorProp.x,
            // @ts-ignore
            y: anchorProp.y,
            width: 0,
            height: 0,
          });
          return;
        }

        if (anchor.current) {
          anchor.current.measureInWindow((x, y, width, height) => {
            resolve({ x, y, width, height });
          });
        }
      }),
    [anchorProp, isAnchorCoord]
  );

  const show = React.useCallback(async () => {
    const windowLayout = Dimensions.get('window');
    const [menuLayout, anchorLayout] = await Promise.all([
      measureMenuLayout(),
      measureAnchorLayout(),
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
      (!anchorLayout.width && !isAnchorCoord()) ||
      (!anchorLayout.height && !isAnchorCoord())
    ) {
      requestAnimationFrame(show);
      return;
    }
    setAnchorLayout(() => ({
      height: anchorLayout.height,
      width: anchorLayout.width,
    }));
    setLeft(() => anchorLayout.x);
    setTop(() => anchorLayout.y);
    setMenuLayout(() => ({
      width: menuLayout.width,
      height: menuLayout.height,
    }));
  }, [isAnchorCoord, measureAnchorLayout]);

  const updateVisibility = React.useCallback(async () => {
    // Menu is rendered in Portal, which updates items asynchronously
    // We need to do the same here so that the ref is up-to-date
    await Promise.resolve();

    if (visible) {
      show();
    } else {
      removeListeners();

      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: ANIMATION_DURATION * scale,
        easing: EASING,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setMenuLayout({ width: 0, height: 0 });
          setRendered(false);
          scaleAnimation.setValue({ x: 0, y: 0 });
          focusFirstDOMNode(anchor.current);
        }
      });
    }
  }, [
    focusFirstDOMNode,
    opacityAnimation,
    removeListeners,
    scale,
    scaleAnimation,
    show,
    visible,
  ]);

  React.useEffect(() => {
    if (visible && !rendered) {
      setRendered(true);
    }
    updateVisibility();
  }, [visible, rendered, updateVisibility]);

  React.useEffect(() => {
    return () => {
      removeListeners();
    };
  }, [removeListeners]);

  const anchor = React.useRef<View | null>(null);
  const menu = React.useRef<View | null>(null);

  const measureMenuLayout = () =>
    new Promise<LayoutRectangle>((resolve) => {
      if (menu.current) {
        menu.current.measureInWindow((x, y, width, height) => {
          resolve({ x, y, width, height });
        });
      }
    });

  const isBrowser = () => Platform.OS === 'web' && 'document' in global;

  const attachListeners = React.useCallback(() => {
    BackHandler.addEventListener('hardwareBackPress', handleDismiss);
    Dimensions.addEventListener('change', handleDismiss);

    isBrowser() && document.addEventListener('keyup', handleKeypress);
  }, [handleDismiss, handleKeypress]);

  React.useEffect(() => {
    attachListeners();
    Animated.parallel([
      Animated.timing(scaleAnimation, {
        toValue: { x: menuLayout.width, y: menuLayout.height },
        duration: ANIMATION_DURATION * scale,
        easing: EASING,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: ANIMATION_DURATION * scale,
        easing: EASING,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        focusFirstDOMNode(menu.current);
      }
    });
  }, [
    left,
    top,
    anchorLayout,
    menuLayout,
    attachListeners,
    focusFirstDOMNode,
    opacityAnimation,
    scale,
    scaleAnimation,
  ]);

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
      setLeft(SCREEN_INDENT);
    }
  } else {
    positionTransforms.push({
      translateX: scaleAnimation.x.interpolate({
        inputRange: [0, menuLayout.width],
        outputRange: [menuLayout.width / 2, 0],
      }),
    });

    setLeft(left + anchorLayout.width - menuLayout.width);

    const right = left + menuLayout.width;
    // Check if menu position has enough space from right side
    if (right > windowLayout.width - SCREEN_INDENT) {
      setLeft(windowLayout.width - SCREEN_INDENT - menuLayout.width);
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
      setTop(SCREEN_INDENT);
    }
  } else {
    positionTransforms.push({
      translateY: scaleAnimation.y.interpolate({
        inputRange: [0, menuLayout.height],
        outputRange: [(scrollableMenuHeight || menuLayout.height) / 2, 0],
      }),
    });

    setTop(
      top + anchorLayout.height - (scrollableMenuHeight || menuLayout.height)
    );

    const bottom =
      top +
      (scrollableMenuHeight || menuLayout.height) +
      additionalVerticalValue;

    // Check if menu position has enough space from bottom side
    if (bottom > windowLayout.height - SCREEN_INDENT) {
      setTop(
        scrollableMenuHeight === windowLayout.height - 2 * SCREEN_INDENT
          ? -SCREEN_INDENT * 2
          : windowLayout.height -
              menuLayout.height -
              SCREEN_INDENT -
              additionalVerticalValue
      );
    }
  }

  const shadowMenuContainerStyle = {
    opacity: opacityAnimation,
    transform: scaleTransforms,
    borderRadius: theme.roundness,
    ...(scrollableMenuHeight ? { height: scrollableMenuHeight } : {}),
  };

  const positionStyle = {
    top: isAnchorCoord() ? top : top + additionalVerticalValue,
    ...(I18nManager.isRTL ? { right: left } : { left }),
  };

  return (
    <View ref={anchor} collapsable={false}>
      {isAnchorCoord() ? null : anchorProp}
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
            ref={menu}
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
};

// @component ./MenuItem.tsx
Menu.Item = MenuItem;

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
