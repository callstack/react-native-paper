import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import type { ColorValue, StyleProp, ViewProps, ViewStyle } from 'react-native';

import AppbarContent from './AppbarContent';
import { AppbarContext } from './AppbarContext';
import { getAppbarBackgroundColor, modeAppbarHeight } from './utils';
import type { AppbarModes, AppbarChildProps } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { Elevation, ThemeProp } from '../../types';
import Surface from '../Surface';

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
  elevated,
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

  const backgroundColor = getAppbarBackgroundColor(
    theme,
    elevation,
    customBackground,
    elevated
  );

  const isMode = (modeToCompare: AppbarModes) => {
    return mode === modeToCompare;
  };

  const isDark = typeof dark === 'boolean' ? dark : false;

  const insets = {
    paddingBottom: safeAreaInsets?.bottom,
    paddingTop: safeAreaInsets?.top,
    paddingLeft: safeAreaInsets?.left,
    paddingRight: safeAreaInsets?.right,
  };

  const appbarContextValue = React.useMemo(
    () => ({ isDark, mode }),
    [isDark, mode]
  );

  let content: React.ReactNode = children;

  if (isMode('medium') || isMode('large')) {
    // Medium/large top app bars use a two-row layout: a controls row with the
    // leading and trailing actions above a full-width title row. React Native
    // flexbox has no `order`, so the title has to be separated from the actions
    // structurally. We partition the children by element identity and the
    // `isLeading` prop for layout only — nothing is injected into them; shared
    // values flow through `AppbarContext`.
    const items = React.Children.toArray(children).filter(
      React.isValidElement
    ) as React.ReactElement<AppbarChildProps>[];
    const titleItems = items.filter((child) => child.type === AppbarContent);
    const actionItems = items.filter((child) => child.type !== AppbarContent);
    const leadingActions = actionItems.filter((child) => child.props.isLeading);
    const trailingActions = actionItems.filter(
      (child) => !child.props.isLeading
    );

    content = (
      <View style={styles.columnContainer}>
        <View style={styles.controlsRow}>
          {leadingActions}
          <View style={styles.rightActionControls}>{trailingActions}</View>
        </View>
        {titleItems}
      </View>
    );
  }

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
      <AppbarContext.Provider value={appbarContextValue}>
        {content}
      </AppbarContext.Provider>
    </Surface>
  );
};

const styles = StyleSheet.create({
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
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
