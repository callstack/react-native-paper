/* @flow */

import * as React from 'react';
import createReactContext, { type Context } from 'create-react-context';
import DefaultTheme from '../styles/DefaultTheme';
import type { Theme } from '../types';

type Props = {
  children: React.Node,
  theme: Theme,
};

export const ThemeContext: Context<Theme> = createReactContext(DefaultTheme);

export default class ThemeProvider extends React.Component<Props> {
  static defaultProps = {
    theme: DefaultTheme,
  };

  render() {
    return (
      <ThemeContext.Provider value={this.props.theme}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}
