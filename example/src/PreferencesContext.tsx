import * as React from 'react';

import type { MD3Theme } from 'react-native-paper';

export const PreferencesContext = React.createContext<{
  toggleTheme: () => void;
  toggleRtl: () => void;
  toggleCollapsed: () => void;
  toggleCustomFont: () => void;
  toggleRippleEffect: () => void;
  toggleShouldUseDynamicTheme?: () => void;
  theme: MD3Theme;
  rtl: boolean;
  collapsed: boolean;
  customFontLoaded: boolean;
  rippleEffectEnabled: boolean;
  shouldUseDynamicTheme?: boolean;
} | null>(null);
