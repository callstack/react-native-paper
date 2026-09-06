import * as React from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { KeyboardEvent as RNKeyboardEvent } from 'react-native';
import type {
  EmitterSubscription,
  LayoutRectangle,
  NativeEventSubscription,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import useLatestCallback from 'use-latest-callback';

import MenuItem from './MenuItem';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import type { Elevation, ThemeProp } from '../../theme/types';
import { addEventListener } from '../../utils/addEventListener';
import { BackHandler } from '../../utils/BackHandler/BackHandler';
import Portal from '../Portal/Portal';
import Surface from '../Surface';
import type { SurfaceStyle } from '../Surface';

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
  contentStyle?: StyleProp<SurfaceStyle>;
  style?: StyleProp<ViewStyle>;
  /**
   * Elevation level of the menu's content. Shadow styles are calculated based on this value. Default `backgroundColor` is taken from the corresponding `theme.colors.elevation` property. By default equals `2`.
   * @supported Available in v5.x with theme version 3
   */
  elevation?: Elevation;
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

const DEFAULT_ELEVATION: Elevation = 2;
const DEFAULT_MODE = 'elevated';

const focusFirstDOMNode = (el: View | null | undefined) => {
  if (el && Platform.OS === 'web') {
    // When in the browser, we want to focus the first focusable item on toggle
    // For example, when menu is shown, focus the first item in the menu
    // And when menu is dismissed, send focus back to the button to resume tabbing
    if (el instanceof HTMLElement) {
      el.querySelector<HTMLElement>(
        // This is a rough list of selectors that can be focused
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )?.focus();
    }
  }
};

const isCoordinate = (anchor: any): anchor is { x: number; y: number } =>
  !React.isValidElement(anchor) &&
  typeof anchor?.x === 'number' &&
  typeof anchor?.y === 'number';

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
  statusBarHeight,
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

  const { direction } = useLocale();
  const insets = useSafeAreaInsets();

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

  const opacity = useSharedValue(0);
  const scaleX = useSharedValue(0);
  const scaleY = useSharedValue(0);

  const keyboardHeightRef = React.useRef(0);
  const prevVisible = React.useRef<boolean | null>(null);
  const anchorRef = React.useRef<View | null>(null);
  const menuRef = React.useRef<View | null>(null);
  const isShownRef = React.useRef(false);

  const keyboardDidShow = React.useCallback((e: RNKeyboardEvent) => {
    const keyboardHeight = e.endCoordinates.height;
    keyboardHeightRef.current = keyboardHeight;
  }, []);

  const keyboardDidHide = React.useCallback(() => {
    keyboardHeightRef.current = 0;
  }, []);

  const keyboardDidShowListenerRef: React.RefObject<
    EmitterSubscription | undefined
  > = React.useRef(undefined);
  const keyboardDidHideListenerRef: React.RefObject<
    EmitterSubscription | undefined
  > = React.useRef(undefined);

  const backHandlerSubscriptionRef: React.RefObject<
    NativeEventSubscription | undefined
  > = React.useRef(undefined);
  const dimensionsSubscriptionRef: React.RefObject<
    NativeEventSubscription | undefined
  > = React.useRef(undefined);

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

    if (Platform.OS === 'web' && 'document' in global) {
      document.removeEventListener('keyup', handleKeypress);
    }
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

  const handleShowAnimationFinished = useLatestCallback((finished: boolean) => {
    if (!finished || !prevVisible.current) {
      return;
    }

    isShownRef.current = true;
    focusFirstDOMNode(menuRef.current);
  });

  const handleHideAnimationFinished = useLatestCallback((finished: boolean) => {
    if (!finished || prevVisible.current) {
      return;
    }

    setMenuLayout({ width: 0, height: 0 });
    setRendered(false);
    isShownRef.current = false;
    focusFirstDOMNode(anchorRef.current);
  });

  const show = React.useCallback(async () => {
    const windowLayoutResult = Dimensions.get('window');
    const [menuLayoutResult, anchorLayoutResult] = await Promise.all([
      measureMenuLayout(),
      measureAnchorLayout(),
    ]);

    if (!prevVisible.current) {
      return;
    }

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

    requestAnimationFrame(() => {
      if (!prevVisible.current) {
        return;
      }

      const { animation } = theme;

      const config = {
        duration: ANIMATION_DURATION * animation.scale,
        easing: EASING,
        reduceMotion: ReduceMotion.Never,
      };

      scaleX.value = withTiming(menuLayoutResult.width, config);
      scaleY.value = withTiming(menuLayoutResult.height, config);

      opacity.value = withTiming(1, config, (finished) =>
        scheduleOnRN(handleShowAnimationFinished, finished ?? false)
      );
    });
  }, [
    anchor,
    attachListeners,
    handleShowAnimationFinished,
    measureAnchorLayout,
    opacity,
    scaleX,
    scaleY,
    theme,
  ]);

  const hide = React.useCallback(() => {
    removeListeners();
    isShownRef.current = false;

    const { animation } = theme;

    opacity.value = withTiming(
      0,
      {
        duration: ANIMATION_DURATION * animation.scale,
        easing: EASING,
        reduceMotion: ReduceMotion.Never,
      },
      (finished) => scheduleOnRN(handleHideAnimationFinished, finished ?? false)
    );
  }, [handleHideAnimationFinished, opacity, removeListeners, theme]);

  const updateVisibility = React.useCallback(
    async (display: boolean) => {
      // Menu is rendered in Portal, which updates items asynchronously
      // We need to do the same here so that the ref is up-to-date
      await Promise.resolve();

      if (display && !isShownRef.current) {
        await show();
        return;
      }

      if (!display) {
        hide();
      }
    },
    [hide, show]
  );

  React.useEffect(() => {
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
    };
  }, [removeListeners, keyboardDidHide, keyboardDidShow]);

  if (visible && !rendered) {
    // Mount the Portal before attempting to show.
    setRendered(true);
  }

  React.useEffect(() => {
    if (prevVisible.current !== visible) {
      prevVisible.current = visible;

      if (!visible) {
        // Keep the Portal mounted so the hide animation can finish.
        void updateVisibility(false);
      }
    }
  }, [visible, updateVisibility]);

  React.useEffect(() => {
    if (rendered && visible) {
      void updateVisibility(true);
    }
  }, [rendered, visible, updateVisibility]);

  // I don't know why but on Android measure function is wrong by 24
  const additionalVerticalValue = Platform.select({
    android: statusBarHeight ?? insets.top,
    default: 0,
  });

  // We need to translate menu while animating scale to imitate transform origin for scale animation
  let startTranslateX = 0;
  let startTranslateY = 0;

  let leftTransformation = left;
  let topTransformation =
    !isCoordinate(anchorRef.current) && anchorPosition === 'bottom'
      ? top + anchorLayout.height
      : top;

  // Check if menu fits horizontally and if not align it to right.
  if (left <= windowLayout.width - menuLayout.width - SCREEN_INDENT) {
    startTranslateX = -(menuLayout.width / 2);

    // Check if menu position has enough space from left side
    if (leftTransformation < SCREEN_INDENT) {
      leftTransformation = SCREEN_INDENT;
    }
  } else {
    startTranslateX = menuLayout.width / 2;

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
    startTranslateY = -((scrollableMenuHeight || menuLayout.height) / 2);

    // Check if menu position has enough space from top side
    if (topTransformation < SCREEN_INDENT) {
      topTransformation = SCREEN_INDENT;
    }
  } else {
    startTranslateY = (scrollableMenuHeight || menuLayout.height) / 2;

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

  const shadowMenuContainerStyle: ViewStyle = scrollableMenuHeight
    ? { height: scrollableMenuHeight }
    : {};

  const positionTransformsStyle = useAnimatedStyle(() => {
    const scaleXProgress = menuLayout.width
      ? scaleX.value / menuLayout.width
      : 0;

    const scaleYProgress = menuLayout.height
      ? scaleY.value / menuLayout.height
      : 0;

    return {
      transform: [
        { translateX: startTranslateX * (1 - scaleXProgress) },
        { translateY: startTranslateY * (1 - scaleYProgress) },
      ],
    };
  });

  const shadowMenuAnimationStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        scaleX: menuLayout.width ? scaleX.value / menuLayout.width : 0,
      },
      {
        scaleY: menuLayout.height ? scaleY.value / menuLayout.height : 0,
      },
    ],
  }));

  const positionStyle = {
    top: isCoordinate(anchor)
      ? topTransformation
      : topTransformation + additionalVerticalValue,
    ...(direction === 'rtl'
      ? { right: leftTransformation }
      : { left: leftTransformation }),
  };

  const pointerEvents = visible ? 'box-none' : 'none';

  return (
    <View
      ref={(ref) => {
        anchorRef.current = ref;
      }}
      collapsable={false}
    >
      {isCoordinate(anchor) ? null : anchor}
      {rendered ? (
        <Portal>
          <Pressable
            aria-label={overlayAccessibilityLabel}
            role="button"
            onPress={onDismiss}
            pointerEvents={visible ? 'auto' : 'none'}
            style={styles.pressableOverlay}
          />
          <View
            ref={(ref) => {
              menuRef.current = ref;
            }}
            collapsable={false}
            aria-modal={visible}
            style={[styles.wrapper, positionStyle, style]}
            pointerEvents={pointerEvents}
            onAccessibilityEscape={onDismiss}
            testID={`${testID}-view`}
          >
            <Animated.View
              pointerEvents={pointerEvents}
              style={positionTransformsStyle}
            >
              <Surface
                mode={mode}
                borderRadius={theme.shapes.corner.extraSmall}
                style={[
                  styles.shadowMenuContainer,
                  { pointerEvents },
                  shadowMenuContainerStyle,
                  shadowMenuAnimationStyle,
                ]}
                elevation={elevation}
                testID={`${testID}-surface`}
                theme={theme}
              >
                <Animated.View
                  style={[
                    styles.menuContent,
                    Boolean(scrollableMenuHeight) && styles.fill,
                    contentStyle,
                  ]}
                >
                  {(scrollableMenuHeight && (
                    <ScrollView
                      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                    >
                      {children}
                    </ScrollView>
                  )) || <React.Fragment>{children}</React.Fragment>}
                </Animated.View>
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
  },
  menuContent: {
    paddingVertical: 8,
  },
  fill: {
    height: '100%',
  },
  pressableOverlay: {
    ...Platform.select({
      web: {
        cursor: 'auto',
      },
    }),
    ...StyleSheet.absoluteFill,
    width: '100%',
  },
});

export default Menu;
