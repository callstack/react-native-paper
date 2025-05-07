import * as React from 'react';

import { MD2Theme, MD3Theme } from 'react-native-paper';

export const PreferencesContext = React.createContext<{
  toggleTheme: () => void;
  toggleRtl: () => void;
  toggleThemeVersion: () => void;
  toggleCollapsed: () => void;
  toggleCustomFont: () => void;
  toggleRippleEffect: () => void;
  toggleShouldUseDeviceColors?: () => void;
  theme: MD2Theme | MD3Theme;
  rtl: boolean;
  collapsed: boolean;
  customFontLoaded: boolean;
  rippleEffectEnabled: boolean;
  shouldUseDeviceColors?: boolean;
} | null>(null);
