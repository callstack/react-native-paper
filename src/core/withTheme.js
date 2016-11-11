/* @flow */

import React, {
  Component,
  PropTypes,
} from 'react';
import { theme } from './ThemeProvider';

export default function withTheme<T>(Comp: ReactClass<T>): ReactClass<T> {
  class ThemedComponent extends Component {
    static displayName = `withTheme(${Comp.displayName || Comp.name})`;
    static contextTypes = {
      [theme]: PropTypes.object,
    };

    _root: any;

    setNativeProps(...args) {
      return this._root.setNativeProps(...args);
    }

    render() {
      return (
        <Comp
          ref={c => (this._root = c)}
          theme={this.context[theme]}
          {...this.props}
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
