/* @flow */

import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import withTheme from '../../core/withTheme';
import Paper from '../Paper';
import ToolbarContent from './ToolbarContent';

import type { Theme } from '../../types';

type Props = {
  /**
   * Theme color for the toolbar, a dark toolbar will render light text and vice-versa
   * Child elements can override this prop independently.
   */
  dark?: boolean,
  /**
   * Space added it Toolbar to adapt to the StatusBar.
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
 * import React from 'react';
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
    statusBarHeight: Platform.OS === 'ios' ? 20 : 0,
  };

  render() {
    const {
      children,
      dark,
      statusBarHeight,
      style,
      theme,
      ...rest
    } = this.props;
    const { colors } = theme;

    const toolbarHeight = 56;
    const flattenStyle = style ? StyleSheet.flatten(style) : {};
    const { height: heightProp, ...styleProp } = { ...flattenStyle };

    const elevation = Platform.OS === 'ios' ? 0 : 4;

    const toolbarStyle = {
      backgroundColor: colors.primary,
      // TODO make height orientation aware ???
      height: (heightProp || toolbarHeight) + statusBarHeight,
    };

    const childrenArray = React.Children.toArray(children);
    let isToolbarContentFound = false;
    let leftActions = 0,
      rightActions = 0;

    if (Platform.OS === 'ios') {
      childrenArray.forEach(child => {
        if (!isToolbarContentFound && child.type !== ToolbarContent) {
          leftActions++;
        } else if (child.type === ToolbarContent) {
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

    return (
      <Paper
        style={[
          toolbarStyle,
          { paddingTop: statusBarHeight, elevation },
          styles.toolbar,
          styleProp,
        ]}
        {...rest}
      >
        {childrenArray.filter(child => child).map((child: any, i) => {
          const props: { dark: ?boolean, style?: any } = {
            dark:
              typeof child.props.dark === 'undefined' ? dark : child.props.dark,
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
      </Paper>
    );
  }
}

const styles = StyleSheet.create({
  toolbar: {
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
