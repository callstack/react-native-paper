import * as React from 'react';

export type ListAccordionContextType = {
  /**
   * Whether the accordion renders a `left` element.
   */
  hasLeft: boolean;
};

export const ListAccordionContext =
  React.createContext<ListAccordionContextType>({ hasLeft: false });

ListAccordionContext.displayName = 'ListAccordionContext';
