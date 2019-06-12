/* @flow */

import * as React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import color from 'color';

import AppbarContent from './AppbarContent';
import AppbarAction from './AppbarAction';
import AppbarBackAction from './AppbarBackAction';
import AppbarHeader from './AppbarHeader';
import Surface from '../Surface';
import { withTheme } from '../../core/theming';
import { black, white } from '../../styles/colors';
import type { Theme } from '../../types';

type Props = React.ElementConfig<typeof View> & {|
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
|};

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
 * import { Appbar } from 'react-native-paper';
 * import { StyleSheet } from 'react-native';
 *
 * export default class MyComponent extends React.Component {
 *   render() {
 *     return (
 *       <Appbar style={styles.bottom}>
 *         <Appbar.Action icon="archive" onPress={() => console.log('Pressed archive')} />
 *         <Appbar.Action icon="mail" onPress={() => console.log('Pressed mail')} />
 *         <Appbar.Action icon="label" onPress={() => console.log('Pressed label')} />
 *         <Appbar.Action icon="delete" onPress={() => console.log('Pressed delete')} />
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

    let shouldCenterContent = false;
    let shouldAddLeftSpacing = false;
    let shouldAddRightSpacing = false;

    if (Platform.OS === 'ios') {
      let hasAppbarContent = false;
      let leftItemsCount = 0;
      let rightItemsCount = 0;

      React.Children.forEach(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === AppbarContent) {
            hasAppbarContent = true;
          } else if (hasAppbarContent) {
            rightItemsCount++;
          } else {
            leftItemsCount++;
          }
        }
      });

      shouldCenterContent =
        hasAppbarContent && (leftItemsCount < 2 && rightItemsCount < 2);
      shouldAddLeftSpacing = shouldCenterContent && leftItemsCount === 0;
      shouldAddRightSpacing = shouldCenterContent && rightItemsCount === 0;
    }

    return (
      <Surface
        style={[{ backgroundColor }, styles.appbar, restStyle]}
        {...rest}
      >
        {shouldAddLeftSpacing ? <View style={styles.spacing} /> : null}
        {React.Children.toArray(children)
          .filter(child => child != null && typeof child !== 'boolean')
          .map((child, i) => {
            if (
              !React.isValidElement(child) ||
              ![AppbarContent, AppbarAction, AppbarBackAction].includes(
                child.type
              )
            ) {
              return child;
            }

            const props: { color: ?string, style?: any } = {
              color:
                typeof child.props.color !== 'undefined'
                  ? child.props.color
                  : isDark
                    ? white
                    : black,
            };

            if (child.type === AppbarContent) {
              props.style = [
                // Since content is not first item, add extra left margin
                i !== 0 && { marginLeft: 8 },
                shouldCenterContent && { alignItems: 'center' },
                child.props.style,
              ];
            }

            return React.cloneElement(child, props);
          })}
        {shouldAddRightSpacing ? <View style={styles.spacing} /> : null}
      </Surface>
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
  spacing: {
    width: 48,
  },
});

export default withTheme(Appbar);
