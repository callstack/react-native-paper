import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ColorValue, StyleProp, ViewProps, ViewStyle } from 'react-native';

import AppbarContent from './AppbarContent';
import type { AppbarScrollBehavior } from './useAppbarScrollBehavior';
import {
  getAppbarBackgroundColor,
  getAppbarBorders,
  getAppbarHeight,
  renderAppbarContent,
  filterAppbarActions,
} from './utils';
import type { AppbarModes, AppbarChildProps } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';
import Surface from '../Surface';

const APPBAR_HORIZONTAL_PADDING = 4;

export type AppbarStyle = Omit<ViewStyle, 'elevation'>;

export type Props = Omit<Partial<ViewProps>, 'style'> & {
  /**
   * Whether the background color is a dark color. A dark appbar will render light text and vice-versa.
   */
  dark?: boolean;
  /**
   * Content of the `Appbar`.
   */
  children: React.ReactNode;
  /**
   * Mode of the Appbar.
   * - `small` - Appbar with default height (64).
   * - `medium` - Baseline medium height (112). @deprecated Use 'medium-flexible' instead.
   * - `large` - Baseline large height (152). @deprecated Use 'large-flexible' instead.
   * - `center-aligned` - Appbar with default height and center-aligned title.
   * - `medium-flexible` - MD3 Expressive medium flexible appbar with subtitle support (112/136).
   * - `large-flexible` - MD3 Expressive large flexible appbar with subtitle support (120/152).
   */
  mode?: AppbarModes;
  /**
   * Text alignment for the title and subtitle.
   * - `start` - Left-aligned text (default).
   * - `center` - Centered text.
   */
  titleAlignment?: 'start' | 'center';
  /**
   * Whether Appbar background should have the elevation along with primary color pigment.
   * In MD3, elevated appbars transition background color to `surfaceContainer`.
   */
  elevated?: boolean;
  /**
   * Whether the appbar is collapsed into the small (64dp) height.
   */
  collapsed?: boolean;
  /**
   * Scroll behavior configuration, e.g. from `useAppbarScrollBehavior()`.
   */
  scrollBehavior?: AppbarScrollBehavior;
  /**
   * Current scroll offset (in pixels) for reactive elevation and collapsing.
   */
  scrollOffset?: number;
  /**
   * Threshold in pixels after which the Appbar transitions to elevated.
   * Defaults to 0.
   */
  elevationThreshold?: number;
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
  style?: StyleProp<AppbarStyle>;
};

