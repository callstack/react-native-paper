import * as React from 'react';

export type ListAccordionContextType = {
  /**
   * Whether descendant items that don't render their own `left`/`right`
   * element should be indented to align under the accordion's content
   * (past the leading icon).
   */
  leftIndent: boolean;
};

export const ListAccordionContext =
  React.createContext<ListAccordionContextType>({ leftIndent: false });

ListAccordionContext.displayName = 'ListAccordionContext';
