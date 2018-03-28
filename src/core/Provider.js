/* @flow */

import * as React from 'react';
import ThemeProvider from './ThemeProvider';
import PortalHost from '../components/Portal/PortalHost';
import type { Theme } from '../types';

type Props = {
  children: React.Node,
  theme?: $Shape<Theme>,
};

export default class Provider extends React.Component<Props> {
  render() {
    return (
      <PortalHost>
        <ThemeProvider theme={this.props.theme}>
          {this.props.children}
        </ThemeProvider>
      </PortalHost>
    );
  }
}
