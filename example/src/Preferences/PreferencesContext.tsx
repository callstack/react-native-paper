import * as React from 'react';

import type { Theme } from 'react-native-paper';

export type Preferences = {
  toggleTheme: () => void;
  toggleRtl: () => void;
  toggleCustomFont: () => void;
  togglePreferences: () => void;
  toggleRippleEffect: () => void;
  toggleShouldUseDynamicTheme?: () => void;
  resetPreferences: () => void;
  theme: Theme;
  rtl: boolean;
  customFontLoaded: boolean;
  preferencesVisible: boolean;
  rippleEffectEnabled: boolean;
  shouldUseDynamicTheme?: boolean;
};

export const PreferencesContext = React.createContext<Preferences | null>(null);
