/* @flow */

import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import withTheme from '../../core/withTheme';
import Paper from '../Paper';
import ToolbarContent from './ToolbarContent';
import ToolbarAction from './ToolbarAction';

import type { Theme } from '../../types/Theme';

type Props = {
  dark?: boolean,
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
    const { children, dark, style, theme, statusBarIsTranslucent } = this.props;
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
