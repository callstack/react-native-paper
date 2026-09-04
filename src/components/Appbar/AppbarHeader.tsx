import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import type { ColorValue, StyleProp } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Appbar } from './Appbar';
import type { AppbarStyle, Props as AppbarProps } from './Appbar';
import { getAppbarBackgroundColor, modeAppbarHeight } from './utils';
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
  testID,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const flattenedStyle = StyleSheet.flatten(style);
  const {
    height = modeAppbarHeight[mode],
    backgroundColor: customBackground,
    zIndex = elevated ? 1 : 0,
    ...restStyle
  } = (flattenedStyle || {}) as Exclude<typeof flattenedStyle, number> & {
    height?: AppbarStyle['height'];
    backgroundColor?: ColorValue;
    zIndex?: number;
  };

  const backgroundColor = getAppbarBackgroundColor(
    theme,
    elevated,
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
      elevated={elevated}
      {...rest}
      mode={mode}
      theme={theme}
    />
  );
};

AppbarHeader.displayName = 'Appbar.Header';

export default AppbarHeader;

// @component-docs ignore-next-line
export { AppbarHeader };
