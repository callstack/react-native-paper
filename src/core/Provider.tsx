/* @flow */

import * as React from 'react';
import { ThemeProvider } from './theming';
import PortalHost from '../components/Portal/PortalHost';
import { Theme } from '../types';

type Props = {
  children: React.ReactNode,
  theme?: Theme,
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
