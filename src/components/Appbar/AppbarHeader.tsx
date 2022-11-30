import * as React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { withInternalTheme } from '../../core/theming';
import shadow from '../../styles/shadow';
import type { InternalTheme } from '../../types';
import { Appbar } from './Appbar';
import {
  DEFAULT_APPBAR_HEIGHT,
  getAppbarColor,
  modeAppbarHeight,
} from './utils';

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
   * - `small` - Appbar with default height (56).
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
  theme: InternalTheme;
  style?: StyleProp<ViewStyle>;
};

/**
 * A component to use as a header at the top of the screen.
 * It can contain the screen title, controls such as navigation buttons, menu button etc.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="small" src="screenshots/appbar-small.png" />
 *     <figcaption>small</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="small" src="screenshots/appbar-medium.png" />
 *     <figcaption>medium</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="small" src="screenshots/appbar-large.png" />
 *     <figcaption>large</figcaption>
 *   </figure>
 *  <figure>
 *     <img class="small" src="screenshots/appbar-center-aligned.png" />
 *     <figcaption>center-aligned</figcaption>
 *   </figure>
 * </div>
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
  ...rest
}: Props) => {
  const { isV3 } = rest.theme;

  const {
    height = isV3 ? modeAppbarHeight[mode] : DEFAULT_APPBAR_HEIGHT,
    elevation = isV3 ? (elevated ? 2 : 0) : 4,
    backgroundColor: customBackground,
    zIndex = isV3 && elevated ? 1 : 0,
    ...restStyle
  }: ViewStyle = StyleSheet.flatten(style) || {};

  const backgroundColor = getAppbarColor(
    rest.theme,
    elevation,
    customBackground,
    elevated
  );

  const { top, left, right } = useSafeAreaInsets();

  return (
    <View
      style={
        [
          {
            backgroundColor,
            zIndex,
            elevation,
            paddingTop: statusBarHeight ?? top,
            paddingHorizontal: Math.max(left, right),
          },
          shadow(elevation),
        ] as StyleProp<ViewStyle>
      }
    >
      <Appbar
        style={[{ height, backgroundColor }, styles.appbar, restStyle]}
        dark={dark}
        {...(isV3 && {
          mode,
        })}
        {...rest}
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

export default withInternalTheme(AppbarHeader);

// @component-docs ignore-next-line
const AppbarHeaderWithTheme = withInternalTheme(AppbarHeader);
// @component-docs ignore-next-line
export { AppbarHeaderWithTheme as AppbarHeader };
