import * as React from 'react';
import {
  StyleSheet,
  StyleProp,
  View,
  SafeAreaView,
  ViewStyle,
} from 'react-native';
import overlay from '../../styles/overlay';
import { DEFAULT_APPBAR_HEIGHT, Appbar } from './Appbar';
import shadow from '../../styles/shadow';
import { withTheme } from '../../core/theming';
import { APPROX_STATUSBAR_HEIGHT } from '../../constants';

type Props = React.ComponentProps<typeof Appbar> & {
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
   * @optional
   */
  theme: ReactNativePaper.Theme;
  style?: StyleProp<ViewStyle>;
};

/**
 * A component to use as a header at the top of the screen.
 * It can contain the screen title, controls such as navigation buttons, menu button etc.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/appbar-header.android.png" />
 *     <figcaption>Android</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="medium" src="screenshots/appbar-header.ios.png" />
 *     <figcaption>iOS</figcaption>
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
 *       <Appbar.Content title="Title" subtitle="Subtitle" />
 *       <Appbar.Action icon="magnify" onPress={_handleSearch} />
 *       <Appbar.Action icon="dots-vertical" onPress={_handleMore} />
 *     </Appbar.Header>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const AppbarHeader = (props: Props) => {
  const {
    // Don't use default props since we check it to know whether we should use SafeAreaView
    statusBarHeight = APPROX_STATUSBAR_HEIGHT,
    style,
    dark,
    ...rest
  } = props;

  const { dark: isDarkTheme, colors, mode } = rest.theme;
  const {
    height = DEFAULT_APPBAR_HEIGHT,
    elevation = 4,
    backgroundColor: customBackground,
    zIndex = 0,
    ...restStyle
  }: ViewStyle = StyleSheet.flatten(style) || {};
  const backgroundColor = customBackground
    ? customBackground
    : isDarkTheme && mode === 'adaptive'
    ? overlay(elevation, colors.surface)
    : colors.primary;
  // Let the user override the behaviour
  const Wrapper =
    typeof props.statusBarHeight === 'number' ? View : SafeAreaView;
  return (
    <Wrapper
      style={
        [
          { backgroundColor, zIndex, elevation },
          shadow(elevation),
        ] as StyleProp<ViewStyle>
      }
    >
      <Appbar
        style={[
          //@ts-ignore Types of property 'backgroundColor' are incompatible.
          { height, backgroundColor, marginTop: statusBarHeight },
          styles.appbar,
          restStyle,
        ]}
        dark={dark}
        {...rest}
      />
    </Wrapper>
  );
};

AppbarHeader.displayName = 'Appbar.Header';

const styles = StyleSheet.create({
  appbar: {
    elevation: 0,
  },
});

export default withTheme(AppbarHeader);

// @component-docs ignore-next-line
const AppbarHeaderWithTheme = withTheme(AppbarHeader);
// @component-docs ignore-next-line
export { AppbarHeaderWithTheme as AppbarHeader };
