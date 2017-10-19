/* @flow */

import React, { Children, Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import withTheme from '../../core/withTheme';
import Paper from '../Paper';
import ToolbarContent from './ToolbarContent';
import ToolbarAction from './ToolbarAction';

import type { Theme } from '../../types/Theme';
import ToolbarBackAction from './ToolbarBackAction';

type Props = {
  /**
   * Theme color for the whole toolbar, a dark toolbar will render light text and vice-versa
   * Child elements can override this prop independently
   */
  dark?: boolean,
  /**
   * Toolbar content
   */
  children?: any,
  style?: any,
  /**
   * Space added it Toolbar to adapt to the StatusBar
   */
  statusBarHeight?: number,
  theme: Theme,
};

type DefaultProps = {
  statusBarHeight: number,
};

/**
 *  Toolbar is a generalization of action bars for use within application layouts.
 *
 * **Usage:**
 * ```
 * export default class MyComponent extends Component {
 *   render() {
 *     return (
 *       <Toolbar>
 *         <Toolbar.BackAction
 *           onPress={this._goBack}
 *         />
 *         <Toolbar.Content
 *           title="Title"
 *           subtitle="Subtitle"
 *         />
 *         <Toolbar.Action icon="search" onPress={this._onSearch} />
 *         <Toolbar.Action icon="more-vert" onPress={this._onMore} />
 *       <Toolbar>
 *     );
 *   }
 * }
 * ```
 */
class Toolbar extends Component<DefaultProps, Props, void> {
  static defaultProps = {
    statusBarHeight: Platform.OS === 'ios' ? 20 : 0,
  };

  static Content = ToolbarContent;
  static Action = ToolbarAction;
  static BackAction = ToolbarBackAction;

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

    const childrenArray = Children.toArray(children);
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
        {childrenArray.filter(child => child).map((child, i) => {
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
