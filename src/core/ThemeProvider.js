/* @flow */

import {
  PureComponent,
  PropTypes,
  Children,
} from 'react';
import DefaultTheme from '../styles/DefaultTheme';
import type { Theme } from '../types/Theme';

type DefaultProps = {
  theme: Theme
}

type Props = {
  children?: any;
  theme?: Theme
}

export const theme = 'react-native-paper$theme';

export default class ThemeProvider extends PureComponent<DefaultProps, Props, void> {
  static propTypes = {
    children: PropTypes.element.isRequired,
    theme: PropTypes.object,
  };

  static defaultProps = {
    theme: DefaultTheme,
  };

  static childContextTypes = {
    [theme]: PropTypes.object,
  };

  getChildContext() {
    return {
      [theme]: this.props.theme,
    };
  }

  render() {
    return Children.only(this.props.children);
  }
}

