/* @flow */

import { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import DefaultTheme from '../styles/DefaultTheme';
import type { Theme } from '../types/Theme';

type DefaultProps = {
  theme: Theme,
};

type Props = {
  children?: any,
  theme?: Theme,
};

export const channel = 'react-native-paper$theme';

export default class ThemeProvider extends PureComponent<
  DefaultProps,
  Props,
  void
> {
  static propTypes = {
    children: PropTypes.element.isRequired,
    theme: PropTypes.object,
  };

  static defaultProps = {
    theme: DefaultTheme,
  };

  static childContextTypes = {
    [channel]: PropTypes.object,
  };

  getChildContext() {
    return {
      [channel]: {
        subscribe: this._subscribe,
        get: this._get,
      },
    };
  }

  componentWillReceiveProps(nextProps: *) {
    if (this.props.theme !== nextProps.theme) {
      this._subscriptions.forEach(cb => cb(nextProps.theme));
    }
  }

  _subscriptions = [];

  _subscribe = (callback: Theme => void) => {
    this._subscriptions.push(callback);

    const remove = () => {
      const index = this._subscriptions.indexOf(callback);
      if (index > -1) {
        this._subscriptions.splice(index, 1);
      }
    };

    return { remove };
  };

  _get = () => this.props.theme;

  render() {
    return Children.only(this.props.children);
  }
}
