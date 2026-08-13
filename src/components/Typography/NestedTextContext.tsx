import * as React from 'react';

/**
 * Tells a `Text` or `AnimatedText` that it is rendered inside another one.
 *
 * React Native's `Text` inherits the resolved style of an enclosing `Text`, so a
 * nested one only has to declare what it wants to change. Applying the default
 * font here regardless would overwrite everything it should have inherited, so a
 * nested component without a `variant` leaves those properties unset instead.
 *
 * Lives in its own module because `Text` renders `AnimatedText` in its nesting
 * checks, so importing the context from either of them would form a cycle.
 */
export const NestedTextContext = React.createContext(false);

/**
 * Whether `children` can hold a nested `Text`, so that the provider above is
 * only rendered when something is there to consume it.
 *
 * Mirrors the check React Native runs before wrapping its own text ancestor
 * context, down to the array cutoff. The point of the check is to save the
 * provider's overhead, so it has to stay cheaper than what it saves: three
 * children covers the common cases without walking a long list on every render.
 *
 * Takes `unknown` rather than `ReactNode` because `AnimatedText` widens its
 * `children` with animated values, and this check only looks at the shape.
 */
export const canContainNestedText = (children: unknown) => {
  if (children == null) {
    return false;
  }

  if (Array.isArray(children) && children.length <= 3) {
    return children.some(
      (child: unknown) => child != null && typeof child === 'object'
    );
  }

  // Anything longer is assumed to contain an element, since an array is an
  // object itself.
  return typeof children === 'object';
};
