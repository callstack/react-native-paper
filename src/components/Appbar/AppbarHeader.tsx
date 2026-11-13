import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import type { StyleProp } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Appbar } from './Appbar';
import type { Props as AppbarProps } from './Appbar';
import type { AppbarModes } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';
import type { SurfaceStyle } from '../Surface';

export type Props = Omit<AppbarProps, 'safeAreaInsets' | 'style'> & {
  /**
   * Whether the background color is a dark color. A dark header will render light text and vice-versa.
   */
  dark?: boolean;
  /**
   * Padding at the top of the header, to keep its content clear of the status bar.
   * By default, the header uses the top safe area inset, on every platform.
   * Pass a number, such as `0`, to use that padding instead.
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
   * Whether the content below the header has scrolled. A scrolled header uses the `surfaceContainer` color for its background,
   * without elevation. Overridden by `backgroundColor`.
   */
  isScrolled?: boolean;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * Style of the header.
   *
   * Background color and border radius should be specified via props instead.
   * A `height` set here is the total height of the header, including the status bar.
   */
  style?: StyleProp<SurfaceStyle>;
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
  // No default, because `undefined` falls back to the top safe area inset
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

  const { top, left, right } = useSafeAreaInsets();
  const topInset = statusBarHeight ?? top;
  const horizontalInset = Math.max(left, right);

  return (
    <Appbar
      testID={testID}
      style={[elevated ? styles.elevated : styles.flat, style]}
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

const styles = StyleSheet.create({
  elevated: {
    zIndex: 1,
  },
  flat: {
    zIndex: 0,
  },
});

export default AppbarHeader;

// @component-docs ignore-next-line
export { AppbarHeader };
