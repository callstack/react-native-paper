/* @flow */

import * as React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import color from 'color';

import AppbarContent from './AppbarContent';
import AppbarAction from './AppbarAction';
import AppbarBackAction from './AppbarBackAction';
import AppbarHeader from './AppbarHeader';
import withTheme from '../../core/withTheme';
import { black, white } from '../../styles/colors';
import type { Theme } from '../../types';

type Props = {
  /**
   * Whether the background color is a dark color. A dark appbar will render light text and vice-versa.
   */
  dark?: boolean,
  /**
   * Content of the `Appbar`.
   */
  children: React.Node,
  /**
   * @optional
   */
  theme: Theme,
  style?: any,
};

export const DEFAULT_APPBAR_HEIGHT = 56;

/**
 * A component to display action items in a bar. It can be placed at the top or bottom.
 * The top bar usually contains the screen title, controls such as navigation buttons, menu button etc.
 * The bottom bar usually provides access to a drawer and up to four actions.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/appbar.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Appbar, StyleSheet } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   render() {
 *     return (
 *       <Appbar style={styles.bottom}>
 *         <Appbar.Action icon="archive" onPress={() => {}} />
 *         <Appbar.Action icon="mail" onPress={() => {}} />
 *         <Appbar.Action icon="label" onPress={() => {}} />
 *         <Appbar.Action icon="delete" onPress={() => {}} />
 *       </Appbar>
 *     );
 *   }
 * }
 *
 * const styles = StyleSheet.create({
 *   bottom: {
 *     position: 'absolute',
 *     left: 0,
 *     right: 0,
 *     bottom: 0,
 *   },
 * });
 * ```
 */
class Appbar extends React.Component<Props> {
  // @component ./AppbarContent.js
  static Content = AppbarContent;
  // @component ./AppbarAction.js
  static Action = AppbarAction;
  // @component ./AppbarBackAction.js
  static BackAction = AppbarBackAction;
  // @component ./AppbarHeader.js
  static Header = AppbarHeader;

  render() {
    const { children, dark, style, theme, ...rest } = this.props;

    const { colors } = theme;
    const { backgroundColor = colors.primary, ...restStyle } =
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

    let isAppbarContentFound = false;
    let leftActions = 0;
    let rightActions = 0;

    if (Platform.OS === 'ios') {
      childrenArray.forEach(child => {
        if (
          !isAppbarContentFound &&
          React.isValidElement(child) &&
          child.type !== AppbarContent
        ) {
          leftActions++;
        } else if (
          React.isValidElement(child) &&
          child.type === AppbarContent
        ) {
          isAppbarContentFound = true;
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

    return (
      <View style={[{ backgroundColor }, styles.appbar, restStyle]} {...rest}>
        {childrenArray
          .filter(child => React.isValidElement(child))
          .map((child: any, i) => {
            const props: { color: ?string, style?: any } = {
              color:
                typeof child.props.color !== 'undefined'
                  ? child.props.color
                  : isDark
                    ? white
                    : black,
            };

            if (child.type === AppbarContent) {
              // Extra margin between left icon and AppbarContent
              props.style = [
                { marginHorizontal: i === 0 ? 0 : 8 },
                centerIos && { alignItems: 'center' },
                child.props.style,
              ];
            }

            return React.cloneElement(child, props);
          })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appbar: {
    height: DEFAULT_APPBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    elevation: 4,
  },
  emptyIcon: {
    height: 36,
    width: 36,
    marginHorizontal: 6,
  },
});

export default withTheme(Appbar);
