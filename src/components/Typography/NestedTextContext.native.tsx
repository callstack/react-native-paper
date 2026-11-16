import * as React from 'react';
import { unstable_TextAncestorContext } from 'react-native';

export const useIsNestedText = () =>
  React.useContext(unstable_TextAncestorContext);

export const markChildrenAsNested = (
  element: React.ReactElement,
  _children: unknown
) => element;
