import * as React from 'react';

import type { MD2Theme, MD3Theme } from 'react-native-paper';

const PreferencesContext = React.createContext<{
  toggleShouldUseDeviceColors?: () => void;
  toggleTheme: () => void;
  toggleRTL: () => void;
  toggleThemeVersion: () => void;
  toggleCollapsed: () => void;
  toggleCustomFont: () => void;
  toggleRippleEffect: () => void;
  customFontLoaded: boolean;
  rippleEffectEnabled: boolean;
  collapsed: boolean;
  isRTL: boolean;
  theme: MD2Theme | MD3Theme;
  shouldUseDeviceColors?: boolean;
} | null>(null);

export const usePreferences = () => {
  const context = React.useContext(PreferencesContext);

  if (!context) {
    throw new Error('Context required');
  }

  return context;
};

export default PreferencesContext;
