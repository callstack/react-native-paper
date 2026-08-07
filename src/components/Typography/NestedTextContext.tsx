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
