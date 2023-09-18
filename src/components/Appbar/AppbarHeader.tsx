import * as React from 'react';
import {
  Animated,
  ColorValue,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Appbar } from './Appbar';
import {
  DEFAULT_APPBAR_HEIGHT,
  getAppbarColor,
  modeAppbarHeight,
  getAppbarBorders,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import shadow from '../../styles/shadow';
import type { ThemeProp } from '../../types';

export type Props = React.ComponentProps<typeof Appbar> & {
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
   * @optional
   */
  theme?: ThemeProp;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
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
 *
 *   const _handleSearch = () => console.log('Searching');
 *
 *   const _handleMore = () => console.log('Shown more');
 *
 *   return (
 *     <Appbar.Header>
 *       <Appbar.BackAction onPress={_goBack} />
 *       <Appbar.Content title="Title" />
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
  elevated = false,
  theme: themeOverrides,
  testID = 'appbar-header',
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { isV3 } = theme;

  const flattenedStyle = StyleSheet.flatten(style);
  const {
    height = isV3 ? modeAppbarHeight[mode] : DEFAULT_APPBAR_HEIGHT,
    elevation = isV3 ? (elevated ? 2 : 0) : 4,
    backgroundColor: customBackground,
    zIndex = isV3 && elevated ? 1 : 0,
    ...restStyle
  } = (flattenedStyle || {}) as Exclude<typeof flattenedStyle, number> & {
    height?: number;
    elevation?: number;
    backgroundColor?: ColorValue;
    zIndex?: number;
  };

  const borderRadius = getAppbarBorders(restStyle);

  const backgroundColor = getAppbarColor(
    theme,
    elevation,
    customBackground,
    elevated
  );

  const { top, left, right } = useSafeAreaInsets();

  return (
    <View
      testID={`${testID}-root-layer`}
      style={[
        {
          backgroundColor,
          zIndex,
          elevation,
          paddingTop: statusBarHeight ?? top,
          paddingHorizontal: Math.max(left, right),
        },
        borderRadius,
        shadow(elevation) as ViewStyle,
      ]}
    >
      <Appbar
        testID={testID}
        style={[{ height, backgroundColor }, styles.appbar, restStyle]}
        dark={dark}
        {...(isV3 && {
          mode,
        })}
        {...rest}
        theme={theme}
      />
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
