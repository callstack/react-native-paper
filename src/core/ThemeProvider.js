/* @flow */

import {
  Component,
  PropTypes,
  Children,
} from 'react';
import DefaultTheme from '../styles/DefaultTheme';

export const theme = 'react-native-paper$theme';

export default class ThemeProvider extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    theme: PropTypes.object,
  };

  static childContextTypes = {
    [theme]: PropTypes.object,
  };

  getChildContext() {
    return {
      [theme]: this.props.theme || DefaultTheme,
    };
  }

  render() {
    return Children.only(this.props.children);
  }
}

