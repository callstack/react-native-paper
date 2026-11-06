import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import type { ColorValue, StyleProp } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Appbar } from './Appbar';
import type { AppbarStyle, Props as AppbarProps } from './Appbar';
import AppbarContent from './AppbarContent';
import type { AppbarScrollBehavior } from './useAppbarScrollBehavior';
import { getAppbarBackgroundColor, getAppbarHeight } from './utils';
import type { AppbarModes, AppbarChildProps } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';

export type Props = Omit<AppbarProps, 'safeAreaInsets' | 'style'> & {
  /**
   * Whether the background color is a dark color. A dark header will render light text and vice-versa.
   */
  dark?: boolean;
  /**
   * Extra padding to add at the top of header to account for translucent status bar.
   * This is automatically handled on iOS >= 11 including iPhone X using `SafeAreaView`.
   * If you are using Expo, we assume translucent status bar and set a height for status bar automatically.
   * Pass `0` or a custom value to disable the default behaviour, and customize the height.
   */
  statusBarHeight?: number;
  /**
   * Content of the header.
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
   * @optional
   */
  theme?: ThemeProp;
  style?: StyleProp<AppbarStyle>;
};

/**
 * A component to use as a header at the top of the screen.
 * It can contain the screen title, controls such as navigation buttons, menu button etc.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Appbar } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const _goBack = () => console.log('Went back');
 *   const _handleSearch = () => console.log('Searching');
 *   const _handleMore = () => console.log('Shown more');
 *
 *   return (
 *     <Appbar.Header mode="medium-flexible">
 *       <Appbar.BackAction onPress={_goBack} />
 *       <Appbar.Content title="Inbox" subtitle="3 unread messages" />
 *       <Appbar.Action icon="magnify" onPress={_handleSearch} />
 *       <Appbar.Action icon="dots-vertical" onPress={_handleMore} />
 *     </Appbar.Header>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const AppbarHeader = ({
  // Don't use default props since we check it to know whether we should use SafeAreaView
  statusBarHeight,
  style,
  dark,
  mode = Platform.OS === 'ios' ? 'center-aligned' : 'small',
  titleAlignment,
  elevated = false,
  collapsed = false,
  scrollBehavior,
  scrollOffset,
  elevationThreshold,
  theme: themeOverrides,
  children,
  testID,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const isElevated =
    scrollBehavior?.isElevated ??
    (typeof scrollOffset === 'number'
      ? scrollOffset > (elevationThreshold ?? 0)
      : elevated);

  const isCollapsed = scrollBehavior?.isCollapsed ?? collapsed;

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

  const flattenedStyle = StyleSheet.flatten(style);
  const {
    height = defaultHeight,
    backgroundColor: customBackground,
    zIndex = isElevated ? 1 : 0,
    ...restStyle
  } = (flattenedStyle || {}) as Exclude<typeof flattenedStyle, number> & {
    height?: AppbarStyle['height'];
    backgroundColor?: ColorValue;
    zIndex?: number;
  };

  const backgroundColor = getAppbarBackgroundColor(
    theme,
    isElevated,
    customBackground
  );

  const { top, left, right } = useSafeAreaInsets();
  const topInset = statusBarHeight ?? top;
  const horizontalInset = Math.max(left, right);
  const headerHeight = typeof height === 'number' ? height + topInset : height;

  return (
    <Appbar
      testID={testID}
      style={[
        {
          height: headerHeight,
          backgroundColor,
          zIndex,
        },
        restStyle,
      ]}
      safeAreaInsets={{
        top: topInset,
        left: horizontalInset,
        right: horizontalInset,
      }}
      dark={dark}
      elevated={isElevated}
      collapsed={isCollapsed}
      scrollBehavior={scrollBehavior}
      scrollOffset={scrollOffset}
      elevationThreshold={elevationThreshold}
      titleAlignment={titleAlignment}
      {...rest}
      mode={mode}
      theme={theme}
    >
      {children}
    </Appbar>
  );
};

AppbarHeader.displayName = 'Appbar.Header';

export default AppbarHeader;

// @component-docs ignore-next-line
export { AppbarHeader };
