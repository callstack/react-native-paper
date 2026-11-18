import * as React from 'react';

import type { Theme } from 'react-native-paper';

type ContrastLevel = 'standard' | 'medium' | 'high';

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
