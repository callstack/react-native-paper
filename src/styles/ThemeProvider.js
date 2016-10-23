// @flow

import {
  Component,
  PropTypes,
} from 'react';
import DefaultTheme from './DefaultTheme';


class ThemeProvider extends Component {

  static propTypes = {
    children: PropTypes.element,
    theme: PropTypes.object,
  };

  static childContextTypes = {
    theme: PropTypes.object,
  };

  getChildContext() {
    return {
      theme: this.props.theme || DefaultTheme(),
    };
  }

  render() {
    return this.props.children;
  }
}

export default ThemeProvider;
