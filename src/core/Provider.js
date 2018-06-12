/* @flow */

import * as React from 'react';
import { ThemeProvider } from './theming';
import Portal from '../components/Portal/Portal';
import type { Theme } from '../types';

type Props = {
  children: React.Node,
  theme?: $Shape<Theme>,
};

export default class Provider extends React.Component<Props> {
  render() {
    return (
      <Portal.Host>
        <ThemeProvider theme={this.props.theme}>
          {this.props.children}
        </ThemeProvider>
      </Portal.Host>
    );
  }
}
