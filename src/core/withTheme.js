/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { theme } from './ThemeProvider';
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
      [theme]: PropTypes.object,
    };

    constructor(props, context) {
      super(props, context);
      this.state = {
        theme: this._merge(context[theme], props.theme),
      };
    }

    state: State;

    componentDidMount() {
      if (typeof this.state.theme !== 'object' || this.state.theme === null) {
        throw new Error(
          "Couldn't find theme in the context or props. " +
            "You need to wrap your component in '<ThemeProvider />' or pass a 'theme' prop",
        );
      }
    }

    componentWillReceiveProps(nextProps, nextContext: any) {
      if (
        nextProps.theme !== this.props.theme ||
        nextContext[theme] !== this.context[theme]
      ) {
        this.setState({
          theme: this._merge(nextContext[theme], nextProps.theme),
        });
      }
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
