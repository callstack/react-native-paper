/* @flow */

import * as React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import merge from 'deepmerge';
import ThemeProvider, { ThemeContext } from './ThemeProvider';
import type { Theme, ThemeShape } from '../types';

const REACT_METHODS = [
  'autobind',
  'childContextTypes',
  'componentDidMount',
  'componentDidUpdate',
  'componentWillMount',
  'componentWillReceiveProps',
  'componentWillUnmount',
  'componentWillUpdate',
  'contextTypes',
  'displayName',
  'getChildContext',
  'getDefaultProps',
  'getDOMNode',
  'getInitialState',
  'mixins',
  'propTypes',
  'render',
  'replaceProps',
  'setProps',
  'shouldComponentUpdate',
  'statics',
  'updateComponent',
];

const isClassComponent = (Component: any) =>
  Boolean(Component.prototype && Component.prototype.isReactComponent);

export default function withTheme<C: React.ComponentType<*>>(
  Comp: C
): C &
  React.ComponentType<
    $Diff<React.ElementConfig<C>, { theme: Theme }> & { theme?: ThemeShape }
  > {
  class ThemedComponent extends React.Component<*> {
    static displayName = `withTheme(${Comp.displayName || Comp.name})`;

    _previous: ?{ a: Theme, b: ?ThemeShape, result: Theme };
    _merge = (a: Theme, b: ?ThemeShape) => {
      const previous = this._previous;

      if (previous && previous.a === a && previous.b === b) {
        return previous.result;
      }

      const result = a && b ? merge(a, b) : a || b;

      this._previous = { a, b, result };

      return result;
    };

    _root: any;

    render() {
      return (
        <ThemeContext.Consumer>
          {theme => {
            const merged = this._merge(theme, this.props.theme);

            let element;

            if (isClassComponent(Comp)) {
              // Only add refs for class components as function components don't support them
              // It's needed to support use cases which need access to the underlying node
              element = (
                <Comp
                  {...this.props}
                  ref={c => {
                    this._root = c;
                  }}
                  theme={merged}
                />
              );
            } else {
              element = <Comp {...this.props} theme={merged} />;
            }

            if (merged !== this.props.theme) {
              // If a theme prop was passed, expose it to the children
              return <ThemeProvider theme={merged}>{element}</ThemeProvider>;
            }

            return element;
          }}
        </ThemeContext.Consumer>
      );
    }
  }

  if (isClassComponent(Comp)) {
    // getWrappedInstance is exposed by some HOCs like react-redux's connect
    // Use it to get the ref to the underlying element
    // Also expose it to access the underlying element after wrapping
    // $FlowFixMe
    ThemedComponent.prototype.getWrappedInstance = function getWrappedInstance() {
      return this._root.getWrappedInstance
        ? this._root.getWrappedInstance()
        : this._root;
    };

    // Copy non-private methods and properties from underlying component
    // This will take expose public methods and properties such as `focus`, `setNativeProps` etc.
    // $FlowFixMe
    Object.getOwnPropertyNames(Comp.prototype)
      .filter(
        prop =>
          !(
            REACT_METHODS.includes(prop) || // React specific methods and properties
            prop in React.Component.prototype || // Properties from React's prototype such as `setState`
            prop in ThemedComponent.prototype || // Properties from enhanced component's prototype
            // Private methods
            prop.startsWith('_')
          )
      )
      .forEach(prop => {
        // $FlowFixMe
        if (typeof Comp.prototype[prop] === 'function') {
          /* eslint-disable func-names */
          // $FlowFixMe
          ThemedComponent.prototype[prop] = function(...args) {
            // Make sure the function is called with correct context
            // $FlowFixMe
            Comp.prototype[prop].apply(this.getWrappedInstance(), args);
          };
        } else {
          // Copy properties as getters and setters
          // This make sure dynamic properties always stay up-to-date
          Object.defineProperty(ThemedComponent.prototype, prop, {
            get() {
              return this.getWrappedInstance()[prop];
            },
            set(value) {
              this.getWrappedInstance()[prop] = value;
            },
          });
        }
      });
  }

  hoistNonReactStatics(ThemedComponent, Comp);

  return (ThemedComponent: any);
}
