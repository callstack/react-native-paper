import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ColorValue, StyleProp, ViewProps } from 'react-native';

import { AppbarContext } from './AppbarContext';
import type { AppbarContextType, AppbarItemKind } from './AppbarContext';
import {
  APPBAR_ACTION_WIDTH,
  APPBAR_FLEXIBLE_CONTROLS_HEIGHT,
  APPBAR_HORIZONTAL_PADDING,
  getAppbarBackgroundColor,
  isFlexibleMode,
  modeAppbarHeight,
} from './utils';
import type { AppbarModes } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';
import Surface from '../Surface';
import type { SurfaceStyle, SurfaceVisualProps } from '../Surface';

export type Props = Omit<Partial<ViewProps>, 'style'> &
  Omit<SurfaceVisualProps, 'backgroundColor'> & {
    /**
     * Whether the background color is a dark color. A dark appbar will render light text and vice-versa.
     */
    dark?: boolean;
    /**
     * Background color of the Appbar. Overrides the color derived from the `elevated` prop.
     */
    backgroundColor?: ColorValue;
    /**
     * Content of the `Appbar`.
     */
    children: React.ReactNode;
    /**
     * @supported Available in v5.x with theme version 3
     *
     * Mode of the Appbar.
     * - `small` - Appbar with default height (64).
     * - `medium` - Appbar with medium height (112).
     * - `large` - Appbar with large height (152).
     * - `center-aligned` - Appbar with default height and center-aligned title.
     * - `medium-flexible` - Material 3 Expressive Appbar with a larger title and a minimum height of 112. It grows when the title wraps onto a second line.
     * - `large-flexible` - Material 3 Expressive Appbar with a prominent title and a minimum height of 120. It grows when the title wraps onto a second line.
     */
    mode?: AppbarModes;
    /**
     * @supported Available in v5.x with theme version 3
     * Whether Appbar background should have the elevation along with primary color pigment.
     */
    elevated?: boolean;
    /**
     * Whether the content below the Appbar has scrolled. A scrolled Appbar uses the `surfaceContainer` color for its background,
     * without elevation. Overridden by `backgroundColor`.
     */
    isScrolled?: boolean;
    /**
     * Safe area insets for the Appbar. This can be used to avoid elements like the status bar and the camera cutout.
     *
     * Using `bottom` to build a bottom bar is deprecated.
     */
    safeAreaInsets?: {
      bottom?: number;
      top?: number;
      left?: number;
      right?: number;
    };
    /**
     * @optional
     */
    theme?: ThemeProp;
    /**
     * Style of the Appbar.
     *
     * Background color and border radius should be specified via props instead.
     */
    style?: StyleProp<SurfaceStyle>;
  };

/**
 * A component to display action items in a bar. It is usually placed at the top of the screen
 * and contains the screen title and controls such as navigation buttons, menu button etc.
 *
 * Its parts, `Appbar.BackAction`, `Appbar.Content` and `Appbar.Action`, read what they need from the `Appbar`
 * they are rendered in, so they can be wrapped in other components, for example in a `Tooltip` or a `Menu`.
 * The parts are laid out in the order they are rendered: render the leading actions first, then the content, then the trailing actions.
 *
 * ## Usage
 * ### Top bar
 * ```js
 * import * as React from 'react';
 * import { Appbar } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Appbar.Header>
 *     <Appbar.BackAction onPress={() => {}} />
 *     <Appbar.Content title="Title" />
 *     <Appbar.Action icon="calendar" onPress={() => {}} />
 *     <Appbar.Action icon="magnify" onPress={() => {}} />
 *   </Appbar.Header>
 * );
 *
 * export default MyComponent;
 * ```
 *
 * ### Bottom bar
 *
 * Using `Appbar` as a bottom bar is deprecated. Material Design 3 moves the bottom bar to toolbars,
 * and it will be replaced by the `Toolbar` component once it is available.
 *
 * ```js
 * import * as React from 'react';
 * import { StyleSheet } from 'react-native';
 * import { Appbar, FAB, useTheme } from 'react-native-paper';
 * import { useSafeAreaInsets } from 'react-native-safe-area-context';
 *
 * const BOTTOM_APPBAR_HEIGHT = 80;
 * const FAB_HEIGHT = 56;
 *
 * const MyComponent = () => {
 *   const { bottom } = useSafeAreaInsets();
 *   const theme = useTheme();
 *
 *   return (
 *     <Appbar
 *       style={[styles.bottom, { height: BOTTOM_APPBAR_HEIGHT + bottom }]}
 *       backgroundColor={theme.colors.surfaceContainer}
 *       safeAreaInsets={{ bottom }}
 *     >
 *       <Appbar.Action icon="archive" onPress={() => {}} />
 *       <Appbar.Action icon="email" onPress={() => {}} />
 *       <Appbar.Action icon="label" onPress={() => {}} />
 *       <Appbar.Action icon="delete" onPress={() => {}} />
 *       <FAB
 *         icon="plus"
 *         onPress={() => {}}
 *         style={[
 *           styles.fab,
 *           { top: (BOTTOM_APPBAR_HEIGHT - FAB_HEIGHT) / 2 },
 *         ]}
 *       />
 *     </Appbar>
 *   );
 * };
 *
 * const styles = StyleSheet.create({
 *   bottom: {
 *     position: 'absolute',
 *     left: 0,
 *     right: 0,
 *     bottom: 0,
 *   },
 *   fab: {
 *     position: 'absolute',
 *     right: 16,
 *   },
 * });
 *
 * export default MyComponent;
 * ```
 */
