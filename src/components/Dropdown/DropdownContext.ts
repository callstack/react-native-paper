import { createContext } from 'react';

export interface DropdownContextData {
  onChange?: (value: string) => void;
}

const DropdownContext = createContext<DropdownContextData>({});

export default DropdownContext;
