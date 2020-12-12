import {
  DefaultTheme,
} from 'react-native-paper';
import React from 'react';

type PreferencesContextType = {
  theme: Object;
  rtl: boolean;
  toggleTheme: () => void;
  toggleRTL: () => void;
};

export const PreferencesContext = React.createContext<PreferencesContextType>({
  rtl: false,
  theme: DefaultTheme,
  toggleTheme: () => {},
  toggleRTL: () => {},
});
