/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import withTheme from '../../core/withTheme';
import Paper from '../Paper';
import ToolbarContent from './ToolbarContent';
import ToolbarAction from './ToolbarAction';

import type { Theme } from '../../types/Theme';

type Props = {
  children?: any,
  style?: any,
  statusBarIsTranslucent?: boolean,
  theme: Theme,
};

type DefaultProps = {
  statusBarIsTranslucent: boolean,
};

class Toolbar extends Component<DefaultProps, Props, void> {
  static propTypes = {
    /**
     * Toolbar content
     */
    children: PropTypes.node.isRequired,
    style: View.propTypes.style,
    /**
     * Whether Toolbar needs to adapt to a statusBarIsTranslucent StatusBar or not
     */
    statusBarIsTranslucent: PropTypes.bool,
    theme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    statusBarIsTranslucent: Platform.OS === 'ios',
  };

  static Content = ToolbarContent;
  static Action = ToolbarAction;

  render() {
    const { children, style, theme, statusBarIsTranslucent } = this.props;
    const { colors } = theme;

    const toolbarHeight = Platform.OS === 'ios' ? 44 : 56;
    const statusBarHeight =
      Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

    const toolbarStyle = {
      backgroundColor: (style && style.backgroundColor) || colors.primary,
      // TODO make height orientation aware ???
      height:
        ((style && style.height) || toolbarHeight) +
        (statusBarIsTranslucent ? statusBarHeight : 0),
    };

    return (
      <Paper
        elevation={4}
        style={[
          toolbarStyle,
          statusBarIsTranslucent && { paddingTop: statusBarHeight },
          styles.toolbar,
        ]}
      >
        {children}
      </Paper>
    );
  }
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'ios' ? 0 : 6,
  },
});

export default withTheme(Toolbar);
