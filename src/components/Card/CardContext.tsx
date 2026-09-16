import * as React from 'react';

type CardContextType = {
  /**
   * Padding applied to the Card content.
   */
  padding: number;
  /**
   * Direction of the Card layout.
   */
  direction: 'vertical' | 'horizontal';
};

export const CardContext = React.createContext<CardContextType | null>(null);

CardContext.displayName = 'CardContext';
