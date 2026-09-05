import * as React from 'react';

type ToggleButtonRowContextType = {
  segmented: boolean;
};

export const ToggleButtonRowContext =
  React.createContext<ToggleButtonRowContextType | null>(null);
