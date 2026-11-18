import * as React from 'react';

// Whether a text is rendered inside another text, so it can inherit its style.
// React Native Web's `View` doesn't reset text inheritance, so this context
// isn't reset by a `View` either.
const NestedTextContext = React.createContext(false);

const canContainNestedText = (children: unknown) =>
  Array.isArray(children)
    ? children.some(
        (child: unknown) => child != null && typeof child === 'object'
      )
    : children != null && typeof children === 'object';

export const useIsNestedText = () => React.useContext(NestedTextContext);

export const markChildrenAsNested = (
  element: React.ReactElement,
  children: unknown
) =>
  canContainNestedText(children) ? (
    <NestedTextContext.Provider value={true}>
      {element}
    </NestedTextContext.Provider>
  ) : (
    element
  );
