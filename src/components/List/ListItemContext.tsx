import * as React from 'react';
import type { ColorValue } from 'react-native';

export type ListItemContextType = {
  color: ColorValue;
  slot: 'leading' | 'trailing';
};

export const ListItemContext = React.createContext<ListItemContextType | null>(
  null
);
