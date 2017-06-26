/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { channel } from './ThemeProvider';
import type { Theme } from '../types/Theme';

type State = {
  theme: Theme,
};

export default function withTheme<T: *>(Comp: ReactClass<T>): ReactClass<T> {
  class ThemedComponent extends PureComponent<void, *, State> {
    static displayName = `withTheme(${Comp.displayName || Comp.name})`;

    static propTypes = {
      theme: PropTypes.object,
    };

    static contextTypes = {
      [channel]: PropTypes.object,
    };

    constructor(props, context) {
      super(props, context);

      const theme = this.context[channel] && this.context[channel].get();

      if (typeof theme !== 'object' && typeof this.props.theme !== 'object') {
        throw new Error(
          `Couldn't find theme in the context or props. ` +
            `You need to wrap your component in '<ThemeProvider />' or pass a 'theme' prop`
        );
      }

      this.state = {
        theme: this._merge(theme, this.props.theme),
      };
    }

    state: State;

    componentDidMount() {
      this._subscription =
        this.context[channel] &&
        this.context[channel].subscribe(theme =>
          this.setState({ theme: this._merge(theme, this.props.theme) })
        );
    }

    componentWillReceiveProps(nextProps: *) {
      if (this.props.theme !== nextProps.theme) {
        this.setState({
          theme: this._merge(
            this.context[channel] && this.context[channel].get(),
            nextProps.theme
          ),
        });
      }
    }

    componentWillUnmount() {
      this._subscription && this._subscription.remove();
    }

    getWrappedInstance() {
      return this._root;
    }

    setNativeProps(...args) {
      return this._root.setNativeProps(...args);
    }

    _merge = (a, b) => {
      if (a && b) {
        return { ...a, ...b };
      } else {
        return a || b;
      }
    };

    _subscription: { remove: Function };
    _root: any;

    render() {
      return (
        <Comp
          {...this.props}
          ref={c => (this._root = c)}
          theme={this.state.theme}
        />
      );
    }
  }

  // This is ugly, but we need to hoist static properties manually
  for (const prop in Comp) {
    if (prop !== 'displayName' && prop !== 'contextTypes') {
      if (prop === 'propTypes') {
        // Only the underlying component will receive the theme prop
        // eslint-disable-next-line no-shadow, no-unused-vars
        const { theme, ...propTypes } = Comp[prop];
        /* $FlowFixMe */
        ThemedComponent[prop] = propTypes;
      } else {
        /* $FlowFixMe */
        ThemedComponent[prop] = Comp[prop];
      }
    }
  }

  return ThemedComponent;
}
