/* @flow */

import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import withTheme from '../../core/withTheme';
import Paper from '../Paper';
import ToolbarContent from './ToolbarContent';

class Toolbar extends Component {
  
  static defaultProps = {
    elevation: 4,
    translucent: Platform.OS === 'ios',
  };
  
  static Content = ToolbarContent;
  
  render() {
    const { children, elevation, theme, translucent } = this.props;
    const { colors } = theme;
    
    const toolbarStyle = {
      backgroundColor: colors.primary,
      // TODO make height orientation aware
      height: Platform.OS === 'ios' ? 44 : 56 + (translucent ? StatusBar.currentHeight : 0),
      paddingHorizontal: 16,
    };
    
    return (
      <Paper elevation={elevation} style={[ toolbarStyle ]}>
        <View style={[ styles.content, elevation && { paddingTop: StatusBar.currentHeight }]}>
          { children }
        </View>
      </Paper>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

export default withTheme(Toolbar);
