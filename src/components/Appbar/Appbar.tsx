import * as React from 'react';
import { StyleSheet } from 'react-native';
import type {
  ColorValue,
  LayoutChangeEvent,
  LayoutRectangle,
  StyleProp,
  ViewProps,
} from 'react-native';

import { AppbarContext } from './AppbarContext';
import type { AppbarContextType } from './AppbarContext';
import {
  APPBAR_CONTROLS_HEIGHT,
  APPBAR_CONTROLS_OFFSET,
  APPBAR_HORIZONTAL_PADDING,
  getAppbarBackgroundColor,
  getCenteringMargins,
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
 * Its parts, `Appbar.BackAction`, `Appbar.Content` and `Appbar.Action`, read the colors and the theme from the `Appbar`
 * they are rendered in. `Appbar.Action` and `Appbar.BackAction` can be wrapped in other components, for example in a `Tooltip` or a `Menu`.
 * `Appbar.Content` positions the title in the `Appbar`, so render it directly in the `Appbar`, not in a wrapper.
 * Only these parts read the colors and the theme of the `Appbar`. A custom child, such as an icon or a `Tooltip`, doesn't get them,
 * so pass it the `color` or the `theme` it needs.
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
  onLayout,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const [contentHeight, setContentHeight] = React.useState(0);
  const [barWidth, setBarWidth] = React.useState(0);
  const [centeredContent, setCenteredContent] = React.useState<{
    x: number;
    width: number;
    spacers: { left: number; right: number };
  } | null>(null);

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

  const paddingLeft = insets.left + APPBAR_HORIZONTAL_PADDING;
  const paddingRight = insets.right + APPBAR_HORIZONTAL_PADDING;

  // The title is centered by adding a margin to it on the side with less actions.
  // The width of the actions on each side is what is left of the bar around the
  // content, after taking the margins it was measured with out.
  const sides =
    isCenterAlignedMode && centeredContent && barWidth > 0
      ? {
          left: Math.round(
            centeredContent.x - paddingLeft - centeredContent.spacers.left
          ),
          right: Math.round(
            barWidth -
              paddingRight -
              (centeredContent.x + centeredContent.width) -
              centeredContent.spacers.right
          ),
        }
      : null;
  const spacers = getCenteringMargins(sides);

  // The margins the content was last measured with
  const spacersRef = React.useRef(spacers);

  React.useLayoutEffect(() => {
    spacersRef.current = spacers;
  });

  const handleContentLayout = React.useCallback(
    (layout: LayoutRectangle | null) => {
      if (isFlexible) {
        setContentHeight(layout?.height ?? 0);
      } else {
        setCenteredContent(
          layout && {
            x: layout.x,
            width: layout.width,
            spacers: spacersRef.current,
          }
        );
      }
    },
    [isFlexible]
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
    onLayout?.(event);
  };

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
      onContentLayout:
        isCenterAlignedMode || isFlexible ? handleContentLayout : undefined,
      contentMargins: isCenterAlignedMode
        ? { left: spacers.left, right: spacers.right }
        : undefined,
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
      handleContentLayout,
      spacers.left,
      spacers.right,
    ]
  );

  const paddingStyle = {
    paddingBottom: insets.bottom,
    paddingTop: insets.top + (isTopAligned ? APPBAR_CONTROLS_OFFSET : 0),
    paddingLeft,
    paddingRight,
  };

  // The safe area insets are applied as padding, so they need to be included in the height
  const verticalInsets = insets.top + insets.bottom;
  const heightStyle = isFlexible
    ? {
        minHeight:
          Math.max(
            modeAppbarHeight[mode],
            APPBAR_CONTROLS_HEIGHT + contentHeight
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
        onLayout={isCenterAlignedMode ? handleLayout : onLayout}
        theme={theme}
      >
        {children}
      </Surface>
    </AppbarContext.Provider>
  );
};

const styles = StyleSheet.create({
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topAligned: {
    alignItems: 'flex-start',
  },
});

export default Appbar;

// @component-docs ignore-next-line
export { Appbar };
