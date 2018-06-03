/* @flow */

import * as React from 'react';
import {
  View,
  Platform,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import color from 'color';

import withTheme from '../../core/withTheme';
import ToolbarContent from './ToolbarContent';

import type { Theme } from '../../types';

type Props = {
  /**
   * Theme color for the toolbar, a dark toolbar will render light text and vice-versa
   * Child elements can override this prop independently.
   */
  dark?: boolean,
  /**
   * Extra padding to add at the top of toolbar to account for translucent status bar.
   * This is automatically handled on iOS including iPhone X.
   * If you are using Android and use Expo, we assume translucent status bar and set a height for status bar automatically.
   * Pass `0` or a custom value to disable the default behaviour.
   */
  statusBarHeight?: number,
  /**
   * Content of the `Toolbar`.
   */
  children: React.Node,
  /**
   * @optional
   */
  theme: Theme,
  style?: any,
};

const DEFAULT_TOOLBAR_HEIGHT = 56;
const DEFAULT_STATUSBAR_HEIGHT_EXPO =
  global.__expo && global.__expo.Constants
    ? global.__expo.Constants.statusBarHeight
    : undefined;
const DEFAULT_STATUSBAR_HEIGHT = Platform.select({
  android: DEFAULT_STATUSBAR_HEIGHT_EXPO,
  ios:
    Platform.Version < 11
      ? DEFAULT_STATUSBAR_HEIGHT_EXPO === undefined
        ? StatusBar.currentHeight
        : DEFAULT_STATUSBAR_HEIGHT_EXPO
      : undefined,
});

/**
 * Toolbar is usually used as a header placed at the top of the screen.
 * It can contain the screen title, controls such as navigation buttons, menu button etc.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/toolbar.android.png" />
 *     <figcaption>Android</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="medium" src="screenshots/toolbar.ios.png" />
 *     <figcaption>iOS</figcaption>
 *   </figure>
 * </div>
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
class Toolbar extends React.Component<Props> {
  static defaultProps = {
    // TODO: handle orientation changes
    statusBarHeight: DEFAULT_STATUSBAR_HEIGHT,
  };

  render() {
    const {
      // Don't use default props since we check it to know whether we should use SafeAreaView
      statusBarHeight = 0,
      children,
      dark,
      style,
      theme,
      ...rest
    } = this.props;

    const { colors } = theme;
    const {
      height = DEFAULT_TOOLBAR_HEIGHT,
      backgroundColor = colors.primary,
      ...restStyle
    } =
      StyleSheet.flatten(style) || {};

    let isDark;

    if (typeof dark === 'boolean') {
      isDark = dark;
    } else {
      isDark =
        backgroundColor === 'transparent'
          ? false
          : !color(backgroundColor).light();
    }

    const childrenArray = React.Children.toArray(children);

    let isToolbarContentFound = false;
    let leftActions = 0;
    let rightActions = 0;

    if (Platform.OS === 'ios') {
      childrenArray.forEach(child => {
        if (
          !isToolbarContentFound &&
          React.isValidElement(child) &&
          child.type !== ToolbarContent
        ) {
          leftActions++;
        } else if (
          React.isValidElement(child) &&
          child.type === ToolbarContent
        ) {
          isToolbarContentFound = true;
        } else {
          rightActions++;
        }
      });
    }

    const centerIos =
      Platform.OS === 'ios' && (leftActions < 2 && rightActions < 2);

    if (centerIos && leftActions === 0) {
      childrenArray.unshift(
        <View key="left-empty-icon" style={styles.emptyIcon} />
      );
    }

    if (centerIos && rightActions === 0) {
      childrenArray.push(
        <View key="right-empty-icon" style={styles.emptyIcon} />
      );
    }

    // Let the user override the behaviour
    const Wrapper =
      typeof this.props.statusBarHeight === 'number' ? View : SafeAreaView;

    return (
      <Wrapper
        style={[{ backgroundColor }, styles.toolbar, restStyle]}
        {...rest}
      >
        <View style={[{ height, marginTop: statusBarHeight }, styles.wrapper]}>
          {childrenArray
            .filter(child => React.isValidElement(child))
            .map((child: any, i) => {
              const props: { dark: ?boolean, style?: any } = {
                dark:
                  typeof child.props.dark === 'undefined'
                    ? isDark
                    : child.props.dark,
              };

              if (child.type === ToolbarContent) {
                // Extra margin between left icon and ToolbarContent
                props.style = [
                  { marginHorizontal: i === 0 ? 0 : 8 },
                  centerIos && { alignItems: 'center' },
                  child.props.style,
                ];
              }

              return React.cloneElement(child, props);
            })}
        </View>
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  toolbar: {
    elevation: 4,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  emptyIcon: {
    height: 36,
    width: 36,
    marginHorizontal: 6,
  },
});

export default withTheme(Toolbar);
