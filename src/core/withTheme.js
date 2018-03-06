/* @flow */

import * as React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import merge from 'deepmerge';
import ThemeProvider, { ThemeContext } from './ThemeProvider';
import type { Theme } from '../types';

const isClassComponent = (Component: Function) => !!Component.prototype.render;

export default function withTheme<Props: {}>(
  Comp: React.ComponentType<Props>
): React.ComponentType<
  $Diff<Props, { theme: Theme }> & { theme?: $Shape<Theme> }
> {
  class ThemedComponent extends React.Component<*> {
    /* $FlowFixMe */
    static displayName = `withTheme(${Comp.displayName || Comp.name})`;

    _previous: ?{ a: Theme, b: ?$Shape<Theme>, result: Theme };
    _merge = (a: Theme, b: ?$Shape<Theme>) => {
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

    // setNativeProps is used by Animated to set props on the native component
    /* $FlowFixMe */
    if (Comp.prototype.setNativeProps) {
      // $FlowFixMe
      ThemedComponent.prototype.setNativeProps = function setNativeProps(
        ...args
      ) {
        const root = this.getWrappedInstance();
        return root.setNativeProps(...args);
      };
    }
  }

  hoistNonReactStatics(ThemedComponent, Comp);

  return (ThemedComponent: any);
}
