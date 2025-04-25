import * as React from 'react';
import {
  Animated,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  ColorValue,
} from 'react-native';

import color from 'color';

import AppbarContent from './AppbarContent';
import {
  AppbarModes,
  DEFAULT_APPBAR_HEIGHT,
  getAppbarBackgroundColor,
  modeAppbarHeight,
  renderAppbarContent,
  filterAppbarActions,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import type { MD3Elevation, ThemeProp } from '../../types';
import Surface from '../Surface';

export type Props = Omit<
  Partial<React.ComponentPropsWithRef<typeof View>>,
  'style'
> & {
  /**
   * Whether the background color is a dark color. A dark appbar will render light text and vice-versa.
   */
  dark?: boolean;
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
   */
  mode?: 'small' | 'medium' | 'large' | 'center-aligned';
  /**
   * @supported Available in v5.x with theme version 3
   * Whether Appbar background should have the elevation along with primary color pigment.
   */
  elevated?: boolean;
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
 * A component to display action items in a bar. It can be placed at the top or bottom.
 * The top bar usually contains the screen title, controls such as navigation buttons, menu button etc.
 * The bottom bar usually provides access to a drawer and up to four actions.
 *
 * By default Appbar uses primary color as a background, in dark theme with `adaptive` mode it will use surface colour instead.
 * See [Dark Theme](https://callstack.github.io/react-native-paper/docs/guides/theming#dark-theme) for more informations
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
 *           backgroundColor: theme.colors.elevation.level2,
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
  elevated,
  safeAreaInsets,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { isV3 } = theme;
  const flattenedStyle = StyleSheet.flatten(style);
  const {
    backgroundColor: customBackground,
    elevation = isV3 ? (elevated ? 2 : 0) : 4,
    ...restStyle
  } = (flattenedStyle || {}) as Exclude<typeof flattenedStyle, number> & {
    elevation?: number;
    backgroundColor?: ColorValue;
  };

  const backgroundColor = getAppbarBackgroundColor(
    theme,
    elevation,
    customBackground,
    elevated
  );

  const isMode = (modeToCompare: AppbarModes) => {
    return isV3 && mode === modeToCompare;
  };

  let isDark = false;

  if (typeof dark === 'boolean') {
    isDark = dark;
  } else if (!isV3) {
    isDark =
      backgroundColor === 'transparent'
        ? false
        : typeof backgroundColor === 'string'
        ? !color(backgroundColor).isLight()
        : true;
  }

  const isV3CenterAlignedMode = isV3 && isMode('center-aligned');

  let shouldCenterContent = false;
  let shouldAddLeftSpacing = false;
  let shouldAddRightSpacing = false;
  if ((!isV3 && Platform.OS === 'ios') || isV3CenterAlignedMode) {
    let hasAppbarContent = false;
    let leftItemsCount = 0;
    let rightItemsCount = 0;

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
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
      hasAppbarContent &&
      leftItemsCount < 2 &&
      rightItemsCount < (isV3 ? 3 : 2);
    shouldAddLeftSpacing = shouldCenterContent && leftItemsCount === 0;
    shouldAddRightSpacing = shouldCenterContent && rightItemsCount === 0;
  }

  const spacingStyle = isV3 ? styles.v3Spacing : styles.spacing;

  const insets = {
    paddingBottom: safeAreaInsets?.bottom,
    paddingTop: safeAreaInsets?.top,
    paddingLeft: safeAreaInsets?.left,
    paddingRight: safeAreaInsets?.right,
  };

  return (
    <Surface
      style={[
        { backgroundColor },
        styles.appbar,
        {
          height: isV3 ? modeAppbarHeight[mode] : DEFAULT_APPBAR_HEIGHT,
        },
        insets,
        restStyle,
        !theme.isV3 && { elevation },
      ]}
      elevation={elevation as MD3Elevation}
      {...rest}
    >
      {shouldAddLeftSpacing ? <View style={spacingStyle} /> : null}
      {(!isV3 || isMode('small') || isMode('center-aligned')) && (
        <>
          {/* Render only the back action at first place  */}
          {renderAppbarContent({
            children,
            isDark,
            theme,
            isV3,
            renderOnly: ['Appbar.BackAction'],
            shouldCenterContent: isV3CenterAlignedMode || shouldCenterContent,
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
            isV3,
            renderExcept: ['Appbar.BackAction'],
            shouldCenterContent: isV3CenterAlignedMode || shouldCenterContent,
          })}
        </>
      )}
      {(isMode('medium') || isMode('large')) && (
        <View
          style={[
            styles.columnContainer,
            isMode('center-aligned') && styles.centerAlignedContainer,
          ]}
        >
          {/* Appbar top row with controls */}
          <View style={styles.controlsRow}>
            {/* Left side of row container, can contain AppbarBackAction or AppbarAction if it's leading icon  */}
            {renderAppbarContent({
              children,
              isDark,
              isV3,
              renderOnly: ['Appbar.BackAction'],
              mode,
            })}
            {renderAppbarContent({
              children: filterAppbarActions(children, true),
              isDark,
              isV3,
              renderOnly: ['Appbar.Action'],
              mode,
            })}
            {/* Right side of row container, can contain other AppbarAction if they are not leading icons */}
            <View style={styles.rightActionControls}>
              {renderAppbarContent({
                children: filterAppbarActions(children),
                isDark,
                isV3,
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
            isV3,
            renderOnly: ['Appbar.Content'],
            mode,
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
  spacing: {
    width: 48,
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
