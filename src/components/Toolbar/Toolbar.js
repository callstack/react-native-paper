/* @flow */

import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import withTheme from '../../core/withTheme';
import Paper from '../Paper';
import ToolbarContent from './ToolbarContent';
import ToolbarAction from './ToolbarAction';

import type { Theme } from '../../types/Theme';

type Props = {
  backgroundColor?: string,
  children?: any,
  elevation?: number,
  height?: number,
  style?: any,
  translucent?: boolean,
  theme: Theme,
};

type DefaultProps = {
  elevation: number,
  translucent: boolean,
};

const toolbarHeight = Platform.OS === 'ios' ? 44 : 56;

class Toolbar extends Component<DefaultProps, Props, void> {
  static defaultProps = {
    elevation: 4,
    translucent: Platform.OS === 'ios',
  };

  static Content = ToolbarContent;
  static Action = ToolbarAction;

  render() {
    const {
      backgroundColor,
      children,
      elevation,
      height,
      style,
      theme,
      translucent,
    } = this.props;
    const { colors } = theme;

    const toolbarStyle = {
      backgroundColor: backgroundColor || colors.primary,
      // TODO make height orientation aware ???
      height: height ||
        toolbarHeight + (translucent ? StatusBar.currentHeight : 0),
    };

    return (
      <Paper
        elevation={elevation}
        style={[
          toolbarStyle,
          translucent && { paddingTop: StatusBar.currentHeight },
        ]}
      >
        <View
          style={[{ height: height || toolbarHeight }, styles.content, style]}
        >
          {children}
        </View>
      </Paper>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});

export default withTheme(Toolbar);
