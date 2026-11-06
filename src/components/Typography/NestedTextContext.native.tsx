import * as React from 'react';
import { unstable_TextAncestorContext } from 'react-native';

// Whether a text is rendered inside another text, so it can inherit its style.
// React Native's `Text` provides this context and its `View` resets it, so a
// text inside a `View` inside a text isn't nested, as React Native draws it.
export const useIsNestedText = () =>
  React.useContext(unstable_TextAncestorContext);

// React Native's `Text` already marks its children as nested
export const withNestedText = (
  element: React.ReactElement,
  _children: unknown
) => element;
