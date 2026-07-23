import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import type { ColorValue, StyleProp, ViewProps, ViewStyle } from 'react-native';

import AppbarContent from './AppbarContent';
import type { TitleAlign, TopAppBarMode } from './tokens';
import {
  getAppbarBackgroundColor,
  modeAppbarHeight,
  renderAppbarContent,
  filterAppbarActions,
  resolveAppbarMode,
} from './utils';
import type { AppbarModes, AppbarChildProps } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { Elevation, Theme, ThemeProp } from '../../types';
import Surface from '../Surface';

export type Props = Omit<Partial<ViewProps>, 'style'> & {
  /**
   * Whether the background color is a dark color. A dark appbar will render light text and vice-versa.
   */
  dark?: boolean;
  /**
   * Content of the `Appbar` / `TopAppBar`.
   */
  children: React.ReactNode;
  /**
   * Mode of the top app bar.
   * - `small` — 64dp height (default).
   * - `medium-flexible` — MD3 medium flexible (expanded height + subtitle/logo support).
   * - `large-flexible` — MD3 large flexible (expanded height + subtitle/logo support).
   * - `medium` / `large` — legacy baseline heights (**deprecated**; prefer flexible modes).
   * - `center-aligned` — **deprecated**; use `mode="small"` with `titleAlign="center"`.
   */
  mode?: TopAppBarMode;
  /**
   * Title alignment for `small` mode. Replaces the deprecated `center-aligned` mode.
   * @default 'start'
   */
  titleAlign?: TitleAlign;
  /**
   * Whether Appbar background should use the scrolled/elevated container role
   * (`surfaceContainer`). Prefer `scrollProgress` for scroll-reactive MD3 behavior.
   */
  elevated?: boolean;
  /**
   * Scroll progress from 0 (resting `surface`) to 1 (scrolled `surfaceContainer`).
   * Accepts a number or `Animated.Value` for continuous transitions.
   */
  scrollProgress?: number | Animated.Value;
  /**
   * Safe area insets for the Appbar. This can be used to avoid elements like the navigation bar on Android and bottom safe area on iOS.
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
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
};

/**
 * MD3 top app bar (`TopAppBar`; `Appbar` is a compatibility alias).
 *
 * Follows [Material Design 3 app bars](https://m3.material.io/components/app-bars/specs):
 * small (64dp) with `titleAlign`, medium-flexible / large-flexible expanded layouts,
 * container `surface` at rest and `surfaceContainer` when scrolled (`scrollProgress` or `elevated`),
 * headline `onSurface`, leading icons `onSurface`, trailing icons `onSurfaceVariant`.
 *
 * Prefer `TopAppBar` in new code. Can also be used as a bottom action bar.
 *
 * ## Usage
 * ### Top bar
 * ```js
 * import * as React from 'react';
 * import { TopAppBar } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <TopAppBar.Header mode="small" titleAlign="start">
 *     <TopAppBar.BackAction onPress={() => {}} />
 *     <TopAppBar.Content title="Title" />
 *     <TopAppBar.Action icon="calendar" onPress={() => {}} />
 *     <TopAppBar.Action icon="magnify" onPress={() => {}} />
 *   </TopAppBar.Header>
 * );
 *
 * export default MyComponent;
 * ```
 *
 * ### Flexible with subtitle and filled trailing action
 * ```js
 * import * as React from 'react';
 * import { TopAppBar } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <TopAppBar.Header mode="medium-flexible" scrollProgress={1}>
 *     <TopAppBar.BackAction onPress={() => {}} />
 *     <TopAppBar.Content title="Title" subtitle="Supporting text" />
 *     <TopAppBar.Action icon="magnify" onPress={() => {}} />
 *     <TopAppBar.Action icon="plus" mode="filled" onPress={() => {}} />
 *   </TopAppBar.Header>
 * );
 *
 * export default MyComponent;
 * ```
 *
 * ### Bottom bar
 * ```js
 * import * as React from 'react';
 * import { StyleSheet } from 'react-native';
 * import { Appbar, FAB, useTheme } from 'react-native-paper';
 * import { useSafeAreaInsets } from 'react-native-safe-area-context';
 *
 * const BOTTOM_APPBAR_HEIGHT = 80;
 * const MEDIUM_FAB_HEIGHT = 56;
 *
 * const MyComponent = () => {
 *   const { bottom } = useSafeAreaInsets();
 *   const theme = useTheme();
 *
 *   return (
 *     <Appbar
 *       style={[
 *         styles.bottom,
 *         {
 *           height: BOTTOM_APPBAR_HEIGHT + bottom,
 *           backgroundColor: theme.colors.surfaceContainer,
 *         },
 *       ]}
 *       safeAreaInsets={{ bottom }}
 *     >
 *       <Appbar.Action icon="archive" onPress={() => {}} />
 *       <Appbar.Action icon="email" onPress={() => {}} />
 *       <Appbar.Action icon="label" onPress={() => {}} />
 *       <Appbar.Action icon="delete" onPress={() => {}} />
 *       <FAB
 *         mode="flat"
 *         size="medium"
 *         icon="plus"
 *         onPress={() => {}}
 *         style={[
 *           styles.fab,
 *           { top: (BOTTOM_APPBAR_HEIGHT - MEDIUM_FAB_HEIGHT) / 2 },
 *         ]}
 *       />
 *     </Appbar>
 *   );
 * };
 *
 * const styles = StyleSheet.create({
 *   bottom: {
 *     backgroundColor: 'aquamarine',
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
  titleAlign: titleAlignProp,
  elevated,
  scrollProgress,
  safeAreaInsets,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const flattenedStyle = StyleSheet.flatten(style);
  const {
    backgroundColor: customBackground,
    elevation = elevated ? 2 : 0,
    ...restStyle
  } = (flattenedStyle || {}) as Exclude<typeof flattenedStyle, number> & {
    elevation?: Elevation;
    backgroundColor?: ColorValue;
  };

  const resolved = resolveAppbarMode(mode);
  const effectiveMode = resolved.mode;
  const titleAlign = titleAlignProp ?? resolved.titleAlign;

  React.useEffect(() => {
    if (mode === 'center-aligned') {
      console.warn(
        'Appbar: mode "center-aligned" is deprecated. Use mode="small" with titleAlign="center".'
      );
    }
    if (resolved.isLegacyBaseline) {
      console.warn(
        `Appbar: mode "${mode}" is a deprecated baseline variant. Prefer "medium-flexible" or "large-flexible".`
      );
    }
  }, [mode, resolved.isLegacyBaseline]);

  const scrollNumber =
    typeof scrollProgress === 'number' ? scrollProgress : undefined;

  let backgroundColor:
    | ColorValue
    | Animated.AnimatedInterpolation<string | number> =
    getAppbarBackgroundColor(
      theme,
      elevation,
      customBackground,
      elevated,
      scrollNumber
    );

  if (
    scrollProgress instanceof Animated.Value &&
    customBackground === undefined
  ) {
    const { colors } = theme as Theme;
    backgroundColor = scrollProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [String(colors.surface), String(colors.surfaceContainer)],
      extrapolate: 'clamp',
    });
  }

  const isDark = typeof dark === 'boolean' ? dark : false;

  const isSmallLayout = effectiveMode === 'small' || mode === 'center-aligned';
  const isExpandedLayout =
    effectiveMode === 'medium' ||
    effectiveMode === 'large' ||
    effectiveMode === 'medium-flexible' ||
    effectiveMode === 'large-flexible';

  const isCenterAlignedMode =
    titleAlign === 'center' || mode === 'center-aligned';

  let shouldCenterContent = false;
  let shouldAddLeftSpacing = false;
  let shouldAddRightSpacing = false;
  if (isCenterAlignedMode && isSmallLayout) {
    let hasAppbarContent = false;
    let leftItemsCount = 0;
    let rightItemsCount = 0;

    React.Children.forEach(children, (child) => {
      if (React.isValidElement<AppbarChildProps>(child)) {
        const isLeading = child.props.isLeading === true;

        if (child.type === AppbarContent) {
          hasAppbarContent = true;
        } else if (isLeading || !hasAppbarContent) {
          leftItemsCount++;
        } else {
          rightItemsCount++;
        }
      }
    });

    shouldCenterContent =
      hasAppbarContent && leftItemsCount < 2 && rightItemsCount < 3;
    shouldAddLeftSpacing = shouldCenterContent && leftItemsCount === 0;
    shouldAddRightSpacing = shouldCenterContent && rightItemsCount === 0;
  }

  const spacingStyle = styles.v3Spacing;

  const insets = {
    paddingBottom: safeAreaInsets?.bottom,
    paddingTop: safeAreaInsets?.top,
    paddingLeft: safeAreaInsets?.left,
    paddingRight: safeAreaInsets?.right,
  };

  const layoutMode = (
    isExpandedLayout ? effectiveMode : 'small'
  ) as AppbarModes;

  return (
    <Surface
      style={[
        { backgroundColor },
        styles.appbar,
        {
          height: modeAppbarHeight[mode],
        },
        insets,
        restStyle,
      ]}
      elevation={elevation}
      container
      {...rest}
    >
      {shouldAddLeftSpacing ? <View style={spacingStyle} /> : null}
      {isSmallLayout && (
        <>
          {renderAppbarContent({
            children,
            isDark,
            theme,
            renderOnly: ['Appbar.BackAction'],
            shouldCenterContent: isCenterAlignedMode || shouldCenterContent,
          })}
          {renderAppbarContent({
            children: [
              ...filterAppbarActions(children, true),
              ...filterAppbarActions(children),
            ],
            isDark,
            theme,
            renderExcept: ['Appbar.BackAction'],
            shouldCenterContent: isCenterAlignedMode || shouldCenterContent,
          })}
        </>
      )}
      {isExpandedLayout && (
        <View style={styles.columnContainer}>
          <View style={styles.controlsRow}>
            {renderAppbarContent({
              children,
              isDark,
              renderOnly: ['Appbar.BackAction'],
              mode: layoutMode,
            })}
            {renderAppbarContent({
              children: filterAppbarActions(children, true),
              isDark,
              renderOnly: ['Appbar.Action'],
              mode: layoutMode,
            })}
            <View style={styles.rightActionControls}>
              {renderAppbarContent({
                children: filterAppbarActions(children),
                isDark,
                renderExcept: [
                  'Appbar',
                  'Appbar.BackAction',
                  'Appbar.Content',
                  'Appbar.Header',
                ],
                mode: layoutMode,
              })}
            </View>
          </View>
          {renderAppbarContent({
            children,
            isDark,
            renderOnly: ['Appbar.Content'],
            mode: layoutMode,
          })}
        </View>
      )}
      {shouldAddRightSpacing ? <View style={spacingStyle} /> : null}
    </Surface>
  );
};

const styles = StyleSheet.create({
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  v3Spacing: {
    width: 52,
  },
  controlsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightActionControls: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  columnContainer: {
    flexDirection: 'column',
    flex: 1,
    paddingTop: 8,
  },
});

export default Appbar;

// @component-docs ignore-next-line
export { Appbar };
