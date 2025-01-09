import * as React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  EmitterSubscription,
  findNodeHandle,
  I18nManager,
  Keyboard,
  KeyboardEvent as RNKeyboardEvent,
  LayoutRectangle,
  NativeEventSubscription,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Pressable,
} from 'react-native';

import MenuItem from './MenuItem';
import { APPROX_STATUSBAR_HEIGHT } from '../../constants';
import { useInternalTheme } from '../../core/theming';
import type { MD3Elevation, ThemeProp } from '../../types';
import { ElevationLevels } from '../../types';
import { addEventListener } from '../../utils/addEventListener';
import { BackHandler } from '../../utils/BackHandler/BackHandler';
import Portal from '../Portal/Portal';
import Surface from '../Surface';

export type Props = {
  /**
   * Whether the Menu is currently visible.
   */
  visible: boolean;
  /**
   * The anchor to open the menu from. In most cases, it will be a button that opens the menu.
   */
  anchor: React.ReactNode | { x: number; y: number };
  /**
   * Whether the menu should open at the top of the anchor or at its bottom.
   * Applied only when anchor is a node, not an x/y position.
   */
  anchorPosition?: 'top' | 'bottom';
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
  onDismiss?: () => void;
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
  contentStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  style?: StyleProp<ViewStyle>;
  /**
   * Elevation level of the menu's content. Shadow styles are calculated based on this value. Default `backgroundColor` is taken from the corresponding `theme.colors.elevation` property. By default equals `2`.
   * @supported Available in v5.x with theme version 3
   */
  elevation?: MD3Elevation;
  /**
   * Mode of the menu's content.
   * - `elevated` - Surface with a shadow and background color corresponding to set `elevation` value.
   * - `flat` - Surface without a shadow, with the background color corresponding to set `elevation` value.
   *
   * @supported Available in v5.x with theme version 3
   */
  mode?: 'flat' | 'elevated';
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * Inner ScrollView prop
   */
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

// Minimum padding between the edge of the screen and the menu
const SCREEN_INDENT = 8;
// From https://material.io/design/motion/speed.html#duration
const ANIMATION_DURATION = 250;
// From the 'Standard easing' section of https://material.io/design/motion/speed.html#easing
const EASING = Easing.bezier(0.4, 0, 0.2, 1);

const WINDOW_LAYOUT = Dimensions.get('window');

const DEFAULT_ELEVATION: MD3Elevation = 2;
export const ELEVATION_LEVELS_MAP = Object.values(
  ElevationLevels
) as ElevationLevels[];

const DEFAULT_MODE = 'elevated';

const focusFirstDOMNode = (el: View | null | undefined) => {
  if (el && Platform.OS === 'web') {
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

const isCoordinate = (anchor: any): anchor is { x: number; y: number } =>
  !React.isValidElement(anchor) &&
  typeof anchor?.x === 'number' &&
  typeof anchor?.y === 'number';

const isBrowser = () => Platform.OS === 'web' && 'document' in global;

/**
 * Menus display a list of choices on temporary elevated surfaces. Their placement varies based on the element that opens them.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Button, Menu, Divider, PaperProvider } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(false);
 *
 *   const openMenu = () => setVisible(true);
 *
 *   const closeMenu = () => setVisible(false);
 *
 *   return (
 *     <PaperProvider>
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
 *     </PaperProvider>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 *
 * ### Note
 * When using `Menu` within a React Native's `Modal` component, you need to wrap all
 * `Modal` contents within a `PaperProvider` in order for the menu to show. This
 * wrapping is not necessary if you use Paper's `Modal` instead.
 */

const Menu = ({
  visible,
  statusBarHeight = APPROX_STATUSBAR_HEIGHT,
  overlayAccessibilityLabel = 'Close menu',
  testID = 'menu',
  anchor,
  onDismiss,
  anchorPosition,
  contentStyle,
  style,
  elevation = DEFAULT_ELEVATION,
  mode = DEFAULT_MODE,
  children,
  theme: themeOverrides,
  keyboardShouldPersistTaps,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const [rendered, setRendered] = React.useState(visible);
  const [left, setLeft] = React.useState(0);
  const [top, setTop] = React.useState(0);
  const [menuLayout, setMenuLayout] = React.useState({ width: 0, height: 0 });
  const [anchorLayout, setAnchorLayout] = React.useState({
    width: 0,
    height: 0,
  });
  const [windowLayout, setWindowLayout] = React.useState({
    width: WINDOW_LAYOUT.width,
    height: WINDOW_LAYOUT.height,
  });

  const opacityAnimationRef = React.useRef(new Animated.Value(0));
  const scaleAnimationRef = React.useRef(new Animated.ValueXY({ x: 0, y: 0 }));
  const keyboardHeightRef = React.useRef(0);
  const prevVisible = React.useRef<boolean | null>(null);
  const anchorRef = React.useRef<View | null>(null);
  const menuRef = React.useRef<View | null>(null);
  const prevRendered = React.useRef(false);

  const keyboardDidShow = React.useCallback((e: RNKeyboardEvent) => {
    const keyboardHeight = e.endCoordinates.height;
    keyboardHeightRef.current = keyboardHeight;
  }, []);

  const keyboardDidHide = React.useCallback(() => {
    keyboardHeightRef.current = 0;
  }, []);

  const keyboardDidShowListenerRef: React.MutableRefObject<
    EmitterSubscription | undefined
  > = React.useRef();
  const keyboardDidHideListenerRef: React.MutableRefObject<
    EmitterSubscription | undefined
  > = React.useRef();

  const backHandlerSubscriptionRef: React.MutableRefObject<
    NativeEventSubscription | undefined
  > = React.useRef();
  const dimensionsSubscriptionRef: React.MutableRefObject<
    NativeEventSubscription | undefined
  > = React.useRef();

  const handleDismiss = React.useCallback(() => {
    if (visible) {
      onDismiss?.();
    }
  }, [onDismiss, visible]);

  const handleKeypress = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss?.();
      }
    },
    [onDismiss]
  );

  const removeListeners = React.useCallback(() => {
    backHandlerSubscriptionRef.current?.remove();
    dimensionsSubscriptionRef.current?.remove();
    isBrowser() && document.removeEventListener('keyup', handleKeypress);
  }, [handleKeypress]);

  const attachListeners = React.useCallback(() => {
    backHandlerSubscriptionRef.current = addEventListener(
      BackHandler,
      'hardwareBackPress',
      handleDismiss
    );
    dimensionsSubscriptionRef.current = addEventListener(
      Dimensions,
      'change',
      handleDismiss
    );
    Platform.OS === 'web' && document.addEventListener('keyup', handleKeypress);
  }, [handleDismiss, handleKeypress]);

  const measureMenuLayout = () =>
    new Promise<LayoutRectangle>((resolve) => {
      if (menuRef.current) {
        menuRef.current.measureInWindow((x, y, width, height) => {
          resolve({ x, y, width, height });
        });
      }
    });

  const measureAnchorLayout = React.useCallback(
    () =>
      new Promise<LayoutRectangle>((resolve) => {
        if (isCoordinate(anchor)) {
          resolve({ x: anchor.x, y: anchor.y, width: 0, height: 0 });
          return;
        }

        if (anchorRef.current) {
          anchorRef.current.measureInWindow((x, y, width, height) => {
            resolve({ x, y, width, height });
          });
        }
      }),
    [anchor]
  );

  const show = React.useCallback(async () => {
    const windowLayoutResult = Dimensions.get('window');
    const [menuLayoutResult, anchorLayoutResult] = await Promise.all([
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
      !windowLayoutResult.width ||
      !windowLayoutResult.height ||
      !menuLayoutResult.width ||
      !menuLayoutResult.height ||
      (!anchorLayoutResult.width && !isCoordinate(anchor)) ||
      (!anchorLayoutResult.height && !isCoordinate(anchor))
    ) {
      requestAnimationFrame(show);
      return;
    }

    setLeft(anchorLayoutResult.x);
    setTop(anchorLayoutResult.y);
    setAnchorLayout({
      height: anchorLayoutResult.height,
      width: anchorLayoutResult.width,
    });

    setMenuLayout({
      height: menuLayoutResult.height,
      width: menuLayoutResult.width,
    });

    setWindowLayout({
      height: windowLayoutResult.height - keyboardHeightRef.current,
      width: windowLayoutResult.width,
    });

    attachListeners();
    const { animation } = theme;
    Animated.parallel([
      Animated.timing(scaleAnimationRef.current, {
        toValue: { x: menuLayoutResult.width, y: menuLayoutResult.height },
        duration: ANIMATION_DURATION * animation.scale,
        easing: EASING,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnimationRef.current, {
        toValue: 1,
        duration: ANIMATION_DURATION * animation.scale,
        easing: EASING,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        focusFirstDOMNode(menuRef.current);
        prevRendered.current = true;
      }
    });
  }, [anchor, attachListeners, measureAnchorLayout, theme]);

  const hide = React.useCallback(() => {
    removeListeners();

    const { animation } = theme;

    Animated.timing(opacityAnimationRef.current, {
      toValue: 0,
      duration: ANIMATION_DURATION * animation.scale,
      easing: EASING,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setMenuLayout({ width: 0, height: 0 });
        setRendered(false);
        prevRendered.current = false;
        focusFirstDOMNode(anchorRef.current);
      }
    });
  }, [removeListeners, theme]);

  const updateVisibility = React.useCallback(
    async (display: boolean) => {
      // Menu is rendered in Portal, which updates items asynchronously
      // We need to do the same here so that the ref is up-to-date
      await Promise.resolve().then(() => {
        if (display && !prevRendered.current) {
          show();
        } else {
          if (rendered) {
            hide();
          }
        }

        return;
      });
    },
    [hide, show, rendered]
  );

  React.useEffect(() => {
    const opacityAnimation = opacityAnimationRef.current;
    const scaleAnimation = scaleAnimationRef.current;
    keyboardDidShowListenerRef.current = Keyboard.addListener(
      'keyboardDidShow',
      keyboardDidShow
    );
    keyboardDidHideListenerRef.current = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHide
    );

    return () => {
      removeListeners();
      keyboardDidShowListenerRef.current?.remove();
      keyboardDidHideListenerRef.current?.remove();
      scaleAnimation.removeAllListeners();
      opacityAnimation?.removeAllListeners();
    };
  }, [removeListeners, keyboardDidHide, keyboardDidShow]);

  React.useEffect(() => {
    if (prevVisible.current !== visible) {
      prevVisible.current = visible;

      if (visible !== rendered) {
        setRendered(visible);
      }
    }
  }, [visible, rendered]);

  React.useEffect(() => {
    updateVisibility(rendered);
  }, [rendered, updateVisibility]);

  // I don't know why but on Android measure function is wrong by 24
  const additionalVerticalValue = Platform.select({
    android: statusBarHeight,
    default: 0,
  });

  // We need to translate menu while animating scale to imitate transform origin for scale animation
  const positionTransforms = [];
  let leftTransformation = left;
  let topTransformation =
    !isCoordinate(anchorRef.current) && anchorPosition === 'bottom'
      ? top + anchorLayout.height
      : top;

  // Check if menu fits horizontally and if not align it to right.
  if (left <= windowLayout.width - menuLayout.width - SCREEN_INDENT) {
    positionTransforms.push({
      translateX: scaleAnimationRef.current.x.interpolate({
        inputRange: [0, menuLayout.width],
        outputRange: [-(menuLayout.width / 2), 0],
      }),
    });

    // Check if menu position has enough space from left side
    if (leftTransformation < SCREEN_INDENT) {
      leftTransformation = SCREEN_INDENT;
    }
  } else {
    positionTransforms.push({
      translateX: scaleAnimationRef.current.x.interpolate({
        inputRange: [0, menuLayout.width],
        outputRange: [menuLayout.width / 2, 0],
      }),
    });

    leftTransformation += anchorLayout.width - menuLayout.width;

    const right = leftTransformation + menuLayout.width;
    // Check if menu position has enough space from right side
    if (right > windowLayout.width - SCREEN_INDENT) {
      leftTransformation =
        windowLayout.width - SCREEN_INDENT - menuLayout.width;
    }
  }

  // If the menu is larger than available vertical space,
  // calculate the height of scrollable view
  let scrollableMenuHeight = 0;

  // Check if the menu should be scrollable
  if (
    // Check if the menu overflows from bottom side
    topTransformation >=
      windowLayout.height -
        menuLayout.height -
        SCREEN_INDENT -
        additionalVerticalValue &&
    // And bottom side of the screen has more space than top side
    topTransformation <= windowLayout.height - topTransformation
  ) {
    // Scrollable menu should be below the anchor (expands downwards)
    scrollableMenuHeight =
      windowLayout.height -
      topTransformation -
      SCREEN_INDENT -
      additionalVerticalValue;
  } else if (
    // Check if the menu overflows from bottom side
    topTransformation >=
      windowLayout.height -
        menuLayout.height -
        SCREEN_INDENT -
        additionalVerticalValue &&
    // And top side of the screen has more space than bottom side
    topTransformation >= windowLayout.height - top &&
    // And menu overflows from top side
    topTransformation <=
      menuLayout.height -
        anchorLayout.height +
        SCREEN_INDENT -
        additionalVerticalValue
  ) {
    // Scrollable menu should be above the anchor (expands upwards)
    scrollableMenuHeight =
      topTransformation +
      anchorLayout.height -
      SCREEN_INDENT +
      additionalVerticalValue;
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
    topTransformation <=
      windowLayout.height -
        menuLayout.height -
        SCREEN_INDENT -
        additionalVerticalValue ||
    // Or if the menu overflows from bottom side
    (topTransformation >=
      windowLayout.height -
        menuLayout.height -
        SCREEN_INDENT -
        additionalVerticalValue &&
      // And bottom side of the screen has more space than top side
      topTransformation <= windowLayout.height - topTransformation)
  ) {
    positionTransforms.push({
      translateY: scaleAnimationRef.current.y.interpolate({
        inputRange: [0, menuLayout.height],
        outputRange: [-((scrollableMenuHeight || menuLayout.height) / 2), 0],
      }),
    });

    // Check if menu position has enough space from top side
    if (topTransformation < SCREEN_INDENT) {
      topTransformation = SCREEN_INDENT;
    }
  } else {
    positionTransforms.push({
      translateY: scaleAnimationRef.current.y.interpolate({
        inputRange: [0, menuLayout.height],
        outputRange: [(scrollableMenuHeight || menuLayout.height) / 2, 0],
      }),
    });

    topTransformation +=
      anchorLayout.height - (scrollableMenuHeight || menuLayout.height);

    const bottom =
      topTransformation +
      (scrollableMenuHeight || menuLayout.height) +
      additionalVerticalValue;

    // Check if menu position has enough space from bottom side
    if (bottom > windowLayout.height - SCREEN_INDENT) {
      topTransformation =
        scrollableMenuHeight === windowLayout.height - 2 * SCREEN_INDENT
          ? -SCREEN_INDENT * 2
          : windowLayout.height -
            menuLayout.height -
            SCREEN_INDENT -
            additionalVerticalValue;
    }
  }

  const shadowMenuContainerStyle = {
    opacity: opacityAnimationRef.current,
    transform: [
      {
        scaleX: scaleAnimationRef.current.x.interpolate({
          inputRange: [0, menuLayout.width],
          outputRange: [0, 1],
        }),
      },
      {
        scaleY: scaleAnimationRef.current.y.interpolate({
          inputRange: [0, menuLayout.height],
          outputRange: [0, 1],
        }),
      },
    ],
    borderRadius: theme.roundness,
    ...(!theme.isV3 && { elevation: 8 }),
    ...(scrollableMenuHeight ? { height: scrollableMenuHeight } : {}),
  };

  const positionStyle = {
    top: isCoordinate(anchor)
      ? topTransformation
      : topTransformation + additionalVerticalValue,
    ...(I18nManager.getConstants().isRTL
      ? { right: leftTransformation }
      : { left: leftTransformation }),
  };

  const pointerEvents = visible ? 'box-none' : 'none';

  return (
    <View ref={(ref) => (anchorRef.current = ref)} collapsable={false}>
      {isCoordinate(anchor) ? null : anchor}
      {rendered ? (
        <Portal>
          <Pressable
            accessibilityLabel={overlayAccessibilityLabel}
            accessibilityRole="button"
            onPress={onDismiss}
            style={styles.pressableOverlay}
          />
          <View
            ref={(ref) => (menuRef.current = ref)}
            collapsable={false}
            accessibilityViewIsModal={visible}
            style={[styles.wrapper, positionStyle, style]}
            pointerEvents={pointerEvents}
            onAccessibilityEscape={onDismiss}
            testID={`${testID}-view`}
          >
            <Animated.View
              pointerEvents={pointerEvents}
              style={{
                transform: positionTransforms,
              }}
            >
              <Surface
                mode={mode}
                pointerEvents={pointerEvents}
                style={[
                  styles.shadowMenuContainer,
                  shadowMenuContainerStyle,
                  theme.isV3 && {
                    backgroundColor:
                      theme.colors.elevation[ELEVATION_LEVELS_MAP[elevation]],
                  },
                  contentStyle,
                ]}
                {...(theme.isV3 && { elevation })}
                testID={`${testID}-surface`}
                theme={theme}
              >
                {(scrollableMenuHeight && (
                  <ScrollView
                    keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                  >
                    {children}
                  </ScrollView>
                )) || <React.Fragment>{children}</React.Fragment>}
              </Surface>
            </Animated.View>
          </View>
        </Portal>
      ) : null}
    </View>
  );
};

Menu.Item = MenuItem;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
  },
  shadowMenuContainer: {
    opacity: 0,
    paddingVertical: 8,
  },
  pressableOverlay: {
    ...Platform.select({
      web: {
        cursor: 'auto',
      },
    }),
    ...StyleSheet.absoluteFillObject,
    width: '100%',
  },
});

export default Menu;
