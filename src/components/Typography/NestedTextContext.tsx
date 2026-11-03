import * as React from 'react';

// Whether a text is rendered inside another text, so it can inherit its style
export const NestedTextContext = React.createContext(false);

export const canContainNestedText = (children: unknown) =>
  Array.isArray(children)
    ? children.some(
        (child: unknown) => child != null && typeof child === 'object'
      )
    : children != null && typeof children === 'object';
