/* @flow */

import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, View } from 'react-native';

import withTheme from '../../core/withTheme';
import Paper from '../Paper';
import ToolbarContent from './ToolbarContent';
import ToolbarAction from './ToolbarAction';

import type { Theme } from '../../types/Theme';

type Props = {
  dark?: boolean,
  children?: any,
  style?: any,
  statusBarHeight?: number,
  theme: Theme,
};

type DefaultProps = {
  statusBarHeight: number,
};

class Toolbar extends Component<DefaultProps, Props, void> {
  static propTypes = {
    /**
     * Theme color for the whole toolbar, a dark toolbar will render light text and vice-versa
     * Child elements can override this prop independently
     */
    dark: PropTypes.bool,
    /**
     * Toolbar content
     */
    children: PropTypes.node.isRequired,
    style: View.propTypes.style,
    /**
     * Space added it Toolbar to adapt to the StatusBar
     */
    statusBarHeight: PropTypes.number,
    theme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    statusBarHeight: Platform.OS === 'ios' ? 20 : 0,
  };

  static Content = ToolbarContent;
  static Action = ToolbarAction;

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

    const toolbarHeight = Platform.OS === 'ios' ? 44 : 56;
    const flattenStyle = style ? StyleSheet.flatten(style) : {};
    const { height: heightProp, ...styleProp } = { ...flattenStyle };

    const toolbarStyle = {
      backgroundColor: colors.primary,
      // TODO make height orientation aware ???
      height: (heightProp || toolbarHeight) + statusBarHeight,
    };

    return (
      <Paper
        elevation={4}
        style={[
          toolbarStyle,
          { paddingTop: statusBarHeight },
          styles.toolbar,
          styleProp,
        ]}
        {...rest}
      >
        {Children.toArray(children).filter(child => child).map((child, i) => {
          const props: { dark: ?boolean, style?: any } = {
            dark:
              typeof child.props.dark === 'undefined' ? dark : child.props.dark,
          };

          if (child.type === ToolbarContent) {
            // Extra margin between left icon and ToolbarContent
            props.style = [
              { marginHorizontal: i === 0 ? 0 : 8 },
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
});

export default withTheme(Toolbar);
