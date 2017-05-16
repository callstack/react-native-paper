/* @flow */

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import Portal from './Portal';
import ThemeProvider from '../../core/ThemeProvider';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types/Theme';

type Props = {
  children?: any,
  theme: Theme,
};

/**
 * Themed portal is a special portal which preserves the theme in the context.
 */
class ThemedPortal extends Component<void, Props, void> {
  static propTypes = {
    children: PropTypes.element.isRequired,
    theme: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Portal {...this.props}>
        <ThemeProvider theme={this.props.theme}>
          {Children.only(this.props.children)}
        </ThemeProvider>
      </Portal>
    );
  }
}

export default withTheme(ThemedPortal);
