import * as React from 'react';

import { Theme } from 'react-native-paper';

export const PreferencesContext = React.createContext<{
  toggleTheme: () => void;
  toggleRtl: () => void;
  toggleCollapsed: () => void;
  toggleCustomFont: () => void;
  toggleRippleEffect: () => void;
  toggleShouldUseDeviceColors?: () => void;
  theme: Theme;
  rtl: boolean;
  collapsed: boolean;
  customFontLoaded: boolean;
  rippleEffectEnabled: boolean;
  shouldUseDeviceColors?: boolean;
} | null>(null);
