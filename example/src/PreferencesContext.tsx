import * as React from 'react';

import type { ContrastLevel, Theme } from 'react-native-paper';

export const PreferencesContext = React.createContext<{
  toggleTheme: () => void;
  toggleRtl: () => void;
  toggleCollapsed: () => void;
  toggleCustomFont: () => void;
  toggleRippleEffect: () => void;
  toggleShouldUseDynamicTheme?: () => void;
  setContrast: (contrast: ContrastLevel) => void;
  theme: Theme;
  contrast: ContrastLevel;
  rtl: boolean;
  collapsed: boolean;
  customFontLoaded: boolean;
  rippleEffectEnabled: boolean;
  shouldUseDynamicTheme?: boolean;
} | null>(null);
