import type { ReactNode } from 'react';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

import type { AnimatedStyle } from 'react-native-reanimated';

import type { ThemeProp } from '../../theme/types';
import type { IconSource } from '../Icon';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';

export type BaseRoute = {
  key: string;
  title?: string;
  focusedIcon?: IconSource;
  unfocusedIcon?: IconSource;
  badge?: string | number | boolean;
  'aria-label'?: string;
  testID?: string;
  lazy?: boolean;
};

export type NavigationState<Route extends BaseRoute> = {
  index: number;
  routes: Route[];
};

export type TabPressEvent = {
  defaultPrevented: boolean;
  preventDefault(): void;
};

export type TouchableProps<Route extends BaseRoute> = TouchableRippleProps & {
  key: string;
  route: Route;
  children: ReactNode;
  borderless?: boolean;
  centered?: boolean;
  rippleColor?: ColorValue;
};

export type SceneAnimationType = 'opacity' | 'shifting';

export type ItemLayout = 'vertical' | 'horizontal' | 'auto';

export type SceneAnimationEasing = (value: number) => number;

export type SafeAreaInsets = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export type RenderIcon<Route extends BaseRoute> = (props: {
  route: Route;
  focused: boolean;
  color: ColorValue;
}) => ReactNode;

export type RenderLabel<Route extends BaseRoute> = (props: {
  route: Route;
  focused: boolean;
  color: ColorValue;
}) => ReactNode;

export type RenderTouchable<Route extends BaseRoute> = (
  props: TouchableProps<Route>
) => ReactNode;

export type BarProps<Route extends BaseRoute> = {
  /**
   * Whether inactive destinations hide their labels.
   * This is a library extension (Material Design 2 shifting). Material Design 3
   * keeps labels visible for every destination when `labeled` is `true`.
   */
  shifting?: boolean;
  /**
   * Whether to show labels in tabs. When `false`, only icons are displayed.
   */
  labeled?: boolean;
  /**
   * Whether tabs should be spread across the entire width.
   */
  compact?: boolean;
  /**
   * Destination layout. `vertical` stacks the icon above the label (compact
   * windows). `horizontal` places the icon and label inside a pill (medium
   * windows). `auto` switches at the Material medium window width (600dp).
   */
  itemLayout?: ItemLayout;
  /**
   * State for the bottom navigation. The state should contain the following properties:
   *
   * - `index`: a number representing the index of the active route in the `routes` array
   * - `routes`: an array containing a list of route objects used for rendering the tabs
   *
   * Each route object should contain the following properties:
   *
   * - `key`: a unique key to identify the route (required)
   * - `title`: title of the route to use as the tab label
   * - `focusedIcon`: icon to use as the focused tab icon, can be a string, an image source or a react component
   * - `unfocusedIcon`: icon to use as the unfocused tab icon, can be a string, an image source or a react component
   * - `badge`: badge to show on the tab icon, can be `true` to show a dot, `string` or `number` to show text.
   * - `aria-label`: accessibility label for the tab button
   * - `testID`: test id for the tab button
   *
   * `BottomNavigation.Bar` is a controlled component, which means the `index` needs to be updated via the `onTabPress` callback.
   */
  navigationState: NavigationState<Route>;
  /**
   * Callback which returns a React Element to be used as tab icon.
   */
  renderIcon?: RenderIcon<Route>;
  /**
   * Callback which returns a React Element to be used as tab label.
   */
  renderLabel?: RenderLabel<Route>;
  /**
   * Callback which returns a React element to be used as the touchable for the tab item.
   * Renders a `TouchableRipple` on Android and `Pressable` on iOS.
   */
  renderTouchable?: RenderTouchable<Route>;
  /**
   * Get accessibility label for the tab button. This is read by the screen reader when the user taps the tab.
   * Uses `route['aria-label']` by default.
   */
  getAccessibilityLabel?: (props: { route: Route }) => string | undefined;
  /**
   * Get badge for the tab, uses `route.badge` by default.
   */
  getBadge?: (props: { route: Route }) => boolean | number | string | undefined;
  /**
   * Get label text for the tab, uses `route.title` by default. Use `renderLabel` to replace label component.
   */
  getLabelText?: (props: { route: Route }) => string | undefined;
  /**
   * Get the id to locate this tab button in tests, uses `route.testID` by default.
   */
  getTestID?: (props: { route: Route }) => string | undefined;
  /**
   * Function to execute on tab press. It receives the route for the pressed tab. Use this to update the navigation state.
   */
  onTabPress: (props: { route: Route } & TabPressEvent) => void;
  /**
   * Function to execute on tab long press. It receives the route for the pressed tab
   */
  onTabLongPress?: (props: { route: Route } & TabPressEvent) => void;
  /**
   * Custom color for icon and label in the active tab.
   */
  activeColor?: ColorValue;
  /**
   * Custom color for icon and label in the inactive tab.
   */
  inactiveColor?: ColorValue;
  /**
   * Optional easing used when a custom indicator transition is requested.
   * Defaults to the Material 3 spatial spring.
   */
  animationEasing?: SceneAnimationEasing;
  /**
   * Whether the bottom navigation bar is hidden when keyboard is shown.
   * On Android, this works best when [`windowSoftInputMode`](https://developer.android.com/guide/topics/manifest/activity-element#wsoft) is set to `adjustResize`.
   */
  keyboardHidesNavigationBar?: boolean;
  /**
   * Safe area insets for the tab bar. This can be used to avoid elements like the navigation bar on Android and bottom safe area on iOS.
   * The bottom insets for iOS is added by default. You can override the behavior with this option.
   */
  safeAreaInsets?: SafeAreaInsets;
  /**
   * Specifies the largest possible scale a label font can reach.
   */
  labelMaxFontSizeMultiplier?: number;
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
  activeIndicatorStyle?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
};
