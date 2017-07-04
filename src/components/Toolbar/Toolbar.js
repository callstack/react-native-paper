/* @flow */

import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import withTheme from '../../core/withTheme';
import Paper from '../Paper';
import ToolbarContent from './ToolbarContent';
import ToolbarAction from './ToolbarAction';

import type { Theme } from '../../types/Theme';

type Props = {
  children?: any,
  elevation?: number,
  translucent?: boolean,
  theme: Theme,
}

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
    const { children, elevation, theme, translucent } = this.props;
    const { colors } = theme;
    
    const toolbarStyle = {
      backgroundColor: colors.primary,
      // TODO make height orientation aware ???
      height: toolbarHeight + (translucent ? StatusBar.currentHeight : 0),
    };
    
    return (
      <Paper elevation={elevation} style={[ toolbarStyle, translucent && { paddingTop: StatusBar.currentHeight } ]}>
        <View style={[ styles.content ]}>
          { children }
        </View>
      </Paper>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    height: toolbarHeight,
    alignItems:'center',
    paddingHorizontal: 8,
  },
});

export default withTheme(Toolbar);