const Appbar = ({
  children,
  dark,
  style,
  mode = 'small',
  elevated = false,
  isScrolled = false,
  safeAreaInsets,
  theme: themeOverrides,
  backgroundColor: customBackground,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const [items, setItems] = React.useState<Record<AppbarItemKind, number>>({
    leading: 0,
    trailing: 0,
    content: 0,
  });
  const [contentHeight, setContentHeight] = React.useState(0);

  const backgroundColor = getAppbarBackgroundColor(
    theme,
    elevated || isScrolled,
    customBackground
  );

  const isDark = typeof dark === 'boolean' ? dark : false;
  const isCenterAlignedMode = mode === 'center-aligned';
  const isFlexible = isFlexibleMode(mode);
  const isTopAligned = mode === 'medium' || mode === 'large' || isFlexible;

  const insets = {
    top: safeAreaInsets?.top ?? 0,
    bottom: safeAreaInsets?.bottom ?? 0,
    left: safeAreaInsets?.left ?? 0,
    right: safeAreaInsets?.right ?? 0,
  };

  const registerItem = React.useCallback((kind: AppbarItemKind) => {
    setItems((current) => ({ ...current, [kind]: current[kind] + 1 }));

    return () =>
      setItems((current) => ({ ...current, [kind]: current[kind] - 1 }));
  }, []);

  const appbarContext = React.useMemo<AppbarContextType>(
    () => ({
      mode,
      dark: isDark,
      insets: {
        top: insets.top,
        bottom: insets.bottom,
        left: insets.left,
        right: insets.right,
      },
      theme: themeOverrides,
      registerItem: isCenterAlignedMode ? registerItem : undefined,
      onContentLayout: isFlexible ? setContentHeight : undefined,
    }),
    [
      mode,
      isDark,
      insets.top,
      insets.bottom,
      insets.left,
      insets.right,
      themeOverrides,
      isCenterAlignedMode,
      isFlexible,
      registerItem,
    ]
  );

  // The title is only centered when there is room for it between the actions
  const shouldCenterContent =
    isCenterAlignedMode &&
    items.content > 0 &&
    items.leading < 2 &&
    items.trailing < 3;
  const shouldAddLeftSpacing = shouldCenterContent && items.leading === 0;
  const shouldAddRightSpacing = shouldCenterContent && items.trailing === 0;

  const paddingStyle = {
    paddingBottom: insets.bottom,
    paddingTop: insets.top + topOffset[mode],
    paddingLeft: insets.left + APPBAR_HORIZONTAL_PADDING,
    paddingRight: insets.right + APPBAR_HORIZONTAL_PADDING,
  };

  // The safe area insets are applied as padding, so they need to be included in the height
  const verticalInsets = insets.top + insets.bottom;
  const heightStyle = isFlexible
    ? {
        minHeight:
          Math.max(
            modeAppbarHeight[mode],
            APPBAR_FLEXIBLE_CONTROLS_HEIGHT + contentHeight
          ) + verticalInsets,
      }
    : { height: modeAppbarHeight[mode] + verticalInsets };

  return (
    <AppbarContext.Provider value={appbarContext}>
      <Surface
        backgroundColor={backgroundColor}
        style={[
          heightStyle,
          styles.appbar,
          isTopAligned && styles.topAligned,
          paddingStyle,
          style,
        ]}
        elevation={elevated ? 2 : 0}
        // The flat mode renders a single view, so an animated `style` is visible on iOS
        mode={elevated ? 'elevated' : 'flat'}
        {...rest}
        theme={theme}
      >
        {shouldAddLeftSpacing ? <View style={styles.spacing} /> : null}
        {children}
        {shouldAddRightSpacing ? <View style={styles.spacing} /> : null}
      </Surface>
    </AppbarContext.Provider>
  );
};

// Offsets the controls of the `medium` and `large` modes so they are vertically centered in the top half of the Appbar
const topOffset = {
  small: 0,
  'center-aligned': 0,
  'medium-flexible': 0,
  'large-flexible': 0,
  medium: 8,
  large: 18,
};

const styles = StyleSheet.create({
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topAligned: {
    alignItems: 'flex-start',
  },
  spacing: {
    width: APPBAR_ACTION_WIDTH,
  },
});

export default Appbar;

// @component-docs ignore-next-line
export { Appbar };
