import * as React from 'react';

import { MD3Theme } from 'react-native-paper';

export const PreferencesContext = React.createContext<{
  toggleTheme: () => void;
  toggleRtl: () => void;
  toggleCollapsed: () => void;
  toggleCustomFont: () => void;
  toggleRippleEffect: () => void;
  toggleShouldUseDeviceColors?: () => void;
  theme: MD3Theme;
  rtl: boolean;
  collapsed: boolean;
  customFontLoaded: boolean;
  rippleEffectEnabled: boolean;
  shouldUseDeviceColors?: boolean;
} | null>(null);
