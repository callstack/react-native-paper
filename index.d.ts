/**
 * Typescript type definitions for react-native-paper v1.11.1
 * Adapted from sources and https://gist.github.com/doomsower/4fe0d7d45e9b2b463377567ae89df1bc
 * Requires @types/react, @types/react-native
 */

declare module 'react-native-paper' {
  import * as React from 'react';
  import * as ReactNative from 'react-native';

  // Helper for Partial Theme
  type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T[P] extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U>>
        : DeepPartial<T[P]>
  };

  type Diff<
    T extends string | number | symbol,
    U extends string | number | symbol
  > = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
  type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

  export interface Theme {
    dark: boolean;
    roundness: number;
    colors: {
      primary: string;
      background: string;
      paper: string;
      accent: string;
      text: string;
      disabled: string;
      placeholder: string;
    };
    fonts: {
      regular: string;
      medium: string;
      light: string;
      thin: string;
    };
  }

  // Theme

  export interface ThemeShape extends DeepPartial<Theme> {}

  export const DefaultTheme: Theme;
  export const DarkTheme: Theme;

  export interface ProviderProps {
    theme?: ThemeShape;
  }
  export interface ThemeProviderProps {
    theme: Theme;
  }

  export class Provider extends React.Component<ProviderProps> {}
  export class ThemeProvider extends React.Component<ThemeProviderProps> {}

  export function withTheme<
    P extends ProviderProps & ThemeProviderProps,
    C extends React.ComponentType<P>
  >(Comp: C): C & React.ComponentType<Omit<P, 'theme'>>;

  // Bottom Navigation

  type Route = Partial<{
    key: string;
    title: string;
    icon: IconSource;
    color: string;
  }>;

  interface NavigationState<T extends Route> {
    index: number;
    routes: Array<T>;
  }

  type BottomNavigationProps<T> = {
    /**
     * Whether the shifting style is used, the active tab appears wider and the inactive tabs won't have a label.
     * By default, this is `true` when you have more than 3 tabs.
     */
    shifting?: boolean;
    /**
     * State for the bottom navigation. The state should contain the following properties:
     *
     * - `index`: a number reprsenting the index of the active route in the `routes` array
     * - `routes`: an array containing a list of route objects used for rendering the tabs
     *
     * Each route object should contain the following properties:
     *
     * - `key`: a unique key to identify the route (required)
     * - `title`: title of the route to use as the tab label
     * - `icon`: icon to use as the tab icon, can be a string, an image source or a react component
     * - `color`: color to use as background color for shifting bottom navigation
     *
     * Example:
     *
     * ```js
     * {
     *   index: 1,
     *   routes: [
     *     { key: 'music', title: 'Music', icon: 'queue-music', color: '#3F51B5' },
     *     { key: 'albums', title: 'Albums', icon: 'album', color: '#009688' },
     *     { key: 'recents', title: 'Recents', icon: 'history', color: '#795548' },
     *     { key: 'purchased', title: 'Purchased', icon: 'shopping-cart', color: '#607D8B' },
     *   ]
     * }
     * ```
     *
     * `BottomNavigation` is a controlled component, which means the `index` needs to be updated via the `onIndexChange` callback.
     */
    navigationState: NavigationState<T>;
    /**
     * Callback which is called on tab change, receives the index of the new tab as argument.
     * The navigation state needs to be updated when it's called, otherwise the change is dropped.
     */
    onIndexChange: (index: number) => any;
    /**
     * Callback which returns a react element to render as the page for the tab. Receives an object containing the route as the argument:
     *
     * ```js
     * renderScene = ({ route, jumpTo }) => {
     *   switch (route.key) {
     *     case 'music':
     *       return <MusicRoute jumpTo={jumpTo} />;
     *     case 'albums':
     *       return <AlbumsRoute jumpTo={jumpTo} />;
     *   }
     * }
     * ```
     *
     * Pages are lazily rendered, which means that a page will be rendered the first time you navigate to it.
     * After initial render, all the pages stay rendered to preserve their state.
     *
     * You need to make sure that your individual routes implement a `shouldComponentUpdate` to improve the performance.
     * To make it easier to specify the components, you can use the `SceneMap` helper:
     *
     * ```js
     * renderScene = BottomNavigation.SceneMap({
     *   music: MusicRoute,
     *   albums: AlbumsRoute,
     * });
     * ```
     *
     * Specifying the components this way is easier and takes care of implementing a `shouldComponentUpdate` method.
     * Each component will receive the current route and a `jumpTo` method as it's props.
     * The `jumpTo` method can be used to navigate to other tabs programmatically:
     *
     * ```js
     * this.props.jumpTo('albums')
     * ```
     */
    renderScene: (
      props: {
        route: T;
        jumpTo: (key: string) => any;
      }
    ) => React.ReactNode | null | undefined;
    /**
     * Callback which returns a React Element to be used as tab icon.
     */
    renderIcon?: (
      props: {
        route: T;
        focused: boolean;
        tintColor: string;
      }
    ) => React.ReactNode;
    /**
     * Callback which React Element to be used as tab label.
     */
    renderLabel?: (
      props: {
        route: T;
        focused: boolean;
        tintColor: string;
      }
    ) => React.ReactNode;
    /**
     * Get label text for the tab, uses `route.title` by default. Use `renderLabel` to replace label component.
     */
    getLabelText?: (props: { route: T }) => string;
    /**
     * Get accessibility label for the tab button. This is read by the screen reader when the user taps the tab.
     * The label for the tab is used as the accessibility label by default.
     */
    getAccessibilityLabel?: (props: { route: T }) => string | null | undefined;
    /**
     * Get the id to locate this tab button in tests.
     */
    getTestID?: (props: { route: T }) => string | null | undefined;
    /**
     * Get color for the tab, uses `route.color` by default.
     */
    getColor?: (props: { route: T }) => string;
    /**
     * Function to execute on tab press. It receives the route for the pressed tab, useful for things like scroll to top.
     */
    onTabPress?: (props: { route: T }) => any;
    /**
     * Style for the bottom navigation bar.
     * You can set a bottom padding here if you have a translucent navigation bar on Android:
     *
     * ```js
     * barStyle={{ paddingBottom: 48 }}
     * ```
     */
    barStyle?: any;
    style?: any;
    /**
     * @optional
     */
    theme?: ThemeShape;
  };

  /**
   * Bottom navigation provides quick navigation between top-level views of an app with a bottom tab bar.
   * It is primarily designed for use on mobile.
   *
   * For integration with React Navigation, you can use [react-navigation-material-bottom-tab-navigator](https://github.com/react-navigation/react-navigation-material-bottom-tab-navigator).
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { BottomNavigation } from 'react-native-paper';
   *
   * export default class MyComponent extends React.Component {
   *   state = {
   *     index: 0,
   *     routes: [
   *       { key: 'music', title: 'Music', icon: 'queue-music' },
   *       { key: 'albums', title: 'Albums', icon: 'album' },
   *       { key: 'recents', title: 'Recents', icon: 'history' },
   *     ],
   *   };
   *
   *   _handleIndexChange = index => this.setState({ index });
   *
   *   _renderScene = BottomNavigation.SceneMap({
   *     music: MusicRoute,
   *     albums: AlbumsRoute,
   *     recents: RecentsRoute,
   *   });
   *
   *   render() {
   *     return (
   *       <BottomNavigation
   *         navigationState={this.state}
   *         onIndexChange={this._handleIndexChange}
   *         renderScene={this._renderScene}
   *       />
   *     );
   *   }
   * }
   * ```
   */
  export class BottomNavigation<T> extends React.Component<
    BottomNavigationProps<T>,
    any
  > {
    /**
     * Function which takes a map of route keys to components.
     * Pure components are used to minmize re-rendering of the pages.
     * This drastically improves the animation performance.
     */
    static SceneMap<T>(scenes: {
      [key: string]: React.ComponentType<{
        route: T;
        jumpTo: (key: string) => any;
      }>;
    });
  }

  // Button

  interface ButtonProps {
    /**
     * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
     */
    disabled?: boolean;
    /**
     * Use a compact look, useful for flat buttons in a row.
     */
    compact?: boolean;
    /**
     * Add elevation to button, as opposed to default flat appearance. Typically used on a flat surface.
     */
    raised?: boolean;
    /**
     * Use to primary color from theme. Typically used to emphasize an action.
     */
    primary?: boolean;
    /**
     * Text color of button, a dark button will render light text and vice-versa.
     */
    dark?: boolean;
    /**
     * Whether to show a loading indicator.
     */
    loading?: boolean;
    /**
     * Icon to display for the `Button`.
     */
    icon?: IconSource;
    /**
     * Custom text color for flat button, or background color for raised button.
     */
    color?: string;
    /**
     * Label text of the button.
     */
    children: string | Array<string>;
    /**
     * Function to execute on press.
     */
    onPress?: () => any;
    style?: any;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * A button is component that the user can press to trigger an action.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { Button } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <Button raised onPress={() => console.log('Pressed')}>
   *     Press me
   *   </Button>
   * );
   * ```
   */
  export class Button extends React.Component<ButtonProps> {}

  // Icon (Internal)
  type IconProps = {
    color: string;
    size: number;
  };

  type IconSource =
    | string
    | number
    | { uri: string }
    | ((props: IconProps) => React.ReactNode)
    // This will be removed in next major version
    | React.ReactNode;

  // Card

  export interface CardProps {
    /**
     * Resting elevation of the card which controls the drop shadow.
     */
    elevation?: number;
    /**
     * Function to execute on press.
     */
    onPress?: () => any;
    /**
     * Content of the `Card`.
     */
    children: React.ReactNode;
    style?: any;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * A card is a sheet of material that serves as an entry point to more detailed information.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import {
   *   Button,
   *   Card,
   *   CardActions,
   *   CardContent,
   *   CardCover,
   *   Title,
   *   Paragraph
   * } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <Card>
   *     <CardContent>
   *       <Title>Card title</Title>
   *       <Paragraph>Card content</Paragraph>
   *     </CardContent>
   *     <CardCover source={{ uri: 'https://picsum.photos/700' }} />
   *     <CardActions>
   *       <Button>Cancel</Button>
   *       <Button>Ok</Button>
   *     </CardActions>
   *   </Card>
   * );
   * ```
   */
  export class Card extends React.Component<CardProps, any> {}

  export interface CardActionProps {
    /**
     * Content of the `CardActions`.
     */
    children: React.ReactNode;
    style?: any;
  }

  /**
   * A component to show a list of actions inside a Card.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { Button, Card, CardActions } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <Card>
   *     <CardActions>
   *       <Button>Cancel</Button>
   *       <Button>Ok</Button>
   *     </CardActions>
   *   </Card>
   * );
   * ```
   */
  export class CardActions extends React.Component<CardActionProps, any> {}

  export interface CardContentProps {
    /**
     * @internal
     */
    index?: number;
    /**
     * @internal
     */
    total?: number;
    /**
     * @internal
     */
    siblings?: Array<string>;
    style?: any;
  }

  /**
   * A component to show content inside a Card.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { Card, CardContent, Title, Paragraph } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <Card>
   *     <CardContent>
   *       <Title>Card title</Title>
   *       <Paragraph>Card content</Paragraph>
   *     </CardContent>
   *   </Card>
   * );
   * ```
   */
  export class CardContent extends React.Component<CardContentProps, any> {}

  export interface CardCoverProps extends ReactNative.ImageProps {
    /**
     * @internal
     */
    index?: number;
    /**
     * @internal
     */
    total?: number;
    style?: any;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * A component to show a cover image inside a Card.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { Card, CardCover } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <Card>
   *     <CardCover source={{ uri: 'https://picsum.photos/700' }} />
   *   </Card>
   * );
   * ```
   *
   * @extends Image props https://facebook.github.io/react-native/docs/image.html#props
   */
  export class CardCover extends React.Component<CardCoverProps> {}

  export interface CheckboxProps {
    /**
     * Whether checkbox is checked.
     */
    checked: boolean;
    /**
     * Whether checkbox is disabled.
     */
    disabled?: boolean;
    /**
     * Function to execute on press.
     */
    onPress?: () => any;
    /**
     * Custom color for unchecked checkbox.
     */
    uncheckedColor?: string;
    /**
     * Custom color for checkbox.
     */
    color?: string;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * Checkboxes allow the selection of multiple options from a set.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { Checkbox } from 'react-native-paper';
   *
   * export default class MyComponent extends React.Component {
   *   state = {
   *     checked: false,
   *   };
   *
   *   render() {
   *     const { checked } = this.state;
   *     return (
   *       <Checkbox
   *         checked={checked}
   *         onPress={() => { this.setState({ checked: !checked }); }}
   *       />
   *     );
   *   }
   * }
   * ```
   */
  export class Checkbox extends React.Component<CheckboxProps, any> {}

  export interface ChipProps {
    /**
     * Text content of the `Chip`.
     */
    children: React.ReactNode;
    /**
     * Icon to display for the `Chip`.
     */
    icon?: IconSource;
    /**
     * Function to execute on press.
     */
    onPress?: () => any;
    /**
     * Function to execute on delete. The delete button appears only when this prop is specified.
     */
    onDelete?: () => any;
    style?: any;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * A Chip can be used to display entities in small blocks.

   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { Chip } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <Chip icon="info" onPress={() => {}}>Example Chip</Chip>
   * );
   * ```
   */
  export class Chip extends React.Component<ChipProps, any> {}

  export interface DialogProps {
    /**
     * Determines whether clicking outside the dialog dismiss it.
     */
    dismissable?: boolean;
    /**
     * Callback that is called when the user dismisses the dialog.
     */
    onDismiss: () => any;
    /**
     * Determines Whether the dialog is visible.
     */
    visible: boolean;
    /**
     * Content of the `Dialog`.
     */
    children: React.ReactNode;
    style?: any;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * Dialogs inform users about a specific task and may contain critical information, require decisions, or involve multiple tasks.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { View } from 'react-native';
   * import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paragraph } from 'react-native-paper';
   *
   * export default class MyComponent extends React.Component {
   *   state = {
   *     visible: false,
   *   };
   *
   *   _showDialog = () => this.setState({ visible: true });
   *   _hideDialog = () => this.setState({ visible: false });
   *
   *   render() {
   *     const { visible } = this.state;
   *     return (
   *       <View>
   *         <Button onPress={this._showDialog}>Show Dialog</Button>
   *         <Dialog
   *            visible={visible}
   *            onDismiss={this._hideDialog}
   *         >
   *           <DialogTitle>Alert</DialogTitle>
   *           <DialogContent>
   *             <Paragraph>This is simple dialog</Paragraph>
   *           </DialogContent>
   *           <DialogActions>
   *             <Button onPress={this._hideDialog}>Done</Button>
   *           </DialogActions>
   *         </Dialog>
   *       </View>
   *     );
   *   }
   * }
   * ```
   */
  export class Dialog extends React.Component<DialogProps, any> {}

  export interface DialogActionsProps {
    /**
     * Content of the `DialogActions`.
     */
    children: React.ReactNode;
    style?: any;
  }

  /**
   * A component to show a list of actions in a Dialog.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { Button, Dialog, DialogActions } from 'react-native-paper';
   *
   * export default class MyComponent extends React.Component {
   *   state = {
   *     visible: false,
   *   };
   *
   *   _hideDialog = () => this.setState({ visible: false });
   *
   *   render() {
   *     return (
   *       <Dialog
   *         visible={this.state.visible}
   *         onDismiss={this._hideDialog}>
   *         <DialogActions>
   *           <Button onPress={() => console.log("Cancel")}>Cancel</Button>
   *           <Button onPress={() => console.log("Ok")}>Ok</Button>
   *         </DialogActions>
   *       </Dialog>
   *     );
   *   }
   * }
   * ```
   */
  export const DialogActions: React.SFC<DialogActionsProps>;

  export interface DialogContentProps {
    /**
     * Content of the `DialogContent`.
     */
    children: React.ReactNode;
    style?: any;
  }

  /**
   * A component to show content in a Dialog.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { Dialog, DialogContent, Paragraph } from 'react-native-paper';
   *
   * export default class MyComponent extends React.Component {
   *   state = {
   *     visible: false,
   *   };
   *
   *   _hideDialog = () => this.setState({ visible: false });
   *
   *   render() {
   *     return (
   *       <Dialog
   *         visible={this.state.visible}
   *         onDismiss={this._hideDialog}>
   *         <DialogContent>
   *           <Paragraph>This is simple dialog</Paragraph>
   *         </DialogContent>
   *       </Dialog>
   *     );
   *   }
   * }
   * ```
   */
  export const DialogContent: React.SFC<DialogContentProps>;

  export interface DialogScrollAreaProps {
    /**
     * Content of the `DialogScrollArea`.
     */
    children: React.ReactNode;
    style?: any;
  }

  /**
   * A component to show a scrollable content in a Dialog. The component only provides appropriate styling.
   * For the scrollable content you can use `ScrollView`, `FlatList` etc. depending on your requirement.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { ScrollView } from 'react-native';
   * import { Dialog, DialogScrollArea } from 'react-native-paper';
   *
   * export default class MyComponent extends React.Component {
   *   state = {
   *     visible: false,
   *   };
   *
   *   _hideDialog = () => this.setState({ visible: false });
   *
   *   render() {
   *     return (
   *       <Dialog
   *         visible={this.state.visible}
   *         onDismiss={this._hideDialog}>
   *         <DialogScrollArea>
   *           <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
   *             This is a scrollable area
   *           </ScrollView>
   *         </DialogScrollArea>
   *       </Dialog>
   *     );
   *   }
   * }
   * ```
   */
  export const DialogScrollArea: React.SFC<DialogScrollAreaProps>;

  export interface DialogTitleProps {
    /**
     * Title text for the `DialogTitle`.
     */
    children: React.ReactNode;
    style?: any;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * A component to show a title in a Dialog.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { Dialog, DialogContent, DialogTitle, Paragraph } from 'react-native-paper';
   *
   * export default class MyComponent extends React.Component {
   *   state = {
   *     visible: false,
   *   };
   *
   *   _hideDialog = () => this.setState({ visible: false });
   *
   *   render() {
   *     return (
   *       <Dialog
   *         visible={this.state.visible}
   *         onDismiss={this._hideDialog}>
   *         <DialogTitle>This is a title</DialogTitle>
   *         <DialogContent>
   *           <Paragraph>This is simple dialog</Paragraph>
   *         </DialogContent>
   *       </Dialog>
   *     );
   *   }
   * }
   * ```
   */
  export class DialogTitle extends React.Component<DialogTitleProps> {}

  export interface DividerProps {
    /**
     *  Whether divider has a left inset.
     */
    inset?: boolean;
    style?: any;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * A divider is a thin, lightweight separator that groups content in lists and page layouts.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { View } from 'react-native';
   * import { Divider, Text } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <View>
   *     <Text>Apple</Text>
   *     <Divider />
   *     <Text>Orange</Text>
   *     <Divider />
   *   </View>
   * );
   * ```
   */
  export class Divider extends React.Component<DividerProps> {}

  export interface DrawerItemProps {
    /**
     * The label text of the item.
     */
    label: string;
    /**
     * Icon to display for the `DrawerItem`.
     */
    icon?: IconSource;
    /**
     * Whether to highlight the drawer item as active.
     */
    active?: boolean;
    /**
     * Function to execute on press.
     */
    onPress?: () => any;
    /**
     * Custom color for the drawer text and icon.
     */
    color?: string;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * DrawerItem is a component used to show an action item with an icon and a label in a navigation drawer.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { DrawerItem } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <DrawerItem label="First Item" />
   * );
   * ```
   */
  export class DrawerItem extends React.Component<DrawerItemProps, any> {}

  export interface DrawerSectionProps {
    /**
     * Title to show as the header for the section.
     */
    title?: string;
    /**
     * Content of the `DrawerSection`.
     */
    children: React.ReactNode;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * A DrawerSection groups content inside a navigation drawer.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { DrawerSection, DrawerItem } from 'react-native-paper';
   *
   * export default class MyComponent extends React.Component {
   *   state = {
   *     active: 'First Item',
   *   };
   *
   *   render() {
   *     const { active } = this.state;
   *     return (
   *       <DrawerSection title="Some title">
   *         <DrawerItem
   *           label="First Item"
   *           active={active === 'First Item'}
   *           onPress={() => { this.setState({ active: 'First Item' }); }}
   *        />
   *         <DrawerItem
   *           label="Second Item"
   *           active={active === 'Second Item'}
   *           onPress={() => { this.setState({ active: 'Second Item' }); }}
   *        />
   *      </DrawerSection>
   *     );
   *   }
   * }
   * ```
   */
  export class DrawerSection extends React.Component<DrawerSectionProps, any> {}

  export interface FABProps {
    /**
     * Icon to display for the `FAB`.
     */
    icon: IconSource;
    /**
     * Optional label for extended `FAB`.
     */
    label?: string;
    /**
     *  Whether FAB is mini-sized, used to create visual continuity with other elements. This has no effect if `label` is specified.
     */
    small?: boolean;
    /**
     * Icon color of button, a dark button will render light text and vice-versa.
     */
    dark?: boolean;
    /**
     * Custom color for the `FAB`.
     */
    color?: string;
    /**
     * Function to execute on press.
     */
    onPress?: () => any;
    style?: any;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * A floating action button represents the primary action in an application.
   *
   * <div class="screenshots">
   *   <img src="screenshots/fab-1.png" />
   *   <img src="screenshots/fab-2.png" />
   * </div>
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { FAB } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <FAB
   *     small
   *     icon="add"
   *     onPress={() => {}}
   *   />
   * );
   * ```
   */
  export class FAB extends React.Component<FABProps, any> {}

  export interface HelperTextProps {
    /**
     * Type of the helper text.
     */
    type: 'error' | 'info';
    /**
     * Whether to display the helper text.
     */
    visible?: boolean;
    /**
     * Text content of the HelperText.
     */
    children: React.ReactNode;
    style?: any;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * Helper text is used in conjuction with input elements to provide additional hints for the user.
   *
   * <div class="screenshots">
   *   <img class="medium" src="screenshots/helper-text.gif" />
   * </div>
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { HelperText, TextInput } from 'react-native-paper';
   *
   * class MyComponent extends React.Component {
   *   state = {
   *     text: ''
   *   };
   *
   *   render(){
   *     return (
   *       <View>
   *         <TextInput
   *           label="Email"
   *           value={this.state.text}
   *           onChangeText={text => this.setState({ text })}
   *         />
   *         <HelperText
   *           type="error"
   *           visible={!this.state.text.includes('@')}
   *         >
   *           Email address is invalid!
   *         </HelperText>
   *       </View>
   *     );
   *   }
   * }
   * ```
   */
  export class HelperText extends React.PureComponent<HelperTextProps, any> {}

  export interface ListAccordionProps {
    /**
     * Title text for the list accordion.
     */
    title: React.ReactNode;
    /**
     * Description text for the list accordion.
     */
    description?: React.ReactNode;
    /**
     * Icon to display for the `ListAccordion`.
     */
    icon?: React.ReactNode;

    /**
     * Content of the section.
     */
    children: React.ReactNode;

    /**
     * @optional
     */
    theme?: ThemeShape;
    style?: any;
  }

  /**
   * `ListAccordion` can be used to display an expandable list item.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { ListAccordion, ListItem, Checkbox } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <ListAccordion
   *     title="Accordion"
   *     icon="folder"
   *   >
   *     <ListItem title="First item" />
   *     <ListItem title="Second item" />
   *   </ListAccordion>
   * );
   * ```
   */
  export class ListAccordion extends React.Component<ListAccordionProps, any> {}

  export interface ListItemProps {
    /**
     * Title text for the list item.
     */
    title: React.ReactNode;
    /**
     * Description text for the list item.
     */
    description?: React.ReactNode;
    /**
     * Icon to display for the `ListItem`.
     */
    icon?: IconSource;
    /**
     * Component to display as avatar image.
     */
    avatar?: React.ReactNode;
    /**
     * Function to execute on press.
     */
    onPress?: () => any;
    /**
     * @optional
     */
    theme?: ThemeShape;
    style?: any;
  }

  /**
   * ListItem can be used to show tiles inside a List.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { ListItem } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <ListItem title="First Item" description="Item description" icon="folder" />
   * );
   * ```
   */
  export class ListItem extends React.Component<ListItemProps, any> {}

  export interface ListSectionProps {
    /**
     * Title text for the section.
     */
    title?: string;
    /**
     * Content of the section.
     */
    children: React.ReactNode;
    /**
     * @optional
     */
    theme?: ThemeShape;
    style?: any;
  }

  /**
   * `ListSection` groups items, usually `ListItem`.
   *
   * <div class="screenshots">
   *   <img src="screenshots/list-section.png" />
   * </div>
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { ListSection, ListItem } from 'react-native-paper';
   *
   * export default class MyComponent extends React.Component {
   *   render() {
   *     return (
   *       <ListSection title="Some title">
   *         <ListItem
   *           title="First Item"
   *           icon="folder"
   *        />
   *         <ListItem
   *           title="Second Item"
   *           icon="folder"
   *        />
   *      </ListSection>
   *     );
   *   }
   * }
   * ```
   */
  export class ListSection extends React.Component<ListSectionProps, any> {}

  export interface ModalProps {
    /**
     * Determines whether clicking outside the modal dismiss it.
     */
    dismissable?: boolean;
    /**
     * Callback that is called when the user dismisses the modal.
     */
    onDismiss: () => any;
    /**
     * Determines Whether the modal is visible.
     */
    visible: boolean;
    /**
     * Content of the `Modal`.
     */
    children: React.ReactNode;
  }

  /**
   * The Modal component is a simple way to present content above an enclosing view.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { Modal, Text } from 'react-native-paper';
   *
   * export default class MyComponent extends React.Component {
   *   state = {
   *     visible: false,
   *   };
   *
   *   _showModal = () => this.setState({ visible: true });
   *   _hideModal = () => this.setState({ visible: false });
   *
   *   render() {
   *     const { visible } = this.state;
   *     return (
   *       <Modal visible={visible} onDismiss={this._hideModal}>
   *         <Text>Example Modal</Text>
   *       </Modal>
   *     );
   *   }
   * }
   * ```
   */
  export class Modal extends React.Component<ModalProps, any> {}

  export interface PaperProps {
    /**
     * Content of the `Paper`.
     */
    children: React.ReactNode;
    style?: any;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * Paper is a basic container that can give depth to an element with elevation shadow.
   * A shadow can be applied by specifying the `elevation` property both on Android and iOS.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { Paper, Text } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <Paper style={styles.paper}>
   *      <Text>Paper</Text>
   *   </Paper>
   * );
   *
   * const styles = StyleSheet.create({
   *   paper: {
   *     padding: 8,
   *     height: 80,
   *     width: 80,
   *     alignItems: 'center',
   *     justifyContent: 'center',
   *     elevation: 4,
   *   },
   * });
   * ```
   */
  export class Paper extends React.Component<PaperProps, any> {}

  interface ProgressBarProps {
    /**
     * Progress value (between 0 and 1).
     */
    progress: number;
    /**
     * Color of the progress bar.
     */
    color?: string;
    style?: any;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * Progress bar is an indicator used to present progress of some activity in the app.
   *
   * <div class="screenshots">
   *   <img src="screenshots/progress-bar.png" />
   * </div>
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { ProgressBar } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <ProgressBar progress={0.5} color={Colors.red800} />
   * );
   * ```
   */
  export class ProgressBar extends React.Component<ProgressBarProps> {}

  export interface RadioButtonProps {
    /**
     * Value of the radio button
     */
    value: string;
    /**
     * Whether radio is checked.
     */
    checked?: boolean;
    /**
     * Whether radio is disabled.
     */
    disabled?: boolean;
    /**
     * Function to execute on press.
     */
    onPress?: () => any;
    /**
     * Custom color for unchecked radio.
     */
    uncheckedColor?: string;
    /**
     * Custom color for radio.
     */
    color?: string;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * Radio buttons allow the selection a single option from a set.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { View } from 'react-native';
   * import { RadioButton } from 'react-native-paper';
   *
   * export default class MyComponent extends React.Component {
   *   state = {
   *     checked: 'first',
   *   };
   *
   *   render() {
   *     const { checked } = this.state;
   *
   *     return (
   *       <View>
   *         <RadioButton
   *           value="first"
   *           checked={checked === 'first'}
   *           onPress={() => { this.setState({ checked: 'firstOption' }); }}
   *         />
   *         <RadioButton
   *           value="second"
   *           checked={checked === 'second'}
   *           onPress={() => { this.setState({ checked: 'secondOption' }); }}
   *         />
   *       </View>
   *     );
   *   }
   * }
   * ```
   */
  export class RadioButton extends React.Component<RadioButtonProps, any> {}

  export interface RadioButtonProps {
    /**
     * Function to execute on selection change.
     */
    onValueChange: (value: string) => any;
    /**
     * Value of the currently selected radio button.
     */
    value: string;
    /**
     * React elements containing radio buttons.
     */
    children: React.ReactNode;
  }

  /**
   * Radio button group allows to control a group of radio buttons.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { View } from 'react-native';
   * import { RadioButtonGroup, RadioButton, Text } from 'react-native-paper';
   *
   * export default class MyComponent extends Component {
   *   state = {
   *     value: 'first',
   *   };
   *
   *   render() {
   *     return(
   *       <RadioButtonGroup
   *         onValueChange={value => this.setState({ value })}
   *         value={this.state.value}
   *       >
   *         <View>
   *           <Text>First</Text>
   *           <RadioButton value="first" />
   *         </View>
   *         <View>
   *           <Text>Second</Text>
   *           <RadioButton value="second" />
   *         </View>
   *       </RadioButtonGroup>
   *     )
   *   }
   * }
   *```
   */
  export class RadioButtonGroup extends React.Component<
    RadioButtonProps,
    any
  > {}

  export interface SearchbarProps {
    /**
     * Hint text shown when the input is empty.
     */
    placeholder?: string;
    /**
     * The value of the text input.
     */
    value: string;
    /**
     * Icon name for the left icon button (see `onIconPress`).
     */
    icon?: IconSource;
    /**
     * Callback that is called when the text input's text changes.
     */
    onChangeText?: (query: string) => void;
    /**
     * Callback to execute if we want the left icon to act as button.
     */
    onIconPress?: () => any;
    style?: any;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * Searchbar is a simple input box where users can type search queries.
   *
   * ## Usage
   * ```js
   * import React from 'react';
   * import { Searchbar } from 'react-native-paper';
   *
   * export default class MyComponent extends React.Component {
   *   state = {
   *     firstQuery: '',
   *   };
   *
   *   render() {
   *     const { firstQuery } = this.state;
   *     return (
   *       <Searchbar
   *         placeholder="Search"
   *         onChangeText={query => { this.setState({ firstQuery: query }); }}
   *         value={firstQuery}
   *       />
   *     );
   *   }
   * }
   * ```
   */
  export class Searchbar extends React.Component<SearchbarProps, any> {
    _root: ReactNative.TextInput
  }

  export interface SnackbarProps {
    /**
     * Whether the Snackbar is currently visible.
     */
    visible: boolean;
    /**
     * Label and press callback for the action button. It should contain the following properties:
     * - `label` - Label of the action button
     * - `onPress` - Callback that is called when action button is pressed.
     */
    action?: {
      label: string;
      onPress: () => any;
    };
    /**
     * The duration for which the Snackbar is shown.
     */
    duration?: number;
    /**
     * Callback called when Snackbar is dismissed. The `visible` prop needs to be updated when this is called.
     */
    onDismiss: () => any;
    /**
     * Text content of the Snackbar.
     */
    children: React.ReactNode;
    style?: any;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * Snackbar provide brief feedback about an operation through a message at the bottom of the screen.
   * ## Usage
   * ```js
   * import React from 'react';
   * import { StyleSheet } from 'react-native';
   * import { Snackbar } from 'react-native-paper';
   *
   * export default class MyComponent extends React.Component {
   *   state = {
   *     visible: false,
   *   };
   *
   *   render() {
   *     const { visible } = this.state;
   *     return (
   *       <View style={styles.container}>
   *         <Button
   *           raised
   *           onPress={() => this.setState(state => ({ visible: !state.visible }))}
   *         >
   *           {this.state.visible ? 'Hide' : 'Show'}
   *         </Button>
   *         <Snackbar
   *           visible={this.state.visible}
   *           onDismiss={() => this.setState({ visible: false })}
   *           action={{
   *             label: 'Undo',
   *             onPress: () => {
   *               // Do something
   *             },
   *           }}
   *         >
   *           Hey there! I'm a Snackbar.
   *         </Snackbar>
   *       </View>
   *     );
   *   }
   * }
   *
   * const styles = StyleSheet.create({
   *   container: {
   *     flex: 1,
   *     justifyContent: 'space-between',
   *   },
   * });
   * ```
   */
  export class Snackbar extends React.Component<SnackbarProps, any> {}

  export interface FABGroupProps {
    /**
     * Action items to display in the form of a speed dial.
     * An action item should contain the following properties:
     * - `icon`: icon to display (required)
     * - `label`: optional label text
     * - `color`: custom icon color of the action item
     * - `onPress`: callback that is called when `FAB` is pressed (required)
     */
    actions: Array<{
      icon: string;
      label?: string;
      color?: string;
      onPress: () => any;
    }>;
    /**
     * Icon to display for the `FAB`.
     * You can toggle it based on whether the speed dial is open to display a different icon.
     */
    icon: IconSource;
    /**
     * Custom icon color for the `FAB`.
     */
    color?: string;
    /**
     * Function to execute on pressing the `FAB`.
     */
    onPress?: () => any;
    /**
     * Whether the speed dial is open.
     */
    open: boolean;
    /**
     * Callback which is called on opening and closing the speed dial.
     * The open state needs to be updated when it's called, otherwise the change is dropped.
     */
    onStateChange: (state: { open: boolean }) => any;
    /**
     * Style for the group. You can use it to pass additional styles if you need.
     * For example, you can set an additional margin if you have a tab bar at the bottom.
     */
    style?: any;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * FABGroup displays a stack of FABs with related actions in a speed dial.
   *
   * ## Usage
   * ```js
   * import React from 'react';
   * import { FABGroup, StyleSheet } from 'react-native-paper';
   *
   * export default class MyComponent extends React.Component {
   *   state = {
   *     open: false,
   *   };
   *
   *   render() {
   *     return (
   *       <FABGroup
   *         open={this.state.open}
   *         icon={this.state.open ? 'today' : 'add'}
   *         actions={[
   *           { icon: 'add', onPress: () => {} },
   *           { icon: 'star', label: 'Star', onPress: () => {} },
   *           { icon: 'email', label: 'Email', onPress: () => {} },
   *           { icon: 'notifications', label: 'Remind', onPress: () => {} },
   *         ]}
   *         onStateChange={({ open }) => this.setState({ open })}
   *         onPress={() => {
   *           if (this.state.open) {
   *             // do something if the speed dial is open
   *           }
   *         }}
   *       />
   *     );
   *   }
   * }
   * ```
   */
  export class FABGroup extends React.Component<FABGroupProps, any> {}

  export interface ToolbarProps {
    /**
     * Theme color for the toolbar, a dark toolbar will render light text and vice-versa
     * Child elements can override this prop independently.
     */
    dark?: boolean;
    /**
     * Extra padding to add at the top of toolbar to account for translucent status bar.
     * This is automatically handled on iOS including iPhone X.
     * If you are using Android and use Expo, we assume translucent status bar and set a height for status bar automatically.
     * Pass `0` or a custom value to disable the default behaviour.
     */
    statusBarHeight?: number;
    /**
     * Content of the `Toolbar`.
     */
    children: React.ReactNode;
    /**
     * @optional
     */
    theme?: ThemeShape;
    style?: any;
  }

  /**
   * Toolbar is usually used as a header placed at the top of the screen.
   * It can contain the screen title, controls such as navigation buttons, menu button etc.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction } from 'react-native-paper';
   *
   * export default class MyComponent extends React.Component {
   *   render() {
   *     return (
   *       <Toolbar>
   *         <ToolbarBackAction
   *           onPress={this._goBack}
   *         />
   *         <ToolbarContent
   *           title="Title"
   *           subtitle="Subtitle"
   *         />
   *         <ToolbarAction icon="search" onPress={this._onSearch} />
   *         <ToolbarAction icon="more-vert" onPress={this._onMore} />
   *       </Toolbar>
   *     );
   *   }
   * }
   * ```
   */
  export class Toolbar extends React.Component<ToolbarProps, any> {}

  export interface ToolbarActionProps {
    /**
     * A dark action icon will render a light icon and vice-versa.
     */
    dark?: boolean;
    /**
     *  Custom color for action icon.
     */
    color?: string;
    /**
     * Name of the icon to show.
     */
    icon: IconSource;
    /**
     * Optional icon size.
     */
    size?: number;
    /**
     * Function to execute on press.
     */
    onPress?: () => any;
    style?: any;
  }

  /**
   * The ToolbarAction component is used for displaying an action item in the toolbar.
   */
  export default class ToolbarAction extends React.Component<
    ToolbarActionProps,
    any
  > {}

  export interface ToolbarBackActionProps {
    /**
     * A dark action icon will render a light icon and vice-versa.
     */
    dark?: boolean;
    /**
     *  Custom color for back icon.
     */
    color?: string;
    /**
     * Function to execute on press.
     */
    onPress?: () => any;
    style?: any;
  }

  /**
   * The ToolbarBackAction component is used for displaying a back button in the toolbar.
   */
  export const ToolbarBackAction: React.SFC<ToolbarBackActionProps>;

  export interface TouchableRippleProps {
    /**
     * Whether to render the ripple outside the view bounds.
     */
    borderless?: boolean;
    /**
     * Type of background drawabale to display the feedback.
     * https://facebook.github.io/react-native/docs/touchablenativefeedback.html#background
     */
    background?: Object;
    /**
     * Whether to prevent interaction with the touchable.
     */
    disabled?: boolean;
    /**
     * Function to execute on press. If not set, will cause the touchable to be disabled.
     */
    onPress?: (() => any) | null | undefined;
    /**
     * Color of the ripple effect.
     */
    rippleColor?: string;
    /**
     * Color of the underlay for the highlight effect.
     */
    underlayColor?: string;
    /**
     * Content of the `TouchableRipple`.
     */
    children: React.ReactNode;
    style?: any;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * A wrapper for views that should respond to touches.
   * Provides a material "ink ripple" interaction effect for supported platforms (>= Android Lollipop).
   * On unsupported platforms, it falls back to a highlight effect.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { View } from 'react-native';
   * import { Text, TouchableRipple } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <TouchableRipple
   *     onPress={() => console.log('Pressed')}
   *     rippleColor="rgba(0, 0, 0, .32)"
   *   >
   *     <Text>Press me</Text>
   *   </TouchableRipple>
   * );
   * ```
   */
  export class TouchableRipple extends React.Component<
    TouchableRippleProps,
    any
  > {
    static supported: boolean;
  }

  export interface TextInputProps extends ReactNative.TextInputProps {
    /**
     * If true, user won't be able to interact with the component.
     */
    disabled?: boolean;
    /**
     * The text to use for the floating label.
     */
    label?: string;
    /**
     * Placeholder for the input.
     */
    placeholder?: string;
    /**
     * Whether to style the TextInput with error style.
     */
    error?: boolean;
    /**
     * Callback that is called when the text input's text changes. Changed text is passed as an argument to the callback handler.
     */
    onChangeText?: (text: string) => any;
    /**
     * Underline color of the input.
     */
    underlineColor?: string;
    /**
     * Color for the text selection background. Defaults to the theme's primary color.
     */
    selectionColor?: string;
    /**
     * Whether the input can have multiple lines.
     */
    multiline?: boolean;
    /**
     * The number of lines to show in the input (Android only).
     */
    numberOfLines?: number;
    /**
     * Callback that is called when the text input is focused.
     */
    onFocus?: () => any;
    /**
     * Callback that is called when the text input is blurred.
     */
    onBlur?: () => any;
    /**
     * Value of the text input.
     */
    value?: string;
    style?: any;
    /**
     * @optional
     */
    theme?: ThemeShape;
  }

  /**
   * TextInputs allow users to input text.
   *
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { TextInput } from 'react-native-paper';
   *
   * class MyComponent extends React.Component {
   *   state = {
   *     text: ''
   *   };
   *
   *   render(){
   *     return (
   *       <TextInput
   *         label='Email'
   *         value={this.state.text}
   *         onChangeText={text => this.setState({ text })}
   *       />
   *     );
   *   }
   * }
   * ```
   *
   * @extends TextInput props https://facebook.github.io/react-native/docs/textinput.html#props
   *
   */
  export class TextInput extends React.Component<TextInputProps, any> {
    _root: ReactNative.TextInput
  }

  export interface CaptionProps {
    style?: any;
  }

  /**
   * Typography component for showing a caption.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { Caption } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <Caption>Caption</Caption>
   * );
   * ```
   */
  export const Caption: React.SFC<CaptionProps>;

  /**
   * Typography component for showing a headline.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { Headline } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <Headline>Headline</Headline>
   * );
   * ```
   */
  export const Headline: React.SFC<CaptionProps>;

  /**
   * Typography component for showing a paragraph.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { Paragraph } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <Paragraph>Paragraph</Paragraph>
   * );
   * ```
   */
  export const Paragraph: React.SFC<CaptionProps>;

  /**
   * Typography component for showing a subheading.
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { Subheading } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <Subheading>Subheading</Subheading>
   * );
   * ```
   */
  export const Subheading: React.SFC<CaptionProps>;

  /**
   * Typography component for showing a title.
   *
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { Title } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *   <Title>Title</Title>
   * );
   * ```
   */
  export const Title: React.SFC<CaptionProps>;

  export interface TextProps extends ReactNative.TextProps {
    style?: any,
    /**
     * @optional
     */
    theme?: ThemeShape,
  }

  /**
   * Text component which follows styles from the theme.
   *
   * @extends Text props https://facebook.github.io/react-native/docs/text.html#props
   */
  class Text extends React.Component<TextProps> {
    _root: ReactNative.Text
  }

  export const Colors: {
    red50: string;
    red100: string;
    red200: string;
    red300: string;
    red400: string;
    red500: string;
    red600: string;
    red700: string;
    red800: string;
    red900: string;
    redA100: string;
    redA200: string;
    redA400: string;
    redA700: string;

    pink50: string;
    pink100: string;
    pink200: string;
    pink300: string;
    pink400: string;
    pink500: string;
    pink600: string;
    pink700: string;
    pink800: string;
    pink900: string;
    pinkA100: string;
    pinkA200: string;
    pinkA400: string;
    pinkA700: string;

    purple50: string;
    purple100: string;
    purple200: string;
    purple300: string;
    purple400: string;
    purple500: string;
    purple600: string;
    purple700: string;
    purple800: string;
    purple900: string;
    purpleA100: string;
    purpleA200: string;
    purpleA400: string;
    purpleA700: string;

    deepPurple50: string;
    deepPurple100: string;
    deepPurple200: string;
    deepPurple300: string;
    deepPurple400: string;
    deepPurple500: string;
    deepPurple600: string;
    deepPurple700: string;
    deepPurple800: string;
    deepPurple900: string;
    deepPurpleA100: string;
    deepPurpleA200: string;
    deepPurpleA400: string;
    deepPurpleA700: string;

    indigo50: string;
    indigo100: string;
    indigo200: string;
    indigo300: string;
    indigo400: string;
    indigo500: string;
    indigo600: string;
    indigo700: string;
    indigo800: string;
    indigo900: string;
    indigoA100: string;
    indigoA200: string;
    indigoA400: string;
    indigoA700: string;

    blue50: string;
    blue100: string;
    blue200: string;
    blue300: string;
    blue400: string;
    blue500: string;
    blue600: string;
    blue700: string;
    blue800: string;
    blue900: string;
    blueA100: string;
    blueA200: string;
    blueA400: string;
    blueA700: string;

    lightBlue50: string;
    lightBlue100: string;
    lightBlue200: string;
    lightBlue300: string;
    lightBlue400: string;
    lightBlue500: string;
    lightBlue600: string;
    lightBlue700: string;
    lightBlue800: string;
    lightBlue900: string;
    lightBlueA100: string;
    lightBlueA200: string;
    lightBlueA400: string;
    lightBlueA700: string;

    cyan50: string;
    cyan100: string;
    cyan200: string;
    cyan300: string;
    cyan400: string;
    cyan500: string;
    cyan600: string;
    cyan700: string;
    cyan800: string;
    cyan900: string;
    cyanA100: string;
    cyanA200: string;
    cyanA400: string;
    cyanA700: string;

    teal50: string;
    teal100: string;
    teal200: string;
    teal300: string;
    teal400: string;
    teal500: string;
    teal600: string;
    teal700: string;
    teal800: string;
    teal900: string;
    tealA100: string;
    tealA200: string;
    tealA400: string;
    tealA700: string;

    green50: string;
    green100: string;
    green200: string;
    green300: string;
    green400: string;
    green500: string;
    green600: string;
    green700: string;
    green800: string;
    green900: string;
    greenA100: string;
    greenA200: string;
    greenA400: string;
    greenA700: string;

    lightGreen50: string;
    lightGreen100: string;
    lightGreen200: string;
    lightGreen300: string;
    lightGreen400: string;
    lightGreen500: string;
    lightGreen600: string;
    lightGreen700: string;
    lightGreen800: string;
    lightGreen900: string;
    lightGreenA100: string;
    lightGreenA200: string;
    lightGreenA400: string;
    lightGreenA700: string;

    lime50: string;
    lime100: string;
    lime200: string;
    lime300: string;
    lime400: string;
    lime500: string;
    lime600: string;
    lime700: string;
    lime800: string;
    lime900: string;
    limeA100: string;
    limeA200: string;
    limeA400: string;
    limeA700: string;

    yellow50: string;
    yellow100: string;
    yellow200: string;
    yellow300: string;
    yellow400: string;
    yellow500: string;
    yellow600: string;
    yellow700: string;
    yellow800: string;
    yellow900: string;
    yellowA100: string;
    yellowA200: string;
    yellowA400: string;
    yellowA700: string;

    amber50: string;
    amber100: string;
    amber200: string;
    amber300: string;
    amber400: string;
    amber500: string;
    amber600: string;
    amber700: string;
    amber800: string;
    amber900: string;
    amberA100: string;
    amberA200: string;
    amberA400: string;
    amberA700: string;

    orange50: string;
    orange100: string;
    orange200: string;
    orange300: string;
    orange400: string;
    orange500: string;
    orange600: string;
    orange700: string;
    orange800: string;
    orange900: string;
    orangeA100: string;
    orangeA200: string;
    orangeA400: string;
    orangeA700: string;

    deepOrange50: string;
    deepOrange100: string;
    deepOrange200: string;
    deepOrange300: string;
    deepOrange400: string;
    deepOrange500: string;
    deepOrange600: string;
    deepOrange700: string;
    deepOrange800: string;
    deepOrange900: string;
    deepOrangeA100: string;
    deepOrangeA200: string;
    deepOrangeA400: string;
    deepOrangeA700: string;

    brown50: string;
    brown100: string;
    brown200: string;
    brown300: string;
    brown400: string;
    brown500: string;
    brown600: string;
    brown700: string;
    brown800: string;
    brown900: string;

    blueGrey50: string;
    blueGrey100: string;
    blueGrey200: string;
    blueGrey300: string;
    blueGrey400: string;
    blueGrey500: string;
    blueGrey600: string;
    blueGrey700: string;
    blueGrey800: string;
    blueGrey900: string;

    grey50: string;
    grey100: string;
    grey200: string;
    grey300: string;
    grey400: string;
    grey500: string;
    grey600: string;
    grey700: string;
    grey800: string;
    grey900: string;

    black: string;
    white: string;
  };
}
