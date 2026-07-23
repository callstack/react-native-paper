import * as React from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Appbar } from './Appbar';
import type { TitleAlign, TopAppBarMode } from './tokens';
import {
  getAppbarBackgroundColor,
  modeAppbarHeight,
  getAppbarBorders,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import { shadow } from '../../theme/tokens/sys/elevation';
import type { Theme, ThemeProp } from '../../types';

export type Props = Omit<
  React.ComponentProps<typeof Appbar>,
  'safeAreaInsets'
> & {
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
   * Mode of the top app bar. See `Appbar` / `TopAppBar` for supported values including
   * `medium-flexible`, `large-flexible`, and deprecated baseline modes.
   */
  mode?: TopAppBarMode;
  /**
   * Title alignment for `small` mode (`start` | `center`).
   * On iOS the default is `center` (replaces the deprecated `center-aligned` mode).
   */
  titleAlign?: TitleAlign;
  /**
   * Scroll progress 0→1 for MD3 surface → surfaceContainer transition.
   * Accepts a number or `Animated.Value`.
   */
  scrollProgress?: number | Animated.Value;
  /**
   * Whether Appbar background should use the scrolled container color statically.
   * Prefer `scrollProgress` for scroll-reactive MD3 behavior.
   */
  elevated?: boolean;
  /**
   * @optional
   */
  theme?: ThemeProp;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
};

/**
 * A component to use as a header at the top of the screen.
 * Prefer `TopAppBar.Header` in new code (`Appbar.Header` remains a compatibility alias).
 *
 * It can contain the screen title, controls such as navigation buttons, menu button etc.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { TopAppBar } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const _goBack = () => console.log('Went back');
 *
 *   const _handleSearch = () => console.log('Searching');
 *
 *   const _handleMore = () => console.log('Shown more');
 *
 *   return (
 *     <TopAppBar.Header>
 *       <TopAppBar.BackAction onPress={_goBack} />
 *       <TopAppBar.Content title="Title" />
 *       <TopAppBar.Action icon="magnify" onPress={_handleSearch} />
 *       <TopAppBar.Action icon="dots-vertical" onPress={_handleMore} />
 *     </TopAppBar.Header>
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
  mode = 'small',
  titleAlign = Platform.OS === 'ios' ? 'center' : 'start',
  elevated = false,
  scrollProgress,
  theme: themeOverrides,
  testID = 'appbar-header',
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const flattenedStyle = StyleSheet.flatten(style);
  const {
    height = modeAppbarHeight[mode],
    elevation = elevated ? 2 : 0,
    backgroundColor: customBackground,
    zIndex = elevated ? 1 : 0,
    ...restStyle
  } = (flattenedStyle || {}) as Exclude<typeof flattenedStyle, number> & {
    height?: number;
    elevation?: number;
    backgroundColor?: ColorValue;
    zIndex?: number;
  };

  const borderRadius = getAppbarBorders(restStyle);

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

  const { top, left, right } = useSafeAreaInsets();

  const rootStyle = [
    {
      backgroundColor,
      zIndex,
      elevation,
      paddingTop: statusBarHeight ?? top,
      paddingHorizontal: Math.max(left, right),
    },
    borderRadius,
    shadow(elevation, theme.colors.shadow) as ViewStyle,
  ];

  const appbar = (
    <Appbar
      testID={testID}
      style={[{ height, backgroundColor }, styles.appbar, restStyle]}
      dark={dark}
      elevated={elevated}
      scrollProgress={scrollProgress}
      titleAlign={titleAlign}
      {...rest}
      mode={mode}
      theme={theme}
    />
  );

  if (
    scrollProgress instanceof Animated.Value &&
    customBackground === undefined
  ) {
    return (
      <Animated.View
        testID={`${testID}-root-layer`}
        style={rootStyle as Animated.WithAnimatedValue<StyleProp<ViewStyle>>}
      >
        {appbar}
      </Animated.View>
    );
  }

  return (
    <View
      testID={`${testID}-root-layer`}
      style={rootStyle as StyleProp<ViewStyle>}
    >
      {appbar}
    </View>
  );
};

AppbarHeader.displayName = 'Appbar.Header';

const styles = StyleSheet.create({
  appbar: {
    elevation: 0,
  },
});

export default AppbarHeader;

// @component-docs ignore-next-line
export { AppbarHeader };
