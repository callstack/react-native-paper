/* @flow */

import React, {
  PureComponent,
  PropTypes,
  Children,
} from 'react';
import ThemeProvider from './ThemeProvider';
import PortalHost from '../components/Portal/PortalHost';
import type { Theme } from '../types/Theme';

type Props = {
  children?: any;
  theme?: Theme
}

export default class Provider extends PureComponent<void, Props, void> {
  static propTypes = {
    children: PropTypes.element.isRequired,
    theme: PropTypes.object,
  };

  render() {
    return (
      <PortalHost>
        <ThemeProvider theme={this.props.theme}>
          {Children.only(this.props.children)}
        </ThemeProvider>
      </PortalHost>
    );
  }
}