/**
 * A component to display action items in a bar. It can be placed at the top or bottom.
 * The top bar usually contains the screen title, controls such as navigation buttons, menu button etc.
 * The bottom bar usually provides access to a drawer and up to four actions.
 *
 * ## Usage
 * ### Top bar
 * ```js
 * import * as React from 'react';
 * import { Appbar } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Appbar.Header mode="medium-flexible">
 *     <Appbar.BackAction onPress={() => {}} />
 *     <Appbar.Content title="Inbox" subtitle="3 unread messages" />
 *     <Appbar.Action icon="magnify" onPress={() => {}} />
 *     <Appbar.Action icon="plus" mode="contained" onPress={() => {}} />
 *   </Appbar.Header>
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
 * const FAB_HEIGHT = 56;
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
  titleAlignment,
  elevated = false,
  collapsed = false,
  scrollBehavior,
  scrollOffset,
  elevationThreshold,
  safeAreaInsets,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const flattenedStyle = StyleSheet.flatten(style);
  const { backgroundColor: customBackground, ...restStyle } = (flattenedStyle ||
    {}) as Exclude<typeof flattenedStyle, number> & {
    backgroundColor?: ColorValue;
    height?: AppbarStyle['height'];
  };

  const isElevated =
    scrollBehavior?.isElevated ??
    (typeof scrollOffset === 'number'
      ? scrollOffset > (elevationThreshold ?? 0)
      : elevated);

  const isCollapsed = scrollBehavior?.isCollapsed ?? collapsed;

  const isCenterAligned =
    mode === 'center-aligned' || titleAlignment === 'center';

  let hasSubtitle = false;
  React.Children.forEach(children, (child) => {
    if (React.isValidElement<AppbarChildProps>(child)) {
      if (
        child.type === AppbarContent ||
        // @ts-expect-error: displayName check
        child.type?.displayName === 'Appbar.Content'
      ) {
        if (child.props.subtitle != null) {
          hasSubtitle = true;
        }
      }
    }
  });

  const defaultHeight = getAppbarHeight({
    mode,
    hasSubtitle,
    collapsed: isCollapsed,
  });

  const backgroundColor = getAppbarBackgroundColor(
    theme,
    isElevated,
    customBackground
  );

  const borderStyles = getAppbarBorders(restStyle);

  const isMode = (modeToCompare: AppbarModes) => {
    return mode === modeToCompare;
  };

  const isDark = typeof dark === 'boolean' ? dark : false;

  let shouldCenterContent = false;
  let shouldAddLeftSpacing = false;
  let shouldAddRightSpacing = false;

  if (isCenterAligned) {
    let hasAppbarContent = false;
    let leftItemsCount = 0;
    let rightItemsCount = 0;

    React.Children.forEach(children, (child) => {
      if (React.isValidElement<AppbarChildProps>(child)) {
        const isLeading = child.props.isLeading === true;

        if (
          child.type === AppbarContent ||
          // @ts-expect-error: displayName check
          child.type?.displayName === 'Appbar.Content'
        ) {
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
    paddingLeft: (safeAreaInsets?.left ?? 0) + APPBAR_HORIZONTAL_PADDING,
    paddingRight: (safeAreaInsets?.right ?? 0) + APPBAR_HORIZONTAL_PADDING,
  };

  const isSingleRow =
    isMode('small') || isMode('center-aligned') || isCollapsed;

  return (
    <Surface
      {...borderStyles}
      backgroundColor={backgroundColor}
      style={[
        {
          height: flattenedStyle?.height ?? defaultHeight,
        },
        styles.appbar,
        insets,
        restStyle,
      ]}
      elevation={isElevated ? 2 : 0}
      {...rest}
      theme={theme}
    >
      {shouldAddLeftSpacing ? <View style={spacingStyle} /> : null}
      {isSingleRow && (
        <>
          {/* Render only the back action at first place  */}
          {renderAppbarContent({
            children,
            isDark,
            theme,
            renderOnly: ['Appbar.BackAction'],
            shouldCenterContent: isCenterAligned || shouldCenterContent,
            collapsed: isCollapsed,
            titleAlignment: isCenterAligned ? 'center' : 'start',
          })}
          {/* Render the rest of the content except the back action */}
          {renderAppbarContent({
            // Filter appbar actions - first leading icons, then trailing icons
            children: [
              ...filterAppbarActions(children, true),
              ...filterAppbarActions(children),
            ],
            isDark,
            theme,
            renderExcept: ['Appbar.BackAction'],
            shouldCenterContent: isCenterAligned || shouldCenterContent,
            collapsed: isCollapsed,
            titleAlignment: isCenterAligned ? 'center' : 'start',
          })}
        </>
      )}
      {!isSingleRow && (
        <View
          style={[
            styles.columnContainer,
            isCenterAligned && styles.centerAlignedContainer,
          ]}
        >
          {/* Appbar top row with controls */}
          <View style={styles.controlsRow}>
            {/* Left side of row container, can contain AppbarBackAction or AppbarAction if it's leading icon  */}
            {renderAppbarContent({
              children,
              isDark,
              renderOnly: ['Appbar.BackAction'],
              mode,
            })}
            {renderAppbarContent({
              children: filterAppbarActions(children, true),
              isDark,
              renderOnly: ['Appbar.Action', 'Appbar.Image'],
              mode,
            })}
            {/* Right side of row container, can contain other AppbarAction if they are not leading icons */}
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
                mode,
              })}
            </View>
          </View>
          {renderAppbarContent({
            children,
            isDark,
            renderOnly: ['Appbar.Content'],
            mode,
            titleAlignment: isCenterAligned ? 'center' : 'start',
            shouldCenterContent: isCenterAligned,
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
  centerAlignedContainer: {
    paddingTop: 0,
  },
});

export default Appbar;

// @component-docs ignore-next-line
export { Appbar };
