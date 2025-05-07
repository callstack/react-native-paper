import * as React from 'react';

import { MD2Theme, MD3Theme } from 'react-native-paper';

export const PreferencesContext = React.createContext<{
  toggleShouldUseDeviceColors?: () => void;
  toggleTheme: () => void;
  toggleRtl: () => void;
  toggleThemeVersion: () => void;
  toggleCollapsed: () => void;
  toggleCustomFont: () => void;
  toggleRippleEffect: () => void;
  customFontLoaded: boolean;
  rippleEffectEnabled: boolean;
  collapsed: boolean;
  rtl: boolean;
  theme: MD2Theme | MD3Theme;
  shouldUseDeviceColors?: boolean;
} | null>(null);
