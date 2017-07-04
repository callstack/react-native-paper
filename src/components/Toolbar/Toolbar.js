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
  backgroundColor?: string,
  children?: any,
  height?: number,
  style?: any,
  translucent?: boolean,
  theme: Theme,
};

type DefaultProps = {
  translucent: boolean,
};

class Toolbar extends Component<DefaultProps, Props, void> {
  static propTypes = {
    /**
     * Color used for the background
     */
    backgroundColor: PropTypes.string,
    /**
     * Toolbar content
     */
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]),
    /**
     * Toolbar height
     */
    height: PropTypes.number,
    style: View.propTypes.style,
    /**
     * Whether Toolbar needs to adapt to a translucent StatusBar or not
     */
    translucent: PropTypes.bool,
    theme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    translucent: Platform.OS === 'ios',
  };

  static Content = ToolbarContent;
  static Action = ToolbarAction;

  render() {
    const {
      backgroundColor,
      children,
      height,
      style,
      theme,
      translucent,
    } = this.props;
    const { colors } = theme;

    const toolbarHeight = Platform.OS === 'ios' ? 44 : 56;

    const toolbarStyle = {
      backgroundColor: backgroundColor || colors.primary,
      // TODO make height orientation aware ???
      height:
        (height || toolbarHeight) + (translucent ? StatusBar.currentHeight : 0),
    };

    return (
      <Paper
        elevation={4}
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
